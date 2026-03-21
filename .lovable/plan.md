

## Plan: Make "Районы" and "Отзывы" collapsible triggers side by side

### Problem
On desktop, the "Все 130 районов Москвы" collapsible block and "Отзывы наших клиентов" collapsible block each take full width as separate sections, creating excessive vertical space.

### Solution
Wrap these two sections in a shared row on desktop (grid 2 columns), keeping them stacked on mobile.

### Steps

1. **Update `src/pages/Index.tsx`** — wrap the `<ServiceAreaMap />` and `<Reviews />` sections in a shared container with `grid grid-cols-1 md:grid-cols-2 gap-4` layout, inside a single `<section>` block.

2. **Update `src/components/ServiceAreaMap.tsx`** — extract the desktop collapsible "Все N районов Москвы" (lines 343-389) into a **separate exported component** `ServiceAreaCollapsible`, so it can be placed independently in the grid. The main `ServiceAreaMap` keeps the map + info panel. The collapsible is no longer rendered inside `ServiceAreaMap` on desktop.

3. **Update `src/components/Reviews.tsx`** — remove the outer `<section>` wrapper so the component can sit inside the shared grid container. The collapsible trigger styling will match the districts trigger: same height, padding, rounded corners, border.

4. **Ensure both triggers have matching height** — use `items-stretch` on the grid so both cards are equal height regardless of content. Font sizes aligned: `text-lg font-semibold` for both titles.

5. **Expanded content** — when either collapsible is opened, the content expands below the grid row spanning full width (`col-span-2` on desktop).

### Mobile behavior
On mobile (`< md`), everything stays stacked vertically as before — no change to mobile layout.

