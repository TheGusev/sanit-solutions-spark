import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { getCorsHeaders } from '../_shared/cors.ts';

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_PREDICTIONS_PER_WINDOW = 20; // max predictions per session per minute

// In-memory cache for rate limits
const rateLimitCacheRL = new Map<string, { count: number; windowStart: number }>();

// Check rate limit
function checkRateLimit(sessionId: string): boolean {
  const now = Date.now();
  const entry = rateLimitCacheRL.get(sessionId);
  
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitCacheRL.set(sessionId, { count: 1, windowStart: now });
    return true;
  }
  
  if (entry.count >= MAX_PREDICTIONS_PER_WINDOW) {
    return false;
  }
  
  entry.count++;
  return true;
}

interface PredictRequest {
  session_id: string;
  intent: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  device_type: string;
  referrer?: string;
  scroll_depth?: number;
  calc_opened?: boolean;
  time_on_page?: number;
}

interface PredictResponse {
  p_conv: number;        // 0..1
  segment: 'low' | 'mid' | 'high';
  model_version: string;
}

// In-memory cache for predictions (5 min TTL)
const predictionCache = new Map<string, { prediction: PredictResponse; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ML Provider interface
interface MLProvider {
  predict(data: PredictRequest): Promise<PredictResponse>;
}

// Lovable AI Provider - uses AI for conversion prediction
class LovableAIProvider implements MLProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async predict(data: PredictRequest): Promise<PredictResponse> {
    const prompt = `Analyze this user session data and predict conversion probability for a disinfection/pest control service website:

Session Data:
- Intent: ${data.intent || 'default'}
- UTM Source: ${data.utm_source || 'none'}
- UTM Medium: ${data.utm_medium || 'none'}
- UTM Campaign: ${data.utm_campaign || 'none'}
- Device: ${data.device_type}
- Calculator opened: ${data.calc_opened ? 'yes' : 'no'}
- Scroll depth: ${data.scroll_depth || 0}
- Time on page: ${data.time_on_page || 0} seconds

Consider:
1. Intent quality (specific pest problem > generic interest)
2. UTM source (paid traffic > organic)
3. Engagement signals (calculator use, scroll, time)
4. Device type (desktop slightly higher conversion)

Predict conversion probability from 0.0 to 1.0.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an ML model specialized in conversion prediction for service-based websites. Respond with structured JSON only.' },
          { role: 'user', content: prompt }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'predict_conversion',
            description: 'Predict user conversion probability based on session data',
            parameters: {
              type: 'object',
              properties: {
                p_conv: { 
                  type: 'number', 
                  minimum: 0.0, 
                  maximum: 1.0,
                  description: 'Conversion probability from 0.0 to 1.0'
                },
                reasoning: { 
                  type: 'string',
                  description: 'Brief explanation of the prediction'
                }
              },
              required: ['p_conv', 'reasoning'],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'predict_conversion' } }
      }),
    });

    if (!response.ok) {
      throw new Error(`Lovable AI API error: ${response.status}`);
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error('No tool call in AI response');
    }

    const prediction = JSON.parse(toolCall.function.arguments);
    const p_conv = Math.max(0.05, Math.min(0.85, prediction.p_conv));

    console.log(`✅ Lovable AI prediction: p_conv=${p_conv.toFixed(2)}, reasoning=${prediction.reasoning}`);

    return {
      p_conv: Math.round(p_conv * 100) / 100,
      segment: p_conv < 0.2 ? 'low' : p_conv < 0.5 ? 'mid' : 'high',
      model_version: 'lovable_ai_v1.0'
    };
  }
}

// Rule-based fallback provider
class RuleBasedProvider implements MLProvider {
  async predict(data: PredictRequest): Promise<PredictResponse> {
    let p_conv = 0.15;

    if (data.intent && data.intent !== 'default') {
      p_conv += 0.12;
    }

    if (data.intent?.includes('ses_check')) {
      p_conv += 0.08;
    }

    if (data.utm_source === 'yandex' || data.utm_source === 'google') {
      p_conv += 0.06;
    }

    if (data.utm_medium === 'cpc') {
      p_conv += 0.05;
    }

    if (data.device_type === 'desktop') {
      p_conv += 0.04;
    }

    if (data.calc_opened) {
      p_conv += 0.18;
    }

    if (data.scroll_depth && data.scroll_depth > 0.5) {
      p_conv += 0.08;
    }

    if (data.time_on_page && data.time_on_page > 60) {
      p_conv += 0.06;
    }

    const noise = (Math.random() - 0.5) * 0.08;
    p_conv += noise;
    p_conv = Math.max(0.05, Math.min(0.85, p_conv));

    return {
      p_conv: Math.round(p_conv * 100) / 100,
      segment: p_conv < 0.2 ? 'low' : p_conv < 0.5 ? 'mid' : 'high',
      model_version: 'rule_based_v1.0'
    };
  }
}

// Get ML provider based on configuration
function getMLProvider(): MLProvider {
  const mlProvider = Deno.env.get('ML_PROVIDER') || 'lovable_ai';
  const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

  console.log(`🔧 Using ML provider: ${mlProvider}`);

  switch (mlProvider) {
    case 'lovable_ai':
      if (!lovableApiKey) {
        console.warn('⚠️ LOVABLE_API_KEY not found, falling back to rule-based');
        return new RuleBasedProvider();
      }
      return new LovableAIProvider(lovableApiKey);
    
    case 'stub':
    case 'rule_based':
    default:
      return new RuleBasedProvider();
  }
}

// Main prediction function with caching
async function predictConversion(data: PredictRequest): Promise<PredictResponse> {
  // Check cache
  const cacheKey = `${data.session_id}_${data.calc_opened || false}`;
  const cached = predictionCache.get(cacheKey);
  
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
    console.log(`📦 Cache hit for session ${data.session_id}`);
    return cached.prediction;
  }

  // Get provider and predict
  const provider = getMLProvider();
  
  try {
    const prediction = await provider.predict(data);
    
    // Cache the result
    predictionCache.set(cacheKey, {
      prediction,
      timestamp: Date.now()
    });

    return prediction;
  } catch (error) {
    console.error('❌ ML prediction failed, using rule-based fallback:', error);
    const fallback = new RuleBasedProvider();
    return await fallback.predict(data);
  }
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: PredictRequest = await req.json();

    // Rate limit check (before validation to prevent abuse)
    if (requestData.session_id && !checkRateLimit(requestData.session_id)) {
      console.log(`⚠️ Rate limit exceeded for session ${requestData.session_id}`);
      return new Response(
        JSON.stringify({ 
          error: "rate_limit_exceeded",
          p_conv: 0.25,
          segment: 'mid',
          model_version: 'rate_limited'
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Валидация обязательных полей
    if (!requestData.session_id || !requestData.device_type) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields: session_id, device_type" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Получаем предсказание (async now)
    const prediction = await predictConversion(requestData);

    console.log(`✅ ML prediction: session=${requestData.session_id}, p_conv=${prediction.p_conv}, segment=${prediction.segment}, model=${prediction.model_version}`);

    return new Response(
      JSON.stringify(prediction),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("❌ ML predict error:", error);
    const origin = req.headers.get("origin");
    const corsHeaders = getCorsHeaders(origin);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        // Возвращаем fallback даже при ошибке
        p_conv: 0.25,
        segment: 'mid',
        model_version: 'fallback'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
