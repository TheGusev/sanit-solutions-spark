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
    heroImage: '/images/front/cafe-terrace.png',
    galleryImages: [
      { url: '/images/front/cafe-terrace.png', title: 'Уличные кафе и рестораны Арбата', category: 'commercial' },
      { url: '/images/front/panorama-restaurant.png', title: 'Панорамные рестораны района', category: 'commercial' },
      { url: '/images/front/apartment-park-view.png', title: 'Квартиры с видом на парк', category: 'interior' }
    ],
    altText: 'Дезинфекция и дезинсекция жилых домов на Арбате - Москва'
  },
  {
    slug: 'tverskoy',
    name: 'Тверской',
    heroImage: '/images/front/boulevard-pond.png',
    galleryImages: [
      { url: '/images/front/boulevard-pond.png', title: 'Тверской бульвар и достопримечательности', category: 'landmark' },
      { url: '/images/front/business-center-vdnh.png', title: 'Бизнес-центры Тверского района', category: 'commercial' },
      { url: '/images/front/loft-bedroom.jpg', title: 'Современные интерьеры', category: 'interior' }
    ],
    altText: 'Обработка квартир и офисов в Тверском районе Москвы'
  },
  {
    slug: 'khamovniki',
    name: 'Хамовники',
    heroImage: '/images/backgrounds/elite-residential-columns.png',
    galleryImages: [
      { url: '/images/backgrounds/elite-residential-columns.png', title: 'Элитные ЖК Хамовников', category: 'residential' },
      { url: '/images/front/luxury-house-interior.jpg', title: 'Роскошные интерьеры', category: 'interior' },
      { url: '/images/front/classical-estate-pond.png', title: 'Усадьбы района', category: 'landmark' }
    ],
    altText: 'Дезинсекция элитной недвижимости в Хамовниках'
  },
  {
    slug: 'zamoskvorechye',
    name: 'Замоскворечье',
    heroImage: '/images/front/apartment-park-view.png',
    galleryImages: [
      { url: '/images/front/apartment-park-view.png', title: 'Квартиры с видом на парк', category: 'interior' },
      { url: '/images/front/waterfront-yacht-complex.png', title: 'Новостройки у Москвы-реки', category: 'residential' },
      { url: '/images/front/smart-bathroom.jpg', title: 'Современные квартиры после ремонта', category: 'interior' }
    ],
    altText: 'Уничтожение вредителей в Замоскворечье - жилые дома и квартиры'
  },
  {
    slug: 'presnensky',
    name: 'Пресненский',
    heroImage: '/images/front/panorama-restaurant.png',
    galleryImages: [
      { url: '/images/front/panorama-restaurant.png', title: 'Москва-Сити и панорамные рестораны', category: 'commercial' },
      { url: '/images/front/office-moscow-city-view.png', title: 'Офисы с видом на Москва-Сити', category: 'commercial' },
      { url: '/images/front/night-towers.jpg', title: 'Ночные небоскрёбы', category: 'landmark' }
    ],
    altText: 'Дезинфекция высотных зданий и офисов в Пресненском районе'
  },
  {
    slug: 'basmanny',
    name: 'Басманный',
    heroImage: '/images/front/soviet-panel-courtyard.png',
    galleryImages: [
      { url: '/images/front/soviet-panel-courtyard.png', title: 'Жилой фонд Басманного района', category: 'residential' },
      { url: '/images/front/badaevsky-loft-quarter.png', title: 'Лофт-кварталы', category: 'commercial' },
      { url: '/images/front/minimalist-kitchen.jpg', title: 'Современные интерьеры', category: 'interior' }
    ],
    altText: 'Обработка квартир и зданий в Басманном районе Москвы'
  },
  {
    slug: 'yakimanka',
    name: 'Якиманка',
    heroImage: '/images/backgrounds/riverside-towers.png',
    galleryImages: [
      { url: '/images/backgrounds/riverside-towers.png', title: 'Элитные башни на набережной', category: 'residential' },
      { url: '/images/front/luxury-mansion-cars.png', title: 'Элитная недвижимость Якиманки', category: 'residential' },
      { url: '/images/front/luxury-house-interior.jpg', title: 'Премиум интерьеры', category: 'interior' }
    ],
    altText: 'Дезинсекция элитного жилья на Якиманке'
  },
  {
    slug: 'meshchansky',
    name: 'Мещанский',
    heroImage: '/images/front/business-center-vdnh.png',
    galleryImages: [
      { url: '/images/front/business-center-vdnh.png', title: 'Бизнес-центры у ВДНХ', category: 'commercial' },
      { url: '/images/front/apartment-vdnh-view.png', title: 'Квартиры с видом на ВДНХ', category: 'interior' },
      { url: '/images/front/residential-park-sports.png', title: 'ЖК с парком', category: 'residential' }
    ],
    altText: 'Санитарная обработка в Мещанском районе'
  },
  {
    slug: 'dorogomilovo',
    name: 'Дорогомилово',
    heroImage: '/images/backgrounds/riverside-office.png',
    galleryImages: [
      { url: '/images/backgrounds/riverside-office.png', title: 'Офисные здания у реки', category: 'commercial' },
      { url: '/images/front/badaevsky-loft-quarter.png', title: 'Лофт-квартал Бадаевский', category: 'residential' },
      { url: '/images/front/modern-residential-forest.png', title: 'Новые ЖК', category: 'residential' }
    ],
    altText: 'Дезинсекция новостроек и офисов в Дорогомилово'
  },
  {
    slug: 'tagansky',
    name: 'Таганский',
    heroImage: '/images/front/sleeping-district-aerial.png',
    galleryImages: [
      { url: '/images/front/sleeping-district-aerial.png', title: 'Жилые кварталы Таганского', category: 'residential' },
      { url: '/images/front/soviet-panel-closeup.png', title: 'Панельные дома района', category: 'residential' },
      { url: '/images/front/warehouse-logistics.png', title: 'Промышленные объекты', category: 'commercial' }
    ],
    altText: 'Комплексная дезинсекция объектов в Таганском районе'
  }
];

