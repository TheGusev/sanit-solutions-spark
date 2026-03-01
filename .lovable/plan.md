

## План исправления грамматики и склонений по всему фронтенду

---

### Проблемы

1. **«Тарифы на дезинфекция»** — `ServiceTariffs.tsx` строка 28: `serviceTitle.toLowerCase()` даёт именительный падеж
2. **~80+ районов без `prepositional`** — Басманный, Красносельский, Мещанский, Таганский, Якиманка, Беговой, Войковский, Головинский, Коптево, Тимирязевский, Ховрино, Савёловский, все СВАО (кроме Бабушкинского), все ВАО, и далее
3. **`ServiceDistrictPage.tsx`** — 12+ вхождений `в {neighborhood.name}` в FAQ, карточках, Schema.org, CTA
4. **`ServiceObjectDistrictPage.tsx`** — 10+ вхождений `в {neighborhood.name}` + `"до 1 года"` в FAQ (строка 83)
5. **`genFAQ()` в `neighborhoods.ts`** — 5 вопросов с `в ${name}` (именительный)
6. **`ServicePestPage.tsx` строка 59** — fallback `'до 1 года'`
7. **`services.ts` строка 167** — `guaranteeYears: "до 1 года"` у дезинфекции

---

### ШАГ 1: Добавить `nameAccusative` в интерфейс и данные услуг

**Файл: `src/data/services.ts`**

Добавить в интерфейс `ServicePage`:
```ts
nameAccusative?: string; // "дезинфекцию", для "Тарифы на..."
nameGenitive?: string;   // "дезинфекции", для "Стоимость..."
```

Заполнить для 7 услуг:
| slug | title | nameAccusative | nameGenitive |
|------|-------|---------------|--------------|
| dezinfekciya | Дезинфекция | дезинфекцию | дезинфекции |
| dezinsekciya | Дезинсекция | дезинсекцию | дезинсекции |
| deratizaciya | Дератизация | дератизацию | дератизации |
| ozonirovanie | Озонирование | озонирование | озонирования |
| dezodoraciya | Дезодорация | дезодорацию | дезодорации |
| demerkurizaciya | Демеркуризация | демеркуризацию | демеркуризации |
| borba-s-krotami | Борьба с кротами | борьбу с кротами | борьбы с кротами |

Исправить `guaranteeYears: "до 1 года"` → `"до 3 лет"` у дезинфекции.

### ШАГ 2: Обновить `ServiceTariffs.tsx`

Добавить проп `serviceAccusative?: string`. Строка 28:
```tsx
// БЫЛО: Тарифы на {serviceTitle.toLowerCase()}
// СТАЛО: Тарифы на {serviceAccusative || serviceTitle.toLowerCase()}
```

### ШАГ 3: Обновить вызовы `ServiceTariffs` в `ServicePage.tsx` и `ServicePestPage.tsx`

- `ServicePage.tsx` строка 313: передать `serviceAccusative={service.nameAccusative}`
- `ServicePestPage.tsx` строка 291-294: `serviceAccusative` уже получается из `Уничтожение ${pest.genitive}` — это корректно для фразы "Тарифы на уничтожение клопов". Передать как проп.
- `ServicePestPage.tsx` строка 59: `'до 1 года'` → `'до 3 лет'`

### ШАГ 4: Добавить `prepositional` ко ВСЕМ ~80+ районам без него

**Файл: `src/data/neighborhoods.ts`**

Добавить `prepositional` ко всем районам, у которых его нет. Примеры:
- Басманный → `'в Басманном районе'`
- Красносельский → `'в Красносельском районе'`
- Мещанский → `'в Мещанском районе'`
- Таганский → `'в Таганском районе'`
- Якиманка → `'в Якиманке'`
- Беговой → `'в Беговом районе'`
- Войковский → `'в Войковском районе'`
- Головинский → `'в Головинском районе'`
- Коптево → `'в Коптево'`
- Тимирязевский → `'в Тимирязевском районе'`
- Ховрино → `'в Ховрино'`
- и все остальные (~80 штук)

Сделать поле **обязательным** в интерфейсе (`prepositional: string` без `?`).

### ШАГ 5: Исправить `genFAQ()` в `neighborhoods.ts`

Строки 50-72: функция принимает `name` → добавить параметр `prepositional`:
```ts
// БЫЛО: `Сколько стоит дезинфекция в ${name}?`
// СТАЛО: `Сколько стоит дезинфекция ${prepositional}?`
```

Обновить все 5 FAQ-вопросов. Обновить все вызовы `genFAQ()` — передавать `prepositional`.

### ШАГ 6: Заменить `в {neighborhood.name}` на `{locationText}` в компонентах

**`ServiceDistrictPage.tsx`** — 12 вхождений:
- Добавить `const locationText = neighborhood.prepositional || "в " + neighborhood.name;`
- FAQ (строки 70-74): заменить `в ${neighborhood.name}` → `${locationText}`
- Schema.org (строки 79-80): заменить
- Карточки (строки 144, 155): заменить
- H2 виды работ (строка 171): заменить
- CTA (строка 202): заменить
- H1 (строка 128): оставить `в районе {neighborhood.name}` (грамматически верно)

**`ServiceObjectDistrictPage.tsx`** — 10 вхождений:
- Аналогичная замена во всех текстовых блоках
- FAQ строка 83: `'до 1 года'` → `'до 3 лет'`

### ШАГ 7: Обновить тест `ServiceTariffs.test.tsx`

Обновить пропсы под новый интерфейс (добавить `serviceAccusative`).

---

### Масштаб изменений

| Файл | Суть правки |
|------|-------------|
| `src/data/services.ts` | +`nameAccusative`/`nameGenitive` в интерфейс и 7 записей, fix гарантия |
| `src/components/ServiceTariffs.tsx` | Новый проп `serviceAccusative` |
| `src/pages/ServicePage.tsx` | Передать `nameAccusative` |
| `src/pages/ServicePestPage.tsx` | Передать `serviceAccusative` + fix гарантия |
| `src/data/neighborhoods.ts` | +`prepositional` для ~80 районов, обязательное поле, fix `genFAQ()` |
| `src/pages/ServiceDistrictPage.tsx` | 12 замен `в {name}` → `{locationText}` |
| `src/pages/ServiceObjectDistrictPage.tsx` | 10 замен + fix гарантия |
| `src/components/__tests__/ServiceTariffs.test.tsx` | Обновить тест |

