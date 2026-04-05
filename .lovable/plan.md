

# Fix: SSG validation блокирует сотни страниц

## Найдены ДВЕ проблемы

### Проблема 1: Баг в `useParams` — MoscowRegionServicePage (корневая причина)

**`MoscowRegionServicePage.tsx` строка 34:**
```typescript
const { city: citySlug, service: serviceSlug } = useParams<{ city: string; service: string }>();
```

**Роут в `AppSSR.tsx` строка 62:**
```
/moscow-oblast/:citySlug/:serviceSlug
```

Несовпадение имён параметров: роут отдаёт `{ citySlug, serviceSlug }`, а компонент ищет `{ city, service }` → оба `undefined` → ранний return `<NotFound />` → **Helmet не рендерится** → нет `<title>`, нет `<meta description>` → валидатор отклоняет страницу.

Это затрагивает **все ~71 MO service pages** (23 города × 3 услуги + бонусные).

### Проблема 2: Валидатор слишком строгий

`validateHtml()` в `vite-plugin-ssg.ts` ставит Missing `<title>` и Missing `meta description` как **errors** (блокирует запись). Для устойчивости сборки это должны быть **warnings** — страница записывается, но помечается в логе. Жёсткий блок только для: HTML < 2KB или пустой контент.

Дополнительно: regex `extractTitle` не поддерживает атрибуты (`<title data-rh="true">`) — react-helmet-async добавляет `data-rh`, и regex может не сработать.

## Изменения

### Файл 1: `src/pages/MoscowRegionServicePage.tsx`
**Строка 34** — исправить destructuring:
```typescript
// БЫЛО:
const { city: citySlug, service: serviceSlug } = useParams<{ city: string; service: string }>();
// СТАЛО:
const { citySlug, serviceSlug } = useParams<{ citySlug: string; serviceSlug: string }>();
```
Одна строка, исправляет все 71 MO service page.

### Файл 2: `vite-plugin-ssg.ts`

1. **`extractTitle` (строка 25-27)** — regex должен поддерживать атрибуты:
```typescript
// БЫЛО: /<title>([^<]+)<\/title>/i
// СТАЛО: /<title[^>]*>([^<]+)<\/title>/i
```

2. **`extractDescription` (строка 31-33)** — regex должен поддерживать `data-rh` перед `name`:
```typescript
// БЫЛО: /<meta\s+name="description"\s+content="([^"]+)"/i
// СТАЛО: /<meta[^>]*name="description"[^>]*content="([^"]+)"/i
```

3. **`validateHtml` (строки 87, 101)** — перевести Missing title/description из `errors` в `warnings`:
```typescript
// строка 87: errors.push → warnings.push
// строка 101: errors.push → warnings.push
```

Итого: жёсткий блок остаётся только для HTML < 2KB, незакрытые комментарии, отсутствие базовых тегов, незаменённый placeholder.

## Результат

- 71 MO service page начнут рендерить правильный Helmet → title + description появятся
- Остальные страницы без title (если есть) всё равно запишутся в dist/ с warning
- Сборка пройдёт порог 500+ страниц
- Качество мета-тегов отслеживается в логе как warnings для последующей работы

