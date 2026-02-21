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
