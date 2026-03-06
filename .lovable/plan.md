

## Plan: Акцентные линии и усиленное обрамление карточек

### Изменения в `src/components/MiniPricing.tsx`

**1. Карточка — акцентная линия сверху + усиленный бордер**

Обернуть содержимое карточки так, чтобы у div была `relative overflow-hidden`, а через CSS pseudo-element `before:` добавить градиентную линию сверху. Tailwind поддерживает `before:` модификатор:

```
before:absolute before:top-0 before:left-[10%] before:right-[10%] before:h-[2px]
before:bg-gradient-to-r before:from-blue-500 before:via-cyan-400 before:to-purple-500
before:rounded-full before:blur-[1px]
```

Контент карточки — `relative z-[1]` для читаемости поверх декора.

**2. Подзаголовок секции — расширить градиентную линию**

Текущая линия (`w-24`) — заменить на `w-32` и обновить градиент на тот же `from-blue-500 via-cyan-400 to-purple-500` для консистентности со стилем карточек.

**3. Без изменений**: HTML-структура, grid layout, кнопка.

Файл: только `src/components/MiniPricing.tsx`.

