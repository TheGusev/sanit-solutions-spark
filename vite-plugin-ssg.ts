import { Plugin } from 'vite';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { pathToFileURL } from 'url';

interface SSGRoute {
  path: string;
  outputPath: string;
  priority?: string;
  changefreq?: string;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  meta: {
    titleLength?: number;
    descriptionLength?: number;
    wordCount?: number;
  };
}

// Единый источник истины для всех маршрутов (синхронизирован с src/lib/seoRoutes.ts)
// Дублируем здесь, т.к. vite-plugin выполняется до сборки и не может импортировать из src/

// Статические страницы
const staticRoutes: SSGRoute[] = [
  { path: '/', outputPath: 'index.html' },
  { path: '/contacts', outputPath: 'contacts/index.html' },
  { path: '/blog', outputPath: 'blog/index.html' },
  { path: '/privacy', outputPath: 'privacy/index.html' },
  { path: '/sluzhba-dezinsekcii', outputPath: 'sluzhba-dezinsekcii/index.html' },
  { path: '/otzyvy', outputPath: 'otzyvy/index.html' },
  { path: '/uslugi/obrabotka-uchastkov', outputPath: 'uslugi/obrabotka-uchastkov/index.html' },
  { path: '/terms', outputPath: 'terms/index.html' },
];

// Услуги
const servicesSlugs = [
  'dezinfekciya',
  'dezinsekciya', 
  'deratizaciya',
  'ozonirovanie',
  'dezodoraciya',
  'demerkurizaciya',
  'borba-s-krotami'
];

