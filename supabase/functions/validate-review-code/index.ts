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
    const { code } = await req.json();

    if (!code || code.length !== 6) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Invalid code format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find lead with this code
    const { data: lead, error } = await supabase
      .from('leads')
      .select('id, name, object_type, review_code_used, review_code_expires_at')
      .eq('review_code', code.toUpperCase())
      .maybeSingle();

    if (error) {
      console.error('Error finding lead:', error);
      throw error;
    }

    if (!lead) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Код не найден' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (lead.review_code_used) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Код уже использован' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (lead.review_code_expires_at && new Date(lead.review_code_expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Срок действия кода истёк' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        valid: true,
        lead_id: lead.id,
        name: lead.name,
        object_type: lead.object_type
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in validate-review-code:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ valid: false, error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
