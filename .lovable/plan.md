

# Phase 1 Internal Linking — Current Implementation Status Report

## 1. СПИСОК ИЗМЕНЁННЫХ / СОЗДАННЫХ ФАЙЛОВ

| Файл | Статус |
|------|--------|
| `src/lib/internalLinking.ts` | **Created** — централизованная логика перелинковки |
| `src/components/RelatedServices.tsx` | **Created** — блок смежных услуг (3-6 карточек) |
| `src/components/RelatedGeoLinks.tsx` | **Created** — блок гео-ссылок (6-8 районов + МО) |
| `src/components/RelatedBlogLinks.tsx` | **Created** — блок статей (2-3 карточки) |
| `src/components/Breadcrumbs.tsx` | **Updated** — добавлен BreadcrumbList JSON-LD schema |
| `src/pages/ServicePage.tsx` | **Updated** — fix district links bug + RelatedGeoLinks |
| `src/pages/ServicePestPage.tsx` | **Updated** — RelatedServices + RelatedGeoLinks |
| `src/pages/ServiceObjectPage.tsx` | **Updated** — RelatedServices |
| `src/pages/NeighborhoodsOverview.tsx` | **Updated** — RelatedServices (dezinsekciya + deratizaciya) |
| `src/pages/MoscowRegionOverview.tsx` | **Updated** — RelatedServices |
| `vite-plugin-ssg.ts` | **Updated** — fix TS error line 394 |

## 2. HELPER FUNCTIONS (все в `src/lib/internalLinking.ts`)

| Функция | Назначение |
|---------|-----------|
| `isSeoLinkable(path)` | Проверяет indexable target: исключает admin, privacy, terms, login, NCH Tier 2/3 |
| `getPageCluster(pathname)` | Определяет тип кластера: service-hub, pest-page, object-page, geo-hub, geo-city, blog, ses, other |
| `getRelatedServices(serviceSlug, pestSlug?)` | 3-6 related services из того же кластера |
| `getRelatedGeoLinks(serviceSlug?, pestSlug?)` | 6-8 top neighborhoods + 2-3 MO cities |
| `getRelatedBlogLinks(serviceSlug?, pestSlug?)` | 2-3 релевантных статей |
| `getRelatedObjects(serviceSlug, currentObjectSlug?)` | 4-6 indexable object pages |
| `getBreadcrumbItems(pathname)` | Генерирует breadcrumb chain по URL |
| `generateBreadcrumbSchema(items)` | Генерирует BreadcrumbList JSON-LD |

## 3. ИСКЛЮЧЁННЫЕ ИЗ ПЕРЕЛИНКОВКИ

- `/admin/*` — utility
- `/privacy/` — utility
- `/terms/` — utility
- `/login` — utility
- NCH Tier 2 pests: `muravyi`, `blohi`, `mol` — noindex
- NCH Tier 3 pests: `komary`, `muhi`, `osy-shershni`, `cheshuynitsy`, `kleshchi`, `mokricy` — noindex
- Все 4-segment `/uslugi/service/pest/neighborhood/` где pest не в tier1Pests (`tarakany`, `klopy`, `krysy`, `myshi`)

Фильтрация через `isSeoLinkable()` — единый gate для всех helper functions.

## 4. БЛОКИ НА КАЖДОЙ СТРАНИЦЕ

**Page: `/`**
- Added blocks: нет (уже хорошо перелинкована, не трогали)

**Page: `/uslugi/dezinsekciya/`**
- Breadcrumbs: уже были (shadcn) с schema
- District links: **FIXED** — теперь ведут на `/uslugi/dezinsekciya-cao` (было: всегда `dezinfekciya-*`)
- RelatedGeoLinks: **ADDED** (8 top neighborhoods + "Все районы" + 3 MO cities)
- Related services: уже были (hardcoded в `service.relatedServices`)
- Related articles: уже были (из `getRelatedArticlesForService`)

**Page: `/uslugi/dezinsekciya/klopy/`**
- Breadcrumbs: уже были (кастомные, с BreadcrumbList schema после обновления)
- RelatedServices: **ADDED** (до 4 related pests: tarakany, blohi, muravyi + parent hub dezinsekciya)
- RelatedGeoLinks: **ADDED** (8 Tier 1 NCH neighborhoods для klopy + 3 MO cities)
- Related articles: уже были (inline, из `getRelatedArticlesForPest`)

**Page: `/uslugi/dezinsekciya/tarakany/`**
- Аналогично klopy: RelatedServices + RelatedGeoLinks **ADDED**

**Page: `/uslugi/deratizaciya/`**
- District links: **FIXED** — теперь `deratizaciya-cao` (было `dezinfekciya-cao`)
- RelatedGeoLinks: **ADDED**

**Page: `/uslugi/borba-s-krotami/`**
- RelatedGeoLinks: **ADDED** (neighborhoods через /rajony/, без MO — борьба с кротами excluded)
- District links: уже были, сохранены (fall back to dezinfekciya prefix — корректно т.к. нет `/uslugi/borba-s-krotami-cao`)

**Page: `/uslugi/obrabotka-uchastkov/`**
- RelatedGeoLinks: **ADDED** (neighborhoods + MO cities)

