/**
 * Семантическое ядро сайта.
 * Таблица соответствий "1 поисковый запрос = 1 каноническая страница".
 *
 * Цели:
 * - Предотвращение каннибализации (2+ страницы на один запрос)
 * - Генерация корректных <title>, <h1> и canonical
 * - Валидация: скрипт проверяет отсутствие дублей
 *
 * Интеграция с SEOHead/StructuredData — Day 6.
 */

export type SemanticIntent = 'commercial' | 'informational' | 'navigational';
export type SemanticCluster = 'service' | 'pest' | 'object' | 'district' | 'nch' | 'blog';

export interface SemanticEntry {
  query: string;           // целевой запрос (lowercase)
  canonical: string;       // каноническая страница (путь с trailing slash)
  intent: SemanticIntent;
  cluster: SemanticCluster;
  priority: 1 | 2 | 3 | 4 | 5; // 1 = самый важный
}

// ===================== КЛАСТЕР: service (6 записей) =====================

const serviceEntries: SemanticEntry[] = [
  { query: 'дезинфекция москва', canonical: '/uslugi/dezinfekciya/', intent: 'commercial', cluster: 'service', priority: 1 },
  { query: 'дезинсекция москва', canonical: '/uslugi/dezinsekciya/', intent: 'commercial', cluster: 'service', priority: 1 },
  { query: 'дератизация москва', canonical: '/uslugi/deratizaciya/', intent: 'commercial', cluster: 'service', priority: 1 },
  { query: 'озонирование помещений москва', canonical: '/uslugi/ozonirovanie/', intent: 'commercial', cluster: 'service', priority: 2 },
  { query: 'дезодорация помещений москва', canonical: '/uslugi/dezodoraciya/', intent: 'commercial', cluster: 'service', priority: 2 },
  { query: 'демеркуризация москва', canonical: '/uslugi/demerkurizaciya/', intent: 'commercial', cluster: 'service', priority: 3 },
  { query: 'борьба с кротами москва', canonical: '/uslugi/borba-s-krotami/', intent: 'commercial', cluster: 'service', priority: 2 },
  { query: 'уничтожение кротов на участке москва', canonical: '/uslugi/borba-s-krotami/', intent: 'commercial', cluster: 'service', priority: 2 },
];

// ===================== КЛАСТЕР: pest (7 записей) =====================

const pestEntries: SemanticEntry[] = [
  { query: 'уничтожение тараканов москва', canonical: '/uslugi/dezinsekciya/tarakany/', intent: 'commercial', cluster: 'pest', priority: 1 },
  { query: 'уничтожение клопов москва', canonical: '/uslugi/dezinsekciya/klopy/', intent: 'commercial', cluster: 'pest', priority: 1 },
  { query: 'уничтожение муравьёв москва', canonical: '/uslugi/dezinsekciya/muravyi/', intent: 'commercial', cluster: 'pest', priority: 2 },
  { query: 'уничтожение блох москва', canonical: '/uslugi/dezinsekciya/blohi/', intent: 'commercial', cluster: 'pest', priority: 2 },
  { query: 'уничтожение моли москва', canonical: '/uslugi/dezinsekciya/mol/', intent: 'commercial', cluster: 'pest', priority: 3 },
  { query: 'уничтожение крыс москва', canonical: '/uslugi/deratizaciya/krysy/', intent: 'commercial', cluster: 'pest', priority: 1 },
  { query: 'уничтожение мышей москва', canonical: '/uslugi/deratizaciya/myshi/', intent: 'commercial', cluster: 'pest', priority: 2 },
  { query: 'уничтожение кротов москва', canonical: '/uslugi/deratizaciya/kroty/', intent: 'commercial', cluster: 'pest', priority: 2 },
  { query: 'борьба с кротами на участке москва', canonical: '/uslugi/deratizaciya/kroty/', intent: 'commercial', cluster: 'pest', priority: 3 },
  { query: 'кроты на даче как избавиться', canonical: '/uslugi/deratizaciya/kroty/', intent: 'commercial', cluster: 'pest', priority: 3 },
  { query: 'кроты на газоне как вывести', canonical: '/uslugi/deratizaciya/kroty/', intent: 'commercial', cluster: 'pest', priority: 4 },
  { query: 'кроты в коттеджном посёлке', canonical: '/uslugi/deratizaciya/kroty/', intent: 'commercial', cluster: 'pest', priority: 4 },
  { query: 'кроты на огороде уничтожение', canonical: '/uslugi/deratizaciya/kroty/', intent: 'commercial', cluster: 'pest', priority: 4 },
  { query: 'кроты на участке профессиональная обработка', canonical: '/uslugi/deratizaciya/kroty/', intent: 'commercial', cluster: 'pest', priority: 4 },
];

