

## Plan: Add background image to "Удаление запахов" card in MiniPricing

### Steps

1. **Copy image** to `public/images/services/dezodoraciya-bg.jpg`

2. **Update `src/components/MiniPricing.tsx`** — add `bgImage: '/images/services/dezodoraciya-bg.jpg'` to the "Удаление запахов" service object (5th item in array, line 11)

Existing card rendering logic handles `bgImage` automatically — no template changes needed.

