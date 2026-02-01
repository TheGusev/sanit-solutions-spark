
# План: Добавление Schema.org Person разметки для авторов

## Текущая ситуация

Сейчас в `generateArticle` и `generateBlogPosting` автор указан как Organization:

```json
"author": {
  "@type": "Organization",
  "name": "ООО Санитарные Решения"
}
```

Нужно заменить на Person schema с полными данными об авторе.

---

## Решение

### Шаг 1: Расширить интерфейс BlogPostData

**Файл:** `src/components/StructuredData.tsx`

Добавить поля автора:

```typescript
export interface BlogPostData {
  // ... существующие поля
  author?: string;
  authorRole?: string;      // НОВОЕ
  authorExperience?: string; // НОВОЕ
}
```

### Шаг 2: Обновить generateArticle для Person schema

**Файл:** `src/components/StructuredData.tsx`

Заменить Organization на Person с полными данными:

```typescript
const generateArticle = (post: BlogPostData, baseUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": post.title,
  "description": post.excerpt,
  "datePublished": post.date,
  "dateModified": post.dateModified || post.date,
  "author": post.author ? {
    "@type": "Person",
    "name": post.author,
    "jobTitle": post.authorRole || "Специалист по дезинфекции",
    "worksFor": {
      "@type": "Organization",
      "name": "ООО Санитарные Решения",
      "url": baseUrl
    }
  } : {
    "@type": "Organization",
    "name": "ООО Санитарные Решения",
    "url": baseUrl
  },
  "publisher": {
    "@type": "Organization",
    "name": "ООО Санитарные Решения",
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/og-image.jpg`
    }
  },
  // ... остальное
});
```

### Шаг 3: Аналогично обновить generateBlogPosting

```typescript
const generateBlogPosting = (post: BlogPostData, baseUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  "description": post.excerpt,
  "datePublished": post.date,
  "author": post.author ? {
    "@type": "Person",
    "name": post.author,
    "jobTitle": post.authorRole || "Специалист по дезинфекции",
    "worksFor": {
      "@type": "Organization",
      "name": "ООО Санитарные Решения",
      "url": baseUrl
    }
  } : {
    "@type": "Organization",
    "name": "ООО Санитарные Решения"
  },
  // ... остальное
});
```

### Шаг 4: Передать данные автора из BlogPost

**Файл:** `src/pages/BlogPost.tsx`

Обновить вызов StructuredData:

```tsx
<StructuredData 
  type="Article"
  post={{
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    slug: post.slug,
    author: post.author,           // ДОБАВИТЬ
    authorRole: post.authorRole,   // ДОБАВИТЬ
    category: post.category,
    keywords: post.tags,
    wordCount: post.wordCount || post.content?.split(/\s+/).length
  }}
  baseUrl={SEO_CONFIG.baseUrl}
/>
```

---

## Результат Schema.org разметки

После изменений JSON-LD будет выглядеть так:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Чем опасны муравьи в квартире",
  "author": {
    "@type": "Person",
    "name": "Андрей Иванов",
    "jobTitle": "Мастер-дезинсектор",
    "worksFor": {
      "@type": "Organization",
      "name": "ООО Санитарные Решения",
      "url": "https://goruslugimsk.ru"
    }
  },
  "publisher": {
    "@type": "Organization",
    "name": "ООО Санитарные Решения"
  }
}
```

---

## SEO-преимущества

| Аспект | Улучшение |
|--------|-----------|
| E-E-A-T | Явное указание экспертизы автора (jobTitle) |
| Knowledge Graph | Google может связать автора с организацией |
| Rich Snippets | Возможность отображения автора в SERP |
| Доверие | Пользователи видят реального специалиста |

---

## Файлы для изменения

| Файл | Изменения |
|------|-----------|
| `src/components/StructuredData.tsx` | Добавить authorRole в интерфейс, обновить generateArticle и generateBlogPosting |
| `src/pages/BlogPost.tsx` | Передать author и authorRole в StructuredData |

---

## Ожидаемый результат

- Все 158 статей имеют Person schema с именем автора и должностью
- Google индексирует авторов как реальных специалистов
- Улучшается E-E-A-T сигнал для SEO
- Статьи выглядят более профессионально в результатах поиска
