

# Plan: Add 118 Missing Blog Articles to SSG

## Problem
Currently `vite-plugin-ssg.ts` contains only 50 blog slugs (legacy articles). The remaining 118 articles from `pests-articles.ts` (63), `premises-articles.ts` (42), and `legal-articles.ts` (11) are rendered only via client-side SPA, making them invisible to search engines.

## Solution
Add all 118 missing blog slugs to both `vite-plugin-ssg.ts` and `seoRoutes.ts`.

## Technical Details

### 1. Update `vite-plugin-ssg.ts` (lines 130-186)

Replace the `blogSlugs` array with the full list of 168 slugs:

**Existing 50 legacy slugs** -- keep as-is

**Add 63 pest article slugs** (9 templates x 5 insect pests + 5 templates x 2 rodent pests):
- Pattern: `{slugPrefix}-{pestSlug}` 
- Insect slugs: `tarakany`, `klopy`, `muravyi`, `blohi`, `mol`
- Templates (9): `kak-izbavitsya-ot`, `v-kvartire`, `otkuda-berutsya`, `narodnye-sredstva-ot`, `professionalnaya-obrabotka-ot`, `profilaktika`, `chem-opasny`, `posle-obrabotki`, `ceny-na-unichtozhenie`
- Rodent slugs: `krysy`, `myshi`
- Rodent templates (5): first 5 from above list

**Add 42 premises article slugs** (7 templates x 6 object types):
- Pattern: `{slugPrefix}-{objectSlug}`
- Object slugs: `kvartir`, `domov`, `ofisov`, `restoranov`, `skladov`, `proizvodstv`
- Templates (7): `dezinsekciya`, `deratizaciya`, `podgotovka-k-obrabotke`, `stoimost-obrabotki`, `posle-obrabotki`, `vrediteli-v`, `profilaktika-vreditelej-v`

**Add 11 legal article slugs** (hardcoded):
- `sanpin-trebovaniya-2026`, `trebovaniya-rospotrebnadzora-2026`, `dokumenty-dlya-obshhepita`, `zhurnal-uchyota-dezinsekcii`, `licenziya-na-dezinfekciyu`, `shtrafy-za-vrediteley`, `haccp-i-dezinsekciya`, `dogovor-na-dezinsekciyu-obrazec`, `proverka-ses-kak-podgotovitsya`, `bezopasnost-preparatov`, `kak-vybrat-kompaniyu`

### 2. Update `src/lib/seoRoutes.ts` (lines ~168-233)

Synchronize `blogArticleSlugs` array with the same full list of 168 slugs to keep the single source of truth consistent.

### 3. Update `src/AppSSR.tsx`

Verify `BlogPost` route `/blog/:slug` is already present (confirmed -- it is).

### Result
- Total blog articles in SSG: 50 + 63 + 42 + 11 = **168 articles**
- All articles will get static HTML at build time
- Search engines will be able to crawl and index all 168 articles
- Total sitemap URLs: ~468 --> ~586
