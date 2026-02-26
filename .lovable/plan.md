

# Исправление: цель calc_open срабатывает до успешной отправки лида

## Проблема

В `src/components/ServiceQuiz.tsx` (строка 91) вызов `trackGoal('calc_open', ...)` стоит **перед** вызовом `supabase.functions.invoke('handle-lead', ...)`. Яндекс Директ списывает деньги за конверсию, даже если API-запрос упал и лид не дошёл до Telegram.

## Решение

Перенести `trackGoal('calc_open', ...)` **после** проверки успешного ответа (после строки 119, внутри success-блока).

| Файл | Изменение |
|---|---|
| `src/components/ServiceQuiz.tsx` | Убрать `trackGoal` со строки 91, поставить после `if (error ...) throw` на строке 119 |

## Код

Было (строки 87-121):
```tsx
setIsSubmitting(true);
const quizSummary = ...;
trackGoal('calc_open', { ... }); // ← срабатывает ДО API

try {
  const { data, error } = await supabase.functions.invoke('handle-lead', { ... });
  if (error || !data?.success) throw ...;
  toast.success('✅ Заявка отправлена!');
```

Станет:
```tsx
setIsSubmitting(true);
const quizSummary = ...;

try {
  const { data, error } = await supabase.functions.invoke('handle-lead', { ... });
  if (error || !data?.success) throw ...;
  
  trackGoal('calc_open', { ... }); // ← только после успешной отправки
  
  toast.success('✅ Заявка отправлена!');
```

Одно изменение в одном файле. Цель будет срабатывать только когда лид реально создан и отправлен в Telegram.

