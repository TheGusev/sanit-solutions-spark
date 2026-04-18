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

Существенных изменений не обнаружено.

---

## 2. Critical Alerts

| Severity | Check | Problem | Impact | Action |
|---|---|---|---|---|
| CRITICAL | Canonical | /uslugi/dezinfekciya-cao/: отсутствует canonical | Нарушение SEO-стандарта | Проверить SEOHead.tsx |
| CRITICAL | Representative | mole_city (/uslugi/borba-s-krotami/khimki/) → HTTP 404 | Шаблон страницы не отдаётся | Проверить роутинг/SSG |
| CRITICAL | Schema | /blog/klopy-v-kvartire/: 2 BreadcrumbList | Дубликаты разметки | Использовать единый источник |
| CRITICAL | Indexability | /uslugi/sertifikaciya/: должен быть noindex, но открыт | Утечка excluded-страницы в индекс | Поставить noindex |
| CRITICAL | Internal Linking | Найдено 1 уникальных ссылок на /admin/ без rel=nofollow: /admin/login | Утечка веса в utility-зону | Добавить rel='nofollow' или убрать ссылки |
| CRITICAL | Sync | Sample-10 canonical mismatch: 3 страниц | Canonical drift на нескольких страницах | Проверить SEOHead / SPA fallback |
| WARNING | Schema | /uslugi/dezinfekciya-cao/: BreadcrumbList отсутствует | Снижение видимости в SERP | Добавить разметку |
| WARNING | Schema | /uslugi/sertifikaciya/: BreadcrumbList отсутствует | Снижение видимости в SERP | Добавить разметку |
| WARNING | Sync | 14 путей из seoRoutes.ts отсутствуют в sitemap (пример: /moscow-oblast/korolev/, /moscow-oblast/korolev/deratizaciya/, /moscow-oblast/korolev/dezinfekciya/, /moscow-oblast/korolev/dezinsekciya/, /moscow-oblast/korolev/ozonirovanie/) | Compile-time расходится с public sitemap | Проверить SSG-пайплайн / vite-plugin-sitemap.ts |

---

## 3. Key URL Health

| URL | HTTP | Response Time | Notes |
|---|---|---:|---|
| / | ✅ 200 | 188 мс | — |
| /uslugi/dezinfekciya/ | ✅ 200 | 189 мс | — |
| /uslugi/dezinsekciya/ | ✅ 200 | 193 мс | — |
| /uslugi/deratizaciya/ | ✅ 200 | 320 мс | — |
| /blog/ | ✅ 200 | 196 мс | — |
| /contacts/ | ✅ 200 | 148 мс | — |

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
| Indexability roles | ❌ 1 drift | По REPRESENTATIVE_URLS |

### Structured Data

| Check | Result | Notes |
|---|---|---|
| Один BreadcrumbList на страницу | ❌ 1 drift | По representative URLs |
| Валидный JSON-LD | ✅ OK | json.loads() на каждом блоке |

### SeoRoutes ↔ Sitemap Sync

| Check | Result | Notes |
|---|---|---|
| seoRoutes → sitemap | ⚠️ 14 missing | Compile-time vs public sitemap |
| sitemap → seoRoutes | ⚠️ 873 orphan | Допустимы NCH/aux URL |
| Sample HTTP 200 | ✅ | Детерминистическая выборка (50) |
| Sample canonical match | ❌ 3/10 | Первые 10 из выборки |

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
| Avg response time (key URLs) | 205 мс | Порог: 3000 мс |
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
| representative failures | 4 | 4 | 0 |
| critical alerts | 6 | 6 | 0 |
| warnings | 3 | 2 | +1 |
| avg response time (мс) | 205 | 238 | -33 |

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

1. Проверить SEOHead.tsx
2. Проверить роутинг/SSG
3. Использовать единый источник
4. Поставить noindex
5. Добавить rel='nofollow' или убрать ссылки

---

**Последнее обновление:** 18.04.2026 21:48 MSK
