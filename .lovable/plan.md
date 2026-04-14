

# STATUS-RUN: Полный тех-аудит goruslugimsk.ru

---

## 1. EXECUTIVE STATUS

Проект прошёл SANITIZE почти полностью, STABILIZE на ~75%, до SCALE остаётся 3-5 задач. Архитектура зрелая: tiered NCH, модульная перелинковка, canonical нормализация, `all_conversions` — всё работает. Основные риски: дубль BreadcrumbList schema на NCH-страницах и Tier 2/3 NCH по-прежнему генерируются через SSG (хоть и с noindex).

---

## 2. PHASE STATUS TABLE

| Фаза | Статус | Подтверждено кодом |
|------|--------|--------------------|
| **SANITIZE** | **DONE** | Tier 2/3 noindex ✓, combo-pages removed ✓, kroty из городских NCH удалены ✓, sertifikaciya removed ✓, doorway redirects в `_redirects` ✓, admin исключён из sitemap ✓ |
| **STABILIZE** | **PARTIAL (75%)** | Модульная перелинковка Phase 4 ✓, canonical trailing slash ✓, Breadcrumbs + BreadcrumbList schema ✓, FAQ + FAQPage schema на NCH/districts ✓, all_conversions ✓. **Не завершено**: дубль breadcrumb schema на NchPage, нет FAQ schema на некоторых service hubs |
| **SCALE-READY** | **PARTIAL (50%)** | all_conversions готов для Директа ✓, sitemap чистый ✓. **Не готово**: верификация полного SSG рендера всех critical blocks, мониторинг индексации |

---

## 3. RENDERING STATUS

