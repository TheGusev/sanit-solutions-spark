
# Убрать blur полностью для всех фото

## Что будет сделано

Изменить дефолтное значение blur в `src/components/HeroBackground.tsx`:
- `blur = 1` --> `blur = 0`

Формула `mobileBlur` уже корректна: `Math.max(0 - 1, 0)` = `0`.

Одна строка, один файл.
