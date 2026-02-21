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
  { query: 'уничтожение кротов новорижское шоссе', canonical: '/uslugi/deratizaciya/kroty/', intent: 'commercial', cluster: 'pest', priority: 3 },
  { query: 'уничтожение кротов рублёвское шоссе', canonical: '/uslugi/deratizaciya/kroty/', intent: 'commercial', cluster: 'pest', priority: 3 },
  { query: 'уничтожение кротов дмитровское шоссе', canonical: '/uslugi/deratizaciya/kroty/', intent: 'commercial', cluster: 'pest', priority: 3 },
  { query: 'кроты на газоне как вывести', canonical: '/uslugi/deratizaciya/kroty/', intent: 'commercial', cluster: 'pest', priority: 4 },
  { query: 'кроты в коттеджном посёлке', canonical: '/uslugi/deratizaciya/kroty/', intent: 'commercial', cluster: 'pest', priority: 4 },
  { query: 'кроты в снт борьба', canonical: '/uslugi/deratizaciya/kroty/', intent: 'commercial', cluster: 'pest', priority: 4 },
  { query: 'кроты на огороде уничтожение', canonical: '/uslugi/deratizaciya/kroty/', intent: 'commercial', cluster: 'pest', priority: 4 },
  { query: 'кроты на участке профессиональная обработка', canonical: '/uslugi/deratizaciya/kroty/', intent: 'commercial', cluster: 'pest', priority: 4 },
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

// ===================== КЛАСТЕР: nch (105 записей = 7 вредителей × 15 районов) =====================

const pestNamesGen: Record<string, string> = {
  tarakany: 'тараканов', klopy: 'клопов', muravyi: 'муравьёв',
  blohi: 'блох', mol: 'моли', krysy: 'крыс', myshi: 'мышей', kroty: 'кротов',
};
const pestServiceMap: Record<string, string> = {
  tarakany: 'dezinsekciya', klopy: 'dezinsekciya', muravyi: 'dezinsekciya',
  blohi: 'dezinsekciya', mol: 'dezinsekciya', krysy: 'deratizaciya', myshi: 'deratizaciya', kroty: 'deratizaciya',
};
const topNeighborhoods = [
  'arbat', 'tverskoy', 'khamovniki', 'zamoskvorechye', 'presnensky',
  'sokol', 'aeroport', 'babushkinsky', 'izmaylovo', 'sokolniki',
  'maryino', 'lyublino', 'chertanovo-severnoe', 'konkovo', 'strogino',
];
const neighborhoodNamesRu: Record<string, string> = {
  arbat: 'арбат', tverskoy: 'тверской', khamovniki: 'хамовники',
  zamoskvorechye: 'замоскворечье', presnensky: 'пресненский',
  sokol: 'сокол', aeroport: 'аэропорт', babushkinsky: 'бабушкинский',
  izmaylovo: 'измайлово', sokolniki: 'сокольники',
  maryino: 'марьино', lyublino: 'люблино',
  'chertanovo-severnoe': 'чертаново северное',
  konkovo: 'коньково', strogino: 'строгино',
};
const topPestSlugs = ['tarakany', 'klopy', 'krysy', 'myshi'];
const allPestSlugs = Object.keys(pestNamesGen);

const nchEntries: SemanticEntry[] = allPestSlugs.flatMap(pest =>
  topNeighborhoods.map(nhood => ({
    query: `уничтожение ${pestNamesGen[pest]} ${neighborhoodNamesRu[nhood]}`,
    canonical: `/uslugi/${pestServiceMap[pest]}/${pest}/${nhood}/`,
    intent: 'commercial' as const,
    cluster: 'nch' as const,
    priority: (topPestSlugs.includes(pest) ? 3 : 4) as 1 | 2 | 3 | 4 | 5,
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
];

// ===================== ОБЪЕДИНЁННОЕ ЯДРО =====================

export const semanticCore: SemanticEntry[] = [
  ...serviceEntries,
  ...pestEntries,
  ...objectEntries,
  ...districtEntries,
  ...nchEntries,
  ...blogEntries,
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
