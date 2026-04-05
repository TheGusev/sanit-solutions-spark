

# Усиление внутренней перелинковки — Phase 1

## Обзор

Создаём централизованную систему перелинковки, которая заменяет текущий "all-purpose" `InternalLinks.tsx` на набор специализированных блоков. Каждый блок появляется только там, где он логически уместен. Текущая архитектура (noindex/index, canonical, sitemap, SSG, paid-traffic) не затрагивается.

## Текущее состояние

Сейчас перелинковка реализована через один компонент `InternalLinks.tsx`, который генерирует 12-16 ссылок автоматически (pest, neighborhood, service, district, city, blog, hub, moleCity). Проблемы:
- Один блок на все типы страниц — нет кластерной логики
- Ссылки на noindex NCH Tier 2/3 (через `topNeighborhoods`)
- Случайная ротация через `seededShuffle` — SEO-непредсказуемо
- До 16 ссылок в одном блоке без разделения по интенту

`Breadcrumbs.tsx` уже есть, но без BreadcrumbList schema.org. ServicePage использует ui/breadcrumb.tsx (shadcn) с schema. ServicePestPage использует кастомный Breadcrumbs.tsx без schema.

## Что создаётся / меняется

### 1. Новый файл: `src/lib/internalLinking.ts` — централизованная логика

Определяет:
- `getPageCluster(pathname)` — возвращает тип кластера (service-hub, pest-page, object-page, geo-hub, geo-city, blog, ses)
- `getRelatedServices(serviceSlug, pestSlug?)` — 3-6 релевантных услуг из того же кластера, только indexable
- `getRelatedPests(serviceSlug, currentPest)` — до 4 related pests из `pest.relatedPests`
- `getRelatedGeoLinks(serviceSlug, pestSlug?)` — 6-8 top neighborhoods + "Все районы" + 2-4 города МО
- `getRelatedBlogLinks(serviceSlug, pestSlug?)` — 2-3 статьи из `getRelatedArticlesForPest/Service`
- `getRelatedObjects(serviceSlug)` — 4-6 indexable object pages
- `isSeoLinkable(path)` — проверяет что target indexable (исключает tier2/3 NCH, privacy, terms, admin)
- `getBreadcrumbItems(pathname)` — генерирует breadcrumb chain по URL-структуре

Ключевой принцип: все функции фильтруют через `isSeoLinkable()` — noindex страницы никогда не попадают в выдачу.

### 2. Обновление: `src/components/Breadcrumbs.tsx` — добавить BreadcrumbList schema

Текущий компонент работает визуально, но не генерирует JSON-LD. Добавляем:
- `<script type="application/ld+json">` с BreadcrumbList schema
- Проп `showSchema?: boolean` (default true) чтобы не дублировать schema на страницах где она уже в SEOHead

### 3. Новый компонент: `src/components/RelatedServices.tsx`

- Принимает `serviceSlug`, `pestSlug?`
- Отображает 3-6 карточек смежных услуг
- Для pest pages: другие вредители того же сервиса + parent service hub
- Для service hubs: pest pages этого сервиса
- Для borba-s-krotami: obrabotka-uchastkov + MO hubs
- Exclude: noindex, current page, unrelated clusters
- Заголовок: "Смежные услуги" / "С какими проблемами ещё обращаются"

### 4. Новый компонент: `src/components/RelatedGeoLinks.tsx`

- Принимает `serviceSlug?`, `pestSlug?`
- Отображает 6-8 top neighborhoods (только из indexable Tier 1) + кнопку "Все районы →"
- Опционально 2-4 города МО
- Заголовок: "Работаем по районам Москвы"
- Не выводит NCH Tier 2/3 ссылки

### 5. Новый компонент: `src/components/RelatedBlogLinks.tsx`

- Принимает `serviceSlug?`, `pestSlug?`
- Показывает 2-3 релевантные статьи (карточки)
- Использует existing `getRelatedArticlesForPest/Service`

### 6. Обновление страниц (подключение новых блоков)

**ServicePage.tsx** (service hubs):
- Уже имеет: breadcrumbs (shadcn), related services, related articles, district links
- Добавить: `RelatedGeoLinks` (заменяет текущий hardcoded блок округов с неправильными ссылками — сейчас все ведут на `dezinfekciya-*` даже для dezinsekciya)
- Заменить `InternalLinks` на `RelatedBlogLinks` (если related articles уже есть — не дублировать)

