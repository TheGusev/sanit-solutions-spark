

# Ротация фонов Hero: оставить только 2 и 3

## Изменение

В файле `src/components/Hero.tsx` массив `HERO_BACKGROUNDS` содержит 4 изображения:

1. `/images/work/hero-fog-living.png` -- удалить
2. `/images/work/hero-bed-spray.png` -- оставить
3. `/images/work/hero-bathroom.png` -- оставить
4. `/images/work/hero-kitchen.png` -- удалить

После изменения останется только 2 фото, которые будут чередоваться каждые 6 секунд.

## Файл

| Файл | Изменение |
|---|---|
| `src/components/Hero.tsx` | Убрать строки 1 и 4 из массива `HERO_BACKGROUNDS` |

