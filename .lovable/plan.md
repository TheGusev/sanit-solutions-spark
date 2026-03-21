

# Fix: Grammar and declension errors in ServiceObjectPage

## Problem

`ServiceObjectPage.tsx` uses `serviceName.toLowerCase()` (nominative: "дезинсекция") everywhere, but many contexts require **genitive** ("дезинсекции") or **accusative** ("дезинсекцию"). The `ServicePage` interface already has `nameGenitive` and `nameAccusative` fields — they're just not being used.

### All grammar errors found

| Line | Current (broken) | Correct | Case needed |
|------|-----------------|---------|-------------|
| 47 | "Профессиональная дезинсекция" | OK for -ция, but **"Профессиональная озонирование"** is wrong (neuter) | Gender-aware adjective |
| 148 | "Этапы **дезинсекция** квартиры" | "Этапы **дезинсекции** квартиры" | Genitive |
| 151 | "тип **квартиры**" | "тип **квартиры**" ✅ | OK |
| 154 | "Проводим **дезинсекция** методом" | "Проводим **дезинсекцию** методом" | Accusative |
| 170 | "для **дезинсекция** квартиры" | "для **дезинсекции** квартиры" | Genitive |
| 173 | "на **дезинсекция** квартиры" | "в области **дезинсекции** квартиры" | Genitive (rephrase to avoid prepositional mismatch with "озонирование") |
| 176 | "акт **дезинфекции**" (hardcoded) | "акт **дезинсекции**" (dynamic) | Genitive |
| 192 | "Типичные проблемы **квартиры**" | "Типичные проблемы **при обработке** квартиры" | Rephrase for clarity |
| 228 | "Закажите **дезинсекция** квартиры" | "Закажите **дезинсекцию** квартиры" | Accusative |

## Solution

### File: `src/pages/ServiceObjectPage.tsx`

1. **Extract declension variables** at line ~43:
```typescript
const serviceName = service.title; // nominative: "Дезинсекция"
const serviceGen = service.nameGenitive || serviceName.toLowerCase(); // "дезинсекции"
const serviceAcc = service.nameAccusative || serviceName.toLowerCase(); // "дезинсекцию"
```

2. **Fix each line:**

- **L47 (meta description)**: Replace `Профессиональная ${serviceName.toLowerCase()}` with gender-aware: `Профессиональная` for `-ция`/`-ация` words, `Профессиональное` for "озонирование". Use helper: `serviceName.endsWith('ие') ? 'Профессиональное' : 'Профессиональная'`

- **L148**: `Этапы ${serviceGen} ${objectType.genitive}` → "Этапы дезинсекции квартиры"

- **L154**: `Проводим ${serviceAcc} методом...` → "Проводим дезинсекцию методом..."

- **L170**: `для ${serviceGen} ${objectType.genitive}` → "для дезинсекции квартиры"

- **L173**: `в области ${serviceGen} ${objectType.genitive}` → "в области дезинсекции квартиры" (avoids prepositional case mismatch for "озонирование")

- **L176**: Replace hardcoded "акт дезинфекции" → `акт ${serviceGen}` → "акт дезинсекции"

- **L192**: `Типичные проблемы при обработке ${objectType.genitive}` → cleaner phrasing

- **L228**: `Закажите ${serviceAcc} ${objectType.genitive}` → "Закажите дезинсекцию квартиры"

### No other files need changes
All declension data (`nameGenitive`, `nameAccusative`) already exists in `src/data/services.ts` for all 7 services.

