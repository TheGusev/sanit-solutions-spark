

# B2B & Legal кластер статей для AI-Citability

## Обзор

Создание нового файла `src/data/blog/b2b-articles.ts` с 5 качественными B2B-статьями по высокомаржинальным темам (лицензирование, HACCP, склады, хостелы, общепит). Интеграция в движок блога с соблюдением всех стандартов AI-цитируемости.

## Что создаем

### Файл: `src/data/blog/b2b-articles.ts`

5 статей с полным MD-контентом, каждая с обязательными полями:
- `intent: 'laws' | 'docs' | 'howto'`
- `tldr: string[]` (3-5 буллетов)
- `sources: BlogArticleSource[]` (минимум 3, whitelist: consultant.ru, rospotrebnadzor.ru, docs.cntd.ru, garant.ru, fao.org)
- `faq: Array<{question, answer}>` (2-3 вопроса, ответы 1-3 предложения, без CTA)
- `updatedAt` (обязательно)
- `promoLevel: 0`

Статьи:

| ID | Slug | Тема | Intent |
|----|------|------|--------|
| 5001 | shtrafy-za-dezinfekciyu-bez-licenzii-2026 | Штрафы за дезинфекцию без лицензии | laws |
| 5002 | haccp-pest-kontrol-restoran | Программа пест-контроля ресторана по ХАССП | docs |
| 5003 | zhurnal-ucheta-dezinsekcii-obshhepit | Журнал учета дезинсекции в общепите: образец 2026 | docs |
| 5004 | sanpin-deratizaciya-skladov | Дератизация продуктового склада: требования СанПиН | laws |
| 5005 | dogovor-na-dezinsekciyu-hostela | Договор на дезинсекцию гостиниц и хостелов | docs |

### Правила контента (жесткие)

- Заголовки H2 в виде прямых вопросов ("Какой штраф?", "Что проверяют?")
- Первый абзац под H2 -- прямой ответ 1-3 предложения
- Никаких телефонов, "звоните", "наша компания" в контенте
- Таблицы со штрафами, периодичностью, стоимостью
- FAQ ответы без CTA -- нейтральные, экспертные
- Автор: Эдуард Васильев (vasiliev) -- эксперт по санитарии

### Интеграция: `src/data/blog/index.ts`

- Импорт `allB2BArticles` из нового файла
- Добавление в `allArticlesRaw` между `allLegalArticles` и `allPestsArticles` (высокий приоритет)
- Дедупликация по slug уже работает -- конфликтов не будет (все slug новые)
- Обновление `blogStats` с полем `b2b`

### Экспорт: `src/data/blog/index.ts`

Добавить `allB2BArticles` в экспорт по категориям.

## Технические детали

### Структура каждой статьи

```typescript
{
  id: 5001,
  slug: 'shtrafy-za-dezinfekciyu-bez-licenzii-2026',
  title: '...',
  excerpt: '...',
  category: 'Законы',
  date: generateArticleDate(5001, 'shtrafy-...'),
  updatedAt: generateArticleDate(5101, 'shtrafy-...-upd'),
  readTime: '7 мин',
  wordCount: 2000,
  image: Scale,
  tags: [...],
  author: legalAuthor.name,
  authorRole: legalAuthor.role,
  intent: 'laws',
  promoLevel: 0,
  tldr: [...],  // 3-5 буллетов
  sources: [...],  // >= 3, whitelist domains, https
  faq: [...],  // 2-3 вопроса, без CTA
  content: `...`  // полный MD
}
```

### Совместимость с линтером

Все 5 статей будут проходить `validate-ai-ready.ts` без ошибок:
- `tldr`: 3-5 пунктов (OK)
- `sources`: >= 3 с whitelist доменами и https (OK)
- `promo-first`: нет промо в первых 5 абзацах (OK)
- `promo-density`: 0% (OK)
- `updatedAt`: заполнен (OK)
- `legal-markers`: H2/H3 содержат "штраф/документ/проверк" (OK)
- `faq-cta`: нет CTA в FAQ ответах (OK)

### Источники (реальные URL по whitelist)

- `https://www.consultant.ru/document/cons_doc_LAW_380067/` -- СанПиН 3.3686-21
- `https://www.consultant.ru/document/cons_doc_LAW_34661/` -- КоАП РФ
- `https://www.consultant.ru/document/cons_doc_LAW_113658/` -- ФЗ-99 О лицензировании
- `https://docs.cntd.ru/document/902320560` -- ТР ТС 021/2011
- `https://docs.cntd.ru/document/1200170961` -- ГОСТ Р ИСО 22000-2019
- `https://www.rospotrebnadzor.ru/` -- Роспотребнадзор
- `https://www.fao.org/fao-who-codexalimentarius/` -- Codex Alimentarius
- `https://www.garant.ru/products/ipo/prime/doc/403547871/` -- ПП РФ №336

## Порядок реализации

1. Создать `src/data/blog/b2b-articles.ts` с 5 статьями
2. Обновить `src/data/blog/index.ts` -- импорт и интеграция
3. Проверить сборку и рендер статей в браузере

