/**
 * Централизованные данные о городах Московской области для SSG-генерации.
 * Используется в: MoscowRegionCityPage, MoscowRegionServicePage, vite-plugin-ssg.ts
 */

export interface MoscowRegionCity {
  id: string;
  slug: string;
  name: string;
  genitive: string; // "Мытищ", "Химок"
  accusative: string; // "Мытищи", "Химки"
  prepositional: string; // "в Мытищах", "в Химках"
  population: number;
  distance: number; // км от МКАД
  surcharge: number; // наценка за выезд
  responseTime: string;
  landmarks: string[];
  description: string;
  features: string[]; // особенности работы в этом городе
  nearbyDistricts: string[]; // соседние районы Москвы (для перелинковки)
}

export const moscowRegionCities: MoscowRegionCity[] = [
  {
    id: 'mytishchi',
    slug: 'mytishchi',
    name: 'Мытищи',
    genitive: 'Мытищ',
    accusative: 'Мытищи',
    prepositional: 'в Мытищах',
    population: 235000,
    distance: 5,
    surcharge: 500,
    responseTime: '40-60 мин',
    landmarks: ['ТЦ Июнь', 'Мытищинский парк', 'ТРЦ XL'],
    description: 'Мытищи — крупный город-спутник Москвы с развитой инфраструктурой. Высокая плотность многоэтажной застройки создаёт условия для распространения вредителей между квартирами.',
    features: [
      'Обслуживаем все районы города',
      'Срочный выезд от 40 минут',
      'Знаем особенности местных новостроек'
    ],
    nearbyDistricts: ['svao', 'vao']
  },
  {
    id: 'khimki',
    slug: 'khimki',
    name: 'Химки',
    genitive: 'Химок',
    accusative: 'Химки',
    prepositional: 'в Химках',
    population: 260000,
    distance: 3,
    surcharge: 500,
    responseTime: '30-45 мин',
    landmarks: ['МЕГА Химки', 'Аэропорт Шереметьево', 'Арена Химки'],
    description: 'Химки — ближайший город к северу от Москвы. Близость к аэропорту и торговым центрам способствует миграции грызунов и насекомых.',
    features: [
      'Самый быстрый выезд из всех городов МО',
      'Работаем рядом с МЕГА и Шереметьево',
      'Обслуживаем коттеджные посёлки'
    ],
    nearbyDistricts: ['sao', 'szao']
  },
  {
    id: 'lyubertsy',
    slug: 'lyubertsy',
    name: 'Люберцы',
    genitive: 'Люберец',
    accusative: 'Люберцы',
    prepositional: 'в Люберцах',
    population: 210000,
    distance: 8,
    surcharge: 500,
    responseTime: '45-60 мин',
    landmarks: ['Наташинский парк', 'ТЦ Орбита', 'Кинопарк'],
    description: 'Люберцы — динамично развивающийся город с большим количеством новостроек. Проблемы с вредителями часто возникают в новых домах на этапе заселения.',
    features: [
      'Знаем проблемы местных новостроек',
      'Работаем с ЖК Самолёт, ПИК',
      'Обслуживаем частный сектор'
    ],
    nearbyDistricts: ['yuvao', 'vao']
  },
  {
    id: 'balashikha',
    slug: 'balashikha',
    name: 'Балашиха',
    genitive: 'Балашихи',
    accusative: 'Балашиху',
    prepositional: 'в Балашихе',
    population: 520000,
    distance: 10,
    surcharge: 700,
    responseTime: '50-70 мин',
    landmarks: ['Парк Пехорка', 'ТЦ Реутов Парк', 'Балашихинская картинная галерея'],
    description: 'Балашиха — самый населённый город Московской области. Огромное количество многоэтажек требует системного подхода к дезинсекции и дератизации.',
    features: [
      'Крупнейший город МО — знаем специфику',
      'Работаем со всеми районами',
      'Есть опыт работы с УК'
    ],
    nearbyDistricts: ['vao']
  },
  {
    id: 'korolev',
    slug: 'korolev',
    name: 'Королёв',
    genitive: 'Королёва',
    accusative: 'Королёв',
    prepositional: 'в Королёве',
    population: 225000,
    distance: 12,
    surcharge: 700,
    responseTime: '60-80 мин',
    landmarks: ['ЦУП', 'РКК Энергия', 'Парк Лосиный остров'],
    description: 'Королёв — наукоград с развитой космической отраслью. Много старых зданий советской постройки, где проблемы с вредителями особенно актуальны.',
    features: [
      'Работаем со старым фондом',
      'Знаем специфику хрущёвок и сталинок',
      'Обслуживаем научные учреждения'
    ],
    nearbyDistricts: ['svao']
  },
  {
    id: 'odintsovo',
    slug: 'odintsovo',
    name: 'Одинцово',
    genitive: 'Одинцова',
    accusative: 'Одинцово',
    prepositional: 'в Одинцове',
    population: 150000,
    distance: 15,
    surcharge: 700,
    responseTime: '50-70 мин',
    landmarks: ['Парк Ларисы Лазутиной', 'ТРЦ Одинцовский пассаж', 'Власиха'],
    description: 'Одинцово — престижный западный пригород Москвы. Много коттеджных посёлков и элитной застройки, где важно деликатное обслуживание.',
    features: [
      'Работаем с элитной застройкой',
      'Обслуживаем коттеджные посёлки',
      'Конфиденциальность и аккуратность'
    ],
    nearbyDistricts: ['zao']
  },
  {
    id: 'krasnogorsk',
    slug: 'krasnogorsk',
    name: 'Красногорск',
    genitive: 'Красногорска',
    accusative: 'Красногорск',
    prepositional: 'в Красногорске',
    population: 190000,
    distance: 8,
    surcharge: 500,
    responseTime: '40-60 мин',
    landmarks: ['Крокус Сити', 'Дом Правительства МО', 'Павшинская пойма'],
    description: 'Красногорск — административный центр Московской области. Активное строительство привлекает вредителей на строящиеся объекты.',
    features: [
      'Знаем новостройки Павшинской поймы',
      'Работаем с бизнес-центрами',
      'Обслуживаем ТЦ Крокус'
    ],
    nearbyDistricts: ['szao', 'sao']
  },
  {
    id: 'podolsk',
    slug: 'podolsk',
    name: 'Подольск',
    genitive: 'Подольска',
    accusative: 'Подольск',
    prepositional: 'в Подольске',
    population: 310000,
    distance: 20,
    surcharge: 1000,
    responseTime: '60-90 мин',
    landmarks: ['Усадьба Ивановское', 'Парк Талалихина', 'ТРК Остров'],
    description: 'Подольск — крупный промышленный город на юге от Москвы. Много складских и производственных объектов, требующих регулярной дератизации.',
    features: [
      'Работаем с промышленными объектами',
      'Обслуживаем склады и производства',
      'Заключаем годовые контракты'
    ],
    nearbyDistricts: ['yao', 'yzao']
  },
  {
    id: 'shchyolkovo',
    slug: 'shchyolkovo',
    name: 'Щёлково',
    genitive: 'Щёлкова',
    accusative: 'Щёлково',
    prepositional: 'в Щёлкове',
    population: 130000,
    distance: 15,
    surcharge: 700,
    responseTime: '50-70 мин',
    landmarks: ['Биосферный заповедник', 'Фабрика Щёлково Агрохим', 'Парк Солнечный'],
    description: 'Щёлково — город на северо-востоке от Москвы. Близость к лесным массивам создаёт риск проникновения грызунов в частные дома.',
    features: [
      'Специализируемся на частном секторе',
      'Барьерная защита от лесных грызунов',
      'Работаем с дачными участками'
    ],
    nearbyDistricts: ['svao', 'vao']
  },
  {
    id: 'dolgoprudny',
    slug: 'dolgoprudny',
    name: 'Долгопрудный',
    genitive: 'Долгопрудного',
    accusative: 'Долгопрудный',
    prepositional: 'в Долгопрудном',
    population: 115000,
    distance: 10,
    surcharge: 700,
    responseTime: '40-60 мин',
    landmarks: ['МФТИ', 'Долгие пруды', 'Канал имени Москвы'],
    description: 'Долгопрудный — наукоград на севере от Москвы, известный МФТИ. Сочетание старого фонда и новостроек создаёт разнообразные условия для вредителей.',
    features: [
      'Работаем со старым и новым фондом',
      'Обслуживаем территорию МФТИ',
      'Знаем специфику местных новостроек'
    ],
    nearbyDistricts: ['sao', 'svao']
  },
  {
    id: 'klin',
    slug: 'klin',
    name: 'Клин',
    genitive: 'Клина',
    accusative: 'Клин',
    prepositional: 'в Клину',
    population: 80000,
    distance: 65,
    surcharge: 2000,
    responseTime: '90-120 мин',
    landmarks: ['Дом-музей Чайковского', 'Клинское Подворье', 'Сенежское озеро'],
    description: 'Клин — исторический город на северо-западе Подмосковья. Большое количество частных домов и дачных посёлков создаёт спрос на обработку от грызунов и насекомых.',
    features: [
      'Работаем с частным сектором и дачами',
      'Обработка участков от клещей',
      'Знаем особенности удалённых посёлков'
    ],
    nearbyDistricts: ['szao']
  },
  {
    id: 'ramenskoe',
    slug: 'ramenskoe',
    name: 'Раменское',
    genitive: 'Раменского',
    accusative: 'Раменское',
    prepositional: 'в Раменском',
    population: 120000,
    distance: 35,
    surcharge: 1500,
    responseTime: '70-90 мин',
    landmarks: ['Борисоглебское озеро', 'Фабрика Красное знамя', 'Парк культуры'],
    description: 'Раменское — динамично развивающийся город на юго-востоке от Москвы. Сочетание промышленных зон и жилых кварталов требует комплексного подхода к дезинсекции.',
    features: [
      'Обслуживаем промзоны и жильё',
      'Работаем с новостройками',
      'Обработка складских комплексов'
    ],
    nearbyDistricts: ['yuvao']
  },
  {
    id: 'chekhov',
    slug: 'chekhov',
    name: 'Чехов',
    genitive: 'Чехова',
    accusative: 'Чехов',
    prepositional: 'в Чехове',
    population: 75000,
    distance: 50,
    surcharge: 1500,
    responseTime: '80-100 мин',
    landmarks: ['Усадьба Мелихово', 'Парк Городской сад', 'Чеховский полиграфкомбинат'],
    description: 'Чехов — город на юге Подмосковья с богатой историей. Множество садовых товариществ и частных домов создают условия для появления вредителей.',
    features: [
      'Специализируемся на СНТ и дачах',
      'Обработка от кротов и грызунов',
      'Сезонная защита от клещей'
    ],
    nearbyDistricts: ['yao']
  },
  {
    id: 'domodedovo',
    slug: 'domodedovo',
    name: 'Домодедово',
    genitive: 'Домодедова',
    accusative: 'Домодедово',
    prepositional: 'в Домодедове',
    population: 135000,
    distance: 25,
    surcharge: 1000,
    responseTime: '60-80 мин',
    landmarks: ['Аэропорт Домодедово', 'Парк Ёлочки', 'ТЦ Торговый квартал'],
    description: 'Домодедово — крупный город с международным аэропортом. Близость к аэропорту и логистическим центрам привлекает грызунов и насекомых.',
    features: [
      'Работаем с объектами рядом с аэропортом',
      'Обслуживаем логистические центры',
      'Обработка жилых комплексов'
    ],
    nearbyDistricts: ['yao', 'yzao']
  }
];

// Получить город по slug
export function getCityBySlug(slug: string): MoscowRegionCity | undefined {
  return moscowRegionCities.find(c => c.slug === slug);
}

// Получить все slugs для SSG
export const moscowRegionSlugs = moscowRegionCities.map(c => c.slug);

// Услуги, доступные в городах МО
export const moscowRegionServices = [
  'dezinsekciya',
  'deratizaciya',
  'dezinfekciya',
  'ozonirovanie'
] as const;

export type MoscowRegionService = typeof moscowRegionServices[number];