// Подстраницы услуг (синхронизировано с seoRoutes.ts)
const serviceSubpageRoutes = [
  { parent: 'dezinfekciya', sub: 'kvartir' },
  { parent: 'dezinfekciya', sub: 'ofisov' },
  { parent: 'dezinsekciya', sub: 'unichtozhenie-klopov' },
  { parent: 'dezinsekciya', sub: 'unichtozhenie-tarakanov' },
  { parent: 'deratizaciya', sub: 'unichtozhenie-krys' },
  { parent: 'deratizaciya', sub: 'unichtozhenie-myshej' },
  // Квалификаторы
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

// Вредители для услуга + вредитель страниц (синхронизировано с seoRoutes.ts)
const dezinsekciyaPestSlugs = [
  'tarakany', 'klopy', 'muravyi', 'blohi', 'mol',
  'komary', 'muhi', 'osy-shershni', 'cheshuynitsy', 'kleshchi', 'mokricy'
];
const deratizaciyaPestSlugs = ['krysy', 'myshi', 'kroty'];

// Города МО (синхронизировано с seoRoutes.ts)
const moscowRegionCitySlugs = [
  'khimki', 'mytishchi', 'balashikha', 'krasnogorsk', 'podolsk', 'korolyov', 'lyubertsy', 'odintsovo', 'dolgoprudny', 'shchyolkovo',
  'klin', 'ramenskoe', 'chekhov', 'domodedovo'
];
const moscowRegionServices = ['dezinsekciya', 'deratizaciya', 'dezinfekciya', 'ozonirovanie'];

// Топ районов для НЧ-страниц (синхронизировано с seoRoutes.ts)
const topNeighborhoods = [
  'arbat', 'tverskoy', 'khamovniki', 'zamoskvorechye', 'presnensky',
  'sokol', 'aeroport', 'babushkinsky', 'izmaylovo', 'sokolniki',
  'maryino', 'lyublino', 'chertanovo-severnoe', 'konkovo', 'strogino'
];

// Округа Москвы
const districtSlugs = [
  'cao', 'sao', 'svao', 'vao', 'yuvao', 'yao', 'yzao', 'zao', 'szao', 'nao', 'tao', 'zelao'
];

// Районы Москвы (130 районов) - синхронизировано с seoRoutes.ts
const neighborhoodSlugs = [
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

// Типы объектов (синхронизировано с seoRoutes.ts)
const objectSlugs = ['kvartir', 'domov', 'ofisov', 'restoranov', 'skladov', 'proizvodstv', 'gostinic', 'detskih-sadov', 'hostela', 'magazinov', 'avtomobiley'];

// Услуги для объектов
const servicesForObjects = ['dezinsekciya', 'dezinfekciya', 'deratizaciya', 'ozonirovanie', 'demerkurizaciya'];


// Статьи блога (158 статей: 50 legacy + 45 insects + 10 rodents + 42 premises + 11 legal)
const blogSlugs = [
  // ===== Legacy статьи (50) =====
  'kak-podgotovit-pomeshchenie',
  'vidy-dezinfekcii',
  'borba-s-tarakanami',
  'ozonirovaniye-pomeshcheniy',
  'gryzuny-v-dome',
  'sezonnost-vreditelej',
  'dezinfekciya-ofisa',
  'klopy-v-kvartire',
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

// Generate all routes for SSG
function getAllRoutes(): SSGRoute[] {
  const routes = [...staticRoutes];
  
  // Услуги
  servicesSlugs.forEach(slug => {
    routes.push({
      path: `/uslugi/${slug}`,
      outputPath: `uslugi/${slug}/index.html`
    });
  });
  
  // Подстраницы услуг
  serviceSubpageRoutes.forEach(({ parent, sub }) => {
    routes.push({
      path: `/uslugi/${parent}/${sub}`,
      outputPath: `uslugi/${parent}/${sub}/index.html`
    });
  });
  
  // Услуга + Вредитель (ServicePestPage)
  dezinsekciyaPestSlugs.forEach(pestSlug => {
    routes.push({
      path: `/uslugi/dezinsekciya/${pestSlug}`,
      outputPath: `uslugi/dezinsekciya/${pestSlug}/index.html`,
      priority: '0.85'
    });
  });
  
  deratizaciyaPestSlugs.forEach(pestSlug => {
    routes.push({
      path: `/uslugi/deratizaciya/${pestSlug}`,
      outputPath: `uslugi/deratizaciya/${pestSlug}/index.html`,
      priority: '0.85'
    });
  });
  
  // ======== НОВЫЕ ТИПЫ СТРАНИЦ ========
  
  // Услуга + Объект (24 страницы: 4 услуги × 6 объектов)
  servicesForObjects.forEach(serviceSlug => {
    objectSlugs.forEach(objectSlug => {
      routes.push({
        path: `/uslugi/${serviceSlug}/${objectSlug}`,
        outputPath: `uslugi/${serviceSlug}/${objectSlug}/index.html`,
        priority: '0.8'
      });
    });
  });
  
  // Дезинфекция по 130 районам Москвы (ServiceDistrictPage)
  neighborhoodSlugs.forEach(neighborhoodSlug => {
    routes.push({
      path: `/uslugi/dezinfekciya/${neighborhoodSlug}`,
      outputPath: `uslugi/dezinfekciya/${neighborhoodSlug}/index.html`,
      priority: '0.75'
    });
  });
  
  // ======== СУЩЕСТВУЮЩИЕ ТИПЫ ========
  
  // НЧ-страницы (услуга + вредитель + район) - NСНPage (топ-15 районов)
        topNeighborhoods.forEach(neighborhoodSlug => {
    dezinsekciyaPestSlugs.forEach(pestSlug => {
      routes.push({
        path: `/uslugi/dezinsekciya/${pestSlug}/${neighborhoodSlug}`,
        outputPath: `uslugi/dezinsekciya/${pestSlug}/${neighborhoodSlug}/index.html`,
        priority: '0.7'
      });
    });
    
    deratizaciyaPestSlugs.forEach(pestSlug => {
      routes.push({
        path: `/uslugi/deratizaciya/${pestSlug}/${neighborhoodSlug}`,
        outputPath: `uslugi/deratizaciya/${pestSlug}/${neighborhoodSlug}/index.html`,
        priority: '0.7'
      });
    });
            });
  
  // Обзорная страница округов
  routes.push({
    path: '/uslugi/po-okrugam-moskvy',
    outputPath: 'uslugi/po-okrugam-moskvy/index.html'
  });
  
  // Страницы округов
  districtSlugs.forEach(id => {
    routes.push({
      path: `/uslugi/dezinfekciya-${id}`,
      outputPath: `uslugi/dezinfekciya-${id}/index.html`
    });
  });
  
  // Блог
  blogSlugs.forEach(slug => {
    routes.push({
      path: `/blog/${slug}`,
      outputPath: `blog/${slug}/index.html`
    });
  });
  
  // Обзорная страница районов
  routes.push({
    path: '/rajony',
    outputPath: 'rajony/index.html'
  });
  
  // Страницы районов (130 страниц)
  neighborhoodSlugs.forEach(slug => {
    routes.push({
      path: `/rajony/${slug}`,
      outputPath: `rajony/${slug}/index.html`
    });
  });
  
  // Московская область - обзор
  routes.push({
    path: '/moscow-oblast',
    outputPath: 'moscow-oblast/index.html',
    priority: '0.8'
  });
  
  // Города МО
  moscowRegionCitySlugs.forEach(citySlug => {
    routes.push({
      path: `/moscow-oblast/${citySlug}`,
      outputPath: `moscow-oblast/${citySlug}/index.html`,
      priority: '0.8'
    });
    
    // Услуги в городах МО
    moscowRegionServices.forEach(serviceSlug => {
      routes.push({
        path: `/moscow-oblast/${citySlug}/${serviceSlug}`,
        outputPath: `moscow-oblast/${citySlug}/${serviceSlug}/index.html`,
        priority: '0.75'
      });
    });
  });
  
  return routes;
}

// Extract title from HTML
function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : null;
}

// Extract description from HTML (handles attribute order variations from react-helmet-async)
function extractDescription(html: string): string | null {
  const match = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i)
    || html.match(/<meta[^>]*content="([^"]+)"[^>]*name="description"/i);
  return match ? match[1].trim() : null;
}

