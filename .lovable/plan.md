

# План: Исправление CORS для preview доменов Lovable

## Диагностика

**Причина ошибки**: Edge Functions блокируют запросы с нового preview домена Lovable.

```
Access to fetch at 'https://gimkzlozhwwgetlgtgvj.supabase.co/functions/v1/handle-lead' 
from origin 'https://51cb7089-b556-4c73-ad6d-780752106744.lovableproject.com' 
has been blocked by CORS policy
```

| Домен | Статус |
|-------|--------|
| `*.lovable.app` | ✅ Разрешён |
| `*.lovableproject.com` | ❌ НЕ разрешён |
| `goruslugimsk.ru` | ✅ Разрешён |

## Решение

Обновить файл `supabase/functions/_shared/cors.ts` — добавить поддержку домена `.lovableproject.com`.

## Изменение

**Файл**: `supabase/functions/_shared/cors.ts`

**Строка 33** — добавить второе условие:

```typescript
// Было:
origin.endsWith('.lovable.app')

// Станет:
origin.endsWith('.lovable.app') || origin.endsWith('.lovableproject.com')
```

## Полный код изменения

```typescript
export function getCorsHeaders(origin: string | null): Record<string, string> {
  // Check if origin is allowed
  const isAllowed = origin && (
    ALLOWED_ORIGINS.includes(origin) ||
    DEV_ORIGINS.includes(origin) ||
    // Allow all Lovable preview subdomains
    origin.endsWith('.lovable.app') ||
    origin.endsWith('.lovableproject.com')  // ← Новое условие
  );
  
  // ... остальной код без изменений
}
```

## Результат

После исправления:
1. Preview домен `*.lovableproject.com` будет разрешён
2. Форма калькулятора будет работать в preview режиме
3. Заявки будут сохраняться в БД
4. Telegram уведомления будут приходить

## Тестирование

После деплоя Edge Functions нужно будет повторить тест:
1. Открыть калькулятор
2. Заполнить форму
3. Нажать "Отправить заявку"
4. Проверить что появилось сообщение об успехе
5. Проверить Telegram — должно прийти уведомление

