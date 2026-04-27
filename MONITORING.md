# 🤖 MONITORING.md — goruslugimsk.ru

**Дата:** 27.04.2026 | **Статус:** CRITICAL | **Финальный вердикт:** NOT SAFE UNTIL FIXED

---

## 1. Executive Summary

- Сайт: **ONLINE**
- Build / SSG: **OK**
- Canonical / Sitemap / Indexability: **FAIL**
- Schema: **OK**
- Conversion / Analytics: **OK**
- Performance / Cache: **OK**

### Что изменилось с прошлого запуска

Существенных изменений не обнаружено.

---

## 2. Critical Alerts

| Severity | Check | Problem | Impact | Action |
|---|---|---|---|---|
| CRITICAL | Representative | moscow_district (/uslugi/dezinfekciya-cao/) → HTTP 404 | Шаблон страницы не отдаётся | Проверить роутинг/SSG |
| CRITICAL | Indexability | /blog/klopy-v-kvartire/: должен индексироваться, но noindex | Страница выпадет из индекса | Снять noindex |
| WARNING | Sync | Sample-50: 5 URL ≠ 200 (10%) | Несколько страниц недоступны | Проверить дельту seoRoutes.ts vs deployed build |

---

## 3. Key URL Health

| URL | HTTP | Response Time | Notes |
|---|---|---:|---|
| / | ✅ 200 | 719 мс | — |
| /uslugi/dezinfekciya/ | ✅ 200 | 733 мс | — |
| /uslugi/dezinsekciya/ | ✅ 200 | 662 мс | — |
| /uslugi/deratizaciya/ | ✅ 200 | 805 мс | — |
| /blog/ | ✅ 200 | 731 мс | — |
| /contacts/ | ✅ 200 | 536 мс | — |

---

## 4. Governance Checks

### Routing / Canonical / Trailing Slash

| Check | Result | Notes |
|---|---|---|
| Self-referencing canonical | ✅ OK | 10 representative URLs |
| Trailing slash на canonical | ✅ OK | По canonical comparison |

### Sitemap / Robots / Indexability

| Check | Result | Notes |
|---|---|---|
| sitemap-index.xml доступен | ✅ | 9 файлов, 1077 URL |
| robots.txt + Sitemap-директива | ✅ | — |
| Indexability roles | ❌ 1 drift | По REPRESENTATIVE_URLS |

### Structured Data

| Check | Result | Notes |
|---|---|---|
| Один BreadcrumbList на страницу | ✅ OK | По representative URLs |
| Валидный JSON-LD | ✅ OK | json.loads() на каждом блоке |

### SeoRoutes ↔ Sitemap Sync

| Check | Result | Notes |
|---|---|---|
| seoRoutes → sitemap | ✅ | Compile-time vs public sitemap |
| sitemap → seoRoutes | ⚠️ 868 orphan | Допустимы NCH/aux URL |
| Sample HTTP 200 | ❌ 5/50 | Детерминистическая выборка (50) |
| Sample canonical match | ✅ | Первые 10 из выборки |

---

## 5. Representative URL Audit

| URL Type | Sample URL | HTTP | Canonical | Indexability | Schema | Mobile | Result |
|---|---|---|---|---|---|---|---|
| homepage | `/` | 200 | ✅ | ✅ index | ✅ | ✅ | ✅ OK |
| service_hub | `/uslugi/dezinsekciya/` | 200 | ✅ | ✅ index | ✅ | ✅ | ✅ OK |
| pest_page | `/uslugi/dezinsekciya/klopy/` | 200 | ✅ | ✅ index | ✅ | ✅ | ✅ OK |
| object_page | `/uslugi/dezinsekciya/ofisov/` | 200 | ✅ | ✅ index | ✅ | ✅ | ✅ OK |
| moscow_district | `/uslugi/dezinfekciya-cao/` | 404 | — | — | — | ✅ | ❌ FAIL |
| mo_overview | `/moscow-oblast/` | 200 | ✅ | ✅ index | ✅ | ✅ | ✅ OK |
| mo_city | `/moscow-oblast/podolsk/` | 200 | ✅ | ✅ index | ✅ | ✅ | ✅ OK |
| mole_city | `/uslugi/borba-s-krotami/khimki/` | 200 | ✅ | ✅ index | ✅ | ✅ | ✅ OK |
| blog_post | `/blog/klopy-v-kvartire/` | 200 | ✅ | ❌ noindex | ✅ | ✅ | ❌ FAIL |
| excluded_page | `/uslugi/sertifikaciya/` | 200 | ✅ | ✅ noindex | ✅ | ✅ | ✅ OK |

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
| Avg response time (key URLs) | 697 мс | Порог: 3000 мс |
| Largest HTML sample | 132.2 KB | Из representative audit |
| SSL сертификат | ✅ 21.07.2026 | 85 дн. до истечения |
| PageSpeed Insights | unavailable | Источник данных не подключён |
| Bundle size | unavailable | Не измеряется в runtime-мониторе |

---

## 8. Totals & Deltas

| Metric | Current | Previous | Delta |
|---|---:|---:|---:|
| total sitemap URLs | 1077 | 1077 | 0 |
| service URLs | 667 | 667 | 0 |
| blog URLs | 203 | 203 | 0 |
| district URLs | 131 | 131 | 0 |
| MO city URLs | 71 | 71 | 0 |
| mole city URLs | 24 | 24 | 0 |
| representative failures | 2 | 8 | -6 |
| critical alerts | 2 | 9 | -7 |
| warnings | 1 | 0 | +1 |
| avg response time (мс) | 697 | 745 | -48 |

---

## 9. Stop-Conditions

| Stop-condition | Status | Notes |
|---|---|---|
| Canonical drift | ✅ | OK |
| Routing drift (rep URL ≠ 200) | ❌ | Сработало — см. Critical Alerts |
| Sitemap participation drift | ✅ | OK |
| Indexability-role drift | ❌ | Сработало — см. Critical Alerts |
| Duplicate BreadcrumbList | ✅ | OK |
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

1. Проверить роутинг/SSG
2. Снять noindex

---

**Последнее обновление:** 27.04.2026 11:11 MSK
