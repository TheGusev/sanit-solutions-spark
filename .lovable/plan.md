

## Full Technical + SEO Audit Report

### Route Count Verification

| Source | Count | Notes |
|--------|-------|-------|
| seoRoutes.ts `getAllSSGRoutes()` | ~1,774 | Canonical source |
| vite-plugin-ssg.ts `getAllRoutes()` | ~1,774 | Should mirror seoRoutes |
| vite-plugin-sitemap.ts | ~1,774 | Should mirror seoRoutes |
| App.tsx routes | 14 patterns | Dynamic resolution |
| AppSSR.tsx routes | 13 patterns | Mirrors App.tsx (no admin) |

---

### CRITICAL Issues

| # | Issue | File(s) | Details | Fix |
|---|-------|---------|---------|-----|
| **C1** | **`_redirects` wildcard breaks pest URLs** | `public/_redirects:31-33` | Rules `/uslugi/dezinsekciya/:slug /rajony/:slug/ 301` etc. will redirect valid pages like `/uslugi/dezinsekciya/tarakany` → `/rajony/tarakany/` (404!). Same for `/uslugi/dezinfekciya/kvartir` → `/rajony/kvartir/` (404!). **All pest + subpage + object URLs are broken in preview/Netlify.** | Remove these 3 wildcard rules. They were meant only for old neighborhood slugs but catch ALL 2-segment paths. If needed, enumerate the specific old neighborhood slugs that require 301s. |
| **C2** | **vite-plugin-ssg.ts still generates combo pages** | `vite-plugin-ssg.ts:63-64` | `klopov-i-tarakanov` and `klopov-i-bloh` are still in `serviceSubpageRoutes` in SSG plugin, generating HTML files. But `seoRoutes.ts` and `vite-plugin-sitemap.ts` have them REMOVED. This creates orphan HTML that gets served instead of a 301 redirect. | Remove lines 63-64 from vite-plugin-ssg.ts |
| **C3** | **`/team` page missing from SSG plugin** | `vite-plugin-ssg.ts:28-37` | `/team` is in `seoRoutes.ts` (line 13) and sitemap (line 62) but NOT in `vite-plugin-ssg.ts` static routes. Page won't be pre-rendered → 404 on production nginx refresh. | Add `{ path: '/team', outputPath: 'team/index.html' }` to staticRoutes in vite-plugin-ssg.ts |

---

### HIGH Issues

| # | Issue | File(s) | Details | Fix |
|---|-------|---------|---------|-----|
| **H1** | **Guarantee inconsistency: "гарантия 1 год" still in blog content** | `src/data/blogPosts.ts:1703`, `src/data/blog/llm/pests.ts:58`, `src/data/blog/llm/methods.ts:511` | 3 blog articles still say "гарантию 1 год" or "гарантия 1 год" instead of "до 3 лет". Contradicts the site-wide standard. | Replace all "гарантию 1 год" / "гарантия 1 год" with "гарантию до 3 лет" / "гарантия до 3 лет" in these 3 files |
| **H2** | **Dead combo page data in serviceSubpages.ts** | `src/data/serviceSubpages.ts:815-930` | Full subpage entries for `klopov-i-tarakanov` and `klopov-i-bloh` still exist in the data file. While not in sitemap/SSG, they're still resolvable via SPA routing through `ServiceRouteResolver` → creates live pages that compete with pest hubs. Also a `relatedServices` link on line 979 points to `/uslugi/dezinsekciya/klopov-i-bloh`. | Delete the combo page entries from serviceSubpages.ts and remove the relatedServices reference |

---

### MEDIUM Issues

