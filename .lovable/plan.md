

## Plan: Dark Theme Article Cards Enhancement

### Change
**One line edit** in `src/pages/Blog.tsx` (line 225) — update the article card container classes to use a darker elevated surface in dark mode with a soft shadow, matching the folder card aesthetic.

Current:
```
bg-card p-4 border-l-2 border-l-primary/15
```

Updated:
```
dark:bg-[hsl(240,10%,16%)] bg-card p-4 border-l-2 border-l-primary/15 dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] dark:border-border/50
```

This uses the same elevated dark surface (`hsl(240,10%,16%)`) as the folder cards, adds a soft dark shadow, and slightly tones down the border for cohesion. Light mode stays unchanged.

### Files
1. `src/pages/Blog.tsx` — line 225, card `className` update only