// Count words in HTML (excluding scripts and styles)
function countWordsInHtml(html: string): number {
  const textContent = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  return textContent.split(' ').filter(w => w.length > 2).length;
}

// Validate generated HTML quality with enhanced checks
function validateHtml(html: string, route: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const meta: ValidationResult['meta'] = {};
  
  // Check minimum size (2KB)
  if (html.length < 2048) {
    errors.push(`HTML too small: ${html.length} bytes (min: 2048)`);
  }
  
  // Check for unclosed comments
  const openComments = (html.match(/<!--/g) || []).length;
  const closeComments = (html.match(/-->/g) || []).length;
  if (openComments !== closeComments) {
    errors.push(`Unclosed HTML comments: ${openComments} open, ${closeComments} close`);
  }
  
  // Check for basic HTML structure
  if (!html.includes('<h1') && !html.includes('<div')) {
    errors.push('Missing basic HTML tags (<h1>, <div>)');
  }
  
  // Check for empty content placeholder
  if (html.includes('<!--app-html-->')) {
    errors.push('Content placeholder not replaced');
  }
  
  // Check Title length (40-70 chars optimal)
  const title = extractTitle(html);
  if (title) {
    meta.titleLength = title.length;
    if (title.length < 40) {
      warnings.push(`Title too short: ${title.length} chars (min: 40)`);
    }
    if (title.length > 70) {
      warnings.push(`Title too long: ${title.length} chars (max: 70)`);
    }
  } else {
    errors.push('Missing <title> tag');
  }
  
  // Check Description length (140-170 chars optimal)
  const description = extractDescription(html);
  if (description) {
    meta.descriptionLength = description.length;
    if (description.length < 140) {
      warnings.push(`Description too short: ${description.length} chars (min: 140)`);
    }
    if (description.length > 170) {
      warnings.push(`Description too long: ${description.length} chars (max: 170)`);
    }
  } else {
    errors.push('Missing meta description');
  }
  
  // Check word count
  const wordCount = countWordsInHtml(html);
  meta.wordCount = wordCount;
  
  // НЧ-страницы требуют 650+ слов
  const isNchPage = route.split('/').length > 4 && route.includes('/uslugi/');
  const minWords = isNchPage ? 650 : 500;
  
  if (wordCount < minWords) {
    warnings.push(`Thin content: ${wordCount} words (min: ${minWords})`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    meta
  };
}

// Replace all head tags with helmet data
function replaceHeadTags(html: string, helmet: { title: string; meta: string; link: string; script: string }): string {
  // 1. Replace title
  if (helmet.title) {
    html = html.replace(/<title[^>]*>.*?<\/title>/, helmet.title);
  }
  
  // 2. Remove conflicting meta tags before inserting new ones
  const metaTagsToRemove = [
    /<meta name="description"[^>]*>/g,
    /<meta name="keywords"[^>]*>/g,
    /<meta name="robots"[^>]*>/g,
    /<meta property="og:[^"]*"[^>]*>/g,
    /<meta name="twitter:[^"]*"[^>]*>/g,
  ];
  
  metaTagsToRemove.forEach(regex => {
    html = html.replace(regex, '');
  });
  
  // 3. Remove conflicting link tags
  const linkTagsToRemove = [
    /<link rel="canonical"[^>]*>/g,
    /<link rel="alternate"[^>]*hreflang[^>]*>/gi,
    /<link rel="alternate"[^>]*hrefLang[^>]*>/gi,
  ];
  
  linkTagsToRemove.forEach(regex => {
    html = html.replace(regex, '');
  });
  
  // 4. Insert new helmet tags after </title>
  const titleEndIndex = html.indexOf('</title>');
  if (titleEndIndex !== -1) {
    const insertPoint = titleEndIndex + 8; // length of '</title>'
    const beforeTitle = html.substring(0, insertPoint);
    const afterTitle = html.substring(insertPoint);
    
    const newTags = [
      helmet.meta,
      helmet.link,
    ].filter(tag => tag && tag.trim()).join('\n    ');
    
    if (newTags) {
      html = beforeTitle + '\n    ' + newTags + afterTitle;
    }
  }
  
  // 5. Add schema.org scripts if provided (insert before </head>)
  if (helmet.script && helmet.script.trim()) {
    html = html.replace('</head>', helmet.script + '\n  </head>');
  }
  
  // 6. Clean up empty lines
  html = html.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  return html;
}

