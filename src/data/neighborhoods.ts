export interface NeighborhoodFAQ {
  question: string;
  answer: string;
}

export interface Neighborhood {
  id: string;
  slug: string;
  name: string;
  fullName: string;
  districtId: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  responseTime: string;
  surcharge: number;
  description: string;
  landmarks: string[];
  streets: string[];
  center: [number, number];
  faq: NeighborhoodFAQ[];
  prepositional?: string; // "на Арбате", "в Тверском районе"
}

// Маппинг округов на названия в предложном падеже
const districtNamesLocative: Record<string, string> = {
  'cao': 'Центральном округе',
  'sao': 'Северном округе',
  'svao': 'Северо-Восточном округе',
  'vao': 'Восточном округе',
  'yuvao': 'Юго-Восточном округе',
  'yao': 'Южном округе',
  'yzao': 'Юго-Западном округе',
  'zao': 'Западном округе',
  'szao': 'Северо-Западном округе',
  'nao': 'Новомосковском округе',
  'tao': 'Троицком округе',
  'zelao': 'Зеленоградском округе'
};

// Helper to generate description (исправлена тавтология)
const genDescription = (name: string, districtId: string, landmarks: string[], responseTime: string): string => {
  const districtName = districtNamesLocative[districtId] || 'Москве';
  const landmarkText = landmarks.slice(0, 3).join(', ');
  
  return `${name} — район в ${districtName} Москвы, где мы оказываем услуги профессиональной дезинфекции, дезинсекции и дератизации. Время прибытия мастера — ${responseTime}. Обрабатываем квартиры, офисы, рестораны, склады и другие помещения. Используем сертифицированные препараты, безопасные для людей и домашних животных. Ориентиры: ${landmarkText}. Гарантия до 3 лет.`;
};

// Helper to generate FAQ
const genFAQ = (name: string, responseTime: string, surcharge: number): NeighborhoodFAQ[] => [
  {
    question: `Как быстро вы приедете в ${name}?`,
    answer: `Среднее время прибытия в район ${name} составляет ${responseTime}. Работаем круглосуточно.`
  },
  {
    question: `Сколько стоит дезинфекция в ${name}?`,
    answer: `Стоимость дезинфекции в ${name} начинается от ${1000 + surcharge}₽. Точная цена зависит от площади и типа помещения.`
  },
  {
    question: `Есть ли доплата за выезд в ${name}?`,
    answer: surcharge > 0 
      ? `Да, доплата за выезд в ${name} составляет ${surcharge}₽ из-за удалённости от центра.`
      : `Нет, выезд в ${name} бесплатный.`
  },
  {
    question: `Какие услуги вы оказываете в ${name}?`,
    answer: `В ${name} мы оказываем все виды санитарных услуг: дезинфекцию, дезинсекцию (уничтожение тараканов, клопов, муравьёв), дератизацию (уничтожение крыс и мышей), озонирование и дезодорацию.`
  },
  {
    question: `Даёте ли вы гарантию на работы в ${name}?`,
    answer: `Да, мы даём гарантию до 3 лет на все виды работ. Если вредители вернутся — проведём повторную обработку бесплатно.`
  }
];

// ЦАО (10 районов)
const caoNeighborhoods: Neighborhood[] = [
  {
    id: 'arbat', slug: 'arbat', name: 'Арбат', fullName: 'район Арбат', prepositional: 'на Арбате',
    districtId: 'cao', metaTitle: 'Дезинфекция на Арбате — выезд 15 мин | от 1000₽',
    metaDescription: 'Профессиональная дезинфекция в районе Арбат ЦАО Москвы. Уничтожение тараканов, клопов, грызунов. Выезд 15 минут. Гарантия до 3 лет.',
    h1: 'Дезинфекция на Арбате — выезд за 15 минут',
    responseTime: '15 мин', surcharge: 0,
    landmarks: ['Старый Арбат', 'Смоленская площадь', 'Театр Вахтангова', 'Стена Цоя'],
    streets: ['ул. Арбат', 'ул. Новый Арбат', 'Арбатский переулок', 'Смоленская наб.'],
    center: [55.7498, 37.5873],
    description: '', faq: []
  },
  {
    id: 'tverskoy', slug: 'tverskoy', name: 'Тверской', fullName: 'Тверской район', prepositional: 'в Тверском районе',
    districtId: 'cao', metaTitle: 'Дезинфекция в Тверском районе — выезд 15 мин | от 1000₽',
    metaDescription: 'Дезинфекция, дезинсекция и дератизация в Тверском районе Москвы. Обработка квартир, ресторанов, офисов. Гарантия.',
    h1: 'Дезинфекция в Тверском районе — выезд за 15 минут',
    responseTime: '15 мин', surcharge: 0,
    landmarks: ['Тверская улица', 'Пушкинская площадь', 'Триумфальная площадь', 'Патриаршие пруды'],
    streets: ['ул. Тверская', 'Тверской бульвар', 'Страстной бульвар', 'Малая Бронная'],
    center: [55.7649, 37.6056],
    description: '', faq: []
  },
  {
    id: 'zamoskvorechye', slug: 'zamoskvorechye', name: 'Замоскворечье', fullName: 'район Замоскворечье', prepositional: 'в Замоскворечье',
    districtId: 'cao', metaTitle: 'Дезинфекция в Замоскворечье — выезд 15 мин | от 1000₽',
    metaDescription: 'Дезинфекция в Замоскворечье ЦАО Москвы. Обработка от тараканов, клопов, грызунов. Выезд 15 минут.',
    h1: 'Дезинфекция в Замоскворечье — быстрый выезд',
    responseTime: '15 мин', surcharge: 0,
    landmarks: ['Третьяковская галерея', 'Кадашевская набережная', 'Павелецкий вокзал'],
    streets: ['ул. Большая Ордынка', 'ул. Пятницкая', 'Кадашевский переулок'],
    center: [55.7378, 37.6267],
    description: '', faq: []
  },
  {
    id: 'khamovniki', slug: 'khamovniki', name: 'Хамовники', fullName: 'район Хамовники', prepositional: 'в Хамовниках',
    districtId: 'cao', metaTitle: 'Дезинфекция в Хамовниках — выезд 15 мин | от 1000₽',
    metaDescription: 'Дезинфекция в Хамовниках Москвы. Уничтожение насекомых и грызунов. Обработка элитных ЖК. Гарантия до 3 лет.',
    h1: 'Дезинфекция в Хамовниках — выезд за 15 минут',
    responseTime: '15 мин', surcharge: 0,
    landmarks: ['Лужники', 'Новодевичий монастырь', 'Остоженка', 'Пречистенка'],
    streets: ['ул. Остоженка', 'ул. Пречистенка', 'Комсомольский проспект', 'ул. Усачёва'],
    center: [55.7329, 37.5641],
    description: '', faq: []
  },
  {
    id: 'presnensky', slug: 'presnensky', name: 'Пресненский', fullName: 'Пресненский район', prepositional: 'в Пресненском районе',
    districtId: 'cao', metaTitle: 'Дезинфекция в Пресненском районе — выезд 15 мин | от 1000₽',
    metaDescription: 'Дезинфекция в Пресненском районе Москвы. Москва-Сити, Красная Пресня. Работаем с бизнес-центрами.',
    h1: 'Дезинфекция в Пресненском районе Москвы',
    responseTime: '15-20 мин', surcharge: 0,
    landmarks: ['Москва-Сити', 'Зоопарк', 'Красная Пресня', 'Белорусский вокзал'],
    streets: ['ул. Красная Пресня', 'Пресненская наб.', 'ул. 1905 года'],
    center: [55.7584, 37.5567],
    description: '', faq: []
  },
  {
    id: 'basmannyy', slug: 'basmannyy', name: 'Басманный', fullName: 'Басманный район',
    districtId: 'cao', metaTitle: 'Дезинфекция в Басманном районе — выезд 20 мин | от 1000₽',
    metaDescription: 'Дезинфекция в Басманном районе Москвы. Курский вокзал, Чистые пруды. Обработка от насекомых.',
    h1: 'Дезинфекция в Басманном районе Москвы',
    responseTime: '15-20 мин', surcharge: 0,
    landmarks: ['Чистые пруды', 'Курский вокзал', 'Красные ворота', 'Елоховский собор'],
    streets: ['ул. Мясницкая', 'ул. Покровка', 'ул. Маросейка', 'Басманный переулок'],
    center: [55.7645, 37.6594],
    description: '', faq: []
  },
  {
    id: 'krasnoselsky', slug: 'krasnoselsky', name: 'Красносельский', fullName: 'Красносельский район',
    districtId: 'cao', metaTitle: 'Дезинфекция в Красносельском районе — от 1000₽',
    metaDescription: 'Дезинфекция в Красносельском районе Москвы. Комсомольская площадь, три вокзала. Быстрый выезд.',
    h1: 'Дезинфекция в Красносельском районе',
    responseTime: '20 мин', surcharge: 0,
    landmarks: ['Комсомольская площадь', 'Ленинградский вокзал', 'Ярославский вокзал', 'Казанский вокзал'],
    streets: ['ул. Каланчёвская', 'Краснопрудная ул.', 'Русаковская ул.'],
    center: [55.7763, 37.6569],
    description: '', faq: []
  },
  {
    id: 'meshchansky', slug: 'meshchansky', name: 'Мещанский', fullName: 'Мещанский район',
    districtId: 'cao', metaTitle: 'Дезинфекция в Мещанском районе — от 1000₽',
    metaDescription: 'Дезинфекция в Мещанском районе Москвы. Проспект Мира, Олимпийский. Уничтожение вредителей.',
    h1: 'Дезинфекция в Мещанском районе Москвы',
    responseTime: '20 мин', surcharge: 0,
    landmarks: ['Проспект Мира', 'СК Олимпийский', 'Садовое кольцо', 'Рижский вокзал'],
    streets: ['пр-т Мира', 'ул. Щепкина', 'ул. Дурова', 'Грохольский переулок'],
    center: [55.7812, 37.6333],
    description: '', faq: []
  },
  {
    id: 'tagansky', slug: 'tagansky', name: 'Таганский', fullName: 'Таганский район',
    districtId: 'cao', metaTitle: 'Дезинфекция в Таганском районе — от 1000₽',
    metaDescription: 'Дезинфекция на Таганке Москвы. Уничтожение тараканов, клопов, грызунов. Гарантия до 3 лет.',
    h1: 'Дезинфекция в Таганском районе Москвы',
    responseTime: '20 мин', surcharge: 0,
    landmarks: ['Таганская площадь', 'Театр на Таганке', 'Крутицкое подворье'],
    streets: ['ул. Таганская', 'ул. Большие Каменщики', 'Народная ул.'],
    center: [55.7390, 37.6604],
    description: '', faq: []
  },
  {
    id: 'yakimanka', slug: 'yakimanka', name: 'Якиманка', fullName: 'район Якиманка',
    districtId: 'cao', metaTitle: 'Дезинфекция в Якиманке — выезд 15 мин | от 1000₽',
    metaDescription: 'Дезинфекция в районе Якиманка ЦАО Москвы. Музеон, Парк Горького. Быстрый выезд.',
    h1: 'Дезинфекция в Якиманке — быстрый выезд',
    responseTime: '15 мин', surcharge: 0,
    landmarks: ['Парк Горького', 'Музеон', 'ЦДХ', 'Октябрьская площадь'],
    streets: ['ул. Большая Якиманка', 'ул. Крымский Вал', 'Ленинский проспект'],
    center: [55.7268, 37.6073],
    description: '', faq: []
  }
];

