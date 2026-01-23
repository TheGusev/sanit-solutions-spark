/**
 * Единый источник истины для всех индексируемых маршрутов.
 * Используется в SSG (vite-plugin-ssg.ts) и Sitemap (vite-plugin-sitemap.ts).
 */

// Статические страницы
export const staticRoutes = [
  { path: '/', outputPath: 'index.html', priority: '1.0', changefreq: 'weekly' },
  { path: '/contacts', outputPath: 'contacts/index.html', priority: '0.8', changefreq: 'monthly' },
  { path: '/blog', outputPath: 'blog/index.html', priority: '0.7', changefreq: 'weekly' },
  { path: '/privacy', outputPath: 'privacy/index.html', priority: '0.2', changefreq: 'yearly' },
];

// Услуги (коммерческие страницы высокого приоритета)
export const servicesSlugs = [
  'dezinfekciya',
  'dezinsekciya', 
  'deratizaciya',
  'ozonirovanie',
  'dezodoraciya',
  'sertifikaciya'
];

// Подстраницы услуг (коммерческие страницы высокого приоритета)
export const serviceSubpageRoutes = [
  { parent: 'dezinfekciya', sub: 'kvartir' },
  { parent: 'dezinfekciya', sub: 'ofisov' },
  { parent: 'dezinsekciya', sub: 'unichtozhenie-klopov' },
  { parent: 'dezinsekciya', sub: 'unichtozhenie-tarakanov' },
  { parent: 'deratizaciya', sub: 'unichtozhenie-krys' },
  { parent: 'deratizaciya', sub: 'unichtozhenie-myshej' },
];

// Округа Москвы
export const districtSlugs = [
  'cao', 'sao', 'svao', 'vao', 'yuvao', 'yao', 'yzao', 'zao', 'szao', 'nao', 'tao', 'zelao'
];

// Статьи блога (50 статей)
export const blogSlugs = [
  // Оригинальные 8 статей
  'kak-podgotovit-pomeshchenie',
  'vidy-dezinfekcii',
  'borba-s-tarakanami',
  'ozonirovaniye-pomeshcheniy',
  'gryzuny-v-dome',
  'sezonnost-vreditelej',
  'dezinfekciya-ofisa',
  'klopy-v-kvartire',
  // Дополнительные 12 статей (ранее добавленные)
  'narodnye-sredstva-ot-tarakanov',
  'otkuda-berutsya-klopy',
  'priznaki-gryzunov-v-dome',
  'kak-izbavitsya-ot-muravyev',
  'chernaya-plesen-chem-opasna',
  'blohi-v-kvartire-otkuda',
  'mol-v-kvartire',
  'kak-podgotovit-kvartiru-k-obrabotke',
  'zapakh-posle-gryzunov',
  'dezinfekciya-posle-remonta',
  'pochemu-vozvrashchayutsya-tarakany',
  'dezinsekciya-dlya-biznesa',
  // Статьи 21-39: Законы (7), Препараты (6), Кейсы (6)
  'obyazatelnaya-dezinfekciya-dlya-biznesa',
  'shtraf-za-tarakanov-v-kafe',
  'dokumenty-dlya-rospotrebnadzora',
  'pravila-obrabotki-zhilyh-domov',
  'otvetstvennost-za-klopov-v-gostinitse',
  'trebovaniya-k-dezinfekcii-v-medicine',
  'sanpin-dlya-detskih-sadov',
  'bezopasnye-preparaty-dlya-kvartiry',
  'chem-travyat-klopov-professionaly',
  'gel-ili-tuman-chto-vybrat',
  'pochemu-ne-rabotayut-narodnye-sredstva',
  'preparaty-ot-gryzunov-obzor',
  'dezinficiruyushchie-sredstva-ot-pleseni',
  'kejs-tarakany-v-novostrojke',
  'kejs-klopy-iz-otpuska',
  'kejs-myshi-v-chastnom-dome',
  'kejs-restoran-proshel-proverku',
  'kejs-plesen-v-vannoy',
  'kejs-blohi-ot-sobaki',
  // Статьи 40-50: Законы (6), Препараты (3), Кейсы (2)
  'trebovaniya-rospotrebnadzora-2026',
  'sanpin-dezinfekciya',
  'prava-zhilcov-ot-sosedey',
  'licenzirovanie-dezinfekcii',
  'otvetstvennost-arendodatelya',
  'sudebnaya-praktika-klopy',
  'aerozoli-ot-tarakanov',
  'lovushki-dlya-nasekomyh',
  'repellenty-kak-vybrat',
  'kejs-ofis-posle-covid',
  'kejs-deratizaciya-sklada',
];

