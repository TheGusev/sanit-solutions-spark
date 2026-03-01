

# SEO-расширение GoRuslugimsk.ru: 568 → ~1000 страниц

## Масштаб и фазировка

Весь план разбит на **5 этапов**, каждый выполняется отдельным запросом. Это критично для стабильности сборки.

---

## ЭТАП 1 — Квалификаторы и методы (≈20 новых страниц)

### 1A. Новые subpage-роуты в `src/lib/seoRoutes.ts`
Добавить 13 записей в `serviceSubpageRoutes`:
- `klopov-v-kvartire`, `postelnyh-klopov`, `domashnih-klopov`, `tarakanov-v-kvartire`, `klopov-i-tarakanov`, `klopov-i-bloh`, `blokh-ot-zhivotnyh` (квалификаторы)
- `holodnym-tumanom`, `parom`, `parogeneratorom`, `bez-zapaha`, `srochno`, `kruglosutochno` (методы)

### 1B. Контент в `src/data/serviceSubpages.ts`
Добавить 13 объектов типа `ServiceSubpage` с полными данными: h1, metaTitle, metaDescription, faq (5 шт), pricing, process, advantages.

### 1C. Роутинг — проверка `ServiceRouteResolver`
Эти subpage уже перехватываются первым приоритетом в `ServiceRouteResolver` через `getSubpageByPath()`. Новых роутов в `App.tsx` не нужно.

### 1D. Исправить гарантию в существующих subpages
В `serviceSubpages.ts` заменить все `"Гарантия 1 год"` / `"до 1 года"` → `"до 3 лет"` (≈15 мест в 6 существующих subpage).

**Итого этап 1: +13 страниц, 2 файла**

---

## ЭТАП 2 — Новые вредители и объекты (≈80 новых страниц)

### 2A. Новые вредители в `src/data/pests.ts`
Добавить 6 вредителей: `komary`, `muhi`, `osy-shershni`, `cheshuynitsy`, `kleshchi`, `mokricy` — с полными данными (склонения, tariffs, returnReasons, heroBullets).

### 2B. Обновить `seoRoutes.ts`
- В `dezinsekciyaPestSlugs` добавить новые slug'и
- Автоматически генерируются: 6 pest-страниц + 6×15 = 90 НЧ-страниц

### 2C. Новые объекты в `src/data/objects.ts`
Добавить 5 объектов: `gostinic`, `detskih-sadov`, `hostela`, `magazinov`, `avtomobiley` — с правильными склонениями. Обновить интерфейс `ObjectType` если нужно.

### 2D. Обновить `objectSlugs` в `seoRoutes.ts`
+5 объектов × 5 услуг = +25 страниц услуга+объект.

**Итого этап 2: ≈120 новых страниц, 3 файла**

---

## ЭТАП 3 — Новые standalone страницы (+3 страницы)

### 3A. `/sluzhba-dezinsekcii` — Страница "Служба дезинсекции"
- Создать `src/pages/ServiceSESPage.tsx`
- Добавить Route в `App.tsx`
- Добавить в `seoRoutes.ts` (static)
- SEOHead, Schema.org LocalBusiness, FAQ

### 3B. `/otzyvy` — Страница отзывов
- Создать `src/pages/ReviewsPage.tsx`
- Подтягивать отзывы из БД (таблица `reviews`)
- Schema.org AggregateRating
- Добавить Route + SSG

### 3C. `/uslugi/obrabotka-uchastkov` — Обработка участков
- Создать `src/pages/ServiceLandingUchastkiPage.tsx`
- Закрывает кластеры: клещи, борщевик, комары на участке
- Добавить Route + SSG

### 3D. Перелинковка
- Добавить ссылки на 3 новые страницы в `Footer.tsx`
- Добавить в `InternalLinks.tsx`

**Итого этап 3: +3 страницы, 5-6 файлов**

---

## ЭТАП 4 — Гео-расширение (≈140 новых страниц)

### 4A. Дезинфекция по 130 районам
В `getAllSSGRoutes()` добавить цикл: `/uslugi/dezinfekciya/${neighborhoodSlug}` для всех 130 районов. Компонент `ServiceDistrictPage` уже существует и обрабатывается `ServiceRouteResolver`.

### 4B. Расширение МО
Добавить 4 города: `klin`, `ramenskoe`, `chekhov`, `domodedovo` (с проверкой что данные валидны). +4 города × (1 + 4 услуги) = +20 страниц.

### 4C. Склонения районов для НЧ-страниц
- Добавить поле `prepositional?: string` в интерфейс `Neighborhood`
- Заполнить для 15 topNeighborhoods (с fallback на именительный)
- Обновить `NchPage.tsx` для использования `prepositional` в Title/H1

**Итого этап 4: ≈150 новых страниц, 4-5 файлов**

---

## ЭТАП 5 — Финальные исправления и QA

### 5A. Оставшиеся гарантии
Найти и заменить все `"Гарантия 1 год"` / `"до 1 года"` / `"30 дней"` в:
- `objects.ts` (features массивы)
- `neighborhoods.ts` (genDescription, genFAQ)
- `services.ts` (если осталось)
- Все остальные data-файлы

### 5B. Перелинковка
- Обновить `InternalLinks.tsx` — новые subpage в блоке рекомендаций
- Обновить Footer — ссылки на новые разделы

### 5C. QA-проверки
- TypeScript типизация
- SSG: нет undefined в путях
- Все страницы: SEOHead/Helmet, canonical, Schema.org
- Формы заявки работают

---

## Сводка по этапам

| Этап | Новых страниц | Файлов | Риск |
|---|---|---|---|
| 1. Квалификаторы | ~13 | 2 | Низкий |
| 2. Вредители+Объекты | ~120 | 3 | Средний |
| 3. Standalone | 3 | 5-6 | Низкий |
| 4. Гео | ~150 | 4-5 | Средний |
| 5. QA+Гарантии | 0 | 5-10 | Низкий |
| **ИТОГО** | **~286** | — | — |

**Финальный итог: 568 + 286 ≈ 854 страницы** (с НЧ-расширением на новых вредителей до ~1000).

Какой этап запускать первым?