// ===================== КЛАСТЕР: blog-geo-mole (18 записей) =====================

const moleGeoBlogEntries: SemanticEntry[] = [
  // Новорижское шоссе
  { query: 'кроты новорижское шоссе', canonical: '/blog/kroty-novorizhskoe-shosse/', intent: 'informational', cluster: 'blog', priority: 3 },
  { query: 'кроты истра участок', canonical: '/blog/kroty-istra/', intent: 'informational', cluster: 'blog', priority: 4 },
  { query: 'кроты красногорск', canonical: '/blog/kroty-krasnogorsk/', intent: 'informational', cluster: 'blog', priority: 4 },
  { query: 'кроты нахабино дача', canonical: '/blog/kroty-nakhabino/', intent: 'informational', cluster: 'blog', priority: 4 },
  { query: 'кроты дедовск участок', canonical: '/blog/kroty-dedovsk/', intent: 'informational', cluster: 'blog', priority: 5 },
  { query: 'кроты снт новая рига', canonical: '/blog/kroty-snt-novaya-riga/', intent: 'informational', cluster: 'blog', priority: 4 },
  // Рублёвское шоссе
  { query: 'кроты рублёвское шоссе', canonical: '/blog/kroty-rublevskoe-shosse/', intent: 'informational', cluster: 'blog', priority: 3 },
  { query: 'кроты одинцово участок', canonical: '/blog/kroty-odintsovo/', intent: 'informational', cluster: 'blog', priority: 4 },
  { query: 'кроты барвиха', canonical: '/blog/kroty-barvikha/', intent: 'informational', cluster: 'blog', priority: 4 },
  { query: 'кроты усово участок', canonical: '/blog/kroty-usovo/', intent: 'informational', cluster: 'blog', priority: 5 },
  { query: 'кроты жуковка', canonical: '/blog/kroty-zhukovka/', intent: 'informational', cluster: 'blog', priority: 5 },
  { query: 'кроты снт рублёвка', canonical: '/blog/kroty-snt-rublevka/', intent: 'informational', cluster: 'blog', priority: 4 },
  // Дмитровское шоссе
  { query: 'кроты дмитровское шоссе', canonical: '/blog/kroty-dmitrovskoe-shosse/', intent: 'informational', cluster: 'blog', priority: 3 },
  { query: 'кроты долгопрудный', canonical: '/blog/kroty-dolgoprudny/', intent: 'informational', cluster: 'blog', priority: 4 },
  { query: 'кроты лобня участок', canonical: '/blog/kroty-lobnya/', intent: 'informational', cluster: 'blog', priority: 4 },
  { query: 'кроты дмитров дача', canonical: '/blog/kroty-dmitrov/', intent: 'informational', cluster: 'blog', priority: 4 },
  { query: 'кроты яхрома участок', canonical: '/blog/kroty-yakhroma/', intent: 'informational', cluster: 'blog', priority: 5 },
  { query: 'кроты снт дмитровка', canonical: '/blog/kroty-snt-dmitrovka/', intent: 'informational', cluster: 'blog', priority: 4 },
];

// ===================== КЛАСТЕР: object (24 записи = 4 услуги × 6 объектов) =====================

