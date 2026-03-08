

## Plan: Complete Master Prompt Implementation (Remaining Work)

After reviewing the codebase, many items from the master prompt are **already implemented** from previous sessions. Here's what's done vs what remains:

### Already Done ✓
- Geo-conflict resolved: `/uslugi/dezinfekciya/[neighborhood]` routes removed, 301 redirects in place
- Combo pages (`klopov-i-tarakanov`, `klopov-i-bloh`) removed with 301s
- NeighborhoodPage H1 updated: "Дезинфекция и дезинсекция {location}"
- Trailing slash enforcement in `nginx.conf` (lines 100-106)
- Object+geo pages removed from ThreeSegmentRouteResolver
- Clean routing: services `/uslugi/`, geo `/rajony/`, MO `/moscow-oblast/`

---

### Remaining Work

#### 1. Blog UI Fix — `src/pages/Blog.tsx`

**a) Fix category icons mismatch** (lines 19-31)
Current `categoryIcons` has keys "Законодательство", "Случаи из практики", "Насекомые", "Грызуны" — none of which exist in `blogCategories` from `types.ts`. Real categories are: Все, Дезинфекция, Дезинсекция, Дератизация, Советы, **Законы**, Препараты, **Кейсы**.

Replace with correct keys:
- Remove "Законодательство", "Случаи из практики", "Насекомые", "Грызуны"
- Add "Законы" → ⚖️ (Scale icon), "Кейсы" → 💼 (FileText icon)
- Keep: Безопасность → 🛡️

**b) Add sorting** — new `sortBy` state with 3 options (По умолчанию / Сначала новые / Популярные), rendered as a row of small buttons between categories and posts.

**c) Category badge style** — change article card badge from `border border-border text-muted-foreground` to `bg-primary/10 text-primary border-none` (filled pill, matches reference).

#### 2. BlogPost Navigation — `src/pages/BlogPost.tsx`

Add "← Все статьи" link below breadcrumbs using `ArrowLeft` icon from lucide-react. Prominent, tappable on mobile.

#### 3. NeighborhoodPage Enrichment — `src/pages/NeighborhoodPage.tsx`

**a) "Выберите тип объекта" block** — grid of 4-6 large cards (Квартира, Частный дом, Офис, Ресторан, Склад, Производство). Each links to the corresponding service+object page (`/uslugi/dezinsekciya/kvartir/`). Data sourced from existing `objectTypes` in `src/data/objects.ts`.

**b) "Популярные вредители" block** — horizontal chips (Клопы, Тараканы, Грызуны, Муравьи, Моль) linking to pest hub pages (`/uslugi/dezinsekciya/klopy/`).

**c) "Полезные материалы" block** — show 2-3 related blog articles. Match by neighborhood tags or show general articles (подготовка, безопасность, законы). Use existing `allBlogArticles` data.

#### 4. Guarantee Consistency Audit

Search all service meta descriptions for "1 год" or inconsistent guarantee text and normalize to "до 3 лет". Files to check: `src/data/serviceSubpages.ts`, `src/data/services.ts`, `src/data/districtPages.ts`.

---

### Files to Edit

```text
src/pages/Blog.tsx              — category icons fix, sorting, badge style
src/pages/BlogPost.tsx          — back-to-blog link
src/pages/NeighborhoodPage.tsx  — object cards, pest chips, blog links
src/data/serviceSubpages.ts     — guarantee audit (if needed)
src/data/services.ts            — guarantee audit (if needed)
```

### Not Touching
- Routes in App.tsx / AppSSR.tsx (already correct)
- seoRoutes.ts / sitemap / SSG plugins (already fixed)
- JSON-LD / Schema.org markup
- Header, Footer, global styles, fonts, colors
- nginx.conf (trailing slash already handled)