// САО (16 районов)
const saoNeighborhoods: Neighborhood[] = [
  {
    id: 'aeroport', slug: 'aeroport', name: 'Аэропорт', fullName: 'район Аэропорт', prepositional: 'в районе Аэропорт',
    districtId: 'sao', metaTitle: 'Дезинфекция в Аэропорте — выезд 25 мин | от 1000₽',
    metaDescription: 'Дезинфекция в районе Аэропорт САО Москвы. Быстрый выезд, гарантия.',
    h1: 'Дезинфекция в районе Аэропорт Москвы',
    responseTime: '20-25 мин', surcharge: 0,
    landmarks: ['Аэропорт', 'Ленинградский проспект', 'Академия им. Жуковского'],
    streets: ['Ленинградский пр-т', 'ул. Авиаконструктора Микояна', 'Планетная ул.'],
    center: [55.8002, 37.5315],
    description: '', faq: []
  },
  {
    id: 'begovoy', slug: 'begovoy', name: 'Беговой', fullName: 'Беговой район',
    districtId: 'sao', metaTitle: 'Дезинфекция в Беговом районе — от 1000₽',
    metaDescription: 'Дезинфекция в Беговом районе Москвы. Ипподром, Ходынка. Выезд 20 минут.',
    h1: 'Дезинфекция в Беговом районе Москвы',
    responseTime: '20 мин', surcharge: 0,
    landmarks: ['Московский ипподром', 'Ходынское поле', 'Авиапарк'],
    streets: ['ул. Беговая', 'Хорошёвское ш.', 'ул. Правды'],
    center: [55.7845, 37.5456],
    description: '', faq: []
  },
  {
    id: 'sokol', slug: 'sokol', name: 'Сокол', fullName: 'район Сокол', prepositional: 'в районе Сокол',
    districtId: 'sao', metaTitle: 'Дезинфекция в Соколе — выезд 25 мин | от 1000₽',
    metaDescription: 'Дезинфекция в районе Сокол САО Москвы. Посёлок Сокол, Ленинградка.',
    h1: 'Дезинфекция в районе Сокол Москвы',
    responseTime: '20-25 мин', surcharge: 0,
    landmarks: ['Посёлок Сокол', 'Ленинградский проспект', 'Метро Сокол'],
    streets: ['Ленинградский пр-т', 'ул. Алабяна', 'Волоколамское ш.'],
    center: [55.8067, 37.5117],
    description: '', faq: []
  },
  {
    id: 'voykovskiy', slug: 'voykovskiy', name: 'Войковский', fullName: 'Войковский район',
    districtId: 'sao', metaTitle: 'Дезинфекция в Войковском районе — от 1000₽',
    metaDescription: 'Дезинфекция в Войковском районе Москвы. Метрополис, Речной вокзал.',
    h1: 'Дезинфекция в Войковском районе',
    responseTime: '25-30 мин', surcharge: 0,
    landmarks: ['ТЦ Метрополис', 'Речной вокзал', 'Балтийская ул.'],
    streets: ['Ленинградское ш.', 'ул. Зои и Александра Космодемьянских', 'Старопетровский проезд'],
    center: [55.8234, 37.4997],
    description: '', faq: []
  },
  {
    id: 'golovinsky', slug: 'golovinsky', name: 'Головинский', fullName: 'Головинский район',
    districtId: 'sao', metaTitle: 'Дезинфекция в Головинском районе — от 1000₽',
    metaDescription: 'Дезинфекция в Головинском районе САО. Водный стадион, Головинские пруды.',
    h1: 'Дезинфекция в Головинском районе Москвы',
    responseTime: '25-30 мин', surcharge: 0,
    landmarks: ['Водный стадион', 'Головинские пруды', 'Парк Дружбы'],
    streets: ['Головинское ш.', 'Кронштадтский б-р', 'Флотская ул.'],
    center: [55.8456, 37.4912],
    description: '', faq: []
  },
  {
    id: 'koptevo', slug: 'koptevo', name: 'Коптево', fullName: 'район Коптево',
    districtId: 'sao', metaTitle: 'Дезинфекция в Коптево — от 1000₽',
    metaDescription: 'Дезинфекция в районе Коптево Москвы. Коптевский рынок, парк.',
    h1: 'Дезинфекция в Коптево Москвы',
    responseTime: '25-30 мин', surcharge: 0,
    landmarks: ['Коптевский рынок', 'Коптевский парк', 'Михалковская улица'],
    streets: ['ул. Коптевская', 'Михалковская ул.', 'Большая Академическая ул.'],
    center: [55.8378, 37.5234],
    description: '', faq: []
  },
  {
    id: 'timiryazevsky', slug: 'timiryazevsky', name: 'Тимирязевский', fullName: 'Тимирязевский район',
    districtId: 'sao', metaTitle: 'Дезинфекция в Тимирязевском районе — от 1000₽',
    metaDescription: 'Дезинфекция в Тимирязевском районе Москвы. Тимирязевская академия.',
    h1: 'Дезинфекция в Тимирязевском районе',
    responseTime: '25-30 мин', surcharge: 0,
    landmarks: ['Тимирязевская академия', 'Тимирязевский парк', 'Дмитровское шоссе'],
    streets: ['Дмитровское ш.', 'ул. Тимирязевская', 'ул. Вучетича'],
    center: [55.8234, 37.5456],
    description: '', faq: []
  },
  {
    id: 'khovrino', slug: 'khovrino', name: 'Ховрино', fullName: 'район Ховрино',
    districtId: 'sao', metaTitle: 'Дезинфекция в Ховрино — от 1000₽',
    metaDescription: 'Дезинфекция в районе Ховрино САО Москвы. Быстрый выезд.',
    h1: 'Дезинфекция в Ховрино Москвы',
    responseTime: '30-40 мин', surcharge: 300,
    landmarks: ['Ховринская больница', 'Грачёвский парк', 'Метро Ховрино'],
    streets: ['Фестивальная ул.', 'Зеленоградская ул.', 'ул. Дыбенко'],
    center: [55.8734, 37.4834],
    description: '', faq: []
  },
  {
    id: 'savelovsky', slug: 'savelovsky', name: 'Савёловский', fullName: 'Савёловский район',
    districtId: 'sao', metaTitle: 'Дезинфекция в Савёловском районе — от 1000₽',
    metaDescription: 'Дезинфекция в Савёловском районе Москвы. Савёловский вокзал.',
    h1: 'Дезинфекция в Савёловском районе',
    responseTime: '20 мин', surcharge: 0,
    landmarks: ['Савёловский вокзал', 'ТЦ Савёловский', 'Бутырская ул.'],
    streets: ['Бутырская ул.', 'ул. Нижняя Масловка', 'Новослободская ул.'],
    center: [55.7923, 37.5912],
    description: '', faq: []
  },
  {
    id: 'levoberezhny', slug: 'levoberezhny', name: 'Левобережный', fullName: 'район Левобережный',
    districtId: 'sao', metaTitle: 'Дезинфекция в Левобережном — от 1200₽',
    metaDescription: 'Дезинфекция в Левобережном районе Москвы. Химкинское водохранилище.',
    h1: 'Дезинфекция в Левобережном районе',
    responseTime: '35-45 мин', surcharge: 500,
    landmarks: ['Химкинское водохранилище', 'Северный речной порт', 'Канал им. Москвы'],
    streets: ['Смольная ул.', 'Флотская ул.', 'Беломорская ул.'],
    center: [55.8623, 37.4523],
    description: '', faq: []
  },
  {
    id: 'dmitrovsky', slug: 'dmitrovsky', name: 'Дмитровский', fullName: 'Дмитровский район',
    districtId: 'sao', metaTitle: 'Дезинфекция в Дмитровском районе — от 1000₽',
    metaDescription: 'Дезинфекция в Дмитровском районе САО Москвы.',
    h1: 'Дезинфекция в Дмитровском районе',
    responseTime: '25-35 мин', surcharge: 0,
    landmarks: ['Дмитровское шоссе', 'Парк Ангарские пруды', 'Метро Селигерская'],
    streets: ['Дмитровское ш.', 'ул. 800-летия Москвы', 'Коровинское ш.'],
    center: [55.8756, 37.5345],
    description: '', faq: []
  },
  {
    id: 'zapadnoe-degunino', slug: 'zapadnoe-degunino', name: 'Западное Дегунино', fullName: 'район Западное Дегунино',
    districtId: 'sao', metaTitle: 'Дезинфекция в Западном Дегунино — от 1200₽',
    metaDescription: 'Дезинфекция в Западном Дегунино САО Москвы.',
    h1: 'Дезинфекция в Западном Дегунино',
    responseTime: '30-40 мин', surcharge: 300,
    landmarks: ['Коровинское шоссе', 'Парк Дегунино', 'ТЦ Вереск'],
    streets: ['Коровинское ш.', 'ул. Талдомская', 'Дегунинская ул.'],
    center: [55.8712, 37.5123],
    description: '', faq: []
  },
  {
    id: 'vostochnoe-degunino', slug: 'vostochnoe-degunino', name: 'Восточное Дегунино', fullName: 'район Восточное Дегунино',
    districtId: 'sao', metaTitle: 'Дезинфекция в Восточном Дегунино — от 1200₽',
    metaDescription: 'Дезинфекция в Восточном Дегунино САО Москвы.',
    h1: 'Дезинфекция в Восточном Дегунино',
    responseTime: '30-40 мин', surcharge: 300,
    landmarks: ['Долгопрудненское шоссе', 'Парк Дегунино', 'ТК Бестужевский'],
    streets: ['Дмитровское ш.', 'ул. Ильменский проезд', 'Бескудниковский б-р'],
    center: [55.8789, 37.5534],
    description: '', faq: []
  },
  {
    id: 'beskudnikovsky', slug: 'beskudnikovsky', name: 'Бескудниковский', fullName: 'Бескудниковский район',
    districtId: 'sao', metaTitle: 'Дезинфекция в Бескудниковском районе — от 1200₽',
    metaDescription: 'Дезинфекция в Бескудниковском районе САО Москвы.',
    h1: 'Дезинфекция в Бескудниковском районе',
    responseTime: '30-40 мин', surcharge: 300,
    landmarks: ['Бескудниковский бульвар', 'Савёловский путепровод', 'Парк Дегунино'],
    streets: ['Бескудниковский б-р', 'ул. Селигерская', 'Дмитровское ш.'],
    center: [55.8656, 37.5678],
    description: '', faq: []
  },
  {
    id: 'molzhaninovsky', slug: 'molzhaninovsky', name: 'Молжаниновский', fullName: 'Молжаниновский район',
    districtId: 'sao', metaTitle: 'Дезинфекция в Молжаниновском районе — от 1500₽',
    metaDescription: 'Дезинфекция в Молжаниновском районе САО у аэропорта Шереметьево.',
    h1: 'Дезинфекция в Молжаниновском районе',
    responseTime: '40-60 мин', surcharge: 500,
    landmarks: ['Аэропорт Шереметьево', 'Новые дома', 'Ленинградское шоссе'],
    streets: ['Ленинградское ш.', 'ул. Новомолжаниновская', 'Международное ш.'],
    center: [55.9123, 37.4234],
    description: '', faq: []
  },
  {
    id: 'khoroshevsky', slug: 'khoroshevsky', name: 'Хорошёвский', fullName: 'Хорошёвский район',
    districtId: 'sao', metaTitle: 'Дезинфекция в Хорошёвском районе — от 1000₽',
    metaDescription: 'Дезинфекция в Хорошёвском районе САО Москвы.',
    h1: 'Дезинфекция в Хорошёвском районе',
    responseTime: '20-25 мин', surcharge: 0,
    landmarks: ['Хорошёвское шоссе', 'Парк Ходынское поле', 'ЦСКА'],
    streets: ['Хорошёвское ш.', 'ул. 3-я Песчаная', 'ул. Зорге'],
    center: [55.7845, 37.5234],
    description: '', faq: []
  }
];

