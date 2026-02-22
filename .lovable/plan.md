
# Установить blur=1 для всех фото на сайте

## Что будет сделано

Изменить дефолтное значение blur в компоненте `HeroBackground.tsx`:
- `blur = 4` --> `blur = 1`
- `mobileBlur` формула `Math.max(blur - 1, 2)` --> `Math.max(blur - 1, 0)` (чтобы при blur=1 мобильный blur был 0, а не 2)

Это один файл, одна правка. Все места, которые уже передают `blur={1}` явно (DistrictHero, MoscowRegionCityPage), продолжат работать как раньше. Остальные места, которые используют дефолт, автоматически получат blur=1.

## Технические детали

**Файл:** `src/components/HeroBackground.tsx`

Строка 19: `blur = 4` --> `blur = 1`
Строка 27: `Math.max(blur - 1, 2)` --> `Math.max(blur - 1, 0)`
