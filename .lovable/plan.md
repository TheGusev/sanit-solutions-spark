
# Исправление 404 на страницах демеркуризации объектов

## Проблема

Страницы `/uslugi/demerkurizaciya/kvartir`, `/domov`, `/ofisov`, `/restoranov`, `/skladov`, `/proizvodstv` отдают 404, хотя добавлены в sitemap и seoRoutes.

Причина: в файле `src/pages/ServiceObjectPage.tsx` на строке 31 массив `validServices` содержит только 4 услуги:

```
const validServices = ['dezinsekciya', 'dezinfekciya', 'deratizaciya', 'ozonirovanie'];
```

`demerkurizaciya` отсутствует.

## Исправление

Единственное изменение -- одна строка в одном файле:

**`src/pages/ServiceObjectPage.tsx`, строка 31:**

Заменить:
```
const validServices = ['dezinsekciya', 'dezinfekciya', 'deratizaciya', 'ozonirovanie'];
```

На:
```
const validServices = ['dezinsekciya', 'dezinfekciya', 'deratizaciya', 'ozonirovanie', 'demerkurizaciya'];
```

## Результат

- 6 страниц демеркуризации объектов перестанут отдавать 404
- sitemap, seoRoutes и роутинг станут полностью синхронизированы
- Все ~550 страниц сайта будут работать корректно
