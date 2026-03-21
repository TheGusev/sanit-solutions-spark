

# Полный аудит goruslugimsk.ru — повторная проверка после исправлений

## Что было исправлено с прошлого аудита (74/100)

1. **DistrictHero.tsx** — H1 теперь адаптируется к serviceType (дезинсекция/дератизация). ✅
2. **DistrictPricing.tsx** — цены умножаются на baseMultiplier по услуге. ✅
3. **DistrictCases.tsx** — заголовок секции адаптирован к serviceType. ✅
4. **DistrictReviews.tsx** — уникальные отзывы для каждого serviceType. ✅
5. **DistrictCTA.tsx** — CTA адаптирован к услуге. ✅
6. **DistrictSpecifics.tsx** — заголовок адаптирован + добавлены НАО/ТАО/ЗелАО. ✅
7. **ServiceDistricts.tsx** — 12 округов + 3 таба. ✅
8. **Footer.tsx** — ссылки ведут на /uslugi/po-okrugam-moskvy (обзорная). ✅
9. **InternalLinks.tsx** — currentDistrict prop + district cross-links. ✅
10. **DistrictPage.tsx** — передаёт serviceType во все компоненты + currentDistrict в InternalLinks. ✅
11. **ErrorBoundary** — добавлен и обёрнут вокруг Routes. ✅
12. **Slider** — h-4 mobile, h-8 thumb, range 30-200. ✅

---

## БЛОК 1-6: ДЕТАЛЬНЫЙ ПОВТОРНЫЙ АУДИТ

### Семантика и LLM-развесовка — было 72, теперь:
- DistrictHero H1 уникален для 3 услуг ✅ (+8)
- DistrictReviews уникальны по serviceType ✅ (+3)
- DistrictCases заголовок адаптирован ✅ (+2)
- DistrictPricing цены уникальны ✅ (+3)
- **Остаточная проблема**: DistrictSpecifics описания (getDefaultSpecifics) одинаковые для всех 3 услуг — "Много бизнес-центров" одинаково для дезинфекции/дезинсекции/дератизации. Нужно адаптировать описания под услугу (например, "Дератизация бизнес-центров" vs "Дезинфекция бизнес-центров").
- **Остаточная проблема**: FAQ в DistrictPage — `district.faq` одинаковый для всех 3 URL (dezinfekciya-cao, dezinsekciya-cao, deratizaciya-cao). Нужно генерировать FAQ с учётом serviceType.
- **Остаточная проблема**: Секция "Мы уже работали на этих улицах" — одинаковый текст "провели обработку" для всех услуг. Нужно "провели дезинсекцию" / "провели дератизацию".
- **Остаточная проблема**: ServiceObjectPage контент ~400 слов — thin content.
- **Оценка: 85/100** (было 72)

### SEO-онпейдж — было 75, теперь:
- H1 дубли на district pages устранены ✅ (+5)
- Цены уникальны ✅ (+3)
- OG/canonical/robots — без изменений, были корректны ✅
- **Остаточная проблема**: ServiceObjectPage — мало контента (<600 слов), нет секции "Как мы работаем", "Этапы обработки" и т.д.
- **Остаточная проблема**: B2B blog articles <1500 слов.
- **Остаточная проблема**: DistrictPage FAQ не адаптирован к serviceType — дубль контента.
- **Оценка: 86/100** (было 75)

### GEO-слой — было 68, теперь:
- ServiceDistricts покрывает все 12 округов ✅ (+6)
- Footer ведёт на обзорную страницу ✅ (+3)
- InternalLinks передаёт currentDistrict ✅ (+4)
- DistrictHero H1/subtitle адаптированы ✅ (+5)
- **Остаточная проблема**: DistrictReviews строка 190: `Math.random()` в рендере — SSR/hydration mismatch, непредсказуемое число отзывов.
- **Остаточная проблема**: DistrictSpecifics описания не адаптированы к serviceType.
- **Оценка: 88/100** (было 68)

### UX — было 82, теперь:
- Slider mobile — thicker track/thumb ✅ (+2)
- ErrorBoundary защищает от white screen ✅ (+3)
- **Остаточная проблема**: Calculator slider 30-200 vs input 10-5000 — рассинхрон (minor).
- **Оценка: 88/100** (было 82)

