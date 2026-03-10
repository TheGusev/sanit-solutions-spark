

## Analysis: Build Failure, Doorway Pages, and Googlebot "Same Weight"

### What happened with the build failure

The screenshot confirms it: when I rewrote the monitoring system, the SSG code in `vite-plugin-ssg.ts` had a comment `// REMOVED: /uslugi/dezinfekciya/[neighborhood] doorway pages` at line 301. This removal was **correct and intentional** — those were doorway pages (e.g., `/uslugi/dezinfekciya/arbat`) that cannibalized the geo hub pages at `/rajony/arbat/`. 

However, the `docker-build.yml` smoke check still tested for `uslugi/dezinfekciya/arbat/index.html` — a page that no longer exists. The fix (already applied per your screenshot) was to replace that check with `uslugi/dezinfekciya/kvartir/index.html`. **The monitoring rewrite itself did not break SSG** — it was just a stale CI check.

### Why doorway pages were removed (this was correct)

The `/uslugi/dezinfekciya/[neighborhood]` pages were creating route collisions and keyword cannibalization:
- `/uslugi/dezinfekciya/arbat` competed with `/rajony/arbat/` for the same "дезинфекция в Арбат" query
- The routing/cannibalization policy in the project explicitly forbids geographic slugs under `/uslugi/`
- Removing them consolidates geo intent to `/rajony/[slug]/` — one cluster, one URL

This was the right call. Do NOT restore these pages.

### Googlebot "Same Weight" Problem — Root Cause Found

The real issue is in `index.html`. Every SSG-generated page inherits a **~350-line JSON-LD schema** from the base template (lines 57-355) that describes the homepage organization, all 7 services with prices, reviews, etc. The SSG `replaceHeadTags` function (vite-plugin-ssg.ts line 729) **adds** page-specific schemas but **never removes** the original homepage schema.

Result: All 1,774 pages carry:
1. The same ~8KB homepage JSON-LD (organization + 7 services + 4 reviews)
2. Plus their own page-specific schema

This makes Googlebot see massive shared boilerplate across all pages, inflating "same weight" signals.

### Plan

#### 1. Strip homepage JSON-LD from SSG template during rendering
**File: `vite-plugin-ssg.ts`** — In the `closeBundle` method, after reading the template (line 587), remove the inline `<script type="application/ld+json">` block from the template string for all non-homepage routes. The homepage route (`/`) keeps it. Each page's own schema (injected via Helmet/SEOHead) provides the correct structured data.

#### 2. Fix `index.html` guarantee text inconsistency  
**File: `index.html`** — Lines 7, 254, 363, 429, 510 say "Гарантия до 1 года" but the site-wide standard is "Гарантия до 3 лет" (per project memory). This inconsistency in the SSR fallback and JSON-LD could confuse crawlers seeing mixed signals. Update all instances to "до 3 лет".

#### 3. No changes to routing or monitor.py
- The doorway page removal was correct — no restoration needed
- `monitor.py` is working correctly (verified all 552 lines)
- `seoRoutes.ts` and `vite-plugin-ssg.ts` are properly synchronized
- Route structure (`/uslugi/` for services, `/rajony/` for geo) is clean

### Summary
Two files changed. The main fix strips the shared homepage JSON-LD from non-homepage SSG pages so each page has unique structured data weight. Secondary fix corrects the guarantee text inconsistency in the base template.

