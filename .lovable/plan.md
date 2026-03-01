

## Plan: Fix SPA fallback in `public/_redirects`

### Change

**File: `public/_redirects`** — replace the last line:

```
# Was:
/*                   /404.html    404

# Becomes:
/*                   /index.html  200
```

All other lines in the file remain unchanged (robots.txt, favicon, 410 for WordPress paths, 404 for wp-json, admin SPA fallback).

### Why this is safe

- Production uses `nginx.conf` with `try_files` — `_redirects` is ignored there
- In Lovable preview, this enables React Router to handle all routes on refresh
- React Router's `NotFound` component still renders for unknown paths on the client side

### Files touched
- `public/_redirects` — one line change (line 31)

### Files NOT touched
- `nginx.conf` ✅
- `vite.config.ts` ✅
- `seoRoutes.ts` ✅

