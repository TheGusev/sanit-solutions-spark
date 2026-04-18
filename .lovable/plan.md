

User wants a complete rewrite of the daily monitoring system. The current `scripts/monitor.py` produces a noisy, broken report (mojibake H1s, fake PSI=0, no governance checks, no stop-conditions). They want a proper Daily Governance Reporter aligned with the project's service-system architecture.

Let me check current state quickly.

I have enough context from MONITORING.md (visible in original prompt) and the workflow file. The current script produces:
- Garbled Cyrillic in H1 samples (encoding bug)
- Fake PSI=0 / LCP=0 (placeholder zeros)
- No canonical/sitemap/schema/indexability governance checks
- No representative URL audit with proper templates
- No stop-conditions
- No conversion/analytics check
- No internal linking leak detection
- Noisy "семантическое ядро" block daily

# Daily Governance Monitoring — Полная переработка

## Что делаю

Полностью переписываю `scripts/monitor.py` под спецификацию Daily Governance Reporter. Workflow `.github/workflows/monitoring.yml` оставляю — он рабочий, меняется только содержимое скрипта и формат `MONITORING.md`.

## Архитектура нового скрипта

Один файл `scripts/monitor.py`, разбит на модули внутри:

```
1. fetch_url(url)          → (status, time_ms, html, headers)
2. check_site_health()     → 8 ключевых URL, реальные UTF-8 H1
3. check_sitemap()         → парсинг XML, индексируемость, redirecting URLs
4. check_governance()      → canonical = route = sitemap, trailing slash
5. check_structured_data() → BreadcrumbList count, FAQPage validation, AggregateRating dupes
6. check_indexability()    → noindex leakage, sertifikaciya isolation
7. check_internal_linking()→ admin/utility leak detection в HTML
8. check_representative()  → 10 URL-types согласно спеке
9. check_conversion()      → handle-lead ping (HEAD), telegram_click presence
10. check_pricing()        → grep "1000₽" / "1500₽" mismatch detection
11. compare_with_previous()→ diff vs .monitoring-cache.json
12. evaluate_stop_conditions() → 12 правил CRITICAL
13. render_markdown()      → строго по шаблону user'а
```

## Ключевые исправления текущих багов

| Баг | Решение |
|---|---|
| Mojibake H1 (битая кодировка) | `response.encoding = 'utf-8'` явно + `BeautifulSoup(html, 'lxml')` с правильным charset |
| Fake PSI=0 / LCP=0 | Если нет валидного API ответа → `unavailable`, не `0` |
| Шумный семантический блок | Убран из daily, оставлен только delta vs previous |
| Случайная гео-выборка с битой кодировкой | Заменена на детерминистическую выборку 10 URL-типов |
| Нет governance checks | Добавлены 6 разделов checks |
| Нет stop-conditions | Добавлен блок 12 правил CRITICAL |
| Нет representative URL audit | Добавлен полный 10-pattern audit |

## Representative URL Set (фиксированный)

```python
REPRESENTATIVE_URLS = [
    ('homepage',       'https://goruslugimsk.ru/'),
    ('service_hub',    'https://goruslugimsk.ru/uslugi/dezinsekciya/'),
    ('pest_page',      'https://goruslugimsk.ru/uslugi/dezinsekciya/klopy/'),
    ('object_page',    'https://goruslugimsk.ru/uslugi/dezinsekciya/kvartira/'),
    ('moscow_district','https://goruslugimsk.ru/rajony/cao/'),
    ('mo_overview',    'https://goruslugimsk.ru/moscow-oblast/'),
    ('mo_city',        'https://goruslugimsk.ru/moscow-oblast/podolsk/'),
    ('mole_city',      'https://goruslugimsk.ru/uslugi/borba-s-krotami/khimki/'),
    ('blog_post',      'https://goruslugimsk.ru/blog/klopy-v-kvartire/'),
    ('excluded_page',  'https://goruslugimsk.ru/uslugi/sertifikaciya/'),
]
```

Для каждого: HTTP, canonical match, robots meta, H1 presence, BreadcrumbList count, schema integrity, mobile viewport meta.

## Stop-Conditions Engine

12 правил из спеки. Каждое проверяется автоматически:
- redirecting URLs in sitemap (grep 301)
- noindex page in sitemap (cross-check)
- duplicate BreadcrumbList на любой rep URL (count > 1)
- missing canonical
- canonical mismatch (canonical != fetched URL)
- WhatsApp regression (grep wa.me в HTML)
- /admin/ links без `rel="nofollow"`
- sertifikaciya без noindex
- любая rep URL отдаёт ≠200
- response time > 3000ms на критичных URL
- bundle drift > 30% (если данные есть)
- analytics regression (telegram_click counter == 0 если был >0)

Любое срабатывание → `Status: CRITICAL`, `Decision: NOT SAFE UNTIL FIXED`.

## Cache & Deltas

Расширенный `.monitoring-cache.json`:
```json
{
  "date": "2026-04-18",
  "sitemap_total": 1289,
  "service_urls": 668,
  "blog_urls": 204,
  "district_urls": 131,
  "mo_city_urls": 71,
  "mole_city_urls": 24,
  "rep_failures": 0,
  "critical_alerts": 0,
  "warnings": 0,
  "avg_response_ms": 834,
  "bundle_size_kb": null,
  "stop_conditions_triggered": []
}
```

## Output: MONITORING.md

Строго по шаблону пользователя (10 секций). Без шума:
- ✅ Если всё OK — короткие однострочники
- ⚠️ Если есть warnings — только реальные
- 🚨 Если CRITICAL — только проблемные строки в алертах

## Интеграция с workflow

`.github/workflows/monitoring.yml` — без изменений (он уже работает). Скрипт сохраняет тот же путь `scripts/monitor.py` и генерирует те же артефакты (`MONITORING.md`, `.monitoring-cache.json`).

## Зависимости

В workflow уже установлены `requests` и `beautifulsoup4`. Добавлю `lxml` для надёжного UTF-8 парсинга:
```yaml
pip install requests beautifulsoup4 lxml
```

## Файлы

- `scripts/monitor.py` — полная переработка (~600 строк, читаемые модули)
- `.github/workflows/monitoring.yml` — добавить `lxml` в pip install
- `MONITORING.md` — будет автоматически перегенерирован при следующем запуске
- `.monitoring-cache.json` — расширенная схема, обратно совместимая (старые поля сохраняются)

## Что НЕ трогаю

- Workflow расписание (03:00 UTC daily)
- Telegram alerts через secrets
- core SSG/routing/sitemap logic
- existing memory standards

## Verification после фиксов

1. Запустить `python scripts/monitor.py` локально (через code--exec)
2. Проверить MONITORING.md: все 10 секций присутствуют, кодировка UTF-8 корректна, нет fake zeros
3. Проверить cache: новые поля записаны
4. Проверить stop-conditions: на текущем live-сайте должно быть `STABLE` (после Batch 1+2+3 фиксов)
5. Симулировать CRITICAL: временно проверить sertifikaciya — если noindex стоит, должен пройти

## Deliverable

Один полностью функциональный скрипт + первый чистый MONITORING.md прогон + обновлённый workflow. После этого ежедневный мониторинг работает автоматически без ручного вмешательства.

