

# Исправление кнопки "Рассчитать стоимость" на страницах вредителей

## Проблема

На страницах услуг по вредителям (клопы, тараканы и т.п.) кнопка "Рассчитать стоимость" использует `<Link to="/#calculator">`, что перекидывает на главную страницу вместо открытия калькулятора прямо на текущей странице.

## Решение

Добавить `CalculatorModal` и состояние `showCalculator` в три файла, заменив `<Link to="/#calculator">` на `onClick={() => setShowCalculator(true)}`.

## Файлы для изменения

| Файл | Изменение |
|---|---|
| `src/pages/ServicePestPage.tsx` | Добавить `useState`, импорт `CalculatorModal`, заменить `Link to="/#calculator"` на `onClick`, добавить `<CalculatorModal>` перед `</>`  |
| `src/pages/NchPage.tsx` | То же самое |
| `src/pages/MoscowRegionCityPage.tsx` | То же самое |

## Детали

В каждом из трёх файлов:

1. Добавить `import { useState } from 'react'` (или дополнить существующий импорт)
2. Добавить `import CalculatorModal from '@/components/CalculatorModal'`
3. Добавить состояние: `const [showCalculator, setShowCalculator] = useState(false)`
4. Заменить:
```tsx
// Было:
<Button asChild>
  <Link to="/#calculator">Рассчитать стоимость</Link>
</Button>

// Стало:
<Button onClick={() => setShowCalculator(true)}>
  Рассчитать стоимость
</Button>
```
5. Добавить компонент перед закрывающим `</>`:
```tsx
<CalculatorModal open={showCalculator} onOpenChange={setShowCalculator} />
```
