

## План: Исправить оставшиеся `в {neighborhood.name}` в NchPage и NeighborhoodPage

Два файла по-прежнему содержат именительный падеж вместо предложного.

---

### Файл 1: `src/pages/NchPage.tsx` — 10 замен

`locationText` уже определен на строке 77. Нужно заменить оставшиеся хардкод-вхождения:

| Строка | Было | Стало |
|--------|------|-------|
| 120 | `Уничтожение ${pest.genitive} в ${neighborhood.name}` | `Уничтожение ${pest.genitive} ${locationText}` |
| 121 | `в районе ${neighborhood.name}` | `${locationText}` |
| 338 | `Стоимость в {neighborhood.name}` | `Стоимость ${locationText}` |
| 348 | `Выезд в {neighborhood.name}` | `Выезд ${locationText}` |
| 371 | `Почему мы в {neighborhood.name}` | `Почему мы ${locationText}` |
| 394 | `в районе {neighborhood.name}` — OK (именительный с «в районе» допустим) | Без изменений |
| 397 | `Район {neighborhood.name}` — OK (именительный) | Без изменений |
| 404 | `Как мы работаем в {neighborhood.name}` | `Как мы работаем ${locationText}` |
| 407 | `приезжает в {neighborhood.name}` | `приезжает ${locationText}` |

Schema.org строки 129, 134 — `neighborhood.name` в `addressRegion` и `areaServed` — оставляем именительный (Schema.org ожидает названия).

### Файл 2: `src/pages/NeighborhoodPage.tsx` — 10 замен

Добавить `const locationText = neighborhood.prepositional || "в " + neighborhood.name;` в начало компонента. Затем заменить:

| Строка | Было | Стало |
|--------|------|-------|
| 95 | `Дезинфекция в ${neighborhood.name}` | `Дезинфекция ${locationText}` |
| 289 | `Услуги в ${neighborhood.name}` | `Услуги ${locationText}` |
| 317 | `Обрабатываем все типы объектов в ${neighborhood.name}` | `...объектов ${locationText}` |
| 332 | `дезинфекция в ${neighborhood.name}` | `дезинфекция ${locationText}` |
| 380 | `Почему выбирают нас в ${extendedContent.name}` | `...нас ${locationText}` |
| 451 | `Известные места в ${neighborhood.name}` | `...места ${locationText}` |
| 469 | `в {neighborhood.name}:` | `${locationText}:` |
| 485 | `Почему выбирают нас в ${neighborhood.name}` | `...нас ${locationText}` |
| 492 | `Приезжаем в {neighborhood.name}` | `Приезжаем ${locationText}` |
| 502 | `Гарантия 1 год` | `Гарантия до 3 лет` |
| 524 | `о дезинфекции в ${neighborhood.name}` | `...дезинфекции ${locationText}` |
| 544 | `Вызвать дезинфектора в ${neighborhood.name}` | `...дезинфектора ${locationText}` |

---

### Итого: 2 файла, ~20 замен, 0 новых интерфейсов