// СВАО (17 районов)
const svaoNeighborhoods: Neighborhood[] = [
  {
    id: 'altufyevsky', slug: 'altufyevsky', name: 'Алтуфьевский', fullName: 'Алтуфьевский район',
    districtId: 'svao', metaTitle: 'Дезинфекция в Алтуфьевском районе — от 1200₽',
    metaDescription: 'Дезинфекция в Алтуфьевском районе СВАО Москвы. Алтуфьевское шоссе.',
    h1: 'Дезинфекция в Алтуфьевском районе Москвы',
    responseTime: '30-40 мин', surcharge: 500,
    landmarks: ['Алтуфьевское шоссе', 'Алтуфьевский пруд', 'ТЦ Алтуфьевский'],
    streets: ['Алтуфьевское ш.', 'ул. Лескова', 'ул. Мурановская'],
    center: [55.8923, 37.5878],
    description: '', faq: []
  },
  {
    id: 'babushkinsky', slug: 'babushkinsky', name: 'Бабушкинский', fullName: 'Бабушкинский район', prepositional: 'в Бабушкинском районе',
    districtId: 'svao', metaTitle: 'Дезинфекция в Бабушкинском районе — от 1200₽',
    metaDescription: 'Дезинфекция в Бабушкинском районе СВАО. Бабушкинский парк.',
    h1: 'Дезинфекция в Бабушкинском районе',
    responseTime: '30-40 мин', surcharge: 500,
    landmarks: ['Бабушкинский парк', 'Метро Бабушкинская', 'Кинотеатр Арктика'],
    streets: ['ул. Менжинского', 'ул. Лётчика Бабушкина', 'Енисейская ул.'],
    center: [55.8656, 37.6567],
    description: '', faq: []
  },
  {
    id: 'bibirevo', slug: 'bibirevo', name: 'Бибирево', fullName: 'район Бибирево',
    districtId: 'svao', metaTitle: 'Дезинфекция в Бибирево — выезд 35 мин | от 1200₽',
    metaDescription: 'Дезинфекция в Бибирево СВАО Москвы. Опыт с панельными домами.',
    h1: 'Дезинфекция в Бибирево Москвы',
    responseTime: '30-40 мин', surcharge: 500,
    landmarks: ['Метро Бибирево', 'Бибиревский парк', 'ТЦ Миллион Мелочей'],
    streets: ['ул. Бибиревская', 'ул. Пришвина', 'Алтуфьевское ш.'],
    center: [55.8834, 37.6023],
    description: '', faq: []
  },
  {
    id: 'butyrsky', slug: 'butyrsky', name: 'Бутырский', fullName: 'Бутырский район',
    districtId: 'svao', metaTitle: 'Дезинфекция в Бутырском районе — от 1000₽',
    metaDescription: 'Дезинфекция в Бутырском районе СВАО. Бутырская улица.',
    h1: 'Дезинфекция в Бутырском районе',
    responseTime: '20-25 мин', surcharge: 0,
    landmarks: ['Бутырская улица', 'Савёловский вокзал', 'Дмитровское шоссе'],
    streets: ['Бутырская ул.', 'Дмитровское ш.', 'ул. Руставели'],
    center: [55.8089, 37.5889],
    description: '', faq: []
  },
  {
    id: 'lianozovo', slug: 'lianozovo', name: 'Лианозово', fullName: 'район Лианозово',
    districtId: 'svao', metaTitle: 'Дезинфекция в Лианозово — от 1200₽',
    metaDescription: 'Дезинфекция в Лианозово СВАО Москвы. Лианозовский парк.',
    h1: 'Дезинфекция в Лианозово Москвы',
    responseTime: '35-45 мин', surcharge: 500,
    landmarks: ['Лианозовский парк', 'Угольная академия', 'МКАД'],
    streets: ['Алтуфьевское ш.', 'Череповецкая ул.', 'ул. Хачатуряна'],
    center: [55.8989, 37.5734],
    description: '', faq: []
  },
  {
    id: 'losinoostrovskiy', slug: 'losinoostrovskiy', name: 'Лосиноостровский', fullName: 'Лосиноостровский район',
    districtId: 'svao', metaTitle: 'Дезинфекция в Лосиноостровском районе — от 1200₽',
    metaDescription: 'Дезинфекция у Лосиного острова СВАО. Экологичные средства.',
    h1: 'Дезинфекция в Лосиноостровском районе',
    responseTime: '30-40 мин', surcharge: 500,
    landmarks: ['Лосиный остров', 'Метро Бабушкинская', 'Ярославское направление'],
    streets: ['Ярославское ш.', 'Анадырский проезд', 'ул. Изумрудная'],
    center: [55.8745, 37.6923],
    description: '', faq: []
  },
  {
    id: 'marfino', slug: 'marfino', name: 'Марфино', fullName: 'район Марфино',
    districtId: 'svao', metaTitle: 'Дезинфекция в Марфино — от 1000₽',
    metaDescription: 'Дезинфекция в Марфино СВАО. Ботанический сад, ВДНХ.',
    h1: 'Дезинфекция в Марфино Москвы',
    responseTime: '25-30 мин', surcharge: 0,
    landmarks: ['Ботанический сад', 'ВДНХ', 'Останкино'],
    streets: ['ул. Большая Марфинская', 'Ботаническая ул.', 'ул. Академика Комарова'],
    center: [55.8234, 37.5978],
    description: '', faq: []
  },
  {
    id: 'marina-roshcha', slug: 'marina-roshcha', name: 'Марьина Роща', fullName: 'район Марьина Роща',
    districtId: 'svao', metaTitle: 'Дезинфекция в Марьиной Роще — от 1000₽',
    metaDescription: 'Дезинфекция в Марьиной Роще Москвы. Быстрый выезд.',
    h1: 'Дезинфекция в Марьиной Роще',
    responseTime: '20 мин', surcharge: 0,
    landmarks: ['Марьина Роща', 'ТЦ Олимпия', 'Шереметевская улица'],
    streets: ['ул. Шереметьевская', 'Октябрьская ул.', '2-я ул. Марьиной Рощи'],
    center: [55.7956, 37.6134],
    description: '', faq: []
  },
  {
    id: 'ostankinsky', slug: 'ostankinsky', name: 'Останкинский', fullName: 'Останкинский район',
    districtId: 'svao', metaTitle: 'Дезинфекция в Останкинском районе — от 1000₽',
    metaDescription: 'Дезинфекция в Останкино Москвы. Телебашня, ВДНХ.',
    h1: 'Дезинфекция в Останкинском районе',
    responseTime: '25-30 мин', surcharge: 0,
    landmarks: ['Останкинская башня', 'ВДНХ', 'Парк Останкино'],
    streets: ['Аргуновская ул.', 'ул. Академика Королёва', '1-я Останкинская ул.'],
    center: [55.8234, 37.6234],
    description: '', faq: []
  },
  {
    id: 'otradnoe', slug: 'otradnoe', name: 'Отрадное', fullName: 'район Отрадное',
    districtId: 'svao', metaTitle: 'Дезинфекция в Отрадном — от 1200₽',
    metaDescription: 'Дезинфекция в Отрадном СВАО Москвы. Панельные дома.',
    h1: 'Дезинфекция в Отрадном Москвы',
    responseTime: '30-40 мин', surcharge: 500,
    landmarks: ['Метро Отрадное', 'Парк Отрадное', 'Алтуфьевское шоссе'],
    streets: ['Алтуфьевское ш.', 'ул. Декабристов', 'ул. Отрадная'],
    center: [55.8567, 37.6034],
    description: '', faq: []
  },
  {
    id: 'rostokino', slug: 'rostokino', name: 'Ростокино', fullName: 'район Ростокино',
    districtId: 'svao', metaTitle: 'Дезинфекция в Ростокино — от 1000₽',
    metaDescription: 'Дезинфекция в Ростокино СВАО. Яуза, парк Сокольники.',
    h1: 'Дезинфекция в Ростокино Москвы',
    responseTime: '25-30 мин', surcharge: 0,
    landmarks: ['Река Яуза', 'Ростокинский акведук', 'ВВЦ'],
    streets: ['пр-т Мира', 'ул. Бочкова', 'Ростокинский проезд'],
    center: [55.8145, 37.6434],
    description: '', faq: []
  },
  {
    id: 'sviblovo', slug: 'sviblovo', name: 'Свиблово', fullName: 'район Свиблово',
    districtId: 'svao', metaTitle: 'Дезинфекция в Свиблово — от 1200₽',
    metaDescription: 'Дезинфекция в Свиблово СВАО Москвы.',
    h1: 'Дезинфекция в Свиблово Москвы',
    responseTime: '30-35 мин', surcharge: 500,
    landmarks: ['Метро Свиблово', 'Река Яуза', 'Парк Свиблово'],
    streets: ['Снежная ул.', 'ул. Амундсена', 'Проезд Серебрякова'],
    center: [55.8456, 37.6456],
    description: '', faq: []
  },
  {
    id: 'severny', slug: 'severny', name: 'Северный', fullName: 'район Северный',
    districtId: 'svao', metaTitle: 'Дезинфекция в Северном районе — от 1500₽',
    metaDescription: 'Дезинфекция в Северном районе СВАО. У МКАД.',
    h1: 'Дезинфекция в Северном районе Москвы',
    responseTime: '40-50 мин', surcharge: 500,
    landmarks: ['МКАД', 'Метро Алтуфьево', 'Северный бульвар'],
    streets: ['Северный бульвар', 'ул. Дубнинская', 'Челобитьевское ш.'],
    center: [55.9089, 37.6123],
    description: '', faq: []
  },
  {
    id: 'severnoe-medvedkovo', slug: 'severnoe-medvedkovo', name: 'Северное Медведково', fullName: 'район Северное Медведково',
    districtId: 'svao', metaTitle: 'Дезинфекция в Северном Медведково — от 1200₽',
    metaDescription: 'Дезинфекция в Северном Медведково СВАО.',
    h1: 'Дезинфекция в Северном Медведково',
    responseTime: '35-45 мин', surcharge: 500,
    landmarks: ['Метро Медведково', 'Яуза', 'Парк Медведково'],
    streets: ['пр-д Шокальского', 'ул. Полярная', 'Широкая ул.'],
    center: [55.8789, 37.6634],
    description: '', faq: []
  },
  {
    id: 'yuzhnoe-medvedkovo', slug: 'yuzhnoe-medvedkovo', name: 'Южное Медведково', fullName: 'район Южное Медведково',
    districtId: 'svao', metaTitle: 'Дезинфекция в Южном Медведково — от 1200₽',
    metaDescription: 'Дезинфекция в Южном Медведково СВАО Москвы.',
    h1: 'Дезинфекция в Южном Медведково',
    responseTime: '30-40 мин', surcharge: 500,
    landmarks: ['Яуза', 'Сад им. Баумана', 'Леоновская роща'],
    streets: ['ул. Грекова', 'Полярная ул.', 'пр-д Шокальского'],
    center: [55.8645, 37.6734],
    description: '', faq: []
  },
  {
    id: 'yaroslavsky', slug: 'yaroslavsky', name: 'Ярославский', fullName: 'Ярославский район',
    districtId: 'svao', metaTitle: 'Дезинфекция в Ярославском районе — от 1200₽',
    metaDescription: 'Дезинфекция в Ярославском районе СВАО. Лосиный остров.',
    h1: 'Дезинфекция в Ярославском районе',
    responseTime: '35-45 мин', surcharge: 500,
    landmarks: ['Лосиный остров', 'ВДНХ-2', 'ТК XL'],
    streets: ['Ярославское ш.', 'Сухонская ул.', 'Лосиноостровская ул.'],
    center: [55.8534, 37.7023],
    description: '', faq: []
  },
  {
    id: 'severny-rayon', slug: 'severny-rayon', name: 'Северное', fullName: 'посёлок Северный',
    districtId: 'svao', metaTitle: 'Дезинфекция в посёлке Северный — от 1500₽',
    metaDescription: 'Дезинфекция в посёлке Северный СВАО.',
    h1: 'Дезинфекция в посёлке Северный',
    responseTime: '40-50 мин', surcharge: 500,
    landmarks: ['Северный бульвар', 'МКАД', 'Лес'],
    streets: ['Северный б-р', 'Челобитьевское ш.', 'ул. Дубнинская'],
    center: [55.9012, 37.5923],
    description: '', faq: []
  }
];

