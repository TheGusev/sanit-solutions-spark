# 🤖 MONITORING.md — goruslugimsk.ru

**Дата:** 18.04.2026 | **Статус:** CRITICAL | **Финальный вердикт:** NOT SAFE UNTIL FIXED

---

## 1. Executive Summary

- Сайт: **ONLINE**
- Build / SSG: **OK**
- Canonical / Sitemap / Indexability: **FAIL**
- Schema: **WARNING**
- Conversion / Analytics: **OK**
- Performance / Cache: **OK**

### Что изменилось с прошлого запуска

Существенных изменений не обнаружено.

---

## 2. Critical Alerts

| Severity | Check | Problem | Impact | Action |
|---|---|---|---|---|
| CRITICAL | Canonical | /uslugi/dezinfekciya-cao/: отсутствует canonical | Нарушение SEO-стандарта | Проверить SEOHead.tsx |
| WARNING | Schema | /uslugi/dezinfekciya-cao/: BreadcrumbList отсутствует | Снижение видимости в SERP | Добавить разметку |
| WARNING | Schema | /uslugi/sertifikaciya/: BreadcrumbList отсутствует | Снижение видимости в SERP | Добавить разметку |
| WARNING | Sync | 9 путей из seoRoutes.ts отсутствуют в sitemap (пример: /privacy/, /terms/, /uslugi/borba-s-krotami/khimki/, /uslugi/demerkurizaciya/avtomobiley/, /uslugi/demerkurizaciya/detskih-sadov/) | Compile-time расходится с public sitemap | Проверить SSG-пайплайн / vite-plugin-sitemap.ts |

---

## 3. Key URL Health

| URL | HTTP | Response Time | Notes |
|---|---|---:|---|
| / | ✅ 200 | 227 мс | — |
| /uslugi/dezinfekciya/ | ✅ 200 | 225 мс | — |
| /uslugi/dezinsekciya/ | ✅ 200 | 196 мс | — |
| /uslugi/deratizaciya/ | ✅ 200 | 191 мс | — |
| /blog/ | ✅ 200 | 196 мс | — |
| /contacts/ | ✅ 200 | 151 мс | — |

---

## 4. Governance Checks

### Routing / Canonical / Trailing Slash

| Check | Result | Notes |
|---|---|---|
| Self-referencing canonical | ❌ 1 drift | 10 representative URLs |
| Trailing slash на canonical | ❌ drift | По canonical comparison |

### Sitemap / Robots / Indexability

| Check | Result | Notes |
|---|---|---|
| sitemap-index.xml доступен | ✅ | 9 файлов, 1076 URL |
| robots.txt + Sitemap-директива | ✅ | — |
| Indexability roles | ✅ OK | По REPRESENTATIVE_URLS |

### Structured Data

| Check | Result | Notes |
|---|---|---|
| Один BreadcrumbList на страницу | ✅ OK | По representative URLs |
| Валидный JSON-LD | ✅ OK | json.loads() на каждом блоке |

### SeoRoutes ↔ Sitemap Sync

| Check | Result | Notes |
|---|---|---|
| seoRoutes → sitemap | ⚠️ 9 missing | Compile-time vs public sitemap |
| sitemap → seoRoutes | ⚠️ 868 orphan | Допустимы NCH/aux URL |
| Sample HTTP 200 | ✅ | Детерминистическая выборка (50) |
| Sample canonical match | ❌ 1/10 | Первые 10 из выборки |

---

## 5. Representative URL Audit

| URL Type | Sample URL | HTTP | Canonical | Indexability | Schema | Mobile | Result |
|---|---|---|---|---|---|---|---|
| homepage | `/` | 200 | ✅ | ✅ index | ✅ | ✅ | ✅ OK |
| service_hub | `/uslugi/dezinsekciya/` | 200 | ✅ | ✅ index | ✅ | ✅ | ✅ OK |
| pest_page | `/uslugi/dezinsekciya/klopy/` | 200 | ✅ | ✅ index | ✅ | ✅ | ✅ OK |
| object_page | `/uslugi/dezinsekciya/ofisov/` | 200 | ✅ | ✅ index | ✅ | ✅ | ✅ OK |
| moscow_district | `/uslugi/dezinfekciya-cao/` | 200 | ❌ missing | ✅ index | ⚠️ no breadcrumb | ✅ | ❌ FAIL |
| mo_overview | `/moscow-oblast/` | 200 | ✅ | ✅ index | ✅ | ✅ | ✅ OK |
| mo_city | `/moscow-oblast/podolsk/` | 200 | ✅ | ✅ index | ✅ | ✅ | ✅ OK |
| mole_city | `/uslugi/borba-s-krotami/khimki/` | 200 | ✅ | ✅ index | ✅ | ✅ | ✅ OK |
| blog_post | `/blog/klopy-v-kvartire/` | 200 | ✅ | ✅ index | ✅ | ✅ | ✅ OK |
| excluded_page | `/uslugi/sertifikaciya/` | 200 | ✅ | ✅ noindex | ⚠️ no breadcrumb | ✅ | ✅ OK |

---

## 6. Conversion & Analytics

| Check | Result | Notes |
|---|---|---|
| Telegram CTA на главной | ✅ present | — |
| all_conversions composite goal | ⚠️ not in HTML | Может быть в JS-bundle |
| Yandex Metrika counter | ✅ 105828040 | — |
| handle-lead edge function | ⚠️ 500 | Lead flow может быть нарушен |

---

## 7. Performance & Cache

| Check | Result | Notes |
|---|---|---|
| Avg response time (key URLs) | 197 мс | Порог: 3000 мс |
| Largest HTML sample | 131.0 KB | Из representative audit |
| SSL сертификат | ✅ 22.05.2026 | 33 дн. до истечения |
| PageSpeed Insights | unavailable | Источник данных не подключён |
| Bundle size | unavailable | Не измеряется в runtime-мониторе |

---

## 8. Totals & Deltas

| Metric | Current | Previous | Delta |
|---|---:|---:|---:|
| total sitemap URLs | 1076 | 1076 | 0 |
| service URLs | 666 | 666 | 0 |
| blog URLs | 203 | 203 | 0 |
| district URLs | 131 | 131 | 0 |
| MO city URLs | 71 | 71 | 0 |
| mole city URLs | 23 | 23 | 0 |
| representative failures | 1 | 4 | -3 |
| critical alerts | 1 | 6 | -5 |
| warnings | 3 | 3 | 0 |
| avg response time (мс) | 197 | 205 | -8 |

---

## 9. Stop-Conditions

| Stop-condition | Status | Notes |
|---|---|---|
| Canonical drift | ❌ | Сработало — см. Critical Alerts |
| Routing drift (rep URL ≠ 200) | ✅ | OK |
| Sitemap participation drift | ✅ | OK |
| Indexability-role drift | ✅ | OK |
| Duplicate BreadcrumbList | ❌ | Сработало — см. Critical Alerts |
| WhatsApp / brand regression | ✅ | OK |
| Analytics regression | ✅ | OK |
| Conversion regression | ✅ | OK |
| Malformed JSON-LD | ✅ | OK |
| Critical response time breach | ✅ | OK |
| Internal linking leak (/admin) | ✅ | OK |
| SSL expiry < 14 дней | ✅ | OK |

---

## 10. Final Verdict

**Status:** CRITICAL  
**Decision:** NOT SAFE UNTIL FIXED

### Required actions

1. Проверить SEOHead.tsx

---

**Последнее обновление:** 18.04.2026 22:05 MSK
