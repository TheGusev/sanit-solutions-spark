

# Web Push Notifications для админ-панели

## Обзор

Добавляем полноценную цепочку: Service Worker → PWA manifest → Push подписка → Supabase trigger → Edge Function → Web Push на iPhone.

**Важное ограничение iOS**: Push API на iPhone работает ТОЛЬКО для PWA, установленных на Home Screen (iOS 16.4+). Это именно наш сценарий.

**Важное ограничение Deno**: npm-пакет `web-push` не работает в Deno Edge Functions. Будем реализовывать Web Push протокол напрямую через `crypto.subtle` (ECDSA P-256 + HKDF + AES-GCM) — стандартный подход для Deno.

---

## Файлы для создания/изменения

| # | Файл | Действие |
|---|------|----------|
| 1 | `public/sw.js` | **Создать** — Service Worker с push handler |
| 2 | `public/manifest.json` | **Создать** — PWA manifest для installability |
| 3 | `index.html` | **Изменить** — добавить `<link rel="manifest">` |
| 4 | `src/main.tsx` | **Изменить** — регистрация SW с iframe/preview guard |
| 5 | `src/hooks/usePushNotifications.ts` | **Создать** — хук подписки/отписки |
| 6 | `src/components/admin/PushNotificationSettings.tsx` | **Создать** — UI компонент |
| 7 | `src/pages/admin/Settings.tsx` | **Изменить** — добавить секцию уведомлений |
| 8 | **Миграция SQL** | **Создать** — таблица `push_subscriptions` + trigger `on_new_lead` |
| 9 | `supabase/functions/save-push-subscription/index.ts` | **Создать** — сохранение подписки |
| 10 | `supabase/functions/send-push-notification/index.ts` | **Создать** — отправка push через Web Push протокол |
| 11 | `supabase/config.toml` | **Изменить** — добавить новые функции |
| 12 | **Secrets** | `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` |

---

## Детали реализации

### 1. `public/sw.js`
- `push` event → `showNotification` с title, body, icon, badge, vibrate, actions
- `notificationclick` → `clients.openWindow('/admin/')`
- Минимальный SW — только push, без кэширования (не ломаем preview)

### 2. `public/manifest.json`
```json
{
  "name": "Горуслуги МСК — Админ",
  "short_name": "Горуслуги",
  "start_url": "/admin/",
  "display": "standalone",
  "theme_color": "#16a34a",
  "icons": [{ "src": "/favicon.ico", "sizes": "48x48" }]
}
```

### 3. `index.html`
Добавить `<link rel="manifest" href="/manifest.json">` в `<head>`.

### 4. `src/main.tsx`
Регистрация SW с guard:
- НЕ регистрировать в iframe
- НЕ регистрировать на preview хостах
- Только на production domain

### 5. `src/hooks/usePushNotifications.ts`
- `subscribeToPush()`: requestPermission → pushManager.subscribe → POST в save-push-subscription
- `unsubscribeFromPush()`: pushManager.unsubscribe
- `sendTestPush()`: вызов send-push-notification с тестовыми данными
- VAPID public key берётся из `import.meta.env.VITE_VAPID_PUBLIC_KEY` (хардкод в коде, это публичный ключ)

### 6. PushNotificationSettings компонент
- Показывает статус поддержки, подписки
- Кнопки: включить/выключить/тест
- Предупреждение для не-PWA контекста

### 7. SQL миграция

**Таблица push_subscriptions:**
```sql
CREATE TABLE push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins_manage" ON push_subscriptions
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
```

**Trigger on leads INSERT:**
Используем `pg_net` (доступен в Supabase) для HTTP вызова edge function:
```sql
CREATE OR REPLACE FUNCTION notify_new_lead()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := (SELECT current_setting('supabase.url', true)) || '/functions/v1/send-push-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT current_setting('supabase.service_role_key', true))
    ),
    body := row_to_json(NEW)::jsonb
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_new_lead
  AFTER INSERT ON leads
  FOR EACH ROW EXECUTE FUNCTION notify_new_lead();
```

### 8. Edge Function: save-push-subscription
- POST: upsert subscription по endpoint
- Требует admin auth (проверка через getClaims)
- DELETE: удаление по endpoint

### 9. Edge Function: send-push-notification
- Получает lead data из trigger payload
- Читает все подписки из push_subscriptions
- Реализует Web Push протокол:
  - VAPID JWT signing через `crypto.subtle` (ECDSA P-256)
  - Payload encryption (ECDH + HKDF + AES-128-GCM)
  - POST на push endpoint с заголовками Authorization (vapid), TTL, Content-Encoding
- При HTTP 410 → удаляет expired подписку
- Принимает также ручной вызов для тест-push (с проверкой admin auth)

### 10. VAPID ключи
Сгенерирую через Edge Function или попрошу пользователя добавить через secrets tool:
- `VAPID_PUBLIC_KEY` — base64url encoded
- `VAPID_PRIVATE_KEY` — base64url encoded
- `VAPID_SUBJECT` — `mailto:admin@goruslugimsk.ru`

Публичный ключ также хардкодится в фронтенде (это безопасно, он публичный).

---

## Безопасность

- `save-push-subscription`: только для admin (проверка JWT + role)
- `send-push-notification`: принимает от trigger (service_role_key) или от admin (JWT + role)
- VAPID private key только в Supabase Secrets
- RLS на push_subscriptions: только admin

## Что НЕ делаем
- Не используем Firebase/FCM/OneSignal
- Не добавляем кэширование в SW (не ломаем preview)
- Не трогаем Telegram логику (оставляем как есть, но она уже фактически не используется)

