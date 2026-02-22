

# Session 1: Создание 5 LLM-SEO компонентов

## Обзор

Создаём 5 переиспользуемых React-компонентов, оптимизированных для извлечения информации LLM-краулерами. Все компоненты используют семантический HTML5 и следуют существующим паттернам проекта (Tailwind CSS, lucide-react иконки, dark mode через `dark:` классы).

---

## Компонент 1: `LLMSummary.tsx`

**Файл:** `src/components/blog/LLMSummary.tsx`

Блок ключевых фактов, который RAG-парсеры извлекают первым. Рендерит `<aside aria-label="Краткий вывод">` с выделенным дизайном (зелёная рамка, иконка).

**Props:**
- `bottomLine: string` -- главный вывод
- `price?: string` -- цена услуги
- `guarantee?: string` -- гарантия
- `legalBasis?: string` -- нормативная база

Стиль: аналогичен TLDRBlock (border-left + bg), но с зелёной палитрой и структурированными key-value парами.

---

## Компонент 2: `ComparisonTable.tsx`

**Файл:** `src/components/blog/ComparisonTable.tsx`

Семантическая HTML-таблица для сравнений продуктов/методов/цен.

**Props:**
- `headers: string[]` -- заголовки столбцов
- `rows: Record<string, string>[]` -- данные строк (ключи = заголовки)
- `caption: string` -- подпись таблицы

Использует `<table>`, `<thead>`, `<tbody>`, `<th scope="col">`, `<td>`, `<caption>`. Адаптивный скролл на мобильных. Никаких div-таблиц.

---

## Компонент 3: `FAQSection.tsx`

**Файл:** `src/components/blog/FAQSection.tsx`

FAQ-блок на `<details>` + `<summary>` (нативный HTML, без JS-аккордеонов). Автоматически инжектит FAQPage JSON-LD через react-helmet-async.

**Props:**
- `items: Array<{ question: string; answer: string }>`

Отличие от существующего `VisibleFAQ.tsx`: использует нативные HTML-теги вместо Radix Accordion, что лучше для LLM-краулеров. Оба компонента будут сосуществовать -- FAQSection для новых LLM-оптимизированных статей, VisibleFAQ для legacy.

---

## Компонент 4: `CitationBlock.tsx`

**Файл:** `src/components/blog/CitationBlock.tsx`

Блок цитирования нормативных документов.

**Props:**
- `source: string` -- название источника (например, "СанПиН 3.3686-21")
- `quote: string` -- текст цитаты
- `url?: string` -- ссылка на документ

Рендерит `<blockquote cite="...">` с `<cite>` внутри. Стиль: серая рамка слева, курсив для цитаты, мелкий шрифт для источника.

---

## Компонент 5: `AuthorBadge.tsx`

**Файл:** `src/components/blog/AuthorBadge.tsx`

Карточка автора для E-E-A-T. Размещается вверху и внизу статьи. Автоматически инжектит Person JSON-LD через react-helmet-async.

**Props:**
- `name: string`
- `role: string`
- `experience: string`
- `avatarUrl?: string`

Рендерит аватар (инициалы если нет фото), имя, должность, опыт. JSON-LD включает `@type: Person`, `jobTitle`, `worksFor`.

---

## Технические детали

### Создаваемые файлы (5 штук)
1. `src/components/blog/LLMSummary.tsx`
2. `src/components/blog/ComparisonTable.tsx`
3. `src/components/blog/FAQSection.tsx`
4. `src/components/blog/CitationBlock.tsx`
5. `src/components/blog/AuthorBadge.tsx`

### Без изменений существующих файлов
- Никакие существующие файлы не модифицируются
- Новые компоненты не подключаются к BlogPost.tsx (это Phase 4)
- VisibleFAQ.tsx остаётся как есть для legacy-статей

### Паттерны проекта
- Импорт `cn()` из `@/lib/utils` для классов
- Иконки из `lucide-react`
- Dark mode через `dark:` Tailwind-классы
- JSON-LD инжекция через `react-helmet-async` (паттерн из StructuredData.tsx)
- SEO конфигурация из `@/lib/seo` (SEO_CONFIG)

