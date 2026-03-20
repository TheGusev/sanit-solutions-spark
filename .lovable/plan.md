

## Plan: Add background image to "Дезинсекция (тараканы, клопы)" card in MiniPricing

### Steps

1. **Copy image** to `public/images/services/dezinsekciya-bg.jpg`

2. **Update `src/components/MiniPricing.tsx`** — add `bgImage: '/images/services/dezinsekciya-bg.jpg'` to the "Дезинсекция (тараканы, клопы)" service object (2nd item in array)

Existing card rendering logic handles `bgImage` automatically — no template changes needed.

