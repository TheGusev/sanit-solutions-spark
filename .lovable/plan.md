

## Diagnosis

The build timeout (`deadline_exceeded`) and missing SSG pages have ONE root cause chain:

**The Supabase client (`@/integrations/supabase/client`) is imported at module-level by components that are rendered during SSR.** When the SSR bundle loads, it initializes the Supabase SDK which validates URLs, touches `localStorage`, and adds weight. Even with polyfills, this slows/crashes the SSG rendering of 900+ pages.

### Import chain that pulls Supabase into SSR:

```text
AppSSR.tsx
  → IndexSSR.tsx → Hero.tsx → import { supabase } from '@/integrations/supabase/client'  ❌ DIRECT
  → IndexSSR.tsx → Hero.tsx → import { useTraffic } from '@/contexts/TrafficContext'
                                → TrafficContext.tsx → import { supabase } from '...'  ❌ DIRECT
  → IndexSSR.tsx → Reviews.tsx → import { supabase } from '...'  ❌ DIRECT
  → IndexSSR.tsx → Reviews.tsx → ReviewFormModal.tsx → import { supabase } from '...'  ❌ DIRECT
  → All pages using Header.tsx → useTraffic → TrafficContext.tsx → supabase  ❌
  → ServiceQuiz.tsx → supabase  ❌
  → HeroCallbackForm.tsx → supabase  ❌
  → CompactRequestModal.tsx → supabase  ❌
  → LeadFormModal.tsx → supabase  ❌
  → Calculator.tsx → supabase  ❌
```

Additionally, `useScrollAnimation.ts` and `useParallax.ts` use `IntersectionObserver`, `window.scrollY`, and `requestAnimationFrame` without SSR guards — these crash in Node.js.

### Plan (6 tasks)

**Task 1: Create SSR-safe Supabase wrapper** (`src/lib/supabaseClient.ts`)

Create a wrapper that exports a full no-op client during SSR and the real client on the browser:

```typescript
const noopChain = () => new Proxy({}, { get: () => noopChain });
// + explicit methods: from(), functions.invoke(), auth.getSession(), etc.
export const supabase = import.meta.env.SSR ? noopClient : realClient;
```

**Task 2: Update all 11 non-admin files** to import from `@/lib/supabaseClient` instead of `@/integrations/supabase/client`:

- `src/contexts/TrafficContext.tsx`
- `src/hooks/useTrafficContext.ts` (dynamic import on line 62)
- `src/hooks/useABVariant.ts`
- `src/hooks/useMVTVariant.ts`
- `src/hooks/useMLPrediction.ts`
- `src/components/Hero.tsx`
- `src/components/Reviews.tsx`
- `src/components/ReviewFormModal.tsx`
- `src/components/HeroCallbackForm.tsx`
- `src/components/ServiceQuiz.tsx`
- `src/components/CompactRequestModal.tsx`
- `src/components/LeadFormModal.tsx`
- `src/components/Calculator.tsx`
- `src/components/ABTestDebug.tsx`
- `src/components/ABTestStats.tsx`

Admin pages (`src/pages/admin/*`) are NOT in AppSSR.tsx — leave unchanged.

**Task 3: Create static reviews data** (`src/data/reviews.ts`)

Create a static reviews array for SSR. Update `Reviews.tsx` to use static data as default state, with client-side fetch to refresh if available.

**Task 4: Fix SSR-unsafe hooks**

- `useScrollAnimation.ts`: Return `{ ref, isVisible: true }` during SSR (no IntersectionObserver)
- `useParallax.ts`: Return `0` during SSR (no window.scrollY)
- `AnimatedSection.tsx`: Already uses these hooks — once they're SSR-safe, it works automatically

**Task 5: Clean up vite-plugin-ssg.ts**

Remove the Supabase-specific diagnostic logging (lines 597-611). Keep the .env parsing and placeholder fallback as safety net but remove the noise.

**Task 6: Verify error.stack logging**

Confirm the catch block at line 762 already logs `error.stack` fully (it does — verified at line 762).

### Files to create
- `src/lib/supabaseClient.ts` — SSR-safe wrapper
- `src/data/reviews.ts` — Static reviews data

### Files to modify
- `src/contexts/TrafficContext.tsx` — Change import
- `src/hooks/useTrafficContext.ts` — Change dynamic import path
- `src/hooks/useABVariant.ts` — Change import
- `src/hooks/useMVTVariant.ts` — Change import
- `src/hooks/useMLPrediction.ts` — Change import
- `src/hooks/useScrollAnimation.ts` — Add SSR guard
- `src/hooks/useParallax.ts` — Add SSR guard
- `src/components/Hero.tsx` — Change import
- `src/components/Reviews.tsx` — Use static data + change import
- `src/components/ReviewFormModal.tsx` — Change import
- `src/components/HeroCallbackForm.tsx` — Change import
- `src/components/ServiceQuiz.tsx` — Change import
- `src/components/CompactRequestModal.tsx` — Change import
- `src/components/LeadFormModal.tsx` — Change import
- `src/components/Calculator.tsx` — Change import
- `src/components/ABTestDebug.tsx` — Change import
- `src/components/ABTestStats.tsx` — Change import
- `vite-plugin-ssg.ts` — Remove Supabase diagnostic noise

### Not modified
- `src/integrations/supabase/client.ts` — Auto-generated, never touch
- `.env` — Auto-generated, never touch
- `src/pages/admin/*` — Not in SSR path
- `nginx.conf`, `docker-compose.yml` — Per user instructions

