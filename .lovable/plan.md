

# Исправление фото городов МО и удаление суммы выезда

## Проблема 1: Одинаковые фото

В `src/data/districtImages.ts` отсутствуют записи для 4 городов: `klin`, `ramenskoe`, `chekhov`, `domodedovo`. Все они получают `default` — одно и то же фото `moscow-panorama-sunset.jpg`.

**Решение**: Назначить каждому уникальное изображение из доступных в `/images/front/`:

| Город | Новое изображение | Почему подходит |
|-------|-------------------|-----------------|
| klin | `classical-estate-pond.png` | Исторический город, усадебная тематика |
| ramenskoe | `logistics-center.png` | Промышленный город, сочетание промзон и жилья |
| chekhov | `dacha-house.png` | Много СНТ и дачных посёлков |
| domodedovo | `night-towers.jpg` | Крупный город с аэропортом |

**Файл**: `src/data/districtImages.ts` — добавить 4 записи в `cityImages`.

## Проблема 2: Отображение суммы выезда

Надписи `+500₽`, `+{city.surcharge}₽ за выезд`, `Базовая цена + выезд` отпугивают клиентов. Нужно убрать surcharge из UI, но оставить в данных (может понадобиться для внутренней логики). Цены показывать только базовые, без наценки.

**Файлы и изменения:**

1. **`src/pages/MoscowRegionOverview.tsx`** (строки 134-138) — убрать блок `<Car> +{city.surcharge}₽`

2. **`src/pages/MoscowRegionCityPage.tsx`**:
   - Строка 85: `priceFrom: service.priceFrom` (убрать `+ city.surcharge`)
   - Строки 159-162: убрать блок `+{city.surcharge}₽ за выезд`

3. **`src/pages/MoscowRegionServicePage.tsx`**:
   - Строка 57: `const priceWithSurcharge = serviceData.priceFrom` (убрать `+ city.surcharge`)
   - Строки 109-112: убрать FAQ вопрос про наценку за выезд
   - Строка 215: убрать текст `Базовая цена ... + выезд ...`, заменить на просто описание услуги
   - Строка 269: `pest.priceFrom` без `+ city.surcharge`

4. **`src/components/ServiceAreaMap.tsx`** (строки 95, 268) — убрать отображение `selectedArea.surcharge` (или заменить на нейтральный текст)

5. **`src/pages/NeighborhoodPage.tsx`** (строки 67-70) — убрать `+ neighborhood.surcharge` из цен

### Итого: 6 файлов, ~15 точечных правок

