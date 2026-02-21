

# Исправление build ошибок: мусорный текст "demercurizaciya" и пропущенная функция

## Проблема

При редактировании на Day 2 во все 7 изменённых файлов попал артефакт -- строка `demercurizaciya` была вставлена в начало файлов (перед `import`/`export`). Это невалидный TypeScript, вызывающий ошибку `TS1434: Unexpected keyword or identifier`.

Дополнительно в `src/lib/seoRoutes.ts` отсутствует объявление функции `export function getAllSSGRoutes()` -- строка 107 начинается сразу с `const routes = [...]` без обёртки функции.

## Исправления (7 файлов)

### Строка 1: Убрать "demercurizaciya" из начала файлов

| Файл | Строка 1 сейчас | Строка 1 после |
|------|----------------|----------------|
| `src/components/Footer.tsx` | `demercurizaciyaimport { memo }...` | `import { memo }...` |
| `src/components/Header.tsx` | `demercurizaciyaimport { useState...` | `import { useState...` |
| `src/components/MiniPricing.tsx` | `demercurizaciyaimport { Microscope...` | `import { Microscope...` |
| `src/data/servicePrices.ts` | `demercurizaciyademercurizaciyaexport interface...` | `export interface...` |
| `src/data/services.ts` | `demercurizaciyaexport interface...` | `export interface...` |
| `src/pages/DistrictsOverview.tsx` | `demercurizaciyaimport { Helmet }...` | `import { Helmet }...` |
| `src/lib/seoRoutes.ts` | `demercurizaciya/**` | `/**` |

### `src/lib/seoRoutes.ts` строка 107-108: Восстановить функцию

```typescript
// БЫЛО (строки 107-108):
// Генерация всех маршрутов для SSG
  const routes = [...staticRoutes];

// СТАЛО:
export function getAllSSGRoutes() {
  const routes = [...staticRoutes];
```

Закрывающая `}` на строке 343 уже присутствует -- она станет корректным закрытием этой функции.

## Далее: продолжение плана SSG-синхронизации

После исправления build-ошибок -- выполнить план синхронизации `vite-plugin-ssg.ts`:

1. Заменить `'sertifikaciya'` на `'demerkurizaciya'` в массиве услуг
2. Удалить генерацию Услуга+Объект+Район (~2,400 doorway-страниц)
3. Ограничить NCH до `topNeighborhoods` (15 районов)

## Риски

Нулевой. Это исправление синтаксических ошибок -- восстановление корректного кода.

