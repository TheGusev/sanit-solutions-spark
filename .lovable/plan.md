

# Усиление ссылочного фактора на коммерческую страницу «Обработка участков»

## Проблема

Коммерческая страница `/uslugi/obrabotka-uchastkov/` получает минимум входящих ссылок с блога. Конкретно:

1. **ServiceCTA** (blog → service): в `tagToServices` нет ключевых слов `клещи`, `комары`, `борщевик`, `участок`, `дачный` → статьи про эти темы НЕ ссылаются на обработку участков
2. **relatedServices** в статьях: статья `borshchevik-zakon-shtraf-2026` ссылается на `/uslugi/dezinsekciya/` вместо `/uslugi/obrabotka-uchastkov/`. Статья `obrabotka-protivokleshchevaya-uchastok` — тоже на `/uslugi/dezinsekciya/`
3. **InternalLinks** в BlogPost: не знает про `/uslugi/obrabotka-uchastkov/` как целевую страницу

## Решение (3 точки)

### 1. ServiceCTA — добавить ключевые слова для обработки участков

В `src/components/blog/ServiceCTA.tsx` добавить в `tagToServices`:

```
клещи → [{ slug: "obrabotka-uchastkov", title: "Обработка участков" }, { slug: "dezinsekciya", title: "Дезинсекция" }]
комары → [{ slug: "obrabotka-uchastkov", title: "Обработка участков" }]
борщевик → [{ slug: "obrabotka-uchastkov", title: "Обработка участков" }]
участок → [{ slug: "obrabotka-uchastkov", title: "Обработка участков" }]
дачн → [{ slug: "obrabotka-uchastkov", title: "Обработка участков" }]
снт → [{ slug: "obrabotka-uchastkov", title: "Обработка участков" }]
```

Это автоматически подключит CTA-блок «Заказать обработку участков» ко ВСЕМ статьям, содержащим эти теги (борщевик, клещи, комары, дачный участок, СНТ).

### 2. relatedServices — обновить в 3 статьях

В `src/data/blog/llm/legal-commercial.ts`:
- `borshchevik-zakon-shtraf-2026`: добавить `/uslugi/obrabotka-uchastkov/` в relatedServices
- `obrabotka-protivokleshchevaya-uchastok`: добавить `/uslugi/obrabotka-uchastkov/` в relatedServices

В `src/data/blog/llm/pests.ts`:
- `komary-na-uchastke` (статья про комаров на участке, id 9017): добавить `/uslugi/obrabotka-uchastkov/` в relatedServices
- `sezonnost-vreditelej` (обе версии): добавить `/uslugi/obrabotka-uchastkov/`

### 3. InternalLinks — добавить обработку участков в пул сервисных ссылок

В `src/components/InternalLinks.tsx` добавить `/uslugi/obrabotka-uchastkov/` и `/uslugi/borba-s-krotami/` в список генерируемых сервисных ссылок, чтобы они появлялись в блоке «Полезные ссылки» на релевантных страницах блога.

## Файлы

| Файл | Действие |
|------|----------|
| `src/components/blog/ServiceCTA.tsx` | Добавить 6 ключевых слов → обработка участков |
| `src/data/blog/llm/legal-commercial.ts` | Обновить relatedServices в 2 статьях |
| `src/data/blog/llm/pests.ts` | Обновить relatedServices в 2-3 статьях |
| `src/components/InternalLinks.tsx` | Добавить обработку участков и борьбу с кротами в пул ссылок |

## Результат

- ~15-20 блог-статей получат CTA-кнопку «Обработка участков» через ServiceCTA
- 4-5 статей получат прямую ссылку через relatedServices
- Блок «Полезные ссылки» на всех страницах блога будет периодически включать обработку участков
- Ссылочный вес на коммерческую страницу вырастет в 5-10 раз

