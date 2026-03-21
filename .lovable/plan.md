

# Максимизация микроконверсий для обучения рекламных кампаний

## Глубокий анализ текущих целей

### Что УЖЕ трекается (Яндекс.Метрика)

| Цель | Где срабатывает | Тип |
|------|----------------|-----|
| `main_scroll_75` | Главная, скролл 75% | Микро |
| `main_time_2min` | Главная, 2 мин на странице | Микро |
| `scroll_25/50/75/100` | Любая страница | Микро |
| `phone_click` | Шапка, футер, плавающие, CTA | Макро |
| `max_click` | Плавающая кнопка Max | Макро |
| `messenger_click` | Футер | Микро |
| `calculator_click` | Кнопки "Рассчитать" | Микро |
| `calc_lead_{prefix}` | Отправка заявки из калькулятора | Макро |
| `quiz_lead_{prefix}` | Отправка заявки из квиза | Макро |
| `sticky_quiz_lead_{prefix}` | Квиз из sticky-бара | Макро |
| `hero_callback_submit` | Форма обратного звонка в Hero | Макро |
| `callback_{prefix}` | То же, с prefix | Макро |
| `quick_call_submit` | QuickCallForm | Макро |
| `lead_submit` | QuickCallForm (дубль) | Макро |
| `exit_intent_shown` | Попап при уходе | Микро |
| `exit_intent_submit` | Отправка из exit-попапа | Макро |
| `flash_badge_shown` | Бейдж скидки | Микро |
| `flash_badge_click` | Клик на бейдж скидки | Микро |
| `desktop_sticky_view` | Десктоп сайдбар показан | Микро |
| `desktop_sticky_click` | Клик по сайдбару | Микро |
| `sticky_cta_view/click/call` | StickyCTA (мобильный) | Микро |
| `service_sticky_call` | ServiceStickyBar звонок | Макро |
| `calc_calculate` | ServiceStickyBar цена | Микро |
| `ai_referral` | Переход из AI-систем | Микро |

### Что НЕ трекается (упущенные конверсии)

| Действие | Компонент | Важность |
|----------|----------|----------|
| Открытие калькулятора (модал) | CalculatorModal open | Высокая — воронка |
| Взаимодействие с калькулятором (изменение параметров) | Calculator hasInteracted | Высокая — вовлечённость |
| Прокрутка до калькулятора | Calculator scrollIntoView | Средняя |
| Клик «Позвонить» в FinalCTA | FinalCTA handleCall | Высокая — макро |
| Клик «Рассчитать» в FinalCTA | FinalCTA onOpenCalculator | Высокая |
| Просмотр блока отзывов | Reviews section | Средняя |
| Просмотр блока FAQ | FAQ section | Средняя |
| Просмотр цен (MiniPricing) | MiniPricing section | Высокая |
| Просмотр WorkProcess | WorkProcess section | Средняя |
| Клик по номеру в MobileQuickCTA | Уже есть phone_click | — |
| Скролл 25% / 50% на главной | Есть scroll_25/50 общий, нет main_ | Средняя |
| Время 30 сек / 60 сек на сайте | Нет промежуточных | Высокая |
| Открытие формы обратного звонка (начало заполнения) | HeroCallbackForm focus | Средняя |
| Просмотр галереи работ | WorkGallery section | Средняя |
| Копирование номера телефона | Нигде | Средняя |

## План реализации

### 1. Расширить `useHomepageGoals.ts` — максимум микроцелей

Добавить:
- `main_scroll_25`, `main_scroll_50` — промежуточные скроллы
- `main_time_30s`, `main_time_60s` — промежуточное время
- `main_section_pricing` — скролл до блока цен (IntersectionObserver)
- `main_section_reviews` — скролл до отзывов
- `main_section_faq` — скролл до FAQ
- `main_section_gallery` — скролл до галереи работ
- `main_section_process` — скролл до «Как мы работаем»

### 2. Добавить цели в `FinalCTA.tsx`

- `final_cta_call` — клик «Позвонить»
- `final_cta_calculator` — клик «Рассчитать»

### 3. Добавить цели в `Calculator.tsx`

- `calc_open` — открытие калькулятора (CalculatorModal)
- `calc_interact` — первое взаимодействие (выбор типа/услуги)
- `calc_price_view` — пользователь увидел цену (результат расчёта)

### 4. Добавить цели формы

- `form_focus` — фокус на поле телефона в HeroCallbackForm (начало заполнения)

### 5. Копирование телефона

- `phone_copy` — при копировании номера через Clipboard API

### Все новые цели для Яндекс.Метрики (итого ~15 новых):

```
main_scroll_25, main_scroll_50
main_time_30s, main_time_60s
main_section_pricing, main_section_reviews, main_section_faq, main_section_gallery, main_section_process
calc_open, calc_interact, calc_price_view
final_cta_call, final_cta_calculator
form_focus
```

### Файлы для правок

| Файл | Правки |
|------|--------|
| `src/hooks/useHomepageGoals.ts` | +scroll 25/50, +time 30s/60s, +section observers |
| `src/components/FinalCTA.tsx` | +trackGoal для 2 кнопок |
| `src/components/CalculatorModal.tsx` | +trackGoal при открытии |
| `src/components/Calculator.tsx` | +calc_interact, +calc_price_view |
| `src/components/HeroCallbackForm.tsx` | +form_focus на инпуте |

Все цели автоматически попадут в Яндекс.Метрику через существующую функцию `trackGoal()`. После этого в Метрике можно будет создать составную цель из всех микроконверсий для обучения рекламной кампании.

