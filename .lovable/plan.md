

## Plan: Фоновое изображение для секции «Наши услуги»

### Шаги

1. **Скопировать изображение** `user-uploads://photo_2026-03-05_15-03-19.jpg` → `public/images/services-bg.jpg`

2. **Обновить `src/components/MiniPricing.tsx`** (line 26):
   - На `<section>` добавить inline style с `backgroundImage`, `backgroundSize: cover`, `backgroundPosition: center` и `position: relative`
   - Внутри section добавить оверлей-div: `absolute inset-0 bg-black/55`
   - Обернуть контент в `relative z-10`
   - Кнопку «Смотреть полный прайс» сделать контрастнее (белый текст/border на тёмном фоне)

Структура HTML карточек и grid не меняется. Только добавляется фон + оверлей к родительской секции.

