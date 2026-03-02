

## Fix: SSR renders AnimatedSection content as invisible

### Problem
`useScrollAnimation` initializes `useState(false)`. During SSR, `useEffect` never executes (React's `renderToString` skips effects). So `isVisible` stays `false` → `AnimatedSection` applies `opacity-0 translate-y-10` → all SSG HTML has invisible content.

This means even though files are generated, the HTML contains hidden content — bad for SEO and users with JS disabled.

### Fix
One line change in `src/hooks/useScrollAnimation.ts` line 12:

```typescript
// BEFORE:
const [isVisible, setIsVisible] = useState(false);

// AFTER:
const [isVisible, setIsVisible] = useState(typeof window === 'undefined');
```

This makes `isVisible = true` during SSR (content visible in HTML), and `isVisible = false` on client (so animation plays on scroll). The `useEffect` SSR guard inside the effect is fine and can stay as-is.

### No other changes needed
- All Supabase imports are correctly migrated (verified: zero non-admin files import from `@/integrations/supabase/client`)
- `useParallax` is safe (offset defaults to 0, effect guarded)
- `supabaseClient.ts` wrapper is correctly structured
- `reviews.ts` static data exists
- `vite-plugin-ssg.ts` error logging includes full stack trace
- Route generation covers all required paths (klopy, blohi, arbat, etc.)

### To verify the build
After this fix, run locally:
```bash
npm run build
# Check for zero ❌ CRASH lines
# Check files exist:
test -f dist/uslugi/dezinsekciya/klopy/index.html && echo "✅ klopy"
test -f dist/rajony/arbat/index.html && echo "✅ arbat"
```

