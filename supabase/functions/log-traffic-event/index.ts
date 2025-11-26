import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
  'ml_prediction'
];

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const eventData: TrafficEventData = await req.json();

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

    // Вставка события в таблицу traffic_events
    const { data, error } = await supabase
      .from("traffic_events")
      .insert({
        session_id: eventData.session_id,
        page_url: eventData.page_url.substring(0, 2048), // Ограничение длины URL
        referrer: eventData.referrer?.substring(0, 2048) || null,
        utm_source: eventData.utm_source || null,
        utm_medium: eventData.utm_medium || null,
        utm_campaign: eventData.utm_campaign || null,
        utm_content: eventData.utm_content || null,
        utm_term: eventData.utm_term || null,
        keyword_raw: eventData.keyword_raw || null,
        yclid: eventData.yclid || null,
        gclid: eventData.gclid || null,
        intent: eventData.intent || null,
        variant_id: eventData.variant_id || null,
        device_type: eventData.device_type || null,
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
