

# Добавление блока "Полезные статьи по теме" на страницы услуг

## Текущее состояние

- **ServicePage.tsx** -- блок "Полезные статьи" уже есть (строки 656-701), использует `getRelatedArticlesForService(service.slug)` для подбора 2-3 карточек статей.
- **ServicePestPage.tsx** -- блока со статьями нет. Нужно добавить.
- Маппинг услуга-статьи определён в `src/data/services.ts` (строки 1100-1184) через `serviceToArticles` и функцию `getRelatedArticlesForService`.

## Что нужно сделать

### 1. Расширить маппинг статей для вредителей

**Файл: `src/data/services.ts`**

Добавить маппинг `pestToArticles` для каждого вредителя (slug вредителя -> slug-и релевантных статей):

| Вредитель | Статьи |
|-----------|--------|
| tarakany | borba-s-tarakanami, sezonnost-vreditelej, kak-podgotovit-pomeshchenie |
| klopy | klopy-v-kvartire, sezonnost-vreditelej, kak-podgotovit-pomeshchenie |
| muravyi | borba-s-tarakanami, sezonnost-vreditelej |
| blohi | sezonnost-vreditelej, kak-podgotovit-pomeshchenie |
| mol | sezonnost-vreditelej, kak-podgotovit-pomeshchenie |
| krysy | gryzuny-v-dome, sezonnost-vreditelej |
| myshi | gryzuny-v-dome, sezonnost-vreditelej |
| kroty | gryzuny-v-dome, sezonnost-vreditelej |

Экспортировать функцию `getRelatedArticlesForPest(pestSlug: string)` по аналогии с `getRelatedArticlesForService`.

### 2. Добавить блок статей в ServicePestPage

**Файл: `src/pages/ServicePestPage.tsx`**

- Импортировать `getRelatedArticlesForPest` из `@/data/services`.
- Импортировать `ChevronRight` из `lucide-react`.
- Вставить блок "Полезные статьи по теме" между SEO-аккордеоном и Districts Links (между строками 415 и 417).
- Использовать ту же разметку карточек, что и в ServicePage (категория, заголовок, сниппет, "Читать").

### Визуальная структура блока

```text
+-------------------------------------------+
| Полезные статьи по теме                   |
| Читайте материалы для понимания вопроса   |
+-------------------------------------------+
| [Карточка 1]  [Карточка 2]  [Карточка 3]  |
|  Категория     Категория     Категория     |
|  Заголовок     Заголовок     Заголовок     |
|  Сниппет...    Сниппет...    Сниппет...    |
|  5 мин Читать  6 мин Читать  7 мин Читать |
+-------------------------------------------+
```

## Сводная таблица файлов

| Файл | Действие |
|------|----------|
| `src/data/services.ts` | + `pestToArticles` маппинг + `getRelatedArticlesForPest()` |
| `src/pages/ServicePestPage.tsx` | + импорт + блок "Полезные статьи" (2-3 карточки) |

