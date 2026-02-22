

# Добавить фоновые фото на карточки округов и городов МО

## Проблема
Сейчас карточки округов (DistrictsOverview) и городов МО (MoscowRegionOverview) — белые без фото. Страницы городов МО (MoscowRegionCityPage) тоже без фоновых изображений в hero. На страницах округов (DistrictHero) фото уже есть, но сильно размыты.

## Что будет сделано

### 1. Маппинг фото для городов МО
Файл: `src/data/districtImages.ts`

Добавить маппинг городов к фото из папки `front`:
- Мытищи -- `new-residential-park.png` (многоэтажки)
- Химки -- `academica-complex.png` (жилой комплекс)
- Люберцы -- `residential-park-sports.png` (новостройки)
- Балашиха -- `soviet-panel-courtyard.png` (панельные дома)
- Королёв -- `ostankino-tower.png` (ориентир)
- Одинцово -- `elite-cottage-village.png` (коттеджи)
- Красногорск -- `modern-residential-forest.png` (новостройки)
- Подольск -- `warehouse-logistics.png` (промзона)
- Щёлково -- `wooden-houses-forest.png` (частный сектор)
- Долгопрудный -- `apartment-vdnh-view.png` (жилой район)

### 2. Карточки округов с фоновыми фото
Файл: `src/pages/DistrictsOverview.tsx`

Переделать Card каждого округа: добавить фоновое изображение из `districtImages`, полупрозрачный темный оверлей, белый текст поверх. Карточка становится визуально привлекательной, фото четко видно.

Дизайн карточки:
- Высота ~220px, `relative overflow-hidden rounded-xl`
- Фото на заднем фоне: `bg-cover bg-center` (без blur)
- Темный градиент снизу: `bg-gradient-to-t from-black/70 via-black/30 to-transparent`
- Текст белый внизу карточки: название округа, время выезда, районы

### 3. Карточки городов МО с фоновыми фото
Файл: `src/pages/MoscowRegionOverview.tsx`

Аналогично округам: карточки городов получают фоновое фото из нового маппинга. Та же структура: фото без blur, темный градиент, белый текст.

### 4. Hero на странице города МО
Файл: `src/pages/MoscowRegionCityPage.tsx`

Добавить фоновое фото в hero-секцию (аналогично DistrictHero): использовать `HeroBackground` с изображением города, поверх полупрозрачный первичный оверлей, белый текст.

### 5. Уменьшить blur на hero округов
Файл: `src/components/district/DistrictHero.tsx`

Изменить `blur={4}` на `blur={1}`, чтобы фото было видно более четко.

## Технические детали

### Файлы для изменения
1. `src/data/districtImages.ts` -- добавить `cityImages` маппинг + `getCityImage()` 
2. `src/pages/DistrictsOverview.tsx` -- карточки с фоновыми фото
3. `src/pages/MoscowRegionOverview.tsx` -- карточки городов с фото
4. `src/pages/MoscowRegionCityPage.tsx` -- hero с фоновым фото
5. `src/components/district/DistrictHero.tsx` -- уменьшить blur

### Что НЕ меняется
- Фото не копируются, используются существующие из `public/images/front`
- Логика роутинга, SEO, schema.org не затрагиваются
- Данные в `districtPages.ts` и `moscowRegion.ts` не меняются

