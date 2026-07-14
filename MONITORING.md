# 🤖 MONITORING.md — goruslugimsk.ru

**Дата:** 14.07.2026 | **Статус:** CRITICAL | **Финальный вердикт:** NOT SAFE UNTIL FIXED

---

## 1. Executive Summary

- Сайт: **DOWN**
- Build / SSG: **FAIL**
- Canonical / Sitemap / Indexability: **FAIL**
- Schema: **OK**
- Conversion / Analytics: **FAIL**
- Performance / Cache: **OK**

### Что изменилось с прошлого запуска

Существенных изменений не обнаружено.

---

## 2. Critical Alerts

| Severity | Check | Problem | Impact | Action |
|---|---|---|---|---|
| CRITICAL | Site Health | / недоступен (HTTPSConnectionPool(host='goruslugimsk.ru', port=443): Max retries exceeded with url: / (Caused by SSLError(SSLCertVerificationError(1, "[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: Hostname mismatch, certificate is not valid for 'goruslugimsk.ru'. (_ssl.c:1016)")))) | Страница не отвечает | Проверить инфраструктуру/CDN |
| CRITICAL | Site Health | /uslugi/dezinfekciya/ недоступен (HTTPSConnectionPool(host='goruslugimsk.ru', port=443): Max retries exceeded with url: /uslugi/dezinfekciya/ (Caused by SSLError(SSLCertVerificationError(1, "[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: Hostname mismatch, certificate is not valid for 'goruslugimsk.ru'. (_ssl.c:1016)")))) | Страница не отвечает | Проверить инфраструктуру/CDN |
| CRITICAL | Site Health | /uslugi/dezinsekciya/ недоступен (HTTPSConnectionPool(host='goruslugimsk.ru', port=443): Max retries exceeded with url: /uslugi/dezinsekciya/ (Caused by SSLError(SSLCertVerificationError(1, "[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: Hostname mismatch, certificate is not valid for 'goruslugimsk.ru'. (_ssl.c:1016)")))) | Страница не отвечает | Проверить инфраструктуру/CDN |
| CRITICAL | Site Health | /uslugi/deratizaciya/ недоступен (HTTPSConnectionPool(host='goruslugimsk.ru', port=443): Max retries exceeded with url: /uslugi/deratizaciya/ (Caused by SSLError(SSLCertVerificationError(1, "[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: Hostname mismatch, certificate is not valid for 'goruslugimsk.ru'. (_ssl.c:1016)")))) | Страница не отвечает | Проверить инфраструктуру/CDN |
| CRITICAL | Site Health | /blog/ недоступен (HTTPSConnectionPool(host='goruslugimsk.ru', port=443): Max retries exceeded with url: /blog/ (Caused by SSLError(SSLCertVerificationError(1, "[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: Hostname mismatch, certificate is not valid for 'goruslugimsk.ru'. (_ssl.c:1016)")))) | Страница не отвечает | Проверить инфраструктуру/CDN |
| CRITICAL | Site Health | /contacts/ недоступен (HTTPSConnectionPool(host='goruslugimsk.ru', port=443): Max retries exceeded with url: /contacts/ (Caused by SSLError(SSLCertVerificationError(1, "[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: Hostname mismatch, certificate is not valid for 'goruslugimsk.ru'. (_ssl.c:1016)")))) | Страница не отвечает | Проверить инфраструктуру/CDN |
| CRITICAL | Sitemap | sitemap-index.xml → HTTP 0 | Поисковики не получат список карт | Проверить SSG-пайплайн |
| CRITICAL | Robots | robots.txt → HTTP 0 | Поисковики не получат правила краулинга | Проверить статику |
| CRITICAL | Representative | homepage (/) → HTTP 0 | Шаблон страницы не отдаётся | Проверить роутинг/SSG |
| CRITICAL | Representative | service_hub (/uslugi/dezinsekciya/) → HTTP 0 | Шаблон страницы не отдаётся | Проверить роутинг/SSG |
| CRITICAL | Representative | pest_page (/uslugi/dezinsekciya/klopy/) → HTTP 0 | Шаблон страницы не отдаётся | Проверить роутинг/SSG |
| CRITICAL | Representative | object_page (/uslugi/dezinsekciya/ofisov/) → HTTP 0 | Шаблон страницы не отдаётся | Проверить роутинг/SSG |
| CRITICAL | Representative | moscow_district (/uslugi/dezinfekciya-cao/) → HTTP 0 | Шаблон страницы не отдаётся | Проверить роутинг/SSG |
| CRITICAL | Representative | mo_overview (/moscow-oblast/) → HTTP 0 | Шаблон страницы не отдаётся | Проверить роутинг/SSG |
| CRITICAL | Representative | mo_city (/moscow-oblast/podolsk/) → HTTP 0 | Шаблон страницы не отдаётся | Проверить роутинг/SSG |
| CRITICAL | Representative | mole_city (/uslugi/borba-s-krotami/khimki/) → HTTP 0 | Шаблон страницы не отдаётся | Проверить роутинг/SSG |
| CRITICAL | Representative | blog_post (/blog/klopy-v-kvartire/) → HTTP 0 | Шаблон страницы не отдаётся | Проверить роутинг/SSG |
| CRITICAL | Representative | excluded_page (/uslugi/sertifikaciya/) → HTTP 0 | Шаблон страницы не отдаётся | Проверить роутинг/SSG |
| CRITICAL | Conversion | На главной нет Telegram CTA | Потеря канала конверсии | Проверить FloatingButtons.tsx |
| CRITICAL | Analytics | Метрика 105828040 не найдена на главной | Полная потеря аналитики | Восстановить счётчик |
| CRITICAL | Sync | 209 путей из seoRoutes.ts отсутствуют в sitemap (пример: /, /blog/, /contacts/, /moscow-oblast/, /moscow-oblast/balashikha/) | Compile-time расходится с public sitemap | Проверить SSG-пайплайн / vite-plugin-sitemap.ts |
| WARNING | SSL | Не удалось проверить сертификат: [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: Hostname mismatch, certificate is not valid for 'goruslugimsk.ru'. (_ssl.c:1016) | Неизвестное состояние SSL | Проверить вручную |

---

## 3. Key URL Health

| URL | HTTP | Response Time | Notes |
|---|---|---:|---|
| / | ❌ 0 | 636 мс | FAIL |
| /uslugi/dezinfekciya/ | ❌ 0 | 444 мс | FAIL |
| /uslugi/dezinsekciya/ | ❌ 0 | 600 мс | FAIL |
| /uslugi/deratizaciya/ | ❌ 0 | 446 мс | FAIL |
| /blog/ | ❌ 0 | 309 мс | FAIL |
| /contacts/ | ❌ 0 | 274 мс | FAIL |

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
| homepage | `/` | 0 | — | — | — | ❌ | ❌ FAIL |
| service_hub | `/uslugi/dezinsekciya/` | 0 | — | — | — | ❌ | ❌ FAIL |
| pest_page | `/uslugi/dezinsekciya/klopy/` | 0 | — | — | — | ❌ | ❌ FAIL |
| object_page | `/uslugi/dezinsekciya/ofisov/` | 0 | — | — | — | ❌ | ❌ FAIL |
| moscow_district | `/uslugi/dezinfekciya-cao/` | 0 | — | — | — | ❌ | ❌ FAIL |
| mo_overview | `/moscow-oblast/` | 0 | — | — | — | ❌ | ❌ FAIL |
| mo_city | `/moscow-oblast/podolsk/` | 0 | — | — | — | ❌ | ❌ FAIL |
| mole_city | `/uslugi/borba-s-krotami/khimki/` | 0 | — | — | — | ❌ | ❌ FAIL |
| blog_post | `/blog/klopy-v-kvartire/` | 0 | — | — | — | ❌ | ❌ FAIL |
| excluded_page | `/uslugi/sertifikaciya/` | 0 | — | — | — | ❌ | ❌ FAIL |

---

## 6. Conversion & Analytics

| Check | Result | Notes |
|---|---|---|
| Telegram CTA на главной | ❌ missing | Проверить FloatingButtons.tsx |
| all_conversions composite goal | ⚠️ not in HTML | Может быть в JS-bundle |
| Yandex Metrika counter | ❌ missing | Проверить index.html |
| handle-lead edge function | ⚠️ 500 | Lead flow может быть нарушен |

---

## 7. Performance & Cache

| Check | Result | Notes |
|---|---|---|
| Avg response time (key URLs) | 0 мс | Порог: 3000 мс |
| Largest HTML sample | 0 KB | Из representative audit |
| SSL сертификат | ⚠️ check failed | [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: Hostname mismatch, certificate is not valid for 'goruslugimsk.ru'. (_ssl.c:1016) |
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
| representative failures | 10 | 10 | 0 |
| critical alerts | 21 | 21 | 0 |
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
| Analytics regression | ❌ | Сработало — см. Critical Alerts |
| Conversion regression | ❌ | Сработало — см. Critical Alerts |
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
5. Проверить FloatingButtons.tsx

---

**Последнее обновление:** 14.07.2026 10:50 MSK
