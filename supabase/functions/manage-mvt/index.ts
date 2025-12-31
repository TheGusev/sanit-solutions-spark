import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ManageMVTRequest {
  action: 'toggle_variant' | 'reset_stats' | 'set_winner' | 'update_alpha_beta';
  test_name: string;
  intent: string;
  variant_key: string;
  is_active?: boolean;
  alpha?: number;
  beta?: number;
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

    // Verify user is admin
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Неверный токен авторизации' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: roleData } = await serviceClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: 'Нет прав администратора' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const request: ManageMVTRequest = await req.json();
    console.log('MVT management request:', request);

    switch (request.action) {
      case 'toggle_variant': {
        const { error } = await serviceClient
          .from('mvt_arm_params')
          .update({ is_active: request.is_active })
          .eq('test_name', request.test_name)
          .eq('intent', request.intent)
          .eq('variant_key', request.variant_key);

        if (error) throw error;
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Вариант ${request.variant_key} ${request.is_active ? 'активирован' : 'деактивирован'}` 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'reset_stats': {
        const { error } = await serviceClient
          .from('mvt_arm_params')
          .update({ 
            alpha: 1, 
            beta: 1, 
            impressions_count: 0, 
            conversions_count: 0, 
            revenue_sum: 0 
          })
          .eq('test_name', request.test_name)
          .eq('intent', request.intent)
          .eq('variant_key', request.variant_key);

        if (error) throw error;
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Статистика варианта ${request.variant_key} сброшена` 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'set_winner': {
        // Update mvt_test_config with winner
        const { error } = await serviceClient
          .from('mvt_test_config')
          .update({ winner_variant: request.variant_key })
          .eq('test_name', request.test_name);

        if (error) throw error;
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Вариант ${request.variant_key} объявлен победителем` 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'update_alpha_beta': {
        const { error } = await serviceClient
          .from('mvt_arm_params')
          .update({ 
            alpha: request.alpha, 
            beta: request.beta 
          })
          .eq('test_name', request.test_name)
          .eq('intent', request.intent)
          .eq('variant_key', request.variant_key);

        if (error) throw error;
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `α/β обновлены для варианта ${request.variant_key}` 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Неизвестное действие' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Внутренняя ошибка сервера: ' + (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
