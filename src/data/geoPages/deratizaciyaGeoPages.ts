/**
 * === GEO PAGES: DERATIZACIYA ===
 * Данные для географических страниц дератизации по 9 округам Москвы
 */

import type { GeoPageData, GeoPagePricing } from './types';
import { moscowDistricts } from './districts';

const baseHeroUsps = ['🚗 Быстрый выезд', '📍 Знаем район', '🐀 100% результат'];

const deratizaciyaPricing: GeoPagePricing = {
  apartments: [
    { type: '1-комнатная', area: '30-40 м²', price: '3 000 ₽', time: '1-2 ч' },
    { type: '2-комнатная', area: '45-60 м²', price: '4 000 ₽', time: '2-3 ч' },
    { type: '3-комнатная', area: '60-80 м²', price: '5 000 ₽', time: '3-4 ч' },
    { type: '4+ комнатная', area: '80+ м²', price: 'от 6 000 ₽', time: '4+ ч' }
  ],
  offices: [
    { area: 'До 100 м²', price: '7 000 ₽', time: '3-4 ч' },
    { area: '100-300 м²', price: '18 000 ₽', time: '5-6 ч' },
    { area: '300-500 м²', price: '30 000 ₽', time: '7-8 ч' },
    { area: 'Более 500 м²', price: 'Индивидуально', time: 'от 10 ч' }
  ],
  restaurants: [
    { type: 'Кафе/кофейня (до 50 м²)', price: '6 000 ₽', frequency: 'Раз в месяц' },
    { type: 'Ресторан (50-150 м²)', price: '12 000 ₽', frequency: 'Раз в месяц' },
    { type: 'Крупный ресторан (150+ м²)', price: 'от 18 000 ₽', frequency: 'Раз в 2 недели' }
  ]
};

