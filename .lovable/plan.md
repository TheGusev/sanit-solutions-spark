

# Прокинуть все цели на все страницы сайта

## Проблема

Сейчас `useScrollDepth()` и `useHomepageGoals()` вызываются **только в `Index.tsx`**. Остальные страницы (услуги, блог, округа, районы, МО, контакты) не трекают скролл, время на странице и просмотр секций.

## Решение

Вместо добавления хуков в каждую из ~15 страниц — вынести трекинг на **глобальный уровень** в `TrafficProvider`, который уже оборачивает весь роутинг в `App.tsx`.

### 1. Создать `src/hooks/useGlobalGoals.ts`

Универсальный хук, объединяющий:
- **Скролл** 25/50/75/100% — с префиксом страницы (например `scroll_25` с параметром `page`)
- **Время на странице** 30с / 60с / 2мин — сбрасывается при навигации
- **Просмотр секций** — ищет любые элементы с `data-section` на текущей странице и трекает их просмотр
- **Копирование телефона** — глобальный `copy` listener

Хук принимает `pathname` и сбрасывает счётчики при смене страницы.

### 2. Обновить `src/contexts/TrafficContext.tsx`

Вызвать `useGlobalGoals()` внутри `TrafficProvider` — автоматически работает на всех страницах.

### 3. Убрать дублирование из `Index.tsx`

Удалить `useScrollDepth()` и `useHomepageGoals()` из `Index.tsx` — они теперь глобальные.

### 4. Добавить `data-section` на ключевые секции других страниц

- **`ServicePage.tsx`**: pricing, reviews, faq, gallery
- **`DistrictPage.tsx`**: pricing, reviews
- **`BlogPost.tsx`**: content, faq
- **`ServiceLandingUchastkiPage.tsx`**: pricing, quiz, faq

### Файлы

| Файл | Действие |
|------|----------|
| `src/hooks/useGlobalGoals.ts` | Создать — универсальный хук |
| `src/contexts/TrafficContext.tsx` | Добавить вызов `useGlobalGoals()` |
| `src/pages/Index.tsx` | Убрать `useScrollDepth`, `useHomepageGoals` |
| `src/pages/ServicePage.tsx` | Добавить `data-section` на секции |
| `src/pages/DistrictPage.tsx` | Добавить `data-section` на секции |
| `src/pages/BlogPost.tsx` | Добавить `data-section` на секции |
| `src/pages/ServiceLandingUchastkiPage.tsx` | Добавить `data-section` на секции |

Существующие хуки `useHomepageGoals.ts` и `useScrollDepth.ts` останутся как файлы (не сломают импорты), но больше не будут вызываться напрямую — их логика поглощена `useGlobalGoals`.

