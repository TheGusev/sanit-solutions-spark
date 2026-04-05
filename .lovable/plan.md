

# Fix: SSG генерирует 107 вместо 1,249+ страниц

## Корень проблемы

**`vite-plugin-ssg.ts` строка 570 вызывает локальную `getAllRoutes()` (строка 191) — устаревший хардкод из ~350 строк.** Канонический источник `getAllSSGRoutes()` в `src/lib/seoRoutes.ts` содержит полный актуальный список, но плагин его не использует.

Расхождения между `getAllRoutes()` (плагин) и `getAllSSGRoutes()` (seoRoutes):

| Что отсутствует в плагине | Страниц |
|---|---|
| `/sluzhba-dezinsekcii/`, `/team/`, `/otzyvy/`, `/terms/`, `/uslugi/obrabotka-uchastkov/` | 5 |
| `/uslugi/borba-s-krotami/` + 23 города кротов МО | 24 |
| Блог: 207 статей вместо 50 | +157 |
| Округа: dezinsekciya + deratizaciya (только dezinfekciya есть) | +24 |
| Подстраницы: 17 вместо 6 | +11 |
| Пести: komary, muhi, osy-shershni, cheshuynitsy, kleshchi, mokricy | +6 |
| NCH tiered (734) вместо flat (910 некорректных) | пересчёт |
| Object slugs: 11 вместо 6 | +25 |
| Trailing slashes на path | все пути |

Вторая проблема: **Dockerfile строка 17** использует `;` вместо `&&`, поэтому если `npm run build` падает, Docker всё равно продолжает сборку.

## План изменений

### Файл 1: `src/entry-server.tsx`
Добавить экспорт `getAllSSGRoutes` из seoRoutes:
```typescript
export { getAllSSGRoutes } from './lib/seoRoutes';
```

### Файл 2: `vite-plugin-ssg.ts`
1. **Удалить строки 27-347** — весь блок хардкоженных маршрутов (`staticRoutes`, `servicesSlugs`, `neighborhoodSlugs`, `blogSlugs`, `getAllRoutes()`)
2. **Строка 570**: заменить `getAllRoutes()` на динамический импорт из SSR bundle:
```typescript
const { render, getAllSSGRoutes } = await import(serverEntryPath);
const routes = getAllSSGRoutes();
```
3. Оставить без изменений: `validateHtml`, `replaceHeadTags`, `extractTitle`, `extractDescription`, `countWordsInHtml`, весь `closeBundle` кроме источника маршрутов.

### Файл 3: `Dockerfile`
Заменить строку 17 (сборка) на fail-fast вариант:
```dockerfile
RUN npm run build 2>&1 | tee /tmp/build-output.log && \
    SSG_COUNT=$(find /app/dist -name "index.html" | wc -l) && \
    echo "SSG pages: $SSG_COUNT" && \
    test "$SSG_COUNT" -ge 500 || (echo "FAIL: only $SSG_COUNT pages" && exit 1)
```
Удалить строку 18 (отдельный `find ... | wc -l` — теперь встроен в строку выше).

### Файл 4: `.github/workflows/docker-build.yml`
Добавить в smoke check проверку `blog/klopy-v-kvartire/index.html` (blog route — подтверждает что блог тоже рендерится). Остальные проверки корректны.

## Результат
- Единый источник маршрутов: `seoRoutes.ts` → `entry-server.tsx` → `vite-plugin-ssg.ts`
- ~1,249 страниц генерируются при каждой сборке
- Dockerfile fail-fast при <500 страниц
- Smoke check в CI подтверждает критические категории