// ВАО (16 районов)
const vaoNeighborhoods: Neighborhood[] = [
  {
    id: 'bogorodskoe', slug: 'bogorodskoe', name: 'Богородское', fullName: 'район Богородское',
    districtId: 'vao', metaTitle: 'Дезинфекция в Богородском — от 1000₽',
    metaDescription: 'Дезинфекция в Богородском ВАО Москвы.',
    h1: 'Дезинфекция в Богородском районе',
    responseTime: '25-30 мин', surcharge: 0,
    landmarks: ['Богородский парк', 'Метро Преображенская пл.'],
    streets: ['Краснобогатырская ул.', 'Большая Черкизовская ул.'],
    center: [55.8089, 37.7012],
    description: '', faq: []
  },
  {
    id: 'veshnyaki', slug: 'veshnyaki', name: 'Вешняки', fullName: 'район Вешняки',
    districtId: 'vao', metaTitle: 'Дезинфекция в Вешняках — от 1200₽',
    metaDescription: 'Дезинфекция в Вешняках ВАО Москвы.',
    h1: 'Дезинфекция в Вешняках Москвы',
    responseTime: '35-45 мин', surcharge: 500,
    landmarks: ['Метро Выхино', 'Кусковский парк', 'Усадьба Кусково'],
    streets: ['Вешняковская ул.', 'ул. Косинская', 'Рязанский пр-т'],
    center: [55.7234, 37.8123],
    description: '', faq: []
  },
  {
    id: 'vostochnoe-izmaylovo', slug: 'vostochnoe-izmaylovo', name: 'Восточное Измайлово', fullName: 'район Восточное Измайлово',
    districtId: 'vao', metaTitle: 'Дезинфекция в Восточном Измайлово — от 1200₽',
    metaDescription: 'Дезинфекция в Восточном Измайлово ВАО.',
    h1: 'Дезинфекция в Восточном Измайлово',
    responseTime: '30-40 мин', surcharge: 500,
    landmarks: ['Измайловский парк', 'Метро Первомайская'],
    streets: ['Первомайская ул.', 'ул. Парковая', 'Измайловский б-р'],
    center: [55.7878, 37.8234],
    description: '', faq: []
  },
  {
    id: 'vostochny', slug: 'vostochny', name: 'Восточный', fullName: 'посёлок Восточный',
    districtId: 'vao', metaTitle: 'Дезинфекция в Восточном — от 1500₽',
    metaDescription: 'Дезинфекция в посёлке Восточный ВАО.',
    h1: 'Дезинфекция в посёлке Восточный',
    responseTime: '45-60 мин', surcharge: 700,
    landmarks: ['МКАД', 'Лес', 'Шоссе Энтузиастов'],
    streets: ['Восточная ул.', 'ш. Энтузиастов'],
    center: [55.8145, 37.8734],
    description: '', faq: []
  },
  {
    id: 'golyanovo', slug: 'golyanovo', name: 'Гольяново', fullName: 'район Гольяново',
    districtId: 'vao', metaTitle: 'Дезинфекция в Гольяново — от 1200₽',
    metaDescription: 'Дезинфекция в Гольяново ВАО Москвы.',
    h1: 'Дезинфекция в Гольяново Москвы',
    responseTime: '35-45 мин', surcharge: 500,
    landmarks: ['Метро Щёлковская', 'Гольяновский парк', 'Щёлковское ш.'],
    streets: ['Щёлковское ш.', 'ул. Уральская', 'Хабаровская ул.'],
    center: [55.8234, 37.8123],
    description: '', faq: []
  },
  {
    id: 'ivanovskoe', slug: 'ivanovskoe', name: 'Ивановское', fullName: 'район Ивановское',
    districtId: 'vao', metaTitle: 'Дезинфекция в Ивановском — от 1200₽',
    metaDescription: 'Дезинфекция в Ивановском ВАО.',
    h1: 'Дезинфекция в Ивановском районе',
    responseTime: '35-45 мин', surcharge: 500,
    landmarks: ['Метро Новогиреево', 'Терлецкий парк'],
    streets: ['Свободный пр-т', 'ш. Энтузиастов', 'ул. Фрязевская'],
    center: [55.7656, 37.8345],
    description: '', faq: []
  },
  {
    id: 'izmaylovo', slug: 'izmaylovo', name: 'Измайлово', fullName: 'район Измайлово', prepositional: 'в Измайлово',
    districtId: 'vao', metaTitle: 'Дезинфекция в Измайлово — от 1000₽',
    metaDescription: 'Дезинфекция в Измайлово ВАО. Измайловский парк.',
    h1: 'Дезинфекция в Измайлово Москвы',
    responseTime: '25-35 мин', surcharge: 0,
    landmarks: ['Измайловский парк', 'Кремль в Измайлово', 'Метро Измайловская'],
    streets: ['Измайловское ш.', 'ул. Первомайская', 'б-р Сиреневый'],
    center: [55.7934, 37.7534],
    description: '', faq: []
  },
  {
    id: 'kosino-ukhtomsky', slug: 'kosino-ukhtomsky', name: 'Косино-Ухтомский', fullName: 'район Косино-Ухтомский',
    districtId: 'vao', metaTitle: 'Дезинфекция в Косино-Ухтомском — от 1500₽',
    metaDescription: 'Дезинфекция в Косино-Ухтомском ВАО.',
    h1: 'Дезинфекция в Косино-Ухтомском',
    responseTime: '40-50 мин', surcharge: 700,
    landmarks: ['Косинские озёра', 'Метро Косино', 'Салтыковский лес'],
    streets: ['Новоухтомское ш.', 'ул. Заозёрная', 'Косинская ул.'],
    center: [55.7134, 37.8567],
    description: '', faq: []
  },
  {
    id: 'metrogorodok', slug: 'metrogorodok', name: 'Метрогородок', fullName: 'район Метрогородок',
    districtId: 'vao', metaTitle: 'Дезинфекция в Метрогородке — от 1200₽',
    metaDescription: 'Дезинфекция в Метрогородке ВАО.',
    h1: 'Дезинфекция в Метрогородке Москвы',
    responseTime: '30-40 мин', surcharge: 500,
    landmarks: ['Лосиный остров', 'Метро Бульвар Рокоссовского'],
    streets: ['Открытое ш.', 'ул. Хабаровская', 'Тагильская ул.'],
    center: [55.8256, 37.7534],
    description: '', faq: []
  },
  {
    id: 'novogireevo', slug: 'novogireevo', name: 'Новогиреево', fullName: 'район Новогиреево',
    districtId: 'vao', metaTitle: 'Дезинфекция в Новогиреево — от 1200₽',
    metaDescription: 'Дезинфекция в Новогиреево ВАО Москвы.',
    h1: 'Дезинфекция в Новогиреево Москвы',
    responseTime: '30-40 мин', surcharge: 500,
    landmarks: ['Метро Новогиреево', 'Терлецкий парк', 'Свободный проспект'],
    streets: ['Свободный пр-т', 'Зелёный пр-т', 'ул. Перовская'],
    center: [55.7534, 37.8089],
    description: '', faq: []
  },
  {
    id: 'novokosino', slug: 'novokosino', name: 'Новокосино', fullName: 'район Новокосино',
    districtId: 'vao', metaTitle: 'Дезинфекция в Новокосино — от 1500₽',
    metaDescription: 'Дезинфекция в Новокосино ВАО.',
    h1: 'Дезинфекция в Новокосино Москвы',
    responseTime: '40-50 мин', surcharge: 700,
    landmarks: ['Метро Новокосино', 'Салтыковский лес'],
    streets: ['Новокосинская ул.', 'ул. Городецкая', 'Суздальская ул.'],
    center: [55.7378, 37.8634],
    description: '', faq: []
  },
  {
    id: 'perovo', slug: 'perovo', name: 'Перово', fullName: 'район Перово',
    districtId: 'vao', metaTitle: 'Дезинфекция в Перово — от 1000₽',
    metaDescription: 'Дезинфекция в Перово ВАО Москвы.',
    h1: 'Дезинфекция в Перово Москвы',
    responseTime: '25-35 мин', surcharge: 0,
    landmarks: ['Метро Перово', 'Перовский парк', 'Зелёный проспект'],
    streets: ['Зелёный пр-т', 'ул. Перовская', 'ш. Энтузиастов'],
    center: [55.7512, 37.7634],
    description: '', faq: []
  },
  {
    id: 'preobrazhenskoe', slug: 'preobrazhenskoe', name: 'Преображенское', fullName: 'район Преображенское',
    districtId: 'vao', metaTitle: 'Дезинфекция в Преображенском — от 1000₽',
    metaDescription: 'Дезинфекция в Преображенском ВАО.',
    h1: 'Дезинфекция в Преображенском районе',
    responseTime: '25-30 мин', surcharge: 0,
    landmarks: ['Преображенская площадь', 'Черкизовский парк', 'Метро Преображенская пл.'],
    streets: ['Преображенская пл.', 'Большая Черкизовская ул.', 'Электрозаводская ул.'],
    center: [55.7956, 37.7189],
    description: '', faq: []
  },
  {
    id: 'severnoe-izmaylovo', slug: 'severnoe-izmaylovo', name: 'Северное Измайлово', fullName: 'район Северное Измайлово',
    districtId: 'vao', metaTitle: 'Дезинфекция в Северном Измайлово — от 1000₽',
    metaDescription: 'Дезинфекция в Северном Измайлово ВАО.',
    h1: 'Дезинфекция в Северном Измайлово',
    responseTime: '30-35 мин', surcharge: 0,
    landmarks: ['Измайловский парк', 'Метро Партизанская'],
    streets: ['ул. Щербаковская', 'Сиреневый б-р', 'ул. Верхняя Первомайская'],
    center: [55.8012, 37.7834],
    description: '', faq: []
  },
  {
    id: 'sokolinaya-gora', slug: 'sokolinaya-gora', name: 'Соколиная Гора', fullName: 'район Соколиная Гора',
    districtId: 'vao', metaTitle: 'Дезинфекция на Соколиной Горе — от 1000₽',
    metaDescription: 'Дезинфекция на Соколиной Горе ВАО Москвы.',
    h1: 'Дезинфекция на Соколиной Горе',
    responseTime: '25-30 мин', surcharge: 0,
    landmarks: ['Электрозавод', 'Семёновский парк', 'Метро Семёновская'],
    streets: ['Семёновская наб.', 'Большая Семёновская ул.', 'ш. Энтузиастов'],
    center: [55.7823, 37.7234],
    description: '', faq: []
  },
  {
    id: 'sokolniki', slug: 'sokolniki', name: 'Сокольники', fullName: 'район Сокольники', prepositional: 'в Сокольниках',
    districtId: 'vao', metaTitle: 'Дезинфекция в Сокольниках — от 1000₽',
    metaDescription: 'Дезинфекция в Сокольниках ВАО. Парк Сокольники.',
    h1: 'Дезинфекция в Сокольниках Москвы',
    responseTime: '20-25 мин', surcharge: 0,
    landmarks: ['Парк Сокольники', 'Метро Сокольники', 'КВЦ Сокольники'],
    streets: ['Сокольническая пл.', 'Русаковская ул.', 'Стромынка'],
    center: [55.7934, 37.6723],
    description: '', faq: []
  }
];

