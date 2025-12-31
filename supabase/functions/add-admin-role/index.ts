import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, secret_code } = await req.json();

    if (!email || !secret_code) {
      return new Response(
        JSON.stringify({ error: 'Email и секретный код обязательны' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const adminSetupSecret = Deno.env.get('ADMIN_SETUP_SECRET');
    if (!adminSetupSecret || secret_code !== adminSetupSecret) {
      return new Response(
        JSON.stringify({ error: 'Неверный секретный код' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Find user by email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return new Response(
        JSON.stringify({ error: 'Ошибка поиска пользователя' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Пользователь не найден' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Found user:', user.id);

    // Check if role already exists
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (existingRole) {
      return new Response(
        JSON.stringify({ success: true, message: 'Роль admin уже назначена', user_id: user.id }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Add admin role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({ user_id: user.id, role: 'admin' });

    if (roleError) {
      console.error('Error adding role:', roleError);
      return new Response(
        JSON.stringify({ error: 'Не удалось добавить роль admin' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Admin role added for user:', email);

    return new Response(
      JSON.stringify({ success: true, message: 'Роль admin успешно назначена', user_id: user.id }),
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
