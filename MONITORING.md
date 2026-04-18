# 🤖 MONITORING.md — goruslugimsk.ru

**Дата:** 18.04.2026 | **Статус:** CRITICAL | **Финальный вердикт:** NOT SAFE UNTIL FIXED

---

## 1. Executive Summary

- Сайт: **ONLINE**
- Build / SSG: **OK**
- Canonical / Sitemap / Indexability: **FAIL**
- Schema: **FAIL**
- Conversion / Analytics: **OK**
- Performance / Cache: **OK**

### Что изменилось с прошлого запуска

- sitemap URLs: 1079 → 1076 (-3)
- Появились критичные алерты: 6

---

## 2. Critical Alerts

| Severity | Check | Problem | Impact | Action |
|---|---|---|---|---|
| CRITICAL | Representative | object_page (/uslugi/dezinsekciya/kvartira/) → HTTP 404 | Шаблон страницы не отдаётся | Проверить роутинг/SSG |
| CRITICAL | Canonical | /rajony/cao/: canonical = https://goruslugimsk.ru/ | Canonical drift — конфликт с маршрутом | Сверить с seoRoutes.ts |
| CRITICAL | Representative | mole_city (/uslugi/borba-s-krotami/khimki/) → HTTP 404 | Шаблон страницы не отдаётся | Проверить роутинг/SSG |
| CRITICAL | Schema | /blog/klopy-v-kvartire/: 2 BreadcrumbList | Дубликаты разметки | Использовать единый источник |
| CRITICAL | Indexability | /uslugi/sertifikaciya/: должен быть noindex, но открыт | Утечка excluded-страницы в индекс | Поставить noindex |
| CRITICAL | Internal Linking | Найдено 2 ссылок на /admin/ без rel=nofollow | Утечка веса в utility-зону | Добавить rel='nofollow' или убрать ссылки |
| WARNING | Schema | /rajony/cao/: BreadcrumbList отсутствует | Снижение видимости в SERP | Добавить разметку |
| WARNING | Schema | /uslugi/sertifikaciya/: BreadcrumbList отсутствует | Снижение видимости в SERP | Добавить разметку |

---

## 3. Key URL Health

| URL | HTTP | Response Time | Notes |
|---|---|---:|---|
| / | ✅ 200 | 469 мс | — |
| /uslugi/dezinfekciya/ | ✅ 200 | 194 мс | — |
| /uslugi/dezinsekciya/ | ✅ 200 | 200 мс | — |
| /uslugi/deratizaciya/ | ✅ 200 | 213 мс | — |
| /blog/ | ✅ 200 | 200 мс | — |
| /contacts/ | ✅ 200 | 156 мс | — |

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
| sitemap-index.xml доступен | ✅ | 9 файлов, 1076 URL |
| robots.txt + Sitemap-директива | ✅ | — |
| Indexability roles | ❌ 1 drift | По REPRESENTATIVE_URLS |

### Structured Data

| Check | Result | Notes |
|---|---|---|
| Один BreadcrumbList на страницу | ❌ 1 drift | По representative URLs |
| Валидный JSON-LD | ✅ OK | json.loads() на каждом блоке |

---

## 5. Representative URL Audit

| URL Type | Sample URL | HTTP | Canonical | Indexability | Schema | Mobile | Result |
|---|---|---|---|---|---|---|---|
| homepage | `/` | 200 | ✅ | ✅ index | ✅ | ✅ | ✅ OK |
| service_hub | `/uslugi/dezinsekciya/` | 200 | ✅ | ✅ index | ✅ | ✅ | ✅ OK |
| pest_page | `/uslugi/dezinsekciya/klopy/` | 200 | ✅ | ✅ index | ✅ | ✅ | ✅ OK |
| object_page | `/uslugi/dezinsekciya/kvartira/` | 404 | — | — | — | ✅ | ❌ FAIL |
| moscow_district | `/rajony/cao/` | 200 | ⚠️ mismatch | ✅ index | ⚠️ no breadcrumb | ✅ | ✅ OK |
| mo_overview | `/moscow-oblast/` | 200 | ✅ | ✅ index | ✅ | ✅ | ✅ OK |
| mo_city | `/moscow-oblast/podolsk/` | 200 | ✅ | ✅ index | ✅ | ✅ | ✅ OK |
| mole_city | `/uslugi/borba-s-krotami/khimki/` | 404 | — | — | — | ✅ | ❌ FAIL |
| blog_post | `/blog/klopy-v-kvartire/` | 200 | ✅ | ✅ index | ❌ 2× BreadcrumbList | ✅ | ❌ FAIL |
| excluded_page | `/uslugi/sertifikaciya/` | 200 | ✅ | ❌ index | ⚠️ no breadcrumb | ✅ | ❌ FAIL |

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
| Avg response time (key URLs) | 238 мс | Порог: 3000 мс |
| Largest HTML sample | 131.0 KB | Из representative audit |
| SSL сертификат | ✅ 22.05.2026 | 33 дн. до истечения |
| PageSpeed Insights | unavailable | Источник данных не подключён |
| Bundle size | unavailable | Не измеряется в runtime-мониторе |

---

## 8. Totals & Deltas

| Metric | Current | Previous | Delta |
|---|---:|---:|---:|
| total sitemap URLs | 1076 | 1079 | -3 |
| service URLs | 666 | — | — |
| blog URLs | 203 | — | — |
| district URLs | 131 | — | — |
| MO city URLs | 71 | — | — |
| mole city URLs | 23 | — | — |
| representative failures | 4 | — | — |
| critical alerts | 6 | — | — |
| warnings | 2 | — | — |
| avg response time (мс) | 238 | — | — |

---

## 9. Stop-Conditions

| Stop-condition | Status | Notes |
|---|---|---|
| Canonical drift | ❌ | Сработало — см. Critical Alerts |
| Routing drift (rep URL ≠ 200) | ❌ | Сработало — см. Critical Alerts |
| Sitemap participation drift | ✅ | OK |
| Indexability-role drift | ❌ | Сработало — см. Critical Alerts |
| Duplicate BreadcrumbList | ❌ | Сработало — см. Critical Alerts |
| WhatsApp / brand regression | ✅ | OK |
| Analytics regression | ✅ | OK |
| Conversion regression | ✅ | OK |
| Malformed JSON-LD | ✅ | OK |
| Critical response time breach | ✅ | OK |
| Internal linking leak (/admin) | ❌ | Сработало — см. Critical Alerts |
| SSL expiry < 14 дней | ✅ | OK |

---

## 10. Final Verdict

**Status:** CRITICAL  
**Decision:** NOT SAFE UNTIL FIXED

### Required actions

1. Проверить роутинг/SSG
2. Сверить с seoRoutes.ts
3. Использовать единый источник
4. Поставить noindex
5. Добавить rel='nofollow' или убрать ссылки

---

**Последнее обновление:** 18.04.2026 21:35 MSK
