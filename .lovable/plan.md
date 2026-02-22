

# Обновление файлов контента: телефон + WhatsApp

Остались файлы данных, шаблонов и статических HTML, которые ещё содержат старый номер и/или WhatsApp.

## 1. Calculator.tsx -- убрать WhatsApp

Заменить `wa.me/79069989888` на `tel:84950181817` (вместо отправки в WhatsApp -- звонок). Убрать переменную `whatsappUrl`.

## 2. src/data/services.ts (~15 замен)

Все вхождения `+7 (906) 998-98-88` и `+7-906-998-98-88` заменить на `8-495-018-18-17`:
- metaDescription для 7 услуг (dezinfekciya, dezinsekciya, deratizaciya, ozonirovanie, dezodoraciya, demerkurizaciya, sertifikaciya)
- FAQ-ответы (~3 штуки)

## 3. src/data/serviceSubpages.ts (~8 замен)

Все `+7 (906) 998-98-88` в metaDescription заменить на `8-495-018-18-17`:
- Дезинфекция квартир, офисов
- Уничтожение клопов, тараканов, крыс, мышей
- И другие подстраницы

## 4. src/data/newBlogPosts.ts (~20 замен)

Все `+7 (906) 998-98-88` в MD-контенте статей блога заменить на `8-495-018-18-17`.

## 5. src/lib/contentGenerator.ts (4 замены)

Шаблоны description для генерируемых страниц.

## 6. src/lib/metadata.ts (5 замен)

Шаблоны description для метаданных страниц.

## 7. Статические HTML файлы (27 файлов)

Заменить во всех файлах `public/`:
- `+7-906-998-98-88` -> `8-495-018-18-17` (JSON-LD telephone)
- `+7 (906) 998-98-88` -> `8-495-018-18-17` (текст)
- `tel:+79069989888` -> `tel:84950181817` (ссылки)
- Удалить строки с WhatsApp в `dezinfekciya-cao` и `po-okrugam-moskvy`

### Список HTML-файлов:

| Директория | Файл |
|------------|------|
| public/contacts/ | index.html |
| public/blog/ | index.html + 8 подпапок |
| public/uslugi/ | 14 подпапок (dezinfekciya, dezinsekciya, deratizaciya, ozonirovanie, dezodoraciya, sertifikaciya, po-okrugam-moskvy, dezinfekciya-cao/sao/svao/szao/vao/yao/yuvao/yzao/zao) |
| public/ | terms/, privacy/ (нет номера -- уже проверено) |

## 8. Проверка через browser

После всех правок:
1. `/` -- проверить шапку и подвал
2. `/uslugi/dezinsekciya` -- новый номер в meta и CTA
3. `/contacts` -- нет WhatsApp, новый номер
4. `/blog/borba-s-tarakanami` -- новый номер в тексте

## Сводка файлов

| Файл | Замен | Тип |
|------|-------|-----|
| src/components/Calculator.tsx | 1 WhatsApp + номер | Компонент |
| src/data/services.ts | ~15 | Данные |
| src/data/serviceSubpages.ts | ~8 | Данные |
| src/data/newBlogPosts.ts | ~20 | Контент блога |
| src/lib/contentGenerator.ts | 4 | Шаблоны |
| src/lib/metadata.ts | 5 | Шаблоны |
| 27 HTML-файлов в public/ | ~60 | Статика |

