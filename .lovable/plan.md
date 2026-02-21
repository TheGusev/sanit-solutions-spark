
# SEO-аудит goruslugimsk.ru — Статус исправлений

## ✅ Исправлено (все критические проблемы)

### 1. Синхронизация sitemap с seoRoutes
- ✅ `borba-s-krotami` добавлен в servicesSlugs (vite-plugin-sitemap.ts)
- ✅ `kroty` добавлен в deratizaciyaPestSlugs → 15 НЧ-страниц теперь в sitemap
- ✅ `demerkurizaciya` добавлен в servicesForObjects → 6 объектных страниц в sitemap
- ✅ `shchyolkovo` добавлен в moscowRegionCitySlugs (был только в данных, не в sitemap)
- ✅ `dolgoprudny` — добавлены полные данные города в moscowRegion.ts (был в sitemap без данных → 404)
- ✅ `khoroshyovo-mnyovniki` → исправлен на `khoroshevo-mnevniki` (синхрон с neighborhoods.ts)

### 2. Блоговые slug'и
- ✅ Полная синхронизация: blogSlugs в sitemap = blogArticleSlugs в seoRoutes (181 статья)

### 3. Семантическое ядро
- ✅ Добавлен `борьба с кротами москва` → `/uslugi/borba-s-krotami/`
- ✅ Добавлен `уничтожение кротов на участке москва` → `/uslugi/borba-s-krotami/`
- ✅ Добавлены 40 записей МО-городов (10 городов × 4 услуги)

## Итого: страницы в sitemap после исправлений

| Тип | Было | Стало | Δ |
|-----|------|-------|---|
| Услуги | 6 | 7 | +1 (borba-s-krotami) |
| Услуга+Вредитель | 7 | 8 | +1 (kroty) |
| Услуга+Объект | 24 | 30 | +6 (demerkurizaciya) |
| НЧ-страницы | 105 | 120 | +15 (kroty × 15 районов) |
| МО-города | 45 | 50 | +5 (shchyolkovo + услуги) |
| Блог | 164 | 181 | +17 (синхронизация) |
| **Итого** | **~494** | **~539** | **+45 страниц** |

## Оставшиеся задачи (не критические)

- [ ] Перелинковка по географии (выбор соседних районов по districtId)
- [ ] WebP-конверсия PNG-изображений
- [ ] Отдельный sitemap-mole-blog.xml
