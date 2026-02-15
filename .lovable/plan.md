
# Day 1: Удаление AggregateRating из Schema

## Изменение

**Файл:** `src/components/StructuredData.tsx`

Удалить строки 241-247 — блок `aggregateRating` из функции `generateLocalBusiness`. Запятая после `geo` блока (строка 240) тоже корректируется.

**До:**
```typescript
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '55.7558',
    longitude: '37.6173'
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '347',
    bestRating: '5',
    worstRating: '1'
  }
});
```

**После:**
```typescript
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '55.7558',
    longitude: '37.6173'
  }
});
```

## Проверка после изменений

1. View Source на 3 страницах — JSON-LD валидный, без `aggregateRating`
2. Canonical на каждой странице указывает на саму себя
3. Никакие другие файлы не затронуты

## URL для переобхода

1. `https://goruslugimsk.ru/`
2. `https://goruslugimsk.ru/uslugi/dezinfekciya/`
3. `https://goruslugimsk.ru/uslugi/dezinsekciya/`
4. `https://goruslugimsk.ru/uslugi/deratizaciya/`
5. `https://goruslugimsk.ru/contacts/`
6. `https://goruslugimsk.ru/blog/borba-s-tarakanami/`
7. `https://goruslugimsk.ru/blog/klopy-v-kvartire/`

## Риски

Нулевой. Удаление фиктивного рейтинга улучшает compliance с Google.
