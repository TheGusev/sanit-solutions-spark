

## Full Technical + SEO Audit Report

### CRITICAL Issues

**1. Route Order Bug: `/uslugi/obrabotka-uchastkov` shadowed by parametric route**

In both `App.tsx` (line 109) and `AppSSR.tsx` (line 65), the static route `/uslugi/obrabotka-uchastkov` is placed AFTER the 3-segment parametric route `/uslugi/:service/:segment2/:segment3`. React Router v6 uses route specificity scoring, so this particular case is fine because `obrabotka-uchastkov` is a 2-segment path and won't match the 3-segment pattern. However, it IS placed after `/uslugi/:parentSlug/:subSlug` — and since React Router v6 scores static segments higher than dynamic, this is also technically fine. **No actual bug here** upon closer inspection — React Router v6 handles this correctly via specificity. But for clarity and maintainability per the project memory standard, it SHOULD be moved before parametric routes.

**Severity: MEDIUM** (works correctly but violates project convention)

**Fix:** Move `/uslugi/obrabotka-uchastkov` route above the 3-segment route in both `App.tsx` and `AppSSR.tsx`.

---

### HIGH Issues

**2. `normalizePathWithTrailingSlash()` exists but is NEVER used in page components**

The trailing slash helper in `src/lib/seo.ts` (line 31) is defined and used inside `generateSEOMeta()`, but many pages construct canonicals manually with template literals (e.g., `` `${SEO_CONFIG.baseUrl}/rajony/${slug}/` ``). This means some pages might miss the normalization. Pages using `generateSEOMeta()` get it automatically; pages with hardcoded canonicals (Blog, Contacts, Privacy, etc.) manually add `/` — all currently correct, but fragile.

**Severity: MEDIUM** — no active bug, but inconsistent pattern.

**Fix:** Refactor all manual canonical constructions to use `generateSEOMeta()` or at minimum `normalizePathWithTrailingSlash()`.

**3. Sitemap URLs lack trailing slashes for some patterns**

In `vite-plugin-sitemap.ts` line 18, the `loc` values are used directly. Static URLs (lines 47-57) have trailing slashes. But dynamically generated service/pest/object URLs from `seoRoutes.ts` do NOT have trailing slashes (e.g., `/uslugi/dezinsekciya` at line 158). The sitemap plugin uses these raw paths. This creates a mismatch: sitemap says `/uslugi/dezinsekciya` but canonical says `/uslugi/dezinsekciya/`.

**Severity: HIGH** — Yandex sees different canonical vs sitemap URL.

**Fix:** In `vite-plugin-sitemap.ts`, normalize all `loc` values to have trailing slashes before writing XML. Or fix `seoRoutes.ts` `getAllSSGRoutes()` to always output paths with trailing slash.

**4. `_redirects` missing 301s for old geo URLs**

The plan called for 301 redirects from `/uslugi/dezinfekciya/[neighborhood]` → `/rajony/[neighborhood]/` for all 131 neighborhoods. Currently `_redirects` only has the combo page redirects (klopov-i-tarakanov, klopov-i-bloh). The 131 neighborhood redirects are NOT present. If any of these old URLs were indexed, they now return the SPA fallback (200 with index.html) instead of 301.

**Severity: HIGH** — old indexed URLs don't redirect to canonical.

**Fix:** Add wildcard redirect: `/uslugi/dezinfekciya/:slug /rajony/:slug/ 301` (or enumerate all 131).

**5. Blog article titles with commercial intent**

Search found "цена" in blog article templates (pests-articles.ts: "ceny-na-unichtozhenie-tarakany", etc. — 10 articles with "цены на уничтожение" in slug/title). These directly compete with `/uslugi/dezinsekciya/tarakany/` for commercial queries.

**Severity: MEDIUM** — not a routing bug but a cannibalization risk.

**Fix:** Rename blog article slugs/titles from "ceny-na-unichtozhenie-X" to "stoimost-obrabotki-X" or similar informational framing. Add prominent CTA linking to the service page.

