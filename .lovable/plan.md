

# Добавить составную цель `all_conversions` в trackGoal

## Что делаем

В функции `trackGoal` в `src/lib/analytics.ts` после отправки основной цели — проверяем, входит ли `goalName` в список 10 статических целей или начинается с `quiz_lead_` / `calc_lead_`. Если да — дополнительно отправляем `ym(YANDEX_COUNTER_ID, 'reachGoal', 'all_conversions')`.

## Файл: `src/lib/analytics.ts`

После строки 181 (`}`) добавить блок:

```typescript
// Составная цель all_conversions — срабатывает при любой конверсии
const ALL_CONV_GOALS = new Set([
  'final_cta_call', 'final_cta_calculator', 'calc_open',
  'calc_interact', 'calc_price_view', 'service_sticky_call',
  'calc_calculate', 'lead_submit', 'hero_callback_submit', 'phone_click'
]);

const isConversion = ALL_CONV_GOALS.has(goalName) ||
  goalName.startsWith('quiz_lead_') ||
  goalName.startsWith('calc_lead_');

if (isConversion && goalName !== 'all_conversions') {
  try {
    window.ym(YANDEX_COUNTER_ID, 'reachGoal', 'all_conversions', params);
    console.log('Composite goal tracked: all_conversions');
  } catch (err) {
    console.debug('all_conversions error:', err);
  }
}
```

Защита `goalName !== 'all_conversions'` предотвращает рекурсию.

## Что нужно в Яндекс.Метрике

Создать цель: тип «JavaScript-событие», идентификатор `all_conversions`.

## Результат

Одна цель `all_conversions` покрывает все 12+ конверсий через логику «ИЛИ». Оригинальные цели продолжают работать без изменений.

