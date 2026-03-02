

## План: SSG fail-fast для ВСЕХ маршрутов, а не только 3 маячков

### Проблема

Сейчас fail-fast проверяет только 3 hardcoded файла. Если из ~1000 маршрутов 500 молча упали — билд всё равно зелёный. Нужна полная валидация.

### Что будет сделано (2 файла)

**1. `vite-plugin-ssg.ts` — полная валидация всех маршрутов**

В блоке после рендеринга (строки 860-883) заменить логику на:

- Собирать `failedRoutes[]` во время цикла рендеринга (path + причина ошибки) — уже частично есть через `errorCount`, нужно накапливать список
- После цикла: если `failedRoutes.length > 0` в Docker CI → вывести полный список проваленных маршрутов и `throw`
- Оставить 3 маячка как дополнительную проверку файлов на диске (belt-and-suspenders), но основная логика — `failedRoutes.length === 0`
- Добавить итоговый лог: `SSG: ${successCount}/${totalRoutes} pages OK, ${failedRoutes.length} failed`

Конкретно:
```
// Накапливать при рендере каждого маршрута:
failedRoutes.push({ path: route.path, error: error.message });

// После цикла:
if (isDockerCI && failedRoutes.length > 0) {
  const msg = `SSG FAILED: ${failedRoutes.length}/${routes.length} routes failed:\n` +
    failedRoutes.map(r => `  ✗ ${r.path}: ${r.error}`).join('\n');
  throw new Error(msg);
}
```

**2. `.github/workflows/docker-build.yml` — расширенный smoke-check**

Заменить проверку 3 файлов на скрипт, который проверяет выборку из всех категорий:

```yaml
- name: Smoke check SSG coverage
  run: |
    docker pull ${{ env.IMAGE_NAME }}:${{ github.sha }}
    docker run --rm ${{ env.IMAGE_NAME }}:${{ github.sha }} sh -c '
      FAIL=0
      for f in \
        uslugi/dezinsekciya/klopy/index.html \
        uslugi/dezinsekciya/blohi/index.html \
        rajony/arbat/index.html \
        uslugi/deratizaciya/krysy/index.html \
        uslugi/dezinfekciya/arbat/index.html \
        moscow-oblast/khimki/index.html \
        blog/klopy-v-kvartire/index.html \
        uslugi/dezinsekciya/klopov-v-kvartire/index.html \
        sluzhba-dezinsekcii/index.html \
        rajony/maryino/index.html; do
        if [ ! -f "/usr/share/nginx/html/$f" ]; then
          echo "MISSING: $f"; FAIL=1
        fi
      done
      if [ $FAIL -eq 1 ]; then exit 1; fi
      echo "All smoke-check files present"
      TOTAL=$(find /usr/share/nginx/html -name "index.html" | wc -l)
      echo "Total SSG pages in image: $TOTAL"
    '
```

Это покрывает: услуги, вредители, районы, МО, блог, подстраницы, статику.

### Что НЕ меняется

- Список маршрутов в `getAllRoutes()` — уже полный
- Логика рендеринга — без изменений
- Полифилы — уже вынесены в `src/ssr/polyfills.ts`

### Результат

- Любой упавший маршрут в CI → красный билд с полным списком ошибок
- Smoke-check в CI проверяет 10 файлов из разных категорий + считает total
- В preview — по-прежнему только warnings

