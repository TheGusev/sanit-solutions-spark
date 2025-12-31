import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestLeadData {
  name: string;
  phone: string;
  email?: string;
  object_type?: string;
  service?: string;
  method?: string;
  frequency?: string;
  client_type?: string;
  area_m2?: number;
  base_price?: number;
  discount_percent?: number;
  discount_amount?: number;
  final_price?: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Требуется авторизация' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Verify user is admin using their token
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Неверный токен авторизации' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check admin role using service client
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: roleData, error: roleError } = await serviceClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !roleData) {
      console.error('Role check error:', roleError);
      return new Response(
        JSON.stringify({ error: 'Нет прав администратора' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const leadData: TestLeadData = await req.json();

    if (!leadData.name || !leadData.phone) {
      return new Response(
        JSON.stringify({ error: 'Имя и телефон обязательны' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating test lead:', leadData);

    // Create test lead - NOT logging to traffic_events, NOT tracking MVT
    const { data: lead, error: insertError } = await serviceClient
      .from('leads')
      .insert({
        name: leadData.name,
        phone: leadData.phone,
        email: leadData.email || null,
        object_type: leadData.object_type || null,
        service: leadData.service || null,
        method: leadData.method || null,
        frequency: leadData.frequency || null,
        client_type: leadData.client_type || null,
        area_m2: leadData.area_m2 || null,
        base_price: leadData.base_price || null,
        discount_percent: leadData.discount_percent || null,
        discount_amount: leadData.discount_amount || null,
        final_price: leadData.final_price || null,
        source: 'admin_test',
        is_test: true,
        status: 'new',
        intent: 'test',
        session_id: `test_${Date.now()}`,
        device_type: 'admin',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Ошибка создания заявки: ' + insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Test lead created:', lead.id);

    // NOTE: We do NOT:
    // - Log to traffic_events
    // - Track MVT/A/B conversions
    // - Send Telegram notifications
    // This keeps test leads completely separate from real analytics

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Тестовая заявка создана',
        lead_id: lead.id 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Внутренняя ошибка сервера' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