// Районы Москвы (125 районов)
export const neighborhoodSlugs = [
  // ЦАО
  'arbat', 'tverskoy', 'zamoskvorechye', 'khamovniki', 'presnensky', 'basmannyy', 'krasnoselsky', 'meshchansky', 'tagansky', 'yakimanka',
  // САО
  'aeroport', 'begovoy', 'sokol', 'voykovskiy', 'golovinsky', 'koptevo', 'timiryazevsky', 'khovrino', 'savelovsky', 'levoberezhny', 'dmitrovsky', 'zapadnoe-degunino', 'vostochnoe-degunino', 'beskudnikovsky', 'molzhaninovsky', 'khoroshevsky',
  // СВАО
  'altufyevsky', 'babushkinsky', 'bibirevo', 'butyrsky', 'lianozovo', 'losinoostrovskiy', 'marfino', 'marina-roshcha', 'ostankinsky', 'otradnoe', 'rostokino', 'sviblovo', 'severny', 'severnoe-medvedkovo', 'yuzhnoe-medvedkovo', 'yaroslavsky', 'severny-rayon',
  // ВАО
  'bogorodskoe', 'veshnyaki', 'vostochnoe-izmaylovo', 'vostochny', 'golyanovo', 'ivanovskoe', 'izmaylovo', 'kosino-ukhtomsky', 'metrogorodok', 'novogireevo', 'novokosino', 'perovo', 'preobrazhenskoe', 'severnoe-izmaylovo', 'sokolinaya-gora', 'sokolniki',
  // ЮВАО
  'vykhino-zhulebino', 'kapotnya', 'kuzminki', 'lefortovo', 'lyublino', 'maryino', 'nekrasovka', 'nizhegorodsky', 'pechatniki', 'ryazansky', 'tekstilshchiki', 'yuzhnoport',
  // ЮАО
  'biryulyovo-vostochnoe', 'biryulyovo-zapadnoe', 'brateevo', 'danilovsky', 'donskoy', 'zyablikovo', 'moskvorechye-saburovo', 'nagatino-sadovniki', 'nagatinsky-zaton', 'nagorny', 'orekhovo-borisovo-severnoe', 'orekhovo-borisovo-yuzhnoe', 'tsaritsyno', 'chertanovo-severnoe', 'chertanovo-tsentralnoe', 'chertanovo-yuzhnoe',
  // ЮЗАО
  'akademichesky', 'gagarinsky', 'zyuzino', 'konkovo', 'kotlovka', 'lomonosovsky', 'obruchevsky', 'severnoe-butovo', 'tyoply-stan', 'cheryomushki', 'yuzhnoe-butovo', 'yasenevo',
  // ЗАО
  'vnukovo', 'dorogomilovo', 'krylatskoe', 'kuntsevo', 'mozhaysky', 'novo-peredelkino', 'ochakovo-matveevskoe', 'prospekt-vernadskogo', 'ramenki', 'solntsevo', 'troparyovo-nikulino', 'filyovsky-park', 'fili-davydkovo',
  // СЗАО
  'kurkino', 'mitino', 'pokrovskoe-streshnevo', 'severnoe-tushino', 'strogino', 'khoroshevo-mnevniki', 'shchukino', 'yuzhnoe-tushino',
  // НАО, ТАО, ЗелАО
  'sosenskoe', 'vnukovskoe', 'troitsk', 'shcherbinka', 'moskovsky', 'zelenograd-1', 'zelenograd-2', 'zelenograd-3', 'zelenograd-4', 'zelenograd-5',
];

// Генерация всех маршрутов для SSG
export function getAllSSGRoutes() {
  const routes = [...staticRoutes];
  
  // Услуги
  servicesSlugs.forEach(slug => {
    routes.push({
      path: `/uslugi/${slug}`,
      outputPath: `uslugi/${slug}/index.html`,
      priority: '0.9',
      changefreq: 'monthly'
    });
  });
  
  // Подстраницы услуг
  serviceSubpageRoutes.forEach(({ parent, sub }) => {
    routes.push({
      path: `/uslugi/${parent}/${sub}`,
      outputPath: `uslugi/${parent}/${sub}/index.html`,
      priority: '0.85',
      changefreq: 'monthly'
    });
  });
  
  // Обзорная страница округов
  routes.push({
    path: '/uslugi/po-okrugam-moskvy',
    outputPath: 'uslugi/po-okrugam-moskvy/index.html',
    priority: '0.85',
    changefreq: 'monthly'
  });
  
  // Страницы округов
  districtSlugs.forEach(id => {
    routes.push({
      path: `/uslugi/dezinfekciya-${id}`,
      outputPath: `uslugi/dezinfekciya-${id}/index.html`,
      priority: '0.85',
      changefreq: 'monthly'
    });
  });
  
  // Блог
  blogSlugs.forEach(slug => {
    routes.push({
      path: `/blog/${slug}`,
      outputPath: `blog/${slug}/index.html`,
      priority: '0.6',
      changefreq: 'monthly'
    });
  });
  
  // Обзорная страница районов
  routes.push({
    path: '/rajony',
    outputPath: 'rajony/index.html',
    priority: '0.8',
    changefreq: 'monthly'
  });
  
  // Страницы районов
  neighborhoodSlugs.forEach(slug => {
    routes.push({
      path: `/rajony/${slug}`,
      outputPath: `rajony/${slug}/index.html`,
      priority: '0.75',
      changefreq: 'monthly'
    });
  });
  
  return routes;
}

// Генерация URL для sitemap
export function getAllSitemapUrls(baseUrl: string) {
  const currentDate = new Date().toISOString().split('T')[0];
  
  return getAllSSGRoutes().map(route => ({
    loc: route.path,
    lastmod: currentDate,
    changefreq: route.changefreq,
    priority: route.priority,
  }));
}
