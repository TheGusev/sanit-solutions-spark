/**
 * Маппинг округов Москвы к изображениям
 * Используется для динамического отображения фото на страницах округов
 */

export const districtImages: Record<string, string> = {
  cao: '/images/backgrounds/novy-arbat-evening.png',
  sao: '/images/backgrounds/aviapark-mall.png',
  svao: '/images/front/ostankino-tower.png',
  vao: '/images/front/xl-perovo-mall.png',
  yuvao: '/images/front/waterfront-yacht-complex.png',
  yao: '/images/front/sleeping-district-aerial.png',
  yzao: '/images/backgrounds/rumyantsevo-business.png',
  zao: '/images/front/luxury-mansion-cars.png',
  szao: '/images/backgrounds/tushino-business-center.png',
  default: '/images/backgrounds/moscow-panorama-sunset.jpg'
};

export const getDistrictImage = (districtId: string): string => {
  return districtImages[districtId.toLowerCase()] || districtImages.default;
};

// Маппинг городов МО к изображениям
export const cityImages: Record<string, string> = {
  mytishchi: '/images/front/new-residential-park.png',
  khimki: '/images/front/academica-complex.png',
  lyubertsy: '/images/front/residential-park-sports.png',
  balashikha: '/images/front/soviet-panel-courtyard.png',
  korolev: '/images/front/ostankino-tower.png',
  odintsovo: '/images/front/elite-cottage-village.png',
  krasnogorsk: '/images/front/modern-residential-forest.png',
  podolsk: '/images/front/warehouse-logistics.png',
  shchyolkovo: '/images/front/wooden-houses-forest.png',
  dolgoprudny: '/images/front/apartment-vdnh-view.png',
  klin: '/images/front/classical-estate-pond.png',
  ramenskoe: '/images/front/logistics-center.png',
  chekhov: '/images/front/dacha-house.png',
  domodedovo: '/images/front/night-towers.jpg',
  default: '/images/backgrounds/moscow-panorama-sunset.jpg'
};

export const getCityImage = (citySlug: string): string => {
  return cityImages[citySlug.toLowerCase()] || cityImages.default;
};

// Маппинг категорий блога к изображениям
export const blogCategoryImages: Record<string, string> = {
  'Вредители': '/images/front/farm-countryside.png',
  'Дезинфекция': '/images/front/minimalist-kitchen.jpg',
  'Помещения': '/images/front/soviet-panel-closeup.png',
  'Законы': '/images/front/business-center-vdnh.png',
  'Подготовка': '/images/front/apartment-park-view.png',
  'Кейсы': '/images/front/restaurant-evening.png',
  'Советы': '/images/front/suburban-house-garden.png',
  'default': '/images/backgrounds/moscow-panorama-sunset.jpg'
};

export const getBlogCategoryImage = (category: string): string => {
  return blogCategoryImages[category] || blogCategoryImages.default;
};
