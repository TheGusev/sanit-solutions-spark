

## Plan: Fix All Remaining Audit Issues

### Remaining issues (5 items):

| # | Issue | Severity | File | Fix |
|---|-------|----------|------|-----|
| H1 | "гарантия 1 год" still in pests.ts:949 | HIGH | `src/data/blog/llm/pests.ts` | Replace with "гарантию до 3 лет" |
| M4 | `seoRoutes.ts` paths lack trailing slashes | MEDIUM | `src/lib/seoRoutes.ts` | Add `/` to all generated paths in `getAllSSGRoutes()` |
| L1 | Nonsensical service+object combos | LOW | `src/lib/seoRoutes.ts` | Prune `demerkurizaciya` from impractical objects (avtomobiley, detskih-sadov, hostela, magazinov, gostinic) |
| L3 | Duplicate relatedServices entry | LOW | `src/data/serviceSubpages.ts:865-866` | Remove duplicate "Уничтожение клопов" link |
| — | `verify-build.js` checks for "Гарантия 1 год" | OK | `scripts/verify-build.js` | This is a BUILD GUARD that catches the issue — keep it |

### Changes

**File 1: `src/data/blog/llm/pests.ts` line 949**
- Replace `гарантию 1 год` → `гарантию до 3 лет`

**File 2: `src/lib/seoRoutes.ts` — `getAllSSGRoutes()`**
- All `path` values in push calls: append trailing slash (e.g., `` `/uslugi/${slug}/` ``)
- Affects ~10 `routes.push()` blocks (services, subpages, pests, objects, districts, neighborhoods, MO cities, blog, NCH tiers)

**File 3: `src/data/serviceSubpages.ts` line 865-866**
- Remove duplicate relatedServices entry (two identical "Уничтожение клопов" links)

**File 4: `src/lib/seoRoutes.ts` — prune nonsensical combos**
- Filter out impractical `demerkurizaciya` + object combos by limiting `demerkurizaciya` to only `['kvartir', 'domov', 'ofisov', 'skladov', 'proizvodstv']`
- This removes ~6 nonsensical pages (gostinic, detskih-sadov, hostela, magazinov, avtomobiley for demerkurizaciya)

