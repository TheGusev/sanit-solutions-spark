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
    const { lead_id } = await req.json();

    if (!lead_id) {
      return new Response(
        JSON.stringify({ error: 'lead_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate 6-character code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiration

    // Update lead with review code
    const { data: lead, error: updateError } = await supabase
      .from('leads')
      .update({
        review_code: code,
        review_code_expires_at: expiresAt.toISOString(),
        status: 'completed'
      })
      .eq('id', lead_id)
      .select('name, phone, object_type')
      .single();

    if (updateError) {
      console.error('Error updating lead:', updateError);
      throw updateError;
    }

    // Send Telegram notification
    const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const telegramChatId = Deno.env.get('TELEGRAM_CHAT_ID');

    if (telegramBotToken && telegramChatId) {
      const message = `✅ Заказ завершён!\n\n` +
        `👤 Клиент: ${lead.name}\n` +
        `📞 Телефон: ${lead.phone}\n` +
        `🏠 Объект: ${lead.object_type || 'Не указан'}\n\n` +
        `🎫 Код для отзыва: ${code}\n` +
        `⏳ Действителен до: ${expiresAt.toLocaleDateString('ru-RU')}`;

      try {
        await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: message,
            parse_mode: 'HTML'
          })
        });
        console.log('Telegram notification sent');
      } catch (tgError) {
        console.error('Error sending Telegram notification:', tgError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        code,
        expires_at: expiresAt.toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in generate-review-code:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
