

# Комплексный аудит goruslugimsk.ru — отчёт

## Краткий обзор

Сайт представляет собой зрелый SEO-проект с продуманной архитектурой: ~1,800+ SSG-страниц, 3-уровневая NCH-модель, строгие валидаторы маршрутов, fail-fast SSG, de-optimization блога. Недавно добавлены 24 гео-страницы дезинсекции/дератизации по округам, табы в ServiceDistricts, ссылки в Footer и InternalLinks. Общее качество высокое, но есть ряд точечных проблем.

---

## БЛОК 1. КАРТА РОУТОВ

```text
Route                                          Pattern                           DataSource                  Render
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
/                                              Static                            Index.tsx                   CSR (eager)
/blog/                                         Static                            allBlogArticles             CSR (lazy) + SSG
/blog/:slug/                                   Dynamic                           allBlogArticles (227+)      CSR + SSG
/privacy/                                      Static                            -                           CSR + SSG
/terms/                                        Static                            -                           CSR + SSG
/contacts/                                     Static                            -                           CSR + SSG
/team/                                         Static                            -                           CSR + SSG
/sluzhba-dezinsekcii/                          Static                            -                           CSR + SSG
/otzyvy/                                       Static                            -                           CSR + SSG
/uslugi/po-okrugam-moskvy/                     Static                            districtPages               CSR + SSG
/uslugi/obrabotka-uchastkov/                   Static                            -                           CSR + SSG
/uslugi/:slug/                                 Dynamic (ServicePage)             servicePages + districtMatch CSR + SSG
  → dezinfekciya, dezinsekciya, deratizaciya, ozonirovanie, dezodoraciya, demerkurizaciya, borba-s-krotami
  → dezinfekciya-{cao..zelao}, dezinsekciya-{id}, deratizaciya-{id}  (36 district pages)
/uslugi/:parentSlug/:subSlug/                  Dynamic (ServiceRouteResolver)    subpages/pests/objects       CSR + SSG
  → subpages (17), pests (14), objects (11×5 services)
/uslugi/:service/:segment2/:segment3/          Dynamic (ThreeSegmentRouteResolver) pests×neighborhoods       CSR + SSG
  → NCH: ~1,774 pages
/rajony/                                       Static                            -                           CSR + SSG
/rajony/:slug/                                 Dynamic                           neighborhoods (130+)        CSR + SSG
/moscow-oblast/                                Static                            -                           CSR + SSG
/moscow-oblast/:citySlug/                      Dynamic                           moscowRegionCities (14)     CSR + SSG
/moscow-oblast/:citySlug/:serviceSlug/         Dynamic                           cities×services (56)        CSR + SSG
/admin/*                                       Static (nested)                   -                           CSR only
```

**Итого SSG-страниц**: ~2,300+ (9 static + 7 services + 36 districts + 17 subpages + 14 pests + 55 objects + ~1,774 NCH + 130 neighborhoods + 15 MO + 56 MO-services + 227 blog)

---

## БЛОК 2. СЕМАНТИКА И LLM-РАЗВЕСОВКА ИНТЕНТОВ

| Класс | Примеры URL | Целевые запросы | LLM-confidence | Замечания |
|-------|-------------|-----------------|----------------|-----------|
| service-hub | /uslugi/dezinsekciya/ | ВЧ коммерческие: "дезинсекция Москва" | 95 | Чёткий интент, H1 + title + CTA |
| pest-page | /uslugi/dezinsekciya/tarakany/ | СЧ: "уничтожение тараканов" | 92 | Quiz + tariffs + heroBullets → коммерция |
| object-page | /uslugi/dezinsekciya/kvartir/ | СЧ: "дезинсекция квартиры" | 90 | Цены + FAQ = коммерческий |
| geo-hub | /rajony/arbat/ | СЧ/НЧ гео: "дезинсекция Арбат" | 85 | Multi-service hub — чуть размытый (3 услуги) |
| district-page | /uslugi/dezinsekciya-cao/ | СЧ гео: "дезинсекция ЦАО" | 88 | Привязка к округу, JSON-LD LocalBusiness |
| pest+geo NCH | /uslugi/dezinsekciya/tarakany/arbat/ | НЧ: "уничтожение тараканов Арбат" | 90 | Генерированный контент, FAQ |
| blog/info | /blog/kak-izbavitsya-ot-tarakany/ | Инфо: "как избавиться от тараканов" | 88 | deOptimizeBlogTitle работает |
| B2B blog | /blog/haccp-pest-kontrol-restoran/ | B2B инфо | 85 | ServiceCTA ведёт на услуги |
| tech pages | /privacy/, /terms/ | Вспомогательные | 95 | Нет ambiguity |

