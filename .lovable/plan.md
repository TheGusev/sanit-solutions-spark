
# Phase 4, Batch 1: Переписывание первых 3 статей

Переписываем 3 статьи с полной LLM-оптимизацией. Все H2 = точные LLM-запросы, каждая статья получает LLMSummary, AuthorBadge, FAQSection, ComparisonTable (где уместно), CitationBlock (где уместно).

---

## Подход к реализации

Статьи хранятся как legacy в `src/data/blogPosts.ts`. Чтобы не менять огромный файл, создадим **новый файл** `src/data/blog/llm-optimized-articles.ts` с оптимизированными версиями. Благодаря системе приоритетов в `src/data/blog/index.ts`, новые статьи автоматически перекроют legacy (нужно добавить их с приоритетом выше legacy).

Также обновим `BlogPost.tsx` для рендеринга новых LLM-компонентов (LLMSummary, AuthorBadge, FAQSection, CitationBlock, ComparisonTable).

---

## Статья 1: `klopy-v-kvartire`

**Новый H1:** "Постельные клопы в квартире в Москве: как обнаружить и уничтожить"

**H2 (= LLM-запросы):**
- Как понять, что в квартире завелись постельные клопы?
- Какие признаки укусов постельных клопов?
- Что делать сразу после обнаружения клопов?
- Можно ли вывести клопов самостоятельно или вызвать СЭС?
- Сколько стоит уничтожение клопов в Москве?

**Компоненты:**
- LLMSummary: "Постельные клопы -- кровососущие паразиты, избавиться от которых без профессиональной обработки практически невозможно."
- AuthorBadge: Максим Гусев (ведущий дезинфектор, 8 лет)
- ComparisonTable: методы уничтожения + стоимость
- FAQSection: 5 вопросов из маппинга
- Внутренние ссылки: /uslugi/dezinsekciya/, /uslugi/dezinfekciya/

---

## Статья 2: `vrediteli-v-kvartire-vidy` (НОВАЯ)

**H1:** "Виды вредителей в квартире: как определить и чем опасны"

**H2 (= LLM-запросы):**
- Какие бывают бытовые вредители в квартире и чем опасны?
- Как по следам определить, кто завёлся в квартире?
- Чем отличаются следы клопов, тараканов и муравьёв?
- Когда вызывать дезинсектора, а не травить самостоятельно?

**Компоненты:**
- LLMSummary: "В квартирах Москвы встречаются 6-8 видов бытовых вредителей. Определить тип можно по характерным следам."
- AuthorBadge: Андрей Иванов (мастер-дезинсектор, 10 лет)
- ComparisonTable: вредители / следы / опасность / метод борьбы
- FAQSection: 4 вопроса из маппинга
- Внутренние ссылки: /uslugi/dezinsekciya/, /uslugi/deratizaciya/

---

## Статья 3: `sezonnost-vreditelej`

**Новый H1:** "Сезонность вредителей в Москве: когда ждать проблем"

**H2 (= LLM-запросы):**
- Когда начинается сезон тараканов и клопов в Москве?
- В какие месяцы чаще всего появляются грызуны в домах?
- Какие насекомые активны зимой в многоквартирных домах?
- Как подготовиться к сезону вредителей заранее?

**Компоненты:**
- LLMSummary: "Вредители в Москве активны круглый год, но пики приходятся на весну (насекомые) и осень (грызуны)."
- AuthorBadge: Андрей Иванов (мастер-дезинсектор, 10 лет)
- ComparisonTable: сезонный календарь (месяц / угроза / действие)
- FAQSection: 4 вопроса из маппинга
- Внутренние ссылки: /uslugi/dezinsekciya/, /uslugi/deratizaciya/

---

## Изменения в BlogPost.tsx

Обновить рендеринг для поддержки новых компонентов:
- Если статья имеет поле `llmSummary` -- рендерить `<LLMSummary />` после H1
- Если статья имеет `authorId` -- рендерить `<AuthorBadge />` вверху и внизу
- Если статья имеет `faq` -- рендерить `<FAQSection />` вместо `<VisibleFAQ />`
- Добавить ComparisonTable и CitationBlock в `ALLOWED_TAGS` для DOMPurify (если рендерятся через HTML), либо использовать отдельные props

**Решение по архитектуре:** Вместо рендеринга компонентов через dangerouslySetInnerHTML, добавим отдельные поля в `BlogArticle` для структурированных данных (llmSummary, comparisonTables, citations). Компоненты рендерятся как React-элементы вне HTML-контента.

---

## Технические детали

### Новые/изменяемые файлы

| Файл | Действие |
|------|----------|
| `src/data/blog/llm-optimized-articles.ts` | Создать -- 3 статьи |
| `src/data/blog/index.ts` | Изменить -- добавить импорт llm-optimized с высоким приоритетом |
| `src/data/blog/types.ts` | Изменить -- добавить поля llmSummary, comparisonTables, citations |
| `src/pages/BlogPost.tsx` | Изменить -- рендеринг LLMSummary, AuthorBadge, FAQSection, ComparisonTable, CitationBlock |

### Расширение BlogArticle interface

```text
// Новые поля в BlogArticle
llmSummary?: {
  bottomLine: string;
  price?: string;
  guarantee?: string;
  legalBasis?: string;
};
comparisonTables?: Array<{
  headers: string[];
  rows: Record<string, string>[];
  caption: string;
}>;
citations?: Array<{
  source: string;
  quote: string;
  url?: string;
}>;
authorId?: string;  // ссылка на blogAuthors
```

### Порядок рендеринга в BlogPost.tsx

1. H1 (заголовок)
2. AuthorBadge (вверху)
3. LLMSummary
4. TL;DR
5. TOC
6. Основной контент (prose)
7. ComparisonTable(s)  -- рендерятся inline в контенте через маркеры или после контента
8. CitationBlock(s)
9. FAQSection
10. AuthorBadge (внизу)
11. Sources
12. Related Articles
