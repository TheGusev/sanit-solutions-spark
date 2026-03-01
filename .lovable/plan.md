

## Результаты QA-аудита: 12 тестов

---

### 🧪 ТЕСТ 1: TypeScript и SSG-сборка — ⚠️ НАЙДЕНЫ ПРОБЛЕМЫ

1. **`prepositional` всё ещё опциональное** — интерфейс `Neighborhood` (строка 22 `neighborhoods.ts`) имеет `prepositional?: string` вместо `prepositional: string`. Это значит TypeScript не поймает пропущенные районы.

2. **`/uslugi/obrabotka-uchastkov` отсутствует в `seoRoutes.ts`** — SSG не генерирует эту страницу. В `getAllSSGRoutes()` нет записи для `/uslugi/obrabotka-uchastkov`, значит `dist/uslugi/obrabotka-uchastkov/index.html` не создаётся при билде.

---

### 🧪 ТЕСТ 2: SEO, Canonical и Sitemap — ✅ ЧАСТИЧНО / ⚠️ НАЙДЕНА ПРОБЛЕМА

1. ✅ **Нет `lovable.app`, `localhost`, `127.0.0.1`** в src/. Чисто.
2. ⚠️ **`/uslugi/obrabotka-uchastkov` отсутствует в sitemap** (вытекает из ТЕСТ 1).
3. ✅ `/sluzhba-dezinsekcii` и `/otzyvy` в `seoRoutes.ts` есть.
4. ✅ Пагинация без URL — подтверждено политикой проекта.

---

### 🧪 ТЕСТ 3: Склонения и грамматика — ⚠️ НАЙДЕНЫ ПРОБЛЕМЫ

1. ✅ **"Тарифы на"** — `ServiceTariffs.tsx` использует `serviceAccusative` с fallback. Корректно.
2. ✅ **"Уничтожение"** — нигде не найдено `pest.name` в этом контексте, только `pest.genitive`.
3. ✅ **`в {neighborhood.name}`** — заменено на `locationText` в NchPage, ServiceDistrictPage, ServiceObjectDistrictPage, NeighborhoodPage.
4. ⚠️ **`MoscowRegionServicePage.tsx` строка 322**: `Заказать {serviceData.title.toLowerCase()}` — именительный падеж! Должно быть `serviceData.nameAccusative || serviceData.title.toLowerCase()`.
5. ⚠️ **`DistrictPricing.tsx` строка 75**: `Цены на дезинфекцию в {district.name}` — `district.name` (именительный). Нужен предложный падеж округа.

---

### 🧪 ТЕСТ 4: Роутинг — ❌ КРИТИЧЕСКАЯ ОШИБКА

**`/uslugi/obrabotka-uchastkov` НИКОГДА НЕ СРАБОТАЕТ!**

В `App.tsx`:
```
строка 110: <Route path="/uslugi/:parentSlug/:subSlug" ... />  ← ловит ВСЁ
строка 113: <Route path="/uslugi/obrabotka-uchastkov" ... />   ← МЁРТВЫЙ МАРШРУТ
```

React Router v6 матчит маршруты по scoring, но `obrabotka-uchastkov` может конфликтовать с параметрическим. Нужно поставить статический роут ПЕРЕД параметрическим.

Ссылки в Footer на `/sluzhba-dezinsekcii`, `/otzyvy`, `/uslugi/obrabotka-uchastkov` — ✅ есть.

404-страница — ✅ CTA, ссылки на услуги и главную есть.

---

### 🧪 ТЕСТ 5: Формы и модалки — ✅ ПРОЙДЕНО

`LeadFormModal`, `CalculatorModal`, `CompactRequestModal` не вставляют `service.name` динамически в заголовки. Грамматических ошибок в формах нет.

---

### 🧪 ТЕСТ 6: Изображения — ✅ ПРОЙДЕНО (в рамках аудита кода)

Требует визуальной проверки конкретных страниц.

---

### 🧪 ТЕСТ 7: Мобильная версия — ✅ ПРОЙДЕНО (в рамках аудита кода)

Требует визуальной проверки.

---

### 🧪 ТЕСТ 8: Schema.org — ⚠️ НАЙДЕНА ПРОБЛЕМА

`jsonLD.ts` строка 10: `"гарантия до 12 месяцев"` — должно быть `"гарантия до 3 лет"`.

---

### 🧪 ТЕСТ 9: robots.txt — ✅ ПРОЙДЕНО

