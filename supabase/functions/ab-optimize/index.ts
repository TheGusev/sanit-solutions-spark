import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ABRequest {
  test_name: string;
  intent?: string;
  session_id?: string;
}

interface ABStats {
  sessions: number;
  conversions: number;
  conversion_rate: number;
}

interface ABResponse {
  variant_id: 'A' | 'B';
  confidence: number;
  winner_declared: boolean;
  stats: {
    A: ABStats;
    B: ABStats;
  };
}

// Beta distribution sampling using rejection sampling
function betaSample(alpha: number, beta: number): number {
  // Simple approximation using two gamma distributions
  const gammaA = gammaRandom(alpha);
  const gammaB = gammaRandom(beta);
  return gammaA / (gammaA + gammaB);
}

// Gamma random variable using Marsaglia and Tsang method
function gammaRandom(shape: number): number {
  if (shape < 1) {
    return gammaRandom(shape + 1) * Math.pow(Math.random(), 1 / shape);
  }
  
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  
  while (true) {
    let x, v;
    do {
      x = normalRandom();
      v = 1 + c * x;
    } while (v <= 0);
    
    v = v * v * v;
    const u = Math.random();
    
    if (u < 1 - 0.0331 * x * x * x * x) {
      return d * v;
    }
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) {
      return d * v;
    }
  }
}

// Standard normal random variable using Box-Muller transform
function normalRandom(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

// Calculate probability that variant A is better than variant B
function calculateConfidence(
  conversionsA: number,
  sessionsA: number,
  conversionsB: number,
  sessionsB: number,
  samples = 10000
): number {
  let countABetter = 0;
  
  for (let i = 0; i < samples; i++) {
    const sampleA = betaSample(conversionsA + 1, sessionsA - conversionsA + 1);
    const sampleB = betaSample(conversionsB + 1, sessionsB - conversionsB + 1);
    
    if (sampleA > sampleB) {
      countABetter++;
    }
  }
  
  return countABetter / samples;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { test_name, intent = 'default', session_id }: ABRequest = await req.json();
    
    if (!test_name) {
      throw new Error("test_name is required");
    }
    
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );
    
    // Получаем статистику для обоих вариантов
    const { data: stats, error } = await supabase
      .from("ab_test_stats")
      .select("*")
      .eq("test_name", test_name)
      .eq("intent", intent)
      .in("variant_id", ["A", "B"]);
    
    if (error) {
      console.error("Database error:", error);
      throw error;
    }
    
    // Инициализируем статистику если данных нет
    const statsA = stats?.find(s => s.variant_id === 'A') || { sessions_count: 0, conversions_count: 0 };
    const statsB = stats?.find(s => s.variant_id === 'B') || { sessions_count: 0, conversions_count: 0 };
    
    const totalSessions = statsA.sessions_count + statsB.sessions_count;
    
    // EXPLORATION PHASE: первые 100 сессий - 50/50 случайный выбор
    if (totalSessions < 100) {
      const variantId: 'A' | 'B' = Math.random() < 0.5 ? 'A' : 'B';
      
      // Инкрементируем счётчик сессий
      if (session_id) {
        await supabase.rpc('increment_ab_session', {
          p_test_name: test_name,
          p_intent: intent,
          p_variant_id: variantId
        });
      }
      
      const response: ABResponse = {
        variant_id: variantId,
        confidence: 0.5,
        winner_declared: false,
        stats: {
          A: {
            sessions: statsA.sessions_count,
            conversions: statsA.conversions_count,
            conversion_rate: statsA.sessions_count > 0 ? statsA.conversions_count / statsA.sessions_count : 0
          },
          B: {
            sessions: statsB.sessions_count,
            conversions: statsB.conversions_count,
            conversion_rate: statsB.sessions_count > 0 ? statsB.conversions_count / statsB.sessions_count : 0
          }
        }
      };
      
      return new Response(
        JSON.stringify(response),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // EXPLOITATION PHASE: Thompson Sampling
    const confidenceABetterB = calculateConfidence(
      statsA.conversions_count,
      statsA.sessions_count,
      statsB.conversions_count,
      statsB.sessions_count
    );
    
    // Если уверенность > 95%, объявляем победителя
    const winnerDeclared = confidenceABetterB > 0.95 || confidenceABetterB < 0.05;
    let variantId: 'A' | 'B';
    
    if (winnerDeclared) {
      // Всегда показываем победителя
      variantId = confidenceABetterB > 0.95 ? 'A' : 'B';
    } else {
      // Thompson Sampling: семплируем из Beta-распределения
      const sampleA = betaSample(
        statsA.conversions_count + 1,
        statsA.sessions_count - statsA.conversions_count + 1
      );
      const sampleB = betaSample(
        statsB.conversions_count + 1,
        statsB.sessions_count - statsB.conversions_count + 1
      );
      
      variantId = sampleA > sampleB ? 'A' : 'B';
    }
    
    // Инкрементируем счётчик сессий
    if (session_id) {
      await supabase.rpc('increment_ab_session', {
        p_test_name: test_name,
        p_intent: intent,
        p_variant_id: variantId
      });
    }
    
    const response: ABResponse = {
      variant_id: variantId,
      confidence: Math.max(confidenceABetterB, 1 - confidenceABetterB),
      winner_declared: winnerDeclared,
      stats: {
        A: {
          sessions: statsA.sessions_count,
          conversions: statsA.conversions_count,
          conversion_rate: statsA.sessions_count > 0 ? statsA.conversions_count / statsA.sessions_count : 0
        },
        B: {
          sessions: statsB.sessions_count,
          conversions: statsB.conversions_count,
          conversion_rate: statsB.sessions_count > 0 ? statsB.conversions_count / statsB.sessions_count : 0
        }
      }
    };
    
    console.log(`✅ A/B optimization: ${test_name}/${intent} → variant ${variantId} (confidence: ${response.confidence.toFixed(2)})`);
    
    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("❌ Error in ab-optimize:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    // Fallback: возвращаем случайный вариант при ошибке
    const fallbackResponse: ABResponse = {
      variant_id: Math.random() < 0.5 ? 'A' : 'B',
      confidence: 0.5,
      winner_declared: false,
      stats: {
        A: { sessions: 0, conversions: 0, conversion_rate: 0 },
        B: { sessions: 0, conversions: 0, conversion_rate: 0 }
      }
    };
    
    return new Response(
      JSON.stringify(fallbackResponse),
      { 
        status: 200, // Возвращаем 200 чтобы не ломать клиент
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});