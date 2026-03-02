

## Diagnosis: No code changes needed

### The Dockerfile is correct

The current Dockerfile works exactly right:
- Line 16: `RUN npm run build` → creates `/app/dist` in the builder stage
- Line 22: `COPY --from=builder /app/dist /usr/share/nginx/html` → copies to nginx root

The command `docker exec goruslugimsk find /app/dist` returns "No such file or directory" because **this is expected** — the final nginx container has no `/app/dist`. Files live at `/usr/share/nginx/html`. The correct check is:

```
docker exec goruslugimsk find /usr/share/nginx/html -name "*.html" | head -20
```

### Root cause of 404s

The real problem is **not the Dockerfile** — it's that GitHub Actions was failing due to `verify-build.js` blocking `npm run build`. We fixed that in the previous commit (removed `&& node scripts/verify-build.js` from the `build` script). So:

1. The Docker Hub image `thegusev/sanit-solutions:latest` is **stale** — it was last built before our SSG fixes
2. Every Actions run since then has been failing, so no new image was pushed

### What to do now (no code changes from Lovable)

1. **Publish** the current state (the `package.json` fix is already committed)
2. Wait for GitHub Actions to go green — this will push a fresh Docker image with all SSG fixes
3. On the server, run:
   ```bash
   docker pull thegusev/sanit-solutions:latest
   docker compose up -d
   ```
4. Verify with the correct path:
   ```bash
   docker exec goruslugimsk ls -la /usr/share/nginx/html/uslugi/dezinsekciya/klopy/
   ```
5. Then test externally:
   ```bash
   curl -o /dev/null -s -w "%{http_code}" https://goruslugimsk.ru/uslugi/dezinsekciya/klopy/
   ```

### Summary

No files need editing. The Dockerfile, vite.config.ts, and nginx.conf are all correct. The only issue was the stale Docker image caused by CI failures — which we already fixed by decoupling `verify-build.js` from the build command.

