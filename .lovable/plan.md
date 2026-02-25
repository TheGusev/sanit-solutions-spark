

# Переделка целей аналитики

## Текущие цели → Новое назначение

| Идентификатор | Было | Станет (по скриншотам) |
|---|---|---|
| `calc_open` | Калькулятор попал в область видимости | **Отправка данных с квиза** (ServiceQuiz) |
| `calc_calculate` | Изменение полей калькулятора | **Клик по кнопке "Узнать цену"** (ServiceStickyBar) |
| `calc_submit` | Клик "Заказать" в калькуляторе | **Отправка заявки** из компактной формы (CompactRequestModal) |

## Цели к удалению

Все вызовы `trackGoal` для: `compact_form_open`, `compact_form_submit`, `whatsapp_click` — удаляются.

## Файлы и изменения

| Файл | Что делаем |
|---|---|
| `src/components/ServiceQuiz.tsx` | `trackGoal('quiz_submit', ...)` → `trackGoal('calc_open', ...)` |
| `src/components/ServiceStickyBar.tsx` | `trackGoal('service_sticky_price', ...)` → `trackGoal('calc_calculate', ...)` |
| `src/components/CompactRequestModal.tsx` | `trackGoal('compact_form_submit', ...)` → `trackGoal('calc_submit', ...)` |
| `src/components/Calculator.tsx` | Удалить 4 вызова trackGoal: `calc_open` (IntersectionObserver), `calc_calculate` (useEffect при изменении полей), `calc_submit` (handleOrder), `compact_form_open` (handleCompactRequest) |
| `src/lib/analytics.ts` | Обновить маппинги VK Pixel и Top.Mail.Ru: `calc_open` → `'lead'` (вместо `'view_content'`) |

## Детали

В `Calculator.tsx` все 4 старых вызова trackGoal убираются, т.к. цели теперь привязаны к другим компонентам. Сама логика калькулятора (формы, модалки) не меняется — меняются только трекинг-вызовы.

