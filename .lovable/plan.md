## Цель

Сборка падает/виснет, и непонятно где. Текущий `docker build` — один большой шаг без промежуточных логов: всё от `npm ci` до nginx-слоя выглядит как один blob. Нужна **пошаговая отладка с таймстампами**, чтобы по логам GitHub Actions можно было точно сказать: «упало на этапе X через Y минут».

## Что делаю

### 1. `Dockerfile` — разбить на отдельные RUN-шаги с таймингами

Сейчас всё в одном `RUN npm run build ...`. Разделю на изолированные шаги, каждый с явным эхо `=== STEP N: ... ===` и `date -u`. Если шаг провалится — в логе будет видно конкретный этап и его длительность.

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app

# STEP 1: системные зависимости + информация о среде
RUN echo "=== STEP 1: env info $(date -u) ===" && \
    node --version && npm --version && \
    free -m && df -h /

# STEP 2: установка зависимостей (отдельный слой для кэша)
COPY package*.json ./
RUN echo "=== STEP 2: npm ci start $(date -u) ===" && \
    npm ci --legacy-peer-deps --no-audit --no-fund --prefer-offline 2>&1 | tail -50 && \
    echo "=== STEP 2: npm ci done $(date -u) ===" && \
    du -sh node_modules

# STEP 3: копирование исходников
COPY . .
RUN echo "=== STEP 3: source copied $(date -u) ===" && \
    du -sh /app --exclude=node_modules && \
    ls -la /app/.env 2>/dev/null && echo ".env present" || echo ".env MISSING"

# STEP 4: vite client build (без SSG)
ENV DOCKER_BUILD=true
ARG CACHEBUST=1
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN echo "=== STEP 4: vite build start $(date -u) ===" && \
    timeout 600 npm run build 2>&1 | tee /tmp/build.log | tail -100 ; \
    EXIT=${PIPESTATUS[0]} ; \
    echo "=== STEP 4: vite build exit=$EXIT $(date -u) ===" ; \
    if [ $EXIT -ne 0 ]; then \
      echo "--- last 200 lines of build log ---" ; tail -200 /tmp/build.log ; \
      exit $EXIT ; \
    fi

# STEP 5: верификация SSG
RUN echo "=== STEP 5: SSG verification $(date -u) ===" && \
    SSG_COUNT=$(find /app/dist -name "index.html" | wc -l) && \
    echo "SSG pages: $SSG_COUNT" && \
    du -sh /app/dist && \
    if [ "$SSG_COUNT" -lt 500 ]; then \
      echo "FAIL: only $SSG_COUNT pages" ; \
      ls /app/dist/uslugi/ 2>/dev/null | head -20 ; \
      tail -100 /tmp/build.log ; exit 1 ; \
    fi

# STEP 6: nginx этап
FROM nginx:alpine
RUN echo "=== STEP 6: nginx stage $(date -u) ==="
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh && \
    echo "=== STEP 6: done, files in /usr/share/nginx/html: $(find /usr/share/nginx/html -name index.html | wc -l) ==="
EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
```

### 2. `.github/workflows/docker-build.yml` — добавить диагностику вокруг docker build

Оборачиваю `docker build` в режим с явным выводом и метриками; ставлю `BuildKit progress=plain`, чтобы каждый RUN-шаг печатался в реальном времени, а не схлопывался.

```yaml
- name: Pre-build diagnostics
  run: |
    echo "=== Runner $(date -u) ==="
    df -h
    free -m
    docker version
    echo "Build context size:"
    du -sh . --exclude=.git
    echo "Top 10 largest dirs:"
    du -sh */ 2>/dev/null | sort -rh | head -10

- name: Build image (verbose)
  env:
    DOCKER_BUILDKIT: 1
    BUILDKIT_PROGRESS: plain
  run: |
    set -o pipefail
    START=$(date +%s)
    docker build \
      --progress=plain \
      --build-arg CACHEBUST=${{ github.sha }} \
      -t ${{ env.IMAGE_NAME }}:${{ github.sha }} \
      -t ${{ env.IMAGE_NAME }}:latest \
      . 2>&1 | ts '[%H:%M:%S]' || true
    EXIT=${PIPESTATUS[0]}
    END=$(date +%s)
    echo "=== Build finished: exit=$EXIT, duration=$((END-START))s ==="
    [ $EXIT -ne 0 ] && exit $EXIT
    docker images ${{ env.IMAGE_NAME }}

- name: Post-build diagnostics
  if: always()
  run: |
    df -h
    docker system df
```

(`ts` ставит таймстамп на каждой строке; пакет `moreutils` есть в ubuntu-latest.)

Smoke check и push остаются как есть — они не виноваты, проблема до них не доходит.

## Что это даст

После следующего запуска в логах будет видно:

- **Если виснет npm ci** — последняя строка `=== STEP 2: npm ci start ...`, дальше тишина → проблема в registry/сети npm.
- **Если виснет vite build** — `=== STEP 4: vite build start ...` без `=== STEP 4: ... done`. Таймаут 600 с убьёт процесс и выведет 200 строк лога.
- **Если виснет SSG** — `=== STEP 4: ...` идёт, но не завершается; в build.log будет видно последнюю отрендеренную страницу.
- **Если виснет на копировании в nginx-слой** — STEP 5 завершён, STEP 6 не начинается → проблема в самом docker daemon/диске раннера.
- **Если виснет на push** — все STEP'ы builder'а закрылись, висит `docker push` → проблема сети до Docker Hub.

В каждом сценарии у нас будет конкретная точка отказа и тайминг, а не «висит 12 часов».

## Файлы

- `Dockerfile` — переписать с пронумерованными STEP'ами, таймстампами и `timeout 600` на vite build.
- `.github/workflows/docker-build.yml` — добавить шаги `Pre-build diagnostics`, `Post-build diagnostics`, обернуть `docker build` в `ts` + `progress=plain`.

Никакой логики SSG, маршрутов, фронтенда не трогаю.
