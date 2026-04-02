

# Исправление Web Push: баннер в Dashboard + debug логирование

## Анализ текущего состояния

Проверил все 4 файла. Вот что нашёл:

| Компонент | Статус | Проблема |
|-----------|--------|----------|
| VAPID ключ в фронтенде | ✅ Хардкод на строке 5 | Ключ присутствует |
| Service Worker `public/sw.js` | ✅ push + notificationclick | Обработчики на месте |
| SW регистрация в `main.tsx` | ⚠️ Блокирует `.lovable.app` | Если тестируете через `sanit-solutions-spark.lovable.app` — SW не зарегистрируется. На `goruslugimsk.ru` работает |
| Баннер подписки в `/admin/` | ❌ Отсутствует | `PushNotificationSettings` есть только в Settings, не в Dashboard |
| Debug логи в subscribeToPush | ❌ Нет | Невозможно понять, на каком шаге падает |

**Главная проблема**: Пользователь заходит в `/admin/` (Leads), видит список заявок, но **нигде не предлагается подписаться на push**. Компонент `PushNotificationSettings` спрятан в `/admin/settings` — туда нужно специально зайти и нажать кнопку.

## Изменения

### 1. `src/pages/admin/Dashboard.tsx` — добавить push-баннер
- Импортировать `usePushNotifications`
- Добавить `useState` для `showPushBanner`
- `useEffect`: если `isSupported && !isSubscribed && !localStorage.getItem('push_banner_dismissed')` → показать баннер
- Баннер рендерится **над `<Outlet />`** — жёлтая полоска с кнопкой «Включить уведомления»
- Кнопка «Включить» вызывает `subscribeToPush()`, при успехе — toast + скрыть баннер
- Кнопка ✕ — скрыть баннер + `localStorage.setItem('push_banner_dismissed', 'true')`

### 2. `src/hooks/usePushNotifications.ts` — добавить debug логи
На каждом шаге `subscribeToPush()` добавить `console.log`:
- `[Push] Starting subscription...`
- `[Push] Permission: ${permission}`
- `[Push] SW registration: ${registration?.scope}`
- `[Push] PushManager.subscribe success, endpoint: ${subJson.endpoint?.slice(0,50)}`
- `[Push] Saving to backend...`
- `[Push] Backend response OK / error`

### 3. `src/main.tsx` — убрать `.lovable.app` из блока
Сейчас строка 40 блокирует SW на `lovable.app`. Это правильно для preview, но если пользователь тестирует через published URL `sanit-solutions-spark.lovable.app` — SW не работает. Оставить только `id-preview--` и `lovableproject.com` в блоке, убрать `lovable.app` (или сделать более точную проверку).

### 4. Проверка HKDF в `send-push-notification`
В текущей реализации (строки 131-143) аргументы `hkdf(salt, ikm, ...)` **перепутаны**: по RFC 5869, HKDF-Extract принимает `(salt, IKM)`, но `crypto.subtle.sign(HMAC, key=IKM, data=salt)` — здесь `key` это IKM, а `data` должен быть salt. Сейчас сделано наоборот. Исправить порядок аргументов.

## Результат
- При первом входе в `/admin/` появляется баннер подписки
- Консоль покажет каждый шаг подписки для диагностики
- SW регистрируется на всех production доменах
- HKDF корректно шифрует payload для push-сервиса

