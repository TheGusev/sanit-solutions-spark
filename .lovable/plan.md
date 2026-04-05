

# Fix: SSG plugin crash — Vite `closeBundle` проглатывает ошибки

## Корневая причина

**Vite 5 не пробрасывает ошибки из `closeBundle` hook.** Это значит:

1. SSG plugin запускается в `closeBundle()`
2. Что-то падает (SSR bundle build, `getAllSSGRoutes()`, или рендер страниц)
3. Код бросает `throw new Error(...)` 
4. **Vite перехватывает ошибку и продолжает** — `npm run build` завершается с exit code 0
5. В `dist/` остаются только файлы из `public/` (107 штук)
6. Dockerfile gate ловит `107 < 500` и падает — но уже не понятно ПОЧЕМУ

Это подтверждается тем, что `npm run build` "проходит без ошибок" — ошибка есть, но Vite её съедает.

### Дополнительная проблема: regex в `replaceHeadTags`

Строка 128 `vite-plugin-ssg.ts`:
```javascript
html = html.replace(/<title>.*?<\/title>/, helmet.title);
```
`react-helmet-async` генерирует `<title data-rh="true">...`, а regex ожидает `<title>` без атрибутов. Замена **молча не срабатывает** → title не обновляется.

## Изменения

### Файл 1: `vite-plugin-ssg.ts`

**1. Заменить `throw` на `process.exit(1)` в CI-путях** (строки 489-494, 496-503):

Вместо:
```typescript
throw new Error('SSG generated 0 pages...');
```
Делаем:
```typescript
console.error('FATAL: SSG generated 0 pages...');
process.exit(1);
```

Это **гарантирует** что build упадёт, независимо от того как Vite обрабатывает ошибки в `closeBundle`.

Применить ко всем трём точкам выхода:
- `successCount === 0` (строка 489)
- `errorCount > 0` (строка 492)  
- Внешний `catch` (строка 496-502)

**2. Добавить пошаговое логирование** — чтобы в CI-логе было видно на каком именно этапе упало:

```
[SSG:1/5] Reading template...
[SSG:2/5] Building SSR bundle...
[SSG:3/5] Loading SSR module...
[SSG:4/5] Getting routes... (got N routes)
[SSG:5/5] Rendering N pages...
```

**3. Исправить regex замены title** (строка 128):

```typescript
// БЫЛО:
html = html.replace(/<title>.*?<\/title>/, helmet.title);
// СТАЛО:
html = html.replace(/<title[^>]*>.*?<\/title>/i, helmet.title);
```

Аналогично `extractTitle` который уже исправлен на строке 26.

**4. Вокруг SSR build добавить детальный catch** (строка 212):

```typescript
try {
  await build({...});
  console.log('[SSG:2/5] ✓ SSR bundle built');
} catch (buildError) {
  console.error('FATAL: SSR bundle build failed:', buildError);
  if (isCI) process.exit(1);
}
```

### Файл 2: Без изменений

Остальные файлы (`seoRoutes.ts`, `Dockerfile`, `entry-server.tsx`) не требуют правок — архитектура маршрутов корректна, проблема только в том что Vite проглатывает ошибки.

## Результат

- `process.exit(1)` гарантирует провал сборки при любой ошибке SSG
- Пошаговые логи показывают ТОЧНО где упало
- Title replacement работает с `data-rh` атрибутами от helmet
- Если проблема в `validateAllRoutes` — мы увидим конкретную ошибку в логе
- Если проблема в SSR bundle build — тоже увидим

