

# Mobile-First доработки блога (Editorial UI)

## Что уже сделано (не требует изменений)
- Typography plugin подключен и работает
- BlogPost: чистый текстовый заголовок без фонового изображения
- BlogPost: sticky TOC на десктопе, аккордеон на мобилках
- BlogPost: TLDRBlock с иконкой молнии
- Blog: свайп-пилюли категорий с иконками
- Blog: карточки с тенями

## Что нужно доработать

### 1. BlogPost.tsx -- улучшить prose-стили контента
Текущие prose-классы задают стили вручную. Нужно:
- Добавить `prose-slate` для приятного цвета текста (slate-800 вместо черного)
- Убедиться что `leading-relaxed` и межабзацные отступы работают корректно
- Строка ~217: заменить длинный набор `prose-*` классов на более чистый `prose prose-lg prose-slate max-w-none prose-headings:scroll-mt-28`

### 2. TLDRBlock.tsx -- обновить дизайн по ТЗ
Текущий: `border-primary bg-muted/50`
Нужно по ТЗ: `bg-blue-50 border-blue-500 dark:bg-blue-950/30 dark:border-blue-400`
- Убрать буллет-поинты, заменить на абзацы
- Файл: `src/components/blog/TLDRBlock.tsx`

### 3. Blog.tsx -- сортировка топ-статей выше
Добавить массив `topFeaturedSlugs` с самыми важными статьями (гайды, законы) и выводить их первыми в отфильтрованном списке.
- Файл: `src/pages/Blog.tsx`
- Логика: featured статьи сортируются в начало массива `filteredPosts`

### 4. Blog.tsx -- убрать лишние рамки с карточек
Текущий: `hover:shadow-lg hover:shadow-russia-red/10`
Нужно: убрать border у Card, оставить `shadow-sm hover:shadow-md` для чистоты

## Технические детали

### Файлы для изменения
1. `src/pages/BlogPost.tsx` -- prose-классы (строка ~217)
2. `src/components/blog/TLDRBlock.tsx` -- дизайн карточки
3. `src/pages/Blog.tsx` -- сортировка + стили карточек

### Что НЕ меняется
- `tailwind.config.ts` (typography уже подключен)
- `src/components/Hero.tsx` (не относится к блогу)
- `src/components/TableOfContents.tsx` (sticky уже работает)
- Структура данных статей

