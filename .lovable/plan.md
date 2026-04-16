

# Fix Korolev 404 Pages — Slug Mismatch

## Root Cause

The slug for Королёв is inconsistent across the codebase:
- `src/data/moscowRegion.ts` — slug: `korolev` (source of truth)
- `src/data/districtImages.ts` — key: `korolev`
- `public/_redirects` — path: `korolev`
- **`src/lib/seoRoutes.ts`** — slug: `korolyov` (WRONG)
- **`src/data/semanticCore.ts`** — slug: `korolyov` (WRONG)

SSG generates 5 routes using `korolyov` from `seoRoutes.ts`, but `getCityBySlug('korolyov')` returns `undefined` → NotFound component renders → 404 title.

## Affected Pages (5)
1. `/moscow-oblast/korolyov/` — city hub
2. `/moscow-oblast/korolyov/dezinsekciya/`
3. `/moscow-oblast/korolyov/dezinfekciya/`
4. `/moscow-oblast/korolyov/deratizaciya/`
5. `/moscow-oblast/korolyov/ozonirovanie/`

## Fix — 2 files, 2 lines each

### File 1: `src/lib/seoRoutes.ts` (line 110)
Change `'korolyov'` → `'korolev'`

### File 2: `src/data/semanticCore.ts` (line 356)
Change `{ slug: 'korolyov', name: 'королёв' }` → `{ slug: 'korolev', name: 'королёв' }`

### File 3: `public/_redirects` — add redirect for old slug
Add 5 redirect rules: `/moscow-oblast/korolyov/*` → `/moscow-oblast/korolev/*` (301) to preserve any indexed URLs.

## What Does NOT Change
- `moscowRegion.ts`, `districtImages.ts` — already correct
- No new routes or pages — same 5 pages, correct slug
- No template changes

## Verification
- Build must generate `dist/moscow-oblast/korolev/index.html` (not `korolyov`)
- All 5 pages must render with proper title (not "404")