export function ssgPlugin(): Plugin {
  let distDir: string;
  
  return {
    name: 'vite-plugin-ssg',
    apply: 'build',
    
    configResolved(config) {
      distDir = config.build.outDir || 'dist';
    },
    
    async closeBundle() {
      console.log('\n🚀 Starting SSG prerendering...\n');
      
      try {
        // Read the template HTML
        const templatePath = resolve(distDir, 'index.html');
        if (!existsSync(templatePath)) {
          console.error('❌ Template index.html not found in dist/');
          return;
        }
        
        const template = readFileSync(templatePath, 'utf-8');
        
        // Build SSR bundle
        const { build } = await import('vite');
        
        console.log('📦 Building SSR bundle...');
        
        // Load .env file manually for SSR build (configFile: false doesn't auto-load it)
        let envDefines: Record<string, string> = {};
        try {
          const envPath = resolve('.env');
          if (existsSync(envPath)) {
            const envContent = readFileSync(envPath, 'utf-8');
            for (const line of envContent.split('\n')) {
              const trimmed = line.trim();
              if (!trimmed || trimmed.startsWith('#')) continue;
              const eqIndex = trimmed.indexOf('=');
              if (eqIndex === -1) continue;
              const key = trimmed.substring(0, eqIndex).trim();
              const val = trimmed.substring(eqIndex + 1).trim();
              if (key.startsWith('VITE_')) {
                envDefines[`import.meta.env.${key}`] = JSON.stringify(val);
              }
            }
          }
        } catch (e) {
          console.warn('⚠️  Could not read .env file for SSR build');
        }
        
        // Fallback placeholders so supabase client doesn't crash with undefined URL/key
        if (!envDefines['import.meta.env.VITE_SUPABASE_URL']) {
          envDefines['import.meta.env.VITE_SUPABASE_URL'] = JSON.stringify('https://placeholder.supabase.co');
        }
        if (!envDefines['import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY']) {
          envDefines['import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY'] = JSON.stringify('placeholder-key');
        }
        
        await build({
          configFile: false,
          define: envDefines,
          build: {
            ssr: true,
            outDir: resolve(distDir, 'server'),
            rollupOptions: {
              input: resolve('src/entry-server.tsx'),
              output: {
                format: 'esm',
                entryFileNames: 'entry-server.js'
              }
            },
            minify: false,
            emptyOutDir: true
          },
          resolve: {
            alias: {
              '@': resolve('src')
            }
          },
          ssr: {
            noExternal: ['react-helmet-async']
          },
          logLevel: 'warn'
        });
        
        console.log('✓ SSR bundle built\n');
        
        // Import the SSR bundle
        const serverEntryPath = pathToFileURL(resolve(distDir, 'server/entry-server.js')).href;
        const { render } = await import(serverEntryPath);
        
        // Get all routes to prerender
        const routes = getAllRoutes();
        let successCount = 0;
        let errorCount = 0;
        let warningCount = 0;
        
        // Track duplicates
        const titleMap = new Map<string, string[]>();
        const descriptionMap = new Map<string, string[]>();
        
        console.log(`📄 Prerendering ${routes.length} pages...\n`);
        
        for (const route of routes) {
          try {
            // Render the route
            const result = render(route.path);
            
            // Replace entire root div content using indexOf for reliability
            // The regex /<div id="root">[\s\S]*?<\/div>/ can be greedy with nested divs
            const rootStartTag = '<div id="root">';
            const rootStartIndex = template.indexOf(rootStartTag);
            
            // Find the matching closing </div> by counting nesting
            let depth = 1;
            let searchIndex = rootStartIndex + rootStartTag.length;
            let rootEndIndex = -1;
            
            while (depth > 0 && searchIndex < template.length) {
              const nextOpen = template.indexOf('<div', searchIndex);
              const nextClose = template.indexOf('</div>', searchIndex);
              
              if (nextClose === -1) break;
              
              if (nextOpen !== -1 && nextOpen < nextClose) {
                depth++;
                searchIndex = nextOpen + 4;
              } else {
                depth--;
                if (depth === 0) {
                  rootEndIndex = nextClose + 6; // length of '</div>'
                }
                searchIndex = nextClose + 6;
              }
            }
            
            let html: string;
            if (rootStartIndex !== -1 && rootEndIndex !== -1) {
              html = template.substring(0, rootStartIndex) + 
                     `<div id="root">${result.html}</div>` + 
                     template.substring(rootEndIndex);
            } else {
              // Fallback to regex if parsing fails
              html = template.replace(
                /<div id="root">[\s\S]*?<\/div>/,
                `<div id="root">${result.html}</div>`
              );
            }
            
            // Update all head tags from helmet
            html = replaceHeadTags(html, result.helmet);
            
            // Validate HTML quality with enhanced checks
            const validation = validateHtml(html, route.path);
            
            if (!validation.valid) {
              console.warn(`⚠️  ${route.path}: Validation errors (file will still be written):`);
              validation.errors.forEach(err => console.warn(`   - ${err}`));
              errorCount++;
              // Do NOT skip — always write the file
            }
            
            if (validation.warnings.length > 0) {
              console.warn(`⚠️  ${route.path}: Quality warnings:`);
              validation.warnings.forEach(warn => console.warn(`   - ${warn}`));
              warningCount++;
            }
            
            // Track title and description for duplicate detection
            const title = extractTitle(html);
            const description = extractDescription(html);
            
            if (title) {
              if (!titleMap.has(title)) {
                titleMap.set(title, []);
              }
              titleMap.get(title)!.push(route.path);
            }
            
            if (description) {
              if (!descriptionMap.has(description)) {
                descriptionMap.set(description, []);
              }
              descriptionMap.get(description)!.push(route.path);
            }
            
            // Write the file
            const outputPath = resolve(distDir, route.outputPath);
            const outputDir = dirname(outputPath);
            
            if (!existsSync(outputDir)) {
              mkdirSync(outputDir, { recursive: true });
            }
            
            writeFileSync(outputPath, html);
            
            const sizeKb = (html.length / 1024).toFixed(1);
            const wordInfo = validation.meta.wordCount ? ` | ${validation.meta.wordCount}w` : '';
            console.log(`✓ ${route.path} → ${route.outputPath} (${sizeKb}KB${wordInfo})`);
            successCount++;
            
          } catch (error) {
            console.error(`❌ ${route.path}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            errorCount++;
          }
        }
        
        // ========== Dead Link Validation ==========
        console.log('\n🔗 Validating internal links...');
        
        // Collect all generated paths
        const generatedPaths = new Set<string>();
        routes.forEach(route => {
          let path = route.path;
          // Normalize: remove trailing slash except for root
          if (path !== '/' && path.endsWith('/')) {
            path = path.slice(0, -1);
          }
          generatedPaths.add(path);
        });
        
        // Read generated files and check links
        const deadLinks: Array<{ page: string; link: string }> = [];
        const linkDensityWarnings: Array<{ page: string; count: number }> = [];
        
        for (const route of routes) {
          try {
            const outputPath = resolve(distDir, route.outputPath);
            if (!existsSync(outputPath)) continue;
            
            const html = readFileSync(outputPath, 'utf-8');
            
            // Extract internal links
            const linkRegex = /href="(\/[^"#?]*?)"/g;
            const links: string[] = [];
            let match;
            
            while ((match = linkRegex.exec(html)) !== null) {
              let link = match[1];
              // Normalize
              if (link !== '/' && link.endsWith('/')) {
                link = link.slice(0, -1);
              }
              links.push(link);
            }
            
            // Check for dead links
            const uniqueLinks = [...new Set(links)];
            for (const link of uniqueLinks) {
              if (!generatedPaths.has(link) && !generatedPaths.has(link + '/')) {
                // Skip special paths
                if (link.startsWith('/tel:') || link.startsWith('/mailto:')) continue;
                deadLinks.push({ page: route.path, link });
              }
            }
            
            // Check link density
            if (uniqueLinks.length > 200) {
              linkDensityWarnings.push({ page: route.path, count: uniqueLinks.length });
            }
            
          } catch (e) {
            // Skip read errors
          }
        }
        
        if (deadLinks.length > 0) {
          console.warn(`\n⚠️  Dead links found: ${deadLinks.length}`);
          deadLinks.slice(0, 10).forEach(({ page, link }) => {
            console.warn(`   ${page} → ${link}`);
          });
          if (deadLinks.length > 10) {
            console.warn(`   ... and ${deadLinks.length - 10} more`);
          }
        } else {
          console.log('✓ All internal links valid');
        }
        
        if (linkDensityWarnings.length > 0) {
          console.warn(`\n⚠️  Pages with >200 links:`);
          linkDensityWarnings.forEach(({ page, count }) => {
            console.warn(`   ${page}: ${count} links`);
          });
        }
        
        // Report duplicates
        let duplicateCount = 0;
        titleMap.forEach((paths, title) => {
          if (paths.length > 1) {
            duplicateCount++;
            console.warn(`\n⚠️  Duplicate Title (${paths.length} pages): "${title.slice(0, 50)}..."`);
            paths.slice(0, 3).forEach(p => console.warn(`   - ${p}`));
            if (paths.length > 3) console.warn(`   ... and ${paths.length - 3} more`);
          }
        });
        
        descriptionMap.forEach((paths, desc) => {
          if (paths.length > 1) {
            duplicateCount++;
            console.warn(`\n⚠️  Duplicate Description (${paths.length} pages): "${desc.slice(0, 50)}..."`);
            paths.slice(0, 3).forEach(p => console.warn(`   - ${p}`));
            if (paths.length > 3) console.warn(`   ... and ${paths.length - 3} more`);
          }
        });
        
        console.log(`\n📊 SSG Results:`);
        console.log(`   ✅ Success: ${successCount}`);
        console.log(`   ⚠️  Warnings: ${warningCount}`);
        console.log(`   ❌ Errors: ${errorCount}`);
        console.log(`   🔗 Dead links: ${deadLinks.length}`);
        if (duplicateCount > 0) {
          console.log(`   📋 Duplicate titles/descriptions: ${duplicateCount}`);
        }
        console.log('');
        
        if (successCount > 0) {
          console.log('✅ SSG prerendering complete! Static HTML files generated in dist/\n');
        }
        
        // Fail-fast: only throw in Docker/GitHub Actions builds, NOT in Lovable preview
        // Lovable sets CI=true but doesn't support SSG, so we check for Docker-specific env
        const isDockerCI = !!process.env.GITHUB_ACTIONS || !!process.env.DOCKER_BUILD;
        const criticalPages = [
          'rajony/arbat/index.html',
          'uslugi/dezinsekciya/klopy/index.html',
          'uslugi/dezinsekciya/blohi/index.html',
        ];
        const missingCritical = criticalPages.filter(p => !existsSync(resolve(distDir, p)));
        if (missingCritical.length > 0) {
          const msg = `SSG CRITICAL: Missing critical pages:\n${missingCritical.map(p => `  - ${p}`).join('\n')}`;
          if (isDockerCI) throw new Error(msg);
          else console.warn(msg);
        }

        if (successCount === 0) {
          const msg = 'SSG CRITICAL: Zero pages were generated.';
          if (isDockerCI) throw new Error(msg);
          else console.warn(msg);
        }

      } catch (error) {
        console.error('❌ SSG prerendering failed:', error);
        if (!!process.env.GITHUB_ACTIONS || !!process.env.DOCKER_BUILD) throw error;
      }
    }
  };
}
