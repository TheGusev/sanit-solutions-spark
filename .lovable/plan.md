

## Plan: Обновить статические HTML-файлы услуг — добавить «и МО»

Предыдущие правки затронули только React-компоненты (`src/data/services.ts`, `ServicePage.tsx`). Но в `public/uslugi/` лежат **5 статических HTML-файлов** основных услуг, которые поисковики индексируют напрямую — в них до сих пор написано «в Москве» без «и МО».

Дубль цены уже удалён из `ServicePage.tsx`. В статических HTML дубля нет.

### Файлы для правки

| Файл | Что менять |
|---|---|
| `public/uslugi/dezinfekciya/index.html` | title, og:title, twitter:title, og:alt, description, h1, JSON-LD — добавить «и МО» |
| `public/uslugi/dezinsekciya/index.html` | то же самое |
| `public/uslugi/deratizaciya/index.html` | то же самое |
| `public/uslugi/ozonirovanie/index.html` | то же самое |
| `public/uslugi/dezodoraciya/index.html` | то же самое |

### Что НЕ трогаем

- Окружные страницы (`dezinfekciya-cao`, `dezinfekciya-szao` и т.д.) — там «в Москве» используется в контексте «в [округе] Москвы», это корректно
- React-компоненты — уже обновлены ранее
- Роутинг, стили, логика — без изменений

### Примеры замен (dezinfekciya)

```
"Дезинфекция помещений в Москве — от 1000₽"
→ "Дезинфекция помещений в Москве и МО — от 1000₽"

"дезинфекция в Москве"  (og:image:alt)
→ "дезинфекция в Москве и МО"

JSON-LD description: "...в Москве"
→ "...в Москве и МО"
```

Аналогично для остальных 4 файлов. Итого ~30 точечных замен текста в 5 файлах.

