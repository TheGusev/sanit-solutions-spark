

# Исправление SEO-ошибок с owndev.ru

## Анализ 7 замечаний

| # | Проблема | Реальная? | Решение |
|---|----------|-----------|---------|
| 1 | 2 изображения без alt | ❌ Ложная | Трекинг-пиксели (Яндекс, VK) — пустой alt корректен по HTML-спеку |
| 2 | Нет og:image | ✅ Да | IndexSSR.tsx не устанавливает og:image, а generateIndexMetadata() не передаёт ogImage |
| 3 | Нет BreadcrumbList | ⚠️ Опционально | На главной BreadcrumbList с 1 элементом «Главная» — добавим для полноты |
| 4 | Description 167 симв. | ✅ Да | IndexSSR.tsx: 167 символов, нужно сократить до 150 |
| 5 | Закрыта в robots.txt | ❌ Ложная | owndev видимо ходит как заблокированный бот. `User-agent: *` имеет `Allow: /` |
| 6-7 | Title не релевантен | ✅ Да | IndexSSR.tsx title не содержит все ключевые услуги |

## Что будем делать

### 1. `src/pages/IndexSSR.tsx` — исправить title, description, добавить og:image

**Title**: заменить на тот же что в client-версии:
`Дезинфекция, дезинсекция, дератизация в Москве — от 1000₽ | Санитарные Решения`

**Description**: сократить до ~150 символов:
`СЭС служба в Москве: дезинфекция, дезинсекция, дератизация. Лицензия Роспотребнадзора. Гарантия до 3 лет. Выезд за 15 минут.`

**og:image**: добавить тег с URL существующего OG-изображения из index.html.

### 2. `src/lib/metadata.ts` → `generateIndexMetadata()` — добавить ogImage

Добавить `ogImage` в параметры, чтобы React Helmet тоже устанавливал og:image.

**Description** в metadata.ts тоже укоротить до ~150 символов для консистентности.

### 3. `src/pages/Index.tsx` — добавить BreadcrumbList schema

Добавить простую BreadcrumbList JSON-LD с одним элементом «Главная» в schema metadata.

### 4. Не трогаем

- `robots.txt` — всё корректно, ложная тревога
- Трекинг-пиксели — пустой alt правильный
- `index.html` — OG-теги там уже есть, они работают для SSG

## Файлы

| Действие | Файл |
|----------|------|
| Изменить | `src/pages/IndexSSR.tsx` — title, description, og:image |
| Изменить | `src/lib/metadata.ts` — ogImage + сократить description |
| Изменить | `src/pages/Index.tsx` — BreadcrumbList через metadata schema |

