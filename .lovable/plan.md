## Цель
Сохранять на нашей стороне промежуточные номера, которые пользователь вводил в форму, но не отправил (как в случае с заявкой 04.06.2026 12:21 — клиент ввёл 2 номера, в Telegram пришёл только второй).

## Что делаем

Добавляем новое событие `phone_input_captured` в `traffic_events` — отправляется на `blur` поля телефона, если введён валидный номер (`isValidRuPhone`).

### Изменения в коде

1. **`src/lib/analytics.ts`**
   - Добавить хелпер `trackPhoneInput(phone, source, extra?)`, который:
     - дебаунсит/дедуплицирует по последнему отправленному значению на сессию (чтобы не слать повторно тот же номер);
     - вызывает `logTrafficEvent('phone_input_captured', { phone, source, ...extra })`;
     - НЕ триггерит цели Метрики (это служебное событие, не конверсия).

2. **Подключить `onBlur` в формах ввода телефона:**
   - `src/components/HeroCallbackForm.tsx` — source: `hero_callback`
   - `src/components/QuickCallForm.tsx` — source: `quick_call`
   - `src/components/CompactRequestModal.tsx` — source: `calculator_compact_form`
   - `src/components/LeadFormModal.tsx` — source: `lead_modal` (проверить наличие телефона)
   - `src/components/ExitIntentPopup.tsx` — если есть поле телефона
   - `src/components/ServiceQuiz.tsx` — если есть поле телефона

   Логика onBlur: если `isValidRuPhone(phone)` → `trackPhoneInput(phone, source, { intent, variant_id })`.

3. **Передаём контекст**: `session_id`, `intent`, `variant_id`, `last_page_url`, `utm_*` — через существующий `logTrafficEvent` (он уже подтягивает их из `TrafficContext`).

### Где смотреть результат

Админка → можно посмотреть напрямую SQL-запросом:
```sql
SELECT timestamp, event_data, page_url
FROM traffic_events
WHERE session_id = '<session>'
  AND event_type = 'phone_input_captured'
ORDER BY timestamp;
```
Либо опционально добавить вкладку в `src/pages/admin/Leads.tsx` — «Промежуточные номера сессии» рядом с каждой заявкой (по `session_id`). Это сделаю отдельно, если нужно — сейчас в скоупе только сбор данных.

## Что НЕ трогаем
- Схему БД (`traffic_events` уже принимает произвольный `event_data jsonb`).
- Логику submit заявок, Telegram-уведомления, цели Метрики.
- SSG/роутинг.

## Приватность
Телефон уже сохраняется в `leads` при отправке — режим хранения тот же. RLS таблицы `traffic_events` уже ограничивает чтение админами.
