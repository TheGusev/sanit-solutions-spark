
# План: Исправление мобильного меню и усиление триколор-темы

## 1. Проблема с "залипающим" красным активным состоянием

### Причина
На скриншотах видно: пункт "Блог" остаётся красным (bg-russia-red/10 + text-russia-red + border-l-4), даже когда пользователь на странице `/uslugi/dezinfekciya`.

Текущий код (Header.tsx, строки 411-422):
```tsx
<SheetClose asChild>
  <Link 
    to="/blog" 
    className={`... ${
      location.pathname === '/blog' || location.pathname.startsWith('/blog/')
        ? 'bg-russia-red/10 text-russia-red border-l-4 border-russia-red'
        : 'hover:bg-muted'
    }`}
  >
    Блог
  </Link>
</SheetClose>
```

Логика `location.pathname` верна, но проблема в другом:

1. **:focus залипание**: После тапа на мобилке элемент сохраняет focus-состояние, которое может визуально конфликтовать
2. **Кэширование состояния Sheet**: Radix Sheet может сохранять внутреннее состояние элементов между открытиями
3. **Отсутствие явного сброса фокуса**: При клике на пункт меню нужно принудительно снять фокус

### Решение

| Файл | Изменение |
|------|-----------|
| `src/components/Header.tsx` | Добавить обработчик onClick с blur() для всех пунктов меню |
| `src/index.css` | Добавить сброс :focus-visible для навигационных ссылок |

**Код исправления Header.tsx:**
```tsx
// Вспомогательная функция для обработки клика
const handleMenuItemClick = (e: React.MouseEvent) => {
  // Снимаем фокус с элемента для предотвращения :focus залипания
  (e.currentTarget as HTMLElement).blur();
  // Принудительно закрываем меню
  setIsMobileMenuOpen(false);
};

// Применение к ссылкам (пример для Блог):
<SheetClose asChild>
  <Link 
    to="/blog"
    onClick={handleMenuItemClick}
    className={`block py-3 px-4 rounded-lg transition-colors font-medium focus:outline-none ${
      location.pathname === '/blog' || location.pathname.startsWith('/blog/')
        ? 'bg-russia-red/10 text-russia-red border-l-4 border-russia-red'
        : 'hover:bg-muted'
    }`}
  >
    Блог
  </Link>
</SheetClose>
```

**CSS сброс фокуса (index.css):**
```css
/* Убираем :focus стили для навигационных ссылок в мобильном меню */
[data-radix-collection-item] a:focus,
[role="dialog"] a:focus,
[role="dialog"] button:focus {
  outline: none;
  box-shadow: none;
}
```

---

## 2. Улучшение контраста в тёмной теме

### Проблема
Красный фон `bg-russia-red/10` в тёмной теме выглядит как состояние ошибки — слишком агрессивно.

### Решение
Смягчить активное состояние в тёмной теме:

| Файл | Изменение |
|------|-----------|
| `src/components/Header.tsx` | Использовать разные классы для светлой/тёмной темы |

```tsx
// Новые классы для активного состояния
const activeMenuClass = 'bg-russia-red/10 dark:bg-russia-red/5 text-russia-red dark:text-russia-red/90 border-l-4 border-russia-red';
```

---

## 3. Унификация триколор-акцентов

### Текущее состояние

| Компонент | Триколор | Статус |
|-----------|----------|--------|
| Header (полоска) | ✅ | Есть |
| Footer (полоска) | ✅ | Есть |
| Blog.tsx (линия под заголовком) | ✅ | Есть |
| Страницы услуг | ❌ | Нет |
| Страницы районов | ❌ | Нет |
| CTA кнопки | ❌ | Нет hover-эффекта |

### Изменения

| Файл | Изменение |
|------|-----------|
| `src/components/ui/button.tsx` | Добавить вариант `tricolor` с градиентным hover |
| `src/pages/ServicePage.tsx` | Добавить триколор-линию под H1 |
| `src/pages/DistrictPage.tsx` | Добавить триколор-линию под H1 |
| `src/index.css` | Добавить утилитарный класс `.tricolor-underline` |

**Новый CSS утилитарный класс:**
```css
.tricolor-underline {
  height: 4px;
  display: flex;
  border-radius: 9999px;
  overflow: hidden;
}

.tricolor-underline > span:nth-child(1) { flex: 1; background: white; border: 1px solid hsl(var(--border)); }
.tricolor-underline > span:nth-child(2) { flex: 1; background: hsl(var(--primary)); }
.tricolor-underline > span:nth-child(3) { flex: 1; background: hsl(var(--russia-red)); }
```

**Hover-эффект для CTA кнопок (button.tsx):**
```tsx
// Добавить в buttonVariants:
tricolor: "bg-primary text-primary-foreground hover:shadow-[0_0_20px_rgba(239,68,68,0.3),0_0_20px_rgba(59,130,246,0.3)] transition-shadow",
```

---

## 4. Инфоблок "Официально"

### Создать компонент
Новый файл: `src/components/TrustBadge.tsx`

```tsx
import { FileCheck, Shield, Receipt } from "lucide-react";

const TrustBadge = () => (
  <div className="flex flex-wrap items-center justify-center gap-4 py-4 px-6 bg-muted/50 rounded-xl border border-border">
    <div className="flex items-center gap-2 text-sm">
      <FileCheck className="w-4 h-4 text-primary" />
      <span>Договор</span>
    </div>
    <div className="flex items-center gap-2 text-sm">
      <Shield className="w-4 h-4 text-success" />
      <span>Гарантия до 1 года</span>
    </div>
    <div className="flex items-center gap-2 text-sm">
      <Receipt className="w-4 h-4 text-russia-red" />
      <span>Документы СЭС</span>
    </div>
  </div>
);
```

### Интеграция
Добавить под Hero или перед PricingByArea на главной странице и страницах услуг.

---

## 5. Чипы категорий в блоге

### Текущее состояние
Категории уже имеют триколор-акценты (строки 139-151 Blog.tsx):
- Красные категории: `bg-russia-red/10 text-russia-red`
- Градиентные категории: `bg-gradient-to-r from-primary to-russia-red`

### Улучшение
Добавить тонкую рамку для более явной интеграции:

```tsx
// Изменить getCategoryClass():
if (redCategories.includes(post.category)) {
  return "bg-russia-red/10 text-russia-red border border-russia-red/30";
}
```

---

## Сводка изменений

| # | Файл | Действие |
|---|------|----------|
| 1 | `src/components/Header.tsx` | Добавить handleMenuItemClick с blur(), focus:outline-none |
| 2 | `src/components/Header.tsx` | Улучшить dark mode контраст активного меню |
| 3 | `src/index.css` | Добавить сброс :focus для Radix элементов |
| 4 | `src/index.css` | Добавить .tricolor-underline класс |
| 5 | `src/components/ui/button.tsx` | Добавить tricolor вариант с hover-свечением |
| 6 | `src/components/TrustBadge.tsx` | Создать новый компонент |
| 7 | `src/pages/Index.tsx` | Добавить TrustBadge |
| 8 | `src/pages/ServicePage.tsx` | Добавить триколор-линию |
| 9 | `src/pages/Blog.tsx` | Добавить рамку к категориям |

---

## Результат

1. Красная подсветка "Блог" больше не залипает после навигации
2. Тёмная тема имеет мягкий контраст активных элементов
3. Триколор-акценты унифицированы на всех страницах
4. CTA кнопки имеют тонкое hover-свечение в цветах триколора
5. Компактный инфоблок "Официально" добавлен рядом с услугами
