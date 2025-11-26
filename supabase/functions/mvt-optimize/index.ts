import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MVTRequest {
  test_name: string;
  intent?: string;
  session_id?: string;
}

interface VariantStats {
  variant_id: string;
  sessions: number;
  conversions: number;
  conversion_rate: number;
}

interface MVTResponse {
  variant_id: string;
  confidence: number;
  winner_declared: boolean;
  total_variants: number;
  stats: Record<string, VariantStats>;
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

// Thompson Sampling for N variants
function selectBestVariant(variants: VariantStats[]): string {
  const samples = variants.map(v => ({
    variant_id: v.variant_id,
    sample: betaSample(v.conversions + 1, v.sessions - v.conversions + 1)
  }));
  
  return samples.reduce((best, current) => 
    current.sample > best.sample ? current : best
  ).variant_id;
}

// Calculate confidence and determine winner
function calculateMVTConfidence(
  variants: VariantStats[], 
  simulations = 10000
): { winner: string; confidence: number } {
  const winCounts: Record<string, number> = {};
  variants.forEach(v => winCounts[v.variant_id] = 0);
  
  for (let i = 0; i < simulations; i++) {
    const sampleValues = variants.map(v => ({
      variant_id: v.variant_id,
      sample: betaSample(v.conversions + 1, v.sessions - v.conversions + 1)
    }));
    
    const winner = sampleValues.reduce((best, curr) => 
      curr.sample > best.sample ? curr : best
    );
    
    winCounts[winner.variant_id]++;
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { test_name, intent = 'default', session_id } = await req.json() as MVTRequest;

    console.log('MVT Optimize request:', { test_name, intent, session_id });

    // Get test configuration
    const { data: config, error: configError } = await supabase
      .from('mvt_test_config')
      .select('*')
      .eq('test_name', test_name)
      .eq('is_active', true)
      .single();

    if (configError || !config) {
      console.error('Test config not found:', configError);
      // Fallback to binary A/B test
      const fallbackVariants = ['A', 'B'];
      const randomVariant = fallbackVariants[Math.floor(Math.random() * fallbackVariants.length)];
      
      return new Response(
        JSON.stringify({
          variant_id: randomVariant,
          confidence: 0.5,
          winner_declared: false,
          total_variants: 2,
          stats: {}
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const variants = config.variants as string[];
    const explorationThreshold = config.exploration_sessions_per_variant * variants.length;
    const confidenceThreshold = config.confidence_threshold;

    // Check if winner already declared
    if (config.winner_variant) {
      console.log('Winner already declared:', config.winner_variant);
      
      // Get current stats for response
      const { data: statsData } = await supabase
        .from('ab_test_stats')
        .select('variant_id, sessions_count, conversions_count')
        .eq('test_name', test_name)
        .eq('intent', intent);

      const statsMap: Record<string, VariantStats> = {};
      statsData?.forEach(s => {
        statsMap[s.variant_id] = {
          variant_id: s.variant_id,
          sessions: s.sessions_count || 0,
          conversions: s.conversions_count || 0,
          conversion_rate: s.sessions_count > 0 ? (s.conversions_count || 0) / s.sessions_count : 0
        };
      });

      return new Response(
        JSON.stringify({
          variant_id: config.winner_variant,
          confidence: 1.0,
          winner_declared: true,
          total_variants: variants.length,
          stats: statsMap
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch current stats for all variants
    const { data: statsData, error: statsError } = await supabase
      .from('ab_test_stats')
      .select('variant_id, sessions_count, conversions_count')
      .eq('test_name', test_name)
      .eq('intent', intent);

    if (statsError) {
      console.error('Error fetching stats:', statsError);
    }

    // Initialize stats map with all configured variants
    const statsMap: Record<string, VariantStats> = {};
    variants.forEach(variantId => {
      statsMap[variantId] = {
        variant_id: variantId,
        sessions: 0,
        conversions: 0,
        conversion_rate: 0
      };
    });

    // Update with actual data
    statsData?.forEach(s => {
      if (variants.includes(s.variant_id)) {
        statsMap[s.variant_id] = {
          variant_id: s.variant_id,
          sessions: s.sessions_count || 0,
          conversions: s.conversions_count || 0,
          conversion_rate: s.sessions_count > 0 ? (s.conversions_count || 0) / s.sessions_count : 0
        };
      }
    });

    const totalSessions = Object.values(statsMap).reduce((sum, s) => sum + s.sessions, 0);

    let selectedVariant: string;
    let confidence = 0.5;
    let winnerDeclared = false;

    // Exploration phase: uniform distribution
    if (totalSessions < explorationThreshold) {
      console.log('Exploration phase:', totalSessions, '/', explorationThreshold);
      selectedVariant = variants[Math.floor(Math.random() * variants.length)];
    } 
    // Exploitation phase: Thompson Sampling
    else {
      console.log('Exploitation phase with Thompson Sampling');
      const variantStats = Object.values(statsMap);
      
      // Calculate confidence and check for winner
      const { winner, confidence: winnerConfidence } = calculateMVTConfidence(variantStats);
      confidence = winnerConfidence;

      if (confidence >= confidenceThreshold) {
        console.log('Winner declared:', winner, 'with confidence:', confidence);
        selectedVariant = winner;
        winnerDeclared = true;

        // Update config with winner
        await supabase
          .from('mvt_test_config')
          .update({ winner_variant: winner })
          .eq('test_name', test_name);
      } else {
        // Use Thompson Sampling to select variant
        selectedVariant = selectBestVariant(variantStats);
      }
    }

    // Increment session count for selected variant
    await supabase.rpc('increment_ab_session', {
      p_test_name: test_name,
      p_intent: intent,
      p_variant_id: selectedVariant
    });

    const response: MVTResponse = {
      variant_id: selectedVariant,
      confidence,
      winner_declared: winnerDeclared,
      total_variants: variants.length,
      stats: statsMap
    };

    console.log('MVT response:', response);

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in mvt-optimize:', error);
    
    // Fallback to random variant
    const fallbackVariant = Math.random() < 0.5 ? 'A' : 'B';
    return new Response(
      JSON.stringify({
        variant_id: fallbackVariant,
        confidence: 0.5,
        winner_declared: false,
        total_variants: 2,
        stats: {}
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
