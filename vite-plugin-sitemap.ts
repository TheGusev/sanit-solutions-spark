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
  { loc: '/contacts', lastmod: '', changefreq: 'monthly', priority: '0.8' },
  { loc: '/blog', lastmod: '', changefreq: 'weekly', priority: '0.7' },
  { loc: '/rajony', lastmod: '', changefreq: 'monthly', priority: '0.85' },
  { loc: '/moscow-oblast', lastmod: '', changefreq: 'monthly', priority: '0.8' },
  { loc: '/uslugi/po-okrugam-moskvy', lastmod: '', changefreq: 'monthly', priority: '0.85' },
  { loc: '/privacy', lastmod: '', changefreq: 'yearly', priority: '0.2' },
];

// Услуги
const servicesSlugs = [
  'dezinfekciya',
  'dezinsekciya', 
  'deratizaciya',
  'ozonirovanie',
  'dezodoraciya',
  'sertifikaciya'
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

// Районы Москвы (125 районов) - синхронизировано с src/data/neighborhoods.ts
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
  // НАО (8)
  'sosenskoe', 'vnukovskoe', 'voronovskoe', 'desenovskoe', 'kievsky',
  'kokoshkino', 'marushkinskoe', 'moskovsky',
  // ТАО (10)
  'troitsk', 'shcherbinka', 'filimonkovskoe', 'pervomayskoe', 'novofeodorovskoe',
  'rogovskoe', 'krasnopakhorskoe', 'klenovskoe', 'shchapovskoe', 'voskresenskoe',
  // Зеленоград (5)
  'zelenograd-1', 'zelenograd-2', 'zelenograd-3', 'zelenograd-4', 'zelenograd-5'
];

// Топ-районы для НЧ-страниц
const topNeighborhoods = [
  'arbat', 'tverskoy', 'khamovniki', 'zamoskvorechye', 'presnensky',
  'sokol', 'aeroport', 'babushkinsky', 'izmaylovo', 'sokolniki',
  'maryino', 'lyublino', 'chertanovo-severnoe', 'konkovo', 'strogino'
];

// Статьи блога (50 статей)
const blogSlugs = [
  // Оригинальные 8 статей
  'kak-podgotovit-pomeshchenie',
  'vidy-dezinfekcii',
  'borba-s-tarakanami',
  'ozonirovaniye-pomeshcheniy',
  'gryzuny-v-dome',
  'sezonnost-vreditelej',
  'dezinfekciya-ofisa',
  'klopy-v-kvartire',
  // Дополнительные 12 статей
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
          loc: `/uslugi/${slug}`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: '0.9',
        })),
        // Подстраницы услуг
        ...serviceSubpageRoutes.map(({ parent, sub }) => ({
          loc: `/uslugi/${parent}/${sub}`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: '0.85',
        })),
      ];
      
      // ========== SITEMAP-SERVICES-PEST.XML (услуга + вредитель) ==========
      const servicePestUrls: SitemapUrl[] = [
        // Дезинсекция + вредители
        ...dezinsekciyaPestSlugs.map(pestSlug => ({
          loc: `/uslugi/dezinsekciya/${pestSlug}`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: '0.85',
        })),
        // Дератизация + вредители
        ...deratizaciyaPestSlugs.map(pestSlug => ({
          loc: `/uslugi/deratizaciya/${pestSlug}`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: '0.85',
        })),
      ];
      
      // ========== SITEMAP-MOSCOW.XML (округа + районы) ==========
      const moscowUrls: SitemapUrl[] = [
        // Страницы округов (dezinfekciya-cao и т.д.)
        ...districtSlugs.map(d => ({
          loc: `/uslugi/dezinfekciya-${d}`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: '0.85',
        })),
        // Страницы районов
        ...neighborhoodSlugs.map(slug => ({
          loc: `/rajony/${slug}`,
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
          loc: `/moscow-oblast/${citySlug}`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: '0.8',
        });
        
        // Услуги в городах МО
        moscowRegionServices.forEach(serviceSlug => {
          moscowRegionUrls.push({
            loc: `/moscow-oblast/${citySlug}/${serviceSlug}`,
            lastmod: currentDate,
            changefreq: 'monthly',
            priority: '0.75',
          });
        });
      });
      
      // ========== SITEMAP-NCH.XML (НЧ-страницы: услуга + вредитель + район = 875 URL) ==========
      const nchUrls: SitemapUrl[] = [];
      
      // Дезинсекция + вредитель + все 125 районов
      dezinsekciyaPestSlugs.forEach(pestSlug => {
        neighborhoodSlugs.forEach(neighborhoodSlug => {
          nchUrls.push({
            loc: `/uslugi/dezinsekciya/${pestSlug}/${neighborhoodSlug}`,
            lastmod: currentDate,
            changefreq: 'monthly',
            priority: '0.7',
          });
        });
      });
      
      // Дератизация + вредитель + все 125 районов
      deratizaciyaPestSlugs.forEach(pestSlug => {
        neighborhoodSlugs.forEach(neighborhoodSlug => {
          nchUrls.push({
            loc: `/uslugi/deratizaciya/${pestSlug}/${neighborhoodSlug}`,
            lastmod: currentDate,
            changefreq: 'monthly',
            priority: '0.7',
          });
        });
      });
      
      // ========== SITEMAP-BLOG.XML (блог) ==========
      const blogUrls: SitemapUrl[] = blogSlugs.map(slug => ({
        loc: `/blog/${slug}`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.6',
      }));
      
      // ========== Генерация файлов ==========
      const sitemapCategories: SitemapCategory[] = [
        { filename: 'sitemap-main.xml', urls: mainUrls },
        { filename: 'sitemap-services.xml', urls: serviceUrls },
        { filename: 'sitemap-services-pest.xml', urls: servicePestUrls },
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
