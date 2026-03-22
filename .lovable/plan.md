

# Исправление удалённых doorway-страниц `/uslugi/dezinfekciya/[район]/`

## Что происходит

На скриншоте видны два типа страниц:

### 1. Проблема: `/uslugi/dezinfekciya/basmannyy/`, `/dorogomilovo/`, `/tverskoy/`, `/zamoskvorechye/`
Эти страницы **были удалены** из SSG (строка 301 в `vite-plugin-ssg.ts`: `// REMOVED: /uslugi/dezinfekciya/[neighborhood] doorway pages`). Теперь при заходе на них:
- SPA fallback отдаёт `index.html` с **HTTP 200**
- React-роутер рендерит `<NotFound />` на клиенте
- Яндекс видит **200 + пустой контент** = "малоценная страница"

Это **мягкий 404** — самый вредный сценарий для SEO. Нужно отдавать **301 → /rajony/[район]/**.

### 2. Нормально: NCH-страницы (клопы/тараканы + район)
`/uslugi/dezinsekciya/klopy/maryino/`, `/tarakany/khamovniki/` и т.д. — это рабочие НЧ-страницы. Статус "маловостребованная" — **нормально** для новых нишевых страниц. Они в индексе, просто Яндекс пока не видит спрос.

### 3. Нормально: `/uslugi/dezinfekciya/hostela/`
Объектная страница, статус "Каноническая" — всё правильно.

## Решение

### `src/pages/ServiceRouteResolver.tsx` — добавить редирект

Если `subSlug` совпадает с районом из `neighborhoods` — вернуть `<Navigate to={/rajony/${subSlug}/} replace />` вместо `<NotFound />`. Это работает для **всех** 130 районов автоматически, без 130 строк в `_redirects`.

```typescript
// После проверки pest и object:
import { neighborhoods } from '@/data/neighborhoods';
import { Navigate } from 'react-router-dom';

// 4. Если subSlug — район → 301 на /rajony/
const neighborhood = neighborhoods.find(n => n.slug === subSlug);
if (neighborhood) {
  return <Navigate to={`/rajony/${subSlug}/`} replace />;
}
```

Это решает проблему для **всех** URL вида `/uslugi/[любая-услуга]/[район]/` — редиректит на `/rajony/[район]/`.

### Файлы

| Файл | Правка |
|------|--------|
| `src/pages/ServiceRouteResolver.tsx` | +import neighborhoods, +Navigate; добавить проверку районов перед NotFound |

Одна правка в одном файле. Все 130 районов покрыты автоматически. Яндекс при следующем обходе получит 301 и перенесёт вес на `/rajony/` страницы.

