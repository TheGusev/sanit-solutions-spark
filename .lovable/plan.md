
# Полный регресс-тест и исправления: Фазы A-F

## Фаза A: Мёртвый код

**Файл: `src/pages/ServicePage.tsx` (строка 100)**
- Удалить `const otherServices = servicePages.filter(s => s.slug !== service.slug);` -- переменная не используется, полностью заменена `displayServices`.

---

## Фаза B: SEO-исправления

### 1. `src/pages/ServicePestPage.tsx`
- Заменить прямое использование `<Helmet>` на `<SEOHead>` компонент (как в ServicePage).
- Добавить BreadcrumbList JSON-LD schema в метаданные.
- Перейти на `generateServiceMetadata` или аналогичную функцию из `@/lib/metadata` для единообразия, либо вручную сформировать `PageMetadata` и передать schema массивом (Service + FAQPage + BreadcrumbList).

**Конкретные изменения:**
- Импортировать `SEOHead` вместо `Helmet`.
- Создать объект `breadcrumbSchema` по аналогии с ServicePage.
- Собрать `metadata: PageMetadata` с title, description, canonical, schema: [schemaMarkup, faqSchema, breadcrumbSchema].
- Заменить блок `<Helmet>...</Helmet>` на `<SEOHead metadata={metadata} pagePath={canonicalPath} />`.

### 2. `src/components/ServiceQuiz.tsx`
- Добавить функцию `pluralizeQuestion(n: number)` для правильного склонения:
  - 1 -> "вопрос"
  - 2-4 -> "вопроса"
  - 5+ -> "вопросов"
- Заменить `{steps.length} вопроса` на `{steps.length} {pluralizeQuestion(steps.length)}`.

---

## Фаза C: Производительность

### 1. Preload `home-kitchen.png` в `index.html` (строка 27)
- Изображение `home-kitchen.png` используется только на главной, но preload глобальный в `index.html` -- загружается на ВСЕХ страницах.
- **Решение**: удалить preload из `index.html` (строка 27) и перенести в компонент главной страницы (`src/pages/Index.tsx`) через `<Helmet>` / `<SEOHead>` с `<link rel="preload">`.

### 2. Оптимизация DOM (3720 узлов)
- Тяжёлые секции (ServiceTariffs, ServiceQuiz, WhyProblemReturns, SEO-аккордеон) уже рендерятся условно (при наличии данных).
- Дополнительная оптимизация: обернуть тяжёлые секции в lazy-рендер через Intersection Observer. Создать утилитный компонент `LazySection` который рендерит children только когда секция близко к viewport.

### 3. Code splitting для services.ts
- Файл services.ts (57КБ) содержит данные всех 7 услуг и загружается целиком.
- **Решение**: разбить на отдельные файлы по услугам (`src/data/services/dezinfekciya.ts`, `src/data/services/dezinsekciya.ts` и т.д.) с основным индексом `src/data/services/index.ts`, который экспортирует `servicePages` массив с базовыми данными (slug, title, priceFrom) и функцию `getServiceBySlug` которая делает динамический import.
- **ВНИМАНИЕ**: это масштабный рефакторинг с высоким риском регрессии. Более безопасный подход -- использовать `React.lazy` на уровне страниц (что уже частично сделано) и оставить services.ts как есть, поскольку 57КБ текстовых данных после gzip сжимается до ~8-10КБ. Предлагаю отложить и сосредоточиться на более безопасных оптимизациях.

---

## Фаза D: UX-исправления

**Файл: `src/components/HeroCallbackForm.tsx`**
- Убрать `!agreed` из `disabled` prop кнопки (оставить только `isSubmitting`).
- В `handleSubmit` уже есть проверка `if (!agreed)` с toast -- это и будет работать.
- Кнопка визуально активна, но при нажатии без чекбокса покажет toast "Согласитесь с политикой конфиденциальности".

---

## Фаза E: Автотесты

### Инфраструктура
- Создать `vitest.config.ts` с jsdom, setup файлом, path alias.
- Создать `src/test/setup.ts` с `@testing-library/jest-dom` и `matchMedia` mock.
- Обновить `tsconfig.app.json`: добавить `"vitest/globals"` в types.

### Тест-файлы

**`src/components/__tests__/ServiceQuiz.test.tsx`**
- Рендер с тестовыми steps (mock TrafficContext, supabase)
- Клик по опции -- переход на следующий шаг
- На финальном шаге: чекбокс обязателен для отправки

**`src/components/__tests__/ServiceTariffs.test.tsx`**
- 3 карточки рендерятся
- Популярный тариф имеет текст "Популярный"
- Кнопки "Заказать" присутствуют

**`src/components/__tests__/WhyProblemReturns.test.tsx`**
- Рендер с данными
- null при пустом массиве

**`src/components/__tests__/HeroCallbackForm.test.tsx`**
- Toast при нажатии без чекбокса
- Валидация телефона

**`src/pages/__tests__/ServicePage.test.tsx`**
- Рендер с MemoryRouter slug "dezinsekciya"
- Один H1
- Секция quiz и tariffs

**`src/pages/__tests__/ServicePestPage.test.tsx`**
- Рендер slug "tarakany" 
- heroBullets присутствуют
- Quiz и tariffs секции

---

## Фаза F: E2E-проверка

После реализации фаз A-E -- проверка через browser tool:
- `/` -- нет ошибок консоли
- `/uslugi/dezinsekciya` -- квиз, тарифы, SEO-аккордеон
- `/uslugi/dezinsekciya/tarakany` -- heroBullets, квиз, тарифы
- `/blog/borba-s-tarakanami` -- ServiceCTA
- Проверка на 375px и 1024px

---

## Сводная таблица файлов

| Фаза | Файл | Действие |
|------|------|----------|
| A | `src/pages/ServicePage.tsx` | Удалить строку 100 (otherServices) |
| B | `src/pages/ServicePestPage.tsx` | Заменить Helmet на SEOHead + BreadcrumbList JSON-LD |
| B | `src/components/ServiceQuiz.tsx` | Функция склонения "вопрос/вопроса/вопросов" |
| C | `index.html` | Удалить preload home-kitchen.png |
| C | `src/pages/Index.tsx` | Добавить preload home-kitchen.png через Helmet |
| C | `src/components/LazySection.tsx` | Создать компонент lazy-рендера через IntersectionObserver |
| D | `src/components/HeroCallbackForm.tsx` | Убрать !agreed из disabled кнопки |
| E | `vitest.config.ts` | Создать |
| E | `src/test/setup.ts` | Создать |
| E | `tsconfig.app.json` | Добавить vitest/globals |
| E | 6 тест-файлов | Создать |

## Порядок реализации

A -> B -> C -> D -> E -> F (E2E через browser)
