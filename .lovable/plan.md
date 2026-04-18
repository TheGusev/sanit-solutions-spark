
Цель: убрать все текущие алерты в MONITORING и синхронизировать runtime/public/monitor логику без ломки core routing.

## Что реально происходит сейчас

1. `/uslugi/dezinfekciya-cao/`
- В проекте есть два слоя для этих страниц: React `DistrictPage` и статический `public/uslugi/dezinfekciya-cao/index.html`.
- На хостинге при наличии реального файла будет отдаваться именно static HTML.
- У static-файла есть обычный breadcrumb в HTML, но нет JSON-LD `BreadcrumbList`, поэтому warning по schema реален.
- Alert про missing canonical, скорее всего, вызван либо stale deployed asset, либо несовпадением monitor/runtime; я всё равно нормализую static district pages целиком, чтобы убрать drift.

2. `/uslugi/sertifikaciya/`
- Это excluded/noindex page.
- По памяти проекта на noindex/utility страницах breadcrumb schema должна быть подавлена.
- Значит warning про отсутствующий `BreadcrumbList` тут ложный и должен исчезнуть через правку monitor, а не через добавление schema.

3. `Sync 9 путей отсутствуют в sitemap`
- Здесь смешаны реальные и ложные расхождения.
- Ложные:
  - `/privacy/`, `/terms/` — noindex utility pages, им не место в sitemap.
  - `/uslugi/demerkurizaciya/avtomobiley/`, `/.../detskih-sadov/` и ещё 4 подобных — monitor сейчас не учитывает pruning для demerkurizaciya-objects.
- Реальное:
  - `/uslugi/borba-s-krotami/khimki/` — `seoRoutes.ts` берёт 24 города из `moleCities.ts`, а `vite-plugin-sitemap.ts` всё ещё держит hardcoded список на 23 города.

## План исправления

### 1) Исправить monitor.py
Обновлю логику мониторинга так, чтобы он проверял только то, что действительно должно существовать и индексироваться:
- исключу noindex utility pages (`/privacy/`, `/terms/`, `/uslugi/sertifikaciya/`) из требований к sitemap и breadcrumb schema;
- добавлю ту же pruning-логику для `demerkurizaciya`, что уже есть в route generation/sitemap logic;
- сохраню жёсткую проверку `BreadcrumbList` только для indexable public pages;
- оставлю `khimki` как реальную sync-проверку, пока sitemap не будет исправлен.

Результат: исчезнут ложные warnings/critical из monitor.

### 2) Исправить sitemap sync
Обновлю `vite-plugin-sitemap.ts`, чтобы он использовал тот же источник mole-city slug’ов, что и `seoRoutes.ts`:
- вместо hardcoded 23 mole cities — данные из `src/data/moleCities.ts`;
- после этого `khimki` попадёт в sitemap и sync drift уйдёт.

Это единственное изменение в sitemap-логике, и оно напрямую запрошено пользователем.

### 3) Исправить district static pages
Приведу все district static HTML к одному SEO-стандарту:
- файлы `public/uslugi/{dezinfekciya,dezinsekciya,deratizaciya}-{district}/index.html` (36 страниц);
- у каждой страницы проверю и нормализую:
  - self-referencing canonical с trailing slash,
  - `og:url` = canonical,
  - JSON-LD `BreadcrumbList` по централизованному стандарту,
  - отсутствие конфликтов между visual breadcrumbs и schema.

Результат: `/uslugi/dezinfekciya-cao/` перестанет падать по canonical/schema и тот же фикс распространится на весь district cluster, а не только на один URL.

## Файлы, которые буду править

- `scripts/monitor.py`
- `vite-plugin-sitemap.ts`
- `public/uslugi/dezinfekciya-*/index.html`
- `public/uslugi/dezinsekciya-*/index.html`
- `public/uslugi/deratizaciya-*/index.html`

## Что не трогаю

- `src/lib/seoRoutes.ts`
- core routing в `App.tsx`
- SSG pipeline кроме точечной синхронизации sitemap с `moleCities.ts`

## Проверка после правок

После внедрения прогоню монитор ещё раз и ожидаю:
- исчезает CRITICAL по `/uslugi/dezinfekciya-cao/`;
- исчезает warning по `/uslugi/sertifikaciya/`;
- sync mismatch падает до `0`;
- `khimki` появляется в sitemap;
- новый `MONITORING.md` становится без этих текущих алертов.
