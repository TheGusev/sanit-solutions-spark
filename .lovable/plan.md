

## План исправления грамматики и склонений

Обнаружены системные грамматические ошибки по всему фронтенду. Вот полный список проблем и план их исправления.

---

### Найденные проблемы

**1. «Тарифы на дезинфекция»** — `ServiceTariffs.tsx` строка 28 использует `serviceTitle.toLowerCase()` (именительный падеж). Результат: «Тарифы на дезинфекция» вместо «Тарифы на дезинфекцию».

**2. `ServicePage.tsx` строка 313** — передает `service.title` (именительный) в `ServiceTariffs`. Там же `ServicePestPage.tsx` строка 293 передает `Уничтожение ${pest.genitive}` — это корректно, но `ServiceTariffs` всё равно склеивает фразу «Тарифы на» + именительный.

**3. ~55 районов без `prepositional`** — в `neighborhoods.ts` у районов типа Басманный, Красносельский, Мещанский, Таганский, Якиманка и многих других **отсутствует** поле `prepositional`. Fallback в NchPage (`в ${neighborhood.name}`) дает «в Басманный», «в Таганский».

**4. `ServiceDistrictPage.tsx`** — 12+ вхождений `в {neighborhood.name}` (именительный вместо предложного): H1, subtitle, FAQ, карточки, CTA. Результат: «Дезинсекция в Басманный».

**5. `ServiceObjectDistrictPage.tsx`** — те же 10+ вхождений `в {neighborhood.name}` в H1, FAQ, карточках, CTA.

**6. `genFAQ()` в `neighborhoods.ts`** — строки 50-72: все 5 FAQ-вопросов используют `в ${name}` (именительный). Результат: «Как быстро вы приедете в Басманный?» вместо «в Басманный район».

**7. «Гарантия до 1 года»** в `ServiceObjectDistrictPage.tsx` строка 83 и `ServicePestPage.tsx` строка 59 — осталось `'до 1 года'`.

---

### План реализации

#### ШАГ 1: Добавить `nameAccusative` в интерфейс `ServicePage` и данные

Добавить поле `nameAccusative` в интерфейс (`services.ts`):
- `дезинфекцию`, `дезинсекцию`, `дератизацию`, `озонирование`, `дезодорацию`, `сертификацию`

Обновить `ServiceTariffs.tsx` — принимать `serviceAccusative` вместо `serviceTitle` в фразе «Тарифы на».

Обновить вызовы в `ServicePage.tsx` и `ServicePestPage.tsx`.

#### ШАГ 2: Добавить `prepositional` ко ВСЕМ районам

Пройтись по всем ~55 районам без `prepositional` в `neighborhoods.ts` и добавить корректные формы:
- Басманный → `'в Басманном районе'`
- Красносельский → `'в Красносельском районе'`  
- Мещанский → `'в Мещанском районе'`
- Таганский → `'в Таганском районе'`
- Якиманка → `'в Якиманке'`
- и т.д. для всех остальных

Сделать поле `prepositional` **обязательным** в интерфейсе (убрать `?`).

#### ШАГ 3: Заменить `в {neighborhood.name}` на `{neighborhood.prepositional}` в компонентах

Файлы для правки:
- `ServiceDistrictPage.tsx` — 12 вхождений (H1, subtitle, FAQ, карточки, CTA, schema)
- `ServiceObjectDistrictPage.tsx` — 10 вхождений
- `genFAQ()` в `neighborhoods.ts` — 5 вхождений

В H1 оставить формат «Дезинсекция в районе {neighborhood.name}» (именительный с предлогом «в районе» — грамматически верно). В текстовых блоках и FAQ — использовать `prepositional`.

#### ШАГ 4: Исправить оставшиеся «до 1 года»

- `ServiceObjectDistrictPage.tsx` строка 83: `'до 1 года'` → `'до 3 лет'`
- `ServicePestPage.tsx` строка 59: `pest.guaranteeYears || 'до 1 года'` → `pest.guaranteeYears || 'до 3 лет'`

#### ШАГ 5: Обновить тесты

- `ServiceTariffs.test.tsx` — обновить пропсы под новый интерфейс

---

### Масштаб изменений

| Файл | Суть правки |
|------|-------------|
| `src/data/services.ts` | +`nameAccusative` в интерфейс и 7 записей |
| `src/components/ServiceTariffs.tsx` | Новый проп `serviceAccusative` |
| `src/pages/ServicePage.tsx` | Передать `nameAccusative` |
| `src/pages/ServicePestPage.tsx` | Исправить гарантию + передать accusative |
| `src/data/neighborhoods.ts` | +`prepositional` для ~55 районов, `prepositional` обязательное |
| `src/pages/ServiceDistrictPage.tsx` | Заменить 12 вхождений `в {name}` на `{prepositional}` |
| `src/pages/ServiceObjectDistrictPage.tsx` | Заменить 10 вхождений + гарантию |
| `src/components/__tests__/ServiceTariffs.test.tsx` | Обновить тест |

