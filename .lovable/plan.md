

# Добавить маппинг борьбы с кротами в PATHNAME_SLUG_MAP

## Изменение

В `src/lib/analytics.ts` добавить одну строку в `PATHNAME_SLUG_MAP`:

```
'/uslugi/borba-s-krotami': 'kroty',
```

Это покроет и основную страницу, и все гео-лендинги (`/uslugi/borba-s-krotami/istra/` и т.д.) благодаря существующей логике `startsWith` в `getYmGoalPrefix()`.

## Файл

| Файл | Действие |
|------|----------|
| `src/lib/analytics.ts` | Добавить `'/uslugi/borba-s-krotami': 'kroty'` в `PATHNAME_SLUG_MAP` (после строки с `/uslugi/deratizaciya/kroty`) |

## Результат

Все квиз-заявки со страниц борьбы с кротами будут трекаться как `quiz_lead_kroty` вместо `quiz_lead_general`.

