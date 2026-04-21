

# Анализ индексации + план фикса алертов мониторинга

## Что показал глубокий аудит

### 1. CRITICAL мониторинг (canonical drift) — РЕАЛЬНАЯ ПРИЧИНА

Production отдаёт **stale кэш static HTML** для district-страниц (`Last-Modified: Sat, 18 Apr 2026`), хотя в репозитории файл `public/uslugi/dezinfekciya-cao/index.html` **уже содержит** правильный canonical (строка 8) и `BreadcrumbList` (строки 26-36).

То есть **код уже исправлен**, не задеплоен.

### 2. WARNING `khimki` отсутствует в sitemap

`vite-plugin-sitemap.ts` уже импортирует `moleCities` (строка 4), но production sitemap всё ещё старый (без `khimki`). Та же причина: stale deploy.

### 3. ГЛАВНАЯ ПРОБЛЕМА (она важнее алертов мониторинга): «Малоценная или маловостребованная страница» в Яндекс.Вебмастере

Из скриншотов видно ~30+ страниц помечены как **малоценные**:

| Тип страниц | Примеры | Текущий статус |
|---|---|---|
| `/blog/posle-obrabotki-*` (5 шт) | домов, мол, офисов, ресторанов, производств | 745-776 слов, `index, follow` |
| `/blog/professionalnaya-obrabotka-ot-*` (3) | клопы, моль, тараканы | 956-963 слов, `index, follow` |
| `/blog/kak-izbavitsya-ot-*` (4) | мыши, тараканы, моль, крысы | 1085-1097 слов, `index, follow` |
| `/blog/podgotovka-k-obrabotke-*` (3) | домов, офисов, складов | малоценные |
| `/blog/narodnye-sredstva-*` (2) | муравьи, тараканы | малоценные |
| `/uslugi/ozonirovanie/{gostinic,hostela,magazinov}` | объекты-NCH | малоценные |
| `/uslugi/dezinsekciya/{domashnih-klopov,postelnyh-klopov,unichtozhenie-klopov}` | дубликаты-кластера клопов | малоценные |

Что общего: **высокий topical overlap** — все эти URL семантически почти идентичны коммерческим pest/object-страницам и/или друг другу. Яндекс считает их thin/duplicate относительно money-pages.

## План исправления (3 батча)

### Батч 1 — Деплой (закрывает все 3 алерта мониторинга)

Цель: сбросить stale-кэш и задеплоить уже готовые в репозитории фиксы.

- Подтвердить что в репозитории актуальны:
  - `public/uslugi/dezinfekciya-cao/index.html` с canonical + BreadcrumbList ✅ (проверено)
  - `vite-plugin-sitemap.ts` импортирует `moleCities` ✅ (проверено)
- Триггернуть production deploy (Docker rebuild + push)
- После деплоя — повторный прогон `monitor.py`

Ожидаемо: статус STABLE, 0 critical, 0 warnings.

### Батч 2 — Защита от «малоценных» блог-страниц (consolidation strategy)

Группа A — **`posle-obrabotki-*` (5 страниц)** и **`podgotovka-k-obrabotke-*` (3)**: 
- Это сильнейший topical overlap между собой (одна тема, разные объекты).
- Решение: добавить в `BlogPost.tsx` автоматический `noindex, follow` для слагов из этих двух групп → канонический трафик уйдёт на pillar-статью «после обработки» / «подготовка к обработке».
- Если pillar-статьи нет — создаётся одна агрегирующая статья со ссылками на под-объекты (внутри одной статьи, не отдельные URL).

Группа B — **`kak-izbavitsya-ot-{tarakany,klopy,krysy,myshi,mol}` (5)** и **`professionalnaya-obrabotka-ot-*` (3)**:
- Прямой intent-overlap с коммерческими `/uslugi/dezinsekciya/{pest}/`.
- Решение: расширить `COMMERCIAL_MARKERS` в `BlogPost.tsx` (строки 38-40) — добавить русские триггеры «избавиться», «вывести», «уничтожить», «профессиональная обработка». Эти статьи получат `noindex` через `hasCommercialOverlap()`.

Группа C — **`narodnye-sredstva-*`**: 
- Народная тема, но низкий коммерческий потенциал. Оставить `index`, но добавить явный disambiguation в title («народные методы — что работает в 2026»).

### Батч 3 — Зачистка thin pest/object-кластеров

- `/uslugi/dezinsekciya/{domashnih-klopov, postelnyh-klopov, unichtozhenie-klopov}` — это 3 URL про **одних и тех же клопов**. Каноникал на `/uslugi/dezinsekciya/klopy/` (главная pest-страница).
- `/uslugi/ozonirovanie/{gostinic, hostela, magazinov}` — переместить в noindex Tier 2 (по политике `nch-indexing-and-quality-policy`), они дублируют главную ozonirovanie + object-страницы.

Всё через RouteResolver или canonical-override без правок `seoRoutes.ts`.

## Файлы которые буду править

- `src/pages/BlogPost.tsx` — расширение `COMMERCIAL_MARKERS` + новый список `LOW_VALUE_BLOG_PATTERNS` для авто-noindex
- `src/pages/ServiceSubpage.tsx` или `ServicePestPage.tsx` — canonical-override для дубликатов клопов
- `src/pages/ServiceObjectPage.tsx` — noindex для ozonirovanie-объектов

## Что НЕ трогаю

- `src/lib/seoRoutes.ts` (core lockdown) — URL остаются, меняется только индексируемость
- Sitemap structure (структура остаётся, noindex обрабатывается через robots meta)
- Контент статей — только мета

## Проверка после внедрения

1. `monitor.py` → STABLE без алертов
2. Production curl на 5 обновлённых блог-страниц → `noindex` в robots meta
3. Production curl на dezinsekciya pest-дубликаты → canonical = `/klopy/`
4. Через 2-3 недели в Yandex Webmaster → массовое снятие статуса «Малоценная»

## Очередь применения

1. Сначала **Батч 1 (deploy)** — мгновенный фикс мониторинга
2. Потом **Батч 2 (blog noindex)** — основная зачистка (~13 URL уйдут из Малоценных)
3. Потом **Батч 3 (pest/object cleanup)** — финальная зачистка дубликатов

## Deliverable

После внедрения: 0 алертов мониторинга + ~30 URL снимутся со статуса «Малоценная» в Яндексе в течение 2-4 недель, что освободит crawl budget и поднимет вес money-pages.

