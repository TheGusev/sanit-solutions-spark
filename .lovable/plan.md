

# Plan: 15+ Geo-Specific Blog Articles for Moles (Kroty)

## What exists now
- `kroty` is in `pests.ts` with full data
- 5 generic mole articles auto-generated via `rodentsArticles` in `pests-articles.ts` (e.g. `kak-izbavitsya-ot-kroty`)
- These 5 are already in SSG/Sitemap

## What's missing
15+ geo-articles targeting specific Moscow highways and suburban areas where moles are a real problem.

## Implementation

### 1. New file: `src/data/blog/mole-geo-articles.ts`

Create 18 geo-specific articles (6 per highway direction):

**Novorizhskoe highway (6):**
- `kroty-novorizhskoe-shosse` -- General: moles along Novorizhskoe highway
- `kroty-istra` -- Moles in Istra area
- `kroty-krasnogorsk` -- Moles in Krasnogorsk
- `kroty-nakhabino` -- Moles in Nakhabino
- `kroty-dedovsk` -- Moles in Dedovsk
- `kroty-snt-novaya-riga` -- Moles in SNTs along Novaya Riga

**Rublevskoe highway (6):**
- `kroty-rublevskoe-shosse` -- General: moles along Rublevskoe highway
- `kroty-odintsovo` -- Moles in Odintsovo
- `kroty-barvikha` -- Moles in Barvikha
- `kroty-usovo` -- Moles in Usovo
- `kroty-zhukovka` -- Moles in Zhukovka
- `kroty-snt-rublevka` -- Moles in SNTs along Rublevka

**Dmitrovskoe highway (6):**
- `kroty-dmitrovskoe-shosse` -- General: moles along Dmitrovskoe highway
- `kroty-dolgoprudny` -- Moles in Dolgoprudny
- `kroty-lobnya` -- Moles in Lobnya
- `kroty-dmitrov` -- Moles in Dmitrov
- `kroty-yakhroma` -- Moles in Yakhroma
- `kroty-snt-dmitrovka` -- Moles in SNTs along Dmitrovka

Each article will have:
- Unique geo-relevant content (1500-2000 words)
- Local landmarks and specifics (soil types, terrain)
- FAQ (3-4 questions with geo context)
- Tags: `кроты`, `дератизация`, highway name, city name
- Author: Aleksandr Afanasiev (rodent specialist)
- `relatedServices: ['deratizaciya']`
- Category: `Дератизация`
- Pricing table for land plots (6 soток, 10 соток, 15 соток, 20+ соток)

### 2. Update `src/data/blog/index.ts`

Import `moleGeoArticles` from the new file and add to `allBlogArticles` array.

### 3. Update `vite-plugin-ssg.ts`

Add all 18 new blog slugs to the `blogSlugs` array.

### 4. Update `src/lib/seoRoutes.ts`

Add all 18 slugs to `blogArticleSlugs` array.

### 5. Update `src/data/semanticCore.ts`

Add 18 semantic entries for geo-mole queries:
- `уничтожение кротов новорижское шоссе` -> `/blog/kroty-novorizhskoe-shosse`
- `кроты истра участок` -> `/blog/kroty-istra`
- etc.

### Result
- 18 new geo-specific blog articles
- Total blog articles: 168 + 18 = **186**
- All new articles in SSG and Sitemap
- Semantic core entries for geo targeting
