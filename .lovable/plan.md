

# ПОЛНЫЙ POST-DEPLOY АУДИТ — goruslugimsk.ru

---

## ИТОГОВАЯ ОЦЕНКА: 91 / 100

---

## A. АРХИТЕКТУРА И РОУТИНГ — 96/100

- 1250+ SSG-страниц, единый source of truth (`seoRoutes.ts`)
- 3-tier NCH модель (Tier 1 index, Tier 2/3 noindex)
- `validateRouteIntegrity()` fail-fast в CI
- `validateAllRoutes()` дубликаты блокируются
- 500+ 301-редиректов в `_redirects`
- `normalizePathWithTrailingSlash()` для canonical
- Sitemap синхронизирован с SSG routes
- 410 для WordPress legacy URLs

**Без проблем.**

---

## B. SEO ON-PAGE — 87/100

### Что отлично:
- `metadata.ts` с автовалидацией (title 40-65, description 140-165)
- SEOHead с runtime dev-проверкой
- canonical trailing slash на всех страницах
- robots.txt корректен (Yandex, Google, LLM-краулеры)
- hreflang ru + x-default

### ISSUES:

| # | Severity | Проблема | Где | Fix |
|---|----------|----------|-----|-----|
| B1 | **HIGH** | Footer: все 15+ ссылок на `/uslugi/*` **без trailing slash** (`/uslugi/dezinfekciya` вместо `/uslugi/dezinfekciya/`). Аналогично `/rajony`, `/blog`, `/contacts`, `/team`, `/otzyvy`, `/sluzhba-dezinsekcii`, `/privacy`, `/terms` | `Footer.tsx` lines 46-72 | Добавить `/` ко всем `to=""` |
| B2 | Medium | `jsonLD.ts` — placeholder `sameAs` URLs (`vk.com/yourpage`, `t.me/yourpage`) | `jsonLD.ts` lines 37-40 | Удалить или заменить реальными |
| B3 | Medium | `jsonLD.ts` line 56 — URL без trailing slash для neighborhood | `jsonLD.ts` line 56 | Добавить `/` |
| B4 | Medium | 95 ссылок на deprecated `/uslugi/sertifikaciya/` в блог-контенте | `legal-commercial.ts` | Заменить на `/uslugi/dezinfekciya/` |
| B5 | Low | `analytics.ts` line 138 — маппинг для deprecated sertifikaciya | `analytics.ts` | Удалить строку |

---

## C. SCHEMA.ORG — 88/100

### Что отлично:
- LocalBusiness на главной через `generateIndexMetadata` + на /contacts/
- Service schema на service hub pages
- FAQPage schema синхронизирована с FAQ-блоками
- `generateBreadcrumbSchema()` с trailing slash fix (baseUrl + '/')
- Контекстные FAQ с ссылками на 3 hub-страницах
- DistrictsOverview: FAQ + FAQPage schema

### ISSUES:

| # | Severity | Проблема | Где | Fix |
|---|----------|----------|-----|-----|
| C1 | **HIGH** | `/#services` anchor URL в BreadcrumbList schema — не настоящая страница, Google может показать warning | `ServicePage.tsx` line 161, `DistrictPage.tsx` line 144, `DistrictsOverview.tsx` line 42 | Убрать `item` для "Услуги" (промежуточный breadcrumb без URL) или указать `/uslugi/po-okrugam-moskvy/` |
| C2 | **HIGH** | `DistrictPage.tsx` line 143: `item: SEO_CONFIG.baseUrl` — **без trailing slash** для "Главная" | `DistrictPage.tsx` | Добавить `+ '/'` |
| C3 | Medium | `DistrictPage.tsx` line 145, 146: URL без trailing slash (`/uslugi/po-okrugam-moskvy` вместо `/uslugi/po-okrugam-moskvy/`) | `DistrictPage.tsx` | Добавить `/` |
| C4 | Medium | `NeighborhoodsOverview.tsx` line 68: `item: SEO_CONFIG.baseUrl` без slash; line 69: `/rajony` без slash | `NeighborhoodsOverview.tsx` | Добавить trailing slashes |
| C5 | Medium | `NeighborhoodPage.tsx` lines 87-89: все 3 breadcrumb URL без trailing slash (через `generateBreadcrumbLD`) | `jsonLD.ts` `generateBreadcrumbLD` and callers | Fix в `jsonLD.ts` или в вызовах |
| C6 | Low | `DistrictPage.tsx` line 146: последний breadcrumb элемент имеет `item` — должен быть без | `DistrictPage.tsx` | Убрать `item` |

---

## D. ВНУТРЕННЯЯ ПЕРЕЛИНКОВКА — 95/100

- Централизованная логика в `internalLinking.ts`
- `isSeoLinkable()` фильтрует noindex, utility, admin, Tier 2/3 NCH
- Модульные блоки: RelatedServices, RelatedGeoLinks, RelatedBlogLinks
- `InternalLinks.tsx` полностью удалён (0 импортов)
- Кластерная фильтрация корректна
- Все 12+ типов страниц мигрированы
- Null при пустом списке

