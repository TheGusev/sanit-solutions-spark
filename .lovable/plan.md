

# Fix: Trailing slash в canonical для /sluzhba-dezinsekcii/

## Проблема

В `src/pages/ServiceSESPage.tsx` canonical URL не имеет trailing slash:
```
canonical: "https://goruslugimsk.ru/sluzhba-dezinsekcii"
```
Стандарт проекта требует trailing slash на всех canonical.

## Изменение

**Файл: `src/pages/ServiceSESPage.tsx`**

Обновить 3 места в объекте `metadata`:
1. `canonical` — добавить `/` в конце
2. `schema[0].url` (LocalBusiness) — добавить `/`
3. `schema[1].itemListElement[1].item` (BreadcrumbList) — добавить `/`

Одна строка в каждом месте, один файл.

