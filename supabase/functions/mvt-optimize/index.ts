import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_MVT_REQUESTS_PER_WINDOW = 20; // max MVT requests per session per minute

// In-memory cache for rate limits
const rateLimitCache = new Map<string, { count: number; windowStart: number }>();

// Check rate limit
function checkRateLimit(sessionId: string): boolean {
  const now = Date.now();
  const entry = rateLimitCache.get(sessionId);
  
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitCache.set(sessionId, { count: 1, windowStart: now });
    return true;
  }
  
  if (entry.count >= MAX_MVT_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  entry.count++;
  return true;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MVTRequest {
  test_name: string;
  intent?: string;
  session_id?: string;
  device_type?: string;
  utm_source?: string;
}

interface ArmParams {
  variant_key: string;
  alpha: number;
  beta: number;
  impressions_count: number;
  conversions_count: number;
}

interface MVTResponse {
  variant_id: string;
  confidence: number;
  winner_declared: boolean;
  total_variants: number;
  stats: Record<string, {
    variant_id: string;
    sessions: number;
    conversions: number;
    conversion_rate: number;
  }>;
  arm_key?: string;
  sampled_theta?: number;
}

// Beta distribution sampling using Gamma distribution
function betaSample(alpha: number, beta: number): number {
  const x = gammaRandom(alpha);
  const y = gammaRandom(beta);
  return x / (x + y);
}

// Gamma random variable generator
function gammaRandom(shape: number): number {
  if (shape < 1) {
    return gammaRandom(shape + 1) * Math.pow(Math.random(), 1 / shape);
  }
  
  const d = shape - 1/3;
  const c = 1 / Math.sqrt(9 * d);
  
  while (true) {
    let x, v;
    do {
      x = normalRandom();
      v = 1 + c * x;
    } while (v <= 0);
    
    v = v * v * v;
    const u = Math.random();
    const x_squared = x * x;
    
    if (u < 1 - 0.0331 * x_squared * x_squared) {
      return d * v;
    }
    if (Math.log(u) < 0.5 * x_squared + d * (1 - v + Math.log(v))) {
      return d * v;
    }
  }
}

// Standard normal random variable (Box-Muller)
function normalRandom(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

// Thompson Sampling for N variants with explicit α,β
function selectBestVariant(variants: ArmParams[]): { variant_key: string; theta: number } {
  const samples = variants.map(v => ({
    variant_key: v.variant_key,
    theta: betaSample(v.alpha, v.beta)
  }));
  
  return samples.reduce((best, current) => 
    current.theta > best.theta ? current : best
  );
}

// Calculate confidence through Monte Carlo simulations
function calculateMVTConfidence(
  variants: ArmParams[], 
  simulations = 10000
): { winner: string; confidence: number } {
  const winCounts: Record<string, number> = {};
  variants.forEach(v => winCounts[v.variant_key] = 0);
  
  for (let i = 0; i < simulations; i++) {
    const sampleValues = variants.map(v => ({
      variant_key: v.variant_key,
      theta: betaSample(v.alpha, v.beta)
    }));
    
    const winner = sampleValues.reduce((best, curr) => 
      curr.theta > best.theta ? curr : best
    );
    
    winCounts[winner.variant_key]++;
  }
  
  const entries = Object.entries(winCounts);
  const [bestVariant, bestCount] = entries.reduce((a, b) => 
    b[1] > a[1] ? b : a
  );
  
  return {
    winner: bestVariant,
    confidence: bestCount / simulations
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { test_name, intent, session_id, device_type, utm_source }: MVTRequest = await req.json();

    // Rate limit check
    if (session_id && !checkRateLimit(session_id)) {
      console.log(`⚠️ Rate limit exceeded for session ${session_id}`);
      return new Response(
        JSON.stringify({
          variant_id: 'A',
          confidence: 0.5,
          winner_declared: false,
          total_variants: 2,
          stats: {},
          error: 'rate_limit_exceeded'
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const intentKey = intent || 'default';

    console.log('MVT Optimize request:', { test_name, intent: intentKey, session_id });

    // 1. Get test configuration
    const { data: testConfig, error: configError } = await supabase
      .from('mvt_test_config')
      .select('*')
      .eq('test_name', test_name)
      .eq('is_active', true)
      .single();

    if (configError || !testConfig) {
      console.log('No test config found, using fallback');
      return new Response(
        JSON.stringify({
          variant_id: 'A',
          confidence: 0.5,
          winner_declared: false,
          total_variants: 2,
          stats: {}
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Get arm parameters from mvt_arm_params table (explicit α,β)
    const variants = testConfig.variants as string[];
    const { data: armParams, error: paramsError } = await supabase
      .from('mvt_arm_params')
      .select('*')
      .eq('test_name', test_name)
      .eq('intent', intentKey);

    if (paramsError) {
      console.error('Error fetching arm params:', paramsError);
    }

    // 3. Build complete variants list with α,β parameters
    const variantParams: ArmParams[] = variants.map(variantId => {
      const existing = armParams?.find(p => p.variant_key === variantId);
      return {
        variant_key: variantId,
        alpha: existing?.alpha || 1,
        beta: existing?.beta || 1,
        impressions_count: existing?.impressions_count || 0,
        conversions_count: existing?.conversions_count || 0
      };
    });

    const totalImpressions = variantParams.reduce((sum, v) => sum + v.impressions_count, 0);
    const explorationThreshold = (testConfig.exploration_sessions_per_variant || 50) * variants.length;

    let selectedVariant: string;
    let sampledTheta: number;

    // 4. Exploration vs Exploitation phase
    if (totalImpressions < explorationThreshold) {
      // Exploration: random uniform distribution
      selectedVariant = variants[Math.floor(Math.random() * variants.length)];
      sampledTheta = 0.5;
      console.log(`Exploration phase: ${totalImpressions} / ${explorationThreshold}`);
    } else {
      // Exploitation: Thompson Sampling with explicit α,β
      const result = selectBestVariant(variantParams);
      selectedVariant = result.variant_key;
      sampledTheta = result.theta;
      console.log(`Exploitation phase: selected ${selectedVariant} with θ=${sampledTheta.toFixed(4)}`);
    }

    // 5. Log impression to mvt_impressions table
    if (session_id) {
      const { error: impressionError } = await supabase
        .from('mvt_impressions')
        .insert({
          session_id,
          test_name,
          intent: intentKey,
          variant_key: selectedVariant,
          device_type,
          utm_source,
          sampled_theta: sampledTheta
        });

      if (impressionError) {
        console.error('Error logging impression:', impressionError);
      }
    }

    // 6. Increment impressions_count for selected arm
    const { error: incrementError } = await supabase.rpc('increment_arm_impressions', {
      p_test_name: test_name,
      p_intent: intentKey,
      p_variant_key: selectedVariant
    });

    if (incrementError) {
      console.error('Error incrementing impressions:', incrementError);
    }

    // 7. Calculate confidence and check for winner
    const { winner, confidence } = calculateMVTConfidence(variantParams);
    const confidenceThreshold = testConfig.confidence_threshold || 0.95;
    let winnerDeclared = false;

    if (confidence >= confidenceThreshold && totalImpressions >= explorationThreshold) {
      if (!testConfig.winner_variant) {
        await supabase
          .from('mvt_test_config')
          .update({ winner_variant: winner })
          .eq('id', testConfig.id);
        
        console.log(`Winner declared: ${winner} with ${(confidence * 100).toFixed(1)}% confidence`);
      }
      winnerDeclared = true;
      selectedVariant = winner; // Always show winner if declared
    }

    // 8. Build stats response
    const stats: Record<string, any> = {};
    variantParams.forEach(v => {
      stats[v.variant_key] = {
        variant_id: v.variant_key,
        sessions: v.impressions_count,
        conversions: v.conversions_count,
        conversion_rate: v.impressions_count > 0 
          ? v.conversions_count / v.impressions_count 
          : 0
      };
    });

    const response: MVTResponse = {
      variant_id: selectedVariant,
      confidence,
      winner_declared: winnerDeclared,
      total_variants: variants.length,
      stats,
      arm_key: selectedVariant,
      sampled_theta: sampledTheta
    };

    console.log('MVT response:', response);

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('MVT optimize error:', error);
    return new Response(
      JSON.stringify({
        variant_id: 'A',
        confidence: 0.5,
        winner_declared: false,
        total_variants: 2,
        stats: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
