

# Синхронизация sitemap с реальными маршрутами сайта

## Проблема

На скриншоте видно: Яндекс Вебмастер показывает 319 страниц (-2%), 113 (-1%) — индексация замерла и падает. Причина: **sitemap генерирует неполный набор URL**.

### Что отсутствует в `vite-plugin-sitemap.ts`:

| Категория | Есть в seoRoutes.ts / SSG | Есть в sitemap | Потеряно |
|-----------|--------------------------|----------------|----------|
| Кроты МО (23 города) | да | **нет** | 23 URL |
| Округа dezinsekciya + deratizaciya | да (36 = 3×12) | **только dezinfekciya** (12) | 24 URL |
| borshchevik-zakon-shtraf-2026 | да | **нет** | 1 URL |
| LLM-unique articles (12) | в seoRoutes | **частично** | ~1 URL |
| safety/diy/b2b articles | в seoRoutes | **есть** | 0 |

**Итого**: sitemap не показывает Яндексу ~48 страниц. Плюс блог-слуги хардкодные и рассинхронизированы.

## План исправления

### Файл: `vite-plugin-sitemap.ts`

**1. Добавить секцию sitemap-mole.xml** — 23 URL гео-лендингов кротов:
```
/uslugi/borba-s-krotami/istra/
/uslugi/borba-s-krotami/krasnogorsk/
... (все 23 города из moleCities.ts)
```

**2. Исправить московские округа** — сейчас генерируются только `dezinfekciya-{district}`, нужно добавить `dezinsekciya-{district}` и `deratizaciya-{district}` (как в seoRoutes.ts строка 285).

**3. Добавить недостающие blog slugs**:
- `borshchevik-zakon-shtraf-2026` (legal-commercial)

**4. Добавить отдельный sitemap-mole.xml в sitemap-index** для ускорения обхода новых страниц.

### Итого после исправления

| Sitemap файл | URL до | URL после |
|-------------|--------|-----------|
| sitemap-moscow.xml | ~142 | ~166 (+24 округа) |
| sitemap-mole.xml | 0 (не существует) | 23 |
| sitemap-blog.xml | ~206 | ~207 (+1) |
| **Всего прирост** | — | **+48 URL** |

### Детали по файлам

| # | Файл | Правки |
|---|------|--------|
| 1 | `vite-plugin-sitemap.ts` | Добавить массив moleCitySlugs (23 города); исправить округа (3 сервиса × 12 вместо 1 × 12); добавить `borshchevik-zakon-shtraf-2026` в blogSlugs; создать секцию sitemap-mole.xml; добавить в sitemap-index |

## Результат

После деплоя sitemap.xml будет содержать все ~1,800 URL. Яндекс Вебмастер при следующем обходе увидит полный набор страниц. Рекомендация: после деплоя зайти в Яндекс Вебмастер → Переобход → отправить `sitemap.xml` на переобход.

