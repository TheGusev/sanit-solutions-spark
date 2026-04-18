

Looking at the issue: in mobile accordion of ServiceAreaMap, the layout is District Info Card → Map → District Badges. When user taps a district badge below the map, the info card updates but it's already scrolled out of view above the map. User can't see the change. Plus there's a duplicate "Все 130 районов" — one inside the accordion, another outside (in DesktopStickySidebar or similar component on the home page).

Let me verify the duplicate first.

I'll check what's rendering on the homepage below ServiceAreaMap.

Reading screenshots: First screenshot shows collapsed accordion + below it: "Все 130 районов Москвы" card + "Отзывы наших клиентов" card. So those are SEPARATE components on Index page. The accordion ALSO contains "Все 130 районов Москвы" collapsible inside (per ServiceAreaMap.tsx line ~226). That's the duplication.

Plan:

# Mobile ServiceAreaMap UX Fix

## Problems Identified

1. **Order issue**: Inside mobile accordion, the District Info Card is ABOVE the map and badges. When user taps a district badge (below map), the info updates off-screen — invisible feedback.
2. **Duplicate "Все 130 районов Москвы"**: Appears both inside the accordion AND as a separate card below on the homepage.
3. **Cluttered**: Accordion has 4 stacked sections (info → map → badges → all-districts collapsible) — too long.

## Fix (mobile-only, desktop untouched)

### 1. Reorder mobile accordion to: Selector → Info → Map
New flow inside accordion:
- **Top**: Compact district selector (badges for МСК округа + МО) — tap to choose
- **Middle**: Selected district info card (updates instantly, stays visible right below selector)
- **Bottom**: Map (visual context, optional scroll)

This keeps selection control + result visible together on one screen. No scroll-jump needed.

### 2. Remove duplicate "Все 130 районов" from inside accordion
The standalone card below the section already provides this entry point. Drop the in-accordion `Collapsible` with full neighborhoods list to eliminate duplication and shorten the panel.

### 3. Add visual feedback on tap
- Active badge gets stronger styling (already `default` variant — keep)
- Info card animates subtly on change (fade) so user notices update
- Auto-scroll info card into view if it's off-screen after badge tap

## Files Changed (1 file only)

- **`src/components/ServiceAreaMap.tsx`** — restructure mobile `<AccordionContent>` block only:
  - Move district badges section to top
  - Move info card to middle (with `ref` + `scrollIntoView` on selection change)
  - Move map to bottom
  - Delete the inner `Collapsible` "Все 130 районов" block (lines ~226-273)

## What Does NOT Change

- Desktop layout (`hidden md:block`) — fully preserved
- `YandexMap` component — untouched
- Data sources (`moscowDistricts`, `moscowRegion`, `neighborhoods`) — untouched
- Routes, SEO, schema, analytics — zero impact
- Standalone "Все 130 районов" + "Отзывы" cards on homepage — kept (they're the canonical entry points)
- `selectedArea` state logic — unchanged

## Verification After Change

- Open homepage on 375px mobile viewport
- Tap "Показать карту и список районов" → accordion opens
- Tap any МО badge → info card updates visibly without scroll-jump
- Tap МСК округ badge → same behavior
- Confirm only ONE "Все 130 районов Москвы" card visible in section
- Confirm map still renders below info
- Desktop view unchanged at 1280px+