export const deratizaciyaGeoPages: GeoPageData[] = [
  // ЦАО
  {
    districtCode: 'cao',
    serviceType: 'deratizaciya',
    slug: 'deratizaciya-cao',
    seo: {
      title: 'Дератизация в ЦАО Москвы – уничтожение крыс и мышей | от 3000₽',
      description: 'Профессиональная дератизация в Центральном округе Москвы. Уничтожение крыс, мышей. Выезд за 20 минут. Гарантия.',
      h1: 'Дератизация в ЦАО Москвы – уничтожение грызунов',
      keywords: ['дератизация цао', 'уничтожение крыс центр москвы', 'мыши в ресторане']
    },
    hero: {
      subtitle: 'Уничтожаем крыс и мышей в центре Москвы. Рестораны, офисы, исторические здания.',
      usps: baseHeroUsps
    },
    breadcrumbs: [
      { text: 'Главная', url: '/' },
      { text: 'Дератизация', url: '/uslugi/deratizaciya' },
      { text: 'ЦАО', url: '/uslugi/deratizaciya-cao' }
    ],
    districtInfo: moscowDistricts.cao,
    specifics: [
      { icon: '🍽️', title: 'Рестораны и кафе', description: 'Грызуны — закрытие заведения. Дискретная обработка ночью.' },
      { icon: '🏛️', title: 'Старые здания', description: 'Исторические дома — ходы и норы в перекрытиях.' },
      { icon: '🏨', title: 'Гостиницы', description: 'Крысы в подвалах отелей — работаем конфиденциально.' },
      { icon: '🏢', title: 'Бизнес-центры', description: 'Мыши в офисах — барьерная защита.' },
      { icon: '🛒', title: 'Магазины', description: 'Продуктовые — требования Роспотребнадзора.' },
      { icon: '📋', title: 'Документы', description: 'Акты, журналы, договоры для проверок.' }
    ],
    pricing: deratizaciyaPricing,
    cases: [
      { type: 'Ресторан', title: 'Ресторан на Маросейке', area: '200 м²', task: 'Крысы в подвале', solution: 'Отлов + герметизация ходов. Ежемесячное обслуживание.', date: 'Январь 2026' },
      { type: 'Офис', title: 'БЦ на Мясницкой', area: '1500 м²', task: 'Мыши на складе документов', solution: 'Ловушки + ультразвук. Договор на год.', date: 'Декабрь 2025' }
    ],
    reviews: [
      { rating: 5, district: 'Тверской', text: 'Крысы в ресторане — конец репутации. Ребята спасли бизнес!', author: 'Игорь Р.', role: 'Ресторатор', date: '15 января 2026' },
      { rating: 5, district: 'Арбат', text: 'Мыши в старом доме — извели за 2 визита. Гарантия работает.', author: 'Мария С.', role: 'Жительница', date: '10 января 2026' },
      { rating: 5, district: 'Замоскворечье', text: 'Крысы в подъезде. Управляющая компания заказала — чисто!', author: 'Алексей В.', role: 'Старший по дому', date: '5 января 2026' }
    ],
    stats: { objectsCount: 156, avgArrival: '20 мин', rating: 4.9 }
  },

  // САО
  {
    districtCode: 'sao',
    serviceType: 'deratizaciya',
    slug: 'deratizaciya-sao',
    seo: {
      title: 'Дератизация в САО Москвы – уничтожение крыс и мышей | от 3000₽',
      description: 'Дератизация в Северном округе: Сокол, Аэропорт, Тимирязевский. Выезд за 30 минут. Гарантия.',
      h1: 'Дератизация в САО Москвы – уничтожение грызунов',
      keywords: ['дератизация сао', 'уничтожение мышей сокол', 'крысы в подвале аэропорт']
    },
    hero: {
      subtitle: 'САО: Сокол, Аэропорт, Ховрино. Жилые дома, торговые центры, склады.',
      usps: baseHeroUsps
    },
    breadcrumbs: [
      { text: 'Главная', url: '/' },
      { text: 'Дератизация', url: '/uslugi/deratizaciya' },
      { text: 'САО', url: '/uslugi/deratizaciya-sao' }
    ],
    districtInfo: moscowDistricts.sao,
    specifics: [
      { icon: '🏠', title: 'Панельные дома', description: 'Мыши в подвалах и на первых этажах.' },
      { icon: '🛒', title: 'Торговые центры', description: 'Грызуны на складах продуктов.' },
      { icon: '🏭', title: 'Склады', description: 'Промышленные зоны — крысы и мыши.' },
      { icon: '🏥', title: 'Медучреждения', description: 'Клиники — строгие требования СанПиН.' },
      { icon: '🚇', title: 'Метро', description: 'Быстрый выезд в любую точку.' },
      { icon: '🛡️', title: 'Барьерная защита', description: 'Предотвращаем повторное проникновение.' }
    ],
    pricing: deratizaciyaPricing,
    cases: [
      { type: 'Жилой дом', title: 'Многоэтажка на Соколе', area: '12 этажей', task: 'Мыши в подвале', solution: 'Дератизация + герметизация входов. Гарантия 1 год.', date: 'Январь 2026' },
      { type: 'Супермаркет', title: 'Магазин в Ховрино', area: '400 м²', task: 'Следы грызунов на складе', solution: 'Комплексная обработка. Договор на обслуживание.', date: 'Декабрь 2025' }
    ],
    reviews: [
      { rating: 5, district: 'Сокол', text: 'Мыши в квартире на первом этаже. Вывели быстро, заделали щели.', author: 'Елена М.', role: 'Хозяйка квартиры', date: '14 января 2026' },
      { rating: 5, district: 'Аэропорт', text: 'Крысы в подвале офиса. Проблема решена за 1 неделю.', author: 'Сергей К.', role: 'Офис-менеджер', date: '10 января 2026' },
      { rating: 5, district: 'Тимирязевский', text: 'Грызуны в частном доме. Отловили всех, поставили защиту.', author: 'Виктор Н.', role: 'Владелец дома', date: '6 января 2026' }
    ],
    stats: { objectsCount: 134, avgArrival: '30 мин', rating: 4.8 }
  },

  // СВАО
  {
    districtCode: 'svao',
    serviceType: 'deratizaciya',
    slug: 'deratizaciya-svao',
    seo: {
      title: 'Дератизация в СВАО Москвы – уничтожение мышей и крыс | от 3000₽',
      description: 'Дератизация в Северо-Восточном округе: Отрадное, Бибирево, Медведково. Гарантия результата.',
      h1: 'Дератизация в СВАО Москвы – уничтожение грызунов',
      keywords: ['дератизация свао', 'мыши отрадное', 'крысы бибирево']
    },
    hero: {
      subtitle: 'СВАО: Отрадное, Бибирево, Медведково. Семейные районы — безопасные методы.',
      usps: baseHeroUsps
    },
    breadcrumbs: [
      { text: 'Главная', url: '/' },
      { text: 'Дератизация', url: '/uslugi/deratizaciya' },
      { text: 'СВАО', url: '/uslugi/deratizaciya-svao' }
    ],
    districtInfo: moscowDistricts.svao,
    specifics: [
      { icon: '👨‍👩‍👧‍👦', title: 'Семьи с детьми', description: 'Безопасные ловушки и отпугиватели.' },
      { icon: '🐕', title: 'Домашние животные', description: 'Методы, безопасные для питомцев.' },
      { icon: '🌳', title: 'Лосиный остров', description: 'Близость к лесу — мыши с природы.' },
      { icon: '🏗️', title: 'Новостройки', description: 'Грызуны проникают во время стройки.' },
      { icon: '🏫', title: 'Детские учреждения', description: 'Школы и сады — профилактика.' },
      { icon: '⚡', title: 'Быстрый результат', description: 'Устраняем за 1-2 визита.' }
    ],
    pricing: deratizaciyaPricing,
    cases: [
      { type: 'Частный дом', title: 'Дом в Лианозово', area: '180 м²', task: 'Мыши с участка', solution: 'Отлов + барьерная защита периметра.', date: 'Январь 2026' },
      { type: 'Детский сад', title: 'ДОУ в Отрадном', area: '350 м²', task: 'Профилактика перед проверкой', solution: 'Обработка + документы для СЭС.', date: 'Август 2025' }
    ],
    reviews: [
      { rating: 5, district: 'Отрадное', text: 'Мыши в квартире с ребёнком — страшно! Использовали безопасные методы.', author: 'Ольга К.', role: 'Мама', date: '16 января 2026' },
      { rating: 5, district: 'Медведково', text: 'Крысы в подвале дома. Управляющая заказала — проблема решена.', author: 'Андрей С.', role: 'Жилец', date: '12 января 2026' },
      { rating: 5, district: 'Бибирево', text: 'Мыши в гараже. Поймали всех за неделю.', author: 'Михаил Л.', role: 'Владелец гаража', date: '8 января 2026' }
    ],
    stats: { objectsCount: 178, avgArrival: '35 мин', rating: 4.9 }
  },

  // ВАО
  {
    districtCode: 'vao',
    serviceType: 'deratizaciya',
    slug: 'deratizaciya-vao',
    seo: {
      title: 'Дератизация в ВАО Москвы – уничтожение крыс и мышей | от 3000₽',
      description: 'Дератизация в Восточном округе: Сокольники, Измайлово, Перово. Гарантия.',
      h1: 'Дератизация в ВАО Москвы – уничтожение грызунов',
      keywords: ['дератизация вао', 'крысы сокольники', 'мыши измайлово']
    },
    hero: {
      subtitle: 'ВАО: Сокольники, Измайлово, Перово. Парковые зоны и промышленные объекты.',
      usps: baseHeroUsps
    },
    breadcrumbs: [
      { text: 'Главная', url: '/' },
      { text: 'Дератизация', url: '/uslugi/deratizaciya' },
      { text: 'ВАО', url: '/uslugi/deratizaciya-vao' }
    ],
    districtInfo: moscowDistricts.vao,
    specifics: [
      { icon: '🌲', title: 'Парки', description: 'Рядом с Сокольниками — мыши из леса.' },
      { icon: '🏭', title: 'Промзоны', description: 'Склады и производства — крысы.' },
      { icon: '🏠', title: 'Старый фонд', description: 'Панельки 70-х — мыши в перекрытиях.' },
      { icon: '🛍️', title: 'Торговля', description: 'Рынки и склады — регулярная обработка.' },
      { icon: '🚇', title: 'Транспорт', description: 'Развитая сеть — быстрый выезд.' },
      { icon: '📋', title: 'Документация', description: 'Все документы для проверок.' }
    ],
    pricing: deratizaciyaPricing,
    cases: [
      { type: 'Склад', title: 'Склад в Перово', area: '1500 м²', task: 'Крысы на продуктовом складе', solution: 'Комплексная дератизация + договор.', date: 'Январь 2026' },
      { type: 'Жильё', title: 'Квартира в Измайлово', area: '55 м²', task: 'Мыши от парка', solution: 'Отлов + герметизация. Гарантия.', date: 'Декабрь 2025' }
    ],
    reviews: [
      { rating: 5, district: 'Сокольники', text: 'Мыши от парка — постоянная проблема. Поставили защиту!', author: 'Виктор Н.', role: 'Житель', date: '14 января 2026' },
      { rating: 5, district: 'Измайлово', text: 'Крысы в подвале дачи. Справились за 2 визита.', author: 'Татьяна С.', role: 'Дачница', date: '10 января 2026' },
      { rating: 5, district: 'Перово', text: 'Склад с продуктами — крысы недопустимы. Теперь чисто!', author: 'Олег М.', role: 'Управляющий складом', date: '5 января 2026' }
    ],
    stats: { objectsCount: 145, avgArrival: '40 мин', rating: 4.8 }
  },

  // ЮВАО
  {
    districtCode: 'uvao',
    serviceType: 'deratizaciya',
    slug: 'deratizaciya-uvao',
    seo: {
      title: 'Дератизация в ЮВАО Москвы – уничтожение мышей и крыс | от 3000₽',
      description: 'Дератизация в Юго-Восточном округе: Марьино, Люблино, Кузьминки. Выезд за 45 минут.',
      h1: 'Дератизация в ЮВАО Москвы – уничтожение грызунов',
      keywords: ['дератизация ювао', 'мыши марьино', 'крысы люблино']
    },
    hero: {
      subtitle: 'ЮВАО: Марьино, Люблино, Печатники. Промзоны и жилые массивы.',
      usps: baseHeroUsps
    },
    breadcrumbs: [
      { text: 'Главная', url: '/' },
      { text: 'Дератизация', url: '/uslugi/deratizaciya' },
      { text: 'ЮВАО', url: '/uslugi/deratizaciya-uvao' }
    ],
    districtInfo: moscowDistricts.uvao,
    specifics: [
      { icon: '🏭', title: 'Промышленность', description: 'Капотня, Печатники — производства и склады.' },
      { icon: '🌊', title: 'Москва-река', description: 'Водоёмы — крысы в прибрежной зоне.' },
      { icon: '🏗️', title: 'Новостройки', description: 'Некрасовка — мыши во время стройки.' },
      { icon: '🏠', title: 'Жильё', description: 'Люблино, Кузьминки — панельные дома.' },
      { icon: '🛒', title: 'Склады', description: 'Логистические центры — регулярная обработка.' },
      { icon: '🌳', title: 'Парки', description: 'Кузьминский парк — грызуны с природы.' }
    ],
    pricing: deratizaciyaPricing,
    cases: [
      { type: 'Производство', title: 'Цех в Печатниках', area: '2000 м²', task: 'Крысы на производстве', solution: 'Комплексная дератизация. Договор на год.', date: 'Январь 2026' },
      { type: 'Новостройка', title: 'ЖК в Некрасовке', area: '12 этажей', task: 'Мыши в подвале нового дома', solution: 'Отлов + герметизация коммуникаций.', date: 'Декабрь 2025' }
    ],
    reviews: [
      { rating: 5, district: 'Марьино', text: 'Мыши в новой квартире! Оказывается, пришли со стройки. Вывели!', author: 'Екатерина С.', role: 'Новосёл', date: '15 января 2026' },
      { rating: 5, district: 'Люблино', text: 'Крысы в подвале — страшно детям. Теперь всё чисто.', author: 'Николай В.', role: 'Отец семейства', date: '10 января 2026' },
      { rating: 5, district: 'Кузьминки', text: 'Мыши от парка приходили. Поставили барьер — не пробраться.', author: 'Анна М.', role: 'Жительница', date: '6 января 2026' }
    ],
    stats: { objectsCount: 123, avgArrival: '45 мин', rating: 4.8 }
  },

  // ЮАО
  {
    districtCode: 'uao',
    serviceType: 'deratizaciya',
    slug: 'deratizaciya-uao',
    seo: {
      title: 'Дератизация в ЮАО Москвы – уничтожение крыс и мышей | от 3000₽',
      description: 'Дератизация в Южном округе: Чертаново, Царицыно, Бирюлёво. Гарантия результата.',
      h1: 'Дератизация в ЮАО Москвы – уничтожение грызунов',
      keywords: ['дератизация юао', 'крысы чертаново', 'мыши царицыно']
    },
    hero: {
      subtitle: 'ЮАО: Чертаново, Царицыно, Братеево. Парковые зоны и жилые массивы.',
      usps: baseHeroUsps
    },
    breadcrumbs: [
      { text: 'Главная', url: '/' },
      { text: 'Дератизация', url: '/uslugi/deratizaciya' },
      { text: 'ЮАО', url: '/uslugi/deratizaciya-uao' }
    ],
    districtInfo: moscowDistricts.uao,
    specifics: [
      { icon: '🏰', title: 'Царицыно', description: 'Парк рядом — мыши проникают в дома.' },
      { icon: '🏠', title: 'Спальные районы', description: 'Чертаново — крупнейший массив.' },
      { icon: '🌳', title: 'Коломенское', description: 'Природа — источник грызунов.' },
      { icon: '🚇', title: 'Метро', description: 'Быстрый выезд по всему округу.' },
      { icon: '🏗️', title: 'Новостройки', description: 'Братеево — активная застройка.' },
      { icon: '💼', title: 'Бизнес', description: 'Офисы и склады вдоль Варшавки.' }
    ],
    pricing: deratizaciyaPricing,
    cases: [
      { type: 'Частный дом', title: 'Дом в Царицыно', area: '200 м²', task: 'Мыши от парка', solution: 'Отлов + защита периметра участка.', date: 'Январь 2026' },
      { type: 'Офис', title: 'БЦ на Варшавке', area: '300 м²', task: 'Мыши в архиве', solution: 'Ловушки + ультразвук. Гарантия 1 год.', date: 'Декабрь 2025' }
    ],
    reviews: [
      { rating: 5, district: 'Чертаново', text: 'Мыши на первом этаже — классика. Решили проблему навсегда!', author: 'Светлана Н.', role: 'Жительница', date: '14 января 2026' },
      { rating: 5, district: 'Царицыно', text: 'Рядом с парком — мыши гости постоянные. Теперь нет!', author: 'Игорь К.', role: 'Владелец дома', date: '10 января 2026' },
      { rating: 5, district: 'Бирюлёво', text: 'Крысы в подвале гаража. Отловили за неделю.', author: 'Пётр М.', role: 'Автолюбитель', date: '5 января 2026' }
    ],
    stats: { objectsCount: 167, avgArrival: '40 мин', rating: 4.9 }
  },

  // ЮЗАО
  {
    districtCode: 'uzao',
    serviceType: 'deratizaciya',
    slug: 'deratizaciya-uzao',
    seo: {
      title: 'Дератизация в ЮЗАО Москвы – уничтожение мышей | от 3000₽',
      description: 'Дератизация в Юго-Западном округе: Черёмушки, Ясенево, Бутово. Выезд за 35 минут.',
      h1: 'Дератизация в ЮЗАО Москвы – уничтожение грызунов',
      keywords: ['дератизация юзао', 'мыши ясенево', 'крысы бутово']
    },
    hero: {
      subtitle: 'ЮЗАО: Черёмушки, Ясенево, Бутово. Престижные районы с высокими стандартами.',
      usps: baseHeroUsps
    },
    breadcrumbs: [
      { text: 'Главная', url: '/' },
      { text: 'Дератизация', url: '/uslugi/deratizaciya' },
      { text: 'ЮЗАО', url: '/uslugi/deratizaciya-uzao' }
    ],
    districtInfo: moscowDistricts.uzao,
    specifics: [
      { icon: '🎓', title: 'МГУ', description: 'Обслуживаем общежития и корпуса.' },
      { icon: '🏔️', title: 'Воробьёвы горы', description: 'Природа — источник грызунов.' },
      { icon: '🌳', title: 'Битцевский лес', description: 'Мыши из леса в частные дома.' },
      { icon: '🏠', title: 'Коттеджи', description: 'Бутово — частный сектор.' },
      { icon: '💎', title: 'Элитное жильё', description: 'Дискретность и качество.' },
      { icon: '🛡️', title: 'Барьерная защита', description: 'Предотвращаем повторное появление.' }
    ],
    pricing: deratizaciyaPricing,
    cases: [
      { type: 'Коттедж', title: 'Дом в Бутово', area: '350 м²', task: 'Мыши из леса', solution: 'Защита периметра + отлов внутри.', date: 'Январь 2026' },
      { type: 'Общежитие', title: 'Общежитие МГУ', area: '1200 м²', task: 'Профилактика', solution: 'Плановая обработка. Документы для СЭС.', date: 'Август 2025' }
    ],
    reviews: [
      { rating: 5, district: 'Ясенево', text: 'Элитный дом, а мыши! Справились дискретно и быстро.', author: 'Александр В.', role: 'Житель ЖК', date: '15 января 2026' },
      { rating: 5, district: 'Черёмушки', text: 'Крысы в старом доме. Вывели за 2 визита.', author: 'Наталья К.', role: 'Хозяйка квартиры', date: '11 января 2026' },
      { rating: 5, district: 'Бутово', text: 'Мыши в коттедже от леса. Теперь защита стоит — не пролезут.', author: 'Пётр М.', role: 'Владелец дома', date: '7 января 2026' }
    ],
    stats: { objectsCount: 134, avgArrival: '35 мин', rating: 4.9 }
  },

  // ЗАО
  {
    districtCode: 'zao',
    serviceType: 'deratizaciya',
    slug: 'deratizaciya-zao',
    seo: {
      title: 'Дератизация в ЗАО Москвы – уничтожение крыс и мышей | от 3000₽',
      description: 'Дератизация в Западном округе: Кунцево, Крылатское, Солнцево. Гарантия.',
      h1: 'Дератизация в ЗАО Москвы – уничтожение грызунов',
      keywords: ['дератизация зао', 'крысы кунцево', 'мыши крылатское']
    },
    hero: {
      subtitle: 'ЗАО: Кунцево, Крылатское, Солнцево. Комфортные районы и бизнес-центры.',
      usps: baseHeroUsps
    },
    breadcrumbs: [
      { text: 'Главная', url: '/' },
      { text: 'Дератизация', url: '/uslugi/deratizaciya' },
      { text: 'ЗАО', url: '/uslugi/deratizaciya-zao' }
    ],
    districtInfo: moscowDistricts.zao,
    specifics: [
      { icon: '🏙️', title: 'Москва-Сити', description: 'Грызуны в технических помещениях небоскрёбов.' },
      { icon: '🌳', title: 'Крылатские холмы', description: 'Природа — мыши проникают в дома.' },
      { icon: '🏠', title: 'Комфорт-класс', description: 'Качественные ЖК — высокие требования.' },
      { icon: '✈️', title: 'Внуково', description: 'Частный сектор у аэропорта.' },
      { icon: '💼', title: 'Бизнес-парки', description: 'Офисы вдоль Кутузовского.' },
      { icon: '📋', title: 'Документы', description: 'Акты для Роспотребнадзора.' }
    ],
    pricing: deratizaciyaPricing,
    cases: [
      { type: 'Офис', title: 'БЦ у Москва-Сити', area: '500 м²', task: 'Мыши в серверной', solution: 'Отлов + герметизация. Ультразвук.', date: 'Январь 2026' },
      { type: 'Коттедж', title: 'Дом в Крылатском', area: '280 м²', task: 'Мыши от холмов', solution: 'Барьерная защита участка.', date: 'Декабрь 2025' }
    ],
    reviews: [
      { rating: 5, district: 'Крылатское', text: 'Элитный район, а мыши от природы. Защитили дом!', author: 'Владимир С.', role: 'Владелец коттеджа', date: '14 января 2026' },
      { rating: 5, district: 'Кунцево', text: 'Крысы в подвале офиса. Решили за неделю.', author: 'Анастасия Р.', role: 'Офис-менеджер', date: '10 января 2026' },
      { rating: 5, district: 'Солнцево', text: 'Мыши в новостройке. Оказывается, норма! Вывели.', author: 'Дмитрий Л.', role: 'Новосёл', date: '5 января 2026' }
    ],
    stats: { objectsCount: 112, avgArrival: '35 мин', rating: 4.8 }
  },

  // СЗАО
  {
    districtCode: 'szao',
    serviceType: 'deratizaciya',
    slug: 'deratizaciya-szao',
    seo: {
      title: 'Дератизация в СЗАО Москвы – уничтожение мышей и крыс | от 3000₽',
      description: 'Дератизация в Северо-Западном округе: Митино, Строгино, Тушино. Выезд за 40 минут.',
      h1: 'Дератизация в СЗАО Москвы – уничтожение грызунов',
      keywords: ['дератизация сзао', 'мыши митино', 'крысы строгино']
    },
    hero: {
      subtitle: 'СЗАО: Митино, Строгино, Тушино. Экологичные районы у воды и леса.',
      usps: baseHeroUsps
    },
    breadcrumbs: [
      { text: 'Главная', url: '/' },
      { text: 'Дератизация', url: '/uslugi/deratizaciya' },
      { text: 'СЗАО', url: '/uslugi/deratizaciya-szao' }
    ],
    districtInfo: moscowDistricts.szao,
    specifics: [
      { icon: '🌲', title: 'Серебряный бор', description: 'Природа — грызуны проникают в дома.' },
      { icon: '🌊', title: 'Строгинская пойма', description: 'Водоёмы — крысы у воды.' },
      { icon: '🏠', title: 'Новые ЖК', description: 'Митино — мыши во время стройки.' },
      { icon: '🏗️', title: 'Куркино', description: 'Активная застройка — профилактика.' },
      { icon: '👨‍👩‍👧', title: 'Семьи', description: 'Безопасные методы для детей.' },
      { icon: '🛡️', title: 'Защита', description: 'Барьерные системы по периметру.' }
    ],
    pricing: deratizaciyaPricing,
    cases: [
      { type: 'Квартира', title: 'Квартира в Митино', area: '70 м²', task: 'Мыши от соседей', solution: 'Отлов + герметизация входов. Гарантия.', date: 'Январь 2026' },
      { type: 'Дача', title: 'Участок у Серебряного бора', area: '15 соток', task: 'Мыши из леса', solution: 'Защита периметра + отлов на участке.', date: 'Декабрь 2025' }
    ],
    reviews: [
      { rating: 5, district: 'Митино', text: 'Новостройка, а мыши уже есть! Вывели быстро.', author: 'Елена С.', role: 'Жительница ЖК', date: '15 января 2026' },
      { rating: 5, district: 'Строгино', text: 'Крысы от воды — проблема района. Решили!', author: 'Максим К.', role: 'Житель', date: '11 января 2026' },
      { rating: 5, district: 'Куркино', text: 'Мыши в коттедже. Поставили защиту — не пролезают.', author: 'Ольга Н.', role: 'Хозяйка дома', date: '6 января 2026' }
    ],
    stats: { objectsCount: 98, avgArrival: '40 мин', rating: 4.9 }
  }
];
