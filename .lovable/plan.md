

## Fix Plan

### Problem
Build fails with: `Top-level await is not available in the configured target environment ("es2020")`

The `src/lib/supabaseClient.ts` wrapper uses `await import(...)` at the top level (line 72), which es2020 doesn't support.

Additionally, 2 non-admin files were missed and still import directly from `@/integrations/supabase/client`:
- `src/components/QuickCallForm.tsx` (line 5)
- `src/pages/ReviewsPage.tsx` (line 13)

### Changes

**1. Rewrite `src/lib/supabaseClient.ts`** — Replace top-level `await` with a synchronous conditional approach:

```typescript
let supabase: any;

if (import.meta.env.SSR) {
  supabase = noopClient;
} else {
  // Static import — Vite tree-shakes the SSR branch
  // This import runs only in the client bundle
  supabase = (await import('@/integrations/supabase/client')).supabase;
}
```

Replace with a pattern that doesn't use top-level await. Two options:
- **Option A**: Use `import()` inside a lazily-evaluated getter (complex)
- **Option B**: Directly import the real client at the top and use `import.meta.env.SSR` to decide which to export. Since the SSR build uses `define` to set env vars, Vite will tree-shake the unused branch.

Option B is cleanest:
```typescript
import { supabase as realClient } from '@/integrations/supabase/client';

export const supabase = import.meta.env.SSR ? noopClient : realClient;
```

Wait — this would still import the real client during SSR. The key insight: the SSR build in `vite-plugin-ssg.ts` uses `define: { 'import.meta.env.SSR': 'true' }` which means Vite/Rollup will statically replace the condition and tree-shake the dead branch. But the `import` statement at the top is NOT tree-shaken by Rollup for side-effectful modules.

**Correct approach**: Keep the noopClient, but use a lazy initialization pattern without top-level await:

```typescript
// No top-level await. Use a module-level variable with lazy init.
let _supabase: any;

if (import.meta.env.SSR) {
  _supabase = noopClient;
} else {
  // Synchronous re-export works because in the CLIENT build,
  // this module is bundled normally and the import resolves at bundle time.
  // We use a dynamic require-like pattern via Vite's static analysis.
}

export { _supabase as supabase };
```

Actually the simplest fix: since `import.meta.env.SSR` is statically replaced at build time by Vite, we can use a conditional dynamic import that Vite will tree-shake in the client bundle, but we need to avoid top-level await. The solution is to **synchronously import** the real client module but guard the actual `createClient` call. However, we can't control `@/integrations/supabase/client.ts`.

**Final correct approach**: Export noopClient during SSR. For the client bundle, just re-export the real client. Use two separate code paths with Vite's dead code elimination:

```typescript
// src/lib/supabaseClient.ts
const noopClient = { ... };

let supabase: any;
if (import.meta.env.SSR) {
  supabase = noopClient;
} else {
  // This top-level import will be included only in the CLIENT bundle.
  // In the SSR bundle, Vite replaces import.meta.env.SSR with true,
  // and Rollup eliminates this dead branch + its imports.
  const { supabase: real } = await import('@/integrations/supabase/client');
  supabase = real;
}
export { supabase };
```

The problem is that even though Vite eliminates the SSR branch, the **client build** still has the `await` and targets es2020. We need the client build to support top-level await OR avoid it entirely.

**Actual fix**: Change `vite.config.ts` build target to support top-level await (`es2022`+), OR avoid dynamic import entirely by importing the real client statically but wrapping the export:

```typescript
// For client bundle: static import is fine (browser has localStorage)
// For SSR bundle: Vite's define replaces import.meta.env.SSR → true,
//   and rollup tree-shakes the import away
import { supabase as realClient } from '@/integrations/supabase/client';

export const supabase: any = import.meta.env.SSR 
  ? noopClient 
  : realClient;
```

This works IF rollup properly tree-shakes the static import in SSR mode. Let me check if Vite/Rollup does that... It doesn't tree-shake static imports even in dead branches. The import statement always executes.

**The real fix**: Change the build target to `es2022` which supports top-level await. This is the minimal change.

### Technical Details

**File 1: `vite.config.ts`** — Add `build.target: 'es2022'` (or `'esnext'`) to support top-level await.

**File 2: `src/components/QuickCallForm.tsx`** — Change import from `@/integrations/supabase/client` to `@/lib/supabaseClient`.

**File 3: `src/pages/ReviewsPage.tsx`** — Change import from `@/integrations/supabase/client` to `@/lib/supabaseClient`.

