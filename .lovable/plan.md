

# Полный аудит goruslugimsk.ru — план максимальной проверки

Проведу комплексный аудит сайта по всем направлениям с финальной оценкой по 100-балльной шкале.

## Что проверю (10 направлений)

### 1. SEO Governance (Monitor v3.1)
- Запущу `scripts/monitor.py` — свежий прогон всех 13 модулей
- Проверю: representative URLs (10), sample-50 audit, SeoRoutes↔Sitemap sync, stop-conditions
- Сравню с предыдущим прогоном (delta)

### 2. Sitemap & Indexability
- `sitemap-index.xml` + 9 sub-sitemaps: общее количество URL, дубликаты, redirects
- `robots.txt`: проверка disallow rules, LLM crawlers
- Noindex policy: privacy, terms, sertifikaciya, NCH Tier 2/3

### 3. Structured Data (JSON-LD)
- BreadcrumbList на всех типах страниц (10 representative)
- AggregateRating на pest pages
- Organization, LocalBusiness, FAQPage, BlogPosting
- Дубликаты схем

### 4. Canonical & Meta Tags
- Sample 50 URL: canonical = fetched URL
- og:url = canonical
- Trailing slash compliance
- Meta robots на noindex pages

### 5. HTTP Performance
- Response time на 10 representative URL
- 404/500 errors check
- nginx headers (X-Robots-Tag, Cache-Control)

### 6. Build & SSG Integrity
- `dist/` count vs sitemap count
- Build guard checks (`scripts/verify-build.js`)
- Static HTML files на districts (33 файла)

### 7. Critical Business Logic
- Контакты (8-495-018-18-17, @one_help, без WhatsApp)
- Гарантия "до 3 лет"
- Цены (от 1000₽, синхронизация с servicePrices.ts)

### 8. Internal Linking
- Admin links: rel="nofollow"
- Money pages: 5-15 internal links each
- Orphan pages detection

### 9. Backend Health
- handle-lead edge function status
- Yandex Metrika ID 105828040 на всех страницах
- Telegram CTA presence

### 10. Memory Standards Compliance
- Проверка соответствия 80+ memory rules
- Geographic scope (Москва и МО)
- Mole control isolation
- NCH indexing tiers

## Метод проверки

```text
Phase 1: Monitor.py run (3-5 мин) — automated audit
Phase 2: Sitemap analysis — curl + xmllint
Phase 3: Structured data deep-check — 10 sample URLs full GET
Phase 4: Build verification — dist/ inspection
Phase 5: Cross-check vs memory standards
Phase 6: Score calculation per category
```

## Финальная оценка

Финальная сводка в формате:

```text
КАТЕГОРИЯ                          БАЛЛЫ    СТАТУС
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. SEO Governance                   __/10   ✅/⚠️/🚨
2. Sitemap & Indexability           __/10
3. Structured Data                  __/10
4. Canonical & Meta Tags            __/10
5. HTTP Performance                 __/10
6. Build & SSG Integrity            __/10
7. Business Logic                   __/10
8. Internal Linking                 __/10
9. Backend Health                   __/10
10. Memory Standards                __/10
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ИТОГО:                              __/100
```

С разбором каждой найденной проблемы и приоритезацией fix'ов.

## Что НЕ трогаю

- Никаких правок кода в этой фазе
- Только аудит + отчёт
- Если найдутся critical issues — отдельный план на фикс

## Deliverable

Один markdown-отчёт с:
1. Финальная оценка (X/100)
2. Поматричный разбор по 10 категориям
3. Список всех найденных проблем (CRITICAL / WARNING / INFO)
4. Сравнение с baseline трёх дней назад (что улучшилось)
5. Roadmap до 100/100 (если не достигли)

