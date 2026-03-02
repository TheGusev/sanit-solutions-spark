

## Diagnosis: SSG routes ARE correctly configured

After thorough investigation, here is what I found:

### What's already correct (no changes needed)
1. **`vite-plugin-ssg.ts`** (line 76-78): `dezinsekciyaPestSlugs` includes `klopy`, `blohi`, and all other pests. Routes are generated at lines 255-261.
2. **`seoRoutes.ts`** (line 54-66): Same slugs present.
3. **`AppSSR.tsx`**: Route `/uslugi/:parentSlug/:subSlug` matches and routes through `ServiceRouteResolver` → `ServicePestPage`.
4. **`ServicePestPage.tsx`**: Correctly reads `parentSlug`/`subSlug` params from SSR context.
5. **`pests.ts`**: Both `klopy` (line 86) and `blohi` (line 186) exist with full data.
6. **`Dockerfile`**: Correctly runs `npm run build` and copies `dist/` to nginx.
7. **`package.json`**: `"build": "vite build"` -- fix from previous session is applied.

### Root cause hypothesis

The SSG configuration is correct. The most likely explanation for missing `klopy/blohi` HTML files is one of:

1. **The latest Docker image hasn't been built yet** -- the `package.json` fix (removing `verify-build.js` from build) was the blocker. If this was just recently published, GitHub Actions may still be running or hasn't been triggered yet.

2. **SSG rendering silently fails for some pages** -- the plugin catches errors (line 708) and skips pages with validation errors (line 662). The Docker build logs would show `❌ /uslugi/dezinsekciya/klopy: [error message]` if this happened.

### No code changes required

The SSG route generation already includes every pest page. There is nothing to add to any configuration file. The pages `/uslugi/dezinsekciya/klopy` and `/uslugi/dezinsekciya/blohi` are already in the SSG route list and will be generated when the build runs successfully.

### What to verify on your end

1. Check GitHub Actions -- has a new run completed successfully after the `package.json` fix?
2. If the run is green, pull the new image and redeploy:
   ```bash
   docker pull thegusev/sanit-solutions:latest
   docker compose up -d
   ```
3. Then verify the files exist:
   ```bash
   docker exec goruslugimsk ls /usr/share/nginx/html/uslugi/dezinsekciya/klopy/index.html
   docker exec goruslugimsk ls /usr/share/nginx/html/uslugi/dezinsekciya/blohi/index.html
   ```
4. If the files still don't exist, check the Docker build logs for SSG errors:
   ```bash
   docker build . 2>&1 | grep -E "klopy|blohi|❌"
   ```

The problem is not missing SSG configuration -- it's that a fresh Docker image with the working build hasn't been deployed yet.

