

# Вынос данных SERVICE_GALLERY в отдельный файл

## Что делаем

Переносим константы `SERVICE_GALLERY` и `subtitleMap` из `ServicePage.tsx` в новый файл данных, оставляя в компоненте только рендеринг.

## Файлы

| Файл | Действие |
|------|----------|
| `src/data/serviceGallery.ts` | **Создать** — экспорт типа `GalleryItem`, константы `SERVICE_GALLERY` и `GALLERY_SUBTITLES` |
| `src/pages/ServicePage.tsx` | Удалить строки 301–331 (данные), добавить импорт из `@/data/serviceGallery`, использовать импортированные константы в строках 323–331 |

## Новый файл `src/data/serviceGallery.ts`

```typescript
export type GalleryItem = {
  src: string;
  title: string;
  desc: string;
  badge: string;
  badgeColor: string;
};

export const SERVICE_GALLERY: Record<string, GalleryItem[]> = {
  'borba-s-krotami': [...],
  'dezinsekciya': [...],
  'deratizaciya': [...],
  'dezinfekciya': [...],
};

export const GALLERY_SUBTITLES: Record<string, string> = {
  'borba-s-krotami': 'Реальные фото...',
  // ...
};
```

## Изменение в `ServicePage.tsx`

Строки 300–331 (IIFE с данными) заменяются на:
```typescript
import { SERVICE_GALLERY, GALLERY_SUBTITLES } from '@/data/serviceGallery';
// ...
const galleryItems = SERVICE_GALLERY[service.slug];
const subtitle = GALLERY_SUBTITLES[service.slug] || '';
```

Рендеринг (строки 333–362) остаётся без изменений.

