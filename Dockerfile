# syntax=docker/dockerfile:1.6
# Multi-stage build with explicit per-step instrumentation.
# Each RUN starts/ends with `=== STEP N ===` and `date -u` so failures
# can be located precisely in the GitHub Actions log.

FROM node:20-alpine AS builder
WORKDIR /app
SHELL ["/bin/sh", "-c"]

# STEP 1: environment info
RUN echo "=== STEP 1: env info $(date -u) ===" \
 && node --version \
 && npm --version \
 && free -m || true \
 && df -h /

# STEP 2: install dependencies (separate layer for cache)
COPY package*.json ./
RUN echo "=== STEP 2: npm ci start $(date -u) ===" \
 && npm ci --legacy-peer-deps --no-audit --no-fund --prefer-offline 2>&1 | tail -80 \
 && echo "=== STEP 2: npm ci done $(date -u) ===" \
 && du -sh node_modules

# STEP 3: copy sources
COPY . .
RUN echo "=== STEP 3: source copied $(date -u) ===" \
 && du -sh /app 2>/dev/null | tail -1 \
 && (ls -la /app/.env >/dev/null 2>&1 && echo ".env present" || echo ".env MISSING (SSG may fail)") \
 && echo "files in /app/src/data: $(ls /app/src/data 2>/dev/null | wc -l)"

# STEP 4: vite build (client + SSG via vite-plugin-ssg)
ENV DOCKER_BUILD=true
ARG CACHEBUST=1
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN echo "=== STEP 4: vite build start $(date -u) ===" ; \
    set -o pipefail ; \
    timeout 900 npm run build 2>&1 | tee /tmp/build.log | tail -200 ; \
    EXIT=$? ; \
    echo "=== STEP 4: vite build exit=$EXIT $(date -u) ===" ; \
    if [ $EXIT -ne 0 ]; then \
      echo "--- last 300 lines of build log ---" ; \
      tail -300 /tmp/build.log ; \
      exit $EXIT ; \
    fi

# STEP 5: SSG verification (fail-fast policy)
RUN echo "=== STEP 5: SSG verification $(date -u) ===" \
 && SSG_COUNT=$(find /app/dist -name "index.html" | wc -l) \
 && echo "SSG pages: $SSG_COUNT" \
 && du -sh /app/dist \
 && if [ "$SSG_COUNT" -lt 500 ]; then \
      echo "=== FAIL: only $SSG_COUNT pages (threshold: 500) ===" ; \
      echo "--- dist/ top-level ---" ; ls -la /app/dist/ | head -30 ; \
      echo "--- dist/uslugi/ ---" ; ls /app/dist/uslugi/ 2>/dev/null | head -20 || echo "NO uslugi dir" ; \
      echo "--- last 200 lines of build log ---" ; tail -200 /tmp/build.log ; \
      exit 1 ; \
    fi \
 && echo "=== STEP 5: OK $(date -u) ==="

# STEP 6: nginx runtime stage
FROM nginx:alpine
RUN echo "=== STEP 6: nginx stage start $(date -u) ==="
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh \
 && echo "=== STEP 6: done $(date -u), pages in image: $(find /usr/share/nginx/html -name index.html | wc -l) ==="

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
