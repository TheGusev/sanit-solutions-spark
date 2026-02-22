

# Замена фонов главной на 4 новых фото

## Что будет сделано

1. Скопировать 4 загруженных фото в `public/images/work/`:
   - `hero-fog-living.png` (обработка гостиной туманом)
   - `hero-bed-spray.png` (обработка кровати)
   - `hero-bathroom.png` (обработка ванной)
   - `hero-kitchen.png` (обработка кухни)

2. Обновить массив `HERO_BACKGROUNDS` в `src/components/Hero.tsx` — заменить 3 старых фото на 4 новых. Ротация каждые 6 секунд останется.

## Технические детали

**Файл: `src/components/Hero.tsx`**

Заменить:
```typescript
const HERO_BACKGROUNDS = [
  '/images/work/specialist-closeup.jpg',
  '/images/work/fog-generator.jpg',
  '/images/work/clean-room.jpg'
];
```

На:
```typescript
const HERO_BACKGROUNDS = [
  '/images/work/hero-fog-living.png',
  '/images/work/hero-bed-spray.png',
  '/images/work/hero-bathroom.png',
  '/images/work/hero-kitchen.png'
];
```

Остальной код Hero (ротация, параллакс, оверлей, CTA) не меняется.

