

# Добавление ориентировочной цены на финальный шаг квиза

## Проблема

На финальном шаге квиза (скриншоты) пользователь видит сводку ответов + форму телефона, но **не видит ориентировочную цену**. Это снижает мотивацию оставить заявку.

## Решение

Добавить в `ServiceQuiz` опциональный проп `priceEstimate` — объект с логикой ценообразования. Если проп не передан, показать базовую цену из `tariffs` или `priceFrom` сервиса. Цена рассчитывается на основе ответов квиза.

## Подход к ценообразованию

Каждый сервис уже имеет `tariffs` (Эконом / Стандарт / Премиум). Вместо сложной калькуляции используем простой маппинг:

1. **ServiceQuiz получает новый проп** `basePrice: string` (например `"от 1 000 ₽"`) и опциональный `priceMap` — словарь `{ [answerKey]: string }` для уточнения цены на основе ответов.
2. На финальном шаге после сводки ответов показываем блок с ценой: «Ориентировочная стоимость: от X ₽».
3. Если `priceMap` не передан — показываем `basePrice`.

## Реализация

### Файл: `src/components/ServiceQuiz.tsx`

**Новые пропсы:**
```typescript
interface ServiceQuizProps {
  steps: QuizStep[];
  serviceSlug: string;
  serviceTitle: string;
  basePrice?: string;           // "от 1 200 ₽"
  priceMap?: Record<string, string>; // { "Квартира": "от 1 200 ₽", "Склад": "от 2 500 ₽" }
  priceStepIndex?: number;      // индекс шага, ответ которого определяет цену (по умолчанию 1 — второй вопрос, обычно «тип помещения»)
}
```

**Логика определения цены:**
```typescript
const estimatedPrice = useMemo(() => {
  if (priceMap && answers[priceStepIndex ?? 1]) {
    return priceMap[answers[priceStepIndex ?? 1]] || basePrice || null;
  }
  return basePrice || null;
}, [answers, priceMap, basePrice, priceStepIndex]);
```

**UI на финальном шаге** (после сводки ответов, перед формой телефона):
```tsx
{estimatedPrice && (
  <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
    <p className="text-sm text-muted-foreground">Ориентировочная стоимость</p>
    <p className="text-2xl font-bold text-primary">{estimatedPrice}</p>
    <p className="text-xs text-muted-foreground mt-1">
      Точную цену назовём после осмотра
    </p>
  </div>
)}
```

### Файл: `src/pages/ServicePage.tsx`

Передать `basePrice` и `priceMap` из данных сервиса:
```tsx
<ServiceQuiz
  steps={service.quizSteps}
  serviceSlug={service.slug}
  serviceTitle={service.title}
  basePrice={service.tariffs?.[0]?.price}
  priceMap={getServicePriceMap(service.slug)}
/>
```

### Файл: `src/pages/ServicePestPage.tsx`

Аналогично — из данных pest:
```tsx
basePrice={pest.tariffs?.[0]?.price || `от ${pest.priceFrom} ₽`}
```

### Файл: `src/pages/ServiceLandingUchastkiPage.tsx`

Передать `basePrice="от 3 000 ₽"` и `priceMap` для участков.

### Новый файл: `src/data/quizPriceMap.ts`

Маппинг ответов на цены для каждого сервиса. Данные берутся из существующих `servicePrices.ts` и `tariffs`:

```typescript
export const quizPriceMaps: Record<string, { stepIndex: number; prices: Record<string, string> }> = {
  dezinfekciya: {
    stepIndex: 0, // "Что обрабатываем?"
    prices: { "Квартира": "от 1 000 ₽", "Офис": "от 1 800 ₽", "Склад / производство": "от 2 500 ₽", "Кафе / ресторан": "от 2 500 ₽", "Медучреждение": "от 3 500 ₽" }
  },
  dezinsekciya: {
    stepIndex: 1, // "Тип помещения?"
    prices: { "Квартира": "от 1 200 ₽", "Частный дом": "от 2 000 ₽", "Ресторан / кафе": "от 3 500 ₽", "Общежитие": "от 2 500 ₽", "Склад / производство": "от 3 000 ₽" }
  },
  deratizaciya: {
    stepIndex: 1, // "Тип объекта?"
    prices: { "Квартира": "от 1 400 ₽", "Частный дом": "от 2 000 ₽", "Подвал / чердак": "от 2 000 ₽", "Склад": "от 2 500 ₽", "Ресторан / кафе": "от 3 000 ₽" }
  },
  // ... и для всех остальных сервисов
};
```

## Файлы для правки

| Файл | Действие |
|------|----------|
| `src/data/quizPriceMap.ts` | Создать — маппинг ответов квиза на цены |
| `src/components/ServiceQuiz.tsx` | Добавить пропсы `basePrice`, `priceMap`, `priceStepIndex`; блок цены на финальном шаге |
| `src/pages/ServicePage.tsx` | Передать `basePrice` и `priceMap` в ServiceQuiz |
| `src/pages/ServicePestPage.tsx` | Передать `basePrice` в ServiceQuiz |
| `src/pages/ServiceLandingUchastkiPage.tsx` | Передать `basePrice` и `priceMap` в ServiceQuiz |

## Что НЕ трогаем

- Калькулятор (Calculator.tsx) — у него своя логика цен
- Тарифы (ServiceTariffs.tsx) — отдельный компонент
- Данные сервисов (services.ts, pests.ts) — не меняем структуру

