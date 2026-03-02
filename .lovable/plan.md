

## Diagnosis: SSG output path is correct

The SSG plugin writes files directly into `dist/` (line 738-745 of `vite-plugin-ssg.ts`):
```
const outputPath = resolve(distDir, route.outputPath);
// e.g. dist/uslugi/dezinsekciya/klopy/index.html
```

The Dockerfile copies exactly that directory:
```dockerfile
COPY --from=builder /app/dist /usr/share/nginx/html
```

So `dist/uslugi/dezinsekciya/klopy/index.html` → `/usr/share/nginx/html/uslugi/dezinsekciya/klopy/index.html`. The paths are correct.

### What to verify

The `.env` quote-stripping fix was pushed and the build showed **861/861 pages OK** in logs. If the Docker push also completed, then the `latest` image on Docker Hub should contain all SSG pages.

You need to verify on **your server**:

```bash
# 1. Pull the NEW image (force, don't use cache)
docker pull thegusev/sanit-solutions:latest

# 2. Check if SSG pages exist inside the image
docker run --rm thegusev/sanit-solutions:latest ls /usr/share/nginx/html/uslugi/dezinsekciya/klopy/

# 3. Check root contents
docker run --rm thegusev/sanit-solutions:latest ls /usr/share/nginx/html/ | head -20

# 4. If files exist, restart the container
docker compose down && docker compose up -d
```

### If files are missing in the image

That means either:
1. The Docker push didn't complete (the build log showed it was slow) — check GitHub Actions for the final status
2. You're still running the **old** cached image — `docker pull` should fix this

### If files ARE present but site still 404

Check nginx config — `nginx.conf` uses `try_files $uri $uri/index.html =404`. This should work. Verify with:
```bash
curl -I http://localhost:5173/uslugi/dezinsekciya/klopy/
```

### No code changes needed

The SSG output directory and the Dockerfile COPY path are already aligned. The fix was the `.env` quote-stripping (already applied). The issue is confirming the new image was pushed and deployed.

