

# AI-Citability Blog Refactoring — финальный план к реализации

## Обзор

Рефакторинг блога (184+ статей) для повышения AI-цитируемости: убираем промо-простыни, добавляем TL;DR, видимый FAQ, источники, переводим JSON-LD на BlogPosting.

---

## Этап 1: Расширение типа BlogArticle

**Файл:** `src/data/blog/types.ts`

Добавить в интерфейс BlogArticle:
- `tldr?: string[]` -- 3-6 буллетов (optional в типе, но генераторы всегда заполняют)
- `sources?: Array<{ title: string; url: string; publisher?: string }>`
- `intent?: 'guide' | 'howto' | 'price' | 'checklist' | 'symptoms' | 'prevention' | 'health-risk' | 'laws' | 'docs' | 'geo'`
- `promoLevel?: 0 | 1 | 2`

## Этап 2: 4 новых компонента

### `src/components/blog/TLDRBlock.tsx`
- Компактный бокс "Кратко" с буллетами, border-left accent, без CTA/телефонов

### `src/components/blog/VisibleFAQ.tsx`
- Аккордеон на базе существующего Accordion
- Правила: первый абзац ответа 1-3 предложения, прямой ответ; запрещены телефоны, "звоните", "оставьте заявку" и любые CTA в ответах

### `src/components/blog/SourcesList.tsx`
- Блок "Источники и нормативные документы", rel="nofollow noopener"
- Для legal: минимум 3-5 источников из данных конкретной статьи

### `src/components/blog/CompactCTA.tsx`
- Одна строка: текст + кнопка, заменяет gradient-секцию

## Этап 3: Рефакторинг BlogPost.tsx

Новый порядок:

```text
Header + Breadcrumbs
Hero (title, author, date)
TLDRBlock (если post.tldr)
TOC + Content (MD)
VisibleFAQ (если post.faq)
SourcesList (если post.sources)
RelatedArticles
CompactCTA
InternalLinks + Footer
```

Удаляем:
- "Связанные услуги" (строки 216-258)
- Большой gradient CTA (строки 274-292)
- Невидимая FAQPage JSON-LD (строки 94-99) -- заменяется: генерируется только при VisibleFAQ

## Этап 4: JSON-LD -- BlogPosting + dateModified

**Файл:** `src/components/StructuredData.tsx`

- `@type` с "Article" на "BlogPosting"
- Обязательный `dateModified` из updatedAt
- description из excerpt (articleBody НЕ добавляем)
- FAQPage JSON-LD только когда VisibleFAQ рендерится на странице

## Этап 5: Очистка генераторов

### pests-articles.ts (63 статьи)
- Удалить "Звоните: +7 (906) 998-98-88" из всех шаблонов
- Обязательно генерировать tldr + intent

### premises-articles.ts (42 статьи)
- Удалить "Звоните: +7 (906) 998-98-88"
- Обязательно tldr + intent

### mole-geo-articles.ts (18 статей)
- Обязательно tldr, intent: 'geo'

### legal-articles.ts (21 статья)
- sources с реальными ссылками (whitelist: rospotrebnadzor.ru, consultant.ru, garant.ru, docs.cntd.ru)
- Обязательно tldr, intent: 'laws'
- Удалить промо-фразу "Наша компания предоставляет..."

### Legacy/New (blogPosts.ts, newBlogPosts.ts)
- В адаптере index.ts: автогенерация tldr из excerpt
- Контент не трогаем

## Этап 6: AI-линтер

**Файл:** `scripts/validate-ai-ready.ts`

| Правило | Генераторы+Legal | Legacy/New |
|---------|-----------------|------------|
| tldr 3-6 пунктов | error | warning |
| promo-first (5 абзацев без промо) | error | warning |
| sources >= 3 (legal) | error | -- |
| sources whitelist (https + разрешенные домены) | error | -- |
| promo density <= 10% | error | warning |
| updatedAt заполнен | warning | warning |
| Legal markers в H2/H3 | error | -- |
| FAQ ответы без CTA/телефонов | error | error |

Скрипт `"lint:ai"` в package.json.

## Что НЕ меняется

- Markdown-контент (кроме удаления "Звоните")
- Система авторов, генераторы дат, cleanAIContent, processInlineMarkdown
- TOC, Blog.tsx, RelatedArticles, InternalLinks

## Порядок реализации

1. types.ts
2. 4 компонента (TLDRBlock, VisibleFAQ, SourcesList, CompactCTA)
3. BlogPost.tsx -- новый layout
4. StructuredData.tsx -- BlogPosting + dateModified
5. Генераторы -- tldr/sources/intent + удаление телефонов
6. validate-ai-ready.ts + package.json

