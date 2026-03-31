

# Усиление NCH Tier 1: 3 уникальных блока + расширение вариаций

## Что делаем

Добавляем в каждую из 524 NCH Tier 1 страниц три новых контентных блока, которые создают уникальность на уровне URL (не только переменных). Также расширяем существующие вариации intro и FAQ.

## Файл 1: `src/lib/contentGenerator.ts`

### Новая функция `generateWhyThisArea(ctx)`
6 вариаций текста, выбираемых по хешу `pest+neighborhood+district`. Каждая использует:
- `neighborhood.description` (уже есть в данных — описание района с ориентирами)
- `neighborhood.landmarks` (массив достопримечательностей)
- `districtId` → тип округа (центр/спальный/промзона)
- pest-specific факторы (почему именно этот вредитель типичен для данного типа застройки)

Возвращает объект `{ title: string, text: string }`.

### Новая функция `generatePriceTable(ctx)`
Генерирует массив `{ objectType, price, note }[]` для таблицы цен:
- Базовая цена из `pest.priceFrom`
- Множители по типу объекта: 1к квартира ×1.0, 2к ×1.3, 3к ×1.5, дом ×2.0, офис ×1.8
- Множитель по округу: ЦАО ×1.0, САО/ЗАО ×1.0, окраины ×1.1, ЗелАО/НАО/ТАО ×1.2
- Итого: уникальная цена для каждой комбинации pest × district

### Новая функция `generateLocalReview(ctx)`
Детерминистичный выбор отзыва из `staticReviews` по хешу `neighborhood.slug`. Возвращает отзыв с добавленной привязкой к району (`display_name`, `text`, `rating`, `neighborhoodName`).

### Расширение `generateIntro()`: с 4 до 8 вариаций
Добавить 4 новые вариации с акцентом на:
- Срочность (ночной вызов, выезд в праздники)
- B2B сценарий (рестораны, офисы в районе)
- Сезонность (`pest.seasonality`)
- Соседский эффект (обработка соседей — частая причина миграции)

### Расширение `generateFAQ()`: +3 вопроса
- 1 pest-specific: «Опасны ли {pest} для детей/животных?» (ответ из `pest.dangerLevel`)
- 1 neighborhood-specific: «Часто ли вызывают в {район}?» (ответ с `responseTime`)
- 1 метод: «Какой метод лучше для {pest}?» (из `pest.methods`)

## Файл 2: `src/pages/NchPage.tsx`

### Новые импорты
```
import { generateWhyThisArea, generatePriceTable, generateLocalReview } from '@/lib/contentGenerator';
```

### Генерация данных (после строки 118)
```
const whyThisArea = generateWhyThisArea(contentContext);
const priceTable = generatePriceTable(contentContext);
const localReview = generateLocalReview(contentContext);
```

### Блок A: «Почему проблема типична для {район}» (после секции Guarantee, строка 474)
Карточка с `whyThisArea.title` как H2, `whyThisArea.text` как параграф. Иконка MapPin. Фон `bg-blue-50`.

### Блок B: «Стоимость по типу помещения» (после блока A)
Таблица из `priceTable`: столбцы «Тип помещения», «Стоимость от», «Примечание». Стиль — как существующая Price Card, но в формате таблицы.

### Блок C: «Отзыв из района» (после блока B)
Карточка с `localReview`: имя, звёзды, текст, пометка «Район {neighborhood.name}». Стиль — Card с Star иконкой.

## Результат

- Каждая из 524 Tier 1 страниц получает 3 уникальных блока с данными, специфичными для комбинации pest × neighborhood × district
- Intro имеет 8 вариаций вместо 4 → снижение shingle-дублей в 2 раза
- FAQ расширен до 8 вопросов вместо 5 → больше уникального контента
- Все данные детерминистичны (hashCode) → бот и пользователь видят одинаковый HTML

