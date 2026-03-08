

## SEO Architecture Fix Plan — 13 Issues

This is a large-scale refactor touching routing, SSG generation, canonical signals, and content. I'll organize by priority.

---

### Phase 1: Critical (Issues #1, #2, #3) — Stop Indexation Damage

**Issue #1: Geo-branch conflict `/uslugi/dezinfekciya/[neighborhood]` vs `/rajony/[neighborhood]`**

Currently `seoRoutes.ts` generates 130 pages at `/uslugi/dezinfekciya/[neighborhood]` (lines 196-203). These compete directly with `/rajony/[neighborhood]` for the same geo-cluster.

**Fix:**
- Remove the 130 `/uslugi/dezinfekciya/[neighborhood]` routes from `seoRoutes.ts`, `vite-plugin-ssg.ts`, and `vite-plugin-sitemap.ts`
- In `ServiceRouteResolver.tsx`, remove the neighborhood match (step 4) so these URLs return 404
- Add 301 redirects in `public/_redirects` from `/uslugi/dezinfekciya/[neighborhood]` → `/rajony/[neighborhood]` for each of the 130 neighborhoods (to preserve any existing link equity)
- In `NeighborhoodPage.tsx`, enhance H1 to include primary service: "Дезинфекция и дезинсекция {prepositional}" (Issue #12 also fixed)
- Add service link cards inside NeighborhoodPage pointing to `/uslugi/dezinsekciya`, `/uslugi/dezinfekciya`, etc. (already partially done — services array at line 65)

**Files:** `seoRoutes.ts`, `vite-plugin-ssg.ts`, `vite-plugin-sitemap.ts`, `ServiceRouteResolver.tsx`, `public/_redirects`, `NeighborhoodPage.tsx`

---

**Issue #2: Routing pattern chaos**

The current `ThreeSegmentRouteResolver` correctly dispatches pest vs object at `/uslugi/:service/:segment2/:segment3`. The "chaos" is that the same `[subSlug]` position accepts pests, objects, neighborhoods, methods, and combo qualifiers. This isn't a Next.js project (it's Vite+React Router), so `generateStaticParams` doesn't apply. The resolver chain in `ServiceRouteResolver` works correctly.

