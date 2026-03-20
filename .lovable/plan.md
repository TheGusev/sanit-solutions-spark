

## Plan: SEO Anti-Cannibalization Refactoring

### Context Mapping
The user's request references Next.js patterns but this project uses **Vite + React Router + custom SSG**. Mapping:
- `next.config.js redirects()` → `nginx.conf` + `public/_redirects`
- `generateStaticParams` → `getAllSSGRoutes()` in `src/lib/seoRoutes.ts`
- `src/app/blog/[slug]/page.tsx` → `src/pages/BlogPost.tsx`

### Current State (what's already clean)
- No object+geo generation exists (NCH is strictly pest×neighborhood)
- No `/uslugi/kroty/` route — kroty lives correctly at `/uslugi/deratizaciya/kroty/`
- No `/mo/` path exists — MO pages are at `/moscow-oblast/`
- Geo pages properly isolated at `/rajony/`

### Changes

#### 1. Add 301 redirects — `nginx.conf` + `public/_redirects`
Add defensive 301s to catch any leaked/cached URLs:

```
/uslugi/dezinsekciya/ofisov/[any-geo]  → /uslugi/dezinsekciya/ofisov/
/uslugi/dezinsekciya/hostelov/[any-geo] → /uslugi/dezinsekciya/hostela/  (note: slug is "hostela")
/uslugi/kroty/                          → /uslugi/deratizaciya/kroty/
/uslugi/borba-s-krotami/kroty/          → /uslugi/deratizaciya/kroty/
```

Both `nginx.conf` (production) and `public/_redirects` (preview/Netlify fallback) get updated.

#### 2. Create `validateRouteIntegrity()` — `src/lib/seoValidation.ts` (update existing file)
Add a function that checks every generated route against forbidden patterns:
- **Object+Geo**: `/uslugi/[service]/[object-slug]/[neighborhood-slug]/` — throw if detected
- **Pest masquerading as service hub**: `/uslugi/[pest-slug]/` (e.g., `/uslugi/tarakany/`)
- **Geo under /uslugi/**: `/uslugi/dezinfekciya/[neighborhood-slug]/` without pest prefix
- **Duplicate slugs**: same path generated twice

Integrate into `getAllSSGRoutes()` — runs at build time, throws on violation (fail-fast).

#### 3. Blog title de-optimization — `src/pages/BlogPost.tsx`
Add logic in the `<Helmet>` section: if a blog title contains commercial keywords that overlap with service pages (e.g., "дезинсекция офисов", "дератизация квартир"), prepend/append info-intent markers:
- "Дезинсекция офисов" → "Дезинсекция офисов: полный гайд и советы"
- Pattern: detect overlap with `objectTypes` × `servicesSlugs`, add "гайд", "инструкция", "советы" suffix

Also add `<meta name="robots" content="max-snippet:160">` for blog posts with commercial overlap to limit snippet size vs commercial pages which get `max-snippet:-1`.

#### 4. Strengthen `scripts/validate-routes.ts`
Add the new `validateRouteIntegrity()` call + forbidden pattern checks to the CI validation script. Fix the min routes threshold (currently 4000 but actual count is ~1,774).

### Files Changed
1. `nginx.conf` — add 301 redirect blocks (~8 lines)
2. `public/_redirects` — mirror 301 rules (~6 lines)
3. `src/lib/seoValidation.ts` — add `validateRouteIntegrity()` function
4. `src/lib/seoRoutes.ts` — call `validateRouteIntegrity()` at end of `getAllSSGRoutes()`
5. `src/pages/BlogPost.tsx` — add commercial-overlap detection + title de-optimization in Helmet
6. `scripts/validate-routes.ts` — add forbidden pattern checks, fix threshold

### What does NOT need changing
- No dead code to remove — object+geo generation was already removed
- No `/mo/` vs `/moscow-oblast/` conflict exists (only `/moscow-oblast/`)
- Route structure in `App.tsx` and `AppSSR.tsx` is already correct
- `ServiceRouteResolver.tsx` correctly resolves pest/object/subpage without geo leaks

