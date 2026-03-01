

## ФИНАЛЬНЫЙ QA-АУДИТ — ОТЧЁТ

---

### 🧪 ЭТАП 1: TypeScript & Build Validation
**Статус: ПРОЙДЕНО (с оговорками)**

- Все новые файлы (`ServiceSESPage.tsx`, `ServiceLandingUchastkiPage.tsx`, `ReviewsPage.tsx`, `ServiceSubpage.tsx`) корректно типизированы.
- `CalculatorModal` принимает `open: boolean` и `onOpenChange: (open: boolean) => void` — все вызовы соответствуют интерфейсу.
- `SEOHead` используется с корректным типом `PageMetadata`.
- Все `useState` корректно инициализированы.
- `console.error` в `NotFound.tsx` (строка 38) — **допустимо**, это 404-трекинг.

**Предварительная оценка**: сборка должна пройти без TS-ошибок.

---

### 🧪 ЭТАП 2: Глобальный SEO и Canonical Аудит
**Статус: НАЙДЕНЫ ОШИБКИ (3 критические, 1 средняя)**

#### ❌ КРИТИЧЕСКАЯ ОШИБКА 1: Страницы отсутствуют в Sitemap
В `vite-plugin-sitemap.ts` **НЕТ** следующих URL:
- `/sluzhba-dezinsekcii/`
- `/otzyvy/`
- `/uslugi/obrabotka-uchastkov/`
- `/team/` (страница команды)

Они не попадут в индекс Яндекса! **Нужно добавить в `staticUrls` массив**.

#### ❌ КРИТИЧЕСКАЯ ОШИБКА 2: 13 новых подстраниц отсутствуют в Sitemap
В `serviceSubpageRoutes` только 6 старых записей. Новые 13 подстраниц (Phase 1: `klopov-v-kvartire`, `holodnym-tumanom`, `bez-zapaha`, `s-garantiey`, `ot-tarakanov-na-kuhne`, `v-novostrojke`, `ot-gryzunov-v-chastnom-dome` и др.) **НЕ добавлены**.

#### ❌ КРИТИЧЕСКАЯ ОШИБКА 3: «Гарантия 1 год» осталась в seo.ts и neighborhoods.ts
- `src/lib/seo.ts` строка 71: `formatServiceTitle` генерирует `"Гарантия 1 год"` в Title для всех страниц услуг.
- `src/data/neighborhoods.ts`: минимум 3 района (Арбат, Хамовники, Таганский) содержат `"Гарантия 1 год"` в `metaDescription`. Вероятно, ещё десятки.

#### ⚠️ СРЕДНЯЯ: Хардкод-цвета в FloatingButtons.tsx
`bg-[#2563eb]`, `hover:bg-[#1d4ed8]`, `bg-[#168DE2]`, `hover:bg-[#1278c4]` — 4 хардкод-цвета. Нужно заменить на `bg-primary hover:bg-primary/90` и `bg-[hsl(var(--max-blue))]` или оставить как brand-цвета (MAX мессенджер — не наш бренд, допустимо).

#### ✅ `lovable.app` в коде
Grep показал: `lovable.app` осталось **только** в `supabase/functions/_shared/cors.ts` — это CORS для превью, **допустимо**. В HTML файлах — нет совпадений.

#### ✅ Кнопка «Показать ещё»
Blog.tsx и ReviewsPage.tsx используют `useState(visibleCount)` + `slice(0, visibleCount)`. URL не меняется, тегов `<a>` для пагинации нет.

---

### 🧪 ЭТАП 3: Роутинг и «Мёртвые души»
**Статус: ПРОЙДЕНО**

- ✅ `App.tsx`: все новые роуты зарегистрированы (`/sluzhba-dezinsekcii`, `/otzyvy`, `/uslugi/obrabotka-uchastkov`).
- ✅ `ServiceRouteResolver.tsx`: корректно перехватывает подстраницы → вредителей → объекты → районы → 404.
- ✅ `ThreeSegmentRouteResolver` обрабатывает НЧ-страницы (`/uslugi/dezinsekciya/tarakany/arbat`).
- ✅ `Footer.tsx`: содержит ссылки на `/sluzhba-dezinsekcii`, `/otzyvy`, `/uslugi/obrabotka-uchastkov` (строки 61-62, 78).
- ✅ `NotFound.tsx`: корректно рендерит 404 с `noindex`, ссылками на услуги и телефоном.

