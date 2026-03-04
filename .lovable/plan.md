

## Plan: 4 точечных правки

### 1. Карточка «Обработка участков» в MiniPricing + меню Header

**MiniPricing.tsx** (line 13): добавить новый элемент в массив `services`:
```ts
{ icon: TreePine, title: "Обработка участков", href: "/uslugi/obrabotka-uchastkov" },
```
Импорт `TreePine` уже есть. Сетка `grid-cols-2` на мобильном покажет 8 карточек (4 ряда по 2).

**Header.tsx** (line 113): добавить в `servicesMenu` после «Борьба с кротами»:
```ts
{ title: "Обработка участков", href: "/uslugi/obrabotka-uchastkov", subItems: [] },
```

### 2. Раздел «Обработка участков» в PricingByArea (полный прайс)

**PricingByArea.tsx**: добавить строки в `servicePricesData` и новую группу в `groupedServices`:
- «Обработка участка до 6 соток — от 4 000 ₽»
- «Обработка участка 6–10 соток — от 5 500 ₽»
- «Обработка участка 10–20 соток — от 8 000 ₽»

Также добавить «Демеркуризация» и «Борьба с кротами», которых сейчас нет в прайсе:
- Демеркуризация — квартира от 3 000 ₽
- Борьба с кротами — участок до 6 соток от 3 000 ₽, 6–15 соток от 5 000 ₽

### 3. «в Москве» → «в Москве и МО» в heroTitle и metaTitle

**src/data/services.ts**: Обновить 6 записей, где `heroTitle` содержит «в Москве» без «и МО»:
- dezinfekciya: heroTitle, metaTitle
- dezinsekciya: heroTitle, metaTitle
- deratizaciya: heroTitle, metaTitle
- ozonirovanie: heroTitle, metaTitle
- dezodoraciya: heroTitle, metaTitle
- demerkurizaciya: heroTitle, metaTitle

Также обновить заголовок таблицы цен в **ServicePage.tsx** (line 507):
```
`Стоимость ${service.title.toLowerCase()} в Москве` → `Стоимость ${service.title.toLowerCase()} в Москве и МО`
```

И в **PricingByArea.tsx** (line 60):
```
"Цены на услуги в Москве" → "Цены на услуги в Москве и МО"
```

### 4. Убрать дубль цены на ServicePage

**ServicePage.tsx** (lines 324-339): удалить секцию «Price highlight» — синюю полосу с `от X ₽ за Y`. Цена уже показана в блоке тарифов выше и в таблице цен ниже.

---

**Итого**: 4 файла, ~30 строк изменений. Роутинг, логика, стили не затрагиваются.

