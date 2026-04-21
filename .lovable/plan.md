

# Отправка ~65 обновлённых URL на переобход через IndexNow

## Что сделаю

Запущу IndexNow-пуш для всех URL, у которых после Batch 2+3 изменилась индексируемость (`noindex` или canonical override). Это даст Яндексу сигнал переобойти их в течение 1-3 дней вместо ожидания органического crawl (2-4 недели).

## Какие URL отправлю (~65)

### Batch 2 — Blog noindex (59 URL)

```text
/blog/kak-izbavitsya-ot-{tarakanov,klopov,krys,myshey,moli,...}/      (13)
/blog/professionalnaya-obrabotka-ot-{klopov,moli,tarakanov,...}/      (11)
/blog/posle-obrabotki-{domov,ofisov,restoranov,proizvodstv,moli,...}/ (23)
/blog/podgotovka-k-obrabotke-{domov,ofisov,skladov,...}/              (12)
```

### Batch 3 — Pest/Object cleanup (6 URL)

```text
/uslugi/dezinsekciya/domashnih-klopov/
/uslugi/dezinsekciya/postelnyh-klopov/
/uslugi/dezinsekciya/unichtozhenie-klopov/
/uslugi/ozonirovanie/gostinic/
/uslugi/ozonirovanie/hostela/
/uslugi/ozonirovanie/magazinov/
```

### Bonus — Money-pages, получившие consolidation-эффект (5 URL)

Чтобы Яндекс быстрее увидел рост релевантности:

```text
/uslugi/dezinsekciya/klopy/
/uslugi/dezinsekciya/tarakany/
/uslugi/deratizaciya/krysy/
/uslugi/dezinsekciya/
/uslugi/ozonirovanie/
```

## Как это работает

1. Создам одноразовый скрипт `scripts/reindex-cleanup-batch.mjs`, который:
   - Собирает список URL из `LOW_VALUE_BLOG_PATTERNS` + `STRONG_COMMERCIAL` блогов через сканирование `src/data/blog/*` (динамически, без хардкода).
   - Добавляет 6 URL Batch 3 + 5 money-pages.
   - Шлёт батчем через существующий IndexNow endpoint Яндекса (`yandex.com/indexnow`), используя ключ из `.env` (тот же, что используется в `scripts/send-indexnow-stateless.mjs`).
2. Запущу скрипт через `code--exec`.
3. Покажу отчёт: сколько URL отправлено, какой HTTP-статус от Яндекса.

## Важное предупреждение

IndexNow только **уведомляет** Яндекс — он переобойдёт URL и **только тогда** увидит `noindex`. Условие: production должен быть **уже задеплоен** с новыми мета-тегами.

Если деплой ещё не прошёл — Яндекс переобойдёт старую версию (без `noindex`) и эффект будет нулевым. Проверю `Last-Modified` 2-3 целевых URL до отправки и предупрежу если deploy stale.

## Что НЕ трогаю

- `seoRoutes.ts`, sitemap, мета — только отправка пуша.
- IndexNow ключ — переиспользую существующий.

## Deliverable

- Скрипт `scripts/reindex-cleanup-batch.mjs` (можно перезапускать).
- Отчёт: `Sent: 70 URLs → Yandex IndexNow → 200 OK`.
- Предупреждение если production stale.

