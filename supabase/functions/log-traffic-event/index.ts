import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_EVENTS_PER_WINDOW = 30; // max events per IP+session per minute

// In-memory cache for rate limits
const rateLimitCache = new Map<string, { count: number; windowStart: number }>();

// Sanitize input parameters
function sanitizeParam(value: string | null | undefined, maxLength = 255): string | null {
  if (!value) return null;
  return value
    .slice(0, maxLength)
    .replace(/[<>"'&;(){}[\]\\]/g, "_");
}

// Check rate limit
function checkRateLimit(ip: string, sessionId: string): boolean {
  const key = `${ip}:${sessionId}`;
  const now = Date.now();
  const entry = rateLimitCache.get(key);
  
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitCache.set(key, { count: 1, windowStart: now });
    return true;
  }
  
  if (entry.count >= MAX_EVENTS_PER_WINDOW) {
    return false;
  }
  
  entry.count++;
  return true;
}

// Periodic cache cleanup (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitCache.entries()) {
    if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS * 5) {
      rateLimitCache.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface TrafficEventData {
  session_id: string;
  page_url: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  keyword_raw?: string;
  yclid?: string;
  gclid?: string;
  intent?: string;
  variant_id?: string;
  device_type?: string;
  event_type: string;
  event_data?: Record<string, any>;
}

const ALLOWED_EVENT_TYPES = [
  'page_view',
  'hero_view',
  'scroll_depth',
  'calc_open',
  'calc_change',
  'calc_submit',
  'popup_open',
  'popup_step_1',
  'popup_step_2',
  'popup_submit',
  'form_submit',
  'ml_prediction',
  'ab_test_debug'
];

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract client IP
    const ip = req.headers.get("x-real-ip") || 
               req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
               "unknown";

    const eventData: TrafficEventData = await req.json();

    // Rate limit check
    if (!checkRateLimit(ip, eventData.session_id)) {
      console.log(`⚠️ Rate limit exceeded for ${ip}:${eventData.session_id}`);
      return new Response(
        JSON.stringify({ success: false, error: "rate_limit_exceeded" }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Валидация обязательных полей
    if (!eventData.session_id || !eventData.page_url || !eventData.event_type) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required fields: session_id, page_url, event_type" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Валидация типа события
    if (!ALLOWED_EVENT_TYPES.includes(eventData.event_type)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Invalid event_type. Allowed: ${ALLOWED_EVENT_TYPES.join(', ')}` 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Вставка события в таблицу traffic_events с санитизацией
    const { data, error } = await supabase
      .from("traffic_events")
      .insert({
        session_id: eventData.session_id,
        page_url: sanitizeParam(eventData.page_url, 2048),
        referrer: sanitizeParam(eventData.referrer, 2048),
        utm_source: sanitizeParam(eventData.utm_source),
        utm_medium: sanitizeParam(eventData.utm_medium),
        utm_campaign: sanitizeParam(eventData.utm_campaign),
        utm_content: sanitizeParam(eventData.utm_content),
        utm_term: sanitizeParam(eventData.utm_term),
        keyword_raw: sanitizeParam(eventData.keyword_raw),
        yclid: sanitizeParam(eventData.yclid),
        gclid: sanitizeParam(eventData.gclid),
        intent: sanitizeParam(eventData.intent),
        variant_id: sanitizeParam(eventData.variant_id),
        device_type: sanitizeParam(eventData.device_type),
        event_type: eventData.event_type,
        event_data: eventData.event_data || null,
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Database error:", error);
      throw error;
    }

    console.log(`✅ Traffic event logged: ${eventData.event_type} (${data.id})`);

    return new Response(
      JSON.stringify({ success: true, event_id: data.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("❌ Error logging traffic event:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
