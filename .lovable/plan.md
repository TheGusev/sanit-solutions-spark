

# Фаза E-E-A-T и Яндекс-оптимизация (Phase 9)

Три задачи для повышения доверия поисковых систем: страница команды, улучшенная перелинковка и BreadcrumbList JSON-LD.

---

## Задача 1: Страница "Наша команда" (`/team`)

Создаём новую страницу с карточками всех 6 авторов блога (из `blogAuthors` в `types.ts`).

**Что делаем:**
- Файл `src/pages/Team.tsx` -- профессиональная сетка экспертов
- Данные берём из `blogAuthors` (types.ts), чтобы experience/role совпадали с блогом
- 6 авторов: Гусев М. (8 лет), Афанасьев (5 лет), Гусев В. (7 лет), Иванов (10 лет), Васильев (12 лет), Учаев (7 лет)
- Аватар-заглушки с инициалами (как в AuthorBadge)
- Специализации каждого автора из массива `specialization`
- JSON-LD: `AboutPage` + `Organization` с массивом `employee`
- Ссылка на `/team` в Footer и в Header (секция "О нас")

**Роут:** Добавить в `App.tsx`:
```
<Route path="/team" element={<Team />} />
```

---

## Задача 2: Компонент `<RelatedQueries />`

Добавляем блок "Читайте также" с текстовыми ссылками внизу каждой статьи. Отличается от существующего `RelatedArticles` (карточки) -- это компактные текстовые ссылки, оптимизированные для ботов.

**Что делаем:**
- Файл `src/components/blog/RelatedQueries.tsx`
- Принимает массив `BlogArticle[]` (3-4 статьи)
- Дизайн: минималистичный список со стрелками, заголовок "Похожие вопросы"
- Размещение в `BlogPost.tsx`: между `FAQSection` и нижним `AuthorBadge`

**Логика подбора в BlogPost.tsx:**
- Если у статьи есть `relatedArticles` (массив slug) -- берём их
- Иначе -- фильтруем `allBlogArticles` по той же категории + общим тегам (top 3-4)
- Приоритет LLM-статьям (у которых есть `llmSummary`)

---

## Задача 3: BreadcrumbList JSON-LD на всех статьях блога

Яндекс активно использует BreadcrumbList для сниппетов и понимания структуры.

**Что делаем:**
- В `BlogPost.tsx` добавляем `<StructuredData type="BreadcrumbList" />` с тремя уровнями:
  1. Главная -- `https://goruslugimsk.ru/`
  2. Блог -- `https://goruslugimsk.ru/blog`  
  3. Название статьи -- `https://goruslugimsk.ru/blog/{slug}/`

Компонент `StructuredData` уже поддерживает тип `BreadcrumbList` -- нужно просто добавить вызов в `BlogPost.tsx`.

**Текущее состояние:** Визуальные хлебные крошки уже есть (компонент `Breadcrumbs`), но JSON-LD `BreadcrumbList` НЕ инжектится. Нужно добавить 1 блок в `BlogPost.tsx`.

---

## Технические детали

### Изменяемые файлы

| Файл | Действие |
|------|----------|
| `src/pages/Team.tsx` | Новый -- страница команды |
| `src/App.tsx` | Добавить роут `/team` |
| `src/components/blog/RelatedQueries.tsx` | Новый -- компактные ссылки |
| `src/pages/BlogPost.tsx` | Добавить RelatedQueries + BreadcrumbList JSON-LD |
| `src/components/Footer.tsx` | Добавить ссылку на `/team` |

### JSON-LD на странице Team.tsx

```json
{
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "mainEntity": {
    "@type": "Organization",
    "name": "Санитарные Решения",
    "url": "https://goruslugimsk.ru",
    "employee": [
      {
        "@type": "Person",
        "name": "Эдуард Васильев",
        "jobTitle": "Эксперт по санитарии",
        "description": "12 лет опыта"
      }
    ]
  }
}
```

### BreadcrumbList JSON-LD (добавляется в BlogPost.tsx)

```jsx
<StructuredData
  type="BreadcrumbList"
  items={[
    { name: "Главная", url: "/" },
    { name: "Блог", url: "/blog" },
    { name: post.title }
  ]}
  baseUrl={SEO_CONFIG.baseUrl}
/>
```

### Порядок выполнения

1. Создать `Team.tsx` + роут + ссылка в Footer
2. Создать `RelatedQueries.tsx` + интегрировать в `BlogPost.tsx`
3. Добавить `BreadcrumbList` JSON-LD в `BlogPost.tsx`

