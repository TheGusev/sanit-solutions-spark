# 🤖 MONITORING.md — goruslugimsk.ru

**Дата:** 20.06.2026 | **Статус:** CRITICAL | **Финальный вердикт:** NOT SAFE UNTIL FIXED

---

## 1. Executive Summary

- Сайт: **DOWN**
- Build / SSG: **FAIL**
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
| CRITICAL | Site Health | / недоступен (HTTPSConnectionPool(host='goruslugimsk.ru', port=443): Max retries exceeded with url: / (Caused by ConnectTimeoutError(<HTTPSConnection(host='goruslugimsk.ru', port=443) at 0x7f99a293d150>, 'Connection to goruslugimsk.ru timed out. (connect timeout=15)'))) | Страница не отвечает | Проверить инфраструктуру/CDN |
| CRITICAL | Site Health | /uslugi/dezinfekciya/ недоступен (HTTPSConnectionPool(host='goruslugimsk.ru', port=443): Max retries exceeded with url: /uslugi/dezinfekciya/ (Caused by NewConnectionError("HTTPSConnection(host='goruslugimsk.ru', port=443): Failed to establish a new connection: [Errno 111] Connection refused"))) | Страница не отвечает | Проверить инфраструктуру/CDN |
| CRITICAL | Site Health | /uslugi/dezinsekciya/ недоступен (HTTPSConnectionPool(host='goruslugimsk.ru', port=443): Max retries exceeded with url: /uslugi/dezinsekciya/ (Caused by NewConnectionError("HTTPSConnection(host='goruslugimsk.ru', port=443): Failed to establish a new connection: [Errno 111] Connection refused"))) | Страница не отвечает | Проверить инфраструктуру/CDN |
| CRITICAL | Site Health | /uslugi/deratizaciya/ недоступен (HTTPSConnectionPool(host='goruslugimsk.ru', port=443): Max retries exceeded with url: /uslugi/deratizaciya/ (Caused by NewConnectionError("HTTPSConnection(host='goruslugimsk.ru', port=443): Failed to establish a new connection: [Errno 111] Connection refused"))) | Страница не отвечает | Проверить инфраструктуру/CDN |
| CRITICAL | Site Health | /blog/ недоступен (HTTPSConnectionPool(host='goruslugimsk.ru', port=443): Max retries exceeded with url: /blog/ (Caused by NewConnectionError("HTTPSConnection(host='goruslugimsk.ru', port=443): Failed to establish a new connection: [Errno 111] Connection refused"))) | Страница не отвечает | Проверить инфраструктуру/CDN |
| CRITICAL | Site Health | /contacts/ недоступен (HTTPSConnectionPool(host='goruslugimsk.ru', port=443): Max retries exceeded with url: /contacts/ (Caused by NewConnectionError("HTTPSConnection(host='goruslugimsk.ru', port=443): Failed to establish a new connection: [Errno 111] Connection refused"))) | Страница не отвечает | Проверить инфраструктуру/CDN |
| CRITICAL | Sitemap | sitemap-index.xml → HTTP 0 | Поисковики не получат список карт | Проверить SSG-пайплайн |
| CRITICAL | Robots | robots.txt → HTTP 502 | Поисковики не получат правила краулинга | Проверить статику |
| CRITICAL | Representative | homepage (/) → HTTP 502 | Шаблон страницы не отдаётся | Проверить роутинг/SSG |
| CRITICAL | Sync | 209 путей из seoRoutes.ts отсутствуют в sitemap (пример: /, /blog/, /contacts/, /moscow-oblast/, /moscow-oblast/balashikha/) | Compile-time расходится с public sitemap | Проверить SSG-пайплайн / vite-plugin-sitemap.ts |
| WARNING | SSL | Не удалось проверить сертификат: timed out | Неизвестное состояние SSL | Проверить вручную |

---

## 3. Key URL Health

