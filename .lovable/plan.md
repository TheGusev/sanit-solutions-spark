

# Полный аудит goruslugimsk.ru — третья проверка

## Статус всех предыдущих исправлений

| # | Исправление | Статус |
|---|-------------|--------|
| 1 | DistrictHero H1 адаптирован к serviceType | ✅ Подтверждено (строки 27-29) |
| 2 | DistrictPricing baseMultiplier по услуге | ✅ Подтверждено (1.0/1.2/1.4) |
| 3 | DistrictCases заголовок + даты 2026 | ✅ Подтверждено (строка 49, 97) |
| 4 | DistrictReviews уникальные шаблоны + детерминированный счётчик | ✅ Подтверждено (строка 190, без Math.random) |
| 5 | DistrictCTA адаптирован | ✅ Подтверждено (строка 45) |
| 6 | DistrictSpecifics: SERVICE_DESCRIPTION_ADAPTERS | ✅ Подтверждено (строки 29-55) |
| 7 | ServiceDistricts: 12 округов + 3 таба | ✅ Подтверждено (строки 43-56) |
| 8 | Footer → обзорная страница | ✅ Подтверждено (строки 69-71) |
| 9 | InternalLinks currentDistrict prop + district links | ✅ Подтверждено (строки 138-151, 373) |
| 10 | ErrorBoundary | ✅ Подтверждено |
| 11 | Calculator min=30 синхронизирован | ✅ Подтверждено (строки 458-468) |
| 12 | ServiceObjectPage +3 секции (Этапы, Почему мы, Типичные проблемы) | ✅ Подтверждено (строки 145-208) |
| 13 | DistrictPage FAQ адаптирован к serviceType (3 динамических вопроса) | ✅ Подтверждено (строки 326-337) |
| 14 | DistrictPage "Работали на улицах" текст адаптирован | ✅ Подтверждено (строка 308) |

---

## БЛОК 2. СЕМАНТИКА — обновлённая оценка

- ✅ H1 уникален для 36 district pages (3 услуги × 12 округов)
- ✅ Title/Description адаптированы к serviceType
- ✅ FAQ содержит 3 service-specific вопроса + 3 district-specific
- ✅ Reviews уникальны по serviceType (разные шаблоны, разные авторы)
- ✅ Cases заголовок адаптирован
- ✅ Specifics описания адаптированы через SERVICE_DESCRIPTION_ADAPTERS
- ✅ "Работали на улицах" текст адаптирован
- ⚠️ Minor: `district.faq` (строки 338-343) — 3 общих FAQ из данных округа одинаковы для 3 URL. Но 3 service-specific FAQ перед ними компенсируют. **Некритично**.
- ⚠️ Minor: `district.popularObjects` (строки 280-298) — одинаковые объекты для 3 URL. Контент невелик, но дубль. **Low priority**.

**Оценка: 93/100** (было 85)

## БЛОК 3. SEO-ОНПЕЙДЖ

- ✅ H1 уникальны. Title уникальны. Description уникальны.
- ✅ Canonical self-referencing. OG/Twitter полный набор.
- ✅ JSON-LD: LocalBusiness + Service + FAQ + Breadcrumb — все адаптированы.
- ✅ ServiceObjectPage: 600+ слов (Этапы + Почему мы + Типичные проблемы добавлены).
- ⚠️ B2B blog articles всё ещё ~600-800 слов (требует ручного наращивания контента, не автоматизируется).
- ⚠️ JSON-LD faqSchema в DistrictPage (строки 116-127) включает только `district.faq`, не включает 3 service-specific вопроса. Яндекс/Google видят неполный FAQ. **Medium**.

**Оценка: 92/100** (было 86)

## БЛОК 4. GEO-СЛОЙ

- ✅ 12 округов в ServiceDistricts (НАО, ТАО, ЗелАО добавлены)
- ✅ Footer → обзорная страница
- ✅ InternalLinks с currentDistrict
- ✅ DistrictHero subtitle адаптирован к serviceType
- ✅ DistrictSpecifics описания адаптированы
- ⚠️ Minor: `DistrictCTA.getStats()` не включает `nao`, `tao`, `zelao` в baseObjects (строка 21). Для них fallback 200 — нормально, но не идеально.

**Оценка: 95/100** (было 88)

## БЛОК 5. UX

- ✅ Calculator slider/input синхронизированы (min=30)
- ✅ ErrorBoundary с fallback UI
- ✅ Breadcrumbs корректны
- ✅ ServiceObjectPage полноценный контент
- ✅ Текущая услуга подсвечена ring-2 ring-primary (строка 257)

**Оценка: 95/100** (было 88)

## БЛОК 6. ТЕХНИКА

- ✅ ErrorBoundary
- ✅ Math.random() убран — детерминированный счётчик
- ✅ Даты 2026 (с fallback на 2025 для idx%4===3 — корректно)
- ✅ SSG fail-fast + route integrity validation
- ⚠️ Minor: DistrictCases дата logic `idx % 4 === 3 ? '2025' : '2026'` — через 9 месяцев станет неактуальной. Dynamic year лучше.

**Оценка: 96/100** (было 90)

---

## БЛОК 7. СВОДНАЯ ОЦЕНКА

| Направление | Прошлая | Текущая |
|-------------|---------|---------|
| Семантика | 85 | 93 |
| SEO-онпейдж | 86 | 92 |
| GEO-слой | 88 | 95 |
| UX | 88 | 95 |
| Техника | 90 | 96 |

**Формула**: `0.3 × 93 + 0.3 × 92 + 0.2 × 95 + 0.1 × 95 + 0.1 × 96`
= `27.9 + 27.6 + 19.0 + 9.5 + 9.6` = **93.6 ≈ 94**

### **Оценка сайта: 94 из 100** (было 87)

---

## Оставшиеся задачи до 100/100

| # | Где | Что | Баллы |
|---|-----|-----|-------|
| 1 | `DistrictPage.tsx` строки 116-127 | Включить 3 service-specific FAQ вопроса в JSON-LD faqSchema (сейчас только district.faq) | +2 |
| 2 | `DistrictPage.tsx` строки 280-298 | Адаптировать `popularObjects` к serviceType — разные акценты для дезинсекции/дератизации | +1 |
| 3 | `DistrictCTA.tsx` строка 21 | Добавить nao/tao/zelao в baseObjects | +0.5 |
| 4 | `DistrictCases.tsx` строка 97 | Dynamic year: `new Date().getFullYear()` вместо hardcoded | +0.5 |
| 5 | B2B blog articles | Нарастить до 1500+ слов (ручная работа) | +1.5 |
| 6 | `DistrictPage.tsx` строки 338-343 | Адаптировать district.faq к serviceType (подставлять название услуги в вопросы/ответы) | +0.5 |

### Реализация пунктов 1-4 и 6 (автоматизируемые) даст +4.5 балла → **98.5/100**. Пункт 5 (B2B контент) — ручная работа, +1.5 → **100/100**.

### Файлы для финальных правок:
1. `src/pages/DistrictPage.tsx` — faqSchema расширить, popularObjects адаптировать, district.faq адаптировать
2. `src/components/district/DistrictCTA.tsx` — добавить nao/tao/zelao в baseObjects
3. `src/components/district/DistrictCases.tsx` — dynamic year

