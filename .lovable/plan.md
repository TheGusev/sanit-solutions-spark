

## Plan: Add background image to "Борьба с кротами" card in MiniPricing

### Steps

1. **Copy image** to `public/images/services/borba-s-krotami-bg.jpg`

2. **Update `src/components/MiniPricing.tsx`** — add `bgImage: '/images/services/borba-s-krotami-bg.jpg'` to the "Борьба с кротами" service object (7th item in array, line 13)

Existing card rendering logic handles `bgImage` automatically — no template changes needed.