| URL | HTTP | Response Time | Notes |
|---|---|---:|---|
| / | ❌ 0 | 15322 мс | FAIL |
| /uslugi/dezinfekciya/ | ❌ 0 | 11653 мс | FAIL |
| /uslugi/dezinsekciya/ | ❌ 0 | 537 мс | FAIL |
| /uslugi/deratizaciya/ | ❌ 0 | 426 мс | FAIL |
| /blog/ | ❌ 0 | 202 мс | FAIL |
| /contacts/ | ❌ 0 | 354 мс | FAIL |

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
| sitemap-index.xml доступен | ❌ | 0 файлов, 0 URL |
| robots.txt + Sitemap-директива | ❌ | — |
| Indexability roles | ✅ OK | По REPRESENTATIVE_URLS |

### Structured Data

| Check | Result | Notes |
|---|---|---|
| Один BreadcrumbList на страницу | ✅ OK | По representative URLs |
| Валидный JSON-LD | ✅ OK | json.loads() на каждом блоке |

### SeoRoutes ↔ Sitemap Sync

| Check | Result | Notes |
|---|---|---|
| seoRoutes → sitemap | ⚠️ 209 missing | Compile-time vs public sitemap |
| sitemap → seoRoutes | ✅ | Допустимы NCH/aux URL |
| Sample HTTP 200 | ✅ | Детерминистическая выборка (0) |
| Sample canonical match | ✅ | Первые 10 из выборки |

---

## 5. Representative URL Audit

| URL Type | Sample URL | HTTP | Canonical | Indexability | Schema | Mobile | Result |
|---|---|---|---|---|---|---|---|
| homepage | `/` | 502 | — | — | — | ❌ | ❌ FAIL |
| service_hub | `/uslugi/dezinsekciya/` | 200 | ✅ | ✅ index | ✅ | ✅ | ✅ OK |
| pest_page | `/uslugi/dezinsekciya/klopy/` | 200 | ✅ | ✅ index | ✅ | ✅ | ✅ OK |
| object_page | `/uslugi/dezinsekciya/ofisov/` | 200 | ✅ | ✅ index | ✅ | ✅ | ✅ OK |
| moscow_district | `/uslugi/dezinfekciya-cao/` | 200 | ✅ | ✅ index | ✅ | ✅ | ✅ OK |
| mo_overview | `/moscow-oblast/` | 200 | ✅ | ✅ index | ✅ | ✅ | ✅ OK |
| mo_city | `/moscow-oblast/podolsk/` | 200 | ✅ | ✅ index | ✅ | ✅ | ✅ OK |
| mole_city | `/uslugi/borba-s-krotami/khimki/` | 200 | ✅ | ✅ index | ✅ | ✅ | ✅ OK |
| blog_post | `/blog/klopy-v-kvartire/` | 200 | ✅ | ✅ index | ✅ | ✅ | ✅ OK |
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
| Avg response time (key URLs) | 0 мс | Порог: 3000 мс |
| Largest HTML sample | 122.1 KB | Из representative audit |
| SSL сертификат | ⚠️ check failed | timed out |
| PageSpeed Insights | unavailable | Источник данных не подключён |
| Bundle size | unavailable | Не измеряется в runtime-мониторе |

---

## 8. Totals & Deltas

| Metric | Current | Previous | Delta |
|---|---:|---:|---:|
| total sitemap URLs | 0 | 0 | 0 |
| service URLs | 0 | 0 | 0 |
| blog URLs | 0 | 0 | 0 |
| district URLs | 0 | 0 | 0 |
| MO city URLs | 0 | 0 | 0 |
| mole city URLs | 0 | 0 | 0 |
| representative failures | 1 | 10 | -9 |
| critical alerts | 10 | 21 | -11 |
| warnings | 1 | 1 | 0 |
| avg response time (мс) | 0 | 0 | 0 |

---

## 9. Stop-Conditions

| Stop-condition | Status | Notes |
|---|---|---|
| Canonical drift | ✅ | OK |
| Routing drift (rep URL ≠ 200) | ❌ | Сработало — см. Critical Alerts |
| Sitemap participation drift | ❌ | Сработало — см. Critical Alerts |
| Indexability-role drift | ✅ | OK |
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

1. Проверить инфраструктуру/CDN
2. Проверить SSG-пайплайн
3. Проверить статику
4. Проверить роутинг/SSG
5. Проверить SSG-пайплайн / vite-plugin-sitemap.ts

---

**Последнее обновление:** 20.06.2026 11:45 MSK
