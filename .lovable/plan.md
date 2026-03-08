

## Plan: Maximum Semantic Expansion — Pest Clusters for 131 Districts

### Current State

| Dimension | Count | Coverage |
|-----------|-------|----------|
| Pests | 14 | tarakany, klopy, muravyi, blohi, mol, krysy, myshi, kroty, komary, muhi, osy-shershni, cheshuynitsy, kleshchi, mokricy |
| Objects | 11 | kvartir, domov, ofisov, restoranov, skladov, proizvodstv, gostinic, detskih-sadov, hostela, magazinov, avtomobiley |
| Neighborhoods | 131 | All Moscow districts |
| MO Cities | 14 | khimki, mytishchi, balashikha, etc. |
| NCH pages (pest+geo) | 14 pests x 15 top neighborhoods = 210 | Only top 15 districts covered |
| semanticCore.ts pests | 8 of 14 | Missing: komary, muhi, osy-shershni, cheshuynitsy, kleshchi, mokricy |

### Gaps

1. **semanticCore.ts** only tracks 8 pests — missing 6 (komary, muhi, osy-shershni, cheshuynitsy, kleshchi, mokricy)
2. **NCH SSG pages** only generated for top 15 neighborhoods — 116 neighborhoods have zero pest+geo pages
3. **No pest+object semantic entries** — "клопы в квартире", "тараканы в доме" etc. are not mapped
4. **Seasonal/plot pests** (kleshchi, osy, kroty, komary) have no dedicated entries linking to `/uslugi/obrabotka-uchastkov`
5. **MO cities** have no pest-level semantic entries (only service-level)
6. **Neighborhood pages** don't reference pest clusters in text — no internal links to pest hubs

### Expansion Plan

#### 1. Expand `semanticCore.ts` — add missing pest entries

Add 6 missing pests to `pestNamesGen` and `pestServiceMap`:
- komary → dezinsekciya, muhi → dezinsekciya, osy-shershni → dezinsekciya
- cheshuynitsy → dezinsekciya, kleshchi → dezinsekciya, mokricy → dezinsekciya

Add new semantic clusters:
- **pest+object** entries: top 8 pests × top 6 objects = 48 entries (e.g., "уничтожение клопов в квартире" → `/uslugi/dezinsekciya/klopy/kvartir/`)
- **seasonal pest** entries: kleshchi/komary/osy on uchastok → link to `/uslugi/obrabotka-uchastkov/`
- **MO city+pest** entries: top 4 pests × 14 cities = 56 entries

This grows semanticCore from ~350 to ~500 entries.

#### 2. Expand NCH SSG generation — all 14 pests × all 131 neighborhoods

In `seoRoutes.ts`, change NCH generation from `topNeighborhoods` (15) to **tiered**:
- **Tier 1** (priority 0.7): top 4 pests × all 131 neighborhoods = 524 pages
- **Tier 2** (priority 0.65): next 4 pests (muravyi, blohi, mol, kroty) × top 40 neighborhoods = 160 pages
- **Tier 3** (priority 0.6): remaining 6 pests × top 15 neighborhoods = 90 pages

Total NCH: ~774 pages (up from 210). Combined with existing pages, site grows to ~1,500+ SSG pages.

#### 3. Enhance NeighborhoodPage pest blocks

In `NeighborhoodPage.tsx`, add a "Вредители" section that dynamically shows pest chips for all 14 pests, grouped:
- "Насекомые": клопы, тараканы, муравьи, блохи, моль, комары, мухи, осы, чешуйницы, клещи, мокрицы
- "Грызуны": крысы, мыши, кроты

Each chip links to the NCH page `/uslugi/[service]/[pest]/[neighborhood]/` if it exists, otherwise to the pest hub `/uslugi/[service]/[pest]/`.

#### 4. Update `nchSeeds.ts` to match new tiers

Sync `generateNchSeeds()` with the tiered model so it generates correct keyword/priority metadata for all ~774 combinations.

### Files to Edit

```text
src/data/semanticCore.ts     — add 6 missing pests, pest+object, seasonal, MO+pest entries
src/lib/seoRoutes.ts         — expand NCH generation to tiered 131-neighborhood model  
src/data/nchSeeds.ts          — sync tier logic with seoRoutes
src/pages/NeighborhoodPage.tsx — add pest chips section with links to NCH/pest pages
vite-plugin-ssg.ts            — ensure new routes included in SSG
vite-plugin-sitemap.ts        — ensure new routes in sitemap
```

### Page Count After Expansion

```text
Current:  ~1,000 pages
Added:    ~774 NCH pages (pest+geo tiers)
Total:    ~1,774 SSG pages
```

### Not Touching
- Existing routes, slugs, categories
- JSON-LD / Schema.org markup
- Blog articles or blog routes
- Header, Footer, global styles
- App.tsx / AppSSR.tsx routing (NCH pages already handled by existing dynamic routes)

