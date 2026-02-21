
# Полный SEO-аудит сайта goruslugimsk.ru

## 1. Эволюция структуры: от 4300+ до ~550 страниц

### Что было (4300+ страниц)
- Массовая генерация doorway-страниц: каждая услуга x каждый из 130 районов = ~520 страниц на услугу
- Тонкий контент (thin content) на большинстве гео-страниц
- Каннибализация запросов между doorway-страницами
- Риск санкций Google/Yandex за doorway pattern

### Что стало (~550 страниц)
Структура сжата в 8 раз с сохранением полного покрытия семантики:

| Тип страниц | Количество | Приоритет sitemap |
|---|---|---|
| Главная + статика | 7 | 0.7-1.0 |
| Услуги (7 штук вкл. борьба с кротами) | 7 | 0.9 |
| SEO-подстраницы услуг | 6 | 0.85 |
| Услуга + Вредитель | 8 | 0.85 |
| Услуга + Объект | 24-30 | 0.8 |
| НЧ-страницы (услуга+вредитель+район) | 105-120 | 0.7 |
| Округа Москвы | 12 | 0.85 |
| Районы Москвы | 130 | 0.75 |
| Московская область (города + услуги) | 45 | 0.75-0.8 |
| Блог | 164-181 | 0.6 |
| **Итого** | **~550** | |

### Что было удалено и почему
- 520 doorway-страниц "услуга x район" -- заменены на 105 точечных НЧ-страниц для топ-15 районов
- Редиректы 410 Gone для legacy WP-путей
- nginx настроен на hard 404 для отсутствующих файлов (не soft-404)

---

## 2. Найденные проблемы (критические)

### ПРОБЛЕМА 1: `borba-s-krotami` отсутствует в sitemap
- **Где есть:** seoRoutes.ts (servicesSlugs), services.ts, Header, Footer, MiniPricing
- **Где нет:** vite-plugin-sitemap.ts (servicesSlugs содержит только 6 услуг, без борьба-с-кротами)
- **Влияние:** Страница `/uslugi/borba-s-krotami/` не попадает в sitemap, Yandex/Google могут не индексировать

### ПРОБЛЕМА 2: `kroty` отсутствует в sitemap НЧ-страниц
- **Где есть:** seoRoutes.ts (deratizaciyaPestSlugs включает kroty), semanticCore, pests.ts
- **Где нет:** vite-plugin-sitemap.ts (deratizaciyaPestSlugs = только ['krysy', 'myshi'])
- **Влияние:** 15 НЧ-страниц `/uslugi/deratizaciya/kroty/{район}` не в sitemap

### ПРОБЛЕМА 3: `dolgoprudny` в seoRoutes, но нет данных в moscowRegion.ts
- **seoRoutes.ts:** moscowRegionCitySlugs включает 'dolgoprudny'
- **moscowRegion.ts:** Содержит 'shchyolkovo', но НЕ 'dolgoprudny'
- **Влияние:** Страницы `/moscow-oblast/dolgoprudny/` и `/moscow-oblast/dolgoprudny/{service}` дадут 404 или пустой контент. Одновременно `shchyolkovo` существует в данных, но НЕ в seoRoutes -- значит страницы shchyolkovo не в sitemap

### ПРОБЛЕМА 4: Рассинхронизация `servicesForObjects`
- **seoRoutes.ts:** 5 услуг (включает demerkurizaciya) = 30 страниц
- **vite-plugin-sitemap.ts:** 4 услуги (БЕЗ demerkurizaciya) = 24 страницы
- **Влияние:** 6 страниц демеркуризации объектов не в sitemap

### ПРОБЛЕМА 5: Рассинхронизация блоговых slug'ов
- **seoRoutes.ts blogArticleSlugs:** ~181 slug (формат из allBlogArticles)
- **vite-plugin-sitemap.ts blogSlugs:** ~164 slug (другие названия!)
- Примеры расхождений: seoRoutes имеет `kak-izbavitsya-ot-tarakany`, sitemap имеет `kak-izbavitsya-ot-tarakanov`
- **Влияние:** Десятки статей могут быть только в одном из двух списков

### ПРОБЛЕМА 6: Несколько slug'ов `khoroshevsky` vs `khoroshyovo-mnyovniki`
- В seoRoutes.ts neighborhoodSlugs: `khoroshevsky` (в САО) и в СЗАО отсутствует корректный slug
- В vite-plugin-sitemap: `khoroshyovo-mnyovniki` (в СЗАО)
- Потенциальный конфликт с данными neighborhoods.ts

---

## 3. Семантическое ядро: анализ покрытия

### Статистика семантического ядра
| Кластер | Записей | Покрытие |
|---|---|---|
| service | 6 | Все 6 основных услуг (без борьба-с-кротами!) |
| pest | 14 | 8 вредителей + доп. вариации кротов |
| object | 30 | 5 услуг x 6 объектов |
| district | 12 | Все 12 округов |
| nch | 120 | 8 вредителей x 15 топ-районов |
| blog | 38 | 20 основных + 18 гео-кротов |
| **Итого** | **~220** | |

### Покрытие топ-100 запросов
Семантическое ядро покрывает основные коммерческие запросы:
- "дезинсекция москва", "дератизация москва" -- priority 1, commercial
- "уничтожение тараканов москва", "уничтожение клопов москва" -- priority 1
- "уничтожение крыс москва", "уничтожение мышей москва" -- priority 1-2
- Гео-вариации: "уничтожение тараканов арбат", "дезинсекция хамовники" -- priority 3-4

