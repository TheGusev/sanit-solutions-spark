

# Финальный план: фикс заявок и проверка админ-панели

## Что я подтвердил тестами

### 1. Бэкенд работает на 100%
- Прямой `POST` на `https://gimkzlozhwwgetlgtgvj.supabase.co/functions/v1/handle-lead` с production-домена в качестве `Origin` — **вернул `success: true` и создал lead `3e0d7b0f-31ec-40dc-a282-21227d6b0f2d`** (только что, 24 апреля 11:06 UTC).
- CORS-преflight `OPTIONS` отдаёт правильные заголовки.
- В БД лиды есть до 23 апреля включительно. Telegram-уведомления должны приходить.
- Edge Function logs пустые — потому что **из браузера запросы не идут вообще** (это и есть проблема).

### 2. Админ-панель открывается
- Страница `/admin/login` отрендерилась нормально, форма видна (см. скриншот), кнопка «Войти» интерактивна.
- В БД есть админ `ce22683c-14ba-4805-892e-ec513290d9dd` с ролью `admin`.
- Если у вас не открывается — **очистите cache/cookies для goruslugimsk.ru и попробуйте снова**. Старые JS-чанки в браузере могут ссылаться на удалённые имена компонентов из предыдущей сборки.

### 3. **Корневая причина проблемы с формами — React Hydration Error #418**

В консоли браузера на **каждой странице** (включая главную и `/admin/login`):
```
Uncaught Error: Minified React error #418 — hydration failed because 
the server-rendered HTML didn't match the client.
```

После hydration mismatch React делает client-side recovery, но при этом **сбрасывает state форм**. Когда пользователь начинает писать в инпут и жмёт «Отправить»:
1. `setIsLoading(true)` срабатывает → кнопка показывает «Отправка...».
2. React параллельно перерисовывает дерево из-за recovery.
3. Замыкание в `handleSubmit` теряет ссылку на актуальный компонент.
4. `await supabase.functions.invoke(...)` уходит в потерянную ветку → fetch **никогда не отправляется**.
5. Юзер видит вечное «Отправка...» — точно как на скриншоте.

В network-логах из браузера я **не нашёл ни одного запроса** на `handle-lead` — подтверждение, что fetch не доходит до отправки.

## Откуда взялся hydration mismatch

Самые вероятные кандидаты в порядке убывания вероятности:

### A) `<script>` с темой внутри `<div id="root">` (СТРОКА 1 проблемы)
В pre-rendered HTML внутри корневого root-div лежит **inline-скрипт темы**:
```html
<div id="root">
  <link rel="preload" .../>
  <script>!function(){try{var d=document.documentElement,c=d.classList;
    c.remove('light','dark');var e=localStorage.getItem('theme');
    if(e){c.add(e||'')}else{c.add('light');}...}catch(t){}}();</script>
  <div class="min-h-screen bg-background">...
```
React при гидратации **ожидает** что в этом месте — корень React-дерева, а вместо этого находит сторонние теги (`<link>`, `<script>`). Это классический источник #418.

Скрипт темы должен быть в `<head>` (до `<div id="root">`), а не внутри него. Сейчас он попал в root, скорее всего из-за SSG-плагина, который вшивает `helmet`-теги или preload-link внутрь рендера.

### B) Возможно дополнительно — переключение темы при загрузке
Скрипт читает `localStorage.theme`. Если у юзера сохранена `dark`, он мгновенно ставит `class="dark"` на html. Но React-приложение SSG-prerendered с `class="light"` (или вообще без класса). Это даёт визуальный mismatch и может быть второй причиной #418 — но первая (A) уже фатальна сама по себе.

## План действий

### Шаг 1 — Удалить inline-script из тела `<div id="root">` (главная правка)

Найду в SSG-пайплайне (`vite-plugin-ssg.ts` или `entry-server.tsx`) место где этот script-тег попадает внутрь #root, и:
- либо вынесу его в `<head>` через инжекцию в `replaceHeadTags`,
- либо удалю из SSG-результата, оставив скрипт темы только в `index.html` (`<head>`).

