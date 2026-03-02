

## Diagnosis

The crash is at line 582 of `vite-plugin-ssg.ts`. The `.env` file contains values wrapped in double quotes:
```
VITE_SUPABASE_URL="https://gimkzlozhwwgetlgtgvj.supabase.co"
```

The current parser does `const val = trimmed.substring(eqIndex + 1).trim()` which produces `"https://..."` (with literal quote chars). Then `JSON.stringify(val)` double-escapes them, so at runtime `import.meta.env.VITE_SUPABASE_URL` becomes the string `"https://..."` — with literal `"` characters. This fails `validateSupabaseUrl` because `"https://...` is not a valid URL.

**We cannot edit `src/integrations/supabase/client.ts`** — it's auto-generated. But we don't need to. The fix is purely in the env parsing.

## Plan (1 file, 1 line)

### Fix: Strip wrapping quotes from env values in `vite-plugin-ssg.ts`

At line 582, after extracting `val`, strip surrounding single/double quotes:

```typescript
let val = trimmed.substring(eqIndex + 1).trim();
// Strip wrapping quotes (e.g. "value" or 'value')
if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
  val = val.slice(1, -1);
}
```

That's the entire fix. After this:
- `VITE_SUPABASE_URL` becomes `https://gimkzlozhwwgetlgtgvj.supabase.co` (no quotes)
- `JSON.stringify(val)` produces `"https://gimkzlozhwwgetlgtgvj.supabase.co"` (valid JS string)
- `createClient(url, key)` receives a valid URL
- SSR bundle imports without crashing
- SSG renders all routes
- Docker image builds successfully
- Site stops being 404

### Why we don't need to touch supabase client or add SSR guards

- `client.ts` is auto-generated (cannot edit)
- SSR polyfills already stub `localStorage`, so `auth.storage: localStorage` works
- No page in the SSR tree makes top-level Supabase requests — all calls are inside `useEffect` which doesn't execute during `renderToString`
- `AppSSR.tsx` uses `TrafficProviderSSR` (not the real one), so no Supabase calls in the provider either

### Files changed

| File | Change |
|------|--------|
| `vite-plugin-ssg.ts` line 582 | Strip wrapping quotes from `.env` values before `JSON.stringify` |