const services4 = ['dezinsekciya', 'dezinfekciya', 'deratizaciya', 'ozonirovanie', 'demerkurizaciya'] as const;
const serviceNamesGen: Record<string, string> = {
  dezinsekciya: 'дезинсекция',
  dezinfekciya: 'дезинфекция',
  deratizaciya: 'дератизация',
  ozonirovanie: 'озонирование',
  demerkurizaciya: 'демеркуризация',
};
const objects = [
  { slug: 'kvartir', query: 'квартиры' },
  { slug: 'domov', query: 'дома' },
  { slug: 'ofisov', query: 'офиса' },
  { slug: 'restoranov', query: 'ресторана' },
  { slug: 'skladov', query: 'склада' },
  { slug: 'proizvodstv', query: 'производства' },
] as const;

const objectEntries: SemanticEntry[] = services4.flatMap(svc =>
  objects.map(obj => ({
    query: `${serviceNamesGen[svc]} ${obj.query}`,
    canonical: `/uslugi/${svc}/${obj.slug}/`,
    intent: 'commercial' as const,
    cluster: 'object' as const,
    priority: (obj.slug === 'kvartir' || obj.slug === 'ofisov' ? 2 : 3) as 1 | 2 | 3 | 4 | 5,
  }))
);

// ===================== КЛАСТЕР: district (12 записей — по округам) =====================

const districtIds = ['cao', 'sao', 'svao', 'vao', 'yuvao', 'yao', 'yzao', 'zao', 'szao', 'nao', 'tao', 'zelao'];
const districtNames: Record<string, string> = {
  cao: 'цао', sao: 'сао', svao: 'свао', vao: 'вао', yuvao: 'ювао',
  yao: 'юао', yzao: 'юзао', zao: 'зао', szao: 'сзао', nao: 'нао', tao: 'тао', zelao: 'зеленоград',
};

const districtEntries: SemanticEntry[] = districtIds.map(id => ({
  query: `дезинфекция ${districtNames[id]}`,
  canonical: `/uslugi/dezinfekciya-${id}/`,
  intent: 'commercial' as const,
  cluster: 'district' as const,
  priority: (id === 'cao' || id === 'sao' || id === 'vao' || id === 'yao' ? 2 : 3) as 1 | 2 | 3 | 4 | 5,
}));

// ===================== КЛАСТЕР: nch (расширенный — 14 вредителей × 131 район, тиерированный) =====================

const pestNamesGen: Record<string, string> = {
  tarakany: 'тараканов', klopy: 'клопов', muravyi: 'муравьёв',
  blohi: 'блох', mol: 'моли', krysy: 'крыс', myshi: 'мышей', kroty: 'кротов',
  komary: 'комаров', muhi: 'мух', 'osy-shershni': 'ос и шершней',
  cheshuynitsy: 'чешуйниц', kleshchi: 'клещей', mokricy: 'мокриц',
};
const pestServiceMap: Record<string, string> = {
  tarakany: 'dezinsekciya', klopy: 'dezinsekciya', muravyi: 'dezinsekciya',
  blohi: 'dezinsekciya', mol: 'dezinsekciya', krysy: 'deratizaciya', myshi: 'deratizaciya', kroty: 'deratizaciya',
  komary: 'dezinsekciya', muhi: 'dezinsekciya', 'osy-shershni': 'dezinsekciya',
  cheshuynitsy: 'dezinsekciya', kleshchi: 'dezinsekciya', mokricy: 'dezinsekciya',
};

// Тиерирование: 3 уровня покрытия
const tier1Pests = ['tarakany', 'klopy', 'krysy', 'myshi']; // × все 131 район
const tier2Pests = ['muravyi', 'blohi', 'mol', 'kroty']; // × топ-40 районов
const tier3Pests = ['komary', 'muhi', 'osy-shershni', 'cheshuynitsy', 'kleshchi', 'mokricy']; // × топ-15 районов

const topPestSlugs = tier1Pests;
const allPestSlugs = Object.keys(pestNamesGen);

// Топ-40 районов (расширенный список для tier 2)
const tier2Neighborhoods = [
  ...topNeighborhoods,
  'basmannyy', 'tagansky', 'yakimanka', 'voykovskiy', 'koptevo',
  'khovrino', 'otradnoe', 'bibirevo', 'altufyevsky', 'perovo',
  'novogireevo', 'kuzminki', 'pechatniki', 'tekstilshchiki', 'danilovsky',
  'zyablikovo', 'tsaritsyno', 'akademichesky', 'cheryomushki', 'yasenevo',
  'kuntsevo', 'solntsevo', 'mitino', 'kurkino', 'nekrasovka',
];

