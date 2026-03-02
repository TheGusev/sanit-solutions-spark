

## SSG/SSR: полный фикс для генерации критичных SEO-страниц в Docker image

### Что будет сделано (4 изменения)

**A. Выделить SSR-полифилы в отдельный модуль**

Создать `src/ssr/polyfills.ts` — перенести туда все полифилы из `entry-server.tsx` (window, document, localStorage, sessionStorage, matchMedia, IntersectionObserver, ResizeObserver, MutationObserver).

В `entry-server.tsx` — убрать инлайн-полифилы (строки 1-92), заменить на один импорт:
```
import './ssr/polyfills';  // ПЕРВЫЙ импорт — до всего остального
```

Это решает корневую проблему: сейчас ESM сначала выполняет import-ы (строки 94-97), а потом тело модуля с полифилами. Если любой из этих импортов трогает `localStorage` при инициализации (например, Supabase SDK через `AppSSR` → `client.ts`), он падает раньше полифилов. Вынос в отдельный модуль-импорт гарантирует порядок.

**B. Добавить фазовые логи и полные стектрейсы в SSG-плагин**

В `vite-plugin-ssg.ts` добавить логирование ключевых фаз:
- `📂 SSG Phase: Template read` (после чтения template)
- `📦 SSG Phase: SSR bundle build` (уже есть)
- `📥 SSG Phase: SSR bundle import` (перед/после import)
- `🔄 SSG Phase: Route rendering loop` (перед циклом)

В блоке catch для render(route.path) — логировать полный стектрейс:
```
console.error(`❌ ${route.path}:`, error instanceof Error ? error.stack : error);
```

**C. Политика fail-fast (без изменений)**

Текущая логика уже корректна:
- `isDockerCI = !!process.env.GITHUB_ACTIONS || !!process.env.DOCKER_BUILD` — throw только в CI/Docker
- Критичные файлы: `rajony/arbat`, `uslugi/dezinsekciya/klopy`, `uslugi/dezinsekciya/blohi`
- `successCount === 0` — hard fail в CI
- В preview — warning only

**D. Smoke-тест в GitHub Actions**

В `.github/workflows/docker-build.yml` после шага `build-and-push` добавить шаг:
```yaml
- name: Smoke check critical SSG files
  run: |
    docker pull ${{ env.IMAGE_NAME }}:${{ github.sha }}
    docker run --rm ${{ env.IMAGE_NAME }}:${{ github.sha }} \
      ls /usr/share/nginx/html/uslugi/dezinsekciya/klopy/index.html \
         /usr/share/nginx/html/uslugi/dezinsekciya/blohi/index.html \
         /usr/share/nginx/html/rajony/arbat/index.html
```
Если файлов нет — job падает, не давая сломанному образу остаться в `latest`.

### Технические детали

Файлы, которые будут затронуты:
1. **Новый файл:** `src/ssr/polyfills.ts` — полифилы из entry-server.tsx
2. **`src/entry-server.tsx`** — удалить inline-полифилы, добавить `import './ssr/polyfills'` первой строкой
3. **`vite-plugin-ssg.ts`** — добавить фазовые логи и полный стектрейс в catch
4. **`.github/workflows/docker-build.yml`** — добавить smoke-check шаг

### Acceptance criteria

- `npm run build` проходит в Docker без exit code 1
- GitHub Actions зелёный, включая smoke-check
- В `latest` образе существуют: `klopy/index.html`, `blohi/index.html`, `arbat/index.html`
- `curl -I` по этим URL на сервере возвращает 200

