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

export function sitemapPlugin(): Plugin {
  return {
    name: 'generate-sitemap',
    apply: 'build',
    closeBundle() {
      const baseUrl = 'https://goruslugimsk.ru';
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Статические страницы
      const staticUrls: SitemapUrl[] = [
        { loc: '/', lastmod: currentDate, changefreq: 'weekly', priority: '1.0' },
        { loc: '/contacts', lastmod: currentDate, changefreq: 'monthly', priority: '0.8' },
        { loc: '/blog', lastmod: currentDate, changefreq: 'weekly', priority: '0.7' },
        { loc: '/privacy', lastmod: currentDate, changefreq: 'yearly', priority: '0.2' },
      ];
      
      // Услуги (высокий приоритет - коммерческие страницы)
      const services = [
        'dezinfekciya',
        'dezinsekciya', 
        'deratizaciya',
        'ozonirovanie',
        'dezodoraciya',
        'sertifikaciya'
      ];
      const serviceUrls: SitemapUrl[] = services.map(slug => ({
        loc: `/uslugi/${slug}`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.9',
      }));

      // Страницы округов
      const districts = ['cao', 'sao', 'svao', 'vao', 'yuvao', 'yao', 'yzao', 'zao', 'szao'];
      const districtUrls: SitemapUrl[] = [
        { loc: '/uslugi/po-okrugam-moskvy', lastmod: currentDate, changefreq: 'monthly', priority: '0.85' },
        ...districts.map(d => ({
          loc: `/uslugi/dezinfekciya-${d}`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: '0.85',
        }))
      ];
      
      // Статьи блога (контентные страницы)
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
      const blogUrls: SitemapUrl[] = blogSlugs.map(slug => ({
        loc: `/blog/${slug}`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.6',
      }));
      
      // Генерация XML
      const allUrls = [...staticUrls, ...serviceUrls, ...districtUrls, ...blogUrls];
      const xml = generateSitemapXml(baseUrl, allUrls);
      
      writeFileSync(resolve('dist/sitemap.xml'), xml);
      console.log('✓ sitemap.xml generated with', allUrls.length, 'URLs');
    }
  };
}