// Генерация NCH записей по тиерам
function generateNchEntries(): SemanticEntry[] {
  const entries: SemanticEntry[] = [];
  const allNeighborhoods = Object.keys(neighborhoodNamesRu);

  // Tier 1: топ-4 вредителя × все районы с именами
  tier1Pests.forEach(pest => {
    allNeighborhoods.forEach(nhood => {
      entries.push({
        query: `уничтожение ${pestNamesGen[pest]} ${neighborhoodNamesRu[nhood]}`,
        canonical: `/uslugi/${pestServiceMap[pest]}/${pest}/${nhood}/`,
        intent: 'commercial', cluster: 'nch', priority: 3,
      });
    });
  });

  // Tier 2: следующие 4 вредителя × топ-40 районов
  tier2Pests.forEach(pest => {
    tier2Neighborhoods.forEach(nhood => {
      if (neighborhoodNamesRu[nhood]) {
        entries.push({
          query: `уничтожение ${pestNamesGen[pest]} ${neighborhoodNamesRu[nhood]}`,
          canonical: `/uslugi/${pestServiceMap[pest]}/${pest}/${nhood}/`,
          intent: 'commercial', cluster: 'nch', priority: 4,
        });
      }
    });
  });

  // Tier 3: оставшиеся 6 вредителей × топ-15 районов
  tier3Pests.forEach(pest => {
    topNeighborhoods.forEach(nhood => {
      entries.push({
        query: `уничтожение ${pestNamesGen[pest]} ${neighborhoodNamesRu[nhood]}`,
        canonical: `/uslugi/${pestServiceMap[pest]}/${pest}/${nhood}/`,
        intent: 'commercial', cluster: 'nch', priority: 5,
      });
    });
  });

  return entries;
}

const nchEntries = generateNchEntries();

// ===================== КЛАСТЕР: pest+object (48 записей = 8 вредителей × 6 объектов) =====================

const pestObjectPairs = [
  { pest: 'tarakany', objects: ['квартире', 'доме', 'офисе', 'ресторане', 'складе', 'общежитии'] },
  { pest: 'klopy', objects: ['квартире', 'доме', 'хостеле', 'гостинице', 'общежитии', 'офисе'] },
  { pest: 'muravyi', objects: ['квартире', 'доме', 'на участке', 'офисе', 'ресторане', 'складе'] },
  { pest: 'blohi', objects: ['квартире', 'доме', 'подвале', 'офисе', 'на участке', 'общежитии'] },
  { pest: 'krysy', objects: ['подвале', 'доме', 'на складе', 'ресторане', 'подъезде', 'офисе'] },
  { pest: 'myshi', objects: ['доме', 'квартире', 'на даче', 'складе', 'офисе', 'подвале'] },
  { pest: 'mol', objects: ['квартире', 'на складе', 'в гардеробной', 'офисе', 'доме', 'магазине'] },
  { pest: 'kroty', objects: ['на участке', 'на даче', 'на газоне', 'в саду', 'в огороде', 'в коттеджном посёлке'] },
];

const pestObjectEntries: SemanticEntry[] = pestObjectPairs.flatMap(pair =>
  pair.objects.map(obj => ({
    query: `уничтожение ${pestNamesGen[pair.pest]} в ${obj}`,
    canonical: `/uslugi/${pestServiceMap[pair.pest]}/${pair.pest}/`,
    intent: 'commercial' as const,
    cluster: 'pest' as const,
    priority: 3 as 1 | 2 | 3 | 4 | 5,
  }))
);

// ===================== КЛАСТЕР: seasonal (сезонные — участки) =====================

