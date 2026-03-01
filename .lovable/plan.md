

## Отчёт: Анализ текущих целей Яндекс.Метрики

### 1. Номер счётчика
**105828040** (строка 3, `src/lib/analytics.ts`)

### 2. Текущие цели на странице клопов (и ВСЕХ остальных страницах)

**Специфичных целей для клопов НЕТ.** Функция `getYmGoalId` упоминается в памяти проекта, но в коде НЕ СУЩЕСТВУЕТ. Все страницы вредителей используют одни и те же **3 общих цели**:

| # | Goal ID | Триггер (событие React) | Компонент |
|---|---------|------------------------|-----------|
| 1 | `hero_callback_submit` | Отправка формы обратного звонка в hero-секции | `HeroCallbackForm.tsx` → `handleSubmit` |
| 2 | `lead_submit` | Отправка заявки через модальную форму (после калькулятора) | `LeadFormModal.tsx` → `handleSubmit` |
| 3 | `calc_open` | Отправка квиз-заявки (quiz form submit) | `ServiceQuiz.tsx` → `handleSubmit` |

Дополнительно на всех страницах срабатывают: `phone_click` (клик по номеру телефона), `calc_submit` (CompactRequestModal), `sticky_cta_click/call`, `service_sticky_call/calc_calculate`.

**Ни одна из этих целей не содержит slug вредителя/услуги.** Все цели пишутся одинаково для клопов, тараканов, блох и т.д. — в Метрику приходит `lead_submit` без разделения по вредителю.

### 3. План: создать `getYmGoalId` и внедрить pest-specific цели

Поскольку эталонных pest-specific целей в коде нет, нужно:

**A. Добавить функцию `getYmGoalId` в `src/lib/analytics.ts`**

Структура нейминга (на базе существующих 3 триггеров):
- `lead_{pest}` — отправка заявки (LeadFormModal, CompactRequestModal)
- `callback_{pest}` — обратный звонок из hero (HeroCallbackForm)
- `quiz_{pest}` — отправка квиз-формы (ServiceQuiz)

Где `{pest}` определяется из `window.location.pathname`:
```
/uslugi/dezinsekciya/klopy → klopy
/uslugi/dezinsekciya/tarakany → tarakany
/uslugi/dezinsekciya/muravyi → muravyi
/uslugi/dezinsekciya/blohi → blohi
/uslugi/deratizaciya/krysy → krysy
/uslugi/deratizaciya/kroty → kroty
/uslugi/obrabotka-uchastkov → uchastki
/sluzhba-dezinsekcii → ses
/ → main
fallback → general
```

Функция `getYmGoalId(actionType: string): string` берёт `pathname` из `window.location` и возвращает, например, `lead_klopy` или `quiz_tarakany`.

**B. Обновить 4 компонента:**

1. **`LeadFormModal.tsx`** — заменить `trackGoal('lead_submit', ...)` на `trackGoal(getYmGoalId('lead'), ...)`
2. **`CompactRequestModal.tsx`** — заменить `trackGoal('calc_submit', ...)` на `trackGoal(getYmGoalId('lead'), ...)`
3. **`HeroCallbackForm.tsx`** — заменить `trackGoal('hero_callback_submit', ...)` на `trackGoal(getYmGoalId('callback'), ...)`
4. **`ServiceQuiz.tsx`** — заменить `trackGoal('calc_open', ...)` на `trackGoal(getYmGoalId('quiz'), ...)`

Старые generic цели сохраняются как fallback (`lead_general`, `callback_general`, `quiz_general`).

**C. Также отправлять старый generic goal** параллельно, чтобы не ломать существующие отчёты в Метрике.

---

### Итоговый список целей для маркетологов (после внедрения)

| Action | Главная | Клопы | Тараканы | Муравьи | Блохи | Клещи | Крысы | Кроты | Участки | СЭС | Прочее |
|--------|---------|-------|----------|---------|-------|-------|-------|-------|---------|-----|--------|
| Заявка | `lead_main` | `lead_klopy` | `lead_tarakany` | `lead_muravyi` | `lead_blohi` | `lead_kleshchi` | `lead_krysy` | `lead_kroty` | `lead_uchastki` | `lead_ses` | `lead_general` |
| Звонок | `callback_main` | `callback_klopy` | `callback_tarakany` | `callback_muravyi` | `callback_blohi` | `callback_kleshchi` | `callback_krysy` | `callback_kroty` | `callback_uchastki` | `callback_ses` | `callback_general` |
| Квиз | `quiz_main` | `quiz_klopy` | `quiz_tarakany` | `quiz_muravyi` | `quiz_blohi` | `quiz_kleshchi` | `quiz_krysy` | `quiz_kroty` | `quiz_uchastki` | `quiz_ses` | `quiz_general` |

**Итого: 33 pest-specific цели + 3 generic fallback = 36 целей.**

Файлы к изменению: `src/lib/analytics.ts` (добавить `getYmGoalId`), `LeadFormModal.tsx`, `CompactRequestModal.tsx`, `HeroCallbackForm.tsx`, `ServiceQuiz.tsx`.

