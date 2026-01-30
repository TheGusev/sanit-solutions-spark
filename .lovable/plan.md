
# План исправления: Восстановление работоспособности роутинга округов и исправление ошибок TypeScript

## Диагностика проблемы

Обнаружено две основные категории проблем:

### A. Критические ошибки TypeScript (блокируют сборку)

Файл `src/pages/MoscowRegionServicePage.tsx` содержит 9 ошибок TypeScript, связанных с неправильным использованием компонентов вариативности:

1. **WarningBlock** — передаются неподдерживаемые пропсы `icon` и `children`
2. **VariableCTA** — отсутствует обязательный параметр `fallback`
3. **VariableHeading** — используются неподдерживаемые категории (`pricing`, `benefits`, `guarantees` вместо `hero`, `services`, `cta`)
4. **variation.cardStyle** — обращение к несуществующему свойству объекта

### B. Проблема роутинга округов

Файл `src/pages/DistrictPage.tsx` некорректно получает параметр округа — использует ручной парсинг URL вместо `useParams()` от React Router.

---

## Технический план исправлений

### Шаг 1: Исправить `DistrictPage.tsx` — использовать useParams()

**Что менять:**

```text
// Было:
const pathMatch = location.pathname.match(
  /^\/uslugi\/dezinfekciya-([a-z0-9-]+)\/?$/
);
const districtId = pathMatch?.[1];

// Станет:
const { districtId } = useParams<{ districtId: string }>();
```

- Импортировать `useParams` из `react-router-dom`
- Удалить ручной парсинг через regex
- Использовать стандартный механизм React Router

### Шаг 2: Исправить `MoscowRegionServicePage.tsx`

#### 2.1. Заменить WarningBlock на стандартный блок

Компонент `WarningBlock` принимает только `slug`, но на странице нужен кастомный контент. Решение — заменить на прямое использование компонента `Alert`:

```tsx
// Вместо:
<WarningBlock slug={slug} icon="info">
  <div>...</div>
</WarningBlock>

// Использовать стандартный Alert:
<Alert className="mb-6 border-blue-200 bg-blue-50">
  <AlertDescription>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      ...
    </div>
  </AlertDescription>
</Alert>
```

#### 2.2. Добавить fallback в VariableCTA

```tsx
// Было:
<VariableCTA slug={slug} variant="secondary" />

// Станет:
<VariableCTA slug={slug} variant="secondary" fallback="Оставить заявку" />
```

#### 2.3. Заменить VariableHeading на стандартные заголовки

Компонент `VariableHeading` поддерживает только категории `hero`, `services`, `cta`. Для других секций использовать обычные заголовки:

```tsx
// Вместо:
<VariableHeading slug={slug} category="pricing" ... />

// Использовать:
<h2 className="text-2xl font-bold mb-4">Стоимость услуг</h2>
```

#### 2.4. Исправить обращение к cardStyles

```tsx
// Было:
cardStyles[variation.cardStyle]

// Станет:
cardStyles[variation]
```

Переменная `variation` уже содержит строку типа `PageVariationType`, которая является ключом для `cardStyles`.

---

## Файлы для изменения

| Файл | Тип изменений |
|------|--------------|
| `src/pages/DistrictPage.tsx` | Рефакторинг получения параметра роута |
| `src/pages/MoscowRegionServicePage.tsx` | Исправление 9 ошибок TypeScript |

---

## Проверка после исправлений

1. Билд должен проходить без ошибок TypeScript
2. URL `/uslugi/dezinfekciya-cao` должен корректно отображать страницу ЦАО
3. URL `/uslugi/dezinfekciya-nao` должен отображать страницу НАО
4. URL `/uslugi/dezinfekciya-zelao` должен отображать страницу Зеленограда
5. Все 12 округов должны работать без 404
6. Переходы с `/uslugi/po-okrugam-moskvy` должны работать корректно

---

## Данные синхронизированы корректно

Проверка показала, что:
- `districtSlugs` в `seoRoutes.ts` содержит все 12 округов
- `districtPages` в `districtPages.ts` содержит данные для всех 12 округов
- `getDistrictById()` ищет по полю `id`, которое совпадает со slug в URL
- SSG генерирует все `/uslugi/dezinfekciya-*` маршруты корректно

**Корневая причина 404**: DistrictPage.tsx парсил URL вручную вместо использования useParams(), что могло приводить к ошибкам при SSR/hydration.
