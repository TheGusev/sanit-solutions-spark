
# Финальный сводный план: интеграция ВСЕХ 48 фото на сайт

Это финальный план, который охватывает все загруженные фото из всех партий и реализуется за один подход.

---

## Последние 5 фото (партия 3, часть 3 -- финал)

| # | Фото | Содержание | Имя файла |
|---|------|-----------|-----------|
| 45 | d197c2e8 | Спальный район, панельки + высотки, детская площадка, аэросъемка | `sleeping-district-aerial.png` |
| 46 | dfe6dd78 | Советская панельная многоэтажка крупным планом, двор, качели | `soviet-panel-closeup.png` |
| 47 | edf5487b | Элитный ЖК на набережной с яхт-мариной | `waterfront-yacht-complex.png` |
| 48 | f0efbf79 | Новый ЖК у леса/парка, современные дома | `modern-residential-forest.png` |
| 49 | f1dbd7e0 | Крупный логистический центр, фуры, промзона | `warehouse-logistics.png` |

---

## Полный инвентарь: 48 файлов в 3 папках

### `public/images/work/` -- 4 фото работ мастера

| Имя файла | Содержание |
|-----------|-----------|
| `corridor-treatment.jpg` | Мастер обрабатывает коридор подъезда |
| `specialist-closeup.jpg` | Крупный план мастера у потолка |
| `baseboard-treatment.jpg` | Мастер на корточках у плинтусов |
| `kitchen-treatment.jpg` | Мастер обрабатывает кухню |

### `public/images/backgrounds/` -- 20 городских фонов (blur)

| Имя файла | Содержание |
|-----------|-----------|
| `moscow-city-day.png` | Москва-Сити днем |
| `mitino-mall.png` | ТЦ Митино Молл |
| `rumyantsevo-business.png` | Бизнес-парк Румянцево |
| `riverside-office.png` | Круглое офисное здание у реки |
| `moscow-city-evening.png` | Москва-Сити на закате |
| `galereya-akademiya.png` | Галерея Академия |
| `galereya-mall.png` | Торговый центр Галерея |
| `office-residential.png` | Офис среди жилых кварталов |
| `glass-tower-river.png` | Стеклянная башня у реки |
| `new-highrise-complex.png` | Новостройки, высотный комплекс |
| `novy-arbat-evening.png` | Новый Арбат вечером |
| `kgroup-business-center.png` | Бизнес-центр K Group + сталинки |
| `riverside-towers.png` | Элитные башни на набережной |
| `aviapark-mall.png` | ТЦ Авиапарк |
| `tushino-business-center.png` | Тушино Бизнес-Центр |
| `elite-residential-columns.png` | Элитный ЖК с колоннами |
| `elite-courtyard-fountain.png` | Элитный ЖК с фонтаном |
| `zolotoy-vavilon-mall.png` | ТЦ Золотой Вавилон |
| `moscow-park-fountains.jpg` | Парк с фонтанами (ВДНХ) |
| `moscow-panorama-sunset.jpg` | Панорама Москвы на закате |

### `public/images/front/` -- 24 фото переднего фона