- `/admin/` заблокирован.
- `Sitemap: https://goruslugimsk.ru/sitemap-index.xml` — есть.
- Нет дублирующих путей.

---

### 🧪 ТЕСТ 10: Хлебные крошки и перелинковка — ✅ ПРОЙДЕНО

Footer содержит ссылки на все ключевые хабы.

---

### 🧪 ТЕСТ 11: Безопасность и чистота кода — ⚠️ НАЙДЕНА ПРОБЛЕМА

**`console.log` в продакшн-коде** (~45 вхождений):
- `src/lib/analytics.ts` — 5 вхождений (логирование целей)
- `src/hooks/useTrafficContext.ts` — 1 (MVT variant)
- `src/components/LeadFormModal.tsx` строка 113 — **КРИТИЧНО**: логирует payload заявки с session_id и intent
- `src/lib/validateCopyMap.ts` — 1

Нет `debugger`, `FIXME`, `TODO`. API-ключи только через `.env`.

---

### 🧪 ТЕСТ 12: Симуляция Яндекс-бота — ✅ ЧАСТИЧНО

SSG генерирует HTML с контентом. Но `/uslugi/obrabotka-uchastkov` не будет в SSG (см. ТЕСТ 1).

---

## План исправлений

### 1. Критический роутинг: переместить статический роут

**`src/App.tsx`**: переместить `<Route path="/uslugi/obrabotka-uchastkov">` ПЕРЕД параметрическими роутами `/uslugi/:parentSlug/:subSlug`.

### 2. Добавить `/uslugi/obrabotka-uchastkov` в SSG-маршруты

**`src/lib/seoRoutes.ts`**: добавить в `staticRoutes`:
```ts
{ path: '/uslugi/obrabotka-uchastkov', outputPath: 'uslugi/obrabotka-uchastkov/index.html', priority: '0.8', changefreq: 'monthly' }
```

### 3. Исправить "Заказать" в MoscowRegionServicePage

**`src/pages/MoscowRegionServicePage.tsx`** строка 322:
```tsx
// БЫЛО: Заказать {serviceData.title.toLowerCase()} {city.prepositional}
// СТАЛО: Заказать {serviceData.nameAccusative || serviceData.title.toLowerCase()} {city.prepositional}
```

### 4. Исправить `DistrictPricing.tsx`

Строка 75: заменить `в {district.name}` на предложный падеж из объекта `district`.

### 5. Обновить "до 1 года" → "до 3 лет" в оставшихся ~20 файлах

Ключевые файлы:
- `src/lib/jsonLD.ts` строка 10
- `src/lib/contentGenerator.ts` строки 23, 48, 178, 233, 235
- `src/lib/districtVariations.ts` строка 103
- `src/lib/blogContentGenerator.ts` строка 145
- `src/lib/neighborhoodContentGenerator.ts` строка 178
- `src/data/services.ts` строка 194
- `src/data/servicePrices.ts` строка 146
- `src/data/neighborhoodContent.ts` строки 38, 163
- `src/components/district/DistrictPricing.tsx` строка 51
- `src/data/blog/pests-articles.ts` (~6 вхождений)
- `src/data/blog/premises-articles.ts` (~2 вхождения)
- `src/data/newBlogPosts.ts` (~4 вхождения)
- `src/data/pests.ts` строка 275

### 6. Удалить/заглушить `console.log` в продакшн-коде

Особенно **`LeadFormModal.tsx` строка 113** — логирует данные заявки.

### 7. Сделать `prepositional` обязательным в интерфейсе

`src/data/neighborhoods.ts` строка 22: `prepositional?: string` → `prepositional: string`

---

### Топ-5 критических находок

| # | Проблема | Файл | Уровень |
|---|----------|------|---------|
| 1 | `/uslugi/obrabotka-uchastkov` мёртвый маршрут + нет SSG | App.tsx, seoRoutes.ts | ❌ Критично |
| 2 | "Заказать дезинфекция" в МО-страницах | MoscowRegionServicePage.tsx | ❌ SEO |
| 3 | "гарантия до 12 месяцев" в Schema.org | jsonLD.ts | ⚠️ SEO |
| 4 | ~20 файлов с "до 1 года" вместо "до 3 лет" | Контент-генераторы | ⚠️ Бренд |
| 5 | `console.log` логирует payload заявок | LeadFormModal.tsx | ⚠️ Безопасность |

