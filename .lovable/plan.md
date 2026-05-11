# Fix 1: Дубликаты BreadcrumbList на подстраницах + Fix 2: Снять noindex с `/blog/klopy-v-kvartire/`

## Что нашёл

### 1) Дубликаты BreadcrumbList (8 URL)
В `index.html` (строки 80–368) лежит большой `<script type="application/ld+json">` с `@graph`, который содержит `LocalBusiness`, `WebSite`, `BreadcrumbList` главной и кучу `Service`. Этот блок шаблонный — SSG копирует его **в каждую** сгенерированную страницу. На страницах услуг/районов/блога дополнительно рендерится свой корректный `BreadcrumbList` (через `<Breadcrumbs>` или `metadata.schema`) → в HTML оказывается **2× BreadcrumbList**.

В `mem://seo/ssg-schema-isolation` правило зафиксировано, но соответствующего шага в `vite-plugin-ssg.ts` нет — отсюда регрессия.

### 2) `/blog/klopy-v-kvartire/` помечен `noindex`
В `BlogPost.tsx` (`hasCommercialOverlap`) слово «**уничтожить**» в заголовке статьи срабатывает как `STRONG_COMMERCIAL` маркер и принудительно выставляет `noindex, follow`. Статья при этом — приоритетная информационная (упомянута во внутренних связках, у неё LLM-summary, автор и FAQ).

## Что сделаю

### Fix 1 — изоляция шаблонного `@graph` на этапе SSG

**`vite-plugin-ssg.ts`** — после `replaceHeadTags(...)` и до `validateHtml(...)`:
- Если `route.path !== '/'`, удалить из `html` ровно один `<script type="application/ld+json">…</script>`, содержащий уникальный анкер шаблонного блока — `"@id": "https://goruslugimsk.ru/#organization-entity"`. Регексп с не-жадным `[\s\S]*?` + проверка наличия маркера. Если маркер не найден — ничего не трогаем.
- Главная (`/`) не меняется — её `@graph` остаётся.
- Логика страниц (`Breadcrumbs.tsx`, `metadata.ts`, `internalLinking.ts`) не меняется.

Дополнительно (защита от регрессий): в `validateHtml` поднять текущий warning `Duplicate BreadcrumbList JSON-LD` до ошибки, проваливающей CI, при `breadcrumbCount > 1`. Случай «0» не трогаем.

### Fix 2 — индексировать `/blog/klopy-v-kvartire/`

**`src/pages/BlogPost.tsx`** — добавить узкий white-list приоритетных info-слугов:
```ts
const HIGH_VALUE_BLOG_SLUGS = new Set<string>(['klopy-v-kvartire']);
```
И в вычислении `shouldNoindex`:
```ts
const shouldNoindex = !HIGH_VALUE_BLOG_SLUGS.has(post.slug)
  && (isCommercialOverlap || isLowValueCluster);
```
Глобальные эвристики `hasCommercialOverlap` / `isLowValueBlogSlug` не трогаем — поведение остальных статей сохраняется.

## Чего НЕ трогаю

- `index.html` (большой `@graph` нужен главной).
- `<Breadcrumbs>`, `metadata.ts`, `internalLinking.ts`, schema-генераторы страниц.
- `seoRoutes.ts`, sitemap, _redirects, nginx.
- Эвристики анти-каннибализации блога — только адресный whitelist.

## Ожидаемый результат

После пересборки и деплоя:
- На `/uslugi/dezinsekciya/`, `/uslugi/dezinsekciya/klopy/`, `/uslugi/dezinsekciya/ofisov/`, `/uslugi/dezinfekciya-cao/`, `/moscow-oblast/`, `/moscow-oblast/podolsk/`, `/uslugi/borba-s-krotami/khimki/`, `/blog/klopy-v-kvartire/` — ровно **1** `BreadcrumbList`.
- `/` — `BreadcrumbList` главной остаётся (1 шт).
- `/blog/klopy-v-kvartire/` — `meta robots` = `index, follow, ...`.
- Мониторинг: 9 CRITICAL → 0.
