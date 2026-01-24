/**
 * Маппинг районов Москвы к изображениям недвижимости
 * Используется для динамического отображения релевантных фото на страницах районов
 */

export interface NeighborhoodImage {
  slug: string;
  name: string;
  heroImage: string;
  galleryImages: {
    url: string;
    title: string;
    category: 'residential' | 'commercial' | 'landmark' | 'interior';
  }[];
  altText: string;
}

export const neighborhoodImages: NeighborhoodImage[] = [
  {
    slug: 'arbat',
    name: 'Арбат',
    heroImage: '/images/neighborhoods/country-house.png',
    galleryImages: [
      { url: '/images/neighborhoods/country-house.png', title: 'Исторический жилой фонд Арбата', category: 'residential' },
      { url: '/images/neighborhoods/interior-park.png', title: 'Современные интерьеры после ремонта', category: 'interior' },
      { url: '/images/neighborhoods/brick-cottage.png', title: 'Частные дома района', category: 'residential' }
    ],
    altText: 'Дезинфекция и дезинсекция жилых домов на Арбате - Москва'
  },
  {
    slug: 'tverskoy',
    name: 'Тверской',
    heroImage: '/images/neighborhoods/high-rise-buildings.png',
    galleryImages: [
      { url: '/images/neighborhoods/high-rise-buildings.png', title: 'Элитная недвижимость Тверского района', category: 'residential' },
      { url: '/images/neighborhoods/warehouse-industrial.png', title: 'Бизнес-центры и офисы', category: 'commercial' },
      { url: '/images/neighborhoods/interior-vdnh.png', title: 'Премиум интерьеры', category: 'interior' }
    ],
    altText: 'Обработка квартир и офисов в Тверском районе Москвы'
  },
  {
    slug: 'khamovniki',
    name: 'Хамовники',
    heroImage: '/images/neighborhoods/luxury-mansion.png',
    galleryImages: [
      { url: '/images/neighborhoods/luxury-mansion.png', title: 'Элитные особняки Хамовников', category: 'residential' },
      { url: '/images/neighborhoods/high-rise-buildings.png', title: 'Престижные жилые комплексы', category: 'residential' },
      { url: '/images/neighborhoods/interior-park.png', title: 'Роскошные интерьеры с видом на парк', category: 'interior' }
    ],
    altText: 'Дезинсекция элитной недвижимости в Хамовниках'
  },
  {
    slug: 'zamoskvorechye',
    name: 'Замоскворечье',
    heroImage: '/images/neighborhoods/brick-cottage.png',
    galleryImages: [
      { url: '/images/neighborhoods/brick-cottage.png', title: 'Исторический жилой фонд Замоскворечья', category: 'residential' },
      { url: '/images/neighborhoods/waterfront-residential.png', title: 'Новостройки у Москвы-реки', category: 'residential' },
      { url: '/images/neighborhoods/interior-park.png', title: 'Современные квартиры после ремонта', category: 'interior' }
    ],
    altText: 'Уничтожение вредителей в Замоскворечье - жилые дома и квартиры'
  },
  {
    slug: 'presnensky',
    name: 'Пресненский',
    heroImage: '/images/neighborhoods/high-rise-buildings.png',
    galleryImages: [
      { url: '/images/neighborhoods/high-rise-buildings.png', title: 'Небоскребы Москва-Сити', category: 'residential' },
      { url: '/images/neighborhoods/warehouse-industrial.png', title: 'Бизнес-центры и офисные здания', category: 'commercial' },
      { url: '/images/neighborhoods/interior-vdnh.png', title: 'Современные офисные пространства', category: 'interior' }
    ],
    altText: 'Дезинфекция высотных зданий и офисов в Пресненском районе'
  },
  {
    slug: 'basmanny',
    name: 'Басманный',
    heroImage: '/images/neighborhoods/waterfront-residential.png',
    galleryImages: [
      { url: '/images/neighborhoods/waterfront-residential.png', title: 'Современные ЖК Басманного района', category: 'residential' },
      { url: '/images/neighborhoods/country-house.png', title: 'Старый жилой фонд', category: 'residential' },
      { url: '/images/neighborhoods/warehouse-industrial.png', title: 'Коммерческая недвижимость', category: 'commercial' }
    ],
    altText: 'Обработка квартир и зданий в Басманном районе Москвы'
  },
  {
    slug: 'yakimanka',
    name: 'Якиманка',
    heroImage: '/images/neighborhoods/interior-vdnh.png',
    galleryImages: [
      { url: '/images/neighborhoods/interior-vdnh.png', title: 'Элитная недвижимость у Москвы-реки', category: 'interior' },
      { url: '/images/neighborhoods/luxury-mansion.png', title: 'Особняки и таунхаусы Якиманки', category: 'residential' },
      { url: '/images/neighborhoods/interior-park.png', title: 'Премиум интерьеры с видом на реку', category: 'interior' }
    ],
    altText: 'Дезинсекция элитного жилья на Якиманке'
  },
  {
    slug: 'meshchansky',
    name: 'Мещанский',
    heroImage: '/images/neighborhoods/kindergarten.png',
    galleryImages: [
      { url: '/images/neighborhoods/kindergarten.png', title: 'Детские сады и школы', category: 'landmark' },
      { url: '/images/neighborhoods/waterfront-residential.png', title: 'Современные жилые комплексы', category: 'residential' },
      { url: '/images/neighborhoods/brick-cottage.png', title: 'Исторические здания района', category: 'residential' }
    ],
    altText: 'Санитарная обработка детских учреждений в Мещанском районе'
  },
  {
    slug: 'dorogomilovo',
    name: 'Дорогомилово',
    heroImage: '/images/neighborhoods/modern-cottage.png',
    galleryImages: [
      { url: '/images/neighborhoods/modern-cottage.png', title: 'Новостройки Дорогомилово', category: 'residential' },
      { url: '/images/neighborhoods/warehouse-industrial.png', title: 'Складские комплексы', category: 'commercial' },
      { url: '/images/neighborhoods/high-rise-buildings.png', title: 'Высотные жилые башни', category: 'residential' }
    ],
    altText: 'Дезинсекция новостроек и складов в Дорогомилово'
  },
  {
    slug: 'tagansky',
    name: 'Таганский',
    heroImage: '/images/neighborhoods/warehouse-industrial.png',
    galleryImages: [
      { url: '/images/neighborhoods/warehouse-industrial.png', title: 'Промышленные объекты', category: 'commercial' },
      { url: '/images/neighborhoods/high-rise-buildings.png', title: 'Жилые комплексы Таганского района', category: 'residential' },
      { url: '/images/neighborhoods/waterfront-residential.png', title: 'Современное жилье', category: 'residential' }
    ],
    altText: 'Комплексная дезинсекция объектов в Таганском районе'
  }
];

