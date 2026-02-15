import { writeFileSync } from 'fs';
import { resolve } from 'path';
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

function generateSitemapXml(baseUrl: string, urls: SitemapUrl[]): string {
  const urlEntries = urls.map(url => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
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
  { loc: '/privacy/', lastmod: '', changefreq: 'yearly', priority: '0.2' },
];

// Услуги
const servicesSlugs = [
  'dezinfekciya',
  'dezinsekciya', 
  'deratizaciya',
  'ozonirovanie',
  'dezodoraciya',
  'demerkurizaciya'
];

// Подстраницы услуг
const serviceSubpageRoutes = [
  { parent: 'dezinfekciya', sub: 'kvartir' },
  { parent: 'dezinfekciya', sub: 'ofisov' },
  { parent: 'dezinsekciya', sub: 'unichtozhenie-klopov' },
  { parent: 'dezinsekciya', sub: 'unichtozhenie-tarakanov' },
  { parent: 'deratizaciya', sub: 'unichtozhenie-krys' },
  { parent: 'deratizaciya', sub: 'unichtozhenie-myshej' },
];

// Вредители для дезинсекции
const dezinsekciyaPestSlugs = ['tarakany', 'klopy', 'muravyi', 'blohi', 'mol'];

// Вредители для дератизации
const deratizaciyaPestSlugs = ['krysy', 'myshi'];

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
  'strogino', 'khoroshyovo-mnyovniki', 'shchukino', 'yuzhnoe-tushino',
  // НАО (2) - ИСПРАВЛЕНО!
  'sosenskoe', 'vnukovskoe',
  // ТАО (3) - ИСПРАВЛЕНО!
  'troitsk', 'shcherbinka', 'moskovsky',
  // Зеленоград (5)
  'zelenograd-1', 'zelenograd-2', 'zelenograd-3', 'zelenograd-4', 'zelenograd-5'
];

// Топ-районы для НЧ-страниц
const topNeighborhoods = [
  'arbat', 'tverskoy', 'khamovniki', 'zamoskvorechye', 'presnensky',
  'sokol', 'aeroport', 'babushkinsky', 'izmaylovo', 'sokolniki',
  'maryino', 'lyublino', 'chertanovo-severnoe', 'konkovo', 'strogino'
];

// Типы объектов (синхронизировано с src/data/objects.ts)
const objectSlugs = ['kvartir', 'domov', 'ofisov', 'restoranov', 'skladov', 'proizvodstv'];

// Услуги для объектов (4 основных)
const servicesForObjects = ['dezinsekciya', 'dezinfekciya', 'deratizaciya', 'ozonirovanie'];

// Топ-100 районов для Услуга + Объект + Район
const top100Neighborhoods = neighborhoodSlugs.slice(0, 100);

// Статьи блога (158+ статей)
const blogSlugs = [
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

// Города МО
const moscowRegionCitySlugs = [
  'khimki', 'mytishchi', 'balashikha', 'krasnogorsk', 'podolsk', 
  'korolyov', 'lyubertsy', 'odintsovo', 'dolgoprudny'
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
      
      // ========== SITEMAP-NCH.XML (НЧ-страницы: услуга + вредитель + район = 910 URL) ==========
      const nchUrls: SitemapUrl[] = [];
      
      // Дезинсекция + вредитель + все 130 районов
      dezinsekciyaPestSlugs.forEach(pestSlug => {
        neighborhoodSlugs.forEach(neighborhoodSlug => {
          nchUrls.push({
            loc: `/uslugi/dezinsekciya/${pestSlug}/${neighborhoodSlug}/`,
            lastmod: currentDate,
            changefreq: 'monthly',
            priority: '0.7',
          });
        });
      });
      
      // Дератизация + вредитель + все 130 районов
      deratizaciyaPestSlugs.forEach(pestSlug => {
        neighborhoodSlugs.forEach(neighborhoodSlug => {
          nchUrls.push({
            loc: `/uslugi/deratizaciya/${pestSlug}/${neighborhoodSlug}/`,
            lastmod: currentDate,
            changefreq: 'monthly',
            priority: '0.7',
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
      
      // ========== SITEMAP-SERVICES-DISTRICT.XML (услуга + район = 520 URL) ==========
      const serviceDistrictUrls: SitemapUrl[] = [];
      servicesForObjects.forEach(serviceSlug => {
        neighborhoodSlugs.forEach(districtSlug => {
          serviceDistrictUrls.push({
            loc: `/uslugi/${serviceSlug}/${districtSlug}/`,
            lastmod: currentDate,
            changefreq: 'monthly',
            priority: '0.75',
          });
        });
      });
      
      // ========== SITEMAP-SERVICES-OBJECT-DISTRICT.XML (услуга + объект + район = 2,400 URL) ==========
      const serviceObjectDistrictUrls: SitemapUrl[] = [];
      servicesForObjects.forEach(serviceSlug => {
        objectSlugs.forEach(objectSlug => {
          top100Neighborhoods.forEach(districtSlug => {
            serviceObjectDistrictUrls.push({
              loc: `/uslugi/${serviceSlug}/${objectSlug}/${districtSlug}/`,
              lastmod: currentDate,
              changefreq: 'monthly',
              priority: '0.7',
            });
          });
        });
      });
      
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
        { filename: 'sitemap-services-district.xml', urls: serviceDistrictUrls },
        { filename: 'sitemap-services-object-district.xml', urls: serviceObjectDistrictUrls },
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

