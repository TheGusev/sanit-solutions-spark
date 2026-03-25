

# Полный SEO-аудит сайта goruslugimsk.ru — Заключение

## Оценка: 82 / 100

---

## ✅ Что работает отлично (базовые системы)

| Компонент | Статус | Комментарий |
|-----------|--------|-------------|
| Routing App.tsx ↔ AppSSR.tsx | ✅ Синхронизированы | Все роуты зеркалированы |
| Anti-cannibalization validator | ✅ Работает | Forbidden patterns блокируют Object+Geo, Pest@service |
| Trailing slash policy | ✅ Консистентно | nginx + canonicals + internal links |
| Tiered NCH model | ✅ 3 тира | ~774 NCH-страниц, правильная развесовка приоритетов |
| Blog deOptimization | ✅ Работает | Блог не каннибализирует коммерческие |
| 12 Яндекс-целей | ✅ Чисто | Все старые цели удалены |
| Geo scope separation | ✅ /uslugi/ vs /rajony/ | Нет пересечений |
| InternalLinks component | ✅ Расширен | 16 ссылок, blog/hub/moleCity типы |

---

## 🔴 Критические баги (5 штук, -18 баллов)

### БАГ 1: 4 новых города кротов не в SSG (-5)

**Проблема**: `moleCitySlugs` в `seoRoutes.ts` (строка 143) — **хардкодный массив** из 19 городов. Но `moleCities.ts` экспортирует свой `moleCitySlugs` через `moleCities.map(c => c.slug)` с 23 записями. SSG использует хардкод из `seoRoutes.ts`.

**Результат**: Страницы `/uslugi/borba-s-krotami/taldom/`, `/dubna-mo/`, `/ruza/`, `/voskresensk-mo/` НЕ будут сгенерированы при сборке → 404 на проде.

**Исправление**: В `seoRoutes.ts` строка 143 — заменить хардкод на импорт:
```ts
import { moleCitySlugs } from '@/data/moleCities';
```
Или добавить 4 slug вручную: `'taldom', 'dubna-mo', 'ruza', 'voskresensk-mo'`.

### БАГ 2: Статья borshchevik-zakon-shtraf-2026 не в SSG (-3)

**Проблема**: Статья добавлена в `llm/legal-commercial.ts` и рендерится через `/blog/:slug`, но её slug **отсутствует** в массиве `blogArticleSlugs` в `seoRoutes.ts`. Значит HTML не будет сгенерирован → 404 на проде (или SPA fallback без SEO).

**Исправление**: Добавить `'borshchevik-zakon-shtraf-2026'` в `blogArticleSlugs` (после строки 366 в seoRoutes.ts).

### БАГ 3: Битая ссылка в InternalLinks — kroty-na-uchastke-kak-izbavitsya (-3)

**Проблема**: `InternalLinks.tsx` строка 91 ссылается на `/blog/kroty-na-uchastke-kak-izbavitsya` — **такого slug нет** ни в одном массиве статей. Это 404 ссылка, которая рендерится на всех страницах borba-s-krotami.

**Исправление**: Заменить на существующий slug, например `'kroty-istra'` или `'kroty-novorizhskoe-shosse'`.

### БАГ 4: Сертификация — orphan page (-4)

**Проблема**: `/uslugi/sertifikaciya/` существует как статический HTML в `public/`, но:
- НЕТ в `servicesSlugs` → не генерируется SSG
- НЕТ в `services.ts` → ServicePage рендерит NotFound
- Есть в analytics PATHNAME_SLUG_MAP
- 10+ блог-статей ссылаются на неё

**Результат**: Страница работает только из статического HTML. При первой SPA-навигации → NotFound. Нет React-рендера, нет квиза, нет перелинковки.

**Исправление**: Либо добавить `sertifikaciya` в `services.ts` как полноценную услугу, либо удалить все ссылки на неё из блога.

### БАГ 5: blogArticleSlugs рассинхронизирован с allBlogArticles (-3)

**Проблема**: `blogArticleSlugs` в `seoRoutes.ts` — хардкодный массив ~206 slug'ов. Но `allBlogArticles` собирается динамически из 10+ файлов данных. Каждая новая статья требует ручного добавления в ОБА места. Текущий рассинхрон: минимум `borshchevik-zakon-shtraf-2026` отсутствует, вероятно есть и другие.

