

## Final Audit: Remaining Issues

After reviewing all critical files, here is the current state:

### Still Broken (needs fix)

| # | Issue | Severity | Files | Details |
|---|-------|----------|-------|---------|
| **1** | `seoRoutes.ts` paths missing trailing slashes in `/uslugi/` section | **MEDIUM** | `src/lib/seoRoutes.ts:156-265` | Services, subpages, pests, objects, NCH pages all generate paths like `/uslugi/dezinsekciya` without trailing `/`. Blog/rajony/MO sections are fixed. Sitemap plugin normalizes via `normalizeLocWithTrailingSlash()`, but `getAllSitemapUrls()` on line 415 passes raw paths from `getAllSSGRoutes()` — so consumers relying on `getAllSSGRoutes()` directly (like SSG plugin) get inconsistent paths. |
| **2** | `demerkurizaciya` × all 11 objects not pruned | **LOW** | `src/lib/seoRoutes.ts:198-207`, `vite-plugin-ssg.ts:287-295`, `vite-plugin-sitemap.ts:399-408` | All 3 files still generate demerkurizaciya × ALL 11 objects (including nonsensical combos like "демеркуризация автомобилей"). The pruning from the approved plan was not applied. |
| **3** | `vite-plugin-ssg.ts` paths lack trailing slashes | **MEDIUM** | `vite-plugin-ssg.ts:248-395` | Same issue as #1 but in the SSG plugin. All `/uslugi/` paths generated without trailing slash. |

### Already Fixed (verified)

| Check | Status |
|-------|--------|
| "гарантия 1 год" across entire codebase | **CLEAN** — zero matches |
| Combo pages removed from SSG + sitemap | **CLEAN** |
| `/team` in SSG static routes | **PRESENT** |
| Wildcard redirects removed from `_redirects` | **CLEAN** |
| Blog slug rename redirects in `_redirects` | **PRESENT** |
| App.tsx ↔ AppSSR.tsx route sync | **SYNCED** |
| Static routes before parametric | **CORRECT** |
| robots.txt clean | **CORRECT** |
| Sitemap `normalizeLocWithTrailingSlash()` | **PRESENT** |
| No console errors | **CLEAN** |

### Implementation Plan

**File 1: `src/lib/seoRoutes.ts`**
- Add trailing `/` to all `/uslugi/` paths in `getAllSSGRoutes()` (lines 158, 168, 178, 188, 201, 233, 246, 259, 269, 278)
- Add demerkurizaciya pruning: filter objectSlugs to `['kvartir', 'domov', 'ofisov', 'skladov', 'proizvodstv']` when service is `demerkurizaciya`

**File 2: `vite-plugin-ssg.ts`**
- Add trailing `/` to all generated paths (lines 254, 262, 270, 279, 290, 306, 317, 329, 338, 346, 353, 361, 368, 383, 389)
- Add same demerkurizaciya pruning logic

**File 3: `vite-plugin-sitemap.ts`**
- Add demerkurizaciya pruning in service+object section (lines 399-408)
- Trailing slashes already handled by normalizer — no change needed

This brings all 3 sources (seoRoutes, SSG plugin, sitemap plugin) into full sync with trailing slashes and pruned nonsensical pages.

