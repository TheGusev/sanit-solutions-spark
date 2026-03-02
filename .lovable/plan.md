

## Диагноз: почему 404 на production

### Корневая причина: `AppSSR.tsx` покрывает только 6 маршрутов

`AppSSR.tsx` содержит всего 6 роутов:
- `/`, `/blog`, `/blog/:slug`, `/privacy`, `/uslugi/:slug`, `/contacts`

Все остальные URL (включая `/uslugi/dezinsekciya/klopy`, `/rajony/arbat`, `/moscow-oblast/khimki`) попадают в `<Route path="*" element={<NotFound />} />`.

SSG-плагин вызывает `render("/uslugi/dezinsekciya/klopy")` → AppSSR не находит роут → рендерит NotFound → валидация отбрасывает (мало слов, нет title) → **файл НЕ записывается в dist/** → nginx не находит файл → **404**.

### Вторичная проблема: два источника маршрутов

`vite-plugin-ssg.ts` использует свою локальную функцию `getAllRoutes()` (строка 576), а не `getAllSSGRoutes()` из `seoRoutes.ts`. Списки расходятся: в seoRoutes больше slug'ов, подстраниц и объектов.

### Что НЕ нужно менять

- **nginx.conf** — корректен. `try_files $uri $uri/ $uri/index.html =404` работает правильно, если файлы существуют. Добавлять `/index.html` fallback нельзя — это сломает SEO (мусорные URL будут отдавать 200).
- **Dockerfile** — корректен.
- **`public/_redirects`** — уже исправлен (`/* /index.html 200`), для Lovable preview работает.

### План исправления (2 файла)

**1. `src/AppSSR.tsx` — добавить ВСЕ публичные роуты из App.tsx**

Импортировать и добавить роуты для:
- `/uslugi/:parentSlug/:subSlug` → ServiceRouteResolver (или ServicePage как fallback для SSR)
- `/uslugi/:service/:segment2/:segment3` → ThreeSegmentRouteResolver (или ServicePage)
- `/uslugi/obrabotka-uchastkov` → ServiceLandingUchastkiPage
- `/uslugi/po-okrugam-moskvy` → DistrictsOverview
- `/rajony` → NeighborhoodsOverview
- `/rajony/:slug` → NeighborhoodPage
- `/moscow-oblast` → MoscowRegionOverview
- `/moscow-oblast/:citySlug` → MoscowRegionCityPage
- `/moscow-oblast/:citySlug/:serviceSlug` → MoscowRegionServicePage
- `/sluzhba-dezinsekcii` → ServiceSESPage
- `/otzyvy` → ReviewsPage
- `/terms` → Terms

Порядок роутов должен точно повторять App.tsx (статические перед параметрическими).

**2. `vite-plugin-ssg.ts` — синхронизировать списки slug'ов с `seoRoutes.ts`**

Обновить локальные массивы в SSG-плагине, чтобы они совпадали с `seoRoutes.ts`:
- `dezinsekciyaPestSlugs`: добавить `komary`, `muhi`, `osy-shershni`, `cheshuynitsy`, `kleshchi`, `mokricy` (сейчас только 5, в seoRoutes 11)
- `serviceSubpageRoutes`: добавить квалификаторы и методы обработки (12 доп. записей)
- `objectSlugs`: добавить `gostinic`, `detskih-sadov`, `hostela`, `magazinov`, `avtomobiley` (сейчас 6, в seoRoutes 11)
- `moscowRegionCitySlugs`: добавить `klin`, `ramenskoe`, `chekhov`, `domodedovo` (сейчас 10, в seoRoutes 14)
- `neighborhoodSlugs`: синхронизировать с seoRoutes (проверить различия)
- `blogSlugs`: добавить недостающие статьи (b2b, safety, diy-failure, llm-unique — ~27 статей)
- Добавить генерацию маршрутов для `/uslugi/dezinfekciya/{neighborhood}` (130 районов) — есть в seoRoutes, отсутствует в SSG-плагине
- Добавить статические роуты: `/sluzhba-dezinsekcii`, `/otzyvy`, `/uslugi/obrabotka-uchastkov`, `/terms`

### Результат

После этих двух правок SSG сгенерирует все ~900+ HTML-файлов в dist/, nginx найдёт их через `try_files`, и 404 при F5 исчезнет.

