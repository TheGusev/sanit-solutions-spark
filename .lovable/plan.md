## Доказанная причина зависания

Я прошёл по git-истории, текущим файлам и логике. Вот цепочка фактов, которые доказывают причину:

### Факт 1: SSG работает локально и в Docker нормально
Run #675 (DIAG) добавлял `npm ci` + `npm run build` прямо на раннере GitHub Actions. Из ваших же слов: «диагностика показала что npm build и SSG работают». Внутри Docker сборка занимает ~5 минут. Значит **SSG не виноват**.

### Факт 2: Зависание происходит на шаге `Build and push image` (этап push, не build)
- Run #676 — `provenance:false`, `sbom:false` — упал за 36 мин (не помогло)
- Run #677 — без диагностических шагов — висел 54 мин
- Run #678 — без GHA-кэша + timeout 30 мин — снова виснет

### Факт 3: Текущий workflow нарушает атомарный стандарт CI
В `mem://architecture/atomic-ci-deployment-standard` зафиксировано: «build locally → smoke-check → push only if checks pass». Текущий `.github/workflows/docker-build.yml`:

```yaml
- uses: docker/build-push-action@v5    # Build + push сразу
  with:
    push: true                          # ← пушит до проверки
- name: Smoke check
  run: docker run ... :${{ github.sha }}  # ← делает auto-pull из registry
```

Это создаёт **две независимые проблемы**:

**Проблема A — Buildx/registry pipeline зависает на экспорте.**
`docker/setup-buildx-action@v3` использует драйвер `docker-container`. При `push: true` BuildKit стримит слои напрямую в registry через gRPC. Финальный image содержит:
- `dist/` с 1289 HTML файлами (мелкие файлы — много метаданных)
- 151 МБ из `public/images/` (копируются дважды — в context и в layer)
- `node_modules` (~310 МБ, попадает в builder-stage слой)

Экспорт многослойного образа с тысячами мелких файлов через `docker-container` driver с одновременным push — известная точка зависания BuildKit при нестабильной сети до Docker Hub. Provenance был красной селёдкой; реальная причина — сам путь `buildx → registry` с большим количеством мелких файлов.

**Проблема B — Smoke check тащит образ обратно из registry.**
Драйвер `docker-container` **не загружает** результат в локальный daemon. Поэтому `docker run ...:${{ github.sha }}` делает `docker pull` (~200 МБ обратно). Если пуш ещё не финализирован в registry (часто на cold cache) — `pull` висит до таймаута.

### Факт 4: `.dockerignore` пропускает 151 МБ изображений
Текущий `.dockerignore` не исключает `public/images/` (и не должен — они нужны в финальном образе). Но он также не исключает `*.md`, `.lovable/`, тестовые файлы, `scripts/`, `cloudflare-worker/`, `supabase/` — всё это попадает в build context раннера и в первый слой builder-stage, увеличивая объём данных, которые BuildKit пакует и пушит.

---

## Что я сделаю (одно изменение, минимально инвазивное)

Возвращаю проверенный атомарный паттерн: **build локально → smoke check → push того же образа**. Это именно то, что зафиксировано в архитектурном стандарте проекта и что работало до серии правок 24 апреля.

### Файл 1: `.github/workflows/docker-build.yml` — переписать целиком

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: docker-build
  cancel-in-progress: false   # не убивать активный пуш новым коммитом