| # | Issue | File(s) | Details | Fix |
|---|-------|---------|---------|-----|
| **M1** | **ThreeSegmentRouteResolver comment references deleted component** | `src/pages/ThreeSegmentRouteResolver.tsx:6,10,19` | Comments still reference `ServiceObjectDistrictPage` which was deleted. Misleading for maintenance. | Clean up comments |
| **M2** | **Unused NchPage lazy import in App.tsx** | `src/App.tsx:27` | `NchPage` is lazy-imported but never used directly in any `<Route>` — it's only used inside `ThreeSegmentRouteResolver`. Dead import. | Remove the unused import |
| **M3** | **Blog category "Безопасность" missing from categoryIcons** | `src/pages/Blog.tsx:19-28` | If any articles use "Безопасность" as a category (from safety articles), there's no icon mapping. Currently all safety articles use existing categories so this is LOW risk. | Verify categories match; add if needed |
| **M4** | **`seoRoutes.ts` `getAllSSGRoutes()` paths lack trailing slashes** | `src/lib/seoRoutes.ts:157-265` | Paths like `/uslugi/dezinsekciya` are generated without trailing slash. While the sitemap plugin normalizes them, the `getAllSitemapUrls()` function on line 415 passes raw paths. Any consumer that doesn't normalize will create mismatches. | Add trailing slash to paths in `getAllSSGRoutes()` or ensure all consumers normalize |

---

### LOW Issues

| # | Issue | File(s) | Details | Fix |
|---|-------|---------|---------|-----|
| **L1** | **55 service+object pages include nonsensical combos** | `seoRoutes.ts:198-207` | e.g., "демеркуризация автомобилей", "озонирование детских садов" — extremely low search volume | Consider pruning 5-10 impractical combos |
| **L2** | **`NchPage` route not explicitly in App.tsx** | `App.tsx` | No direct `/uslugi/:service/:pest/:neighborhood` route — handled by `ThreeSegmentRouteResolver`. Works but less explicit. | Acceptable — works correctly via resolver |
| **L3** | **Duplicate blog slug `trebovaniya-rospotrebnadzora-2026`** | `seoRoutes.ts:295,329` | Appears in both legacy (line 295) and legal (line 329) sections of `blogArticleSlugs`. SSG will generate it twice → second overwrites first, no actual harm but wasteful. | Remove one duplicate |

---

### All Good (Passed Checks)

- **App.tsx ↔ AppSSR.tsx**: Synchronized (same route patterns, same order)
- **Static routes before parametric**: `/uslugi/obrabotka-uchastkov` correctly placed before dynamic routes
- **Trailing slash in nginx**: Enforced via `rewrite` rules (lines 101-106)
- **robots.txt**: Clean, no accidental Disallow for public sections
- **Sitemap trailing slashes**: `normalizeLocWithTrailingSlash()` applied to all `<loc>` entries
- **Schema/JSON-LD**: Intact on NeighborhoodPage (LocalBusiness, Breadcrumb, FAQ, Service)
- **NeighborhoodPage hub structure**: Has object grid, pest chips, blog links, FAQ, pricing
- **Blog pagination**: Uses client-side `visibleCount` state — no URL-based pagination
- **Blog category icons**: Synced with `blogCategories` from types.ts (8 categories)
- **NCH tiered model**: Correctly generates ~774 pest+geo pages across 3 tiers
- **Geo-conflict resolved**: No `/uslugi/dezinfekciya/[neighborhood]` in SSG routes
- **Canonical URLs**: Self-referencing with trailing slash on all checked templates
- **H1 on NeighborhoodPage**: Uses correct "Дезинфекция и дезинсекция {location}" pattern
- **MO cities**: 14 cities × 4 services = 56 pages + 14 city overviews
- **No URL-based pagination** anywhere — "Load More" pattern used

---

### Fix Priority

| Priority | Items | Effort |
|----------|-------|--------|
| **CRITICAL — fix first** | C1 (redirects break pages), C2 (orphan combo SSG), C3 (team page missing) | Small — 3 file edits |
| **HIGH — fix second** | H1 (guarantee text), H2 (dead combo data) | Small — text replacements |
| **MEDIUM — cleanup** | M1-M4 (comments, dead imports, path normalization) | Small |
| **LOW — optional** | L1-L3 (prune combos, dedup slug) | Trivial |

