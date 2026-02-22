
# Вернуть правильные фоновые фото на главной

## Проблема
На главной стоят фото панорам Москвы (moscow-panorama-sunset.jpg, moscow-park-fountains.jpg), а должны быть фото работы специалистов из папки `work`.

## Что будет сделано

**Файл: `src/components/Hero.tsx`**

Заменить массив `HERO_BACKGROUNDS` на 3 фото из папки work:

```typescript
const HERO_BACKGROUNDS = [
  '/images/work/specialist-closeup.jpg',
  '/images/work/fog-generator.jpg',
  '/images/work/clean-room.jpg'
];
```

Ротация каждые 6 секунд и плавный переход останутся без изменений.

Больше ничего не меняется.