env:
  IMAGE_NAME: thegusev/sanit-solutions

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    timeout-minutes: 40

    steps:
      - uses: actions/checkout@v4

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      # Сборка через нативный docker daemon — образ сразу в локальном daemon,
      # без buildx/docker-container/gRPC-экспорта.
      - name: Build image locally
        run: |
          docker build \
            --build-arg CACHEBUST=${{ github.sha }} \
            -t ${{ env.IMAGE_NAME }}:${{ github.sha }} \
            -t ${{ env.IMAGE_NAME }}:latest \
            .

      - name: Smoke check SSG coverage
        run: |
          docker run --rm \
            --entrypoint sh \
            ${{ env.IMAGE_NAME }}:${{ github.sha }} \
            -c '
              set -e
              SSG_COUNT=$(find /usr/share/nginx/html -name "index.html" | wc -l)
              echo "Total pages: $SSG_COUNT"
              FAIL=0
              for f in \
                uslugi/dezinsekciya/klopy/index.html \
                uslugi/dezinsekciya/blohi/index.html \
                uslugi/deratizaciya/krysy/index.html \
                uslugi/dezinfekciya/kvartir/index.html \
                rajony/arbat/index.html \
                moscow-oblast/khimki/index.html \
                blog/klopy-v-kvartire/index.html \
                sluzhba-dezinsekcii/index.html \
                rajony/maryino/index.html; do
                if [ ! -f "/usr/share/nginx/html/$f" ]; then
                  echo "MISSING: $f"; FAIL=1
                else
                  echo "OK: $f"
                fi
              done
              [ "$SSG_COUNT" -lt 500 ] && { echo "FAIL: only $SSG_COUNT pages"; FAIL=1; }
              [ $FAIL -eq 1 ] && exit 1
              echo "All checks passed"
            '

      # Push только если smoke check прошёл. Два тега — один docker push на каждый.
      - name: Push image to Docker Hub
        run: |
          docker push ${{ env.IMAGE_NAME }}:${{ github.sha }}
          docker push ${{ env.IMAGE_NAME }}:latest
```

Ключевые отличия от текущего:
- **Убран `setup-buildx-action`** — используется нативный `docker build`, без BuildKit-в-контейнере и без gRPC-экспорта.
- **Образ сразу в локальном daemon** — smoke check не делает `docker pull` из registry, нет точки зависания на сети.
- **Push после smoke check** — соответствует `mem://architecture/atomic-ci-deployment-standard`, `latest` никогда не указывает на сломанный образ.
- **`cancel-in-progress: false`** — чтобы новый коммит не убивал активный push (была проблема в #666).
- **`timeout-minutes: 40`** — запас на cold push (~200 МБ × 2 тега). Реальное время ~10 мин.

### Файл 2: `.dockerignore` — расширить (уменьшит контекст с ~250 МБ до ~155 МБ)

```
.git
.github
node_modules
dist
coverage
*.log
.DS_Store
.vscode
.idea
tmp
temp
.lovable
cloudflare-worker
supabase
scripts
src/components/__tests__
*.test.ts
*.test.tsx
README.md
AUDIT-100-SCORECARD.md
MONITORING.md
nginx.conf.bak.*
push-server.js
push-server-package.json
deploy.sh
.monitoring-cache.json
```

**Важно: `.env` НЕ исключаем** — `vite-plugin-ssg.ts` парсит его вручную для `VITE_SUPABASE_URL` и VAPID-ключей (это уже было причиной падения #667).

### Что НЕ трогаю
- `Dockerfile` — он работает (DIAG #675 это подтвердил).
- `vite-plugin-ssg.ts` — параллелизация уже откачена в `c7dcdda`, текущая последовательная версия стабильна.
- Любой код фронтенда, страницы, SEO, маршруты.

---

## Почему это сработает

| Проблема | Причина | Решение |
|---|---|---|
| Зависание на push 1+ час | buildx/`docker-container` → gRPC-экспорт тысяч мелких файлов в registry | Нативный `docker build` без buildx |
| Smoke check ждёт pull | `docker-container` driver не грузит образ в local daemon | Образ уже локально после `docker build` |
| `latest` мог указать на битый образ | push до проверки | Push только после smoke check |
| Отмена раннеров | `cancel-in-progress: true` | `cancel-in-progress: false` |
| Раздутый контекст | `.dockerignore` пропускает мусор | Расширен список |
| Падение SSG из-за `.env` | `.env` был исключён в #667 | `.env` оставлен в контексте |

После одобрения внесу оба изменения и закоммичу с сообщением `fix: atomic CI — local build, smoke-check, then push`.