// ЮВАО (12 районов)
const yuvaoNeighborhoods: Neighborhood[] = [
  {
    id: 'vykhino-zhulebino', slug: 'vykhino-zhulebino', name: 'Выхино-Жулебино', fullName: 'район Выхино-Жулебино',
    districtId: 'yuvao', metaTitle: 'Дезинфекция в Выхино-Жулебино — от 1200₽',
    metaDescription: 'Дезинфекция в Выхино-Жулебино ЮВАО Москвы.',
    h1: 'Дезинфекция в Выхино-Жулебино Москвы',
    responseTime: '35-45 мин', surcharge: 500,
    landmarks: ['Метро Выхино', 'Метро Жулебино', 'Кузьминский парк'],
    streets: ['Рязанский пр-т', 'ул. Привольная', 'Жулебинский б-р'],
    center: [55.7089, 37.8234],
    description: '', faq: []
  },
  {
    id: 'kapotnya', slug: 'kapotnya', name: 'Капотня', fullName: 'район Капотня',
    districtId: 'yuvao', metaTitle: 'Дезинфекция в Капотне — от 1500₽',
    metaDescription: 'Дезинфекция в Капотне ЮВАО Москвы.',
    h1: 'Дезинфекция в Капотне Москвы',
    responseTime: '40-50 мин', surcharge: 700,
    landmarks: ['МНПЗ', 'Москва-река', 'Братеевский парк'],
    streets: ['ул. Капотня', '1-й Капотненский проезд'],
    center: [55.6378, 37.7923],
    description: '', faq: []
  },
  {
    id: 'kuzminki', slug: 'kuzminki', name: 'Кузьминки', fullName: 'район Кузьминки',
    districtId: 'yuvao', metaTitle: 'Дезинфекция в Кузьминках — от 1200₽',
    metaDescription: 'Дезинфекция в Кузьминках ЮВАО Москвы.',
    h1: 'Дезинфекция в Кузьминках Москвы',
    responseTime: '30-40 мин', surcharge: 500,
    landmarks: ['Кузьминский парк', 'Метро Кузьминки', 'Усадьба Кузьминки'],
    streets: ['Волгоградский пр-т', 'ул. Юных Ленинцев', 'Зеленодольская ул.'],
    center: [55.7034, 37.7634],
    description: '', faq: []
  },
  {
    id: 'lefortovo', slug: 'lefortovo', name: 'Лефортово', fullName: 'район Лефортово',
    districtId: 'yuvao', metaTitle: 'Дезинфекция в Лефортово — от 1000₽',
    metaDescription: 'Дезинфекция в Лефортово ЮВАО Москвы.',
    h1: 'Дезинфекция в Лефортово Москвы',
    responseTime: '25-30 мин', surcharge: 0,
    landmarks: ['Лефортовский парк', 'МГТУ им. Баумана', 'Яуза'],
    streets: ['ш. Энтузиастов', 'Госпитальная ул.', 'Авиамоторная ул.'],
    center: [55.7623, 37.6923],
    description: '', faq: []
  },
  {
    id: 'lyublino', slug: 'lyublino', name: 'Люблино', fullName: 'район Люблино', prepositional: 'в Люблино',
    districtId: 'yuvao', metaTitle: 'Дезинфекция в Люблино — от 1200₽',
    metaDescription: 'Дезинфекция в Люблино ЮВАО Москвы.',
    h1: 'Дезинфекция в Люблино Москвы',
    responseTime: '30-40 мин', surcharge: 500,
    landmarks: ['Метро Люблино', 'Кузьминский парк', 'ТЦ Люблино'],
    streets: ['Люблинская ул.', 'ул. Краснодонская', 'ул. Совхозная'],
    center: [55.6789, 37.7456],
    description: '', faq: []
  },
  {
    id: 'maryino', slug: 'maryino', name: 'Марьино', fullName: 'район Марьино', prepositional: 'в Марьино',
    districtId: 'yuvao', metaTitle: 'Дезинфекция в Марьино — от 1200₽',
    metaDescription: 'Дезинфекция в Марьино ЮВАО Москвы.',
    h1: 'Дезинфекция в Марьино Москвы',
    responseTime: '35-45 мин', surcharge: 500,
    landmarks: ['Метро Марьино', 'Парк 850-летия Москвы', 'Москва-река'],
    streets: ['Люблинская ул.', 'Братиславская ул.', 'ул. Перерва'],
    center: [55.6512, 37.7434],
    description: '', faq: []
  },
  {
    id: 'nekrasovka', slug: 'nekrasovka', name: 'Некрасовка', fullName: 'район Некрасовка',
    districtId: 'yuvao', metaTitle: 'Дезинфекция в Некрасовке — от 1500₽',
    metaDescription: 'Дезинфекция в Некрасовке ЮВАО Москвы.',
    h1: 'Дезинфекция в Некрасовке Москвы',
    responseTime: '40-50 мин', surcharge: 700,
    landmarks: ['Метро Некрасовка', 'Новостройки'],
    streets: ['ул. 1-я Вольская', 'Рождественская ул.'],
    center: [55.7089, 37.8923],
    description: '', faq: []
  },
  {
    id: 'nizhegorodsky', slug: 'nizhegorodsky', name: 'Нижегородский', fullName: 'Нижегородский район',
    districtId: 'yuvao', metaTitle: 'Дезинфекция в Нижегородском районе — от 1000₽',
    metaDescription: 'Дезинфекция в Нижегородском районе ЮВАО.',
    h1: 'Дезинфекция в Нижегородском районе',
    responseTime: '25-30 мин', surcharge: 0,
    landmarks: ['Метро Авиамоторная', 'Рогожский вал'],
    streets: ['Рязанский пр-т', 'Нижегородская ул.', 'ш. Энтузиастов'],
    center: [55.7389, 37.7123],
    description: '', faq: []
  },
  {
    id: 'pechatniki', slug: 'pechatniki', name: 'Печатники', fullName: 'район Печатники',
    districtId: 'yuvao', metaTitle: 'Дезинфекция в Печатниках — от 1200₽',
    metaDescription: 'Дезинфекция в Печатниках ЮВАО Москвы.',
    h1: 'Дезинфекция в Печатниках Москвы',
    responseTime: '30-40 мин', surcharge: 500,
    landmarks: ['Метро Печатники', 'Курьяновский парк', 'Москва-река'],
    streets: ['Шоссейная ул.', 'ул. Полбина', 'ул. Гурьянова'],
    center: [55.6923, 37.7189],
    description: '', faq: []
  },
  {
    id: 'ryazansky', slug: 'ryazansky', name: 'Рязанский', fullName: 'Рязанский район',
    districtId: 'yuvao', metaTitle: 'Дезинфекция в Рязанском районе — от 1200₽',
    metaDescription: 'Дезинфекция в Рязанском районе ЮВАО.',
    h1: 'Дезинфекция в Рязанском районе',
    responseTime: '30-40 мин', surcharge: 500,
    landmarks: ['Метро Рязанский проспект', 'Рязанский проспект'],
    streets: ['Рязанский пр-т', 'Рязанское ш.', 'Михайловский проезд'],
    center: [55.7278, 37.7734],
    description: '', faq: []
  },
  {
    id: 'tekstilshchiki', slug: 'tekstilshchiki', name: 'Текстильщики', fullName: 'район Текстильщики',
    districtId: 'yuvao', metaTitle: 'Дезинфекция в Текстильщиках — от 1000₽',
    metaDescription: 'Дезинфекция в Текстильщиках ЮВАО.',
    h1: 'Дезинфекция в Текстильщиках Москвы',
    responseTime: '25-35 мин', surcharge: 0,
    landmarks: ['Метро Текстильщики', 'Волгоградский проспект'],
    streets: ['Волгоградский пр-т', 'ул. Артюхиной', 'Саратовская ул.'],
    center: [55.7089, 37.7289],
    description: '', faq: []
  },
  {
    id: 'yuzhnoport', slug: 'yuzhnoport', name: 'Южнопортовый', fullName: 'Южнопортовый район',
    districtId: 'yuvao', metaTitle: 'Дезинфекция в Южнопортовом — от 1000₽',
    metaDescription: 'Дезинфекция в Южнопортовом ЮВАО.',
    h1: 'Дезинфекция в Южнопортовом районе',
    responseTime: '25-30 мин', surcharge: 0,
    landmarks: ['Южный порт', 'Кожуховский затон', 'Москва-река'],
    streets: ['ул. Южнопортовая', 'Кожуховская ул.', 'Велозаводская ул.'],
    center: [55.7134, 37.6734],
    description: '', faq: []
  }
];

// ЮАО (16 районов)
const yaoNeighborhoods: Neighborhood[] = [
  {
    id: 'biryulyovo-vostochnoe', slug: 'biryulyovo-vostochnoe', name: 'Бирюлёво Восточное', fullName: 'район Бирюлёво Восточное',
    districtId: 'yao', metaTitle: 'Дезинфекция в Бирюлёво Восточном — от 1200₽',
    metaDescription: 'Дезинфекция в Бирюлёво Восточном ЮАО.',
    h1: 'Дезинфекция в Бирюлёво Восточном',
    responseTime: '35-45 мин', surcharge: 500,
    landmarks: ['Бирюлёвский лесопарк', 'Метро Царицыно'],
    streets: ['ул. Загорьевская', 'Липецкая ул.', 'ул. Михневская'],
    center: [55.5912, 37.6834],
    description: '', faq: []
  },
  {
    id: 'biryulyovo-zapadnoe', slug: 'biryulyovo-zapadnoe', name: 'Бирюлёво Западное', fullName: 'район Бирюлёво Западное',
    districtId: 'yao', metaTitle: 'Дезинфекция в Бирюлёво Западном — от 1200₽',
    metaDescription: 'Дезинфекция в Бирюлёво Западном ЮАО.',
    h1: 'Дезинфекция в Бирюлёво Западном',
    responseTime: '35-45 мин', surcharge: 500,
    landmarks: ['Бирюлёвский дендропарк', 'Радиальная ул.'],
    streets: ['Булатниковская ул.', 'Радиальная ул.', 'Харьковская ул.'],
    center: [55.5823, 37.6434],
    description: '', faq: []
  },
  {
    id: 'brateevo', slug: 'brateevo', name: 'Братеево', fullName: 'район Братеево',
    districtId: 'yao', metaTitle: 'Дезинфекция в Братеево — от 1200₽',
    metaDescription: 'Дезинфекция в Братеево ЮАО Москвы.',
    h1: 'Дезинфекция в Братеево Москвы',
    responseTime: '35-45 мин', surcharge: 500,
    landmarks: ['Братеевский парк', 'Метро Алма-Атинская', 'Москва-река'],
    streets: ['Братеевская ул.', 'ул. Борисовские пруды', 'Паромная ул.'],
    center: [55.6234, 37.7623],
    description: '', faq: []
  },
  {
    id: 'danilovsky', slug: 'danilovsky', name: 'Даниловский', fullName: 'Даниловский район',
    districtId: 'yao', metaTitle: 'Дезинфекция в Даниловском районе — от 1000₽',
    metaDescription: 'Дезинфекция в Даниловском районе ЮАО.',
    h1: 'Дезинфекция в Даниловском районе',
    responseTime: '20-25 мин', surcharge: 0,
    landmarks: ['Даниловский рынок', 'ЗИЛ', 'Павелецкий вокзал'],
    streets: ['Автозаводская ул.', 'ул. Даниловский Вал', 'ул. Дубининская'],
    center: [55.7123, 37.6289],
    description: '', faq: []
  },
  {
    id: 'donskoy', slug: 'donskoy', name: 'Донской', fullName: 'Донской район',
    districtId: 'yao', metaTitle: 'Дезинфекция в Донском районе — от 1000₽',
    metaDescription: 'Дезинфекция в Донском районе ЮАО.',
    h1: 'Дезинфекция в Донском районе Москвы',
    responseTime: '20 мин', surcharge: 0,
    landmarks: ['Донской монастырь', 'Нескучный сад', 'Шаболовка'],
    streets: ['ул. Шаболовка', 'Ленинский пр-т', 'Донская ул.'],
    center: [55.7189, 37.5989],
    description: '', faq: []
  },
  {
    id: 'zyablikovo', slug: 'zyablikovo', name: 'Зябликово', fullName: 'район Зябликово',
    districtId: 'yao', metaTitle: 'Дезинфекция в Зябликово — от 1200₽',
    metaDescription: 'Дезинфекция в Зябликово ЮАО Москвы.',
    h1: 'Дезинфекция в Зябликово Москвы',
    responseTime: '35-45 мин', surcharge: 500,
    landmarks: ['Метро Зябликово', 'Орехово-Борисово'],
    streets: ['Каширское ш.', 'ул. Мусы Джалиля', 'Ореховый б-р'],
    center: [55.6189, 37.7434],
    description: '', faq: []
  },
  {
    id: 'moskvorechye-saburovo', slug: 'moskvorechye-saburovo', name: 'Москворечье-Сабурово', fullName: 'район Москворечье-Сабурово',
    districtId: 'yao', metaTitle: 'Дезинфекция в Москворечье-Сабурово — от 1200₽',
    metaDescription: 'Дезинфекция в Москворечье-Сабурово ЮАО.',
    h1: 'Дезинфекция в Москворечье-Сабурово',
    responseTime: '30-40 мин', surcharge: 500,
    landmarks: ['Коломенское', 'Москва-река', 'Метро Каширская'],
    streets: ['Каширское ш.', 'Пролетарский пр-т', 'ул. Москворечье'],
    center: [55.6534, 37.6723],
    description: '', faq: []
  },
  {
    id: 'nagatino-sadovniki', slug: 'nagatino-sadovniki', name: 'Нагатино-Садовники', fullName: 'район Нагатино-Садовники',
    districtId: 'yao', metaTitle: 'Дезинфекция в Нагатино-Садовниках — от 1000₽',
    metaDescription: 'Дезинфекция в Нагатино-Садовниках ЮАО.',
    h1: 'Дезинфекция в Нагатино-Садовниках',
    responseTime: '25-30 мин', surcharge: 0,
    landmarks: ['Парк Садовники', 'Коломенское', 'Метро Нагатинская'],
    streets: ['пр-т Андропова', 'Нагатинская ул.', 'ул. Садовники'],
    center: [55.6823, 37.6434],
    description: '', faq: []
  },
  {
    id: 'nagatinsky-zaton', slug: 'nagatinsky-zaton', name: 'Нагатинский Затон', fullName: 'район Нагатинский Затон',
    districtId: 'yao', metaTitle: 'Дезинфекция в Нагатинском Затоне — от 1000₽',
    metaDescription: 'Дезинфекция в Нагатинском Затоне ЮАО.',
    h1: 'Дезинфекция в Нагатинском Затоне',
    responseTime: '25-30 мин', surcharge: 0,
    landmarks: ['Остров Мечты', 'Москва-река', 'Метро Технопарк'],
    streets: ['Нагатинская ул.', 'Коломенская наб.', 'пр-т Андропова'],
    center: [55.6834, 37.6934],
    description: '', faq: []
  },
  {
    id: 'nagorny', slug: 'nagorny', name: 'Нагорный', fullName: 'Нагорный район',
    districtId: 'yao', metaTitle: 'Дезинфекция в Нагорном районе — от 1000₽',
    metaDescription: 'Дезинфекция в Нагорном районе ЮАО.',
    h1: 'Дезинфекция в Нагорном районе',
    responseTime: '25-30 мин', surcharge: 0,
    landmarks: ['Варшавское шоссе', 'Метро Нагорная', 'Северное Чертаново'],
    streets: ['Варшавское ш.', 'Нагорная ул.', 'Электролитный проезд'],
    center: [55.6712, 37.6034],
    description: '', faq: []
  },
  {
    id: 'orekhovo-borisovo-severnoe', slug: 'orekhovo-borisovo-severnoe', name: 'Орехово-Борисово Северное', fullName: 'район Орехово-Борисово Северное',
    districtId: 'yao', metaTitle: 'Дезинфекция в Орехово-Борисово Северном — от 1200₽',
    metaDescription: 'Дезинфекция в Орехово-Борисово Северном ЮАО.',
    h1: 'Дезинфекция в Орехово-Борисово Северном',
    responseTime: '30-40 мин', surcharge: 500,
    landmarks: ['Борисовские пруды', 'Метро Шипиловская'],
    streets: ['Каширское ш.', 'Борисовские пруды ул.', 'Шипиловская ул.'],
    center: [55.6289, 37.7134],
    description: '', faq: []
  },
  {
    id: 'orekhovo-borisovo-yuzhnoe', slug: 'orekhovo-borisovo-yuzhnoe', name: 'Орехово-Борисово Южное', fullName: 'район Орехово-Борисово Южное',
    districtId: 'yao', metaTitle: 'Дезинфекция в Орехово-Борисово Южном — от 1200₽',
    metaDescription: 'Дезинфекция в Орехово-Борисово Южном ЮАО.',
    h1: 'Дезинфекция в Орехово-Борисово Южном',
    responseTime: '35-45 мин', surcharge: 500,
    landmarks: ['Борисовские пруды', 'Метро Орехово'],
    streets: ['Каширское ш.', 'Ореховый проезд', 'ул. Маршала Захарова'],
    center: [55.6089, 37.7189],
    description: '', faq: []
  },
  {
    id: 'tsaritsyno', slug: 'tsaritsyno', name: 'Царицыно', fullName: 'район Царицыно',
    districtId: 'yao', metaTitle: 'Дезинфекция в Царицыно — от 1200₽',
    metaDescription: 'Дезинфекция в Царицыно ЮАО Москвы.',
    h1: 'Дезинфекция в Царицыно Москвы',
    responseTime: '30-40 мин', surcharge: 500,
    landmarks: ['Парк Царицыно', 'Музей-заповедник Царицыно', 'Метро Царицыно'],
    streets: ['Каспийская ул.', 'ул. Бакинская', 'Кавказский б-р'],
    center: [55.6234, 37.6689],
    description: '', faq: []
  },
  {
    id: 'chertanovo-severnoe', slug: 'chertanovo-severnoe', name: 'Чертаново Северное', fullName: 'район Чертаново Северное', prepositional: 'в Чертаново Северном',
    districtId: 'yao', metaTitle: 'Дезинфекция в Чертаново Северном — от 1000₽',
    metaDescription: 'Дезинфекция в Чертаново Северном ЮАО.',
    h1: 'Дезинфекция в Чертаново Северном',
    responseTime: '25-35 мин', surcharge: 0,
    landmarks: ['Битцевский парк', 'Метро Чертановская'],
    streets: ['Варшавское ш.', 'Чертановская ул.', 'Балаклавский пр-т'],
    center: [55.6412, 37.5934],
    description: '', faq: []
  },
  {
    id: 'chertanovo-tsentralnoe', slug: 'chertanovo-tsentralnoe', name: 'Чертаново Центральное', fullName: 'район Чертаново Центральное',
    districtId: 'yao', metaTitle: 'Дезинфекция в Чертаново Центральном — от 1200₽',
    metaDescription: 'Дезинфекция в Чертаново Центральном ЮАО.',
    h1: 'Дезинфекция в Чертаново Центральном',
    responseTime: '30-40 мин', surcharge: 500,
    landmarks: ['Битцевский парк', 'Метро Южная'],
    streets: ['Варшавское ш.', 'Днепропетровская ул.', 'Чертановская ул.'],
    center: [55.6189, 37.5989],
    description: '', faq: []
  },
  {
    id: 'chertanovo-yuzhnoe', slug: 'chertanovo-yuzhnoe', name: 'Чертаново Южное', fullName: 'район Чертаново Южное',
    districtId: 'yao', metaTitle: 'Дезинфекция в Чертаново Южном — от 1200₽',
    metaDescription: 'Дезинфекция в Чертаново Южном ЮАО.',
    h1: 'Дезинфекция в Чертаново Южном',
    responseTime: '35-45 мин', surcharge: 500,
    landmarks: ['Битцевский парк', 'МКАД', 'Метро Аннино'],
    streets: ['Варшавское ш.', 'ул. Россошанская', 'Кировоградская ул.'],
    center: [55.5923, 37.6034],
    description: '', faq: []
  }
];

