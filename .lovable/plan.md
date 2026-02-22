
# Оборачивание тяжёлых секций в LazySection + проверка клика по статье

## Задача 1: LazySection на ServicePage.tsx и ServicePestPage.tsx

Компонент `LazySection` уже создан (`src/components/LazySection.tsx`) -- использует IntersectionObserver с rootMargin 200px для упреждающего рендера.

### ServicePage.tsx -- 5 секций для обёртки

| Секция | Строки | minHeight |
|--------|--------|-----------|
| ServiceQuiz | 281-287 | 400px |
| ServiceTariffs | 290-292 | 300px |
| WhyProblemReturns | 295-297 | 250px |
| FAQ (Accordion) | 602-628 | 300px |
| SEO Accordion | 738-755 | 80px |

### ServicePestPage.tsx -- 5 секций для обёртки

| Секция | Строки | minHeight |
|--------|--------|-----------|
| ServiceQuiz | 264-270 | 400px |
| ServiceTariffs | 273-278 | 300px |
| WhyProblemReturns | 324-329 | 250px |
| FAQ (Accordion) | 350-391 | 300px |
| SEO Accordion | 393-415 | 80px |

### Изменения в каждом файле

1. Добавить `import LazySection from '@/components/LazySection'`
2. Обернуть каждую из 5 секций в `<LazySection minHeight="...">...</LazySection>`

Пример:
```tsx
// Было:
{service.quizSteps && service.quizSteps.length > 0 && (
  <ServiceQuiz ... />
)}

// Стало:
<LazySection minHeight="400px">
  {service.quizSteps && service.quizSteps.length > 0 && (
    <ServiceQuiz ... />
  )}
</LazySection>
```

## Задача 2: Проверка клика по статье 'Борьба с тараканами'

После внесения изменений -- открыть `/uslugi/dezinsekciya/tarakany` через browser tool и кликнуть на карточку статьи "Борьба с тараканами", убедиться что переход на `/blog/borba-s-tarakanami` работает корректно.

## Файлы

| Файл | Действие |
|------|----------|
| `src/pages/ServicePage.tsx` | + import LazySection, обернуть 5 секций |
| `src/pages/ServicePestPage.tsx` | + import LazySection, обернуть 5 секций |

## Ожидаемый результат

- DOM-узлы снизятся на 500-800 штук при первом рендере (секции ниже viewport не создают DOM)
- Итоговый DOM при загрузке страницы должен быть менее 3500 узлов
- Пользовательский опыт не меняется -- секции появляются до того, как пользователь до них доскроллит (rootMargin 200px)
