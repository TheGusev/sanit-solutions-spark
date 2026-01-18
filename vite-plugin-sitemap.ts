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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
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
      
      // === СТАТИЧЕСКИЕ СТРАНИЦЫ ===
      const staticUrls: SitemapUrl[] = [
        { loc: '/', lastmod: currentDate, changefreq: 'daily', priority: '1.0' },
        { loc: '/ceny', lastmod: currentDate, changefreq: 'weekly', priority: '0.9' },
        { loc: '/contacts', lastmod: currentDate, changefreq: 'monthly', priority: '0.8' },
        { loc: '/blog', lastmod: currentDate, changefreq: 'daily', priority: '0.8' },
        { loc: '/privacy', lastmod: currentDate, changefreq: 'yearly', priority: '0.2' },
      ];
      
      // === ОСНОВНЫЕ УСЛУГИ (высокий приоритет) ===
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
        changefreq: 'weekly',
        priority: '0.9',
      }));
      
      // === ПОДСТРАНИЦЫ УСЛУГ ===
      const subpages = [
        // Дезинфекция
        { category: 'dezinfekciya', slug: 'kvartir' },
        { category: 'dezinfekciya', slug: 'ofisov' },
        { category: 'dezinfekciya', slug: 'domov' },
        { category: 'dezinfekciya', slug: 'skladov' },
        { category: 'dezinfekciya', slug: 'magazinov' },
        { category: 'dezinfekciya', slug: 'holodnyj-tuman' },
        { category: 'dezinfekciya', slug: 'goryachij-tuman' },
        // Дезинсекция
        { category: 'dezinsekciya', slug: 'unichtozhenie-klopov' },
        { category: 'dezinsekciya', slug: 'unichtozhenie-tarakanov' },
        { category: 'dezinsekciya', slug: 'unichtozhenie-muravev' },
        { category: 'dezinsekciya', slug: 'unichtozhenie-bloh' },
        { category: 'dezinsekciya', slug: 'unichtozhenie-komarov' },
        { category: 'dezinsekciya', slug: 'unichtozhenie-muh' },
        // Дератизация
        { category: 'deratizaciya', slug: 'unichtozhenie-myshej' },
        { category: 'deratizaciya', slug: 'unichtozhenie-krys' },
      ];
      const subpageUrls: SitemapUrl[] = subpages.map(page => ({
        loc: `/uslugi/${page.category}/${page.slug}`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.8',
      }));
      
      // === ГЕО-СТРАНИЦЫ (9 округов x 3 услуги = 27 страниц) ===
      const districts = ['cao', 'sao', 'svao', 'vao', 'uvao', 'uao', 'uzao', 'zao', 'szao'];
      const geoServices = ['dezinfekciya', 'dezinsekciya', 'deratizaciya'];
      const geoUrls: SitemapUrl[] = districts.flatMap(district =>
        geoServices.map(service => ({
          loc: `/uslugi/${service}-${district}`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: '0.7',
        }))
      );
      
      // === СТАТЬИ БЛОГА ===
      const blogSlugs = [
        'kak-podgotovit-pomeshchenie',
        'vidy-dezinfekcii',
        'borba-s-tarakanami',
        'ozonirovaniye-pomeshcheniy',
        'gryzuny-v-dome',
        'sezonnost-vreditelej',
        'dezinfekciya-ofisa',
        'klopy-v-kvartire',
        // Новые статьи
        'kak-izbavitsya-ot-klopov',
        'effektivnye-metody-borby-s-tarakanami',
        'unichtozhenie-muravev-v-dome',
        'kak-izbavitsya-ot-bloh',
        'borba-s-komarami-na-uchastke',
        'unichtozhenie-muh-v-pomeshchenii',
        'mol-v-kvartire',
        'chem-opasny-klopy',
        'zhiznennyj-cikl-tarakana',
        'muravi-v-dome-prichiny-i-resheniya',
        'blohi-ot-zhivotnyh',
        'komary-perenoschiki-boleznej',
        'platyanaya-mol',
        'pishchevaya-mol',
        'moshki-v-cvetah',
        'kleshchi-v-kvartire',
        'cheshujnicy-v-vannoj',
        'mokricy-v-podvale',
        '10-sposobov-predotvratit-nasekomyh',
        'kak-podgotovitsya-k-dezinsekcii',
        'chto-delat-posle-obrabotki',
        'bezopasnost-detej-pri-dezinsekcii',
        'domashnie-zhivotnye-i-dezinfekciya',
        'kak-vybrat-sluzhbu-dezinfekcii',
        'priznaki-nekachestvennoj-obrabotki',
        'kogda-nuzhna-povtornaya-obrabotka',
        'profilaktika-posle-dezinfekcii',
        'kak-proverit-kachestvo-uslug',
        'generalnaya-uborka-posle-vreditelej',
        'dezinfekciya-pered-pereezdom',
        'obrabotka-syomnoj-kvartiry',
        'dezinfekciya-pri-prodazhe-kvartiry',
        'sezonnaya-profilaktika',
        'trebovaniya-rospotrebnadzora-2026',
        'sanpin-po-dezinfekcii',
        'dokumenty-dlya-obshchepita',
        'obyazannosti-upravlyayushchej-kompanii',
        'prava-zhilcov-pri-zarazhenii',
        'licenzirovanie-sluzhb-dezinfekcii',
        'otvetstvennost-arendodatelya',
        'sudebnaya-praktika-po-klopam',
        'obzor-professionalnyh-insekticidov',
        'bezopasnye-sredstva-ot-klopov',
        'sravnenie-holodnogo-i-goryachego-tumana',
        'narodnye-sredstva-rabotayut-li',
        'aerozoli-ot-tarakanov-rejting',
        'lovushki-dlya-nasekomyh',
        'repellenty-kak-vybrat',
      ];
      const blogUrls: SitemapUrl[] = blogSlugs.map(slug => ({
        loc: `/blog/${slug}`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.6',
      }));
      
      // === ГЕНЕРАЦИЯ XML ===
      const allUrls = [
        ...staticUrls, 
        ...serviceUrls, 
        ...subpageUrls, 
        ...geoUrls, 
        ...blogUrls
      ];
      const xml = generateSitemapXml(baseUrl, allUrls);
      
      writeFileSync(resolve('dist/sitemap.xml'), xml);
      console.log('✓ sitemap.xml generated with', allUrls.length, 'URLs');
      console.log('  - Static pages:', staticUrls.length);
      console.log('  - Services:', serviceUrls.length);
      console.log('  - Subpages:', subpageUrls.length);
      console.log('  - Geo pages:', geoUrls.length);
      console.log('  - Blog posts:', blogUrls.length);
    }
  };
}