**Fix:** No routing changes needed — the resolver chain priority (subpage → pest → object → neighborhood) is deterministic. The fix is removing neighborhoods from this chain (Issue #1) and adding explicit type annotations in code comments for clarity.

---

**Issue #3: Trailing slash inconsistency**

Some canonicals use trailing slash, some don't. Need global normalization.

**Fix:**
- Audit all `<link rel="canonical">` across all page templates — ensure they ALL end with `/`
- In `SEO_CONFIG` or a utility, create `canonicalUrl(path)` helper that always appends trailing slash
- Update `vite-plugin-sitemap.ts` to output all URLs with trailing slash
- Add a redirect rule in `nginx.conf`: rewrite non-trailing-slash to trailing-slash (except files)

**Files:** `src/lib/seo.ts`, all page components with `<Helmet>`, `vite-plugin-sitemap.ts`, `nginx.conf`

---

### Phase 2: Important (Issues #4, #5, #6, #7)

**Issue #4: Service+Object+Geo pages untracked**

`ThreeSegmentRouteResolver` renders `ServiceObjectDistrictPage` for URLs like `/uslugi/dezinsekciya/kvartir/arbat`, but `seoRoutes.ts` does NOT generate SSG for these (only pest+geo for top 15 neighborhoods). So these pages only work client-side and won't have SSG HTML.

**Fix:** Either:
- (a) Add these to SSG generation (5 services × 11 objects × 15 top neighborhoods = 825 pages) with unique content
- (b) Remove them entirely — they compete with NchPages and `/rajony/`

**Recommendation:** Option (b) — remove. These are thin content competing with better pages. Add `noindex` or return 404 from `ThreeSegmentRouteResolver` when segment2 is an object.

---

**Issue #5: `/klopov-i-tarakanov/` combo page cannibalizes**

This subpage in `serviceSubpages.ts` targets both pest clusters simultaneously.

**Fix:**
- Remove from `serviceSubpageRoutes` in `seoRoutes.ts`, `vite-plugin-ssg.ts`, `vite-plugin-sitemap.ts`
- Remove from `serviceSubpages.ts`
- Similarly review `/klopov-i-bloh/` — same problem
- Add 301 redirect to the primary page (`/uslugi/dezinsekciya/unichtozhenie-klopov`)
- On the klopy and tarakany pages, add internal cross-links instead

---

**Issue #6: `/holodnym-tumanom/` — method in pest/object slot**

Methods (`holodnym-tumanom`, `parom`, `parogeneratorom`, `bez-zapaha`, `srochno`, `kruglosutochno`) are serviceSubpages and correctly handled by `ServiceRouteResolver` step 1. They don't conflict with pests/objects because `getSubpageByPath()` matches first.

**Fix:** No routing change needed. But for semantic clarity, add a `type: 'method' | 'qualifier' | 'combo'` field to the ServiceSubpage interface so the system knows what kind of subpage it is. This is a data-level annotation, no URL change.

---

**Issue #7: Thin content on geo+object pages**

Pages like `/domov/beskudnikovsky` have template text with only the toponym swapped.

**Fix:** This ties to Issue #4. If we remove service+object+geo pages (recommendation), this is solved. If kept, need to:
- Add unique local features per neighborhood from `neighborhoods.ts` (landmarks, streets)
- Add object-specific tips (e.g., for `domov` — mention garden, basement, attic)
- Use `contentGenerator.ts` with more seed data per combination

---

### Phase 3: Growth (Issues #8-13)

**Issue #8:** Blog articles competing with commercial pages — add a check in blog article data: if title/H1 contains commercial intent words ("цена", "заказать", "стоимость"), flag or rewrite. Add CTA buttons linking to `/uslugi/...` instead.

**Issue #9:** Add `/uslugi/ozonirovanie/kvartir/`, `/domov/` — these routes already work via `ServiceRouteResolver` → `ServiceObjectPage`. Just add them to `seoRoutes.ts` SSG generation and `serviceSubpageRoutes`.

**Issue #10:** Moscow Oblast — already in `/moscow-oblast/[city]`. No conflict with `/rajony/`. This is resolved.

**Issue #11:** Service+pest+object+neighborhood (4-level) — `/uslugi/dezinsekciya/tarakany/kvartir/arbat`. This would require a 4-segment route. **Not recommended** at this stage — too many thin pages.

**Issue #12:** Neighborhood H1 — fixed in Issue #1 above.

**Issue #13:** Guarantee inconsistency — search all meta descriptions for "1 год" or "гарантия" and replace with "до 3 лет" to match the global standard.

---

### Summary of File Changes

```text
Phase 1 (Critical):
├── src/lib/seoRoutes.ts          — remove 130 dezinfekciya/[neighborhood] routes
├── vite-plugin-ssg.ts            — sync with seoRoutes
├── vite-plugin-sitemap.ts        — sync with seoRoutes, add trailing slashes
├── src/pages/ServiceRouteResolver.tsx — remove neighborhood match (step 4)
├── src/pages/NeighborhoodPage.tsx — improve H1 with service keywords
├── public/_redirects              — add 301s for old geo URLs
├── src/lib/seo.ts                — add canonicalUrl() helper with trailing slash
├── nginx.conf                    — trailing slash redirect rule
└── All page components           — use canonicalUrl() for canonical links

Phase 2 (Important):
├── src/pages/ThreeSegmentRouteResolver.tsx — remove object+geo dispatch
├── src/data/serviceSubpages.ts   — remove klopov-i-tarakanov, klopov-i-bloh
├── src/lib/seoRoutes.ts          — remove combo subpage routes
└── public/_redirects              — 301 redirects for removed pages

Phase 3 (Growth):
├── src/data/blog/*.ts            — audit commercial intent in titles
├── src/lib/seoRoutes.ts          — add ozonirovanie object pages
├── src/data/services.ts          — sync guarantee to "до 3 лет" in all meta
└── src/data/neighborhoods.ts     — enhance H1 template
```

### Estimated scope: ~15 files, ~300 lines changed. No new dependencies. No database changes.

