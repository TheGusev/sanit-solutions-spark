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
  'demerkurizaciya',
  'borba-s-krotami'
];

// Подстраницы услуг (коммерческие страницы высокого приоритета)
export const serviceSubpageRoutes = [
  { parent: 'dezinfekciya', sub: 'kvartir' },
  { parent: 'dezinfekciya', sub: 'ofisov' },
  { parent: 'dezinsekciya', sub: 'unichtozhenie-klopov' },
  { parent: 'dezinsekciya', sub: 'unichtozhenie-tarakanov' },
  { parent: 'deratizaciya', sub: 'unichtozhenie-krys' },
  { parent: 'deratizaciya', sub: 'unichtozhenie-myshej' },
  // Квалификаторы (высокочастотные коммерческие запросы)
  { parent: 'dezinsekciya', sub: 'klopov-v-kvartire' },
  { parent: 'dezinsekciya', sub: 'postelnyh-klopov' },
  { parent: 'dezinsekciya', sub: 'domashnih-klopov' },
  { parent: 'dezinsekciya', sub: 'tarakanov-v-kvartire' },
  { parent: 'dezinsekciya', sub: 'klopov-i-tarakanov' },
  { parent: 'dezinsekciya', sub: 'klopov-i-bloh' },
  { parent: 'dezinsekciya', sub: 'blokh-ot-zhivotnyh' },
  // Методы обработки
  { parent: 'dezinsekciya', sub: 'holodnym-tumanom' },
  { parent: 'dezinsekciya', sub: 'parom' },
  { parent: 'dezinsekciya', sub: 'parogeneratorom' },
  { parent: 'dezinsekciya', sub: 'bez-zapaha' },
  { parent: 'dezinsekciya', sub: 'srochno' },
  { parent: 'dezinsekciya', sub: 'kruglosutochno' },
];

// Вредители для дезинсекции
export const dezinsekciyaPestSlugs = [
  'tarakany',
  'klopy',
  'muravyi',
  'blohi',
  'mol',
  'komary',
  'muhi',
  'osy-shershni',
  'cheshuynitsy',
  'kleshchi',
  'mokricy'
];

// Вредители для дератизации
export const deratizaciyaPestSlugs = [
  'krysy',
  'myshi',
  'kroty'
];

// Округа Москвы
export const districtSlugs = [
  'cao', 'sao', 'svao', 'vao', 'yuvao', 'yao', 'yzao', 'zao', 'szao', 'nao', 'tao', 'zelao'
];

// Статьи блога - динамически из allBlogArticles
// Импорт будет добавлен при сборке SSG

// Районы Москвы (130 районов)
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

// Города Московской области
export const moscowRegionCitySlugs = [
  'khimki', 'mytishchi', 'balashikha', 'krasnogorsk', 'podolsk', 'korolyov', 'lyubertsy', 'odintsovo', 'dolgoprudny', 'shchyolkovo'
];

// Услуги для городов МО
export const moscowRegionServices = [
  'dezinsekciya', 'dezinfekciya', 'deratizaciya', 'ozonirovanie'
];

// Топ-районы для НЧ-страниц (приоритет 1)
export const topNeighborhoods = [
  'arbat', 'tverskoy', 'khamovniki', 'zamoskvorechye', 'presnensky',
  'sokol', 'aeroport', 'babushkinsky', 'izmaylovo', 'sokolniki',
  'maryino', 'lyublino', 'chertanovo-severnoe', 'konkovo', 'strogino'
];

// Типы объектов (синхронизировано с src/data/objects.ts)
export const objectSlugs = [
  'kvartir', 'domov', 'ofisov', 'restoranov', 'skladov', 'proizvodstv',
  'gostinic', 'detskih-sadov', 'hostela', 'magazinov', 'avtomobiley'
];

// Услуги для объектов (5 основных, включая демеркуризацию)
export const servicesForObjects = ['dezinsekciya', 'dezinfekciya', 'deratizaciya', 'ozonirovanie', 'demerkurizaciya'];