---

### 🧪 ЭТАП 4: Модалки, Формы и Z-Index
**Статус: ПРОЙДЕНО**

- ✅ `ServiceSESPage.tsx`: `CalculatorModal` подключена, кнопка «Рассчитать стоимость» в hero и CTA секциях.
- ✅ `ServiceLandingUchastkiPage.tsx`: аналогично, `CalculatorModal` подключена в обоих местах.
- ✅ `ServiceSubpage.tsx`: `CalculatorModal` работает, `handleCalculatorClick` трекает цель.
- ✅ `NchPage.tsx`: `CalculatorModal` подключена (строка 517).
- ✅ `FloatingButtons.tsx`: `z-50`, позиция `fixed bottom-6 right-6` — не перекрывает основной контент.
- ✅ `CalculatorModal` использует `Dialog` из Radix — body scroll lock включён по умолчанию.

---

### 🧪 ЭТАП 5: Аудит Изображений
**Статус: ПРОЙДЕНО**

- ✅ `ServiceSESPage.tsx` строка 97-103: `specialist-closeup.jpg`, alt="Специалист службы дезинсекции в защитном костюме", width=600, height=400, loading="lazy", decoding="async".
- ✅ `ServiceLandingUchastkiPage.tsx` строка 99-104: `outdoor-treatment.png`, alt="Обработка дачного участка от клещей и комаров", аналогичные атрибуты.
- ✅ `ServiceSubpage.tsx` строка 101-107: `fog-generator.jpg`, alt="Профессиональное оборудование для обработки помещений", loading="eager" (hero — корректно).
- ✅ `NchPage.tsx` строка 308-315: pest image с динамическим alt из `pestImage.altText`, width/height заданы.

---

### 🧪 ЭТАП 6: Гео и Склонения (НЧ-страницы)
**Статус: ПРОЙДЕНО**

- ✅ `NchPage.tsx` строка 77: `const locationText = neighborhood.prepositional || \`в \${neighborhood.name}\`;` — fallback работает.
- ✅ Title (строка 80): `\${pest.name} \${locationText} — от \${pest.priceFrom}₽` — используется prepositional.
- ✅ Description (строка 83): `Уничтожение \${pest.genitive} \${locationText}` — корректно.
- ✅ H1 (строка 269): `Уничтожение {pest.genitive} в районе {neighborhood.name}` — использует именительный падеж, без дублирования слова "район".
- ✅ Страница не крашится при отсутствии `prepositional` — проверено логикой fallback.

---

## ИТОГО: ТРЕБУЮТСЯ ИСПРАВЛЕНИЯ

### Критические (блокируют деплой):

1. **Sitemap**: добавить `/sluzhba-dezinsekcii/`, `/otzyvy/`, `/uslugi/obrabotka-uchastkov/`, `/team/` в `staticUrls` в `vite-plugin-sitemap.ts`.

2. **Sitemap**: добавить 13 новых подстраниц в `serviceSubpageRoutes` (все slug из `serviceSubpages.ts`).

3. **seo.ts строка 71**: заменить `"Гарантия 1 год"` → `"Гарантия до 3 лет"` в `formatServiceTitle`.

4. **neighborhoods.ts**: глобальная замена `"Гарантия 1 год"` → `"Гарантия до 3 лет"` в `metaDescription` полях всех районов (ориентировочно 50+ вхождений).

### Средние (рекомендовано):

5. **FloatingButtons.tsx**: заменить `bg-[#2563eb]` → `bg-primary` (телефон). MAX кнопку можно оставить с хардкодом как brand color.

### План реализации:

| Файл | Изменение |
|------|-----------|
| `vite-plugin-sitemap.ts` | +4 URL в staticUrls, +13 подстраниц в serviceSubpageRoutes |
| `src/lib/seo.ts` | Строка 71: "1 год" → "до 3 лет" |
| `src/data/neighborhoods.ts` | Глобальная замена "Гарантия 1 год" → "Гарантия до 3 лет" |
| `src/components/FloatingButtons.tsx` | Замена хардкод-цвета телефона на `bg-primary` |