| Тип | Страницы | Подробности |
|-----|----------|-------------|
| **SSG (pre-rendered)** | ~1250 страниц | Все маршруты из `getAllSSGRoutes()` → `vite-plugin-ssg.ts`. HTML генерируется через AppSSR.tsx. Включает: главную, все услуги, все вредители, все объекты, все NCH (все тиры), все районы, все МО города, все кроты, весь блог |
| **SSR** | 0 | Нет server-side rendering в рантайме. SSG only (static files через nginx) |
| **CSR-only** | Admin (/admin/*), модальные компоненты | Admin страницы рендерятся только клиентски — **корректно**, они за auth |
| **Risky SEO routes** | Нет критических | Все коммерческие страницы проходят через SSG с AppSSR.tsx |

**Critical SEO blocks в initial HTML:**

| Block | Статус | Метод |
|-------|--------|-------|
| H1 | ✅ VERIFIED | Рендерится в SSR через React компоненты |
| Title / Description | ✅ VERIFIED | react-helmet-async → SSG strip/inject |
| Canonical | ✅ VERIFIED | `generateSEOMeta()` с `normalizePathWithTrailingSlash()` |
| Breadcrumbs (visible) | ✅ VERIFIED | Компонент `Breadcrumbs.tsx` на всех шаблонах |
| BreadcrumbList JSON-LD | ⚠️ PARTIAL | Breadcrumbs.tsx генерирует через `generateBreadcrumbSchema()` — OK. **НО** NchPage.tsx дублирует inline breadcrumbSchema (строки 159-168) — **двойной BreadcrumbList** |
| Schema JSON-LD | ✅ VERIFIED | Service, LocalBusiness, FAQPage на ключевых шаблонах |
| Internal modular blocks | ✅ VERIFIED | RelatedServices, RelatedGeoLinks, RelatedBlogLinks рендерятся в HTML |

---

## 4. INDEX / SITEMAP / ROBOTS

### INDEX STATUS

| Слой | Статус | Детали |
|------|--------|--------|
| Core indexable | ✅ OK | ~7 услуг, ~14 pest pages, ~60 object pages, ~36 district pages, ~130 районов, ~23 mole, ~207 blog, static pages |
| Tier 1 NCH | ✅ OK | 4 pests × 130 neighborhoods = 520 страниц. `robots: index, follow`. В sitemap-nch.xml |
| Tier 2/3 noindex isolation | ✅ OK | NchPage.tsx строка 95: `isNoindexTier` → `noindex, follow`. Tier 2/3 **НЕ** в sitemap (строка 391: "removed from sitemap") |
| Utility pages isolation | ✅ OK | `/privacy/`, `/terms/` в SSG но с низким приоритетом. Admin НЕ в sitemap, НЕ в SSG |

### SITEMAP

| Файл | URLs | Статус |
|------|------|--------|
| sitemap-main.xml | ~10 | ✅ OK |
| sitemap-services.xml | ~22 | ✅ OK |
| sitemap-services-pest.xml | ~14 | ✅ OK |
| sitemap-services-object.xml | ~60 | ✅ OK |
| sitemap-moscow.xml | ~166 (36 district + 130 rajony) | ✅ OK |
| sitemap-moscow-region.xml | ~70 (14 cities × 5) | ✅ OK |
| sitemap-nch.xml | 520 (Tier 1 only) | ✅ OK |
| sitemap-mole.xml | 23 | ✅ OK |
| sitemap-blog.xml | ~207 | ✅ OK |
| **TOTAL** | **~1092** | Все trailing slash ✓, noindex excluded ✓ |

### ROBOTS.TXT

- ✅ Exists at `/public/robots.txt`
- ✅ `Sitemap: https://goruslugimsk.ru/sitemap-index.xml` — указан
- ✅ `User-agent: *` → `Allow: /`, `Disallow: /admin/`
- ✅ AhrefsBot и SemrushBot заблокированы (`Disallow: /`)
- ✅ LLM-краулеры разрешены
- ✅ Admin заблокирован для всех ботов

---

## 5. CANONICAL / TRAILING SLASH

**Выборочная проверка по коду:**

| URL | Canonical | Trailing slash | Статус |
|-----|-----------|---------------|--------|
| `/` | `https://goruslugimsk.ru/` | ✅ | OK |
| `/sluzhba-dezinsekcii/` | через `generateSEOMeta()` → `normalizePathWithTrailingSlash()` | ✅ | OK |
| `/uslugi/dezinsekciya/` | `generateServiceMetadata()` → canonical с slash | ✅ | OK |
| `/uslugi/dezinsekciya/klopy/` | через `generateSEOMeta()` | ✅ | OK |
| `/rajony/` | Breadcrumbs + `generateNeighborhoodLD()` | ✅ | OK |
| `/rajony/zyuzino/` | NeighborhoodPage → `generateSEOMeta()` | ✅ | OK |
| NCH: `/uslugi/dezinsekciya/tarakany/arbat/` | NchPage строка 92: `generateSEOMeta(canonicalPath, ...)` | ⚠️ | `canonicalPath` не имеет trailing slash (`/uslugi/${service}/${pestSlug}/${neighborhoodSlug}`), но `generateSEOMeta` добавляет его через `normalizePathWithTrailingSlash` → **OK** |
| MO: `/moscow-oblast/mytishchi/dezinsekciya/` | через `generateSEOMeta()` | ✅ | OK |

**Self-referencing**: ✅ VERIFIED — все canonical self-referencing через `generateSEOMeta()`

---

## 6. INTERNAL LINKING STATUS (PHASE 4)

**InternalLinks**: ✅ Полностью удалён. Поиск по `InternalLinks` = 0 результатов.

| Template | Breadcrumbs | RelatedServices | RelatedGeoLinks | RelatedBlogLinks | Issues |
|----------|-------------|-----------------|-----------------|------------------|--------|
| NchPage | ✅ | ✅ | ✅ | ✅ | ⚠️ Дубль BreadcrumbList schema |
| DistrictPage | ✅ | ✅ | ✅ | ✅ | — |
| DistrictsOverview | ✅ | ✅ | — | ✅ | — |
| MoleCityPage | ✅ | ✅ | ✅ (getRelatedMoleCities) | — | Нет RelatedBlogLinks |
| MoscowRegionServicePage | ✅ | ✅ | ✅ | ✅ | — |
| ServiceSubpage | ✅ (inline) | ✅ | ✅ | ✅ | — |
| ServiceDistrictPage | ✅ | ✅ | ✅ | ✅ | — |
| ServicePage | — | — | ✅ | ✅ | Нет RelatedServices (это хаб — OK) |
| NeighborhoodPage | ✅ | ✅ | ✅ | ✅ | — |

**Фильтрация noindex**: ✅ `isSeoLinkable()` блокирует Tier 2/3 NCH, admin, utility.

---

## 7. BREADCRUMBS + SCHEMA

| Аспект | Статус |
|--------|--------|
| Visible breadcrumbs | ✅ На всех шаблонах через `Breadcrumbs.tsx` |
| BreadcrumbList JSON-LD | ✅ Через `generateBreadcrumbSchema()` в `Breadcrumbs.tsx` |
| Последний crumb без ссылки | ✅ Строка 345: `...(item.href ? { item: ... } : {})` |
| Позиции с 1 | ✅ Position 1 = Главная |
| Trailing slash в item URL | ✅ `SEO_CONFIG.baseUrl + item.href` (href уже с slash) |
| **ДУБЛЬ на NchPage** | ❌ **BUG**: NchPage строки 159-168 генерируют inline breadcrumbSchema → Helmet inject. Плюс Breadcrumbs.tsx строка 22 — ещё один. **2 BreadcrumbList на одной странице** |

---

## 8. FAQ + FAQPage STATUS

| Шаблон | FAQ visible | FAQPage schema | Статус |
|--------|-------------|----------------|--------|
| NchPage | ✅ | ✅ (faqSchema) | OK |
| DistrictsOverview | ✅ | ✅ (faqSchema) | OK |
| DistrictPage | ✅ | ⚠️ NOT VERIFIED — нужно проверить наличие schema | Partial |
| NeighborhoodPage | ✅ | ✅ (generateFAQLD) | OK |
| ServicePage | ✅ (FAQ компонент) | ⚠️ NOT VERIFIED | Partial |
| MoleCityPage | ✅ | ⚠️ NOT VERIFIED | Partial |
| MoscowRegionServicePage | ✅ | ✅ (generateFAQSchema) | OK |
| Index (homepage) | ✅ (FAQ компонент) | ⚠️ NOT VERIFIED в metadata | Partial |

---

## 9. ALL_CONVERSIONS STATUS

**IMPLEMENTED** ✅

| Аспект | Детали |
|--------|--------|
| File | `src/lib/analytics.ts` строки 184-204 |
| Механизм | Составная цель: при срабатывании любого goal из SET → автоматически вызывается `all_conversions` |
| Covered triggers | `final_cta_call`, `final_cta_calculator`, `calc_open`, `calc_interact`, `calc_price_view`, `service_sticky_call`, `calc_calculate`, `lead_submit`, `hero_callback_submit`, `phone_click`, `quiz_lead_*`, `calc_lead_*` |
| Missing triggers | `telegram_click` — **не в ALL_CONV_GOALS set**, хотя есть в VK/TMR map |
| Дубли | Нет — проверка `goalName !== 'all_conversions'` предотвращает рекурсию |
| Admin pages | ✅ Безопасно — admin не вызывает trackGoal для конверсий |
| Директ readiness | ✅ Можно использовать `all_conversions` как цель оптимизации |

**RISK**: `telegram_click` и `messenger_click` (FloatingButtons) не входят в `ALL_CONV_GOALS`. Если клик по мессенджеру считается конверсией → нужно добавить.

---

## 10. ROUTING / HTTP / REDIRECTS

| Аспект | Статус |
|--------|--------|
| Routing priority | ✅ Static routes BEFORE parametric в App.tsx и AppSSR.tsx |
| App.tsx ↔ AppSSR.tsx sync | ✅ Все публичные маршруты зеркалируются |
| Trailing slash redirects | ✅ Через nginx `try_files $uri $uri/index.html` |
| 301 chains | ✅ `_redirects` содержит прямые 301, не цепочки |
| Broken internal links | ✅ Модульные блоки используют данные из data sources → ссылки валидны |
| Route conflicts | ✅ Нет — static/parametric разделение корректно |

---

## 11. PWA / ADMIN / PUSH LAYER

| Аспект | Статус |
|--------|--------|
| Admin в sitemap | ✅ НЕ попадает |
| Admin в internal links | ✅ `isSeoLinkable()` блокирует `/admin` |
| Service worker | ⚠️ `public/sw.js` существует — нужно убедиться что он не кэширует indexable HTML агрессивно. NOT VERIFIED |
| PWA manifest | `public/manifest.json` — не влияет на SEO |

---

## 12. SITE HEALTH SUMMARY

### Что сделано хорошо
1. **Tiered NCH architecture** — чистое разделение index/noindex, Tier 2/3 не в sitemap
2. **Модульная перелинковка** — Phase 4 полностью завершена, InternalLinks удалён
3. **Canonical нормализация** — все URL через `generateSEOMeta()` с trailing slash
4. **all_conversions** — полностью реализован, готов для Директа
5. **Sitemap** — 9 чистых файлов, только indexable URLs, trailing slash

### TOP 5 HIGHEST PRIORITY

| # | Задача | Severity | Файл |
|---|--------|----------|------|
| 1 | **Убрать дубль BreadcrumbList** на NchPage (inline schema строки 159-168 — удалить, оставить только Breadcrumbs.tsx) | HIGH | `src/pages/NchPage.tsx:159-168` |
| 2 | **Добавить `telegram_click` и `messenger_click` в ALL_CONV_GOALS** | MEDIUM | `src/lib/analytics.ts:185-188` |
| 3 | **Добавить FAQPage schema** на ServicePage, DistrictPage, MoleCityPage, Index — где есть visible FAQ но нет schema | MEDIUM | Несколько файлов |
| 4 | **Проверить sw.js** — не кэширует ли HTML агрессивно, не блокирует ли обновления для ботов | LOW | `public/sw.js` |
| 5 | **MoleCityPage: добавить RelatedBlogLinks** — единственный шаблон без блоговых ссылок | LOW | `src/pages/MoleCityPage.tsx` |

### 5 задач которые можно НЕ трогать
1. robots.txt — полностью корректен
2. Sitemap структура — чистая, без утечек
3. Canonical / trailing slash — работает
4. SSG рендеринг — стабильный
5. InternalLinks удаление — завершено

### BLOCKERS BEFORE SCALE

| # | Blocker | Impact |
|---|---------|--------|
| 1 | **Дубль BreadcrumbList на ~520 NCH страницах** — Google/Яндекс может показать warning в Search Console, снижение доверия к structured data | Блокер для чистого Schema audit |
| 2 | **telegram_click вне all_conversions** — занижает реальную конверсию в Директе, если мессенджер-лиды значимы | Блокер для точной оптимизации Директа |

Оба фикса — по 1-2 строки кода каждый. После них проект готов к SCALE.