### Техническая устойчивость — было 85, теперь:
- ErrorBoundary добавлен ✅ (+3)
- **Остаточная проблема**: DistrictReviews `Math.random()` в JSX — hydration mismatch при SSG.
- **Остаточная проблема**: DistrictCases дата `['Ноябрь', 'Октябрь', 'Сентябрь', 'Декабрь'][idx % 4] 2025` — hardcoded 2025, уже 2026.
- **Оценка: 90/100** (было 85)

---

## БЛОК 7. СВОДНАЯ ОЦЕНКА

| Направление | Прошлая | Текущая |
|-------------|---------|---------|
| Семантика и LLM-однозначность | 72 | 85 |
| SEO-онпейдж | 75 | 86 |
| GEO-слой | 68 | 88 |
| UX | 82 | 88 |
| Техническая устойчивость | 85 | 90 |

**Формула**: `0.3 × 85 + 0.3 × 86 + 0.2 × 88 + 0.1 × 88 + 0.1 × 90`
= `25.5 + 25.8 + 17.6 + 8.8 + 9.0` = **86.7 ≈ 87**

### **Оценка сайта: 87 из 100** (было 74)

---

## Оставшиеся проблемы до 100/100 — TOP-10 поправок

| # | Где | Что | Зачем | Баллы |
|---|-----|-----|-------|-------|
| 1 | `DistrictSpecifics.tsx` | Адаптировать описания specifics к serviceType (добавить SERVICE_SPECIFIC_DESCRIPTIONS для каждой услуги) | Сейчас описания "бизнес-центров", "парков" одинаковы для 3 URL — дубль контента | +3 |
| 2 | `DistrictPage.tsx` строки 297-312 | Адаптировать секцию "Мы уже работали" — текст "провели обработку" → "провели {svc.nameGenitive}" | Дубль текста на 3 URL | +1 |
| 3 | `DistrictPage.tsx` строки 315-327 | Адаптировать FAQ к serviceType — генерировать вопросы с упоминанием конкретной услуги | FAQ одинаковый для 3 URL — значительный дубль контента | +3 |
| 4 | `DistrictReviews.tsx` строка 190 | Заменить `Math.random()` на детерминированное значение (напр. `district.cases.length * 7 + 47`) | SSR hydration mismatch + непредсказуемый UI | +2 |
| 5 | `DistrictCases.tsx` строка 97 | Заменить `2025` на `2026` или dynamic year | Устаревшая дата | +1 |
| 6 | `ServiceObjectPage.tsx` | Добавить секции "Этапы обработки" (5 шагов), "Почему мы" (4 преимущества), "Типичные проблемы" — довести до 600+ слов | Thin content risk | +3 |
| 7 | B2B blog articles | Нарастить контент до 1500+ слов | Thin content для longreads | +1 |
| 8 | `Calculator.tsx` | Синхронизировать input min с slider min (30) | Рассинхрон slider/input | +0.5 |
| 9 | `DistrictPage.tsx` строки 270-295 | Адаптировать секцию "Популярные объекты" к serviceType — разные объекты для дезинсекции vs дератизации | Одинаковые объекты для 3 URL | +1 |
| 10 | `DistrictPage.tsx` строки 249-268 | Адаптировать "Услуги в {district}" — подсветить текущую услугу, изменить формулировку | Minor UX improvement | +0.5 |

### Реализация для достижения 100/100

Исправления 1-5 дают **+10 баллов** (87→97). Исправления 6-10 дают оставшиеся **+3 балла**.

**Файлы для изменения:**
1. `src/components/district/DistrictSpecifics.tsx` — добавить serviceType-aware описания
2. `src/pages/DistrictPage.tsx` — адаптировать "Работали на улицах", FAQ, объекты к serviceType
3. `src/components/district/DistrictReviews.tsx` — убрать Math.random(), обновить год
4. `src/components/district/DistrictCases.tsx` — обновить год 2025→2026
5. `src/pages/ServiceObjectPage.tsx` — добавить секции для увеличения контента
6. `src/components/Calculator.tsx` — синхронизировать min input=30

