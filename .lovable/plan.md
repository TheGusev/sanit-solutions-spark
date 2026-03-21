

# Исправление замечаний в DistrictPage

## Найденные проблемы

### 1. Surcharge в ценах (не убран при предыдущей правке)
- **L55-58**: `price: 1000 + district.surcharge` — убрать surcharge из всех 4 услуг
- **L63**: `от ${svc.basePrice + district.surcharge}₽` в pageTitle — убрать surcharge
- **L91**: `priceRange: от ${svc.basePrice + district.surcharge}₽` в JSON-LD — убрать
- **L107**: `price: svc.basePrice + district.surcharge` в serviceSchema — убрать
- **L272-274**: `{!isCurrentService && district.surcharge > 0 && ...}` блок «включая выезд» — удалить

### 2. Surcharge в DistrictPricing.tsx
- **L31-32**: `const surcharge = district.surcharge; const base = ... + surcharge` — убрать surcharge из расчёта

### 3. popularObjects не адаптированы под serviceType
- **L290-315**: Секция «Популярные объекты» показывает одинаковые `district.popularObjects` для всех услуг. `SERVICE_OBJECT_NOTES` уже даёт разные подписи, но заголовок секции использует `svc.name` — это корректно. Объекты сами по себе (квартиры, офисы, рестораны) универсальны для всех услуг — **это нормально**, дополнительная адаптация не нужна.

## Файлы и правки

### `src/pages/DistrictPage.tsx` (5 точечных правок)
1. L55-58: убрать `+ district.surcharge` из 4 цен
2. L63: убрать `+ district.surcharge` из pageTitle
3. L91: убрать `+ district.surcharge` из priceRange
4. L107: убрать `+ district.surcharge` из serviceSchema offers
5. L272-274: удалить блок «включая выезд»

### `src/components/district/DistrictPricing.tsx` (1 правка)
1. L31-32: убрать surcharge из функции `base()`