**Без проблем.**

---

## E. ANALYTICS — 92/100

- `trackGoal()` автоматически стреляет `all_conversions`
- Anti-recursion guard работает
- phone_click покрытие: Footer, ServicePage, Contacts, MobileQuickCTA
- quiz_lead_*, calc_lead_* — prefix-based matching

**1 minor issue: sertifikaciya mapping (B5).**

---

## F. TRAILING SLASH CONSISTENCY — 82/100

Это самая серьёзная системная проблема. Хотя canonical корректен, **внутренние `<Link to="">` во многих компонентах без trailing slash**:

| Файл | Кол-во ссылок без slash |
|------|------------------------|
| `Footer.tsx` | ~15 |
| `ServicePage.tsx` line 803 | ~6 (other services) |
| `ServiceSubpage.tsx` line 117, 378, 388 | 3 |
| `DistrictsOverview.tsx` lines 98, 127-128 | ~15 |
| `NeighborhoodsOverview.tsx` line 245 | 1 |

React Router обрабатывает оба варианта одинаково, но для SEO-краулеров при SSG-рендеринге это может создавать несоответствие canonical ↔ internal links. Не критично (browser redirect), но идеально — привести в соответствие.

---

## G. ИНФРАСТРУКТУРА — 93/100

- SSR entry point с polyfills
- Lazy loading non-critical компонентов
- ErrorBoundary
- CookieBanner
- Service Worker
- Lighthouse CI pipeline
- Daily monitoring + Telegram alerts
- IndexNow automation
- Docker + nginx

**Без проблем.**

---

## H. CONTENT & E-E-A-T — 89/100

- /team/ — 6 экспертов, AuthorBadge
- 207 blog articles
- 23 mole city landings
- Контекстные FAQ с внутренними ссылками
- LLM-ready (llms.txt, AI crawler rules)

**1 issue: sertifikaciya orphan links в контенте (B4).**

---

## СВОДКА ВСЕХ ISSUES

| # | Sev | Issue | Files |
|---|-----|-------|-------|
| B1 | **HIGH** | Footer — 15+ ссылок без trailing slash | `Footer.tsx` |
| C1 | **HIGH** | `/#services` anchor в BreadcrumbList schema | `ServicePage.tsx`, `DistrictPage.tsx`, `DistrictsOverview.tsx` |
| C2 | **HIGH** | DistrictPage breadcrumb — baseUrl без trailing slash | `DistrictPage.tsx` |
| B2 | Medium | jsonLD placeholder sameAs | `jsonLD.ts` |
| B3 | Medium | jsonLD neighborhood URL без slash | `jsonLD.ts` |
| B4 | Medium | 95 ссылок на deprecated sertifikaciya | `legal-commercial.ts` |
| C3 | Medium | DistrictPage breadcrumb URLs без slash | `DistrictPage.tsx` |
| C4 | Medium | NeighborhoodsOverview breadcrumb без slash | `NeighborhoodsOverview.tsx` |
| C5 | Medium | NeighborhoodPage breadcrumb URLs без slash | `NeighborhoodPage.tsx` / `jsonLD.ts` |
| B5 | Low | analytics sertifikaciya mapping | `analytics.ts` |
| C6 | Low | DistrictPage последний breadcrumb с item | `DistrictPage.tsx` |
| F1 | Low | ~40 internal links без trailing slash в разных компонентах | `ServicePage.tsx`, `ServiceSubpage.tsx`, `DistrictsOverview.tsx` |

**Всего: 12 issues (3 HIGH, 6 Medium, 3 Low). 0 Critical.**

---

## ОЦЕНКА ПО КАТЕГОРИЯМ

| Категория | Балл |
|-----------|------|
| Архитектура и роутинг | 96 |
| SEO on-page | 87 |
| Schema.org | 88 |
| Внутренняя перелинковка | 95 |
| Analytics | 92 |
| Trailing slash consistency | 82 |
| Инфраструктура | 93 |
| Content & E-E-A-T | 89 |
| **ИТОГО** | **91** |

---

## РЕКОМЕНДАЦИЯ

Исправление 3 HIGH issues (Footer trailing slashes, `/#services` в schema, DistrictPage baseUrl) и 6 Medium issues поднимет оценку до **95-96/100**.

Приоритет:
1. **Footer.tsx** — trailing slash на все ссылки (влияет на каждую страницу сайта)
2. **BreadcrumbList schema** — убрать `/#services`, fix trailing slashes в DistrictPage, NeighborhoodsOverview, NeighborhoodPage
3. **jsonLD.ts** — удалить placeholder sameAs, fix trailing slash
4. **legal-commercial.ts** — заменить sertifikaciya ссылки
5. **analytics.ts** — удалить deprecated mapping