// ЮЗАО (12 районов)
const yzaoNeighborhoods: Neighborhood[] = [
  {
    id: 'akademichesky', slug: 'akademichesky', name: 'Академический', fullName: 'Академический район',
    districtId: 'yzao', metaTitle: 'Дезинфекция в Академическом районе — от 1000₽',
    metaDescription: 'Дезинфекция в Академическом районе ЮЗАО.',
    h1: 'Дезинфекция в Академическом районе',
    responseTime: '25-30 мин', surcharge: 0,
    landmarks: ['РАН', 'Воробьёвы горы', 'Ленинский проспект'],
    streets: ['Ленинский пр-т', 'ул. Вавилова', 'ул. Дмитрия Ульянова'],
    center: [55.6923, 37.5789],
    description: '', faq: []
  },
  {
    id: 'gagarinsky', slug: 'gagarinsky', name: 'Гагаринский', fullName: 'Гагаринский район',
    districtId: 'yzao', metaTitle: 'Дезинфекция в Гагаринском районе — от 1000₽',
    metaDescription: 'Дезинфекция в Гагаринском районе ЮЗАО.',
    h1: 'Дезинфекция в Гагаринском районе',
    responseTime: '20-25 мин', surcharge: 0,
    landmarks: ['МГУ', 'Воробьёвы горы', 'Ленинский проспект'],
    streets: ['Ленинский пр-т', 'пр-т Вернадского', 'ул. Косыгина'],
    center: [55.7023, 37.5534],
    description: '', faq: []
  },
  {
    id: 'zyuzino', slug: 'zyuzino', name: 'Зюзино', fullName: 'район Зюзино',
    districtId: 'yzao', metaTitle: 'Дезинфекция в Зюзино — от 1000₽',
    metaDescription: 'Дезинфекция в Зюзино ЮЗАО Москвы.',
    h1: 'Дезинфекция в Зюзино Москвы',
    responseTime: '25-30 мин', surcharge: 0,
    landmarks: ['Метро Каховская', 'Севастопольский проспект'],
    streets: ['Севастопольский пр-т', 'Болотниковская ул.', 'ул. Каховка'],
    center: [55.6623, 37.5734],
    description: '', faq: []
  },
  {
    id: 'konkovo', slug: 'konkovo', name: 'Коньково', fullName: 'район Коньково', prepositional: 'в Коньково',
    districtId: 'yzao', metaTitle: 'Дезинфекция в Коньково — от 1200₽',
    metaDescription: 'Дезинфекция в Коньково ЮЗАО Москвы.',
    h1: 'Дезинфекция в Коньково Москвы',
    responseTime: '30-40 мин', surcharge: 500,
    landmarks: ['Метро Коньково', 'Битцевский парк'],
    streets: ['Профсоюзная ул.', 'ул. Островитянова', 'ул. Миклухо-Маклая'],
    center: [55.6323, 37.5234],
    description: '', faq: []
  },
  {
    id: 'kotlovka', slug: 'kotlovka', name: 'Котловка', fullName: 'район Котловка',
    districtId: 'yzao', metaTitle: 'Дезинфекция в Котловке — от 1000₽',
    metaDescription: 'Дезинфекция в Котловке ЮЗАО.',
    h1: 'Дезинфекция в Котловке Москвы',
    responseTime: '25-30 мин', surcharge: 0,
    landmarks: ['Севастопольский проспект', 'Нахимовский проспект'],
    streets: ['Севастопольский пр-т', 'Нахимовский пр-т', 'ул. Ремизова'],
    center: [55.6689, 37.5989],
    description: '', faq: []
  },
  {
    id: 'lomonosovsky', slug: 'lomonosovsky', name: 'Ломоносовский', fullName: 'Ломоносовский район',
    districtId: 'yzao', metaTitle: 'Дезинфекция в Ломоносовском районе — от 1000₽',
    metaDescription: 'Дезинфекция в Ломоносовском районе ЮЗАО.',
    h1: 'Дезинфекция в Ломоносовском районе',
    responseTime: '25-30 мин', surcharge: 0,
    landmarks: ['МГУ', 'Проспект Вернадского', 'Мичуринский проспект'],
    streets: ['пр-т Вернадского', 'Ломоносовский пр-т', 'Мичуринский пр-т'],
    center: [55.6989, 37.5189],
    description: '', faq: []
  },
  {
    id: 'obruchevsky', slug: 'obruchevsky', name: 'Обручевский', fullName: 'Обручевский район',
    districtId: 'yzao', metaTitle: 'Дезинфекция в Обручевском районе — от 1000₽',
    metaDescription: 'Дезинфекция в Обручевском районе ЮЗАО.',
    h1: 'Дезинфекция в Обручевском районе',
    responseTime: '25-30 мин', surcharge: 0,
    landmarks: ['Профсоюзная улица', 'Метро Калужская'],
    streets: ['Профсоюзная ул.', 'ул. Обручева', 'Нахимовский пр-т'],
    center: [55.6589, 37.5434],
    description: '', faq: []
  },
  {
    id: 'severnoe-butovo', slug: 'severnoe-butovo', name: 'Северное Бутово', fullName: 'район Северное Бутово',
    districtId: 'yzao', metaTitle: 'Дезинфекция в Северном Бутово — от 1500₽',
    metaDescription: 'Дезинфекция в Северном Бутово ЮЗАО.',
    h1: 'Дезинфекция в Северном Бутово',
    responseTime: '40-50 мин', surcharge: 700,
    landmarks: ['Метро Бульвар Дмитрия Донского', 'Бутовский лесопарк'],
    streets: ['Бульвар Дмитрия Донского', 'ул. Грина', 'Куликовская ул.'],
    center: [55.5689, 37.5434],
    description: '', faq: []
  },
  {
    id: 'tyoply-stan', slug: 'tyoply-stan', name: 'Тёплый Стан', fullName: 'район Тёплый Стан',
    districtId: 'yzao', metaTitle: 'Дезинфекция в Тёплом Стане — от 1200₽',
    metaDescription: 'Дезинфекция в Тёплом Стане ЮЗАО.',
    h1: 'Дезинфекция в Тёплом Стане',
    responseTime: '35-45 мин', surcharge: 500,
    landmarks: ['Метро Тёплый Стан', 'Тропарёвский парк'],
    streets: ['Профсоюзная ул.', 'ул. Генерала Тюленева', 'Тёплый Стан ул.'],
    center: [55.6189, 37.4934],
    description: '', faq: []
  },
  {
    id: 'cheryomushki', slug: 'cheryomushki', name: 'Черёмушки', fullName: 'район Черёмушки',
    districtId: 'yzao', metaTitle: 'Дезинфекция в Черёмушках — от 1000₽',
    metaDescription: 'Дезинфекция в Черёмушках ЮЗАО Москвы.',
    h1: 'Дезинфекция в Черёмушках Москвы',
    responseTime: '25-30 мин', surcharge: 0,
    landmarks: ['Метро Черёмушки', 'Рынок Черёмушки'],
    streets: ['Профсоюзная ул.', 'ул. Гарибальди', 'ул. Херсонская'],
    center: [55.6712, 37.5534],
    description: '', faq: []
  },
  {
    id: 'yuzhnoe-butovo', slug: 'yuzhnoe-butovo', name: 'Южное Бутово', fullName: 'район Южное Бутово',
    districtId: 'yzao', metaTitle: 'Дезинфекция в Южном Бутово — от 1500₽',
    metaDescription: 'Дезинфекция в Южном Бутово ЮЗАО.',
    h1: 'Дезинфекция в Южном Бутово',
    responseTime: '45-60 мин', surcharge: 700,
    landmarks: ['Метро Бунинская аллея', 'Варшавское шоссе'],
    streets: ['Бунинская аллея', 'ул. Академика Понтрягина', 'Венёвская ул.'],
    center: [55.5323, 37.5189],
    description: '', faq: []
  },
  {
    id: 'yasenevo', slug: 'yasenevo', name: 'Ясенево', fullName: 'район Ясенево',
    districtId: 'yzao', metaTitle: 'Дезинфекция в Ясенево — от 1200₽',
    metaDescription: 'Дезинфекция в Ясенево ЮЗАО Москвы.',
    h1: 'Дезинфекция в Ясенево Москвы',
    responseTime: '35-45 мин', surcharge: 500,
    landmarks: ['Метро Ясенево', 'Битцевский парк', 'МКАД'],
    streets: ['Профсоюзная ул.', 'Литовский б-р', 'ул. Тарусская'],
    center: [55.6034, 37.5334],
    description: '', faq: []
  }
];

