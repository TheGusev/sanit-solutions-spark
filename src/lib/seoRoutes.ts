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

// Округа Москвы
export const districtSlugs = [
  'cao', 'sao', 'svao', 'vao', 'yuvao', 'yao', 'yzao', 'zao', 'szao'
];

// Статьи блога
export const blogSlugs = [
  'kak-podgotovit-pomeshchenie',
  'vidy-dezinfekcii',
  'borba-s-tarakanami',
  'ozonirovaniye-pomeshcheniy',
  'gryzuny-v-dome',
  'sezonnost-vreditelej',
  'dezinfekciya-ofisa',
  'klopy-v-kvartire',
];

// Генерация всех маршрутов для SSG
export function getAllSSGRoutes() {
  const routes = [...staticRoutes];
  
  // Услуги
  servicesSlugs.forEach(slug => {
    routes.push({
      path: `/uslugi/${slug}`,
      outputPath: `uslugi/${slug}/index.html`,
      priority: '0.9',
      changefreq: 'monthly'
    });
  });
  
  // Подстраницы услуг
  serviceSubpageRoutes.forEach(({ parent, sub }) => {
    routes.push({
      path: `/uslugi/${parent}/${sub}`,
      outputPath: `uslugi/${parent}/${sub}/index.html`,
      priority: '0.85',
      changefreq: 'monthly'
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
  
  // Блог
  blogSlugs.forEach(slug => {
    routes.push({
      path: `/blog/${slug}`,
      outputPath: `blog/${slug}/index.html`,
      priority: '0.6',
      changefreq: 'monthly'
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
