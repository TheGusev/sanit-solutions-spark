import { writeFileSync } from 'fs';
import { resolve } from 'path';
import type { Plugin } from 'vite';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
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

// Единый источник истины для всех маршрутов (синхронизирован с vite-plugin-ssg.ts и src/lib/seoRoutes.ts)

// Статические страницы
const staticUrls: SitemapUrl[] = [
  { loc: '/', lastmod: '', changefreq: 'weekly', priority: '1.0' },
  { loc: '/contacts', lastmod: '', changefreq: 'monthly', priority: '0.8' },
  { loc: '/blog', lastmod: '', changefreq: 'weekly', priority: '0.7' },
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

// Округа Москвы
const districtSlugs = [
  'cao', 'sao', 'svao', 'vao', 'yuvao', 'yao', 'yzao', 'zao', 'szao', 'nao', 'tao', 'zelao'
];

// Районы Москвы (125 районов)
const neighborhoodSlugs = [
  'arbat', 'basmannyj', 'zamoskvorechye', 'krasnoselskij', 'meshchanskij',
  'presnenskij', 'taganskij', 'tverskoy', 'hamovniki', 'yakimanka',
  'aeroport', 'begovoy', 'beskudnikovskij', 'vojkovskij', 'vostochnoe-degunino',
  'golovinskij', 'dmitrovskij', 'zapadnoe-degunino', 'koptevo', 'levoberezhnyj',
  'molzhaninovskij', 'savelovskij', 'sokol', 'timiryazevskij', 'hovrino', 'horoshevskij',
  'altufevskij', 'babushkinskij', 'bibirevo', 'butyrskij', 'lianozovo',
  'losinoostrovskij', 'marfino', 'marina-roshcha', 'ostankinskij', 'otradnoe',
  'rostokino', 'sviblovo', 'severnyj', 'severnoe-medvedkovo', 'yuzhnoe-medvedkovo',
  'yaroslavskij', 'alekseevskij',
  'bogorodskoe', 'veshnyaki', 'vostochnoe-izmajlovo', 'vostochnyj', 'golyanovo',
  'ivanovskoe', 'izmajlovo', 'kosino-uhtomskij', 'metrogorodok', 'novogireevo',
  'novokosino', 'perovo', 'preobrazhenskoe', 'severnoe-izmajlovo', 'sokolinaya-gora', 'sokolniki',
  'vyhino-zhulebino', 'kapotnya', 'kuzminki', 'lefortovo', 'lyublino',
  'marino', 'nekrasovka', 'nizhegorodskij', 'pechatniki', 'ryazanskij',
  'tekstilshchiki', 'yuzhno-portovyj',
  'biryulevo-vostochnoe', 'biryulevo-zapadnoe', 'brateevo', 'danilovskij', 'donskoj',
  'zyablikovo', 'moskvorechye-saburovo', 'nagatino-sadovniki', 'nagatinskij-zaton',
  'nagornyj', 'orehovo-borisovo-severnoe', 'orehovo-borisovo-yuzhnoe', 'caricyno',
  'chertanovo-severnoe', 'chertanovo-centralnoe', 'chertanovo-yuzhnoe',
  'akademicheskij', 'gagarinskij', 'zyuzino', 'konkovo', 'kotlovka',
  'lomonosovskij', 'obruchevskij', 'severnoe-butovo', 'teplyj-stan',
  'cheryomushki', 'yuzhnoe-butovo', 'yasenevo',
  'vnukovo', 'dorogomilovo', 'krylatskoe', 'kuntsevo', 'mozhajskij',
  'novo-peredelkino', 'ochakovo-matveevskoe', 'prospekt-vernadskogo', 'ramenki',
  'solncevo', 'troparyovo-nikulino', 'filyovskij-park', 'fili-davydkovo',
  'kurkino', 'mitino', 'pokrovskoe-streshnevo', 'severnoe-tushino',
  'strogino', 'horoshevo-mnevniki', 'shchukino', 'yuzhnoe-tushino',
  'sosenskoe', 'vnukovskoe', 'voronovskoe', 'desenovskoe', 'kievskij',
  'kokoshkino', 'marushkinskoe', 'moskovskij',
  'troitsk', 'shcherbinka', 'filimonkovskoe', 'pervomajskoe', 'novofeodorovskoe',
  'rogovskoe', 'krasnopahorskoe', 'klenovskoe', 'shhapovskoe', 'voskresenskoe',
  'zelao-1', 'zelao-2', 'zelao-3', 'zelao-4', 'zelao-5'
];

// Статьи блога
const blogSlugs = [
  'kak-podgotovit-pomeshchenie',
  'vidy-dezinfekcii',
  'borba-s-tarakanami',
  'ozonirovaniye-pomeshcheniy',
  'gryzuny-v-dome',
  'sezonnost-vreditelej',
  'dezinfekciya-ofisa',
  'klopy-v-kvartire',
];

export function sitemapPlugin(): Plugin {
  return {
    name: 'generate-sitemap',
    apply: 'build',
    closeBundle() {
      const baseUrl = 'https://goruslugimsk.ru';
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Обновляем lastmod для статических страниц
      const updatedStaticUrls = staticUrls.map(url => ({
        ...url,
        lastmod: currentDate
      }));
      
      // Услуги (высокий приоритет - коммерческие страницы)
      const serviceUrls: SitemapUrl[] = servicesSlugs.map(slug => ({
        loc: `/uslugi/${slug}`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.9',
      }));

      // Подстраницы услуг (коммерческие страницы высокого приоритета)
      const subpageUrls: SitemapUrl[] = serviceSubpageRoutes.map(({ parent, sub }) => ({
        loc: `/uslugi/${parent}/${sub}`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.85',
      }));

      // Страницы округов
      const districtUrls: SitemapUrl[] = [
        { loc: '/uslugi/po-okrugam-moskvy', lastmod: currentDate, changefreq: 'monthly', priority: '0.85' },
        ...districtSlugs.map(d => ({
          loc: `/uslugi/dezinfekciya-${d}`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: '0.85',
        }))
      ];
      
      // Статьи блога (контентные страницы)
      const blogUrls: SitemapUrl[] = blogSlugs.map(slug => ({
        loc: `/blog/${slug}`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.6',
      }));
      
      // Страницы районов (локальное SEO)
      const neighborhoodUrls: SitemapUrl[] = [
        { loc: '/rajony', lastmod: currentDate, changefreq: 'monthly', priority: '0.85' },
        ...neighborhoodSlugs.map(slug => ({
          loc: `/rajony/${slug}`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: '0.75',
        }))
      ];
      
      // Генерация XML
      const allUrls = [...updatedStaticUrls, ...serviceUrls, ...subpageUrls, ...districtUrls, ...blogUrls, ...neighborhoodUrls];
      const xml = generateSitemapXml(baseUrl, allUrls);
      
      writeFileSync(resolve('dist/sitemap.xml'), xml);
      console.log('✓ sitemap.xml generated with', allUrls.length, 'URLs');
    }
  };
}
