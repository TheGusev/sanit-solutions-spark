

## Plan: Auto-detect device theme on mobile

### Problem
Currently the site defaults to `light` theme regardless of user's device settings. On mobile, users expect the site to match their system theme (dark/light).

### Solution
Change the `ThemeProvider` in `App.tsx` from `defaultTheme="light"` to `defaultTheme="system"` — this will use the device's preferred color scheme via `prefers-color-scheme` media query. This applies to both mobile and desktop on first visit, which is standard UX behavior.

### Steps

1. **Update `src/App.tsx`** — change `defaultTheme="light"` to `defaultTheme="system"` in the `ThemeProvider` component.

One-line change, no other files affected.

