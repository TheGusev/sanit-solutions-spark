

# Phase 9.1: E-E-A-T аудит + ItemList JSON-LD для кластеров

Батч 10 полностью выполнен. Переходим к двум оставшимся задачам из вашего сообщения.

---

## Задача 1: E-E-A-T аудит и улучшения

Три доработки для усиления сигналов авторства:

### 1a. Ссылка с AuthorBadge на /team

Сейчас `AuthorBadge` показывает имя автора как простой текст. Нужно превратить его в ссылку на `/team#author-{authorId}`, чтобы поисковые боты связали автора статьи с его профилем на странице команды.

- Файл: `src/components/blog/AuthorBadge.tsx`
- Добавить проп `authorId?: string`
- Обернуть имя в `<Link to="/team#author-{authorId}">`
- Добавить `id` якоря на карточки в `Team.tsx`

### 1b. Author в Article JSON-LD уже на месте

В `StructuredData.tsx` генератор `generateArticle` уже включает `author: { @type: Person, name, jobTitle, worksFor }`. Это корректно.

### 1c. CitationBlock -- без изменений

Компонент `CitationBlock` уже рендерит `<cite>` с названиями законов (СанПиН, ФЗ). Дополнительных правок не требуется.

---

## Задача 2: ItemList JSON-LD на страницах блога

Добавить `ItemList` разметку на главную страницу блога (`/blog`) и при фильтрации по категориям, чтобы Яндекс видел кластерную структуру.

### Что делаем

- Файл: `src/pages/Blog.tsx`
- Добавить `<StructuredData type="ItemList" />` с динамическим списком статей текущей страницы/категории
- Компонент `StructuredData` уже поддерживает тип `ItemList` (генератор `generateItemList` есть в коде)

### Пример JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Статьи блога: Вредители",
  "description": "Экспертные статьи о борьбе с вредителями",
  "numberOfItems": 14,
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "url": "https://goruslugimsk.ru/blog/klopy-v-kvartire", "name": "Клопы в квартире" }
  ]
}
```

---

## Технические детали

### Изменяемые файлы

| Файл | Действие |
|------|----------|
| `src/components/blog/AuthorBadge.tsx` | Добавить ссылку на /team#authorId |
| `src/pages/Team.tsx` | Добавить id-якоря на карточки авторов |
| `src/pages/Blog.tsx` | Добавить ItemList JSON-LD |

### Порядок выполнения

1. Обновить `AuthorBadge` -- ссылка на /team
2. Добавить якоря в `Team.tsx`
3. Добавить `ItemList` JSON-LD в `Blog.tsx`

