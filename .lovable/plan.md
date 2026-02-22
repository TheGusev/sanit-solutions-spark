

# Вернуть ротацию 2 фоновых изображений на главной

## Что было сломано

Ранее Hero на главной странице чередовал 2 фоновых изображения с плавным переходом:
- `moscow-panorama-sunset.jpg`
- `moscow-park-fountains.jpg`

Это было заменено на одно статическое изображение (строка 12: `const HERO_BACKGROUND`). Нужно вернуть ротацию.

## Что будет сделано

**Файл: `src/components/Hero.tsx`**

1. Заменить `HERO_BACKGROUND` (одно фото) на массив из 2 фото:
   ```
   const HERO_BACKGROUNDS = [
     '/images/backgrounds/moscow-panorama-sunset.jpg',
     '/images/backgrounds/moscow-park-fountains.jpg'
   ];
   ```

2. Добавить `useState` для текущего индекса фона и `useEffect` с `setInterval` (каждые 6 секунд) для автоматической смены.

3. Рендерить оба изображения одновременно с абсолютным позиционированием, переключая `opacity` (0 или 1) с CSS transition (`transition-opacity duration-1000`) для плавного перехода.

4. Оверлей и параллакс остаются без изменений.

## Никакие другие файлы не затрагиваются
