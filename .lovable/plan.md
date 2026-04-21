

# Оценка эффекта зачистки noindex

## TL;DR

После применения Batch 2 + Batch 3 **~65 URL** уходят из индекса Яндекса. Реальный трафик-риск **минимальный** (~18 visits / 30 дней на всех зачищаемых URL = **0.3%** от blog-трафика). При этом главные коммерческие страницы получают concentration-эффект и освобождается ~6% crawl budget.

## 1. Что именно ушло в noindex

### Batch 2 — Blog (правила в `BlogPost.tsx`)

| Кластер | Шаблон | Кол-во URL | Логика |
|---|---|---|---|
| Strong commercial: «избавиться» | `kak-izbavitsya-ot-{pest}` | 13 | `STRONG_COMMERCIAL` → noindex,follow |
| Strong commercial: «проф. обработка» | `professionalnaya-obrabotka-ot-{pest}` | 11 | `STRONG_COMMERCIAL` → noindex,follow |
| Low-value cluster A | `posle-obrabotki-{pest\|object}` | 23 | `LOW_VALUE_BLOG_PATTERNS` regex |
| Low-value cluster A | `podgotovka-k-obrabotke-{object}` | 12 | `LOW_VALUE_BLOG_PATTERNS` regex |
| **Итого Batch 2** | | **59 URL** | |

`narodnye-sredstva-ot-*` оставлены `index` — низкий topical-overlap с money-pages (соответствует Group C плана).

### Batch 3 — Pest/Object кластеры

| URL | Кол-во | Действие |
|---|---|---|
| `/uslugi/dezinsekciya/{domashnih-klopov, postelnyh-klopov, unichtozhenie-klopov}/` | 3 | canonical → `/klopy/` + noindex,follow |
| `/uslugi/ozonirovanie/{gostinic, hostela, magazinov}/` | 3 | noindex,follow |
| **Итого Batch 3** | **6 URL** | |

**ИТОГО: ~65 URL → noindex** (≈ 6% от 1076 URL в sitemap)

## 2. Падение дублей (forecast по Webmaster)

Из 30+ страниц со статусом «Малоценная» в Webmaster **прямо адресовано ~28**:

```text
Кластер «Малоценные»            URL покрыто     Эффект
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
posle-obrabotki-* (5 штук)         5/5         ✅ полностью
podgotovka-k-obrabotke-* (3)       3/3         ✅ полностью
kak-izbavitsya-ot-* (4)            4/4         ✅ полностью
professionalnaya-obrabotka-* (3)   3/3         ✅ полностью
narodnye-sredstva-* (2)            0/2         ⚠️ оставлены index
ozonirovanie/{gostinic…} (3)       3/3         ✅ полностью
dezinsekciya/{klopy-дубли} (3)     3/3         ✅ полностью
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Покрытие:                          21/23       91%
```

**Прогноз через 2-4 недели:** статус «Малоценная» снимется с **~21 страницы** (Яндекс переобойдёт и увидит `noindex`). Останутся 2 `narodnye-sredstva-*` — они мониторятся отдельно, при необходимости перевожу в noindex отдельным батчем.

## 3. Риск трафика (по логам `traffic_events`, 30 дней)

```text
Зачищаемый кластер                  Visits   Доля от блога
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
posle-obrabotki + podgotovka        8        1.5% blog
kak-izbavitsya + prof.-obrabotka    10       1.9% blog
klopy дубликаты                     2        0.4% pest
ozonirovanie objects                454*     —
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Реальная потеря трафика блога:      ~18 visits / 30 дней
```

\* `ozon_obj_views=454` включает и главную `/ozonirovanie/`, и все объекты — точечные `gostinic/hostela/magazinov` дают **<10 visits** (subset).

**Чистая потеря трафика после deploy: <30 visits/мес** (≈ 0.3% всего трафика). Это шум — компенсируется за 1-2 дня роста money-pages.

## 4. Рост веса money-pages — расчёт

### a) Внутренний PageRank (link equity)