**Проблемы семантики:**
1. **DistrictHero не адаптируется к serviceType** — компонент показывает `district.h1` из данных, который захардкожен как "Дезинфекция в ЦАО..." для всех 3 услуг. Dezinsekciya-cao и deratizaciya-cao показывают H1 про дезинфекцию. **Критичная проблема — каннибализация H1**.
2. **DistrictPricing одинаковый** — цены (1000+surcharge) не адаптируются к serviceType, хотя в SERVICE_CONFIG basePrice разный.
3. **DistrictCases, DistrictReviews, DistrictCTA** — не получают serviceType, показывают одинаковый контент для 3 разных URL. Thin content / duplicate content risk.

**Оценка семантики: 72/100**

---

## БЛОК 3. SEO-АУДИТ

### 3.1 Мета-данные
- **H1**: DistrictPage формирует корректный `pageTitle` в `<title>` с учётом serviceType, но **H1 в DistrictHero берётся из `district.h1`** (не адаптируется). Дубликат H1 для 3 URL.
- **Title**: корректный, с ценой и временем выезда. Длина ~65-80 символов — чуть длиннее оптимума.
- **Description**: корректный, адаптируется к serviceType.
- **Canonical**: ✅ корректный self-referencing с trailing slash.
- **OG/Twitter**: ✅ полный набор.
- **robots**: ✅ index, follow, max-snippet:-1.

### 3.2 Контент
- **NCH pest+geo**: ~650-800 слов (генератор) — ✅ норма.
- **Object pages**: ~400-500 слов — ⚠️ ниже порога 600 слов. FAQ есть, цены есть, но текст короткий.
- **Blog longreads**: ~800-2000 слов — большинство норма, но B2B articles ~600-800 слов — ⚠️ ниже 1500.
- **District pages**: контент не уникален между dezinfekciya-cao / dezinsekciya-cao / deratizaciya-cao — **дубликат контента** (DistrictCases, DistrictReviews, DistrictSpecifics, DistrictHero.h1 одинаковые).

### 3.3 Внутренняя перелинковка
- ✅ InternalLinks: service → pest → pest+geo → district cross-links — работает.
- ✅ Footer: ссылки на 3 вида услуг по округам, МО, блог.
- ✅ ServiceDistricts: табы дезинфекция/дезинсекция/дератизация.
- ⚠️ DistrictPage InternalLinks не передаёт `currentDistrict` — ссылки ведут на ЦАО/САО вместо текущего округа.

### 3.4 Технически
- ✅ `<html lang="ru">` — в index.html.
- ✅ robots.txt — корректный, sitemap-index.
- ✅ 404 page — noindex, nofollow.
- ✅ Trailing slash в canonicals.
- ⚠️ Blog пагинация — кнопка "Показать ещё" (JS, не URL-based) — нет duplicate URL issues, но нет rel="next/prev".

**Оценка SEO: 75/100**

---

## БЛОК 4. GEO-СЛОЙ

### Согласованность
- ✅ `/rajony/{slug}/` — 130+ районов с prepositional формами.
- ✅ NCH pest+geo — корректная подстановка района в H1/title/description.
- ✅ `/moscow-oblast/` → 14 городов × 4 услуги.
- ✅ Breadcrumbs для гео-слоёв корректные.

### Проблемы
1. **Район-страницы округов (dezinsekciya-cao)**: DistrictHero.h1 НЕ адаптирован к serviceType — все 3 варианта показывают одинаковый H1 из `district.h1` (например, "Дезинфекция в ЦАО"). H1 про дезинсекцию и дератизацию отсутствует.
2. **DistrictHero subtitle**: "Обслуживаем все районы..." — одинаковый текст для всех 3 услуг.
3. **ServiceDistricts tabs**: 9 округов (без НАО, ТАО, ЗелАО), но seoRoutes генерит 12 × 3 = 36 страниц. Табы не покрывают все округа.
4. **Footer links**: "Дезинсекция по округам" ведёт на `/uslugi/dezinsekciya-cao` — один конкретный округ, а не обзорную страницу. Пользователь может ожидать список.

**Оценка GEO: 68/100**

---

## БЛОК 5. UX / ФОРМЫ / НАВИГАЦИЯ

### Формы
- ✅ HeroCallbackForm: телефонная маска +7, валидация 11 цифр, согласие с privacy, toast ошибки/успех.
- ✅ ServiceQuiz: пошаговый квиз, progress bar, финальная форма с телефоном.
- ✅ Calculator: валидация площади, ошибки отображаются.
- ✅ ReviewFormModal: отдельная форма отзывов.
- ⚠️ Calculator slider range 30-200, но input позволяет 10-5000 — рассинхрон (minor).

### Пагинация
- Blog: "Показать ещё" кнопка (visibleCount += 30). Нет URL-based пагинации — нет risk дублей. ✅

