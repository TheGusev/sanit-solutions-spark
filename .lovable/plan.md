

## Plan: Add background image to "Дезинфекция квартиры" card in MiniPricing

### Approach
Add the uploaded photo as a background image to the first card ("Дезинфекция квартиры") in the MiniPricing services grid. The card gets its own `backgroundImage` with a dark overlay to keep white text readable in both themes.

### Steps

1. **Copy image** to `public/images/services/dezinfekciya-kvartiry-bg.jpg`

2. **Update `src/components/MiniPricing.tsx`**:
   - Add optional `bgImage` field to service objects: first item gets `'/images/services/dezinfekciya-kvartiry-bg.jpg'`
   - In the card div: if `bgImage` exists, render it as `backgroundImage` with `bg-cover bg-center` and add a darker overlay (`bg-black/50`) so text stays readable
   - Cards without `bgImage` keep existing glassmorphism style unchanged

### What stays unchanged
- All links, routes, scroll behavior, analytics
- Section background (`services-bg.jpg`), overlay, heading, button
- Other 7 cards — identical style
- Memory-documented "medical glassmorphism" design language

### Technical detail
The card with background image will use:
```
style={{ backgroundImage: `url('${service.bgImage}')` }}
className="bg-cover bg-center relative overflow-hidden"
```
With an inner `<div className="absolute inset-0 bg-black/45" />` overlay for text contrast, and content wrapped in `relative z-10`.

