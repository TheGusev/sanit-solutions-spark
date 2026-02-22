
# Исправление: передать authorId в AuthorBadge

## Проблема

В `BlogPost.tsx` компонент `AuthorBadge` вызывается в двух местах без пропа `authorId`, из-за чего имя автора отображается как обычный текст, а не как ссылка на `/team#author-{id}`.

## Что нужно исправить

### Файл: `src/pages/BlogPost.tsx`

**Место 1 (строка ~188)** -- AuthorBadge в шапке статьи:
```jsx
// Было:
<AuthorBadge name={author.name} role={author.role} experience={author.experience} />

// Станет:
<AuthorBadge name={author.name} role={author.role} experience={author.experience} authorId={author.id} />
```

**Место 2 (строка ~299)** -- AuthorBadge внизу статьи:
```jsx
// Было:
<AuthorBadge name={author.name} role={author.role} experience={author.experience} />

// Станет:
<AuthorBadge name={author.name} role={author.role} experience={author.experience} authorId={author.id} />
```

## Результаты проверки (остальное работает)

- Хлебные крошки (визуальные) -- отображаются корректно
- BreadcrumbList JSON-LD -- присутствует в коде BlogPost.tsx
- LLMSummary -- рендерится в начале статьи
- FAQSection -- аккордеоны открываются/закрываются
- RelatedQueries ("Похожие вопросы") -- 4 тематические ссылки, все из смежного кластера
- Ссылка "Команда" в Header -- присутствует
- Страница /team -- рендерится корректно с якорями `author-{id}`
