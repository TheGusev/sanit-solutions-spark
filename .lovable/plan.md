
# План исправления: Восстановление роутинга округов Москвы

## Диагностика проблемы

**Корневая причина**: React Router v6.30.1 изменил поведение маршрутов с динамическими параметрами после дефиса.

- **Старое поведение**: `path="prefix-:id"` → при URL `/prefix-123` → `params.id = "123"`
- **Новое поведение**: такой синтаксис больше НЕ поддерживается

Роут `/uslugi/dezinfekciya-:districtId` не матчится, запросы попадают в `/uslugi/:slug`, где ServicePage ищет сервис по slug="dezinfekciya-cao" и не находит — отсюда 404.

---

## Решение: Обрабатывать округа внутри ServicePage

Вместо отдельного роута для округов, расширим логику ServicePage для определения, является ли slug страницей округа.

### Изменения в `src/pages/ServicePage.tsx`

```tsx
import { getDistrictBySlug } from '@/data/districtPages';
import DistrictPage from './DistrictPage';

const ServicePage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Проверяем, является ли это страницей округа
  const district = getDistrictBySlug(slug || "");
  if (district) {
    // Рендерим DistrictPage напрямую с переданным district
    return <DistrictPageContent district={district} />;
  }
  
  // Обычная логика сервисной страницы
  const service = getServiceBySlug(slug || "");
  if (!service) {
    return <NotFound />;
  }
  // ...остальной код
};
```

### Изменения в `src/App.tsx`

Удалить отдельный роут для округов:

```tsx
// УДАЛИТЬ эту строку:
<Route path="/uslugi/dezinfekciya-:districtId" element={<DistrictPage />} />
```

Роут `/uslugi/:slug` уже существует и будет обрабатывать все случаи.

### Изменения в `src/pages/DistrictPage.tsx`

Экспортировать внутренний компонент для использования в ServicePage:

```tsx
// Новый экспорт для использования из ServicePage
export const DistrictPageContent = ({ district }: { district: DistrictPage }) => {
  // Вся логика рендеринга страницы округа
};

// Основной компонент для прямых переходов (если останутся)
const DistrictPage = () => {
  const { districtId } = useParams<{ districtId: string }>();
  const district = districtId ? getDistrictById(districtId) : undefined;
  
  if (!district) {
    return <Navigate to="/uslugi/po-okrugam-moskvy" replace />;
  }
  
  return <DistrictPageContent district={district} />;
};
```

---

## Файлы для изменения

| Файл | Изменения |
|------|-----------|
| `src/App.tsx` | Удалить роут `dezinfekciya-:districtId` |
| `src/pages/ServicePage.tsx` | Добавить проверку на округ через `getDistrictBySlug()` |
| `src/pages/DistrictPage.tsx` | Экспортировать `DistrictPageContent` |

---

## Ожидаемый результат

После исправления:
- `/uslugi/dezinfekciya-cao` → ServicePage определит округ → отрендерит DistrictPageContent
- `/uslugi/dezinfekciya-nao` → аналогично
- `/uslugi/dezinfekciya-zelao` → аналогично
- `/uslugi/dezinfekciya` → обычная страница сервиса
- Все 12 округов будут работать корректно