---

### MEDIUM Issues

**6. ServiceObjectDistrictPage still exists but is unreachable**

`ThreeSegmentRouteResolver.tsx` now returns 404 for object+geo combos (Issue #4 fix), but the component `ServiceObjectDistrictPage.tsx` still exists in the codebase as dead code.

**Fix:** Delete `src/pages/ServiceObjectDistrictPage.tsx` (cleanup).

**7. `seoRoutes.ts` generates service+object pages for 5 services × 11 objects = 55 pages**

Line 198-207 generates pages for ALL 11 object slugs including `gostinic`, `detskih-sadov`, `hostela`, `magazinov`, `avtomobiley` combined with `demerkurizaciya`. Some of these are extremely low-search-volume or nonsensical (e.g., "демеркуризация автомобилей"). These could be flagged as thin content.

**Severity: LOW** — not harmful but adds volume without value.

**8. Duplicate category filter bug risk in Blog.tsx**

The `categoryIcons` were updated in the last session but the actual blog category taxonomy from `src/data/blog/types.ts` needs verification that all categories have matching icons.

**Severity: LOW** — cosmetic.

---

### All Good (Passed Checks)

- **Geo-conflict resolved**: No `/uslugi/dezinfekciya/[neighborhood]` routes in SSG or routing
- **Combo pages removed**: `klopov-i-tarakanov`, `klopov-i-bloh` have 301 redirects
- **Guarantee consistency**: Zero matches for "гарантия до 1 года" or "гарантия 1 год" across entire codebase. All references say "до 3 лет"
- **H1 on NeighborhoodPage**: Correctly uses "Дезинфекция и дезинсекция {location}" pattern
- **NeighborhoodPage hub structure**: Has object grid, pest chips, blog links, FAQ, pricing, landmarks, streets — NOT a thin duplicate
- **Routing collision-free**: `/uslugi/`, `/rajony/`, `/moscow-oblast/`, `/blog/` have no overlapping patterns
- **App.tsx ↔ AppSSR.tsx synchronized**: Same route structure in both files
- **Schema/JSON-LD intact**: NeighborhoodPage has LocalBusiness, Breadcrumb, FAQ, Service schemas
- **Canonical URLs all use trailing slash**: All checked pages have `/` at end
- **Robots.txt clean**: No accidental Disallow for key sections
- **NCH tiered expansion working**: 774 pest+geo pages generated across 3 tiers
- **Object type grid on district pages**: Links to `/uslugi/dezinsekciya/kvartir/` etc.
- **Blog back-navigation**: "← Все статьи" link present in BlogPost.tsx

---

### Fix Priority Table

| # | URL Pattern | Problem | Severity | Fix |
|---|------------|---------|----------|-----|
| 1 | Sitemap XML | Paths missing trailing slash | HIGH | Normalize all locs in sitemap plugin |
| 2 | `/uslugi/dezinfekciya/*` (old) | No 301 redirects to `/rajony/*` | HIGH | Add wildcard redirect in `_redirects` |
| 3 | `/uslugi/obrabotka-uchastkov` | Route order convention | MEDIUM | Move before parametric routes |
| 4 | Blog: `ceny-na-unichtozhenie-*` | Commercial title competing | MEDIUM | Reframe as informational |
| 5 | Canonical construction | Inconsistent pattern (manual vs helper) | MEDIUM | Standardize via `generateSEOMeta()` |
| 6 | `ServiceObjectDistrictPage.tsx` | Dead code | LOW | Delete file |
| 7 | 55 service+object pages | Some nonsensical combos | LOW | Review & prune |

### Implementation Plan

**Task 1** (fixes #1, #2, #3): Update `_redirects` with geo redirect wildcard, normalize sitemap trailing slashes, reorder static routes in App.tsx/AppSSR.tsx.

**Task 2** (fix #4): Audit and rename blog articles with commercial intent in slugs.

**Task 3** (fixes #5, #6): Standardize canonical helpers, remove dead code.

