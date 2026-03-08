

## Plan: Редизайн категорий блога в стиле «книжных карточек»

### Что меняем
Только визуальное представление категорий на странице `/blog/` — заменяем мелкие chips на крупные тапабельные карточки-«папки». Логика фильтрации, данные, SEO/LLM-разметка, header/footer — без изменений.

### Файл: `src/pages/Blog.tsx`

**1. Категории — карточки вместо chips (lines 145-169)**

Заменяем `flex flex-wrap` с `Button` на grid-layout с карточками:

- **Mobile**: `grid-cols-2` — 2 колонки крупных карточек с иконкой (emoji), названием и счётчиком
- **Tablet/Desktop**: `md:grid-cols-3 lg:grid-cols-4` — 3-4 колонки

Каждая карточка:
- Округлённые углы (`rounded-xl`), мягкий фон (`bg-muted/50`, активная — `bg-primary text-primary-foreground`)
- Слева emoji из существующего `categoryIcons`, справа — название + count
- Высота ~60px для удобного тапа на мобильном
- `hover:bg-muted` для десктопа
- Вызывает тот же `setSelectedCategory` + `setVisibleCount(30)`

**2. Стиль активной карточки**
- `bg-primary text-primary-foreground` — выделяет выбранную категорию
- Неактивные: `bg-card border border-border` — нейтральный вид в обеих темах

**3. Без изменений:**
- Hero-блок (breadcrumbs, заголовок, subtitle, триколор)
- Список постов, их карточки, badges, пагинация
- CTA-секция, Footer
- SEO meta, StructuredData, JSON-LD
- Категории, их порядок и счётчики
- Логика фильтрации и сортировки

