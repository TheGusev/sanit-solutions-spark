

# Day 2: Замена Сертификация → Демеркуризация

## Обзор изменений

Убираем услугу "Санитарная сертификация" (sertifikaciya) из навигации, sitemap и SSG. Добавляем новую услугу "Демеркуризация" (demerkurizaciya). Старый URL `/uslugi/sertifikaciya/` не удаляем физически — просто убираем из sitemap и навигации (безопасный подход).

## Затрагиваемые файлы (8 файлов)

### 1. `src/data/services.ts`

- Удалить объект `sertifikaciya` (строки 340-398)
- Заменить на новый объект `demerkurizaciya` с полным контентом:
  - slug: "demerkurizaciya"
  - title: "Демеркуризация"
  - metaTitle: "Демеркуризация в Москве от 3000₽ — Сбор ртути | Санитарные Решения"
  - metaDescription: описание услуги (140-165 символов)
  - heroTitle, heroSubtitle, description, benefits, methods, priceFrom: 3000, faq (4 вопроса)
- В `serviceToArticles` (строка 412): заменить ключ `sertifikaciya` на `demerkurizaciya` с подходящими статьями

### 2. `src/lib/seoRoutes.ts` (строка 21)

- Заменить `'sertifikaciya'` на `'demerkurizaciya'` в массиве `servicesSlugs`

### 3. `vite-plugin-sitemap.ts` (строка 63)

- Заменить `'sertifikaciya'` на `'demerkurizaciya'` в массиве `servicesSlugs`

### 4. `src/components/Header.tsx` (строка 109)

- Заменить `{ title: "Сертификация", href: "/uslugi/sertifikaciya", subItems: [] }` на `{ title: "Демеркуризация", href: "/uslugi/demerkurizaciya", subItems: [] }`

### 5. `src/components/Footer.tsx` (строки 80-82)

- Заменить ссылку `/uslugi/sertifikaciya` на `/uslugi/demerkurizaciya` с текстом "Демеркуризация"

### 6. `src/components/MiniPricing.tsx` (строка 11)

- Заменить `{ icon: FileCheck, title: "Сертификация СЭС", href: "/uslugi/sertifikaciya" }` на `{ icon: AlertTriangle, title: "Демеркуризация", href: "/uslugi/demerkurizaciya" }` (импортировать AlertTriangle из lucide-react)

### 7. `src/pages/DistrictsOverview.tsx` (строка 24)

- Заменить `{ title: "Сертификация", href: "/uslugi/sertifikaciya", price: "от 3000₽" }` на `{ title: "Демеркуризация", href: "/uslugi/demerkurizaciya", price: "от 3000₽" }`

### 8. `src/data/servicePrices.ts`

- Обновить тип `category` (строка 6): заменить `'sertifikaciya'` на `'demerkurizaciya'`
- Обновить запись (строки 130-139): заменить категорию и название на демеркуризацию

### Не трогаем

- `src/data/blog/legal-articles.ts` — `relatedServices` с `'sertifikaciya'` оставляем пока как есть (эти статьи просто не будут ссылаться на удалённую услугу, getServiceBySlug вернёт undefined, статьи останутся рабочими)
- `public/uslugi/sertifikaciya/index.html` — не удаляем, не ставим 410. Просто убираем из навигации и sitemap
- `src/data/certificates.ts` — не затрагивается

## Контент для демеркуризации

Услуга демеркуризации — это профессиональный сбор ртути и обеззараживание помещений после разбития ртутного термометра, ламп или других ртутьсодержащих приборов. Актуальная услуга с реальным спросом в Москве.

## Проверка после изменений

1. Открыть `/uslugi/demerkurizaciya/` — страница рендерится корректно с полным контентом
2. Проверить JSON-LD на странице — корректный Service schema
3. Проверить навигацию в Header — "Демеркуризация" вместо "Сертификация"
4. Проверить Footer — корректная ссылка
5. Проверить MiniPricing на главной — карточка "Демеркуризация"
6. Canonical на `/uslugi/demerkurizaciya/` указывает на саму себя

## URL для переобхода после публикации

1. `https://goruslugimsk.ru/uslugi/demerkurizaciya/` (новая)
2. `https://goruslugimsk.ru/` (обновлена навигация)
3. `https://goruslugimsk.ru/uslugi/dezinfekciya/` (хаб)
4. `https://goruslugimsk.ru/uslugi/dezinsekciya/` (хаб)
5. `https://goruslugimsk.ru/uslugi/deratizaciya/` (хаб)
6. `https://goruslugimsk.ru/uslugi/po-okrugam-moskvy/` (список услуг)

## Риски

Минимальный. Сертификация не является высокочастотным запросом. Демеркуризация — реальная услуга с конкретным интентом. Старый URL остаётся доступным через SPA, но перестаёт продвигаться.

