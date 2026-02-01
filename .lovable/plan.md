
# План: Добавление новых фото и видео в "Наши работы"

## Загруженные файлы

| Файл | Описание |
|------|----------|
| IMG_3380.MP4 | Видео процесса обработки |
| IMG_3385.MP4 | Видео работы на объекте |
| photo_2026-02-01_19-37-37.jpg | Генератор тумана в работе |
| photo_2026-02-01_19-37-42.jpg | Пустая комната после обработки |
| photo_2026-02-01_19-37-43.jpg | Профессиональные препараты |
| photo_2026-02-01_19-37-45.jpg | Специалист с документами и оборудованием |
| photo_2026-02-01_19-37-46.jpg | Обработка коммуникаций |

---

## Шаг 1: Скопировать файлы в public/images/work/

Сохранить с понятными именами:

```text
user-uploads://IMG_3380.MP4 → public/images/work/fog-treatment-video.mp4
user-uploads://IMG_3385.MP4 → public/images/work/site-work-video.mp4
user-uploads://photo_2026-02-01_19-37-37.jpg → public/images/work/fog-generator.jpg
user-uploads://photo_2026-02-01_19-37-42.jpg → public/images/work/clean-room.jpg
user-uploads://photo_2026-02-01_19-37-43.jpg → public/images/work/professional-chemicals.jpg
user-uploads://photo_2026-02-01_19-37-45.jpg → public/images/work/specialist-documents.jpg
user-uploads://photo_2026-02-01_19-37-46.jpg → public/images/work/pipes-treatment.jpg
```

---

## Шаг 2: Обновить WorkGallery.tsx

### 2.1 Расширить массив mediaItems

Добавить все новые фото и видео с описаниями:

```typescript
const mediaItems: MediaItem[] = [
  // Существующие
  { type: "video", src: "/images/work/work-video.mov", title: "Процесс обработки", desc: "Видео с объекта" },
  { type: "image", src: "/images/work/bedroom-disinfection.png", title: "Дезинсекция квартиры", desc: "Обработка спальни от клопов" },
  { type: "image", src: "/images/work/commercial-kitchen.png", title: "Дезинфекция кухни", desc: "Промышленное оборудование" },
  { type: "image", src: "/images/work/plumbing-treatment.png", title: "Герметизация", desc: "Обработка коммуникаций" },
  { type: "image", src: "/images/work/basement-work.png", title: "Техпомещения", desc: "Работа в подвалах" },
  
  // Новые видео
  { type: "video", src: "/images/work/fog-treatment-video.mp4", title: "Холодный туман", desc: "Обработка помещения" },
  { type: "video", src: "/images/work/site-work-video.mp4", title: "Работа на объекте", desc: "Реальный выезд" },
  
  // Новые фото
  { type: "image", src: "/images/work/fog-generator.jpg", title: "Генератор тумана", desc: "Профессиональное оборудование" },
  { type: "image", src: "/images/work/clean-room.jpg", title: "Результат работы", desc: "Помещение после обработки" },
  { type: "image", src: "/images/work/professional-chemicals.jpg", title: "Препараты", desc: "Сертифицированная химия" },
  { type: "image", src: "/images/work/specialist-documents.jpg", title: "Оформление документов", desc: "Договор и акт" },
  { type: "image", src: "/images/work/pipes-treatment.jpg", title: "Обработка труб", desc: "Работа с коммуникациями" },
];
```

### 2.2 Адаптировать сетку для 12 элементов

Изменить grid для лучшего отображения большего количества медиа:
- Мобильные: 2 колонки
- Планшет: 3 колонки
- Десктоп: 4 колонки

```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
```

---

## Итоговая структура галереи

| # | Тип | Название | Описание |
|---|-----|----------|----------|
| 1 | video | Процесс обработки | Видео с объекта |
| 2 | image | Дезинсекция квартиры | Обработка спальни от клопов |
| 3 | image | Дезинфекция кухни | Промышленное оборудование |
| 4 | image | Герметизация | Обработка коммуникаций |
| 5 | image | Техпомещения | Работа в подвалах |
| 6 | video | Холодный туман | Обработка помещения |
| 7 | video | Работа на объекте | Реальный выезд |
| 8 | image | Генератор тумана | Профессиональное оборудование |
| 9 | image | Результат работы | Помещение после обработки |
| 10 | image | Препараты | Сертифицированная химия |
| 11 | image | Оформление документов | Договор и акт |
| 12 | image | Обработка труб | Работа с коммуникациями |

---

## Файлы для изменения

| Файл | Изменения |
|------|-----------|
| `public/images/work/` | 2 новых видео + 5 новых фото |
| `src/components/WorkGallery.tsx` | Расширить mediaItems, обновить grid |

---

## Ожидаемый результат

- Галерея "Наши работы" содержит 12 элементов вместо 5
- 3 видео (автовоспроизведение, без звука, цикл)
- 9 фотографий реальных работ
- Адаптивная сетка 2/3/4 колонки
- Все медиа с hover-эффектом и подписями
