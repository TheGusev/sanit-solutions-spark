/**
 * Cloudflare Worker для Push-уведомлений
 * Заменяет Supabase Edge Functions
 */

interface Env {
  PUSH_DB: D1Database;
  VAPID_PUBLIC_KEY: string;
  VAPID_PRIVATE_KEY: string;
  VAPID_SUBJECT: string;
}

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    try {
      // POST /api/push/subscribe - сохранить подписку
      if (url.pathname === '/api/push/subscribe' && request.method === 'POST') {
        const subscription: PushSubscription = await request.json();
        
        await env.PUSH_DB.prepare(
          'INSERT OR REPLACE INTO subscriptions (endpoint, p256dh, auth, created_at) VALUES (?, ?, ?, ?)'
        ).bind(
          subscription.endpoint,
          subscription.keys.p256dh,
          subscription.keys.auth,
          new Date().toISOString()
        ).run();

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201,
        });
      }

      // POST /api/push/test - отправить тестовое уведомление
      if (url.pathname === '/api/push/test' && request.method === 'POST') {
        const { results } = await env.PUSH_DB.prepare(
          'SELECT endpoint, p256dh, auth FROM subscriptions'
        ).all();

        if (!results || results.length === 0) {
          return new Response(
            JSON.stringify({ success: true, sent: 0, message: 'No subscriptions' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        let sent = 0;
        const payload = JSON.stringify({
          title: '🔔 Тестовое уведомление',
          body: 'Push-уведомления работают корректно!',
          url: '/admin/',
        });

        for (const sub of results) {
          try {
            await sendWebPush(
              {
                endpoint: sub.endpoint as string,
                keys: {
                  p256dh: sub.p256dh as string,
                  auth: sub.auth as string,
                },
              },
              payload,
              env.VAPID_PUBLIC_KEY,
              env.VAPID_PRIVATE_KEY,
              env.VAPID_SUBJECT
            );
            sent++;
          } catch (error) {
            console.error('Push send error:', error);
          }
        }

        return new Response(
          JSON.stringify({ success: true, sent, total: results.length }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // POST /api/push/send - отправить уведомление о новой заявке
      if (url.pathname === '/api/push/send' && request.method === 'POST') {
        const body = await request.json();
        const { phone, source } = body;

        const { results } = await env.PUSH_DB.prepare(
          'SELECT endpoint, p256dh, auth FROM subscriptions'
        ).all();

        const time = new Date().toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Europe/Moscow',
        });

        const payload = JSON.stringify({
          title: '🔔 Новая заявка!',
          body: `${phone || 'Без номера'} — ${source || 'сайт'} — ${time}`,
          url: '/admin/',
        });

        let sent = 0;
        for (const sub of results || []) {
          try {
            await sendWebPush(
              {
                endpoint: sub.endpoint as string,
                keys: {
                  p256dh: sub.p256dh as string,
                  auth: sub.auth as string,
                },
              },
              payload,
              env.VAPID_PUBLIC_KEY,
              env.VAPID_PRIVATE_KEY,
              env.VAPID_SUBJECT
            );
            sent++;
          } catch (error) {
            console.error('Push send error:', error);
          }
        }

        return new Response(
          JSON.stringify({ success: true, sent }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response('Not Found', { status: 404 });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Internal Server Error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  },
};

// Web Push отправка (упрощенная версия для Cloudflare Workers)
async function sendWebPush(
  subscription: PushSubscription,
  payload: string,
  vapidPublicKey: string,
  vapidPrivateKey: string,
  vapidSubject: string
): Promise<void> {
  // Здесь используется библиотека web-push или custom реализация
  // Для Cloudflare Workers нужна custom реализация VAPID + HTTP/2 push
  // Этот код нужно дополнить реализацией из вашего текущего Supabase function
  throw new Error('Web Push implementation needed');
}
