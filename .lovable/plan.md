

# Обновление regex в seoValidation.ts

## Изменения

### Файл: `src/lib/seoValidation.ts`

**1. `extractTitle` (строка 99):**
```typescript
// БЫЛО:
const match = html.match(/<title>([^<]+)<\/title>/i);
// СТАЛО:
const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
```

**2. `extractDescription` (строка 106):**
```typescript
// БЫЛО:
const match = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
// СТАЛО:
const match = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i);
```

Один файл, две строки. Приводит в соответствие с уже обновлёнными regex в `vite-plugin-ssg.ts`.

