

## Fix: Strip quotes from `.env` values in SSG build

### Root Cause
`vite-plugin-ssg.ts` line 582 parses `.env` values but keeps wrapping `"..."` quotes. The `.env` file contains:
```
VITE_SUPABASE_URL="https://gimkzlozhwwgetlgtgvj.supabase.co"
```
The parser produces `"https://..."` (with literal `"` chars). Then `JSON.stringify(val)` produces `"\"https://...\""`. At runtime, `import.meta.env.VITE_SUPABASE_URL` evaluates to `"https://..."` — with quote characters inside the string. `createClient()` rejects this as an invalid URL.

The fallback on line 593 never triggers because the key IS present (just contains garbage quotes).

### Fix (1 file, 1 spot)

**`vite-plugin-ssg.ts` line 582** — strip wrapping quotes before `JSON.stringify`:

```typescript
// Current (broken):
const val = trimmed.substring(eqIndex + 1).trim();

// Fixed:
let val = trimmed.substring(eqIndex + 1).trim();
if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
  val = val.slice(1, -1);
}
```

That's the entire fix. After this:
- `val` = `https://gimkzlozhwwgetlgtgvj.supabase.co` (no quotes)
- `JSON.stringify(val)` = `"https://gimkzlozhwwgetlgtgvj.supabase.co"` (valid JS string literal)
- `createClient(url, key)` receives a valid URL
- SSR bundle imports without crashing
- SSG renders all routes
- Docker build succeeds
- Site stops being 404

### Why we don't need to touch `supabase/client.ts`
- It's auto-generated (cannot edit)
- The real `.env` has valid values — the parser just corrupts them with extra quotes
- Once the parser is fixed, `createClient` gets a valid URL and works fine
- No SSR pages make actual Supabase requests (all calls are in `useEffect`, which doesn't run during `renderToString`)

### Technical Details
| File | Line | Change |
|------|------|--------|
| `vite-plugin-ssg.ts` | 582 | Strip wrapping `"` or `'` from env values before `JSON.stringify` |

