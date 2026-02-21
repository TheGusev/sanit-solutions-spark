
# Оптимизация скорости загрузки изображений

## Проблемы сейчас

1. **Hero: 5 фоновых изображений грузятся одновременно** -- все 5 рендерятся в DOM как background-image, даже если видно только одно. Браузер качает все сразу.
2. **Нет preload для первого Hero-фона** -- LCP (Largest Contentful Paint) страдает, потому что браузер узнаёт о первом фоне только после загрузки JS-бандла.
3. **WorkGallery: 17 изображений без IntersectionObserver** -- хотя стоит `loading="lazy"`, сама секция рендерится через lazy-компонент, но все 17 `<img>` появляются в DOM одновременно.
4. **HeroBackground дублирует фон** -- два `<div>` с одной и той же `background-image` (мобильный + десктоп). Браузер может загрузить оба.
5. **Нет `fetchPriority="high"` на критических изображениях** (Hero, hero-cards).
6. **Hero crossfade: все 5 div всегда в DOM** -- даже невидимые изображения рендерятся.

## Решение

### 1. Hero.tsx -- preload первого фона + ленивая загрузка остальных

- Добавить `<link rel="preload">` в `<head>` через React Helmet для первого Hero-фона (home-kitchen.png)
- Рендерить только текущий и следующий слайд (не все 5 сразу)
- Предзагружать следующий слайд через `new Image()` за 1 секунду до перехода

```text
Было: 5 div в DOM, все 5 фонов грузятся сразу
Станет: 1-2 div в DOM, preload первого, prefetch следующего
```

### 2. Hero cards -- fetchPriority="high"

- Три карточки (fast-response, certificates, guarantee) видны above the fold
- Добавить `fetchPriority="high"` через предзагрузку в index.html

### 3. HeroBackground.tsx -- убрать дублирование

- Использовать один `<div>` с CSS media query вместо двух div (md:hidden / hidden md:block)
- Или использовать `<picture>` / CSS-only подход с одним элементом

### 4. WorkGallery.tsx -- прогрессивная загрузка

- Показывать первые 8 элементов, остальные -- по кнопке "Показать ещё" или при скролле
- Видео с `preload="none"` вместо `preload="metadata"` (3 видео -- это тяжело)

### 5. index.html -- preload критических изображений

Добавить в `<head>`:
```html
<link rel="preload" as="image" href="/images/work/home-kitchen.png" fetchpriority="high">
<link rel="preload" as="image" href="/images/hero-cards/fast-response.jpg">
```

### 6. Nginx -- immutable cache уже настроен (OK)

Кеширование изображений на 1 год с immutable уже работает. Это хорошо.

---

## Файлы для изменения

| Файл | Что меняется |
|------|-------------|
| `index.html` | +2 строки preload для Hero-фона и первой hero-card |
| `src/components/Hero.tsx` | Рендерить только текущий + следующий слайд; prefetch следующего через `new Image()` |
| `src/components/HeroBackground.tsx` | Один div вместо двух дублирующих; CSS media query через стили |
| `src/components/WorkGallery.tsx` | `preload="none"` для видео; показ первых 8 элементов + кнопка "ещё" |
| `src/components/ImageGallery.tsx` | Добавить `width`, `height`, `decoding="async"` |

---

## Технические детали

### Hero.tsx -- новая логика ротации

```text
// Вместо рендера всех 5 div:
// 1. Состояние: currentIndex, nextIndex
// 2. useEffect prefetch: new Image().src = HERO_BACKGROUNDS[nextIndex]
// 3. Рендер: только div[currentIndex] (opacity:1) + div[nextIndex] (opacity:0, готов к переходу)
// 4. При смене: nextIndex становится currentIndex, новый nextIndex = (current+1) % length
```

### WorkGallery.tsx -- прогрессивная загрузка

```text
// 1. const [showAll, setShowAll] = useState(false)
// 2. const visibleItems = showAll ? mediaItems : mediaItems.slice(0, 8)
// 3. Видео: preload="none" (загружаются только при воспроизведении)
// 4. Кнопка "Показать все работы" внизу
```

### HeroBackground.tsx -- один элемент

```text
// Вместо двух div (mobile + desktop):
// Один div с CSS custom properties:
// --blur: blur(8px) на desktop, blur(6px) на mobile (через @media в className)
// --opacity: 0.30 на desktop, 0.45 на mobile
// Tailwind: blur-[var(--hero-blur)] -- не работает, используем inline style + matchMedia
// Проще: оставить два div, но добавить loading="lazy" через IntersectionObserver
// => Оптимальное решение: один div + CSS @media через style tag
```

## Ожидаемый результат

- LCP улучшится на 300-500ms (preload первого Hero-фона)
- Начальная загрузка страницы: вместо ~25 изображений одновременно -- 5-6 критических
- Видео не грузятся до взаимодействия (экономия ~5-15MB трафика)
- TTI (Time to Interactive) улучшится за счёт меньшей нагрузки на сеть
