
# Замена фоновых фото на главной странице

## Что меняется

В `src/components/Hero.tsx` массив `HERO_BACKGROUNDS` содержит два фото для ротации:
- `/images/work/hero-bed-spray.png` -- заменить на фото специалиста с распылителем у кровати
- `/images/work/hero-bathroom.png` -- заменить на фото специалиста с обработкой на участке

## Шаги

1. Скопировать загруженные фото в `public/images/work/`:
   - `photo_2026-02-23_23-06-38.jpg` --> `public/images/work/hero-bed-spray.jpg`
   - `photo_2026-02-23_23-06-44.jpg` --> `public/images/work/hero-outdoor-treatment.jpg`

2. Обновить массив `HERO_BACKGROUNDS` в `src/components/Hero.tsx`:
   ```
   const HERO_BACKGROUNDS = [
     '/images/work/hero-bed-spray.jpg',
     '/images/work/hero-outdoor-treatment.jpg'
   ];
   ```

## Файлы

| Файл | Изменение |
|---|---|
| `public/images/work/hero-bed-spray.jpg` | Новое фото (копия загруженного) |
| `public/images/work/hero-outdoor-treatment.jpg` | Новое фото (копия загруженного) |
| `src/components/Hero.tsx` | Обновить пути в массиве `HERO_BACKGROUNDS` |
