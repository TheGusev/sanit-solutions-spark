/**
 * Маппинг округов Москвы к изображениям
 * Используется для динамического отображения фото на страницах округов
 */

export const districtImages: Record<string, string> = {
  cao: '/images/neighborhoods/high-rise-buildings.png',
  sao: '/images/neighborhoods/modern-cottage.png',
  svao: '/images/neighborhoods/brick-cottage.png',
  vao: '/images/neighborhoods/warehouse-industrial.png',
  yuvao: '/images/neighborhoods/waterfront-residential.png',
  yao: '/images/neighborhoods/interior-park.png',
  yzao: '/images/neighborhoods/country-house.png',
  zao: '/images/neighborhoods/luxury-mansion.png',
  szao: '/images/neighborhoods/kindergarten.png',
  default: '/images/neighborhoods/high-rise-buildings.png'
};

export const getDistrictImage = (districtId: string): string => {
  return districtImages[districtId.toLowerCase()] || districtImages.default;
};

// Маппинг категорий блога к изображениям
export const blogCategoryImages: Record<string, string> = {
  'Вредители': '/images/neighborhoods/interior-park.png',
  'Дезинфекция': '/images/neighborhoods/interior-vdnh.png',
  'Помещения': '/images/neighborhoods/high-rise-buildings.png',
  'Законы': '/images/neighborhoods/warehouse-industrial.png',
  'Подготовка': '/images/neighborhoods/modern-cottage.png',
  'Кейсы': '/images/neighborhoods/waterfront-residential.png',
  'Советы': '/images/neighborhoods/country-house.png',
  'default': '/images/neighborhoods/brick-cottage.png'
};

export const getBlogCategoryImage = (category: string): string => {
  return blogCategoryImages[category] || blogCategoryImages.default;
};
