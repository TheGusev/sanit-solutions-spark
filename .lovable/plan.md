

Пользователь просит полный аудит сайта: функциональность, рассинхроны, актуальность, sitemap/robots, оценка индексации. Это research/audit задача — НЕ implementation. По правилам: "Skip plan for research". Но в plan mode я могу только читать. Поэтому проведу аудит через read-only tools и выдам отчёт прямо в plan-блоке.

Дам структурированный план аудита и попрошу одобрения для перехода в default mode для выполнения проверок (build, grep, lighthouse), либо проведу что могу через read-only прямо сейчас.

Лучший подход: предложить структурированный аудит-план с конкретными областями проверки, после approve — переключусь в default mode и выполню реальные проверки (npm run build, grep dist, sitemap parse, schema count, lead delivery test).

# Полный Аудит Проекта — Функциональность, SEO, Индексация

## Что будет проверено (8 областей)

### 1. Build & SSG Integrity
- `npm run build` — должен пройти без ошибок, сгенерировать ≥1280 страниц
- TypeScript compile clean
- Verify-build.js guard pass
- Подсчёт фактических `dist/**/index.html`

### 2. Sitemap / Robots / Canonical Sync
- Парсинг `dist/sitemap-index.xml` + всех child sitemaps
- Подсчёт URL по категориям (services / pests / districts / MO / mole / blog / NCH)
- Проверка trailing slashes, отсутствия admin/utility/noindex URLs
- Cross-check canonical в HTML vs sitemap для 10 representative URLs
- `dist/robots.txt` — соответствие политике (LLM allow, Semrush block)

### 3. Mole Cluster (недавно усиленный)
- Все 23 города МО — проверка реальной генерации dist HTML
- Уникальность: cityTier, methodNotes, objectContext в HTML
- FAQ count по городам
- Schema (Service + LocalBusiness + FAQPage)
- canonical/robots/title для всех 23

### 4. Representative URL Spot-Checks (12 типов страниц)
Homepage, service hub, pest, object, district, MO city, mole city, blog index, blog post, NCH, contacts, calculator-bearing page — проверка title/description/canonical/robots/H1/breadcrumb-schema count.

### 5. Schema Integrity
- Подсчёт JSON-LD per page — нет дублей BreadcrumbList/FAQPage
- Homepage schema isolation policy
- AggregateRating присутствует на pest pages
- WhatsApp удалён из sameAs (verify previous fix)

### 6. Internal Linking
- Grep dist на broken links (`/uslugi/sertifikaciya/`, `/admin/`, deprecated paths)
- RelatedServices/RelatedGeoLinks slug resolution
- Korolev redirect — verify `/moscow-oblast/korolyov/*` → `/moscow-oblast/korolev/*`

### 7. Calculator & Lead Delivery (recent rework)
- `SimpleCalculator` все 6 проблем × объекты × room → правильная цена
- Lead delivery test через `handle-lead` edge function
- `all_conversions` goal integrity
- Проверка отсутствия VK/TMR references (post-cleanup)

### 8. Indexation Assessment
- Чтение `MONITORING.md` + `.monitoring-cache.json` — актуальные данные Yandex/Google индексации
- Sitemap URL count vs ожидаемое (~1085)
- Tier 1/2/3 NCH policy compliance (Tier 2/3 noindexed)
- Анализ возможных причин deindexation/slow crawl

## Deliverable — Финальный Отчёт

Структурированный отчёт в 8 секциях:
1. **Build status** — pass/fail, page count, errors
2. **Sitemap/Robots audit** — URL counts, нарушения если есть
3. **Mole cluster verification** — все 23 города таблицей
4. **Representative URL matrix** — 12×7 проверок
5. **Schema integrity** — дубли, missing, malformed
6. **Internal linking** — broken links list
7. **Calculator/Analytics/Leads** — функциональный статус
8. **Indexation assessment** — текущее состояние + рекомендации

## Что НЕ будет меняться

Это **read-only аудит**. Никаких правок кода в этой задаче. Если найдутся проблемы — будут зафиксированы в отчёте отдельным списком "Issues to fix" с приоритетами (critical/high/medium/low) для последующих focused-batches с твоим одобрением.

## Инструменты

- `npm run build` (production build)
- grep / find в `dist/`
- Парсинг sitemap XML
- `supabase--curl_edge_functions` для lead delivery test
- Чтение MONITORING.md
- Read-only код-инспекция

После approve — переключусь в default mode и выполню всё последовательно одним большим прогоном, затем отдам единый отчёт.