### Навигация
- ✅ Header: dropdown для услуг, районов, МО.
- ✅ Breadcrumbs: корректная иерархия на всех типах страниц.
- ✅ 404: noindex + ссылки на популярные услуги.
- ⚠️ Footer "Дезинсекция по округам" → ведёт на конкретный округ (cao), а не обзорную страницу.

**Оценка UX: 82/100**

---

## БЛОК 6. SSG / РЕНДЕР-БЕЗОПАСНОСТЬ

### generateStaticParams (seoRoutes.ts)
- ✅ `validateAllRoutes()` — fail-fast в CI (forbidden patterns + duplicates).
- ✅ `validateRouteIntegrity()` — блокирует Object+Geo, pest-as-service, kroty leak.
- ✅ Duplicate detection.
- ✅ Dockerfile: test -f checks для marker pages, порог 500+ страниц.

### Алёрты и защита
- ✅ SSG schema isolation (homepage LD stripped for subpages).
- ✅ deOptimizeBlogTitle — anti-cannibalization.
- ⚠️ Нет централизованного error boundary компонента (ErrorBoundary) — runtime crash → белый экран.
- ⚠️ ThreeSegmentRouteResolver проверяет только pest + neighborhood — если добавить новый тип (object+geo), нужен explicit block.

**Оценка техники: 85/100**

---

## БЛОК 7. СВОДНАЯ ОЦЕНКА

| Направление | Оценка |
|-------------|--------|
| Семантика и LLM-однозначность | 72 |
| SEO-онпейдж | 75 |
| GEO-слой | 68 |
| UX (формы, навигация, пагинация) | 82 |
| Техническая устойчивость | 85 |

**Формула**: `0.3 × 72 + 0.3 × 75 + 0.2 × 68 + 0.1 × 82 + 0.1 × 85`
= `21.6 + 22.5 + 13.6 + 8.2 + 8.5` = **74**

### **Оценка сайта: 74 из 100**

---

## TOP-10 ПОПРАВОК (по убыванию эффекта)

| # | Где | Что изменить | Зачем | Эффект |
|---|-----|-------------|-------|--------|
| 1 | `DistrictHero.tsx` | Передать `serviceType` prop, адаптировать H1 под "Дезинсекция в ЦАО" / "Дератизация в ЦАО" | Сейчас 36 страниц с 12 уникальными H1 вместо 36. Каннибализация. | **High** — убирает дубли H1, +15-20% к гео-SEO |
| 2 | `DistrictPricing.tsx` | Принять serviceType, адаптировать базовые цены (1200 дезинсекция, 1400 дератизация vs 1000 дезинфекция) | Цены не соответствуют услуге. Дублирующийся контент. | **High** — уникализация 36 страниц |
| 3 | `DistrictCases.tsx`, `DistrictReviews.tsx` | Адаптировать кейсы/отзывы к serviceType (фильтровать по типу услуги) | Одинаковый контент на 3 URL → thin content risk | **High** — уникализация контента |
| 4 | `ServiceObjectPage.tsx` | Добавить больше текстового контента (600+ слов): секции "Как мы работаем", "Почему мы" | Object pages < 600 слов — thin content | **Medium** — SEO для СЧ запросов |
| 5 | `DistrictPage.tsx` строка 354 | Передать `currentDistrict={district.id}` в InternalLinks | Ссылки ведут на ЦАО/САО вместо текущего округа | **Medium** — правильная перелинковка |
| 6 | `ServiceDistricts.tsx` | Добавить НАО, ТАО, ЗелАО в табы округов (сейчас только 9 из 12) | 3 округа без ссылок из tabs — хуже индексация | **Medium** — полнота GEO покрытия |
| 7 | `Footer.tsx` строки 70-71 | Изменить ссылки "Дезинсекция по округам" / "Дератизация по округам" на обзорную страницу или создать фильтрованные обзоры | Ведут на конкретный ЦАО, а не на список | **Low-Medium** — UX + SEO |
| 8 | `App.tsx` | Добавить React Error Boundary вокруг Routes | Runtime crash = белый экран без fallback | **Medium** — устойчивость |
| 9 | B2B blog articles | Наращивать контент до 1500+ слов | B2B статьи ~600-800 слов — thin content для longreads | **Low** — quality signal |
| 10 | `DistrictHero.tsx` subtitle | Адаптировать "Обслуживаем все районы..." к конкретной услуге: "Проведём дезинсекцию во всех районах..." | Дублирующийся подзаголовок на 3 URL | **Low** — уникализация |

---

### Резюме

Архитектура сайта мощная: fail-fast SSG, route integrity validation, anti-cannibalization blog de-optimization, 3-tier NCH модель. Основная проблема — **24 новые страницы дезинсекции/дератизации по округам получают неадаптированный контент** (H1, цены, кейсы одинаковые с дезинфекцией). Исправление пунктов 1-3 поднимет оценку до ~82-85.

