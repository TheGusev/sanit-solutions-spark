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

// Статьи блога (20 статей)
const blogSlugs = [
  'kak-podgotovit-pomeshchenie',
  'vidy-dezinfekcii',
  'borba-s-tarakanami',
  'ozonirovaniye-pomeshcheniy',
  'gryzuny-v-dome',
  'sezonnost-vreditelej',
  'dezinfekciya-ofisa',
  'klopy-v-kvartire',
  // 12 новых статей
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
