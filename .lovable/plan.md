

# Фотогалереи «До / Процесс / После» для дезинсекции, дератизации и дезинфекции

## Что делаем

Генерируем 9 AI-изображений (по 3 на каждую услугу) и расширяем галерейную секцию в `ServicePage.tsx` на три основные услуги.

## 1. Генерация изображений

| Услуга | Файл | Описание |
|--------|------|----------|
| Дезинсекция | `dezinsection-before.png` | Тараканы/клопы на кухонном плинтусе, крупный план |
| Дезинсекция | `dezinsection-process.png` | Специалист в защитном костюме распыляет средство в квартире |
| Дезинсекция | `dezinsection-after.png` | Чистая кухня после обработки, блеск и порядок |
| Дератизация | `deratization-before.png` | Следы грызунов: погрызенные провода, помёт в подвале |
| Дератизация | `deratization-process.png` | Установка ловушек и приманочных станций в техническом помещении |
| Дератизация | `deratization-after.png` | Чистый подвал, заделанные щели, установленная защита |
| Дезинфекция | `dezinfection-before.png` | Старое помещение с плесенью и загрязнениями на стенах |
| Дезинфекция | `dezinfection-process.png` | Обработка помещения генератором холодного тумана |
| Дезинфекция | `dezinfection-after.png` | Чистое продезинфицированное помещение, белые стены |

Все сохраняются в `public/images/services/`.

## 2. Обновление `ServicePage.tsx`

Заменить условие `service.slug === 'borba-s-krotami'` на маппинг по slug:

```typescript
const SERVICE_GALLERY: Record<string, Array<{src, title, desc, badge, badgeColor}>> = {
  'borba-s-krotami': [ /* существующие 3 карточки */ ],
  'dezinsekciya': [
    { src: '/images/services/dezinsection-before.png', title: 'Проблема: насекомые в квартире', ... badge: 'До обработки' },
    { src: '/images/services/dezinsection-process.png', title: 'Процесс: обработка помещения', ... badge: 'Процесс' },
    { src: '/images/services/dezinsection-after.png', title: 'Результат: чистое помещение', ... badge: 'После' },
  ],
  'deratizaciya': [ ... ],
  'dezinfekciya': [ ... ],
};
```

Секция рендерится если `SERVICE_GALLERY[service.slug]` существует — один блок кода вместо четырёх условий.

## Технические детали

- Генерация через `lov-exec` + `lovable_ai.py --image` с моделью `google/gemini-3-pro-image-preview`
- 9 последовательных вызовов с паузами для избежания rate limit
- Существующие изображения для кротов остаются без изменений