**Исправление**: Заменить хардкод на динамический импорт:
```ts
import { allBlogArticles } from '@/data/blog';
const blogArticleSlugs = allBlogArticles.map(a => a.slug);
```

---

## 🟡 Предупреждения (не критичные, но стоит исправить)

| # | Проблема | Влияние |
|---|----------|---------|
| 1 | `sertifikaciya` в PATHNAME_SLUG_MAP аналитики, но страница — orphan | Ложные цели |
| 2 | InternalLinks: `window.location.pathname` на SSR = пустая строка | Хабы всегда все 5 рендерятся, без фильтрации |
| 3 | `moleCitySlugs` дублирован: хардкод в seoRoutes.ts + computed в moleCities.ts | Рассинхрон при добавлении городов |
| 4 | Blog на сервисных страницах ссылается на 2-3 фиксированных статьи | Нет ротации, все 200+ страниц дают одни и те же ссылки |
| 5 | `servicesSlugs` не включает `sertifikaciya` и `dezodoraciya` в пул InternalLinks | Нет входящих ссылок с перелинковки |
| 6 | Нет `deratizaciya/myshi` маппинга в PATHNAME_SLUG_MAP | myshi-страницы трекаются как `deratizaciya` вместо `myshi` |

---

## 📊 Развесовка страниц и покрытие запросов

| Кластер | Страниц | Priority | Покрытие |
|---------|---------|----------|----------|
| Коммерческие хабы (8 услуг) | 8 | 0.9 | ✅ Все ВЧ |
| Услуга+Вредитель | 14 | 0.85 | ✅ Все СЧ |
| Услуга+Объект | 56 | 0.8 | ✅ Все СЧ |
| Подстраницы методов | 17 | 0.85 | ✅ |
| НЧ Tier 1 (4 pest × 131 geo) | 524 | 0.7 | ✅ |
| НЧ Tier 2 (3 pest × 40 geo) | 120 | 0.65 | ✅ |
| НЧ Tier 3 (6 pest × 15 geo) | 90 | 0.6 | ✅ |
| Округа (3 service × 12) | 36 | 0.85 | ✅ |
| Районы | 131 | 0.75 | ✅ |
| МО города | 14 + 56 | 0.8/0.75 | ✅ |
| Кроты МО | 19 (нужно 23) | 0.8 | ⚠️ -4 |
| Блог | ~206 (нужно 207+) | 0.6 | ⚠️ -1+ |
| Сертификация | 1 (orphan) | — | 🔴 Сломан |
| **Итого SSG** | **~1,774** | — | — |

### Каннибализация запросов

| Проверка | Результат |
|----------|-----------|
| Pest@service level | ✅ Заблокировано validator |
| Object+Geo leak | ✅ Заблокировано |
| Blog vs Commercial | ✅ deOptimize + max-snippet:160 |
| Geo /uslugi/ vs /rajony/ | ✅ Разделено |
| Combo-pest (klopov-i-tarakanov) | ✅ Pruned + 301 |
| Doorway detection | ✅ Нет тонких doorway |
| Дубликаты canonical | ✅ Self-referencing |

---

## 📋 План исправлений (5 файлов)

| # | Файл | Что исправить |
|---|------|---------------|
| 1 | `src/lib/seoRoutes.ts` | Импортировать `moleCitySlugs` из `moleCities.ts` вместо хардкода; добавить `borshchevik-zakon-shtraf-2026` в blogArticleSlugs (или заменить хардкод на динамический) |
| 2 | `src/components/InternalLinks.tsx` | Заменить битый slug `kroty-na-uchastke-kak-izbavitsya` на существующий |
| 3 | `src/data/services.ts` | Добавить `sertifikaciya` как полноценную услугу, или... |
| 4 | `src/data/blog/llm/legal-commercial.ts` | ...удалить все ссылки на `/uslugi/sertifikaciya/` и заменить на `/uslugi/dezinfekciya/` |
| 5 | `src/lib/analytics.ts` | Добавить `'/uslugi/deratizaciya/myshi': 'myshi'` в PATHNAME_SLUG_MAP |

