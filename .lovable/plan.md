

# ШАГ 1: Исправление SSG/Sitemap + ШАГ 2: IndexNow

## ШАГ 1: Три критических исправления

### 1.1 Округа: добавить dezinsekciya и deratizaciya в SSG

**Проблема:** `vite-plugin-ssg.ts` строки 356-361 генерирует только `dezinfekciya-{okrug}`, а sitemap уже отдаёт все 3 услуги × 12 округов = 36 URL. SSG даёт только 12 → 24 soft-404.

**Файл:** `vite-plugin-ssg.ts`, строки 355-361
**Было:**
```typescript
districtSlugs.forEach(id => {
  routes.push({ path: `/uslugi/dezinfekciya-${id}/`, ... });
});
```
**Станет:**
```typescript
const districtServicePrefixes = ['dezinfekciya', 'dezinsekciya', 'deratizaciya'];
districtServicePrefixes.forEach(prefix => {
  districtSlugs.forEach(id => {
    routes.push({ path: `/uslugi/${prefix}-${id}/`, outputPath: `uslugi/${prefix}-${id}/index.html` });
  });
});
```

### 1.2 Города кротов: добавить 4 недостающих в SSG

**Проблема:** `moleCitySlugs` в sitemap содержит 23 города (включая taldom, dubna-mo, ruza, voskresensk-mo), а в SSG — только 19.

**Файл:** `vite-plugin-ssg.ts`, строки 110-116 — добавить `'taldom', 'dubna-mo', 'ruza', 'voskresensk-mo'` в массив `moleCitySlugs`.

### 1.3 Удалить дубль блога

**Проблема:** `trebovaniya-rospotrebnadzora-2026` встречается дважды: строка 199 (legacy) и строка 235 (legal) в обоих файлах.

**Файл:** `vite-plugin-ssg.ts` — удалить из legal-секции (строка 235)
**Файл:** `vite-plugin-sitemap.ts` — удалить из legal-секции (строка 234)

---

## ШАГ 2: Yandex IndexNow

### 2.1 Ключ IndexNow при сборке

**Файл:** `vite-plugin-sitemap.ts` — в `closeBundle()` добавить генерацию файла `dist/goruslugimsk-2026-indexnow.txt` с содержимым `goruslugimsk-2026-indexnow`.

### 2.2 Скрипт отправки (новый файл)

**Файл:** `scripts/send-indexnow-stateless.mjs`

Логика:
- Парсит все `dist/sitemap-*.xml` файлов, извлекает `<loc>` теги
- `START_DATE = new Date('2026-03-27').getTime()`
- `daysPassed = Math.floor((Date.now() - START_DATE) / 86400000)`
- `LIMIT = 50`
- `startIndex = (daysPassed * LIMIT) % urls.length`
- Срез `urls.slice(startIndex, startIndex + LIMIT)` (с wrap-around через concat)
- POST на `https://yandex.com/indexnow` с JSON body
- Console.log: день, индексы, статус ответа

### 2.3 GitHub Actions Workflow (новый файл)

**Файл:** `.github/workflows/daily-indexnow.yml`

- `schedule: cron '0 3 * * *'` + `workflow_dispatch`
- Steps: checkout → setup node 20 → `npm ci` → `npm run build` → `node scripts/send-indexnow-stateless.mjs`

---

## Сводка файлов

| # | Файл | Действие |
|---|------|----------|
| 1 | `vite-plugin-ssg.ts` | Округа: 3 услуги × 12; добавить 4 города кротов; удалить дубль блога |
| 2 | `vite-plugin-sitemap.ts` | Удалить дубль блога; добавить генерацию IndexNow ключа |
| 3 | `scripts/send-indexnow-stateless.mjs` | Новый: stateless IndexNow скрипт |
| 4 | `.github/workflows/daily-indexnow.yml` | Новый: ежедневный cron workflow |

