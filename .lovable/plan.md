

## Diagnosis: Routes are correct, likely stale image

### What the code shows
1. **vite-plugin-ssg.ts line 255-261**: `/uslugi/dezinsekciya/klopy` IS in the route list with outputPath `uslugi/dezinsekciya/klopy/index.html`
2. **AppSSR.tsx line 66**: `/uslugi/:parentSlug/:subSlug` → `ServiceRouteResolver` → `getPestBySlug('klopy')` → finds pest → renders `ServicePestPage`
3. **Dockerfile line 23**: `COPY --from=builder /app/dist /usr/share/nginx/html` — correct
4. **GitHub Actions line 44-68**: Smoke check already verifies `uslugi/dezinsekciya/klopy/index.html` exists

### Most likely cause
The image you checked was built BEFORE the `.env` quote-stripping fix. If the previous build crashed on `Invalid supabaseUrl`, SSG generated 0 pages (or partial), so `klopy/` was never written. The "861/861 OK" log was from the Lovable preview, not from Docker.

### Plan

1. **Check GitHub Actions status** — go to the repo Actions tab and verify the LATEST run (after the `.env` fix commit) completed successfully, including the "Smoke check SSG coverage" step at line 44-68. If the smoke check passed, the files ARE in the new image.

2. **Pull the NEW image** — run:
   ```bash
   docker pull thegusev/sanit-solutions:latest
   docker run --rm thegusev/sanit-solutions:latest ls /usr/share/nginx/html/uslugi/dezinsekciya/klopy/
   ```

3. **If smoke check FAILED** — then SSG renders that route but something crashes during SSR (e.g., ServicePestPage throws). In that case I'll add a debug log inside `closeBundle()` to print exactly which routes fail and why, and potentially add try/catch guards in ServicePestPage for SSR safety.

### No code changes needed right now
The routing, SSG config, and Dockerfile are all correct. The fix was the `.env` parsing (already applied). We need to confirm the new image was actually built and pulled before making further changes.

