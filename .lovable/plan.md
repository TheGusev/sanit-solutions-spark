

# Переключение Push на собственный push-server (`/api/push/`)

## Ситуация

На сервере уже работает Node.js push-server с тремя эндпоинтами (`/api/push/vapid-public-key`, `/subscribe`, `/send`). Supabase Edge Function `send-push-notification` не работает (403 BadJwtToken от Apple + 7 TS build ошибок). Самое надёжное решение — переключить фронтенд на работающий push-server.

## Изменения

### 1. `src/hooks/usePushNotifications.ts` — переключить на `/api/push/`

- Заменить VAPID ключ на новый: `BAPBq6a7TvmD4jlXMCRl22dxxueotpco5R_H0JKirwOuC1poOoOjfNNMQL0Eq1eQBZXDyCava8qhrElM3I4JSDo`
- `subscribeToPush()`: вместо `supabase.functions.invoke('save-push-subscription')` → `fetch('/api/push/subscribe', { method: 'POST', body: { endpoint, keys } })`
- `unsubscribeFromPush()`: аналогично, POST на `/api/push/subscribe` (push-server делает REPLACE, отписка — через PushManager)
- `sendTestPush()`: вместо `supabase.functions.invoke('send-push-notification')` → `fetch('/api/push/send', { method: 'POST', body: { title, body, url } })`
- Убрать импорт `supabase` из этого файла

### 2. `supabase/functions/handle-lead/index.ts` — отправка push при новой заявке

После успешного сохранения лида в БД (строка ~308), добавить вызов push-server:
```typescript
try {
  await fetch('https://goruslugimsk.ru/api/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: '🔔 Новая заявка!',
      body: `${leadData.phone} — ${leadData.source || 'сайт'}`,
      url: '/admin/'
    })
  });
} catch (e) { console.error('Push send error:', e); }
```

Это **заменяет** DB trigger `on_new_lead` → edge function цепочку на прямой HTTP вызов.

### 3. `supabase/functions/send-push-notification/index.ts` — исправить TS ошибки

Все 7 ошибок — `Uint8Array` не assignable to `BufferSource` в Deno strict mode. Фикс: везде где передаётся `Uint8Array` в `crypto.subtle`, оборачивать в `.buffer`:
- `crypto.subtle.importKey("pkcs8", pkcs8.buffer, ...)` (строка 71)
- `crypto.subtle.importKey("raw", salt..., ...)` → добавить `.buffer` (строка 137)
- `crypto.subtle.sign("HMAC", saltKey, ikm.buffer)` (строка 138)
- `crypto.subtle.sign("HMAC", prkKey, infoWithCounter.buffer)` (строка 142)
- `crypto.subtle.importKey("raw", clientPublicKey.buffer, ...)` (строка 193)
- `crypto.subtle.importKey("raw", contentEncryptionKey.buffer, ...)` (строка 233)
- `{ name: "AES-GCM", iv: nonce.buffer }` (строка 243)

Также удалить неиспользуемую `keyData` (строка 60).

Это нужно чтобы build проходил, даже если эта функция больше не основной путь доставки push.

### 4. Dashboard — без изменений

Баннер подписки в `/admin/` и компонент `PushNotificationSettings` в настройках уже подключены к хуку. После смены хука всё заработает автоматически.

## Итого файлов

| Файл | Действие |
|------|----------|
| `src/hooks/usePushNotifications.ts` | Переключить на `/api/push/` + новый VAPID key |
| `supabase/functions/handle-lead/index.ts` | Добавить POST на push-server после сохранения лида |
| `supabase/functions/send-push-notification/index.ts` | Фикс 7 TS ошибок (`.buffer`) |

## Результат

- Подписка идёт через `/api/push/subscribe` → SQLite на сервере
- При новой заявке `handle-lead` → POST `/api/push/send` → web-push → iPhone
- Build проходит без ошибок
- Supabase Edge Function остаётся как fallback (можно будет удалить позже)