Также проверю что preload-link для hero-картинки (`<link rel="preload" as="image" href="/images/hero-cards/fast-response.jpg"/>`) тоже не попадает внутрь #root — он должен быть в `<head>`.

### Шаг 2 — Добавить `suppressHydrationWarning` на `<html>` для класса темы (мягкий fallback)

В `index.html` для `<html lang="ru">` добавлю `suppressHydrationWarning` через мета-патч в SSG (или в самом entry-server) — на случай если recovery-render всё ещё не совпадёт по классу темы.

### Шаг 3 — Защита от потери state в формах (страховка)

В `LeadFormModal.tsx`, `HeroCallbackForm.tsx`, `SimpleCalculator.tsx`, `QuickCallForm.tsx`, `CompactRequestModal.tsx`, `ServiceQuiz.tsx`, `ExitIntentPopup.tsx` обёрну отправку в:
```ts
try {
  // submit
} finally {
  setIsLoading(false);  // гарантирует что кнопка не зависнет вечно
}
```
Это уже есть в большинстве файлов, но на всякий случай ревизую все 7 точек отправки и добавлю `finally`-сброс `isLoading` где его нет. Это страховка от любых будущих hydration-проблем.

### Шаг 4 — Удалить устаревший `<meta http-equiv="X-Frame-Options">` из `index.html`

Браузер ругается на эту строку:
```
[security] X-Frame-Options may only be set via an HTTP header sent along 
with a document. It may not be set inside <meta>.
```
Сам по себе X-Frame-Options уже отдаётся из nginx как HTTP-заголовок, поэтому meta-fallback не нужен. Удалю строки 11-12 из `index.html` (X-Frame-Options и X-XSS-Protection — оба не работают как meta). `nosniff` оставлю — он валидный в meta.

### Шаг 5 — Очистка legacy в SW (не критично, но раз тут)

`public/sw.js` содержит `data: d.url || '/'` — это правильно, но на проде задеплоена старая версия без `data:`. При следующем деплое (после фикса) SW обновится автоматически.

## Что я НЕ трогаю

- Бэкенд (edge-функции, RLS, БД) — всё работает идеально, доказано прямым curl.
- nginx.conf — security-заголовки на месте, маршрутизация правильная.
- `docker-compose.yml` — push-server без проброса портов уже зафиксирован в прошлый раз.
- Структуру маршрутов и SSG-логику валидации — только точечный фикс инжекции script в #root.

## Ожидаемый результат после фикса

1. Открываете прод → в консоли **нет React error #418**.
2. Жмёте «Расчёт» → вводите телефон → жмёте «Отправить» → **через 1-2 секунды toast «Заявка отправлена»**, лид появляется в БД, в Telegram прилетает уведомление, в админке в `/admin` он виден.
3. Админка `/admin/login` → вход → `/admin` (Заявки) — открывается без проблем.

## Тест после деплоя (что вы делаете сами)

```
1. Открыть https://goruslugimsk.ru/ — F12 → Console — НЕТ ошибок React.
2. Жмёте «Расчёт» → вводите 9069989888 → «Отправить» → видите toast.
3. SQL-проверка: новый лид с source=calculator_v2 за последнюю минуту.
4. Telegram: пришло сообщение «🔔 НОВАЯ ЗАЯВКА».
5. /admin/login — введите свой email/пароль — попадаете в /admin.
```

## Прогноз по времени

- Правки в коде: 5 файлов, ~20 строк изменений.
- После моего деплоя в репо вам нужно на сервере сделать `/root/deploy.sh` (он теперь чистый — имена контейнеров не конфликтуют, push-server без хост-портов).
- Полный цикл: ~3-5 минут после approve.

## Если после фикса что-то не сработает

У меня есть запасной план — обернуть весь client-render в `<App suppressHydrationWarning>` и переключить с `hydrateRoot` на `createRoot` для admin-маршрутов (избежать гидратации там, где нет SSG). Но это вторая итерация, в большинстве случаев шага 1 хватит.

