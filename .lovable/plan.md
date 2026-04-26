Проблема подтверждена по скриншоту GitHub Actions: сборка не упала на Docker build и не зависла. Она дошла до Smoke check и упала из-за отсутствующих файлов:

```text
Pages in image: 1143
OK: uslugi/dezinsekciya/klopy/index.html
OK: uslugi/dezinsekciya/blohi/index.html
OK: uslugi/deratizaciya/krysy/index.html
OK: uslugi/dezinfekciya/kvartir/index.html
MISSING: rajony/arbat/index.html
OK: moscow-oblast/khimki/index.html
OK: blog/klopy-v-kvartire/index.html
OK: sluzhba-dezinsekcii/index.html
MISSING: rajony/maryino/index.html
Error: Process completed with exit code 1
```

То есть текущая причина красной сборки — не Docker, не cache, не provenance, а мой smoke-check, который проверяет страницы `/rajony/arbat/` и `/rajony/maryino/`, но они не попали в `dist`, хотя общий SSG сгенерировал 1143 страницы.

Что, скорее всего, произошло: после добавления fail-fast проверки на `BreadcrumbList` страницы `/rajony/*` стали не записываться, потому что `NeighborhoodPage.tsx` генерирует BreadcrumbList дважды:

1. В `<Helmet>` через `generateBreadcrumbLD(...)`.
2. В визуальном компоненте `<Breadcrumbs items={breadcrumbItems} />`, где `showSchema` по умолчанию `true`.

Из-за этого `vite-plugin-ssg.ts` считает страницу ошибочной и пропускает запись файла. Smoke check затем честно ловит отсутствие `rajony/arbat/index.html` и `rajony/maryino/index.html`.

## План исправления

1. Исправить дубли BreadcrumbList на страницах районов:
   - В `src/pages/NeighborhoodPage.tsx` оставить JSON-LD BreadcrumbList в `<Helmet>` как основной источник.
   - Для визуальных хлебных крошек заменить:
     ```tsx
     <Breadcrumbs items={breadcrumbItems} />
     ```
     на:
     ```tsx
     <Breadcrumbs items={breadcrumbItems} showSchema={false} />
     ```
   - Это должно вернуть генерацию `dist/rajony/arbat/index.html` и `dist/rajony/maryino/index.html`.

2. Проверить другие страницы, где может быть такая же двойная генерация:
   - `NeighborhoodsOverview.tsx`: сейчас есть `breadcrumbSchema` в `<Helmet>` и `<Breadcrumbs />` с `showSchema=true`; нужно сделать визуальные крошки `showSchema={false}`.
   - Страницы, где JSON-LD уже приходит через `SEOHead`/`metadata.schema`, должны использовать `Breadcrumbs showSchema={false}`.
   - Страницы, где отдельного BreadcrumbList нет, могут продолжать использовать `Breadcrumbs` как единственный источник схемы.

3. Усилить SSG-логи, чтобы больше не гадать:
   - В `vite-plugin-ssg.ts` при `validation.errors` печатать не только ошибку, но и `route.outputPath`.
   - В конце SSG печатать первые 20 failed routes.
   - Это позволит сразу видеть, какие страницы не были записаны до smoke-check.

4. Сделать smoke-check точнее:
   - Оставить проверку критичных страниц, включая `/rajony/arbat/` и `/rajony/maryino/`, потому что она сейчас правильно нашла регрессию.
   - Добавить перед проверкой вывод дерева `rajony/` в контейнере при отсутствии файла, например `ls -la /usr/share/nginx/html/rajony | head`, чтобы в логе было видно: не создана вся ветка или только конкретные районы.

5. После правок запустить локальную проверку сборки:
   - `npm run build`
   - проверить наличие:
     ```text
     dist/rajony/arbat/index.html
     dist/rajony/maryino/index.html
     dist/moscow-oblast/khimki/index.html
     ```
   - проверить, что на `/rajony/arbat/` и `/rajony/maryino/` ровно один `BreadcrumbList` и ровно один canonical.

6. Если локальная сборка подтвердит исправление — оставить Dockerfile как есть:
   - текущий Dockerfile правильный для этой стадии: он только копирует готовый `dist/`, без `npm run build` внутри Docker.
   - текущая красная сборка уже доказала, что образ собирается, а падает именно smoke-check из-за отсутствующих SSG-файлов.

## Технический вывод

Причина текущего падения доказана логом: `MISSING: rajony/arbat/index.html` и `MISSING: rajony/maryino/index.html` в smoke-check. Причина отсутствия этих файлов в коде — конфликт новой fail-fast проверки `BreadcrumbList` с двойной генерацией хлебных крошек на страницах районов. Нужно не ослаблять smoke-check, а исправить источник дублей и добавить более явный отчет failed routes в SSG.