### Где ядро НЕ покрывает
- `борьба с кротами москва` -- нет записи для `/uslugi/borba-s-krotami/`
- Запросы по МО-городам (нет в семантике)
- Объектные запросы для демеркуризации (есть в ядре, нет в sitemap)

---

## 4. Перелинковка: оценка

### InternalLinks.tsx -- корректная логика
- Связывает вредителей одной услуги (3-4 ссылки)
- Соседние районы из топ-15 (3-4 ссылки)
- Главные страницы услуг (2 ссылки)
- Города МО (1-2 ссылки)
- Максимум 12 ссылок на страницу

### Навигация (Header/Footer)
- Header: все 7 услуг + контакты + блог
- Footer: основные услуги + контакты

### Проблема перелинковки
- Соседние районы выбираются по индексу в массиве, а не по географической близости
- НЧ-страницы ссылаются только на топ-15 районов -- нет связи с остальными 115

---

## 5. Роутинг: проверка

### Архитектура роутинга (App.tsx)
```
/                          -> Index
/blog                      -> Blog
/blog/:slug                -> BlogPost
/uslugi/po-okrugam-moskvy  -> DistrictsOverview
/rajony                    -> NeighborhoodsOverview
/rajony/:slug              -> NeighborhoodPage
/moscow-oblast             -> MoscowRegionOverview
/moscow-oblast/:citySlug   -> MoscowRegionCityPage
/moscow-oblast/:city/:svc  -> MoscowRegionServicePage
/uslugi/:svc/:s2/:s3       -> ThreeSegmentRouteResolver (НЧ или объект+район)
/uslugi/:parent/:sub       -> ServiceRouteResolver (подстраницы/вредители/объекты/районы)
/uslugi/:slug              -> ServicePage (услуги + округа dezinfekciya-*)
```

### Роутинг: корректен
- ThreeSegmentRouteResolver правильно определяет pest vs object по segment2
- ServiceRouteResolver последовательно проверяет subpage -> pest -> object -> neighborhood
- ServicePage обрабатывает как услуги, так и округа (dezinfekciya-cao)
- 404 fallback для всех неизвестных маршрутов

---

## 6. Технический стек

| Компонент | Технология | Статус |
|---|---|---|
| Frontend | React 19 + Vite + TypeScript | OK |
| CSS | Tailwind CSS + shadcn/ui | OK |
| SEO | react-helmet-async + SSG prerender | OK |
| Sitemap | 8 файлов + sitemap-index.xml | Рассинхрон! |
| Schema.org | JSON-LD (LocalBusiness, FAQ, Breadcrumb, Article) | OK |
| Backend | Lovable Cloud (Supabase) | OK |
| Edge Functions | 13 функций (leads, analytics, MVT, reviews) | OK |
| A/B Testing | Thompson Sampling MVT | OK |
| nginx | Hard 404, 410 legacy, immutable cache | OK |
| robots.txt | Yandex/Google allow, block SEO bots | OK |

---

## 7. Что нужно исправить (план)

### Критические (блокируют индексацию)

1. **Синхронизировать vite-plugin-sitemap.ts с seoRoutes.ts:**
   - Добавить `borba-s-krotami` в servicesSlugs
   - Добавить `kroty` в deratizaciyaPestSlugs
   - Добавить `demerkurizaciya` в servicesForObjects (или удалить из seoRoutes если не нужно)
   - Заменить `dolgoprudny` на `shchyolkovo` в moscowRegionCitySlugs (или добавить dolgoprudny в moscowRegion.ts)

2. **Синхронизировать блоговые slug'и** между seoRoutes.ts и vite-plugin-sitemap.ts -- привести к единому формату

3. **Добавить `борьба с кротами москва`** в семантическое ядро (semanticCore.ts)

### Средние (влияют на качество SEO)

4. **Перелинковка по географии** -- заменить выбор соседних районов по индексу на выбор по districtId
5. **Добавить МО-города в семантическое ядро** -- 9 городов x 4 услуги = 36 записей

### Желательные (улучшение)

6. **WebP-конверсия** всех PNG-изображений (экономия 60-80% трафика)
7. **Добавить sitemap-mole-blog.xml** как отдельный файл для гео-кротовых статей
8. **Расширить НЧ до всех 8 вредителей** (сейчас kroty НЧ не в sitemap)

---

## 8. Итоговое заключение

### Сильные стороны
- Грамотная SEO-архитектура: семантическое ядро предотвращает каннибализацию
- Правильный переход от doorway к точечным НЧ-страницам
- Качественный JSON-LD (LocalBusiness, FAQ, BreadcrumbList)
- Корректный роутинг с валидацией данных
- nginx настроен на hard 404 (не soft-404)
- robots.txt блокирует SEO-ботов, пропускает поисковики

### Критические проблемы
- **Рассинхронизация sitemap с seoRoutes** -- минимум 22 страницы не попадают в sitemap (1 услуга + 15 НЧ кротов + 6 объектов демеркуризации)
- **dolgoprudny 404** -- город в sitemap/seoRoutes без данных в moscowRegion.ts
- **Блоговые slug'и** -- ~17 статей могут иметь разные URL в seoRoutes vs sitemap

### Оценка
- **Структура:** 8/10 (отличная после сжатия, нужна синхронизация)
- **SEO on-page:** 8/10 (title, description, canonical, schema -- все на месте)
- **Техническое SEO:** 6/10 (sitemap рассинхрон, потенциальные 404)
- **Перелинковка:** 7/10 (логика верная, но не учитывает географию)
- **Контент:** 8/10 (уникальный для каждой комбинации, 650-800 слов на НЧ)
- **Общая оценка: 7.4/10** -- после исправления критических проблем поднимется до 9/10