**Page: `/rajony/`**
- RelatedServices: **ADDED** — 2 блока: "Популярные услуги" (dezinsekciya pests) + "Борьба с грызунами" (deratizaciya pests)

**Page: `/moscow-oblast/`**
- RelatedServices: **ADDED** — блок "Наши услуги" (dezinsekciya pests: top 4)

**Page: `/sluzhba-dezinsekcii/`**
- Пока использует старый `InternalLinks` — **НЕ ОБНОВЛЕНА** (Phase 2 задача)

## 5. ИСТОЧНИКИ ВНУТРЕННИХ ССЫЛОК ДЛЯ 10 MONEY PAGES

**Target: `/uslugi/dezinsekciya/`**
- Receives from: `/` (header/menu), pest pages (parent hub link), `/rajony/` (RelatedServices), `/moscow-oblast/` (RelatedServices), blog articles, `/sluzhba-dezinsekcii/` (InternalLinks)

**Target: `/uslugi/dezinsekciya/klopy/`**
- Receives from: `/uslugi/dezinsekciya/` (pest listing), related pest pages via RelatedServices (tarakany→klopy), geo pages, blog articles about klopy

**Target: `/uslugi/dezinsekciya/tarakany/`**
- Receives from: `/uslugi/dezinsekciya/` (pest listing), klopy/blohi/muravyi RelatedServices blocks, geo pages, blog articles

**Target: `/uslugi/deratizaciya/`**
- Receives from: `/` (menu), pest pages (parent hub), `/rajony/` (RelatedServices "Борьба с грызунами"), blog

**Target: `/uslugi/deratizaciya/krysy/`**
- Receives from: `/uslugi/deratizaciya/` (pest listing), myshi RelatedServices, geo NCH pages

**Target: `/uslugi/deratizaciya/myshi/`**
- Receives from: `/uslugi/deratizaciya/` (pest listing), krysy RelatedServices, geo NCH pages

**Target: `/uslugi/borba-s-krotami/`**
- Receives from: `/uslugi/obrabotka-uchastkov/` (cross-link), header/menu

**Target: `/uslugi/obrabotka-uchastkov/`**
- Receives from: `/uslugi/borba-s-krotami/` (cross-link), header/menu

**Target: `/rajony/`**
- Receives from: RelatedGeoLinks "Все районы Москвы" button on ALL pest pages and service hubs

**Target: `/moscow-oblast/`**
- Receives from: RelatedGeoLinks "Все города МО" button on pest/service pages

## 6. ПОДТВЕРЖДЕНИЕ БЕЗОПАСНОСТИ

- **noindex logic**: untouched — `isSeoLinkable()` читает tier lists но не меняет robots meta
- **canonical**: untouched — ни один canonical тег не изменён
- **sitemap logic**: untouched — `seoRoutes.ts` и `vite-plugin-sitemap.ts` не изменены
- **no new URLs created**: подтверждено — только новые компоненты, маршруты не добавлялись
- **no paid-traffic logic changed**: подтверждено — TrafficContext и personalization не затронуты
- **no links to noindex pages**: подтверждено — `isSeoLinkable()` исключает NCH Tier 2/3

## 7. ТРИ ПРИМЕРА ФИЛЬТРАЦИИ

**Пример 1**: Почему `/uslugi/dezinsekciya/klopy/` НЕ получает ссылку на `/uslugi/demerkurizaciya/`
- `getRelatedServices('dezinsekciya', 'klopy')` берёт ТОЛЬКО `pest.relatedPests` у клопов + parent hub `dezinsekciya`
- `demerkurizaciya` не входит ни в `relatedPests` клопов, ни в тот же кластер
- Функция не перебирает "все услуги" — только cluster-specific targets

**Пример 2**: Почему NCH `/uslugi/dezinsekciya/muravyi/arbat/` исключена
- `isSeoLinkable('/uslugi/dezinsekciya/muravyi/arbat/')` → парсит 4 сегмента → проверяет `muravyi` в `tier1Pests` → НЕ найден (tier1 = tarakany, klopy, krysy, myshi) → return `false`
- Ссылка не попадёт ни в один блок

**Пример 3**: Почему current page исключена
- `getRelatedServices('dezinsekciya', 'klopy')` перебирает `pest.relatedPests` — там нет самого `klopy`
- Parent hub `/uslugi/dezinsekciya/` — это другая страница
- Дополнительно: если pest page сама = current, она не в своём `relatedPests` массиве

## 8. ЧТО ОСТАЛОСЬ НА PHASE 2

| Задача | Статус |
|--------|--------|
| `/sluzhba-dezinsekcii/` — заменить InternalLinks на RelatedServices + RelatedGeoLinks | Не сделано |
| RelatedBlogLinks — подключить на ServicePage и ServicePestPage (где нет дублирования с existing related articles) | Не сделано |
| FAQ с контекстными ссылками | Не сделано |
| RelatedObjects на service hubs | Не сделано |
| Body/CTA links в top pages | Не сделано |

Phase 1 реализована. Система работает, фильтрация корректна, SEO-архитектура сохранена.

