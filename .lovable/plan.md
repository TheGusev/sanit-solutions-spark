

## Plan: Точное соответствие мобильной версии блога референсу

### Файл: `src/pages/Blog.tsx`

Сравнивая текущий код с референсом, нужны 2 небольших правки:

**1. Карточки категорий — название и счётчик в одну строку**
Сейчас: emoji → название (строка 1) → "X статей" (строка 2).
На референсе: emoji → "Все (316)" в одну строку.

Заменить двухстрочный layout внутри кнопки категории (lines 160-164) на однострочный:
```tsx
<span className="text-sm md:text-base font-semibold truncate">
  {category} ({count})
</span>
```
Убрать вложенный `<div>` с отдельным счётчиком.

**2. Карточки статей — добавить иконку часов перед временем чтения**
На референсе видна иконка ⏱ перед "5 мин чтения". Добавить `Clock` из lucide-react (lines 192-194):
```tsx
<span className="text-xs text-muted-foreground flex items-center gap-1">
  <Clock className="w-3 h-3" /> {post.readTime}
</span>
```

**Не трогаем:** SEO, JSON-LD, фильтрацию, grid layout категорий, список постов, CTA, header/footer.