// ЗАО (13 районов)
const zaoNeighborhoods: Neighborhood[] = [
  {
    id: 'vnukovo', slug: 'vnukovo', name: 'Внуково', fullName: 'район Внуково',
    districtId: 'zao', metaTitle: 'Дезинфекция во Внуково — от 1500₽',
    metaDescription: 'Дезинфекция во Внуково ЗАО Москвы.',
    h1: 'Дезинфекция во Внуково Москвы',
    responseTime: '50-60 мин', surcharge: 700,
    landmarks: ['Аэропорт Внуково', 'Боровское шоссе'],
    streets: ['Центральная ул.', 'Рассказовка', '1-я Рейсовая ул.'],
    center: [55.6012, 37.2734],
    description: '', faq: []
  },
  {
    id: 'dorogomilovo', slug: 'dorogomilovo', name: 'Дорогомилово', fullName: 'район Дорогомилово',
    districtId: 'zao', metaTitle: 'Дезинфекция в Дорогомилово — от 1000₽',
    metaDescription: 'Дезинфекция в Дорогомилово ЗАО Москвы.',
    h1: 'Дезинфекция в Дорогомилово Москвы',
    responseTime: '15-20 мин', surcharge: 0,
    landmarks: ['Киевский вокзал', 'Москва-Сити', 'Бородинский мост'],
    streets: ['Кутузовский пр-т', 'ул. Дорогомиловская', 'Можайское ш.'],
    center: [55.7389, 37.5389],
    description: '', faq: []
  },
  {
    id: 'krylatskoe', slug: 'krylatskoe', name: 'Крылатское', fullName: 'район Крылатское',
    districtId: 'zao', metaTitle: 'Дезинфекция в Крылатском — от 1200₽',
    metaDescription: 'Дезинфекция в Крылатском ЗАО Москвы.',
    h1: 'Дезинфекция в Крылатском Москвы',
    responseTime: '30-40 мин', surcharge: 500,
    landmarks: ['Парк Крылатское', 'Гребной канал', 'Метро Крылатское'],
    streets: ['Осенний б-р', 'Крылатская ул.', 'Рублёвское ш.'],
    center: [55.7589, 37.4089],
    description: '', faq: []
  },
  {
    id: 'kuntsevo', slug: 'kuntsevo', name: 'Кунцево', fullName: 'район Кунцево',
    districtId: 'zao', metaTitle: 'Дезинфекция в Кунцево — от 1000₽',
    metaDescription: 'Дезинфекция в Кунцево ЗАО Москвы.',
    h1: 'Дезинфекция в Кунцево Москвы',
    responseTime: '25-35 мин', surcharge: 0,
    landmarks: ['Метро Кунцевская', 'Рублёвское шоссе'],
    streets: ['Рублёвское ш.', 'Можайское ш.', 'ул. Молдавская'],
    center: [55.7323, 37.4289],
    description: '', faq: []
  },
  {
    id: 'mozhaysky', slug: 'mozhaysky', name: 'Можайский', fullName: 'Можайский район',
    districtId: 'zao', metaTitle: 'Дезинфекция в Можайском районе — от 1200₽',
    metaDescription: 'Дезинфекция в Можайском районе ЗАО.',
    h1: 'Дезинфекция в Можайском районе',
    responseTime: '35-45 мин', surcharge: 500,
    landmarks: ['Можайское шоссе', 'Метро Славянский бульвар'],
    streets: ['Можайское ш.', 'ул. Гришина', 'Славянский б-р'],
    center: [55.7189, 37.4089],
    description: '', faq: []
  },
  {
    id: 'novo-peredelkino', slug: 'novo-peredelkino', name: 'Ново-Переделкино', fullName: 'район Ново-Переделкино',
    districtId: 'zao', metaTitle: 'Дезинфекция в Ново-Переделкино — от 1500₽',
    metaDescription: 'Дезинфекция в Ново-Переделкино ЗАО.',
    h1: 'Дезинфекция в Ново-Переделкино',
    responseTime: '40-50 мин', surcharge: 700,
    landmarks: ['Метро Рассказовка', 'Переделкино', 'Лес'],
    streets: ['Боровское ш.', 'ул. Лукинская', 'ул. Скульптора Мухиной'],
    center: [55.6412, 37.3534],
    description: '', faq: []
  },
  {
    id: 'ochakovo-matveevskoe', slug: 'ochakovo-matveevskoe', name: 'Очаково-Матвеевское', fullName: 'район Очаково-Матвеевское',
    districtId: 'zao', metaTitle: 'Дезинфекция в Очаково-Матвеевском — от 1200₽',
    metaDescription: 'Дезинфекция в Очаково-Матвеевском ЗАО.',
    h1: 'Дезинфекция в Очаково-Матвеевском',
    responseTime: '30-40 мин', surcharge: 500,
    landmarks: ['Метро Озёрная', 'Парк 50-летия Октября'],
    streets: ['пр-т Вернадского', 'Аминьевское ш.', 'Очаковское ш.'],
    center: [55.6889, 37.4489],
    description: '', faq: []
  },
  {
    id: 'prospekt-vernadskogo', slug: 'prospekt-vernadskogo', name: 'Проспект Вернадского', fullName: 'район Проспект Вернадского',
    districtId: 'zao', metaTitle: 'Дезинфекция на Проспекте Вернадского — от 1000₽',
    metaDescription: 'Дезинфекция на Проспекте Вернадского ЗАО.',
    h1: 'Дезинфекция на Проспекте Вернадского',
    responseTime: '25-30 мин', surcharge: 0,
    landmarks: ['Детский мир', 'Цирк на Вернадского', 'РУДН'],
    streets: ['пр-т Вернадского', 'Удальцова ул.', 'Новаторов ул.'],
    center: [55.6789, 37.4989],
    description: '', faq: []
  },
  {
    id: 'ramenki', slug: 'ramenki', name: 'Раменки', fullName: 'район Раменки',
    districtId: 'zao', metaTitle: 'Дезинфекция в Раменках — от 1000₽',
    metaDescription: 'Дезинфекция в Раменках ЗАО Москвы.',
    h1: 'Дезинфекция в Раменках Москвы',
    responseTime: '25-30 мин', surcharge: 0,
    landmarks: ['МГУ', 'Мичуринский проспект', 'Метро Раменки'],
    streets: ['Мичуринский пр-т', 'ул. Раменки', 'ул. Удальцова'],
    center: [55.6889, 37.4689],
    description: '', faq: []
  },
  {
    id: 'solntsevo', slug: 'solntsevo', name: 'Солнцево', fullName: 'район Солнцево',
    districtId: 'zao', metaTitle: 'Дезинфекция в Солнцево — от 1200₽',
    metaDescription: 'Дезинфекция в Солнцево ЗАО Москвы.',
    h1: 'Дезинфекция в Солнцево Москвы',
    responseTime: '35-45 мин', surcharge: 500,
    landmarks: ['Метро Солнцево', 'Солнцевский проспект'],
    streets: ['Солнцевский пр-т', 'ул. Богданова', 'Попутная ул.'],
    center: [55.6434, 37.3989],
    description: '', faq: []
  },
  {
    id: 'troparyovo-nikulino', slug: 'troparyovo-nikulino', name: 'Тропарёво-Никулино', fullName: 'район Тропарёво-Никулино',
    districtId: 'zao', metaTitle: 'Дезинфекция в Тропарёво-Никулино — от 1200₽',
    metaDescription: 'Дезинфекция в Тропарёво-Никулино ЗАО.',
    h1: 'Дезинфекция в Тропарёво-Никулино',
    responseTime: '30-40 мин', surcharge: 500,
    landmarks: ['Тропарёвский парк', 'Метро Тропарёво', 'Юго-западная'],
    streets: ['пр-т Вернадского', 'Ленинский пр-т', 'ул. Академика Анохина'],
    center: [55.6534, 37.4689],
    description: '', faq: []
  },
  {
    id: 'filyovsky-park', slug: 'filyovsky-park', name: 'Филёвский Парк', fullName: 'район Филёвский Парк',
    districtId: 'zao', metaTitle: 'Дезинфекция в Филёвском Парке — от 1000₽',
    metaDescription: 'Дезинфекция в Филёвском Парке ЗАО.',
    h1: 'Дезинфекция в Филёвском Парке',
    responseTime: '25-30 мин', surcharge: 0,
    landmarks: ['Парк Фили', 'Метро Фили', 'Москва-река'],
    streets: ['Б. Филёвская ул.', 'Филёвский б-р', 'Минская ул.'],
    center: [55.7389, 37.4689],
    description: '', faq: []
  },
  {
    id: 'fili-davydkovo', slug: 'fili-davydkovo', name: 'Фили-Давыдково', fullName: 'район Фили-Давыдково',
    districtId: 'zao', metaTitle: 'Дезинфекция в Фили-Давыдково — от 1000₽',
    metaDescription: 'Дезинфекция в Фили-Давыдково ЗАО.',
    h1: 'Дезинфекция в Фили-Давыдково',
    responseTime: '25-30 мин', surcharge: 0,
    landmarks: ['Парк Фили', 'Кутузовский проспект', 'Метро Славянский б-р'],
    streets: ['Кутузовский пр-т', 'Славянский б-р', 'ул. Давыдковская'],
    center: [55.7234, 37.4489],
    description: '', faq: []
  }
];

