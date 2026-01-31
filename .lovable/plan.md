

# План: Унификация canonical URL с trailing slash

## Проблема

Google Search Console сообщает о проблеме **"Вариант страницы с тегом canonical"** потому что:

| Элемент | Текущее значение | Фактический URL файла |
|---------|-----------------|----------------------|
| Canonical | `https://goruslugimsk.ru/uslugi/dezinfekciya` | - |
| Файл на сервере | `uslugi/dezinfekciya/index.html` | `https://goruslugimsk.ru/uslugi/dezinfekciya/` |

Google интерпретирует это как **две разные страницы** с неправильным canonical.

---

## Решение

Добавить trailing slash (`/`) ко **всем canonical URL** для соответствия структуре файлов `*/index.html`.

---

## Файлы для изменения

### 1. `src/lib/seo.ts`
Добавить функцию нормализации пути и обновить `generateSEOMeta()`:
- Новая функция `normalizePathWithTrailingSlash(path)`
- Автоматическое добавление `/` к canonical URL

### 2. `src/lib/metadata.ts` (5 изменений)
Обновить canonical во всех функциях генерации метаданных:
- `generateServiceMetadata()` — строка 137: `uslugi/${serviceSlug}/`
- `generateNchMetadata()` — строка 158: `uslugi/${service}/${pest}/${location}/`
- `generateObjectDistrictMetadata()` — строка 180: `uslugi/${service}/${object}/${location}/`
- `generateBlogMetadata()` — строка 201: `blog/${slug}/`

### 3. `src/lib/contentGenerator.ts` (4 изменения)
Обновить canonical во всех генераторах:
- `generateNchPageMetadata()` — строка 25
- `generateObjectPageMetadata()` — строка 50
- `generateServiceDistrictMetadata()` — строка 71
- `generateObjectDistrictMetadata()` — строка 94

### 4. `vite-plugin-sitemap.ts` (15+ мест)
Добавить `/` к `loc` во всех URL sitemap:
- Статические URL (строки 46-54)
- URL услуг (строки 243, 251)
- URL вредителей (строки 261, 268)
- URL округов и районов (строки 279, 286)
- URL городов МО (строки 299, 308)
- НЧ-страницы (строки 323, 335)
- Объекты (строки 347)
- Районы (строки 360)
- Объект+Район (строки 375)
- Блог (строки 385)

### 5. Статические HTML в `public/` (23 файла)
Обновить `<link rel="canonical">` с trailing slash:

**Услуги (10 файлов):**
- `public/uslugi/dezinfekciya/index.html`
- `public/uslugi/dezinsekciya/index.html`
- `public/uslugi/deratizaciya/index.html`
- `public/uslugi/ozonirovanie/index.html`
- `public/uslugi/dezodoraciya/index.html`
- `public/uslugi/sertifikaciya/index.html`
- `public/uslugi/po-okrugam-moskvy/index.html`
- `public/uslugi/dezinfekciya-cao/index.html` (и все 8 других округов)

**Блог (9 файлов):**
- `public/blog/index.html`
- `public/blog/borba-s-tarakanami/index.html`
- `public/blog/dezinfekciya-ofisa/index.html`
- `public/blog/gryzuny-v-dome/index.html`
- `public/blog/kak-podgotovit-pomeshchenie/index.html`
- `public/blog/klopy-v-kvartire/index.html`
- `public/blog/ozonirovaniye-pomeshcheniy/index.html`
- `public/blog/sezonnost-vreditelej/index.html`
- `public/blog/vidy-dezinfekcii/index.html`

**Остальные страницы (4 файла):**
- `public/contacts/index.html`
- `public/privacy/index.html`
- `public/terms/index.html`

---

## Ожидаемый результат

После применения изменений:

1. **Canonical URL** будут соответствовать фактическим URL файлов
2. **Google** перестанет видеть дубликаты страниц
3. **Sitemap** будет содержать корректные URL с trailing slash
4. **Индексация** нормализуется в течение 2-4 недель

**После публикации**: запросите повторное сканирование в Google Search Console для ускорения переиндексации.

