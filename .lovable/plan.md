

# Phase 3: Замена InternalLinks на модульные блоки

## Scope — 5 страниц

| Страница | Текущее | Замена |
|----------|---------|--------|
| `BlogPost.tsx` | `InternalLinks` с tag-detection | `RelatedServices` (по тегам) + `RelatedBlogLinks` (уже есть RelatedArticles — не дублировать) |
| `Blog.tsx` | `InternalLinks` без параметров | `RelatedServices` для dezinsekciya (основной кластер) + `RelatedGeoLinks` |
| `NeighborhoodPage.tsx` | `InternalLinks currentNeighborhood + currentService` | `RelatedServices serviceSlug="dezinsekciya"` + `RelatedGeoLinks` + `RelatedBlogLinks` |
| `MoscowRegionCityPage.tsx` | `InternalLinks currentCity` | `RelatedServices` + `RelatedGeoLinks` (без MO — мы уже на MO странице) |
| `ServiceLandingUchastkiPage.tsx` | `InternalLinks currentService="obrabotka-uchastkov"` | `RelatedServices serviceSlug="obrabotka-uchastkov"` + `RelatedGeoLinks serviceSlug="obrabotka-uchastkov"` + `RelatedBlogLinks` |

## Детали по файлам

### 1. `src/pages/BlogPost.tsx`

Заменить строки 384-395 (`InternalLinks` с tag-detection logic):
```tsx
<RelatedServices
  serviceSlug={
    post.tags?.some(t => t.toLowerCase().includes('тараканы') || t.toLowerCase().includes('клопы') || t.toLowerCase().includes('блохи'))
      ? 'dezinsekciya'
      : post.tags?.some(t => t.toLowerCase().includes('крыс') || t.toLowerCase().includes('мыш'))
        ? 'deratizaciya'
        : 'dezinsekciya'
  }
  title="Полезные ссылки"
/>
```
НЕ добавляем `RelatedBlogLinks` — на строке 374 уже есть `<RelatedArticles>` который делает то же самое. Добавляем `RelatedGeoLinks` без параметров (fallback на `/rajony/` ссылки).

### 2. `src/pages/Blog.tsx`

Заменить строку 291 (`<InternalLinks />` без параметров):
```tsx
<RelatedServices serviceSlug="dezinsekciya" title="Наши услуги" />
<RelatedGeoLinks title="Работаем по всей Москве" />
```
Blog index — хаб-страница, ей уместно дать 2 блока: услуги (основной коммерческий кластер) + гео.

### 3. `src/pages/NeighborhoodPage.tsx`

Заменить строки 706-712 (`InternalLinks currentNeighborhood + currentService`):
```tsx
<RelatedServices serviceSlug="dezinsekciya" />
<RelatedGeoLinks serviceSlug="dezinsekciya" />
<RelatedBlogLinks serviceSlug="dezinsekciya" />
```
Neighborhood page — гео-страница, линкуем на коммерческие услуги + другие районы + статьи.

### 4. `src/pages/MoscowRegionCityPage.tsx`

Заменить строки 302-306 (`InternalLinks currentCity`):
```tsx
<RelatedServices serviceSlug="dezinsekciya" title="Наши услуги в Москве" />
<RelatedGeoLinks title="Районы Москвы" />
<RelatedBlogLinks serviceSlug="dezinsekciya" />
```
MO city page — гео-страница МО, линкуем на московские услуги + районы + статьи.

### 5. `src/pages/ServiceLandingUchastkiPage.tsx`

Заменить строку 279 (`InternalLinks currentService="obrabotka-uchastkov"`):
```tsx
<RelatedServices serviceSlug="obrabotka-uchastkov" />
<RelatedGeoLinks serviceSlug="obrabotka-uchastkov" />
<RelatedBlogLinks serviceSlug="obrabotka-uchastkov" />
```

### 6. `src/lib/internalLinking.ts` — без изменений

Все нужные функции (`getRelatedServices`, `getRelatedGeoLinks`, `getRelatedBlogLinks`) уже реализованы.

## Что НЕ меняется

- URL, canonical, robots, noindex, sitemap — без изменений
- Компонент `InternalLinks.tsx` — НЕ удаляем (ещё используется в DistrictPage, NchPage, MoleCityPage, MoscowRegionServicePage, DistrictsOverview, ServiceSubpage — Phase 4)
- Paid-traffic logic — без изменений
- Новые страницы не создаются

## Файлы

| Действие | Файл |
|----------|------|
| Изменить | `src/pages/BlogPost.tsx` |
| Изменить | `src/pages/Blog.tsx` |
| Изменить | `src/pages/NeighborhoodPage.tsx` |
| Изменить | `src/pages/MoscowRegionCityPage.tsx` |
| Изменить | `src/pages/ServiceLandingUchastkiPage.tsx` |