// Дополнительные районы для расширенного маппинга
export const additionalNeighborhoodImages: NeighborhoodImage[] = [
  {
    slug: 'begovoy',
    name: 'Беговой',
    heroImage: '/images/backgrounds/aviapark-mall.png',
    galleryImages: [
      { url: '/images/backgrounds/aviapark-mall.png', title: 'ТЦ Авиапарк', category: 'commercial' },
      { url: '/images/front/new-residential-park.png', title: 'Новые ЖК Бегового', category: 'residential' }
    ],
    altText: 'Дезинфекция и дезинсекция в районе Беговой - Москва'
  },
  {
    slug: 'sokol',
    name: 'Сокол',
    heroImage: '/images/front/academica-complex.png',
    galleryImages: [
      { url: '/images/front/academica-complex.png', title: 'ЖК Академика', category: 'residential' },
      { url: '/images/front/elite-cottage-village.png', title: 'Частные дома посёлка Сокол', category: 'residential' }
    ],
    altText: 'Обработка элитной недвижимости в районе Сокол'
  },
  {
    slug: 'aeroport',
    name: 'Аэропорт',
    heroImage: '/images/front/new-residential-park.png',
    galleryImages: [
      { url: '/images/front/new-residential-park.png', title: 'Современные ЖК района Аэропорт', category: 'residential' },
      { url: '/images/front/business-center-vdnh.png', title: 'Бизнес-центры', category: 'commercial' }
    ],
    altText: 'Санитарная обработка в районе Аэропорт'
  },
  {
    slug: 'savelovskiy',
    name: 'Савёловский',
    heroImage: '/images/front/residential-park-sports.png',
    galleryImages: [
      { url: '/images/front/residential-park-sports.png', title: 'ЖК с парком и спортплощадкой', category: 'residential' },
      { url: '/images/front/smart-bathroom.jpg', title: 'Современные интерьеры', category: 'interior' }
    ],
    altText: 'Дезинсекция квартир в Савёловском районе'
  },
  {
    slug: 'timiryazevskiy',
    name: 'Тимирязевский',
    heroImage: '/images/front/modern-residential-forest.png',
    galleryImages: [
      { url: '/images/front/modern-residential-forest.png', title: 'ЖК у парка и леса', category: 'residential' },
      { url: '/images/front/suburban-house-garden.png', title: 'Загородные дома района', category: 'residential' }
    ],
    altText: 'Обработка жилых домов в Тимирязевском районе'
  },
  {
    slug: 'ostankino',
    name: 'Останкинский',
    heroImage: '/images/front/apartment-vdnh-view.png',
    galleryImages: [
      { url: '/images/front/apartment-vdnh-view.png', title: 'Квартиры с видом на ВДНХ', category: 'interior' },
      { url: '/images/front/ostankino-tower.png', title: 'Останкинская телебашня', category: 'landmark' }
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
  return images?.heroImage || '/images/backgrounds/moscow-panorama-sunset.jpg';
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
