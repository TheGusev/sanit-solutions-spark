

## Plan: Add background image to "Дератизация" card in MiniPricing

### Steps

1. **Copy image** to `public/images/services/deratizaciya-bg.jpg`

2. **Update `src/components/MiniPricing.tsx`** — add `bgImage: '/images/services/deratizaciya-bg.jpg'` to the "Дератизация" service object (3rd item in array)

The card rendering logic already handles `bgImage` (dark overlay + `relative z-10` content) from the previous edit — no template changes needed.