**ServicePestPage.tsx** (pest pages):
- Уже имеет: breadcrumbs (кастомные), related articles, district links, InternalLinks
- Добавить: `RelatedServices` (related pests из `pest.relatedPests` + parent hub)
- Обновить: district links — фильтровать только indexable NCH (Tier 1)
- Заменить: `InternalLinks` на `RelatedGeoLinks` + `RelatedBlogLinks`

**ServiceObjectPage.tsx** (object pages):
- Уже имеет: breadcrumbs, InternalLinks
- Добавить: `RelatedServices` (другие объекты того же сервиса)

**NeighborhoodsOverview.tsx** (/rajony):
- Уже имеет: breadcrumbs, InternalLinks
- Добавить: compact service cluster links (клопы, тараканы, дезинсекция)

**MoscowRegionOverview.tsx** (/moscow-oblast):
- Уже имеет: breadcrumbs, InternalLinks
- Заменить: `InternalLinks` на `RelatedServices` (top services only)

### 7. Исправление бага: ServicePage district links

Текущий код (строка 737):
```
<Link to={`/uslugi/dezinfekciya-${slugs[idx]}`}>
```
Это ВСЕГДА ссылается на дезинфекцию, даже для страницы дезинсекции или дератизации. Нужно:
```
<Link to={`/uslugi/${service.slug}-${slugs[idx]}`}>
```
(только для 3 основных сервисов: dezinfekciya, dezinsekciya, deratizaciya)

### 8. Fix build error: vite-plugin-ssg.ts line 394

Добавить тип `route` в forEach:
```typescript
routes.forEach((route: { path: string; outputPath: string }) => {
```

## Что НЕ меняется

- URL, slugs, canonical — без изменений
- robots/meta robots, noindex логика — без изменений  
- sitemap rules — без изменений
- SSG generation, seoRoutes.ts — без изменений
- Paid-traffic personalization — без изменений
- H1/title/description — без изменений
- JSON-LD (кроме добавления BreadcrumbList где нет)
- Существующий InternalLinks.tsx — сохраняется для страниц где новые блоки ещё не внедрены

## Файлы

| Действие | Файл |
|----------|------|
| Создать | `src/lib/internalLinking.ts` |
| Создать | `src/components/RelatedServices.tsx` |
| Создать | `src/components/RelatedGeoLinks.tsx` |
| Создать | `src/components/RelatedBlogLinks.tsx` |
| Изменить | `src/components/Breadcrumbs.tsx` — добавить schema |
| Изменить | `src/pages/ServicePage.tsx` — fix district links bug, add RelatedGeoLinks |
| Изменить | `src/pages/ServicePestPage.tsx` — add RelatedServices, filter NCH links |
| Изменить | `src/pages/ServiceObjectPage.tsx` — add RelatedServices |
| Изменить | `vite-plugin-ssg.ts` — fix TS error line 394 |

## Результат для 10 priority pages

| Страница | Новые блоки |
|----------|-------------|
| `/` | Без изменений (уже хорошо) |
| `/uslugi/dezinsekciya/` | Fix district links + RelatedGeoLinks |
| `/uslugi/dezinsekciya/klopy/` | RelatedServices (tarakany, blohi, mol) + filtered geo |
| `/uslugi/dezinsekciya/tarakany/` | RelatedServices (klopy, muravyi, blohi) + filtered geo |
| `/uslugi/dezinsekciya/muravyi/` | RelatedServices + filtered geo |
| `/uslugi/dezinsekciya/blohi/` | RelatedServices + filtered geo |
| `/uslugi/deratizaciya/` | Fix district links |
| `/uslugi/deratizaciya/krysy/` | RelatedServices (myshi, deratizaciya hub) |
| `/uslugi/deratizaciya/myshi/` | RelatedServices (krysy, deratizaciya hub) |
| `/uslugi/borba-s-krotami/` | RelatedServices (obrabotka-uchastkov) |
| `/uslugi/obrabotka-uchastkov/` | RelatedServices (borba-s-krotami) |
| `/uslugi/dezinfekciya/` | Fix district links |
| `/rajony/` | Compact service cluster entries |
| `/moscow-oblast/` | Targeted RelatedServices |
| `/sluzhba-dezinsekcii/` | RelatedServices |

