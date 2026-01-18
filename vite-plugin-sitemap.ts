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
  'cao', 'sao', 'svao', 'vao', 'yuvao', 'yao', 'yzao', 'zao', 'szao'
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
      
      // Генерация XML
      const allUrls = [...updatedStaticUrls, ...serviceUrls, ...subpageUrls, ...districtUrls, ...blogUrls];
      const xml = generateSitemapXml(baseUrl, allUrls);
      
      writeFileSync(resolve('dist/sitemap.xml'), xml);
      console.log('✓ sitemap.xml generated with', allUrls.length, 'URLs');
    }
  };
}
