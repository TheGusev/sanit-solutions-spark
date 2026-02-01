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

// Вредители для дезинсекции
export const dezinsekciyaPestSlugs = [
  'tarakany',
  'klopy',
  'muravyi',
  'blohi',
  'mol'
];

// Вредители для дератизации
export const deratizaciyaPestSlugs = [
  'krysy',
  'myshi'
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
  'khimki', 'mytishchi', 'balashikha', 'krasnogorsk', 'podolsk', 'korolyov', 'lyubertsy', 'odintsovo', 'dolgoprudny'
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
  'kvartir', 'domov', 'ofisov', 'restoranov', 'skladov', 'proizvodstv'
];

// Услуги для объектов (4 основных)
export const servicesForObjects = ['dezinsekciya', 'dezinfekciya', 'deratizaciya', 'ozonirovanie'];

// Топ-100 районов для Услуга + Объект + Район (ограничиваем для оптимизации)
export const top100Neighborhoods = neighborhoodSlugs.slice(0, 100);

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
  
  // Услуга + Район (520 страниц: 4 услуги × 130 районов)
  servicesForObjects.forEach(serviceSlug => {
    neighborhoodSlugs.forEach(districtSlug => {
      routes.push({
        path: `/uslugi/${serviceSlug}/${districtSlug}`,
        outputPath: `uslugi/${serviceSlug}/${districtSlug}/index.html`,
        priority: '0.75',
        changefreq: 'monthly'
      });
    });
  });
  
  // Услуга + Объект + Район (2,400 страниц: 4 услуги × 6 объектов × 100 районов)
  servicesForObjects.forEach(serviceSlug => {
    objectSlugs.forEach(objectSlug => {
      top100Neighborhoods.forEach(districtSlug => {
        routes.push({
          path: `/uslugi/${serviceSlug}/${objectSlug}/${districtSlug}`,
          outputPath: `uslugi/${serviceSlug}/${objectSlug}/${districtSlug}/index.html`,
          priority: '0.7',
          changefreq: 'monthly'
        });
      });
    });
  });
  
  // ======== СУЩЕСТВУЮЩИЕ ТИПЫ ========
  
  // НЧ-страницы: Услуга + Вредитель + Район (875 страниц)
  dezinsekciyaPestSlugs.forEach(pestSlug => {
    neighborhoodSlugs.forEach(neighborhoodSlug => {
      routes.push({
        path: `/uslugi/dezinsekciya/${pestSlug}/${neighborhoodSlug}`,
        outputPath: `uslugi/dezinsekciya/${pestSlug}/${neighborhoodSlug}/index.html`,
        priority: '0.7',
        changefreq: 'monthly'
      });
    });
  });
  
  deratizaciyaPestSlugs.forEach(pestSlug => {
    neighborhoodSlugs.forEach(neighborhoodSlug => {
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
  
  // Блог - динамически из allBlogArticles (158+ статей)
  // Импортируем данные напрямую для SSG
  const blogArticleSlugs = [
    // Legacy статьи (50)
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
    // Pests articles (55+)
    'kak-izbavitsya-ot-tarakanov', 'tarakany-v-kvartire', 'otkuda-berutsya-tarakany',
    'narodnye-sredstva-tarakany', 'professionalnaya-obrabotka-tarakany', 'profilaktika-tarakanov',
    'chem-opasny-tarakany', 'tarakany-posle-obrabotki', 'ceny-unichtozhenie-tarakanov',
    'kak-izbavitsya-ot-klopov', 'klopy-v-kvartire-priznaki', 'otkuda-berutsya-klopy-article',
    'narodnye-sredstva-klopy', 'professionalnaya-obrabotka-klopy', 'profilaktika-klopov',
    'chem-opasny-klopy', 'klopy-posle-obrabotki', 'ceny-unichtozhenie-klopov',
    'kak-izbavitsya-ot-muravyev-article', 'muravyi-v-kvartire', 'otkuda-berutsya-muravyi',
    'narodnye-sredstva-muravyi', 'professionalnaya-obrabotka-muravyi', 'profilaktika-muravyev',
    'chem-opasny-muravyi', 'muravyi-posle-obrabotki', 'ceny-unichtozhenie-muravyev',
    'kak-izbavitsya-ot-bloh', 'blohi-v-kvartire-article', 'otkuda-berutsya-blohi',
    'narodnye-sredstva-blohi', 'professionalnaya-obrabotka-blohi', 'profilaktika-bloh',
    'chem-opasny-blohi', 'blohi-posle-obrabotki', 'ceny-unichtozhenie-bloh',
    'kak-izbavitsya-ot-moli', 'mol-v-kvartire-article', 'otkuda-berutsya-mol',
    'narodnye-sredstva-mol', 'professionalnaya-obrabotka-mol', 'profilaktika-moli',
    'chem-opasna-mol', 'mol-posle-obrabotki', 'ceny-unichtozhenie-moli',
    'kak-izbavitsya-ot-krys', 'krysy-v-dome', 'otkuda-berutsya-krysy',
    'narodnye-sredstva-krysy', 'professionalnaya-obrabotka-krysy', 'profilaktika-krys',
    'chem-opasny-krysy', 'krysy-posle-obrabotki', 'ceny-unichtozhenie-krys',
    'kak-izbavitsya-ot-myshej', 'myshi-v-dome', 'otkuda-berutsya-myshi',
    'narodnye-sredstva-myshi', 'professionalnaya-obrabotka-myshi', 'profilaktika-myshej',
    'chem-opasny-myshi', 'myshi-posle-obrabotki', 'ceny-unichtozhenie-myshej',
    // Premises articles (42)
    'dezinsekciya-kvartiry-gid', 'deratizaciya-kvartiry', 'podgotovka-kvartiry-k-obrabotke',
    'stoimost-obrabotki-kvartiry', 'posle-obrabotki-kvartiry', 'vrediteli-v-kvartire-vidy',
    'profilaktika-vreditelej-kvartira',
    'dezinsekciya-chastnogo-doma', 'deratizaciya-chastnogo-doma', 'podgotovka-doma-k-obrabotke',
    'stoimost-obrabotki-doma', 'posle-obrabotki-doma', 'vrediteli-v-dome-vidy',
    'profilaktika-vreditelej-dom',
    'dezinsekciya-ofisa-gid', 'deratizaciya-ofisa', 'podgotovka-ofisa-k-obrabotke',
    'stoimost-obrabotki-ofisa', 'posle-obrabotki-ofisa', 'vrediteli-v-ofise-vidy',
    'profilaktika-vreditelej-ofis',
    'dezinsekciya-restorana', 'deratizaciya-restorana', 'podgotovka-restorana-k-obrabotke',
    'stoimost-obrabotki-restorana', 'posle-obrabotki-restorana', 'vrediteli-v-restorane-vidy',
    'profilaktika-vreditelej-restoran',
    'dezinsekciya-sklada', 'deratizaciya-sklada-article', 'podgotovka-sklada-k-obrabotke',
    'stoimost-obrabotki-sklada', 'posle-obrabotki-sklada', 'vrediteli-na-sklade-vidy',
    'profilaktika-vreditelej-sklad',
    'dezinsekciya-proizvodstva', 'deratizaciya-proizvodstva', 'podgotovka-proizvodstva-k-obrabotke',
    'stoimost-obrabotki-proizvodstva', 'posle-obrabotki-proizvodstva', 'vrediteli-na-proizvodstve-vidy',
    'profilaktika-vreditelej-proizvodstvo',
    // Legal articles (11)
    'sanpin-2026-trebovaniya', 'rospotrebnadzor-proverki', 'dokumenty-dlya-obshchepita',
    'shtraf-za-vrediteley', 'dogovor-na-dezinsekciyu', 'zhurnal-dezinsekcii',
    'haccp-vrediteli', 'licenzirovanie-dezinfekcii-article', 'audit-vreditelej',
    'otvetstvennost-rukovoditelya', 'sudebnaya-praktika-vrediteli'
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
