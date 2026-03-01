

## План: URL-зависимые цели Яндекс.Метрики

Счетчик уже найден: `YANDEX_COUNTER_ID = 105828040` в `src/lib/analytics.ts`. Типизация `window.ym` тоже уже есть. Функция `trackGoal` уже вызывает `reachGoal` через этот счетчик.

---

### Шаг 1: Добавить `getYmGoalId()` в `src/lib/analytics.ts`

Добавить функцию в существующий файл (не создавать новый):

```ts
export function getYmGoalId(pathname: string): string {
  const p = pathname.toLowerCase();
  if (p.includes('/klopy') || p.includes('/klopov')) return 'lead_klopy';
  if (p.includes('/tarakany') || p.includes('/tarakanov')) return 'lead_tarakany';
  if (p.includes('/muravyi') || p.includes('/muravyov')) return 'lead_muravyi';
  if (p.includes('/blohi') || p.includes('/blokh')) return 'lead_blohi';
  if (p.includes('/kleshchi')) return 'lead_kleshchi';
  if (p.includes('/kroty') || p.includes('/krotov')) return 'lead_kroty';
  if (p.includes('/obrabotka-uchastkov')) return 'lead_uchastki';
  if (p.includes('/dezinfekciya')) return 'lead_dezinfekciya';
  if (p.includes('/deratizaciya')) return 'lead_deratizaciya';
  if (p.includes('/sluzhba-dezinsekcii')) return 'lead_ses';
  if (p === '/') return 'lead_main';
  return 'lead_general';
}
```

### Шаг 2: Внедрить в 5 форм отправки заявок

После успешной отправки (после проверки `data?.success`) добавить вызов:

```ts
const pageGoal = getYmGoalId(window.location.pathname);
trackGoal(pageGoal, { source: 'form_name', price: ... });
```

Формы для обновления:

| Компонент | Место вставки |
|-----------|---------------|
| `LeadFormModal.tsx` | после строки 153 (после `trackGoal('lead_submit')`) |
| `CompactRequestModal.tsx` | после строки 99 (после проверки success) |
| `QuickCallForm.tsx` | после строки 121 (после `trackGoal('lead_submit')`) |
| `HeroCallbackForm.tsx` | после строки 67 (после проверки success) |
| `ExitIntentPopup.tsx` | после строки 159 (после `trackGoal('exit_intent_submit')`) |

Каждая форма уже импортирует `trackGoal`. Нужно только добавить импорт `getYmGoalId` и один вызов.

### Шаг 3: TypeScript

Не требуется — `window.ym` уже типизирован в `analytics.ts` строка 24.

---

### Итоговый список целей для Яндекс.Метрики

| Идентификатор | Описание |
|---|---|
| `lead_klopy` | Заявка со страниц клопов (`/klopy`, `/klopov`) |
| `lead_tarakany` | Заявка со страниц тараканов (`/tarakany`, `/tarakanov`) |
| `lead_muravyi` | Заявка со страниц муравьёв (`/muravyi`, `/muravyov`) |
| `lead_blohi` | Заявка со страниц блох (`/blohi`, `/blokh`) |
| `lead_kleshchi` | Заявка со страниц клещей (`/kleshchi`) |
| `lead_kroty` | Заявка со страниц кротов (`/kroty`, `/krotov`) |
| `lead_uchastki` | Заявка со страницы обработки участков (`/obrabotka-uchastkov`) |
| `lead_dezinfekciya` | Заявка со страниц дезинфекции (`/dezinfekciya`) |
| `lead_deratizaciya` | Заявка со страниц дератизации (`/deratizaciya`) |
| `lead_ses` | Заявка со страницы СЭС (`/sluzhba-dezinsekcii`) |
| `lead_main` | Заявка с главной страницы (`/`) |
| `lead_general` | Заявка с любой другой страницы (fallback) |

