

## Plan: Make calculator slider wider/thicker on mobile, range 30–200

### Changes

**1. `src/components/ui/slider.tsx`** — increase track and thumb size on mobile:
- Track: `h-2` → `h-2 md:h-2` base, add mobile override `h-4` (thicker on mobile)
- Thumb: `h-5 w-5` → `h-8 w-8 md:h-5 md:w-5` (larger touch target on mobile)

**2. `src/components/Calculator.tsx`** (lines 455–461) — change slider range:
- `min={10}` → `min={30}`
- `max={1000}` → `max={200}`
- Default area `useState(50)` stays at 50 (within new range)
- Keep `step={10}`
- The manual input field keeps `max={5000}` for custom entry beyond slider range