// Дополнительные районы для расширенного маппинга
export const additionalNeighborhoodImages: NeighborhoodImage[] = [
  {
    slug: 'begovoy',
    name: 'Беговой',
    heroImage: '/images/neighborhoods/high-rise-buildings.png',
    galleryImages: [
      { url: '/images/neighborhoods/high-rise-buildings.png', title: 'Жилые комплексы Бегового', category: 'residential' },
      { url: '/images/neighborhoods/modern-cottage.png', title: 'Современные новостройки', category: 'residential' }
    ],
    altText: 'Дезинфекция и дезинсекция в районе Беговой - Москва'
  },
  {
    slug: 'sokol',
    name: 'Сокол',
    heroImage: '/images/neighborhoods/luxury-mansion.png',
    galleryImages: [
      { url: '/images/neighborhoods/luxury-mansion.png', title: 'Элитный жилой фонд Сокола', category: 'residential' },
      { url: '/images/neighborhoods/country-house.png', title: 'Частные дома посёлка Сокол', category: 'residential' }
    ],
    altText: 'Обработка элитной недвижимости в районе Сокол'
  },
  {
    slug: 'aeroport',
    name: 'Аэропорт',
    heroImage: '/images/neighborhoods/modern-cottage.png',
    galleryImages: [
      { url: '/images/neighborhoods/modern-cottage.png', title: 'Современные ЖК района Аэропорт', category: 'residential' },
      { url: '/images/neighborhoods/warehouse-industrial.png', title: 'Бизнес-центры', category: 'commercial' }
    ],
    altText: 'Санитарная обработка в районе Аэропорт'
  },
  {
    slug: 'savelovskiy',
    name: 'Савёловский',
    heroImage: '/images/neighborhoods/waterfront-residential.png',
    galleryImages: [
      { url: '/images/neighborhoods/waterfront-residential.png', title: 'Новостройки Савёловского', category: 'residential' },
      { url: '/images/neighborhoods/interior-vdnh.png', title: 'Современные интерьеры', category: 'interior' }
    ],
    altText: 'Дезинсекция квартир в Савёловском районе'
  },
  {
    slug: 'timiryazevskiy',
    name: 'Тимирязевский',
    heroImage: '/images/neighborhoods/interior-park.png',
    galleryImages: [
      { url: '/images/neighborhoods/interior-park.png', title: 'Зелёный район Москвы', category: 'residential' },
      { url: '/images/neighborhoods/kindergarten.png', title: 'Образовательные учреждения', category: 'landmark' }
    ],
    altText: 'Обработка жилых домов в Тимирязевском районе'
  },
  {
    slug: 'ostankino',
    name: 'Останкинский',
    heroImage: '/images/neighborhoods/interior-vdnh.png',
    galleryImages: [
      { url: '/images/neighborhoods/interior-vdnh.png', title: 'ВДНХ и окрестности', category: 'landmark' },
      { url: '/images/neighborhoods/high-rise-buildings.png', title: 'Высотные дома Останкино', category: 'residential' }
    ],
    altText: 'Дезинфекция в Останкинском районе'
  }
];

// Объединённый список всех районов
export const allNeighborhoodImages = [...neighborhoodImages, ...additionalNeighborhoodImages];

// Функция для получения изображений района по slug
export const getNeighborhoodImages = (slug: string): NeighborhoodImage | undefined => {
  return allNeighborhoodImages.find(img => img.slug === slug);
};

// Функция для получения hero-изображения с fallback
export const getNeighborhoodHeroImage = (slug: string): string => {
  const images = getNeighborhoodImages(slug);
  return images?.heroImage || '/images/neighborhoods/waterfront-residential.png';
};

// Вспомогательная функция для категорий
export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    residential: 'Жилое',
    commercial: 'Коммерческое',
    landmark: 'Учреждение',
    interior: 'После ремонта'
  };
  return labels[category] || category;
};
