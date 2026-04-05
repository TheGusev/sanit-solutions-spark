

# Phase 2: RelatedBlogLinks, SES page update, FAQ с контекстными ссылками

## Что делаем

### 1. ServicePage.tsx — добавить RelatedBlogLinks

ServicePage уже имеет inline related articles блок (строки 680-722). Этот блок дублирует функционал `RelatedBlogLinks`, поэтому НЕ добавляем второй. Вместо этого — **заменяем** inline блок на компонент `RelatedBlogLinks` для консистентности и использования централизованной логики.

Место: после секции "Другие услуги" (строка 800), перед `RelatedGeoLinks` (строка 802).

### 2. ServicePestPage.tsx — заменить inline articles на RelatedBlogLinks

ServicePestPage имеет inline articles блок (строки 449-494) + дублирующийся old Districts Links блок (строки 496-519, уже отмечен в QA как Issue 1).

Изменения:
- **Удалить** old Districts Links блок (строки 496-519) — дубль RelatedGeoLinks, линкует на noindex NCH для Tier 2/3
- **Заменить** inline articles блок (строки 449-494) на `<RelatedBlogLinks serviceSlug={service} pestSlug={pestSlug} />`
- **Исправить** duplicate BreadcrumbList schema: добавить `showSchema={false}` в `<Breadcrumbs>` (строка 214), т.к. hardcoded breadcrumbSchema уже в metadata

### 3. ServiceSESPage.tsx — заменить InternalLinks на новые блоки

Текущее состояние: использует `<InternalLinks currentService="dezinsekciya" />` (строка 188).

Замена на:
- `<RelatedServices serviceSlug="dezinsekciya" />` — покажет pest pages дезинсекции
- `<RelatedGeoLinks serviceSlug="dezinsekciya" />` — покажет районы + МО
- `<RelatedBlogLinks serviceSlug="dezinsekciya" />` — покажет 2-3 статьи

Также добавить BreadcrumbList schema в metadata (сейчас есть shadcn breadcrumbs визуально, но нет JSON-LD).

### 4. FAQ с контекстными ссылками на ServicePestPage

ServicePestPage уже имеет FAQ блок (строки 378-421) с 4 вопросами. Сейчас ответы — plain text без ссылок.

Добавить контекстные ссылки (max 2 на весь FAQ):
- В ответ на "Сколько стоит?" — добавить ссылку на parent service hub: `Подробнее о ценах на [услугу](/uslugi/{service}/)`
- В ответ на "Безопасна ли обработка?" — добавить ссылку на блог: `Читайте подробнее в статье о [подготовке помещения](/blog/kak-podgotovit-pomeshchenie/)`

Аналогично для ServiceSESPage FAQ (строки 47-53) — добавить 1-2 контекстные ссылки в ответы.

## Файлы

| Действие | Файл |
|----------|------|
| Изменить | `src/pages/ServicePage.tsx` — заменить inline articles на RelatedBlogLinks |
| Изменить | `src/pages/ServicePestPage.tsx` — удалить old Districts, заменить inline articles на RelatedBlogLinks, fix breadcrumb schema, FAQ links |
| Изменить | `src/pages/ServiceSESPage.tsx` — заменить InternalLinks на RelatedServices + RelatedGeoLinks + RelatedBlogLinks, FAQ links, breadcrumb schema |

## Что НЕ меняется

- URL, canonical, robots, noindex, sitemap — без изменений
- H1/title/description — без изменений
- Paid-traffic logic — без изменений
- Новые страницы не создаются