const seasonalEntries: SemanticEntry[] = [
  { query: 'обработка участка от клещей москва', canonical: '/uslugi/obrabotka-uchastkov/', intent: 'commercial', cluster: 'service', priority: 2 },
  { query: 'обработка от клещей на даче', canonical: '/uslugi/obrabotka-uchastkov/', intent: 'commercial', cluster: 'service', priority: 2 },
  { query: 'обработка газона от клещей', canonical: '/uslugi/dezinsekciya/kleshchi/', intent: 'commercial', cluster: 'pest', priority: 3 },
  { query: 'уничтожение ос на участке москва', canonical: '/uslugi/dezinsekciya/osy-shershni/', intent: 'commercial', cluster: 'pest', priority: 2 },
  { query: 'удаление осиного гнезда москва', canonical: '/uslugi/dezinsekciya/osy-shershni/', intent: 'commercial', cluster: 'pest', priority: 2 },
  { query: 'обработка от комаров участка', canonical: '/uslugi/dezinsekciya/komary/', intent: 'commercial', cluster: 'pest', priority: 3 },
  { query: 'дезинсекция от мух в ресторане', canonical: '/uslugi/dezinsekciya/muhi/', intent: 'commercial', cluster: 'pest', priority: 3 },
  { query: 'чешуйницы в ванной как избавиться', canonical: '/uslugi/dezinsekciya/cheshuynitsy/', intent: 'commercial', cluster: 'pest', priority: 4 },
  { query: 'мокрицы в квартире уничтожение', canonical: '/uslugi/dezinsekciya/mokricy/', intent: 'commercial', cluster: 'pest', priority: 4 },
];

// ===================== КЛАСТЕР: MO city + pest (56 записей = 4 вредителя × 14 городов) =====================

const moPestEntries: SemanticEntry[] = moCities.flatMap(city =>
  tier1Pests.map(pest => ({
    query: `уничтожение ${pestNamesGen[pest]} ${city.name}`,
    canonical: `/moscow-oblast/${city.slug}/dezinsekciya/`,
    intent: 'commercial' as const,
    cluster: 'nch' as const,
    priority: 4 as 1 | 2 | 3 | 4 | 5,
  }))
);

// ===================== КЛАСТЕР: blog (20 ключевых запросов) =====================

