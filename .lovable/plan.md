
# План: Исправление тавтологии и генератор уникального контента для районов

## Диагностика проблемы

### Тавтология в `genDescription`

**Файл:** `src/data/neighborhoods.ts`, строки 25-27

```typescript
// ТЕКУЩИЙ КОД (ОШИБКА):
const genDescription = (name: string, districtName: string, landmarks: string[]): string => {
  return `Район ${name} в ${districtName} — один из районов Москвы...`;
};
```

При вызове с `n.fullName` = "район Арбат" получается:
> "Район Арбат в **район Арбат** — один из районов Москвы..."

### Масштаб проблемы

| Статус | Количество | Источник контента |
|--------|------------|-------------------|
| С уникальным контентом | 10 районов | `neighborhoodContent.ts` |
| Шаблонный контент | **120 районов** | `genDescription()` с тавтологией |

---

## Решение

### Этап 1: Исправление тавтологии

**Файл:** `src/data/neighborhoods.ts`

Изменить функцию `genDescription` для корректной работы с `districtId` вместо `fullName`:

```typescript
// НОВЫЙ КОД:
const genDescription = (
  name: string, 
  districtId: string, 
  landmarks: string[],
  responseTime: string
): string => {
  const districtNames: Record<string, string> = {
    'cao': 'Центральном округе',
    'sao': 'Северном округе', 
    'svao': 'Северо-Восточном округе',
    'vao': 'Восточном округе',
    'yuvao': 'Юго-Восточном округе',
    'yao': 'Южном округе',
    'yzao': 'Юго-Западном округе',
    'zao': 'Западном округе',
    'szao': 'Северо-Западном округе',
    'nao': 'Новомосковском округе',
    'tao': 'Троицком округе',
    'zelao': 'Зеленоградском округе'
  };
  
  const districtName = districtNames[districtId] || 'Москве';
  const landmarkText = landmarks.slice(0, 3).join(', ');
  
  return `${name} — район в ${districtName} Москвы, где мы оказываем услуги 
профессиональной дезинфекции. Время прибытия мастера — ${responseTime}. 
Обрабатываем квартиры, офисы, рестораны и другие помещения. 
Ориентиры: ${landmarkText}. Гарантия 1 год.`;
};
```

Обновить вызов в `fillNeighborhoodData`:

```typescript
description: genDescription(n.name, n.districtId, n.landmarks, n.responseTime),
```

---

### Этап 2: Создание генератора уникального контента

**Новый файл:** `src/lib/neighborhoodContentGenerator.ts`

Генератор будет создавать уникальный контент для районов на основе:
- Типа округа (центральный, спальный, промышленный)
- Времени прибытия (`responseTime`)
- Наценки (`surcharge`)
- Ориентиров (`landmarks`)

```typescript
export function generateNeighborhoodContent(neighborhood: Neighborhood): NeighborhoodContent {
  const districtType = getDistrictType(neighborhood.districtId);
  const rng = new SeededRandom(hashCode(neighborhood.slug));
  
  return {
    slug: neighborhood.slug,
    name: neighborhood.name,
    intro: generateUniqueIntro(neighborhood, districtType, rng),
    whyUs: generateWhyUs(neighborhood, districtType, rng),
    coverage: generateCoverage(neighborhood),
    advantages: generateAdvantages(districtType, rng),
    landmarks: neighborhood.landmarks
  };
}
```

**Вариативность генератора:**

| Компонент | Количество вариаций | Зависит от |
|-----------|---------------------|------------|
| Вступление (intro) | 12 шаблонов | districtType + hash(slug) |
| Почему мы (whyUs) | 20+ фраз | districtType + responseTime |
| Преимущества | 16 фраз | districtType |
| Покрытие | Динамическое | landmarks + streets |

**Типы округов:**

| Тип | Округа | Характеристика |
|-----|--------|----------------|
| `central` | ЦАО | Элитная застройка, исторические здания |
| `residential` | САО, СВАО, ЮАО | Спальные районы, панельные дома |
| `business` | ЗАО, ЮЗАО, СЗАО | Бизнес-центры, офисы |
| `industrial` | ВАО, ЮВАО | Промзоны, склады, производство |
| `suburban` | НАО, ТАО, ЗелАО | Пригород, удалённые районы |

---

### Этап 3: Интеграция в NeighborhoodPage

**Файл:** `src/pages/NeighborhoodPage.tsx`, строка 54

```typescript
// ТЕКУЩИЙ КОД:
const extendedContent = getNeighborhoodContent(neighborhood.slug);

// НОВЫЙ КОД:
import { generateNeighborhoodContent } from '@/lib/neighborhoodContentGenerator';

const extendedContent = getNeighborhoodContent(neighborhood.slug) 
  || generateNeighborhoodContent(neighborhood);
```

Это обеспечит:
- Приоритет ручного контента из `neighborhoodContent.ts`
- Автоматическую генерацию для остальных 120 районов

---

## Технические изменения

### Файлы для изменения:

| Файл | Изменения |
|------|-----------|
| `src/data/neighborhoods.ts` | Исправить `genDescription`, обновить `fillNeighborhoodData` |
| `src/lib/neighborhoodContentGenerator.ts` | Новый файл — генератор уникального контента |
| `src/pages/NeighborhoodPage.tsx` | Добавить fallback на генератор |

### Структура нового генератора:

```text
src/lib/neighborhoodContentGenerator.ts
├── getDistrictType(districtId) → 'central' | 'residential' | 'business' | 'industrial' | 'suburban'
├── generateUniqueIntro(neighborhood, type, rng) → string
├── generateWhyUs(neighborhood, type, rng) → string[]
├── generateCoverage(neighborhood) → string
├── generateAdvantages(type, rng) → string[]
└── generateNeighborhoodContent(neighborhood) → NeighborhoodContent
```

---

## Примеры результата

### До исправления (Северное Медведково):
> "Район Северное Медведково в **район Северное Медведково** — один из районов Москвы..."

### После исправления:
> "Северное Медведково — район в **Северо-Восточном округе** Москвы, где мы оказываем услуги 
> профессиональной дезинфекции. Время прибытия мастера — 40-50 минут. 
> Обрабатываем квартиры, офисы, рестораны. Ориентиры: метро Медведково, парк Медведково, 
> Заповедная улица. Гарантия 1 год."

### Сгенерированный контент для секции "Почему мы":
- Знаем особенности панельных домов СВАО
- Работаем со старым жилым фондом 70-80-х годов
- Быстрый выезд — 40-50 минут в ваш район
- Опыт обработки первых этажей над подвалами
- Скидки для пенсионеров 10%

---

## Безопасность изменений

| Аспект | Статус |
|--------|--------|
| URL-структура | Без изменений |
| Schema.org разметка | Без изменений |
| Canonical URLs | Без изменений |
| Существующий контент | Приоритет сохраняется |
| SEO-метаданные | Без изменений |

---

## Порядок выполнения

```text
1. Исправить genDescription() в neighborhoods.ts
2. Создать neighborhoodContentGenerator.ts
3. Обновить NeighborhoodPage.tsx для использования генератора
4. Протестировать на /rajony/severnoe-medvedkovo
```
