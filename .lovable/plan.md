

# Финальная сводка: 23 Mole City Pages + Full Project Verification Plan

## SUMMARY TABLE — All 23 Cities

```text
┌─────────────────┬──────────┬─────┬──────────────┬──────────────┬─────┐
│ Город           │ Tier     │ FAQ │ methodNotes  │ objectContext│ Dist│
├─────────────────┼──────────┼─────┼──────────────┼──────────────┼─────┤
│ PREMIUM (4 cities)                                                  │
│ Одинцово        │ premium  │  4  │ ✅           │ ✅           │ 12  │
│ Барвиха         │ premium  │  4  │ ✅           │ ✅           │  8  │
│ Усово           │ premium  │  4  │ ✅           │ ✅           │ 15  │
│ Жуковка         │ premium  │  4  │ ✅           │ ✅           │ 10  │
├─────────────────┼──────────┼─────┼──────────────┼──────────────┼─────┤
│ STRONG (7 cities)                                                   │
│ Истра           │ strong   │  4  │ ✅           │ ✅           │ 45  │
│ Красногорск     │ strong   │  4  │ ✅           │ ✅           │  5  │
│ Нахабино        │ strong   │  4  │ ✅           │ ✅           │ 18  │
│ Дедовск         │ strong   │  4  │ ✅           │ ✅           │ 18  │
│ Лобня           │ strong   │  4  │ ✅           │ ✅           │ 14  │
│ Долгопрудный    │ strong   │  4  │ ✅           │ ✅           │  6  │
│ Домодедово      │ strong   │  4  │ ✅           │ ✅           │ 22  │
├─────────────────┼──────────┼─────┼──────────────┼──────────────┼─────┤
│ MID (7 cities)                                                      │
│ Дмитров         │ mid      │  3  │ ✅           │ —            │ 65  │
│ Яхрома          │ mid      │  4  │ ✅           │ —            │ 55  │
│ Чехов           │ mid      │  3  │ ✅           │ —            │ 52  │
│ Серпухов        │ mid      │  4  │ ✅           │ —            │ 73  │
│ Наро-Фоминск    │ mid      │  3  │ ✅           │ —            │ 50  │
│ Клин            │ mid      │  4  │ ✅           │ —            │ 65  │
│ Солнечногорск   │ mid      │  3  │ ✅           │ —            │ 44  │
├─────────────────┼──────────┼─────┼──────────────┼──────────────┼─────┤
│ THIN (5 cities)                                                     │
│ Можайск         │ thin     │  3  │ ✅           │ —            │ 90  │
│ Талдом          │ thin     │  3  │ ✅           │ —            │110  │
│ Дубна           │ thin     │  3  │ ✅           │ —            │120  │
│ Руза            │ thin     │  3  │ ✅           │ —            │ 80  │
│ Воскресенск     │ thin     │  3  │ ✅           │ —            │ 80  │
└─────────────────┴──────────┴─────┴──────────────┴──────────────┴─────┘

Total: 23 cities — all have cityTier + methodNotes ✅
Premium/Strong: all have objectContext ✅
Premium/Strong: all have 4 FAQ ✅
Mid (>50km): all have distance FAQ ✅
```

## DATA INTEGRITY — Verified from source code

- **Interface**: `MoleCity` has `cityTier?`, `methodNotes?`, `objectContext?` — all optional, backward-compatible
- **Template**: `MoleCityPage.tsx` conditionally renders:
  - Line 140: Premium badge (`Gem` icon) when `cityTier === 'premium'`
  - Line 183-185: `objectContext` paragraph when present
  - Line 217-221: `methodNotes` paragraph when present
  - Line 94-102: FAQPage JSON-LD from `city.faq` array
- **SSG slugs**: `moleCitySlugs` (line 485) auto-derived from `moleCities.map(c => c.slug)` — no manual sync needed

## FULL PROJECT VERIFICATION PLAN

### Step 1: Build verification
Run `npm run build` and confirm:
- All 23 mole city SSG pages generated at `dist/uslugi/borba-s-krotami/[slug]/index.html`
- Total SSG page count ≥ 500 (Dockerfile threshold)
- Zero TypeScript errors

### Step 2: Spot-check rendered HTML (3 cities, 1 per tier)
For Барвиха (premium), Лобня (strong), Яхрома (mid):
- Verify `objectContext` paragraph present (premium/strong) or absent (mid)
- Verify `methodNotes` paragraph present
- Verify FAQ count matches table above
- Verify FAQPage JSON-LD has correct number of questions
- Verify premium badge appears only for premium tier

### Step 3: SEO metadata check
For all 23 pages, validate via build output:
- Title length 40-65 chars
- Description length 140-165 chars
- Canonical URL ends with trailing slash
- `og:title`, `og:description`, `og:url` present
- robots = `index, follow`

### Step 4: JSON-LD schema validation
- Exactly 1 FAQPage per mole city page
- Exactly 1 Service schema per page
- No BreadcrumbList in inline script (should come from centralized component)

### Step 5: Internal linking consistency
- All `relatedCities` slugs resolve to valid `moleCities` entries
- No broken `blogSlug` references (verify blog post exists or link is conditional)
- `getRelatedMoleCities()` returns valid links

### Step 6: Routing integrity
- No new routes added (23 slugs unchanged)
- `seoRoutes.ts` generates all 23 mole paths
- `validateRouteIntegrity` passes for all mole paths
- Sitemap includes all 23 URLs

### Step 7: Cross-page deduplication
- No two cities share identical `methodNotes` text
- No two cities share identical FAQ questions
- `objectContext` unique across cities that have it

### Step 8: Production smoke test
- Navigate to 3 mole city pages in preview
- Verify layout renders correctly (Hero, Methods with methodNotes, FAQ accordion, Related cities)
- Verify mobile layout (375px viewport)

## Execution

This plan will:
1. Run `npm run build` to verify compilation
2. Grep built HTML files for schema counts and SEO metadata
3. Check for duplicated content strings
4. Browser-test 3 representative pages

No code changes needed — this is verification only.

