## Что делаем

Привожу все 4 формы заявок к единому стандарту: строгая маска телефона `+7 (XXX) XXX-XX-XX` (ровно 18 символов), визуальная валидация в реальном времени, гарантированная авто-подстановка UTM/intent/session/device/page из `TrafficContext`. Это уберёт «Введите корректный номер» при невалидных номерах и устранит провалы вставки заявок (RLS требует `length(phone) >= 10`).

## Текущее состояние (что уже работает)

- `HeroCallbackForm`, `LeadFormModal`, `CompactRequestModal`, `QuickCallForm` — все уже подключены к `useTraffic()` и шлют `utm_source/medium/campaign/content/term`, `session_id`, `intent`, `variant_id`, `device_type`, `last_page_url` в edge-функцию `handle-lead`.
- `LeadFormModal` и `QuickCallForm` уже используют строгую проверку `phone.length === 18`.

## Что нужно поправить

### 1. CompactRequestModal — слабая валидация
Сейчас: `if (!phone || phone.length < 11)` пропускает «+7 (123» (12 символов) → отправка → ошибка RLS.
Стандарт: `phone.length !== 18` + единое сообщение об ошибке + визуальный индикатор (border-success/destructive) как в LeadFormModal.

### 2. HeroCallbackForm — нет визуальной валидации
Добавить `isPhoneValid` и зелёную/красную рамку, синхронно с остальными формами.

### 3. Единый помощник `formatRuPhone`
Сейчас `formatPhone` дублируется в 4 файлах с мелкими расхождениями (где-то начальное значение `"+7 "`, где-то `"+7"`). Вынести в `src/lib/phoneUtils.ts`:
- `formatRuPhone(value: string): string` — маска `+7 (XXX) XXX-XX-XX`.
- `isValidRuPhone(value: string): boolean` — `value.length === 18`.
- `RU_PHONE_PLACEHOLDER = "+7 "`.

### 4. Авто-подстановка last_page_url + referrer
Сейчас `last_page_url: window.location.href` есть только в CompactRequestModal. Добавить во все 4 формы (referrer передавать в `utm_content` не надо — оставляем чистым).

### 5. SSR-guard
`window.location.href` оборачиваем в `typeof window !== 'undefined' ? window.location.href : null` — иначе при SSG-пререндере крашит (см. core-rule про `import.meta.env.SSR`).

## Технические детали (для разработчика)

Файлы на изменение:
```
src/lib/phoneUtils.ts                    (новый)
src/components/CompactRequestModal.tsx   (валидация + импорт хелпера)
src/components/HeroCallbackForm.tsx      (визуальная валидация + хелпер)
src/components/LeadFormModal.tsx         (импорт хелпера, поведение не меняем)
src/components/QuickCallForm.tsx         (импорт хелпера, last_page_url)
```

Контракт `handle-lead` не меняем — только клиент. RLS-правило (`length(phone) between 10 and 30`) уже соблюдено маской `+7 (XXX) XXX-XX-XX` = 18 символов = 11 цифр.

## Проверка после реализации

1. На `/` открыть мини-форму Hero, ввести «123» — кнопка disabled, рамка красная, тоста нет.
2. Открыть калькулятор → нажать «Оставить заявку» → ввести полный номер → проверить успешный сабмит.
3. Зайти на `?utm_source=test&utm_campaign=fix` → отправить заявку → в БД у lead должен быть `utm_source=test`, `utm_campaign=fix`, `last_page_url`.
4. SSG-сборка `npm run build` должна пройти без ошибок (нет `window` вне guard).
