

# План: Унификация canonical URL с trailing slash

## Диагностика

Google Search Console сообщает о проблеме "Вариант страницы с тегом canonical" потому что:

| Элемент | Текущее значение | Фактический URL |
|---------|-----------------|-----------------|
| Canonical | `https://goruslugimsk.ru/uslugi/dezinfekciya` | - |
| Файл на сервере | `uslugi/dezinfekciya/index.html` | `https://goruslugimsk.ru/uslugi/dezinfekciya/` |

Google интерпретирует это как **две разные страницы** с неправильным canonical.

**Примечание**: Ваши SEO-лимиты (Title: 40-65 символов, Description: 140-165) настроены правильно в `src/lib/seoValidation.ts` — это не связано с текущей проблемой.

---

## Решение

Добавить trailing slash ко **всем canonical URL** для соответствия структуре файлов `*/index.html`.

### Файлы для изменения

| Файл | Изменения |
|------|-----------|
| `src/lib/seo.ts` | Нормализация пути с trailing slash в `generateSEOMeta()` |
| `src/lib/metadata.ts` | Добавить `/` в конец canonical для всех функций |
| `src/lib/contentGenerator.ts` | Добавить `/` в конец canonical во всех генераторах |
| `vite-plugin-sitemap.ts` | Добавить `/` к `loc` во всех URL sitemap |
| `public/uslugi/*/index.html` (12 файлов) | Обновить canonical с trailing slash |
| `public/blog/*/index.html` (8 файлов) | Обновить canonical с trailing slash |
| `public/contacts/index.html` | Обновить canonical |
| `public/privacy/index.html` | Обновить canonical |
| `public/terms/index.html` | Обновить canonical |

---

## Технические детали изменений

### 1. `src/lib/seo.ts` — добавить нормализацию URL

```typescript
export function generateSEOMeta(
  path: string, 
  title: string, 
  description: string,
  options?: {...}
): SEOMeta {
  // Нормализация: добавляем trailing slash (кроме корня)
  const normalizedPath = path === '/' ? path : 
    (path.endsWith('/') ? path : `${path}/`);
  const fullUrl = `${SEO_CONFIG.baseUrl}${normalizedPath}`;
  
  return {
    ...
    canonical: fullUrl,
    hreflangRu: fullUrl,
    hreflangDefault: fullUrl,
  };
}
```

### 2. `src/lib/metadata.ts` — все canonical с trailing slash

```typescript
// Было:
canonical: `https://goruslugimsk.ru/uslugi/${serviceSlug}`

// Станет:
canonical: `https://goruslugimsk.ru/uslugi/${serviceSlug}/`
```

Изменения в функциях:
- `generateIndexMetadata()` — оставить `/`
- `generateServiceMetadata()` — добавить `/`
- `generateNchMetadata()` — добавить `/`
- `generateObjectDistrictMetadata()` — добавить `/`
- `generateBlogMetadata()` — добавить `/`

### 3. `src/lib/contentGenerator.ts` — все canonical с trailing slash

Обновить все функции генерации метаданных:
- `generateNchPageMetadata()`
- `generateObjectPageMetadata()`
- `generateServiceDistrictMetadata()`
- `generateObjectDistrictMetadata()`

### 4. `vite-plugin-sitemap.ts` — все loc с trailing slash

```typescript
// Было:
loc: `/uslugi/${slug}`,

// Станет:
loc: `/uslugi/${slug}/`,
```

Нужно обновить все места генерации `loc` (примерно 15 мест в файле).

### 5. Статические HTML в `public/` — 23 файла

Обновить `<link rel="canonical">` во всех файлах:

```html
<!-- Было: -->
<link rel="canonical" href="https://goruslugimsk.ru/contacts">

<!-- Станет: -->
<link rel="canonical" href="https://goruslugimsk.ru/contacts/">
```

---

## Ожидаемый результат

После применения изменений:

1. **Canonical URL** будут соответствовать фактическим URL файлов
2. **Google** перестанет видеть дубликаты страниц
3. **Sitemap** будет содержать корректные URL с trailing slash
4. **Индексация** нормализуется в течение 2-4 недель при следующем пересканировании

**Важно**: После публикации нужно запросить повторное сканирование в Google Search Console для ускорения переиндексации.