// Генерация всех маршрутов для SSG
export function getAllSSGRoutes() {
  const routes = [...staticRoutes];
  
  // Услуги (6 страниц)
  servicesSlugs.forEach(slug => {
    routes.push({
      path: `/uslugi/${slug}`,
      outputPath: `uslugi/${slug}/index.html`,
      priority: '0.9',
      changefreq: 'monthly'
    });
  });
  
  // Подстраницы услуг (6 страниц)
  serviceSubpageRoutes.forEach(({ parent, sub }) => {
    routes.push({
      path: `/uslugi/${parent}/${sub}`,
      outputPath: `uslugi/${parent}/${sub}/index.html`,
      priority: '0.85',
      changefreq: 'monthly'
    });
  });
  
  // Услуга + Вредитель (Дезинсекция) - 5 страниц
  dezinsekciyaPestSlugs.forEach(pestSlug => {
    routes.push({
      path: `/uslugi/dezinsekciya/${pestSlug}`,
      outputPath: `uslugi/dezinsekciya/${pestSlug}/index.html`,
      priority: '0.85',
      changefreq: 'monthly'
    });
  });
  
  // Услуга + Вредитель (Дератизация) - 2 страницы
  deratizaciyaPestSlugs.forEach(pestSlug => {
    routes.push({
      path: `/uslugi/deratizaciya/${pestSlug}`,
      outputPath: `uslugi/deratizaciya/${pestSlug}/index.html`,
      priority: '0.85',
      changefreq: 'monthly'
    });
  });
  
  // ======== НОВЫЕ ТИПЫ СТРАНИЦ ========
  
  // Услуга + Объект (24 страницы: 4 услуги × 6 объектов)
  servicesForObjects.forEach(serviceSlug => {
    objectSlugs.forEach(objectSlug => {
      routes.push({
        path: `/uslugi/${serviceSlug}/${objectSlug}`,
        outputPath: `uslugi/${serviceSlug}/${objectSlug}/index.html`,
        priority: '0.8',
        changefreq: 'monthly'
      });
    });
  });
  
  
  
  // НЧ-страницы: Услуга + Вредитель + Топ-15 районов (~105 страниц)
  dezinsekciyaPestSlugs.forEach(pestSlug => {
    topNeighborhoods.forEach(neighborhoodSlug => {
      routes.push({
        path: `/uslugi/dezinsekciya/${pestSlug}/${neighborhoodSlug}`,
        outputPath: `uslugi/dezinsekciya/${pestSlug}/${neighborhoodSlug}/index.html`,
        priority: '0.7',
        changefreq: 'monthly'
      });
    });
  });
  
  deratizaciyaPestSlugs.forEach(pestSlug => {
    topNeighborhoods.forEach(neighborhoodSlug => {
      routes.push({
        path: `/uslugi/deratizaciya/${pestSlug}/${neighborhoodSlug}`,
        outputPath: `uslugi/deratizaciya/${pestSlug}/${neighborhoodSlug}/index.html`,
        priority: '0.7',
        changefreq: 'monthly'
      });
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
  
  // Блог — все 163 статей (50 legacy + 45 insects + 15 rodents + 42 premises + 11 legal)
  const blogArticleSlugs = [
    // ===== Legacy статьи (50) =====
    'kak-podgotovit-pomeshchenie', 'vidy-dezinfekcii', 'borba-s-tarakanami', 'ozonirovaniye-pomeshcheniy',
    'gryzuny-v-dome', 'sezonnost-vreditelej', 'dezinfekciya-ofisa', 'klopy-v-kvartire',
    'narodnye-sredstva-ot-tarakanov', 'otkuda-berutsya-klopy', 'priznaki-gryzunov-v-dome',
    'kak-izbavitsya-ot-muravyev', 'chernaya-plesen-chem-opasna', 'blohi-v-kvartire-otkuda',
    'mol-v-kvartire', 'kak-podgotovit-kvartiru-k-obrabotke', 'zapakh-posle-gryzunov',
    'dezinfekciya-posle-remonta', 'pochemu-vozvrashchayutsya-tarakany', 'dezinsekciya-dlya-biznesa',
    'obyazatelnaya-dezinfekciya-dlya-biznesa', 'shtraf-za-tarakanov-v-kafe', 'dokumenty-dlya-rospotrebnadzora',
    'pravila-obrabotki-zhilyh-domov', 'otvetstvennost-za-klopov-v-gostinitse', 'trebovaniya-k-dezinfekcii-v-medicine',
    'sanpin-dlya-detskih-sadov', 'bezopasnye-preparaty-dlya-kvartiry', 'chem-travyat-klopov-professionaly',
    'gel-ili-tuman-chto-vybrat', 'pochemu-ne-rabotayut-narodnye-sredstva', 'preparaty-ot-gryzunov-obzor',
    'dezinficiruyushchie-sredstva-ot-pleseni', 'kejs-tarakany-v-novostrojke', 'kejs-klopy-iz-otpuska',
    'kejs-myshi-v-chastnom-dome', 'kejs-restoran-proshel-proverku', 'kejs-plesen-v-vannoy',
    'kejs-blohi-ot-sobaki', 'trebovaniya-rospotrebnadzora-2026', 'sanpin-dezinfekciya',
    'prava-zhilcov-ot-sosedey', 'licenzirovanie-dezinfekcii', 'otvetstvennost-arendodatelya',
    'sudebnaya-praktika-klopy', 'aerozoli-ot-tarakanov', 'lovushki-dlya-nasekomyh',
    'repellenty-kak-vybrat', 'kejs-ofis-posle-covid', 'kejs-deratizaciya-sklada',
    // ===== Pest articles: insects (45 = 9 templates × 5 pests) =====
    'kak-izbavitsya-ot-tarakany', 'kak-izbavitsya-ot-klopy', 'kak-izbavitsya-ot-muravyi', 'kak-izbavitsya-ot-blohi', 'kak-izbavitsya-ot-mol',
    'v-kvartire-tarakany', 'v-kvartire-klopy', 'v-kvartire-muravyi', 'v-kvartire-blohi', 'v-kvartire-mol',
    'otkuda-berutsya-tarakany', 'otkuda-berutsya-klopy', 'otkuda-berutsya-muravyi', 'otkuda-berutsya-blohi', 'otkuda-berutsya-mol',
    'narodnye-sredstva-ot-tarakany', 'narodnye-sredstva-ot-klopy', 'narodnye-sredstva-ot-muravyi', 'narodnye-sredstva-ot-blohi', 'narodnye-sredstva-ot-mol',
    'professionalnaya-obrabotka-ot-tarakany', 'professionalnaya-obrabotka-ot-klopy', 'professionalnaya-obrabotka-ot-muravyi', 'professionalnaya-obrabotka-ot-blohi', 'professionalnaya-obrabotka-ot-mol',
    'profilaktika-tarakany', 'profilaktika-klopy', 'profilaktika-muravyi', 'profilaktika-blohi', 'profilaktika-mol',
    'chem-opasny-tarakany', 'chem-opasny-klopy', 'chem-opasny-muravyi', 'chem-opasny-blohi', 'chem-opasny-mol',
    'posle-obrabotki-tarakany', 'posle-obrabotki-klopy', 'posle-obrabotki-muravyi', 'posle-obrabotki-blohi', 'posle-obrabotki-mol',
    'ceny-na-unichtozhenie-tarakany', 'ceny-na-unichtozhenie-klopy', 'ceny-na-unichtozhenie-muravyi', 'ceny-na-unichtozhenie-blohi', 'ceny-na-unichtozhenie-mol',
    // ===== Pest articles: rodents (10 = 5 templates × 2 pests, без кротов) =====
    'kak-izbavitsya-ot-krysy', 'kak-izbavitsya-ot-myshi',
    'v-kvartire-krysy', 'v-kvartire-myshi',
    'otkuda-berutsya-krysy', 'otkuda-berutsya-myshi',
    'narodnye-sredstva-ot-krysy', 'narodnye-sredstva-ot-myshi',
    'professionalnaya-obrabotka-ot-krysy', 'professionalnaya-obrabotka-ot-myshi',
    // ===== Premises articles (42 = 7 templates × 6 objects) =====
    'dezinsekciya-kvartir', 'dezinsekciya-domov', 'dezinsekciya-ofisov', 'dezinsekciya-restoranov', 'dezinsekciya-skladov', 'dezinsekciya-proizvodstv',
    'deratizaciya-kvartir', 'deratizaciya-domov', 'deratizaciya-ofisov', 'deratizaciya-restoranov', 'deratizaciya-skladov', 'deratizaciya-proizvodstv',
    'podgotovka-k-obrabotke-kvartir', 'podgotovka-k-obrabotke-domov', 'podgotovka-k-obrabotke-ofisov', 'podgotovka-k-obrabotke-restoranov', 'podgotovka-k-obrabotke-skladov', 'podgotovka-k-obrabotke-proizvodstv',
    'stoimost-obrabotki-kvartir', 'stoimost-obrabotki-domov', 'stoimost-obrabotki-ofisov', 'stoimost-obrabotki-restoranov', 'stoimost-obrabotki-skladov', 'stoimost-obrabotki-proizvodstv',
    'posle-obrabotki-kvartir', 'posle-obrabotki-domov', 'posle-obrabotki-ofisov', 'posle-obrabotki-restoranov', 'posle-obrabotki-skladov', 'posle-obrabotki-proizvodstv',
    'vrediteli-v-kvartir', 'vrediteli-v-domov', 'vrediteli-v-ofisov', 'vrediteli-v-restoranov', 'vrediteli-v-skladov', 'vrediteli-v-proizvodstv',
    'profilaktika-vreditelej-v-kvartir', 'profilaktika-vreditelej-v-domov', 'profilaktika-vreditelej-v-ofisov', 'profilaktika-vreditelej-v-restoranov', 'profilaktika-vreditelej-v-skladov', 'profilaktika-vreditelej-v-proizvodstv',
    // ===== Legal articles (11) =====
    'sanpin-trebovaniya-2026', 'trebovaniya-rospotrebnadzora-2026', 'dokumenty-dlya-obshhepita',
    'zhurnal-uchyota-dezinsekcii', 'licenziya-na-dezinfekciyu', 'shtrafy-za-vrediteley',
    'haccp-i-dezinsekciya', 'dogovor-na-dezinsekciyu-obrazec', 'proverka-ses-kak-podgotovitsya',
    'bezopasnost-preparatov', 'kak-vybrat-kompaniyu',
    // ===== Mole geo articles (18) =====
    'kroty-novorizhskoe-shosse', 'kroty-istra', 'kroty-krasnogorsk', 'kroty-nakhabino', 'kroty-dedovsk', 'kroty-snt-novaya-riga',
    'kroty-rublevskoe-shosse', 'kroty-odintsovo', 'kroty-barvikha', 'kroty-usovo', 'kroty-zhukovka', 'kroty-snt-rublevka',
    'kroty-dmitrovskoe-shosse', 'kroty-dolgoprudny', 'kroty-lobnya', 'kroty-dmitrov', 'kroty-yakhroma', 'kroty-snt-dmitrovka',
    // ===== B2B articles (5) =====
    'shtrafy-za-dezinfekciyu-bez-licenzii-2026', 'haccp-pest-kontrol-restoran', 'zhurnal-ucheta-dezinsekcii-obshhepit',
    'sanpin-deratizaciya-skladov', 'dogovor-na-dezinsekciyu-hostela',
    // ===== Safety articles (5) =====
    'cherez-skolko-puskat-koshku-posle-tumana', 'goryachij-tuman-i-akvarium', 'dezinsekciya-s-grudnym-rebenkom',
    'bezopasnost-obrabotki-dlya-beremennyh', 'allergiya-na-preparaty-dezinsekcii',
    // ===== DIY-failure articles (5) =====
    'pochemu-dihlofos-ne-beret-klopov', 'rezistentnost-tarakanov-k-bornoj-kislote', 'oshibki-samodeyatelnoj-obrabotki',
    'pochemu-tarakany-vozvrashchayutsya-posle-obrabotki', 'aerozoli-ot-klopov-ne-rabotayut',
    // ===== LLM-unique articles (12) =====
    'bezopasnost-detej-i-zhivotnyh', 'vrediteli-v-kvartire-vidy', 'postelnye-klopy-polnyj-gajd',
    'ryzhie-tarakany-unichtozhenie', 'domashnie-muravi-pochemu-ne-pomogaet', 'podgotovka-kvartiry-chek-list',
    'dezinfekciya-posle-bolezni', 'profilaktika-tarakanov', 'kak-vybrat-sluzhbu-dezinfekcii',
    'kejs-restoran-tarakany', 'kejs-gostinica-klopy', 'dezinfekciya-ofisa-bez-pomeh',
  ];
  
  blogArticleSlugs.forEach(slug => {
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
  
  // Московская область - обзор
  routes.push({
    path: '/moscow-oblast',
    outputPath: 'moscow-oblast/index.html',
    priority: '0.8',
    changefreq: 'monthly'
  });
  
  // Города Московской области
  moscowRegionCitySlugs.forEach(citySlug => {
    routes.push({
      path: `/moscow-oblast/${citySlug}`,
      outputPath: `moscow-oblast/${citySlug}/index.html`,
      priority: '0.8',
      changefreq: 'monthly'
    });
    
    // Услуги в городах МО
    moscowRegionServices.forEach(serviceSlug => {
      routes.push({
        path: `/moscow-oblast/${citySlug}/${serviceSlug}`,
        outputPath: `moscow-oblast/${citySlug}/${serviceSlug}/index.html`,
        priority: '0.75',
        changefreq: 'monthly'
      });
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
