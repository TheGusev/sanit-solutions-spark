

# Исправление 2 расхождений SSG ↔ Sitemap

## Изменения

| # | Файл | Действие |
|---|------|----------|
| 1 | `vite-plugin-sitemap.ts`, строка 110 | Убрать `'kroty'` из `tier2PestsList` (кроты — услуга МО, не городские районы) |
| 2 | `vite-plugin-ssg.ts`, строка 257 | Добавить `'borshchevik-zakon-shtraf-2026'` в конец `blogSlugs` |

### Детали

**1. Sitemap — убрать kroty:**
```
// Было:
const tier2PestsList = ['muravyi', 'blohi', 'mol', 'kroty'];
// Станет:
const tier2PestsList = ['muravyi', 'blohi', 'mol'];
```
Это уберёт ~40 фантомных URL (kroty × 40 районов) из sitemap, которые не имеют SSG-страниц.

**2. SSG — добавить статью:**
После строки 257 (`'dezinfekciya-ofisa-bez-pomeh'`) добавить:
```
'borshchevik-zakon-shtraf-2026',
```

### Результат
SSG и Sitemap будут полностью синхронизированы: ~1,249 URL в обоих.

