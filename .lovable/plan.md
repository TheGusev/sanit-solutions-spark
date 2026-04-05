

# AggregateRating на pest pages с реальными данными из reviews

## Что делаем

Добавляем `AggregateRating` в существующую Service schema на каждой pest page (`/uslugi/dezinsekciya/klopy`, `/uslugi/deratizaciya/krysy` и т.д.). Рейтинг рассчитывается из реальных отзывов в таблице `reviews` (approved), с fallback на статические данные из `src/data/reviews.ts` для SSR.

## Изменения

### Файл 1: `src/pages/ServicePestPage.tsx`

1. Импортировать `staticReviews` из `@/data/reviews` и `supabase` из `@/lib/supabaseClient`
2. Добавить `useEffect` + `useState` для загрузки approved reviews из БД (client-side), с fallback на `staticReviews`
3. Вычислить `ratingValue` и `reviewCount` из загруженных отзывов
4. Расширить существующий `schemaMarkup` (строки 74-95) — добавить `aggregateRating` блок:

```typescript
const avgRating = reviews.length > 0
  ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
  : '4.9';
const reviewCount = reviews.length || staticReviews.length;

const schemaMarkup = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: `Уничтожение ${pest.genitive}`,
  // ...existing fields...
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: avgRating,
    reviewCount: reviewCount,
    bestRating: 5,
    worstRating: 1
  }
};
```

Важно: для SSR (первый рендер) используются `staticReviews` — бот всегда видит рейтинг. На клиенте данные обновляются из БД.

## Результат

- Все pest pages получают `AggregateRating` в JSON-LD
- Рейтинг основан на реальных approved отзывах из БД
- SSR fallback гарантирует что бот видит разметку без JS
- Один файл изменяется, ~15 строк кода

