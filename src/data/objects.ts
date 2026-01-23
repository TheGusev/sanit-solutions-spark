/**
 * Централизованные данные о типах объектов для SSG-генерации.
 * Используется в: ServicePage, Calculator, vite-plugin-ssg.ts
 */

export interface ObjectType {
  id: string;
  slug: string;
  name: string;
  namePlural: string;
  genitive: string; // "квартиры", "офиса"
  accusative: string; // "квартиру", "офис"
  prepositional: string; // "квартире", "офисе"
  icon: string;
  priceMultiplier: number; // множитель к базовой цене
  minArea: number;
  maxArea: number;
  averageTime: string; // время обработки
  description: string;
  features: string[]; // особенности работы с этим типом объекта
}

export const objectTypes: ObjectType[] = [
  {
    id: 'kvartira',
    slug: 'kvartir',
    name: 'Квартира',
    namePlural: 'Квартиры',
    genitive: 'квартиры',
    accusative: 'квартиру',
    prepositional: 'квартире',
    icon: '🏠',
    priceMultiplier: 1.0,
    minArea: 20,
    maxArea: 150,
    averageTime: '1-2 часа',
    description: 'Обработка квартир любой планировки — от студий до многокомнатных. Учитываем наличие детей и домашних животных.',
    features: [
      'Обработка всех комнат',
      'Работа за мебелью',
      'Безопасно для детей и животных',
      'Гарантия до 1 года'
    ]
  },
  {
    id: 'dom',
    slug: 'domov',
    name: 'Частный дом',
    namePlural: 'Частные дома',
    genitive: 'дома',
    accusative: 'дом',
    prepositional: 'доме',
    icon: '🏡',
    priceMultiplier: 1.3,
    minArea: 50,
    maxArea: 500,
    averageTime: '2-4 часа',
    description: 'Комплексная обработка частного дома включая подвал, чердак и придомовую территорию.',
    features: [
      'Обработка подвала и чердака',
      'Работа на придомовой территории',
      'Барьерная защита периметра',
      'Проверка путей проникновения'
    ]
  },
  {
    id: 'ofis',
    slug: 'ofisov',
    name: 'Офис',
    namePlural: 'Офисы',
    genitive: 'офиса',
    accusative: 'офис',
    prepositional: 'офисе',
    icon: '🏢',
    priceMultiplier: 1.2,
    minArea: 30,
    maxArea: 1000,
    averageTime: '2-3 часа',
    description: 'Обработка офисных помещений в рабочее или нерабочее время. Работаем с юридическими лицами.',
    features: [
      'Работа в удобное время',
      'Договор и акты выполненных работ',
      'Без запаха — не мешает работе',
      'Регулярное обслуживание'
    ]
  },
  {
    id: 'restoran',
    slug: 'restoranov',
    name: 'Ресторан/Кафе',
    namePlural: 'Рестораны и кафе',
    genitive: 'ресторана',
    accusative: 'ресторан',
    prepositional: 'ресторане',
    icon: '🍽️',
    priceMultiplier: 1.5,
    minArea: 50,
    maxArea: 500,
    averageTime: '3-4 часа',
    description: 'Дезинсекция и дератизация заведений общепита с соблюдением всех требований СанПиН.',
    features: [
      'Соответствие требованиям СанПиН',
      'Полный пакет документов',
      'Работа ночью без остановки бизнеса',
      'Журнал учёта для проверок'
    ]
  },
  {
    id: 'sklad',
    slug: 'skladov',
    name: 'Склад',
    namePlural: 'Склады',
    genitive: 'склада',
    accusative: 'склад',
    prepositional: 'складе',
    icon: '🏭',
    priceMultiplier: 0.8, // большая площадь — меньше цена за м²
    minArea: 100,
    maxArea: 10000,
    averageTime: '4-8 часов',
    description: 'Обработка складских помещений с учётом хранимой продукции и требований к безопасности.',
    features: [
      'Учёт типа хранимой продукции',
      'Работа с большими площадями',
      'Барьерная защита от грызунов',
      'Регулярное техобслуживание'
    ]
  },
  {
    id: 'proizvodstvo',
    slug: 'proizvodstv',
    name: 'Производство',
    namePlural: 'Производственные помещения',
    genitive: 'производства',
    accusative: 'производство',
    prepositional: 'производстве',
    icon: '⚙️',
    priceMultiplier: 0.7,
    minArea: 200,
    maxArea: 50000,
    averageTime: '6-12 часов',
    description: 'Комплексная дезинсекция и дератизация производственных объектов пищевой и непищевой промышленности.',
    features: [
      'Работа без остановки производства',
      'HACCP-совместимые методы',
      'Сертифицированные препараты',
      'Годовые контракты с графиком'
    ]
  }
];

// Получить тип объекта по slug
export function getObjectBySlug(slug: string): ObjectType | undefined {
  return objectTypes.find(o => o.slug === slug);
}

// Slug-массивы для SSG
export const objectSlugs = objectTypes.map(o => o.slug);