// СЗАО (8 районов)
const szaoNeighborhoods: Neighborhood[] = [
  {
    id: 'kurkino', slug: 'kurkino', name: 'Куркино', fullName: 'район Куркино',
    districtId: 'szao', metaTitle: 'Дезинфекция в Куркино — от 1500₽',
    metaDescription: 'Дезинфекция в Куркино СЗАО Москвы.',
    h1: 'Дезинфекция в Куркино Москвы',
    responseTime: '40-50 мин', surcharge: 700,
    landmarks: ['Куркинское шоссе', 'Долина реки Сходни'],
    streets: ['Куркинское ш.', 'Новокуркинское ш.', 'ул. Воротынская'],
    center: [55.8823, 37.3934],
    description: '', faq: []
  },
  {
    id: 'mitino', slug: 'mitino', name: 'Митино', fullName: 'район Митино',
    districtId: 'szao', metaTitle: 'Дезинфекция в Митино — от 1500₽',
    metaDescription: 'Дезинфекция в Митино СЗАО Москвы.',
    h1: 'Дезинфекция в Митино Москвы',
    responseTime: '40-50 мин', surcharge: 700,
    landmarks: ['Метро Митино', 'ТЦ Митино', 'Пятницкое шоссе'],
    streets: ['Пятницкое ш.', 'Митинская ул.', 'ул. Барышиха'],
    center: [55.8489, 37.3534],
    description: '', faq: []
  },
  {
    id: 'pokrovskoe-streshnevo', slug: 'pokrovskoe-streshnevo', name: 'Покровское-Стрешнево', fullName: 'район Покровское-Стрешнево',
    districtId: 'szao', metaTitle: 'Дезинфекция в Покровском-Стрешнево — от 1000₽',
    metaDescription: 'Дезинфекция в Покровском-Стрешнево СЗАО.',
    h1: 'Дезинфекция в Покровском-Стрешнево',
    responseTime: '25-35 мин', surcharge: 0,
    landmarks: ['Парк Покровское-Стрешнево', 'Метро Щукинская'],
    streets: ['Волоколамское ш.', 'ул. Габричевского', 'ул. Тушинская'],
    center: [55.8089, 37.4689],
    description: '', faq: []
  },
  {
    id: 'severnoe-tushino', slug: 'severnoe-tushino', name: 'Северное Тушино', fullName: 'район Северное Тушино',
    districtId: 'szao', metaTitle: 'Дезинфекция в Северном Тушино — от 1200₽',
    metaDescription: 'Дезинфекция в Северном Тушино СЗАО.',
    h1: 'Дезинфекция в Северном Тушино',
    responseTime: '30-40 мин', surcharge: 500,
    landmarks: ['Метро Планерная', 'Тушинский парк'],
    streets: ['Планерная ул.', 'ул. Вилиса Лациса', 'Химкинский б-р'],
    center: [55.8434, 37.4234],
    description: '', faq: []
  },
  {
    id: 'strogino', slug: 'strogino', name: 'Строгино', fullName: 'район Строгино', prepositional: 'в Строгино',
    districtId: 'szao', metaTitle: 'Дезинфекция в Строгино — от 1200₽',
    metaDescription: 'Дезинфекция в Строгино СЗАО Москвы.',
    h1: 'Дезинфекция в Строгино Москвы',
    responseTime: '30-40 мин', surcharge: 500,
    landmarks: ['Строгинская пойма', 'Метро Строгино', 'Москва-река'],
    streets: ['Строгинский б-р', 'ул. Таллинская', 'ул. Кулакова'],
    center: [55.8023, 37.3989],
    description: '', faq: []
  },
  {
    id: 'khoroshevo-mnevniki', slug: 'khoroshevo-mnevniki', name: 'Хорошёво-Мнёвники', fullName: 'район Хорошёво-Мнёвники',
    districtId: 'szao', metaTitle: 'Дезинфекция в Хорошёво-Мнёвниках — от 1000₽',
    metaDescription: 'Дезинфекция в Хорошёво-Мнёвниках СЗАО.',
    h1: 'Дезинфекция в Хорошёво-Мнёвниках',
    responseTime: '25-30 мин', surcharge: 0,
    landmarks: ['Живописный мост', 'Серебряный бор', 'Метро Полежаевская'],
    streets: ['Хорошёвское ш.', 'ул. Мнёвники', 'Карамышевская наб.'],
    center: [55.7723, 37.4489],
    description: '', faq: []
  },
  {
    id: 'shchukino', slug: 'shchukino', name: 'Щукино', fullName: 'район Щукино',
    districtId: 'szao', metaTitle: 'Дезинфекция в Щукино — от 1000₽',
    metaDescription: 'Дезинфекция в Щукино СЗАО Москвы.',
    h1: 'Дезинфекция в Щукино Москвы',
    responseTime: '25-30 мин', surcharge: 0,
    landmarks: ['Метро Щукинская', 'Строгинское шоссе'],
    streets: ['ул. Маршала Василевского', 'ул. Щукинская', 'Волоколамское ш.'],
    center: [55.7989, 37.4489],
    description: '', faq: []
  },
  {
    id: 'yuzhnoe-tushino', slug: 'yuzhnoe-tushino', name: 'Южное Тушино', fullName: 'район Южное Тушино',
    districtId: 'szao', metaTitle: 'Дезинфекция в Южном Тушино — от 1000₽',
    metaDescription: 'Дезинфекция в Южном Тушино СЗАО.',
    h1: 'Дезинфекция в Южном Тушино',
    responseTime: '25-35 мин', surcharge: 0,
    landmarks: ['Метро Сходненская', 'Тушинский парк', 'Волоколамское шоссе'],
    streets: ['Сходненская ул.', 'Тушинская ул.', 'ул. Свободы'],
    center: [55.8234, 37.4334],
    description: '', faq: []
  }
];

// НАО (2 поселения) + ТАО (3 поселения) + ЗелАО (5 районов)
const newDistrictsNeighborhoods: Neighborhood[] = [
  // НАО
  {
    id: 'sosenskoe', slug: 'sosenskoe', name: 'Сосенское', fullName: 'поселение Сосенское',
    districtId: 'nao', metaTitle: 'Дезинфекция в Сосенском — от 1500₽',
    metaDescription: 'Дезинфекция в Сосенском НАО Москвы.',
    h1: 'Дезинфекция в Сосенском',
    responseTime: '50-60 мин', surcharge: 700,
    landmarks: ['Коммунарка', 'Калужское шоссе'],
    streets: ['Калужское ш.', 'ул. Потапово', 'ул. Бачуринская'],
    center: [55.5689, 37.4734],
    description: '', faq: []
  },
  {
    id: 'vnukovskoe', slug: 'vnukovskoe', name: 'Внуковское', fullName: 'поселение Внуковское',
    districtId: 'nao', metaTitle: 'Дезинфекция во Внуковском — от 1500₽',
    metaDescription: 'Дезинфекция во Внуковском НАО Москвы.',
    h1: 'Дезинфекция во Внуковском',
    responseTime: '50-60 мин', surcharge: 700,
    landmarks: ['Аэропорт Внуково', 'Боровское шоссе'],
    streets: ['Боровское ш.', 'ул. Внуковская', 'Рассказовка'],
    center: [55.5912, 37.2934],
    description: '', faq: []
  },
  // ТАО
  {
    id: 'troitsk', slug: 'troitsk', name: 'Троицк', fullName: 'город Троицк',
    districtId: 'tao', metaTitle: 'Дезинфекция в Троицке — от 2000₽',
    metaDescription: 'Дезинфекция в Троицке ТАО Москвы.',
    h1: 'Дезинфекция в Троицке',
    responseTime: '60-90 мин', surcharge: 1000,
    landmarks: ['Наукоград Троицк', 'Калужское шоссе'],
    streets: ['Октябрьский пр-т', 'ул. Центральная', 'ул. Солнечная'],
    center: [55.4823, 37.3089],
    description: '', faq: []
  },
  {
    id: 'shcherbinka', slug: 'shcherbinka', name: 'Щербинка', fullName: 'город Щербинка',
    districtId: 'tao', metaTitle: 'Дезинфекция в Щербинке — от 1500₽',
    metaDescription: 'Дезинфекция в Щербинке ТАО Москвы.',
    h1: 'Дезинфекция в Щербинке',
    responseTime: '50-60 мин', surcharge: 700,
    landmarks: ['Железнодорожная станция Щербинка', 'Симферопольское шоссе'],
    streets: ['ул. Железнодорожная', 'Симферопольское ш.', 'ул. Юбилейная'],
    center: [55.5134, 37.5534],
    description: '', faq: []
  },
  {
    id: 'moskovsky', slug: 'moskovsky', name: 'Московский', fullName: 'город Московский',
    districtId: 'tao', metaTitle: 'Дезинфекция в Московском — от 1500₽',
    metaDescription: 'Дезинфекция в Московском ТАО Москвы.',
    h1: 'Дезинфекция в Московском',
    responseTime: '50-60 мин', surcharge: 700,
    landmarks: ['Киевское шоссе', 'Новая Москва'],
    streets: ['Киевское ш.', 'ул. Радужная', 'ул. Атласова'],
    center: [55.5989, 37.3589],
    description: '', faq: []
  },
  // ЗелАО
  {
    id: 'zelenograd-1', slug: 'zelenograd-1', name: 'Зеленоград 1 мкр', fullName: 'Зеленоград, 1-й микрорайон',
    districtId: 'zelao', metaTitle: 'Дезинфекция в Зеленограде 1 мкр — от 2000₽',
    metaDescription: 'Дезинфекция в 1-м микрорайоне Зеленограда.',
    h1: 'Дезинфекция в 1-м микрорайоне Зеленограда',
    responseTime: '70-90 мин', surcharge: 1000,
    landmarks: ['Площадь Юности', 'Центральный проспект'],
    streets: ['Центральный пр-т', 'ул. Гоголя', 'Панфиловский пр-т'],
    center: [55.9923, 37.1823],
    description: '', faq: []
  },
  {
    id: 'zelenograd-2', slug: 'zelenograd-2', name: 'Зеленоград 2 мкр', fullName: 'Зеленоград, 2-й микрорайон',
    districtId: 'zelao', metaTitle: 'Дезинфекция в Зеленограде 2 мкр — от 2000₽',
    metaDescription: 'Дезинфекция во 2-м микрорайоне Зеленограда.',
    h1: 'Дезинфекция во 2-м микрорайоне Зеленограда',
    responseTime: '70-90 мин', surcharge: 1000,
    landmarks: ['Савёлкинский проезд', 'Парк Победы'],
    streets: ['Савёлкинский проезд', 'ул. Юности', 'Солнечная аллея'],
    center: [55.9989, 37.1889],
    description: '', faq: []
  },
  {
    id: 'zelenograd-3', slug: 'zelenograd-3', name: 'Зеленоград 3 мкр', fullName: 'Зеленоград, 3-й микрорайон',
    districtId: 'zelao', metaTitle: 'Дезинфекция в Зеленограде 3 мкр — от 2000₽',
    metaDescription: 'Дезинфекция в 3-м микрорайоне Зеленограда.',
    h1: 'Дезинфекция в 3-м микрорайоне Зеленограда',
    responseTime: '70-90 мин', surcharge: 1000,
    landmarks: ['Станция Крюково', 'Ленинградское шоссе'],
    streets: ['Ленинградское ш.', 'Заводская ул.', 'ул. Крюково'],
    center: [56.0034, 37.1734],
    description: '', faq: []
  },
  {
    id: 'zelenograd-4', slug: 'zelenograd-4', name: 'Зеленоград 4 мкр', fullName: 'Зеленоград, 4-й микрорайон',
    districtId: 'zelao', metaTitle: 'Дезинфекция в Зеленограде 4 мкр — от 2000₽',
    metaDescription: 'Дезинфекция в 4-м микрорайоне Зеленограда.',
    h1: 'Дезинфекция в 4-м микрорайоне Зеленограда',
    responseTime: '70-90 мин', surcharge: 1000,
    landmarks: ['Малинское шоссе', 'Новые микрорайоны'],
    streets: ['Малинская ул.', 'Озёрная аллея', 'Логвиненко ул.'],
    center: [55.9856, 37.1956],
    description: '', faq: []
  },
  {
    id: 'zelenograd-5', slug: 'zelenograd-5', name: 'Зеленоград 5 мкр', fullName: 'Зеленоград, 5-й микрорайон',
    districtId: 'zelao', metaTitle: 'Дезинфекция в Зеленограде 5 мкр — от 2000₽',
    metaDescription: 'Дезинфекция в 5-м микрорайоне Зеленограда.',
    h1: 'Дезинфекция в 5-м микрорайоне Зеленограда',
    responseTime: '70-90 мин', surcharge: 1000,
    landmarks: ['Андреевка', 'МИЭТ'],
    streets: ['Андреевка ул.', 'Зелёный проспект', 'ул. Радио'],
    center: [55.9778, 37.2012],
    description: '', faq: []
  }
];

// Fill in descriptions and FAQs
function fillNeighborhoodData(neighborhoods: Neighborhood[]): Neighborhood[] {
  return neighborhoods.map(n => ({
    ...n,
    description: genDescription(n.name, n.districtId, n.landmarks, n.responseTime),
    faq: genFAQ(n.name, n.responseTime, n.surcharge)
  }));
}

// Combine all neighborhoods
export const neighborhoods: Neighborhood[] = [
  ...fillNeighborhoodData(caoNeighborhoods),
  ...fillNeighborhoodData(saoNeighborhoods),
  ...fillNeighborhoodData(svaoNeighborhoods),
  ...fillNeighborhoodData(vaoNeighborhoods),
  ...fillNeighborhoodData(yuvaoNeighborhoods),
  ...fillNeighborhoodData(yaoNeighborhoods),
  ...fillNeighborhoodData(yzaoNeighborhoods),
  ...fillNeighborhoodData(zaoNeighborhoods),
  ...fillNeighborhoodData(szaoNeighborhoods),
  ...fillNeighborhoodData(newDistrictsNeighborhoods),
];

// Helper functions
export function getNeighborhoodBySlug(slug: string): Neighborhood | undefined {
  return neighborhoods.find(n => n.slug === slug);
}

export function getNeighborhoodsByDistrict(districtId: string): Neighborhood[] {
  return neighborhoods.filter(n => n.districtId === districtId);
}

export function getAllNeighborhoodSlugs(): string[] {
  return neighborhoods.map(n => n.slug);
}
