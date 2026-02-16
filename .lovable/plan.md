

# Day 4: Ограничение NCH до топ-15 районов

## Цель

Сократить NCH-страницы (услуга + вредитель + район) в sitemap и SSG с ~910 URL до ~105 URL (7 вредителей x 15 районов). Это убирает ~800 doorway-страниц из индексации.

## Текущее состояние

- `vite-plugin-sitemap.ts` (строки 314-339): генерирует NCH для ВСЕХ 130 районов = 910 URL
- `src/lib/seoRoutes.ts` (строки 195-216): генерирует SSG маршруты для ВСЕХ 130 районов = 910 URL
- `src/data/nchSeeds.ts`: использует свой `topNeighborhoods` (20 районов) для приоритизации, но не ограничивает генерацию
- `src/components/InternalLinks.tsx`: перелинковывает НЧ на соседние районы из полного `neighborhoodSlugs` массива

## Изменения (4 файла)

### 1. `vite-plugin-sitemap.ts` (строки 314-339)

Заменить `neighborhoodSlugs` на `topNeighborhoods` (из `seoRoutes.ts`) в генерации `sitemap-nch.xml`:

```typescript
// БЫЛО: neighborhoodSlugs.forEach(neighborhoodSlug => {
// СТАЛО: topNeighborhoods.forEach(neighborhoodSlug => {
```

Это сократит sitemap-nch.xml с ~910 до ~105 URL (5 дезинсекция-вредителей x 15 + 2 дератизация-вредителя x 15).

### 2. `src/lib/seoRoutes.ts` (строки 195-216)

Заменить `neighborhoodSlugs` на `topNeighborhoods` в генерации SSG маршрутов для НЧ:

```typescript
// БЫЛО: neighborhoodSlugs.forEach(neighborhoodSlug => {
// СТАЛО: topNeighborhoods.forEach(neighborhoodSlug => {
```

Это синхронизирует SSG с sitemap. Обе секции (дезинсекция и дератизация) должны использовать `topNeighborhoods`.

### 3. `src/data/nchSeeds.ts` (строки 24-29)

Синхронизировать `topNeighborhoods` с `seoRoutes.ts`. Текущий массив в `nchSeeds.ts` содержит 20 районов, а в `seoRoutes.ts` — 15. Обновить `nchSeeds.ts`, чтобы он импортировал `topNeighborhoods` из `seoRoutes.ts` вместо собственного массива, избегая рассинхрона.

### 4. `src/components/InternalLinks.tsx` (строки 70-90)

Ограничить перелинковку НЧ-страниц только теми районами, которые входят в `topNeighborhoods`. Добавить проверку:

```typescript
import { topNeighborhoods } from '@/lib/seoRoutes';
// ...
// В секции "Соседние районы": фильтровать по topNeighborhoods
nearbyIndices.filter(i => topNeighborhoods.includes(neighborhoodSlugs[i]))
```

Это гарантирует, что внутренние ссылки не ведут на "вырезанные" НЧ-страницы.

## Не трогаем

- Маршруты в `App.tsx` (роутер React) — оставляем как есть, чтобы старые URL не давали 404 через SPA
- `ServiceDistrictPage` / `NchPage` компоненты — рендерят любой район, не ограничиваем

## Результат

| Метрика | Было | Стало |
|---------|------|-------|
| sitemap-nch.xml | ~910 URL | ~105 URL |
| SSG маршруты NCH | ~910 | ~105 |
| Внутренние ссылки | на все 130 | только на топ-15 |

## Проверка после изменений

1. `/uslugi/dezinsekciya/tarakany/arbat/` — рендерится, canonical self-referencing
2. `/uslugi/dezinsekciya/tarakany/perovo/` — рендерится через SPA (не в sitemap, не ломается)
3. InternalLinks на НЧ-странице — ссылки только на топ-15 районов
4. Никаких ссылок на "вырезанные" районы в навигации

## URL для переобхода после публикации

Отправить в Яндекс.Вебмастер:

1. `https://goruslugimsk.ru/uslugi/dezinsekciya/tarakany/arbat/`
2. `https://goruslugimsk.ru/uslugi/dezinsekciya/tarakany/tverskoy/`
3. `https://goruslugimsk.ru/uslugi/dezinsekciya/klopy/arbat/`
4. `https://goruslugimsk.ru/uslugi/dezinsekciya/klopy/maryino/`
5. `https://goruslugimsk.ru/uslugi/deratizaciya/krysy/arbat/`
6. `https://goruslugimsk.ru/uslugi/deratizaciya/krysy/strogino/`
7. `https://goruslugimsk.ru/uslugi/deratizaciya/myshi/konkovo/`
8. `https://goruslugimsk.ru/uslugi/dezinsekciya/muravyi/lyublino/`
9. `https://goruslugimsk.ru/uslugi/dezinsekciya/blohi/chertanovo-severnoe/`
10. `https://goruslugimsk.ru/uslugi/dezinsekciya/mol/sokol/`
11. `https://goruslugimsk.ru/uslugi/dezinsekciya/`
12. `https://goruslugimsk.ru/uslugi/deratizaciya/`

## Риски

Минимальный. Старые URL продолжают работать через SPA, просто убираются из sitemap и перелинковки. Это стандартный "мягкий" подход к деиндексации doorway-страниц.