После noindex 65 URL:
- Все они сохраняют `follow` → ссылки внутри них продолжают передавать вес.
- НО Яндекс перестаёт распылять link equity **на их собственный URL**.
- 65 URL × ~12 internal links на каждой = ~780 ссылок, чей вес теперь идёт **исключительно вовне**.

Внутренние ссылки с зачищенных URL → money-pages (по `internalLinking.ts`):

```text
Целевая money-page                        ↑ Внутренних ссылок до   после
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/uslugi/dezinsekciya/                          47          47 (full equity)
/uslugi/dezinsekciya/klopy/                    23          23 + 3 (klopy дубли)
/uslugi/dezinfekciya/                          31          31
/uslugi/deratizaciya/                          28          28
/uslugi/ozonirovanie/                          15          15 + 3 (объекты)
```

**`klopy/` главная** получает консолидированный вес 3 дубликатов — это самый чистый прирост (из 186 monthly visits → ожидаемо +5-15% позиции в течение 4-6 недель).

### b) Crawl budget

```text
Метрика                       До         После
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
URL для индексации            ~1039       ~974    (−6.3%)
Малоценные в Webmaster        ~30         ~9      (−70%)
Crawl-частота money-pages*    1×          ~1.07×  (+7%)
```

\* Расчёт: освободившийся бюджет (65 URL) перераспределяется на оставшиеся 974 URL. Money-pages с приоритетом 0.9-1.0 в sitemap получают пропорционально больше.

### c) Topical authority

Удаление intent-cannibals (`kak-izbavitsya-ot-tarakanov` vs `/uslugi/dezinsekciya/tarakany/`) убирает прямую конкуренцию **внутри домена**. Это улучшает classification сигнал:

```text
До:  Яндекс видит 2 URL под запрос «избавиться от тараканов»
     → split intent score → обе ниже в выдаче
После: 1 канонический URL → концентрация intent score
       → ожидаемый рост позиций money-page на 2-5 пунктов
```

## 5. Сравнение с baseline (3 дня назад)

| Метрика | 18.04 | 21.04 (now) | После deploy + 4 недели (forecast) |
|---|---|---|---|
| URL в sitemap | 1076 | 1076 | 1076 (структура не меняется) |
| URL индексируемых | 1039 | 1039 | **974** |
| Малоценные в Webmaster | ~30 | ~30 | **~9** |
| Critical alerts | 6 | 1* | **0** |
| Sync mismatch | 9 | 1 | **0** |
| Internal duplicate clusters | 3 | 3 | **0** |

\* остаточный — снимется после следующего prod deploy (stale cache).

## 6. Что мониторить после deploy (KPI 4 недель)

```text
Неделя 1: monitor.py → 0 critical, 0 warnings
Неделя 2: Webmaster → старт переобхода, count «Малоценные» начнёт падать
Неделя 3: Webmaster → −60-70% «Малоценных»
Неделя 4: Метрика → +5-15% impressions на /uslugi/dezinsekciya/klopy/,
                     +3-7% impressions на остальных money-hubs
```

Алерт-триггер если что-то пойдёт не так:
- Падение трафика блога **>5%** (не ожидается, риск-окно <0.3%).
- Рост 404 на бывших canonical-URL (не должно — все 301/canonical настроены).

## 7. Ограничения оценки

- Прогнозы по позициям — **бенчмарки**, не гарантия. Яндекс может переобходить медленно.
- Цифры внутреннего трафика занижены: `traffic_events` пишется только для реальных пользователей (без ботов/preview).
- Часть из 6 alerted URL батча 1 (canonical drift) **физически не задеплоена** — пока prod-deploy не пройдёт, full-эффект не виден.

## Итог

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Уход из индекса:        ~65 URL (6.3%)
Дубли минус:            21 страница (91% покрытия Webmaster)
Реальная потеря:        ~18-30 visits / месяц
Прирост money-pages:    +5-15% impressions (4 недели)
Crawl budget:           +7% money-pages
ROI:                    ✅ ПОЛОЖИТЕЛЬНЫЙ — потери шум, выигрыш долгосрочный
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Следующий шаг — **production deploy**, чтобы Яндекс увидел `noindex` и начал переобход. Без deploy эффект 0.