const blogEntries: SemanticEntry[] = [
  { query: 'как подготовить помещение к дезинфекции', canonical: '/blog/kak-podgotovit-pomeshchenie/', intent: 'informational', cluster: 'blog', priority: 2 },
  { query: 'виды дезинфекции помещений', canonical: '/blog/vidy-dezinfekcii/', intent: 'informational', cluster: 'blog', priority: 2 },
  { query: 'борьба с тараканами в квартире', canonical: '/blog/borba-s-tarakanami/', intent: 'informational', cluster: 'blog', priority: 2 },
  { query: 'озонирование помещений что это', canonical: '/blog/ozonirovaniye-pomeshcheniy/', intent: 'informational', cluster: 'blog', priority: 3 },
  { query: 'грызуны в доме как избавиться', canonical: '/blog/gryzuny-v-dome/', intent: 'informational', cluster: 'blog', priority: 2 },
  { query: 'сезонность вредителей', canonical: '/blog/sezonnost-vreditelej/', intent: 'informational', cluster: 'blog', priority: 3 },
  { query: 'дезинфекция офиса после ковида', canonical: '/blog/dezinfekciya-ofisa/', intent: 'informational', cluster: 'blog', priority: 3 },
  { query: 'клопы в квартире откуда берутся', canonical: '/blog/klopy-v-kvartire/', intent: 'informational', cluster: 'blog', priority: 2 },
  { query: 'как избавиться от тараканов навсегда', canonical: '/blog/kak-izbavitsya-ot-tarakanov/', intent: 'informational', cluster: 'blog', priority: 1 },
  { query: 'как избавиться от клопов навсегда', canonical: '/blog/kak-izbavitsya-ot-klopov/', intent: 'informational', cluster: 'blog', priority: 1 },
  { query: 'как избавиться от мышей в доме', canonical: '/blog/kak-izbavitsya-ot-myshej/', intent: 'informational', cluster: 'blog', priority: 2 },
  { query: 'как избавиться от крыс в доме', canonical: '/blog/kak-izbavitsya-ot-krys/', intent: 'informational', cluster: 'blog', priority: 2 },
  { query: 'как избавиться от муравьёв в квартире', canonical: '/blog/kak-izbavitsya-ot-muravyev/', intent: 'informational', cluster: 'blog', priority: 2 },
  { query: 'как избавиться от блох в квартире', canonical: '/blog/kak-izbavitsya-ot-bloh/', intent: 'informational', cluster: 'blog', priority: 3 },
  { query: 'чёрная плесень чем опасна', canonical: '/blog/chernaya-plesen-chem-opasna/', intent: 'informational', cluster: 'blog', priority: 3 },
  { query: 'санпин дезинфекция 2026', canonical: '/blog/sanpin-2026-trebovaniya/', intent: 'informational', cluster: 'blog', priority: 3 },
  { query: 'документы для роспотребнадзора общепит', canonical: '/blog/dokumenty-dlya-obshchepita/', intent: 'informational', cluster: 'blog', priority: 3 },
  { query: 'штраф за вредителей в кафе', canonical: '/blog/shtraf-za-vrediteley/', intent: 'informational', cluster: 'blog', priority: 3 },
  { query: 'дезинсекция квартиры подробный гид', canonical: '/blog/dezinsekciya-kvartiry-gid/', intent: 'informational', cluster: 'blog', priority: 3 },
  { query: 'народные средства от тараканов эффективность', canonical: '/blog/narodnye-sredstva-tarakany/', intent: 'informational', cluster: 'blog', priority: 3 },
  // DIY-провалы
  { query: 'почему дихлофос не берет клопов', canonical: '/blog/pochemu-dihlofos-ne-beret-klopov/', intent: 'informational', cluster: 'blog', priority: 2 },
  { query: 'резистентность тараканов к борной кислоте', canonical: '/blog/rezistentnost-tarakanov-k-bornoj-kislote/', intent: 'informational', cluster: 'blog', priority: 3 },
  { query: 'ошибки самостоятельной обработки от тараканов', canonical: '/blog/oshibki-samodeyatelnoj-obrabotki/', intent: 'informational', cluster: 'blog', priority: 2 },
  { query: 'почему тараканы возвращаются после обработки', canonical: '/blog/pochemu-tarakany-vozvrashchayutsya-posle-obrabotki/', intent: 'informational', cluster: 'blog', priority: 2 },
  { query: 'аэрозоли от клопов не работают', canonical: '/blog/aerozoli-ot-klopov-ne-rabotayut/', intent: 'informational', cluster: 'blog', priority: 3 },
  // Микро-B2B
  { query: 'пест контроль пвз вайлдберриз', canonical: '/blog/pest-kontrol-pvz-marketplejs/', intent: 'informational', cluster: 'blog', priority: 3 },
  { query: 'санпин дезинфекция медицинских учреждений', canonical: '/blog/sanpin-dezinfekciya-kliniki/', intent: 'informational', cluster: 'blog', priority: 3 },
  { query: 'хассп аудит пекарня пест контроль', canonical: '/blog/haccp-audit-pekarnaya/', intent: 'informational', cluster: 'blog', priority: 3 },
  { query: 'обязанности ук дератизация подвалов', canonical: '/blog/obyazannosti-uk-deratizaciya-podvalov/', intent: 'informational', cluster: 'blog', priority: 3 },
  { query: 'куда жаловаться на крыс в подъезде', canonical: '/blog/kuda-zhalovatsya-na-krys-v-podezde/', intent: 'informational', cluster: 'blog', priority: 2 },
  // Безопасность
  { query: 'через сколько пускать кошку после тумана', canonical: '/blog/cherez-skolko-puskat-koshku-posle-tumana/', intent: 'informational', cluster: 'blog', priority: 2 },
  { query: 'горячий туман опасен для аквариума', canonical: '/blog/goryachij-tuman-i-akvarium/', intent: 'informational', cluster: 'blog', priority: 2 },
  { query: 'дезинсекция с грудным ребенком', canonical: '/blog/dezinsekciya-s-grudnym-rebenkom/', intent: 'informational', cluster: 'blog', priority: 2 },
  { query: 'обработка от вредителей при беременности', canonical: '/blog/bezopasnost-obrabotki-dlya-beremennyh/', intent: 'informational', cluster: 'blog', priority: 2 },
  { query: 'аллергия на препараты дезинсекции', canonical: '/blog/allergiya-na-preparaty-dezinsekcii/', intent: 'informational', cluster: 'blog', priority: 3 },
];

