

## Problem Diagnosis

The site is returning 404 on all pages because the latest Docker image was built from a failed or broken SSG build. The `npm run build` step in the Dockerfile likely crashes during SSR rendering, producing either zero SSG pages or a broken dist. Since the new fail-fast logic was added but the underlying SSR crash was not fixed, the build either throws and produces no image, or produces an image with only the SPA `index.html` and no SSG pages — resulting in 404 for every route (nginx serves `=404` when no `index.html` exists for a route).

### Root Cause: DOMPurify crashes during SSR

`BlogPost.tsx` line 251 calls `DOMPurify.sanitize()` at render time. DOMPurify internally uses `document.createElement`, `document.implementation`, `Element.prototype`, and other real DOM APIs that the minimal SSR polyfill stubs in `src/ssr/polyfills.ts` do not properly support. This crashes ALL 227+ blog pages during SSR.

Additionally, several components used across all pages (Header, Footer) call `useTraffic()` which internally references the real `TrafficContext`. While the SSR provider is `TrafficProviderSSR`, the `useTraffic()` hook imported by Header/Footer reads from the wrong context — but this returns a fallback and is likely not the crash.

## Plan (4 changes)

### 1. Fix DOMPurify SSR crash in `src/pages/BlogPost.tsx`

DOMPurify cannot run in Node.js without a real DOM. Two options:

**Option A (recommended):** Skip sanitization during SSR. The content is trusted (generated from our own data files), so raw HTML is safe during SSR. Add SSR detection:

```tsx
const isSSR = typeof window === 'undefined' || !window.document?.createElement;

// In render:
dangerouslySetInnerHTML={{ 
  __html: isSSR 
    ? generateContentWithIds(post.content)
    : DOMPurify.sanitize(generateContentWithIds(post.content), { ... })
}}
```

**Option B:** Use `isomorphic-dompurify` or `dompurify` with JSDOM in SSR. Heavier, requires dependency change.

### 2. Add `document.implementation` to SSR polyfills (`src/ssr/polyfills.ts`)

DOMPurify and potentially other libs check `document.implementation.createHTMLDocument`. Add this to the document polyfill:

```typescript
implementation: {
  createHTMLDocument: () => ({
    createElement: () => ({ ... }),
    body: { appendChild: () => {} },
  })
}
```

This is belt-and-suspenders alongside fix #1.

### 3. Enhance SSG per-route logging in `vite-plugin-ssg.ts`

The current logging only shows `✓ path → output` on success or `❌ path: stack` on error. Enhance to show:

- `⏳ Rendering /uslugi/dezinsekciya/klopy...` before each route
- `✓ /uslugi/dezinsekciya/klopy → 45.2KB | 820w` on success  
- `❌ /uslugi/dezinsekciya/klopy: DOMPurify is not a function` on error with full stack

This already mostly exists. The main addition: add a `console.log` before each route render so if the process crashes mid-route, we see which route killed it.

### 4. Add `workflow_dispatch` trigger to `.github/workflows/docker-build.yml`

Allow manual re-runs from GitHub Actions UI:

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:
```

## Files Changed

| File | Change |
|------|--------|
| `src/pages/BlogPost.tsx` | Skip DOMPurify.sanitize during SSR, use raw content |
| `src/ssr/polyfills.ts` | Add `document.implementation` stub |
| `vite-plugin-ssg.ts` | Add pre-render log per route |
| `.github/workflows/docker-build.yml` | Add `workflow_dispatch` |

## Expected Result

After these changes push to `main`:
- GitHub Actions triggers `docker-build.yml`
- `npm run build` succeeds with SSG rendering all ~1000 routes
- Blog pages no longer crash on DOMPurify
- Fail-fast catches any remaining broken routes
- New Docker image pushed to Docker Hub as `latest`
- `deploy.sh` pulls the new image → site restored

