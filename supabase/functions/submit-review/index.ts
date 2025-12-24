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
    const { code, display_name, rating, text } = await req.json();

    // Validate input
    if (!code || !display_name || !rating || !text) {
      return new Response(
        JSON.stringify({ error: 'Все поля обязательны' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (rating < 1 || rating > 5) {
      return new Response(
        JSON.stringify({ error: 'Рейтинг должен быть от 1 до 5' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (text.length < 10 || text.length > 1000) {
      return new Response(
        JSON.stringify({ error: 'Отзыв должен быть от 10 до 1000 символов' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Validate code again
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('id, object_type, review_code_used, review_code_expires_at')
      .eq('review_code', code.toUpperCase())
      .maybeSingle();

    if (leadError || !lead) {
      return new Response(
        JSON.stringify({ error: 'Недействительный код' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (lead.review_code_used) {
      return new Response(
        JSON.stringify({ error: 'Код уже использован' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (lead.review_code_expires_at && new Date(lead.review_code_expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: 'Срок действия кода истёк' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create review
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert({
        lead_id: lead.id,
        display_name: display_name.trim(),
        rating,
        text: text.trim(),
        object_type: lead.object_type
      })
      .select()
      .single();

    if (reviewError) {
      console.error('Error creating review:', reviewError);
      throw reviewError;
    }

    // Mark code as used
    await supabase
      .from('leads')
      .update({ review_code_used: true })
      .eq('id', lead.id);

    // Send Telegram notification
    const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const telegramChatId = Deno.env.get('TELEGRAM_CHAT_ID');

    if (telegramBotToken && telegramChatId) {
      const stars = '⭐'.repeat(rating);
      const message = `📝 Новый отзыв!\n\n` +
        `👤 ${display_name}\n` +
        `${stars}\n\n` +
        `"${text}"\n\n` +
        `🏠 Тип объекта: ${lead.object_type || 'Не указан'}\n` +
        `⏳ Ожидает модерации`;

      try {
        await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: message
          })
        });
        console.log('Telegram notification sent for new review');
      } catch (tgError) {
        console.error('Error sending Telegram notification:', tgError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Спасибо за отзыв! Он появится на сайте после модерации.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in submit-review:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
