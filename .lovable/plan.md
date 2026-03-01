

## План: 3 конверсионных цели с умной маршрутизацией sticky → quiz

### Суть изменений

Полностью переделать логику целей. Вместо текущих `lead_{slug}`, `callback_{slug}`, `quiz_{slug}` будут **3 новых цели**:

| # | Цель | Триггер | Goal ID |
|---|------|---------|---------|
| 1 | Калькулятор | Успешная отправка формы из `LeadFormModal` или `CompactRequestModal` | `calc_lead_{prefix}` |
| 2 | Обычный квиз | Пользователь сам дошёл до квиза и заполнил | `quiz_lead_{prefix}` |
| 3 | Стики → Квиз | Нажал "Узнать цену" в стики-баре, скроллнулся к квизу, заполнил | `sticky_quiz_lead_{prefix}` |

`{prefix}` берётся из существующей функции `getYmGoalId` (переименуем внутреннюю часть).

### Файлы и изменения

**1. `src/lib/analytics.ts`**
- Добавить экспортируемую функцию `getYmGoalPrefix(): string` — вынести логику определения slug из `getYmGoalId` в отдельную функцию. Она возвращает только slug (`klopy`, `main`, `general`).
- `getYmGoalId` продолжает работать как раньше (для обратной совместимости).

**2. `src/components/ServiceStickyBar.tsx`** (кнопка "Узнать цену")
- В `handlePrice` добавить `sessionStorage.setItem('quiz_source', 'sticky_bar')` перед скроллом к квизу.

**3. `src/components/ServiceQuiz.tsx`** (при успешной отправке)
- Убрать текущие `trackGoal('calc_open', ...)` и `trackGoal(getYmGoalId('quiz'), ...)`.
- Вместо них: проверить `sessionStorage.getItem('quiz_source')`.
  - Если `=== 'sticky_bar'` → `trackGoal('sticky_quiz_lead_' + prefix)`, затем `sessionStorage.removeItem('quiz_source')`.
  - Иначе → `trackGoal('quiz_lead_' + prefix)`.

**4. `src/components/LeadFormModal.tsx`** (при успешной отправке)
- Убрать текущие `trackGoal('lead_submit', ...)` и `trackGoal(getYmGoalId('lead'), ...)`.
- Вместо них: `trackGoal('calc_lead_' + prefix)`.

**5. `src/components/CompactRequestModal.tsx`** (при успешной отправке)
- Убрать текущие `trackGoal('calc_submit', ...)` и `trackGoal(getYmGoalId('lead'), ...)`.
- Вместо них: `trackGoal('calc_lead_' + prefix)`.

**6. `src/components/HeroCallbackForm.tsx`**
- Оставляем как есть (маркетолог упомянул только 3 цели, callback не входит в новую схему). Старые generic goals `hero_callback_submit` продолжат стрелять.

### Пример: страница Клопы (`/uslugi/dezinsekciya/klopy`)

Маркетолог создаёт в Яндекс.Метрике 3 цели (тип: JavaScript-событие):
1. `calc_lead_klopy`
2. `quiz_lead_klopy`
3. `sticky_quiz_lead_klopy`

### Технические детали

- `sessionStorage` выбран потому что флаг должен жить только в рамках текущей вкладки и автоматически очищается при закрытии.
- Флаг очищается сразу после отправки цели, чтобы повторное заполнение квиза (без клика по стики) не считалось sticky-конверсией.
- Старые generic goals (`lead_submit`, `calc_open`, `calc_submit`) будут удалены из этих компонентов — маркетолог от них отказался.

