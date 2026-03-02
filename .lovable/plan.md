

## Diagnosis: Stale image on server (digest mismatch confirmed)

### What I verified

1. **Code is correct** -- All SSG fixes (`vite-plugin-ssg.ts` with `.env` parsing + Supabase fallbacks, `LazySection.tsx` SSR rendering) are present in the current codebase. Routes for `/rajony/:slug` and `/uslugi/dezinsekciya/:pestSlug` are correctly defined in both `AppSSR.tsx` and the SSG route generator.

2. **Build #440 IS the fix commit** -- From your screenshot: "Improve SSR rendering for SSG", Build and Push Docker Image #440, commit `5810f50`, green checkmark, branch `main`. This is exactly the commit with the SSG fixes.

3. **Docker Hub `latest` contains the fix** -- I checked Docker Hub API directly: `thegusev/sanit-solutions:latest` was pushed at `2026-03-02T01:16:06Z` (matches Build #440 completion time). Manifest digest: `sha256:613d546d634ef6a0583bbd1e6ad829e7e04078eef78448e126aea9526abee45f`.

4. **You confirmed digest mismatch** -- Your server has a different image than what's on Docker Hub. This means your `docker pull` grabbed an older version (likely from Build #439 "Save plan in Lovable", which only had the `package.json` fix but NOT the SSG fixes).

### What to do now (no code changes needed)

Run these commands on the server:

```bash
# 1. Force re-pull (bypass any local cache)
docker pull thegusev/sanit-solutions:latest

# 2. Verify the digest matches Docker Hub
docker inspect thegusev/sanit-solutions:latest --format='{{index .RepoDigests 0}}'
# Expected: sha256:613d546d634ef6a0583bbd1e6ad829e7e04078eef78448e126aea9526abee45f

# 3. Recreate container from new image
docker compose down && docker compose up -d

# 4. Wait 5 seconds, then check SSG files
docker exec goruslugimsk ls /usr/share/nginx/html/rajony/arbat/index.html
docker exec goruslugimsk ls /usr/share/nginx/html/uslugi/dezinsekciya/klopy/index.html

# 5. If files still missing, check SSG output in build logs:
docker logs goruslugimsk 2>&1 | head -50
```

### If files are STILL missing after confirmed correct digest

That would mean SSG is silently failing during Docker build. In that case, rebuild locally to see logs:

```bash
docker build --no-cache . 2>&1 | tee build.log
grep -E "rajony/arbat|klopy|❌|error" build.log
```

This will show whether SSG pages are being generated or skipped with validation errors. Share the output and I will fix the root cause.

### Summary

No code changes. The fix is already in Docker Hub as `latest`. You just need to re-pull because your server has a stale image (confirmed by digest mismatch).

