import { writeFileSync } from 'fs'
  ;import { resolve } from 'path';
import type { Plugin } from 'vite';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

interface SitemapCategory {
  filename: string;
  urls: SitemapUrl[];
}

function normalizeLocWithTrailingSlash(loc: string): string {
  if (loc === '/') return loc;
  return loc.endsWith('/') ? loc : `${loc}/`;
}

function generateSitemapXml(baseUrl: string, urls: SitemapUrl[]): string {
  const urlEntries = urls.map(url => `  <url>
    <loc>${baseUrl}${normalizeLocWithTrailingSlash(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

function generateSitemapIndex(baseUrl: string, filenames: string[], lastmod: string): string {
  const sitemapEntries = filenames.map(filename => `  <sitemap>
    <loc>${baseUrl}/${filename}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
}

// Единый источник истины для всех маршрутов (синхронизирован с vite-plugin-ssg.ts и src/lib/seoRoutes.ts)

// Статические страницы
const staticUrls: SitemapUrl[] = [
  { loc: '/', lastmod: '', changefreq: 'weekly', priority: '1.0' },
  { loc: '/contacts/', lastmod: '', changefreq: 'monthly', priority: '0.8' },
  { loc: '/blog/', lastmod: '', changefreq: 'weekly', priority: '0.7' },
  { loc: '/rajony/', lastmod: '', changefreq: 'monthly', priority: '0.85' },
  { loc: '/moscow-oblast/', lastmod: '', changefreq: 'monthly', priority: '0.8' },
  { loc: '/uslugi/po-okrugam-moskvy/', lastmod: '', changefreq: 'monthly', priority: '0.85' },
  
  { loc: '/sluzhba-dezinsekcii/', lastmod: '', changefreq: 'monthly', priority: '0.85' },
  { loc: '/otzyvy/', lastmod: '', changefreq: 'weekly', priority: '0.7' },
  { loc: '/uslugi/obrabotka-uchastkov/', lastmod: '', changefreq: 'monthly', priority: '0.85' },
  { loc: '/team/', lastmod: '', changefreq: 'monthly', priority: '0.5' },
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

// Подстраницы услуг
const serviceSubpageRoutes = [
  { parent: 'dezinfekciya', sub: 'kvartir' },
  { parent: 'dezinfekciya', sub: 'ofisov' },
  { parent: 'dezinsekciya', sub: 'unichtozhenie-klopov' },
  { parent: 'dezinsekciya', sub: 'unichtozhenie-tarakanov' },
  { parent: 'deratizaciya', sub: 'unichtozhenie-krys' },
  { parent: 'deratizaciya', sub: 'unichtozhenie-myshej' },
  // Phase 1: новые подстраницы
  { parent: 'dezinsekciya', sub: 'klopov-v-kvartire' },
  { parent: 'dezinsekciya', sub: 'postelnyh-klopov' },
  { parent: 'dezinsekciya', sub: 'domashnih-klopov' },
  { parent: 'dezinsekciya', sub: 'tarakanov-v-kvartire' },
  // REMOVED: klopov-i-tarakanov, klopov-i-bloh — cannibalizes pest clusters (Issue #5)
  { parent: 'dezinsekciya', sub: 'blokh-ot-zhivotnyh' },
  { parent: 'dezinsekciya', sub: 'holodnym-tumanom' },
  { parent: 'dezinsekciya', sub: 'parom' },
  { parent: 'dezinsekciya', sub: 'parogeneratorom' },
  { parent: 'dezinsekciya', sub: 'bez-zapaha' },
  { parent: 'dezinsekciya', sub: 'srochno' },
  { parent: 'dezinsekciya', sub: 'kruglosutochno' },
];

// Вредители для дезинсекции
const dezinsekciyaPestSlugs = [
  'tarakany', 'klopy', 'muravyi', 'blohi', 'mol',
  'komary', 'muhi', 'osy-shershni', 'cheshuynitsy', 'kleshchi', 'mokricy'
];

// Вредители для дератизации
const deratizaciyaPestSlugs = ['krysy', 'myshi', 'kroty'];

// Tiered pest groups
const tier1Pests = ['tarakany', 'klopy', 'krysy', 'myshi'];
const tier2PestsList = ['muravyi', 'blohi', 'mol', 'kroty'];
const tier3PestsList = ['komary', 'muhi', 'osy-shershni', 'cheshuynitsy', 'kleshchi', 'mokricy'];

// Округа Москвы
const districtSlugs = [
  'cao', 'sao', 'svao', 'vao', 'yuvao', 'yao', 'yzao', 'zao', 'szao', 'nao', 'tao', 'zelao'
];

// Районы Москвы (130 районов) - синхронизировано с src/data/neighborhoods.ts
const neighborhoodSlugs = [
  // ЦАО (10)
  'arbat', 'basmannyy', 'zamoskvorechye', 'krasnoselsky', 'meshchansky',
  'presnensky', 'tagansky', 'tverskoy', 'khamovniki', 'yakimanka',
  // САО (16)
  'aeroport', 'begovoy', 'beskudnikovsky', 'voykovskiy', 'vostochnoe-degunino',
  'golovinsky', 'dmitrovsky', 'zapadnoe-degunino', 'koptevo', 'levoberezhny',
  'molzhaninovsky', 'savelovsky', 'sokol', 'timiryazevsky', 'khovrino', 'khoroshevsky',
  // СВАО (17)
  'altufyevsky', 'babushkinsky', 'bibirevo', 'butyrsky', 'lianozovo',
  'losinoostrovskiy', 'marfino', 'marina-roshcha', 'ostankinsky', 'otradnoe',
  'rostokino', 'sviblovo', 'severny', 'severnoe-medvedkovo', 'yuzhnoe-medvedkovo',
  'yaroslavsky', 'severny-rayon',
  // ВАО (16)
  'bogorodskoe', 'veshnyaki', 'vostochnoe-izmaylovo', 'vostochny', 'golyanovo',
  'ivanovskoe', 'izmaylovo', 'kosino-ukhtomsky', 'metrogorodok', 'novogireevo',
  'novokosino', 'perovo', 'preobrazhenskoe', 'severnoe-izmaylovo', 'sokolinaya-gora', 'sokolniki',
  // ЮВАО (12)
  'vykhino-zhulebino', 'kapotnya', 'kuzminki', 'lefortovo', 'lyublino',
  'maryino', 'nekrasovka', 'nizhegorodsky', 'pechatniki', 'ryazansky',
  'tekstilshchiki', 'yuzhnoport',
  // ЮАО (16)
  'biryulyovo-vostochnoe', 'biryulyovo-zapadnoe', 'brateevo', 'danilovsky', 'donskoy',
  'zyablikovo', 'moskvorechye-saburovo', 'nagatino-sadovniki', 'nagatinsky-zaton',
  'nagorny', 'orekhovo-borisovo-severnoe', 'orekhovo-borisovo-yuzhnoe', 'tsaritsyno',
  'chertanovo-severnoe', 'chertanovo-tsentralnoe', 'chertanovo-yuzhnoe',
  // ЮЗАО (12)
  'akademichesky', 'gagarinsky', 'zyuzino', 'konkovo', 'kotlovka',
  'lomonosovsky', 'obruchevsky', 'severnoe-butovo', 'tyoply-stan',
  'cheryomushki', 'yuzhnoe-butovo', 'yasenevo',
  // ЗАО (13)
  'vnukovo', 'dorogomilovo', 'krylatskoe', 'kuntsevo', 'mozhaysky',
  'novo-peredelkino', 'ochakovo-matveevskoe', 'prospekt-vernadskogo', 'ramenki',
  'solntsevo', 'troparyovo-nikulino', 'filyovsky-park', 'fili-davydkovo',
  // СЗАО (8)
  'kurkino', 'mitino', 'pokrovskoe-streshnevo', 'severnoe-tushino',
  'strogino', 'khoroshevo-mnevniki', 'shchukino', 'yuzhnoe-tushino',
  // НАО (2) - ИСПРАВЛЕНО!
  'sosenskoe', 'vnukovskoe',
  // ТАО (3) - ИСПРАВЛЕНО!
  'troitsk', 'shcherbinka', 'moskovsky',
  // Зеленоград (5)
  'zelenograd-1', 'zelenograd-2', 'zelenograd-3', 'zelenograd-4', 'zelenograd-5'
];

// Топ-районы для НЧ-страниц — tiered model
const topNeighborhoods = [
  'arbat', 'tverskoy', 'khamovniki', 'zamoskvorechye', 'presnensky',
  'sokol', 'aeroport', 'babushkinsky', 'izmaylovo', 'sokolniki',
  'maryino', 'lyublino', 'chertanovo-severnoe', 'konkovo', 'strogino'
];

const tier2Neighborhoods = [
  ...topNeighborhoods,
  'basmannyy', 'tagansky', 'yakimanka', 'voykovskiy', 'koptevo',
  'khovrino', 'otradnoe', 'bibirevo', 'altufyevsky', 'perovo',
  'novogireevo', 'kuzminki', 'pechatniki', 'tekstilshchiki', 'danilovsky',
  'zyablikovo', 'tsaritsyno', 'akademichesky', 'cheryomushki', 'yasenevo',
  'kuntsevo', 'solntsevo', 'mitino', 'kurkino', 'nekrasovka',
];

// Типы объектов
const objectSlugs = ['kvartir', 'domov', 'ofisov', 'restoranov', 'skladov', 'proizvodstv', 'gostinic', 'detskih-sadov', 'hostela', 'magazinov', 'avtomobiley'];

// Услуги для объектов
const servicesForObjects = ['dezinsekciya', 'dezinfekciya', 'deratizaciya', 'ozonirovanie', 'demerkurizaciya'];


// Статьи блога — синхронизировано с seoRoutes.ts blogArticleSlugs
const blogSlugs = [
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
  'skolko-stoit-obrabotka-tarakany', 'skolko-stoit-obrabotka-klopy', 'skolko-stoit-obrabotka-muravyi', 'skolko-stoit-obrabotka-blohi', 'skolko-stoit-obrabotka-mol',
  // ===== Pest articles: rodents (10 = 5 templates × 2 pests) =====
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

// Города МО
const moscowRegionCitySlugs = [
  'khimki', 'mytishchi', 'balashikha', 'krasnogorsk', 'podolsk', 
  'korolyov', 'lyubertsy', 'odintsovo', 'dolgoprudny', 'shchyolkovo',
  'klin', 'ramenskoe', 'chekhov', 'domodedovo'
];

// Услуги МО
const moscowRegionServices = ['dezinsekciya', 'dezinfekciya', 'deratizaciya', 'ozonirovanie'];

export function sitemapPlugin(): Plugin {
  return {
    name: 'generate-sitemap',
    apply: 'build',
    closeBundle() {
      const baseUrl = 'https://goruslugimsk.ru';
      const currentDate = new Date().toISOString().split('T')[0];
      
      // ========== SITEMAP-MAIN.XML (главные страницы) ==========
      const mainUrls: SitemapUrl[] = staticUrls.map(url => ({
        ...url,
        lastmod: currentDate
      }));
      
      // ========== SITEMAP-SERVICES.XML (услуги + подстраницы) ==========
      const serviceUrls: SitemapUrl[] = [
        // Основные услуги
        ...servicesSlugs.map(slug => ({
          loc: `/uslugi/${slug}/`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: '0.9',
        })),
        // Подстраницы услуг
        ...serviceSubpageRoutes.map(({ parent, sub }) => ({
          loc: `/uslugi/${parent}/${sub}/`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: '0.85',
        })),
      ];
      
      // ========== SITEMAP-SERVICES-PEST.XML (услуга + вредитель) ==========
      const servicePestUrls: SitemapUrl[] = [
        // Дезинсекция + вредители
        ...dezinsekciyaPestSlugs.map(pestSlug => ({
          loc: `/uslugi/dezinsekciya/${pestSlug}/`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: '0.85',
        })),
        // Дератизация + вредители
        ...deratizaciyaPestSlugs.map(pestSlug => ({
          loc: `/uslugi/deratizaciya/${pestSlug}/`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: '0.85',
        })),
      ];
      
      // ========== SITEMAP-MOSCOW.XML (округа + районы) ==========
      const moscowUrls: SitemapUrl[] = [
        // Страницы округов (dezinfekciya-cao и т.д.)
        ...districtSlugs.map(d => ({
          loc: `/uslugi/dezinfekciya-${d}/`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: '0.85',
        })),
        // Страницы районов
        ...neighborhoodSlugs.map(slug => ({
          loc: `/rajony/${slug}/`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: '0.75',
        })),
      ];
      
      // ========== SITEMAP-MOSCOW-REGION.XML (города МО) ==========
      const moscowRegionUrls: SitemapUrl[] = [];
      
      // Города МО
      moscowRegionCitySlugs.forEach(citySlug => {
        moscowRegionUrls.push({
          loc: `/moscow-oblast/${citySlug}/`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: '0.8',
        });
        
        // Услуги в городах МО
        moscowRegionServices.forEach(serviceSlug => {
          moscowRegionUrls.push({
            loc: `/moscow-oblast/${citySlug}/${serviceSlug}/`,
            lastmod: currentDate,
            changefreq: 'monthly',
            priority: '0.75',
          });
        });
      });
      
      // ========== SITEMAP-NCH.XML (НЧ-страницы: tiered model ~774 URL) ==========
      const nchUrls: SitemapUrl[] = [];
      
      // Tier 1: top 4 pests × all neighborhoods
      tier1Pests.forEach(pestSlug => {
        const service = deratizaciyaPestSlugs.includes(pestSlug) ? 'deratizaciya' : 'dezinsekciya';
        neighborhoodSlugs.forEach(nhoodSlug => {
          nchUrls.push({
            loc: `/uslugi/${service}/${pestSlug}/${nhoodSlug}/`,
            lastmod: currentDate,
            changefreq: 'monthly',
            priority: '0.7',
          });
        });
      });
      
      // Tier 2: next 4 pests × top 40 neighborhoods
      tier2PestsList.forEach(pestSlug => {
        const service = deratizaciyaPestSlugs.includes(pestSlug) ? 'deratizaciya' : 'dezinsekciya';
        tier2Neighborhoods.forEach(nhoodSlug => {
          nchUrls.push({
            loc: `/uslugi/${service}/${pestSlug}/${nhoodSlug}/`,
            lastmod: currentDate,
            changefreq: 'monthly',
            priority: '0.65',
          });
        });
      });
      
      // Tier 3: remaining 6 pests × top 15 neighborhoods
      tier3PestsList.forEach(pestSlug => {
        topNeighborhoods.forEach(nhoodSlug => {
          nchUrls.push({
            loc: `/uslugi/dezinsekciya/${pestSlug}/${nhoodSlug}/`,
            lastmod: currentDate,
            changefreq: 'monthly',
            priority: '0.6',
          });
        });
      });
      
      // ========== SITEMAP-SERVICES-OBJECT.XML (услуга + объект = 24 URL) ==========
      const serviceObjectUrls: SitemapUrl[] = [];
      servicesForObjects.forEach(serviceSlug => {
        objectSlugs.forEach(objectSlug => {
          serviceObjectUrls.push({
            loc: `/uslugi/${serviceSlug}/${objectSlug}/`,
            lastmod: currentDate,
            changefreq: 'monthly',
            priority: '0.8',
          });
        });
      });
      
      // УДАЛЕНО: sitemap-services-district.xml (520 doorway-страниц удалены Day 3-4)
      
      
      // ========== SITEMAP-BLOG.XML (блог) ==========
      const blogUrls: SitemapUrl[] = blogSlugs.map(slug => ({
        loc: `/blog/${slug}/`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.6',
      }));
      
      // ========== Генерация файлов ==========
      const sitemapCategories: SitemapCategory[] = [
        { filename: 'sitemap-main.xml', urls: mainUrls },
        { filename: 'sitemap-services.xml', urls: serviceUrls },
        { filename: 'sitemap-services-pest.xml', urls: servicePestUrls },
        { filename: 'sitemap-services-object.xml', urls: serviceObjectUrls },
        { filename: 'sitemap-moscow.xml', urls: moscowUrls },
        { filename: 'sitemap-moscow-region.xml', urls: moscowRegionUrls },
        { filename: 'sitemap-nch.xml', urls: nchUrls },
        { filename: 'sitemap-blog.xml', urls: blogUrls },
      ];
      
      let totalUrls = 0;
      const filenames: string[] = [];
      
      sitemapCategories.forEach(category => {
        const xml = generateSitemapXml(baseUrl, category.urls);
        writeFileSync(resolve('dist', category.filename), xml);
        totalUrls += category.urls.length;
        filenames.push(category.filename);
        console.log(`✓ ${category.filename} generated with ${category.urls.length} URLs`);
      });
      
      // Генерация sitemap-index.xml
      const indexXml = generateSitemapIndex(baseUrl, filenames, currentDate);
      writeFileSync(resolve('dist/sitemap-index.xml'), indexXml);
      console.log(`✓ sitemap-index.xml generated with ${filenames.length} sitemaps`);
      
      // Также создаём sitemap.xml как алиас для обратной совместимости
      writeFileSync(resolve('dist/sitemap.xml'), indexXml);
      console.log(`✓ sitemap.xml (alias) generated`);
      
      console.log(`\n📊 Sitemap Summary:`);
      console.log(`   Total sitemaps: ${filenames.length}`);
      console.log(`   Total URLs: ${totalUrls}`);
      console.log('');
    }
  };
}

