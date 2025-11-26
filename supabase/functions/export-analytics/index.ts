import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ExportParams {
  table: 'traffic_events' | 'leads';
  start_date?: string;
  end_date?: string;
  utm_source?: string;
  utm_campaign?: string;
  intent?: string;
  device_type?: string;
  event_type?: string;
  format?: 'json' | 'csv';
  limit?: number;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Базовая авторизация по API ключу
    const authHeader = req.headers.get("authorization");
    const apiKey = Deno.env.get("ANALYTICS_API_KEY");
    
    if (!apiKey || authHeader !== `Bearer ${apiKey}`) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { 
          status: 401, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const params: ExportParams = await req.json();

    // Валидация таблицы
    if (!params.table || !['traffic_events', 'leads'].includes(params.table)) {
      return new Response(
        JSON.stringify({ error: "Invalid table. Must be 'traffic_events' or 'leads'" }),
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

    // Построение запроса с фильтрами
    let query = supabase.from(params.table).select('*');

    // Фильтры по дате
    if (params.start_date) {
      query = query.gte('timestamp', params.start_date);
    }
    if (params.end_date) {
      query = query.lte('timestamp', params.end_date);
    }

    // Фильтры по UTM
    if (params.utm_source) {
      query = query.eq('utm_source', params.utm_source);
    }
    if (params.utm_campaign) {
      query = query.eq('utm_campaign', params.utm_campaign);
    }

    // Фильтры по интенту и устройству
    if (params.intent) {
      query = query.eq('intent', params.intent);
    }
    if (params.device_type) {
      query = query.eq('device_type', params.device_type);
    }

    // Фильтр по типу события (только для traffic_events)
    if (params.table === 'traffic_events' && params.event_type) {
      query = query.eq('event_type', params.event_type);
    }

    // Лимит результатов
    const limit = params.limit && params.limit > 0 ? Math.min(params.limit, 10000) : 1000;
    query = query.limit(limit);

    // Сортировка по timestamp
    query = query.order('timestamp', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("❌ Database error:", error);
      throw error;
    }

    console.log(`✅ Exported ${data.length} records from ${params.table}`);

    // Формат вывода
    if (params.format === 'csv') {
      // Конвертация в CSV
      if (!data || data.length === 0) {
        return new Response('', {
          headers: { 
            ...corsHeaders, 
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="${params.table}_export.csv"`
          }
        });
      }

      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row => 
        Object.values(row).map(val => {
          // Экранирование значений для CSV
          if (val === null || val === undefined) return '';
          const str = String(val);
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        }).join(',')
      );

      const csv = [headers, ...rows].join('\n');

      return new Response(csv, {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${params.table}_export.csv"`
        }
      });
    }

    // JSON формат (по умолчанию)
    return new Response(
      JSON.stringify({ 
        success: true, 
        table: params.table,
        count: data.length,
        data 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("❌ Error exporting analytics:", error);
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
