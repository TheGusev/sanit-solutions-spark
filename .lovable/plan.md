

# Fix: Pest Page Hero Background Visibility on Mobile

## Problem

On mobile, pest images in the Hero section are nearly invisible. The current CSS applies `opacity: 0.80` to the background image, but then layers TWO gradient overlays on top:
- `from-background/80 via-background/55 to-background/30` (horizontal)
- `from-background/20 via-transparent to-background/40` (vertical)

The combined effect makes the image almost completely hidden behind white overlays on mobile.

On desktop the image is visible because the foreground card shows it separately, and the background has lower opacity (0.60) which paradoxically looks better because of the overlay math.

## Solution

Adjust the mobile-specific values to make the background image clearly visible:

### File: `src/pages/ServicePestPage.tsx`

**Current mobile CSS:**
```css
.pest-hero-bg {
  filter: blur(2px);
  opacity: 0.80;
}
```

**New mobile CSS:**
```css
.pest-hero-bg {
  filter: blur(1px);
  opacity: 0.95;
}
```

**Current desktop CSS (keep as-is but reduce blur slightly):**
```css
@media (min-width: 768px) {
  .pest-hero-bg {
    filter: blur(4px);
    opacity: 0.60;
  }
}
```

**New desktop CSS:**
```css
@media (min-width: 768px) {
  .pest-hero-bg {
    filter: blur(3px);
    opacity: 0.65;
  }
}
```

**Reduce overlay strength** (line 173-174):
- Change `from-background/80` to `from-background/60`
- Change `via-background/55` to `via-background/35`
- Change vertical `from-background/20` to `from-background/10`

This results in:
```
bg-gradient-to-r from-background/60 via-background/35 to-background/30
bg-gradient-to-b from-background/10 via-transparent to-background/30
```

## Expected Result

- Mobile: pest image clearly visible as atmospheric background, text still readable over lighter gradient
- Desktop: pest image visible as background atmosphere with foreground card intact
- Text contrast maintained through gradient overlay (just less heavy)

## Files to modify

| File | Change |
|---|---|
| `src/pages/ServicePestPage.tsx` | Increase mobile opacity to 0.95, reduce blur to 1px, lighten overlay gradients |

