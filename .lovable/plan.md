
# Исправление видимости фонов и скорости загрузки

## Проблема 1: Фон не виден

Сейчас `HeroBackground` использует:
- `opacity: 0.30` по умолчанию (изображение видно лишь на 30%)
- Поверх наложен тяжёлый градиент: `from-background/60 via-background/40 to-background/30`
- В итоге фото практически невидимо

На скриншотах блога и других страниц -- сплошной тёмный/светлый фон без изображения.

### Решение

| Параметр | Было | Станет |
|----------|------|--------|
| `opacity` по умолчанию | 0.30 | 0.55 |
| `opacityMobile` расчёт | `opacity + 0.15` | `opacity + 0.10` |
| Gradient overlay | `from-background/60 via-background/40 to-background/30` | `from-background/40 via-background/20 to-background/15` |
| Bottom gradient | `from-background/20 via-transparent to-background/50` | `from-background/10 via-transparent to-background/30` |

Также повысить opacity в конкретных вызовах:
- `BlogPost.tsx`: opacity 0.30 -> 0.50
- `Blog.tsx`: opacity 0.38 -> 0.55
- `DistrictHero.tsx`: opacity 0.52 -> 0.60

## Проблема 2: Медленная загрузка изображений

Большие PNG-файлы (часто 1-5MB каждый) загружаются медленно. Основные причины:
- PNG-формат для фотографий -- неэффективен (нужен JPEG/WebP)
- Нет ресайза -- полноразмерные фото отдаются как есть
- `filter: blur()` на крупных изображениях -- нагрузка на GPU
- Hero-карточки загружают 3 фоновых изображения через `background-image` (нет `loading="lazy"`)

### Решение

1. **Уменьшить blur** для снижения GPU-нагрузки: blur по умолчанию 8 -> 4px (на фоне с повышенной opacity blur не так нужен)

2. **Hero карточки** -- убрать тяжёлые background-image из карточек, заменить на CSS-градиент или использовать `<img loading="lazy">` внутри карточек вместо `background-image`

3. **WorkGallery видео** -- убедиться, что `autoPlay` не стоит на видео с `preload="none"` (конфликт: autoPlay заставляет браузер загружать видео несмотря на preload=none). Решение: убрать `autoPlay` и показывать превью-картинку, воспроизводить по наведению/клику

4. **Оптимизировать размер `transform: scale(1.1)`** -- убрать из HeroBackground, это заставляет GPU рендерить на 21% больше пикселей

## Файлы для изменения

| Файл | Изменения |
|------|-----------|
| `src/components/HeroBackground.tsx` | Повысить opacity по умолчанию до 0.55, уменьшить blur до 4, облегчить gradient overlay, убрать scale(1.1) |
| `src/pages/BlogPost.tsx` | opacity 0.30 -> 0.50, blur 12 -> 6 |
| `src/pages/Blog.tsx` | opacity 0.38 -> 0.55, blur 10 -> 5 |
| `src/components/district/DistrictHero.tsx` | opacity 0.52 -> 0.60 |
| `src/components/Hero.tsx` | Hero-карточки: заменить background-image на `<img>` с loading="lazy" для не-первой карточки |
| `src/components/WorkGallery.tsx` | Убрать autoPlay с видео (конфликт с preload="none"), добавить воспроизведение по hover |

## Техническая детализация

### HeroBackground.tsx -- новые значения

```text
opacity: 0.30 -> 0.55
blur: 8 -> 4
mobileBlur: blur - 2 -> blur - 1  (чтобы мобильный blur не был слишком мал)
mobileOpacity: opacity + 0.15 -> opacity + 0.10
gradient overlay: значительно облегчить
убрать transform: scale(1.1) -- экономия GPU
```

### WorkGallery.tsx -- видео по hover

```text
// Вместо autoPlay + preload="none" (конфликт):
// - Показывать poster/thumbnail
// - При hover: video.play()
// - При mouseleave: video.pause()
// Это предотвратит загрузку 3 видео при открытии страницы
```

## Ожидаемый результат

- Фоновые изображения будут чётко видны на всех страницах (блог, районы, услуги)
- Снижение GPU-нагрузки на ~30% (меньше blur, нет scale)
- Видео не загружаются до взаимодействия (экономия 5-15MB)
- Общее ускорение загрузки страниц
