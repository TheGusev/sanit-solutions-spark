## Аварийный откат трёх файлов к рабочему состоянию

Цель — вернуть сайт в стабильное состояние одним заходом, без попыток «починить» что-либо сверху. Никакие другие файлы не трогаю.

### Шаг 1. `vite-plugin-ssg.ts` — вернуть последовательный рендер
- Убрать `CONCURRENCY`, `VERBOSE` и батчевый цикл `Promise.all`.
- Вернуть классический последовательный `for ... of routes` рендер, как было до правки.
- Логика самого рендера одной страницы (replaceHeadTags, validateHtml, запись файла, сбор `titleMap`/`descriptionMap`, счётчики) остаётся та же — меняется только обвязка цикла.
- Это снимает memory spike в Docker-раннере и устраняет `deadline_exceeded` при сборке.

### Шаг 2. `src/components/SimpleCalculator.tsx` — вернуть отправку через SDK
- Убрать функцию `sendDirect` с прямым `fetch('/functions/v1/handle-lead')`, `AbortController`, `cache: "no-store"` и ручной передачей `apikey`/`Authorization`.
- Вернуть отправку строго через `supabase.functions.invoke("handle-lead", { body: leadData })`.
- Убрать «фолбэк на SDK» — теперь SDK единственный путь.
- Нормализацию телефона (`+7XXXXXXXXXX`) и базовые валидации оставить — это безопасно и не влияет на транспорт.
- Состояния `submitting`/`success`/`error` и UI шагов калькулятора не трогаю.

### Шаг 3. `supabase/functions/handle-lead/index.ts` — вернуть синхронный поток
- Убрать `EdgeRuntime.waitUntil(backgroundWork)` и обвязку с `@ts-ignore`.
- Убрать отдельный `pushNotification` с `AbortController`/таймаутом 4с в фоне.
- Вернуть последовательный/синхронный вызов уведомлений до ответа клиенту: `await sendTelegramNotification(...)`, `await sendLeadToCrm(...)`, и обычный `fetch` на push без фонового запуска.
- Ответ `{ success: true, lead_id: data.id }` отдаётся после того, как уведомления отработали (как было раньше).
- CORS-логика через `getCorsHeaders(origin)` и rate-limit остаются без изменений.

### Что НЕ делаю
- Не трогаю `HeroCallbackForm`, `LeadFormModal`, `ServiceQuiz`, никакие SEO-файлы, роутинг, `seoRoutes.ts`, sitemap, sw.js, nginx, Docker.
- Не добавляю новых «улучшений мобильной отправки» в этом заходе.
- Не меняю `supabase/config.toml`.

### После отката
1. Дождаться, пока пройдёт сборка и деплой.
2. Проверить отправку с iPhone в режиме инкогнито на `https://goruslugimsk.ru/`.
3. Если «Сервер не отвечает» ушло — фиксируем это как baseline и только потом обсуждаем точечные мобильные улучшения по одному изменению за раз.

### Технические детали (для справки)
- `vite-plugin-ssg.ts`: цикл превращается обратно в `for (const route of routes) { await renderRoute(route); }`, без `process.env.SSG_CONCURRENCY` и без прогресс-логов раз в 100 страниц.
- `SimpleCalculator.tsx`: `handleSubmit` вызывает только `supabase.functions.invoke("handle-lead", { body: leadData })`, ошибка SDK → `setFormStatus("error")`.
- `handle-lead/index.ts`: после `supabase.from("leads").insert(...).select().single()` идёт обычный `await sendTelegramNotification(leadData)`, `await sendLeadToCrm(leadData)`, опциональный `await fetch('https://goruslugimsk.ru/api/push/send', ...)` в try/catch, и только потом `return new Response({ success: true, lead_id })`.

Если одобряешь — выполняю откат тремя правками в одном заходе и больше ничего в этой итерации не меняю.