| Имя файла | Содержание |
|-----------|-----------|
| `logistics-center.png` | Логистический центр, склады |
| `ostankino-tower.png` | Останкинская телебашня |
| `farm-countryside.png` | Ферма, сельская местность |
| `elite-cottage-village.png` | Элитный коттеджный поселок |
| `academica-complex.png` | ЖК Академика |
| `dacha-house.png` | Дачный дом, березы |
| `restaurant-evening.png` | Ресторан вечером |
| `apartment-park-view.png` | Интерьер квартиры с видом на парк |
| `new-residential-park.png` | Новый ЖК с парком |
| `soviet-panel-courtyard.png` | Советские панельки, двор |
| `cafe-terrace.png` | Кафе "Софья", уличная терраса |
| `suburban-house-garden.png` | Загородный дом с садом |
| `panorama-restaurant.png` | Ресторан-панорама, вид на Москва-Сити |
| `apartment-vdnh-view.png` | Квартира с видом на ВДНХ |
| `boulevard-pond.png` | Бульвар с прудом, памятник |
| `wooden-houses-forest.png` | Деревянные дома в лесу |
| `business-center-vdnh.png` | Бизнес-центр у ВДНХ |
| `luxury-mansion-cars.png` | Элитный особняк с Rolls-Royce |
| `xl-perovo-mall.png` | ТЦ XL Перово |
| `sleeping-district-aerial.png` | Спальный район, аэросъемка |
| `soviet-panel-closeup.png` | Панельная многоэтажка крупным планом |
| `waterfront-yacht-complex.png` | ЖК на набережной с яхт-мариной |
| `modern-residential-forest.png` | Новый ЖК у леса |
| `warehouse-logistics.png` | Логистический центр, фуры |
| `badaevsky-loft-quarter.png` | Лофт-квартал Бадаевский |
| `office-moscow-city-view.png` | Офис с видом на Москва-Сити |
| `classical-estate-pond.jpg` | Усадьба с прудом |
| `loft-bedroom.jpg` | Лофт-спальня |
| `minimalist-kitchen.jpg` | Минималистичная кухня |
| `smart-bathroom.jpg` | Умная ванная |
| `luxury-house-interior.jpg` | Интерьер элитного дома |
| `night-towers.jpg` | Ночные высотки |
| `country-brick-house.png` | Кирпичный загородный дом |
| `residential-park-sports.png` | ЖК с парком и спортплощадкой |

---

## Распределение по округам (districtImages.ts)

| Округ | Было (проблема) | Новое фото |
|-------|-----------------|------------|
| **ЦАО** | high-rise-buildings | `/images/backgrounds/novy-arbat-evening.png` |
| **САО** | modern-cottage (коттедж!) | `/images/backgrounds/aviapark-mall.png` |
| **СВАО** | brick-cottage (коттедж!) | `/images/front/ostankino-tower.png` |
| **ВАО** | warehouse-industrial | `/images/front/xl-perovo-mall.png` |
| **ЮВАО** | waterfront-residential | `/images/front/waterfront-yacht-complex.png` |
| **ЮАО** | interior-park (интерьер!) | `/images/front/sleeping-district-aerial.png` |
| **ЮЗАО** | country-house (загородный дом!) | `/images/backgrounds/rumyantsevo-business.png` |
| **ЗАО** | luxury-mansion | `/images/front/luxury-mansion-cars.png` |
| **СЗАО** | kindergarten (детсад!) | `/images/backgrounds/tushino-business-center.png` |
| **default** | high-rise-buildings | `/images/backgrounds/moscow-panorama-sunset.jpg` |

### blogCategoryImages (в том же файле)

| Категория | Было | Станет |
|-----------|------|--------|
| Вредители | interior-park | `/images/front/farm-countryside.png` |
| Дезинфекция | interior-vdnh | `/images/front/minimalist-kitchen.jpg` |
| Помещения | high-rise-buildings | `/images/front/soviet-panel-closeup.png` |
| Законы | warehouse-industrial | `/images/front/business-center-vdnh.png` |
| Подготовка | modern-cottage | `/images/front/apartment-park-view.png` |
| Кейсы | waterfront-residential | `/images/front/restaurant-evening.png` |
| Советы | country-house | `/images/front/suburban-house-garden.png` |
| default | brick-cottage | `/images/backgrounds/moscow-panorama-sunset.jpg` |

---

## Распределение по районам (neighborhoodImages.ts)

Ключевые замены heroImage:

| Район | Округ | Было | Станет |
|-------|-------|------|--------|
| Арбат | ЦАО | country-house (!) | `/images/front/cafe-terrace.png` |
| Тверской | ЦАО | high-rise-buildings | `/images/front/boulevard-pond.png` |
| Хамовники | ЦАО | luxury-mansion | `/images/backgrounds/elite-residential-columns.png` |
| Замоскворечье | ЦАО | brick-cottage (!) | `/images/front/apartment-park-view.png` |
| Пресненский | ЦАО | high-rise-buildings | `/images/front/panorama-restaurant.png` |
| Басманный | ЦАО | waterfront-residential | `/images/front/soviet-panel-courtyard.png` |
| Якиманка | ЦАО | interior-vdnh | `/images/backgrounds/riverside-towers.png` |
| Мещанский | СВАО | kindergarten | `/images/front/business-center-vdnh.png` |
| Дорогомилово | ЗАО | modern-cottage | `/images/backgrounds/riverside-office.png` |
| Таганский | ЦАО | warehouse-industrial (!) | `/images/front/sleeping-district-aerial.png` |
| Беговой | САО | high-rise-buildings | `/images/backgrounds/aviapark-mall.png` |
| Сокол | САО | luxury-mansion | `/images/front/academica-complex.png` |
| Останкинский | СВАО | interior-vdnh | `/images/front/apartment-vdnh-view.png` |
| Тимирязевский | САО | interior-park | `/images/front/modern-residential-forest.png` |
| Аэропорт | САО | modern-cottage | `/images/front/new-residential-park.png` |
| Савёловский | САО | waterfront-residential | `/images/front/residential-park-sports.png` |

Также обновить galleryImages для всех районов, добавив новые фото в категории commercial, residential, interior, landmark.

---

## Hero.tsx -- ротация фонов (2 -> 5)

```text
HERO_BACKGROUNDS = [
  '/images/work/home-kitchen.png',
  '/images/work/living-room-treatment.png',
  '/images/work/kitchen-treatment.jpg',          // мастер на кухне
  '/images/backgrounds/moscow-panorama-sunset.jpg', // панорама Москвы
  '/images/work/corridor-treatment.jpg'           // мастер в коридоре
]
```

---

## WorkGallery.tsx -- +5 новых элементов (12 -> 17)

```text
{ type: "image", src: "/images/work/corridor-treatment.jpg", title: "Обработка подъезда", desc: "Дезинфекция мест общего пользования" }
{ type: "image", src: "/images/work/specialist-closeup.jpg", title: "Работа специалиста", desc: "Обработка стен и потолков" }
{ type: "image", src: "/images/work/baseboard-treatment.jpg", title: "Обработка плинтусов", desc: "Точечная дезинсекция в квартире" }
{ type: "image", src: "/images/work/kitchen-treatment.jpg", title: "Обработка кухни", desc: "Дезинсекция кухонной зоны" }
{ type: "image", src: "/images/front/restaurant-evening.png", title: "Обработка ресторана", desc: "Дезинсекция общепита" }
```

---

## ServicePage -- heroImage для услуг

Добавить поле `heroImage?: string` в интерфейс ServicePage (services.ts, строка 56):

| Услуга | heroImage |
|--------|-----------|
| Дезинфекция | `/images/work/corridor-treatment.jpg` |
| Дезинсекция | `/images/work/baseboard-treatment.jpg` |
| Борьба с кротами | `/images/front/farm-countryside.png` |

В ServicePage.tsx Hero-секцию: если `service.heroImage` задан -- показать фоновое изображение с `object-cover` + overlay `bg-black/50`, текст белым. Если нет -- текущий градиент.

---

## Файлы для изменения

| Файл | Действие |
|------|----------|
| `public/images/work/` | 4 новых файла |
| `public/images/backgrounds/` | 20 новых файлов |
| `public/images/front/` | 24 новых файла |
| `src/data/districtImages.ts` | Полное обновление: 9 округов + default + blogCategoryImages |
| `src/data/neighborhoodImages.ts` | Обновление heroImage и galleryImages для 16 районов |
| `src/components/Hero.tsx` | HERO_BACKGROUNDS: 2 -> 5 |
| `src/components/WorkGallery.tsx` | mediaItems: +5 записей |
| `src/data/services.ts` | +поле heroImage для 3 услуг |
| `src/pages/ServicePage.tsx` | Условный фон в Hero-секции |

---

## Мобильная версия

- Фоны округов/районов: через HeroBackground с blur. На мобайле blur снижается, overlay усиливается, scale(1.1) для покрытия
- WorkGallery: grid-cols-2 на мобайле, 3 на планшете, 4 на десктопе (уже работает)
- ServicePage Hero: фото с object-cover + полупрозрачный overlay, текст белым -- хорошо на мобайле
- Hero ротация: плавный crossfade между 5 фонами

Старые файлы в `/images/neighborhoods/` остаются как fallback.