// ===================== КЛАСТЕР: moscow-region (40 записей = 10 городов × 4 услуги) =====================

const moServiceNames: Record<string, string> = {
  dezinsekciya: 'дезинсекция', dezinfekciya: 'дезинфекция',
  deratizaciya: 'дератизация', ozonirovanie: 'озонирование',
};
const moCities = [
  { slug: 'khimki', name: 'химки' }, { slug: 'mytishchi', name: 'мытищи' },
  { slug: 'balashikha', name: 'балашиха' }, { slug: 'krasnogorsk', name: 'красногорск' },
  { slug: 'podolsk', name: 'подольск' }, { slug: 'korolyov', name: 'королёв' },
  { slug: 'lyubertsy', name: 'люберцы' }, { slug: 'odintsovo', name: 'одинцово' },
  { slug: 'dolgoprudny', name: 'долгопрудный' }, { slug: 'shchyolkovo', name: 'щёлково' },
];
const moServices = ['dezinsekciya', 'dezinfekciya', 'deratizaciya', 'ozonirovanie'] as const;

const moscowRegionEntries: SemanticEntry[] = moCities.flatMap(city =>
  moServices.map(svc => ({
    query: `${moServiceNames[svc]} ${city.name}`,
    canonical: `/moscow-oblast/${city.slug}/${svc}/`,
    intent: 'commercial' as const,
    cluster: 'service' as const,
    priority: 3 as 1 | 2 | 3 | 4 | 5,
  }))
);

// ===================== ОБЪЕДИНЁННОЕ ЯДРО =====================

export const semanticCore: SemanticEntry[] = [
  ...serviceEntries,
  ...pestEntries,
  ...pestObjectEntries,
  ...seasonalEntries,
  ...objectEntries,
  ...districtEntries,
  ...nchEntries,
  ...blogEntries,
  ...moleGeoBlogEntries,
  ...moscowRegionEntries,
  ...moPestEntries,
];

// ===================== ФУНКЦИИ =====================

/**
 * Поиск канонической страницы по запросу.
 * Выполняет точное совпадение (lowercase).
 */
export function getCanonicalForQuery(query: string): SemanticEntry | undefined {
  const q = query.toLowerCase().trim();
  return semanticCore.find(e => e.query === q);
}

/**
 * Поиск записей по каноническому пути.
 */
export function getEntriesByCanonical(canonical: string): SemanticEntry[] {
  return semanticCore.filter(e => e.canonical === canonical);
}

/**
 * Получить записи по кластеру.
 */
export function getEntriesByCluster(cluster: SemanticCluster): SemanticEntry[] {
  return semanticCore.filter(e => e.cluster === cluster);
}

/**
 * Валидация: проверяет что один запрос не назначен 2+ страницам.
 * Возвращает массив конфликтов. Пустой = всё ок.
 */
export function validateNoDuplicates(): { query: string; canonicals: string[] }[] {
  const map = new Map<string, string[]>();

  for (const entry of semanticCore) {
    const existing = map.get(entry.query);
    if (existing) {
      existing.push(entry.canonical);
    } else {
      map.set(entry.query, [entry.canonical]);
    }
  }

  const conflicts: { query: string; canonicals: string[] }[] = [];
  for (const [query, canonicals] of map) {
    if (canonicals.length > 1) {
      conflicts.push({ query, canonicals });
    }
  }
  return conflicts;
}

/**
 * Статистика семантического ядра.
 */
export function getSemanticStats() {
  const byCluster: Record<SemanticCluster, number> = {
    service: 0, pest: 0, object: 0, district: 0, nch: 0, blog: 0,
  };
  const byPriority: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const byIntent: Record<SemanticIntent, number> = {
    commercial: 0, informational: 0, navigational: 0,
  };

  for (const e of semanticCore) {
    byCluster[e.cluster]++;
    byPriority[e.priority]++;
    byIntent[e.intent]++;
  }

  return {
    total: semanticCore.length,
    duplicates: validateNoDuplicates().length,
    byCluster,
    byPriority,
    byIntent,
  };
}
