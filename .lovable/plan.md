

## Plan: Two Yandex Metrika Goals for Homepage

### Goals to create

1. **`main_scroll_75`** — fires when user scrolls 75% of the homepage
2. **`main_time_2min`** — fires when user spends 2 minutes with the page **actively visible** (uses `document.visibilitychange` API to pause/resume timer when tab is hidden)

### Implementation

**File: `src/hooks/useHomepageGoals.ts`** (new)
- Custom hook that combines both goals
- Scroll 75%: listens to `scroll` event, calculates percent, fires `trackGoal('main_scroll_75')` once
- Active 2 min: uses `setInterval` + `document.visibilityState` to accumulate only visible time, fires `trackGoal('main_time_2min')` once at 120s
- Both goals fire only once per session (guarded by refs)

**File: `src/pages/Index.tsx`**
- Import and call `useHomepageGoals()` (one line addition, replaces or supplements existing `useScrollDepth()`)

### Yandex Metrika setup

You'll need to add these two goals in Yandex Metrika (counter 105828040):

| Goal name | Identifier | Type |
|---|---|---|
| Скролл 75% главной | `main_scroll_75` | JavaScript-событие |
| 2 мин на главной | `main_time_2min` | JavaScript-событие |

