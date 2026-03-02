

## Root Cause: SSG silently skips ALL pages due to regex mismatch

### The Bug (lines 380, 386, 693-698 of `vite-plugin-ssg.ts`)

1. **`react-helmet-async` renders tags WITH attributes**: `<title data-rh="true">Page Title</title>`
2. **`replaceHeadTags` (line 482)** replaces the template's `<title>...</title>` with helmet's version that includes `data-rh="true"`
3. **`extractTitle` (line 380)** uses regex `/<title>([^<]+)<\/title>/` which expects `<title>` WITHOUT attributes — fails to match
4. **Validation (line 441)** adds error: "Missing `<title>` tag"
5. **Line 693-698**: `if (!validation.valid) { continue; }` — **file is never written**

Same issue for `extractDescription` — attribute order/extra attributes break the regex.

Result: every single page fails validation and is skipped. Zero files written. Build stays green because the outer `catch` (line 857) swallows errors.

### Secondary Issue: `LazySection.tsx`

`entry-server.tsx` polyfills `window` and `document`, so `typeof window === 'undefined'` is always `false` during SSR. Children don't render, producing empty/thin HTML that would also fail the word-count check.

### Fix Plan (4 changes)

**1. `vite-plugin-ssg.ts` — Fix title/description regex (lines 380, 386)**
```
- /<title>([^<]+)<\/title>/i
+ /<title[^>]*>([^<]+)<\/title>/i

- /<meta\s+name="description"\s+content="([^"]+)"/i
+ /<meta[^>]*name="description"[^>]*content="([^"]+)"/i
```
Also add reverse-order fallback for description (helmet may render `content` before `name`).

**2. `vite-plugin-ssg.ts` — Always write file, never skip on validation (lines 693-698)**
Change `continue` to just increment error counter but still write the file. Move the critical guard to the END: after all pages, check that critical sample files exist and `throw` if not (fails CI).

**3. `vite-plugin-ssg.ts` — Fail CI on zero pages (line 857)**
Replace silent `catch` with `throw` so Docker build fails red when SSG produces nothing.

**4. `src/components/LazySection.tsx` — Fix SSR detection**
```
- const isSSR = typeof window === 'undefined' || typeof document === 'undefined';
+ const isSSR = typeof import.meta !== 'undefined' && !!(import.meta as any).env?.SSR;
```
`import.meta.env.SSR` is `true` in Vite SSR builds, unaffected by polyfills.

### Expected Outcome

After these 4 changes and a new Publish:
- SSG generates ~1000+ HTML files
- CI fails red if critical pages (`rajony/arbat`, `uslugi/dezinsekciya/klopy`) are missing
- `docker exec goruslugimsk ls /usr/share/nginx/html/rajony/arbat/index.html` returns the file

