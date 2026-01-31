
# План: Исправление CompactRequestModal

## Проблема

Форма калькулятора (`CompactRequestModal`) выдаёт ошибку при отправке заявки:
- Данные НЕ сохраняются в БД
- Уведомления НЕ приходят в Telegram

## Причина

Компонент использует **прямую вставку в БД** с неправильными названиями полей:

| Отправляется | Правильное поле в БД |
|--------------|---------------------|
| `area` | `area_m2` |
| `premise_type` | `object_type` |
| `service_type` | `service` |
| `treatment_type` | `method` |
| `periodicity` | `frequency` |
| `total_price` | `base_price` |
| `discount` | `discount_percent` |

Рабочая форма (`LeadFormModal`) использует Edge Function `handle-lead`, которая:
- Правильно маппит поля
- Отправляет Telegram уведомления
- Трекает MVT конверсии

## Решение

Переписать `CompactRequestModal` для использования Edge Function `handle-lead`.

## Изменения

**Файл**: `src/components/CompactRequestModal.tsx`

Заменить строки 69-126 (прямой insert + log-traffic-event) на:

```typescript
try {
  // Отправка через Edge Function handle-lead
  const { data, error } = await supabase.functions.invoke("handle-lead", {
    body: {
      name: name.trim() || "Не указано",
      phone,
      object_type: calculatorData.premiseType,
      area_m2: calculatorData.area,
      service: calculatorData.serviceType,
      method: calculatorData.treatmentType,
      frequency: calculatorData.period,
      client_type: calculatorData.clientType,
      base_price: calculatorData.totalPrice,
      discount_percent: calculatorData.discount,
      discount_amount: calculatorData.discountAmount,
      final_price: calculatorData.finalPrice,
      source: 'calculator_compact_form',
      session_id: context?.sessionId || null,
      intent: context?.intent || 'default',
      variant_id: context?.variantId || null,
      device_type: context?.deviceType || null,
      last_page_url: window.location.href,
      utm_source: context?.utm_source || null,
      utm_medium: context?.utm_medium || null,
      utm_campaign: context?.utm_campaign || null,
      utm_content: context?.utm_content || null,
      utm_term: context?.utm_term || null,
    }
  });

  if (error || !data?.success) {
    throw error || new Error("Failed to submit lead");
  }

  toast.success("✅ Заявка отправлена! Мы перезвоним вам в течение 15 минут");
```

## Результат

После исправления:
1. Заявки из калькулятора сохраняются с правильными полями
2. Уведомления приходят в Telegram
3. MVT-трекинг работает корректно
4. Обе формы используют единый механизм обработки
