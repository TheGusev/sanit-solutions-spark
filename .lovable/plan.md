

# Замена Telegram на MAX по всему сайту

## Что меняется

Все ссылки на Telegram (`t.me/one_help`) заменяются на MAX (`https://max.ru/u/f9LHodD0cOLnq-s7zesBNQy44zFsmKRWA0ggLQyxcSygnjU6MTchzhcEMBo`). Текст "Telegram" заменяется на "MAX". Иконка Telegram (SVG) заменяется на иконку MAX (MessageCircle из lucide-react). Цвет кнопки обновляется.

## Файлы для изменения

| Файл | Что меняется |
|---|---|
| `src/components/FloatingButtons.tsx` | Плавающая кнопка: ссылка, иконка SVG на MessageCircle, текст тултипа, цвет кнопки, aria-label, trackGoal |
| `src/components/Footer.tsx` | Ссылка в контактах: href, текст "Telegram: @one_help" на "MAX Мессенджер", иконка Send на MessageCircle, handleMessengerClick параметр |
| `src/pages/Contacts.tsx` | Блок контактов: ссылка, текст, иконка, handleTelegramClick переименовать |
| `src/components/PrivacyPolicyContent.tsx` | Ссылка в политике конфиденциальности: href, текст |

## Детали по каждому файлу

### FloatingButtons.tsx
- `handleTelegramClick` --> `handleMaxClick`, trackGoal `'max_click'`
- URL: `https://max.ru/u/f9LHodD0cOLnq-s7zesBNQy44zFsmKRWA0ggLQyxcSygnjU6MTchzhcEMBo`
- SVG иконка Telegram --> `MessageCircle` из lucide-react
- Цвет: `bg-[#0088cc]` --> `bg-[#168DE2]` (фирменный MAX)
- Тултип: "Написать в MAX"

### Footer.tsx
- Иконка `Send` --> `MessageCircle`
- href на MAX ссылку
- Текст: "MAX Мессенджер"
- `handleMessengerClick('telegram')` --> `handleMessengerClick('max')`

### Contacts.tsx
- `handleTelegramClick` --> `handleMaxClick` с MAX ссылкой
- Иконка `Send` --> `MessageCircle`
- Текст: "Telegram" --> "MAX", "@one_help" --> "Написать"

### PrivacyPolicyContent.tsx
- href на MAX ссылку
- Текст: "Telegram: @one_help" --> "MAX Мессенджер"

