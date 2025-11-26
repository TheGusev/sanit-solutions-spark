import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

// Фиктивная ML-модель с чётким контрактом
// TODO: Заменить на реальную модель при интеграции
function predictConversion(data: PredictRequest): PredictResponse {
  // Базовая вероятность конверсии
  let p_conv = 0.15;
  
  // Корректировки по признакам
  
  // Intent увеличивает конверсию
  if (data.intent && data.intent !== 'default') {
    p_conv += 0.12;
  }
  
  // Специфичные интенты
  if (data.intent?.includes('ses_check')) {
    p_conv += 0.08; // Срочные проверки конвертят лучше
  }
  
  // UTM source
  if (data.utm_source === 'yandex' || data.utm_source === 'google') {
    p_conv += 0.06; // Платный трафик конвертит лучше
  }
  
  // UTM medium
  if (data.utm_medium === 'cpc') {
    p_conv += 0.05;
  }
  
  // Device type
  if (data.device_type === 'desktop') {
    p_conv += 0.04; // Desktop конвертит немного лучше
  }
  
  // Поведенческие признаки (если есть)
  if (data.calc_opened) {
    p_conv += 0.18; // Открытие калькулятора - сильный сигнал
  }
  
  if (data.scroll_depth && data.scroll_depth > 0.5) {
    p_conv += 0.08; // Глубокий скролл показывает интерес
  }
  
  if (data.time_on_page && data.time_on_page > 60) {
    p_conv += 0.06; // Время на странице > 1 минуты
  }
  
  // Добавляем небольшой случайный шум для тестирования
  const noise = (Math.random() - 0.5) * 0.08;
  p_conv += noise;
  
  // Ограничиваем диапазон [0.05, 0.85]
  p_conv = Math.max(0.05, Math.min(0.85, p_conv));
  
  // Определение сегмента
  let segment: 'low' | 'mid' | 'high';
  if (p_conv < 0.2) {
    segment = 'low';
  } else if (p_conv < 0.5) {
    segment = 'mid';
  } else {
    segment = 'high';
  }
  
  return {
    p_conv: Math.round(p_conv * 100) / 100,
    segment,
    model_version: 'stub_v1.0'
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: PredictRequest = await req.json();

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

    // Получаем предсказание
    const prediction = predictConversion(requestData);

    console.log(`✅ ML prediction: session=${requestData.session_id}, p_conv=${prediction.p_conv}, segment=${prediction.segment}`);

    return new Response(
      JSON.stringify(prediction),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("❌ ML predict error:", error);
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
