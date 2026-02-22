

# Hero Background Fix: Service + Pest Pages

## Problem

1. **ServicePage.tsx**: background image opacity is 0.15 (nearly invisible); no `min-height` on hero; 4 of 7 services have no `heroImage` at all
2. **ServicePestPage.tsx**: pest image only shown as foreground card (`hidden md:block`) -- invisible on mobile; background blur too heavy

## Solution

### Part 1: Add missing `heroImage` to services.ts

| Service slug | heroImage (existing file) |
|---|---|
| deratizaciya | `/images/work/basement-work.png` |
| ozonirovanie | `/images/work/fog-generator.jpg` |
| dezodoraciya | `/images/work/living-room-treatment.png` |
| demerkurizaciya | `/images/work/professional-chemicals.jpg` |

### Part 2: Rework ServicePage.tsx Hero Background

Current (line 189-200): `opacity: 0.15` with weak gradient overlay.

New approach:
- Add `min-h-[60vh]` to the hero section
- Set background `opacity` to `0.55` on desktop, `0.45` on mobile
- Use darker gradient overlay for text contrast: `from-background/85 via-background/65 to-background/40`
- Use `HeroBackground` component (already exists in project) instead of inline styles for consistent responsive behavior

### Part 3: Rework ServicePestPage.tsx Hero Background

Current (line 149-166): Two separate divs for mobile/desktop with heavy blur (5px/8px) that hides the pest.

New approach:
- Reduce blur to `2px` on mobile, `4px` on desktop
- Increase opacity to `0.80` on mobile, `0.60` on desktop
- Add `min-h-[60vh]` to hero section
- Keep the foreground pest card on desktop as-is
- Use `HeroBackground` component for consistent responsive handling

### Part 4: Ensure text contrast

Both pages will get a stronger gradient overlay:
```
bg-gradient-to-r from-background/80 via-background/55 to-background/30
bg-gradient-to-b from-background/20 via-transparent to-background/40
```

This ensures text remains readable while the background image is clearly visible as atmospheric backdrop.

## Files to modify

| File | Changes |
|---|---|
| `src/data/services.ts` | Add `heroImage` to 4 services (deratizaciya, ozonirovanie, dezodoraciya, demerkurizaciya) |
| `src/pages/ServicePage.tsx` | Increase bg opacity from 0.15 to 0.55, add `min-h-[60vh]`, stronger overlay gradient |
| `src/pages/ServicePestPage.tsx` | Reduce blur (2px/4px), increase opacity (0.80/0.60), add `min-h-[60vh]` |

## Expected Result

- Opening any service page (dezinfekciya, ozonirovanie, demerkurizaciya, etc.) shows a visible atmospheric background image behind the hero text
- Opening any pest page (blohi, tarakany, krysy, kroty) shows the pest image as a visible background on both mobile and desktop
- Text remains fully readable with gradient overlays
- Mobile: image visible as background atmosphere, not hidden or cropped away
