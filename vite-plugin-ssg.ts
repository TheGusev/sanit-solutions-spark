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

// Единый источник истины для всех маршрутов (синхронизирован с src/lib/seoRoutes.ts)
// Дублируем здесь, т.к. vite-plugin выполняется до сборки и не может импортировать из src/

// Статические страницы
const staticRoutes: SSGRoute[] = [
  { path: '/', outputPath: 'index.html' },
  { path: '/contacts', outputPath: 'contacts/index.html' },
  { path: '/blog', outputPath: 'blog/index.html' },
  { path: '/privacy', outputPath: 'privacy/index.html' },
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
  // ЦАО (10)
  'arbat', 'basmannyj', 'zamoskvorechye', 'krasnoselskij', 'meshchanskij',
  'presnenskij', 'taganskij', 'tverskoy', 'hamovniki', 'yakimanka',
  // САО (16)
  'aeroport', 'begovoy', 'beskudnikovskij', 'vojkovskij', 'vostochnoe-degunino',
  'golovinskij', 'dmitrovskij', 'zapadnoe-degunino', 'koptevo', 'levoberezhnyj',
  'molzhaninovskij', 'savelovskij', 'sokol', 'timiryazevskij', 'hovrino', 'horoshevskij',
  // СВАО (17)
  'altufevskij', 'babushkinskij', 'bibirevo', 'butyrskij', 'lianozovo',
  'losinoostrovskij', 'marfino', 'marina-roshcha', 'ostankinskij', 'otradnoe',
  'rostokino', 'sviblovo', 'severnyj', 'severnoe-medvedkovo', 'yuzhnoe-medvedkovo',
  'yaroslavskij', 'alekseevskij',
  // ВАО (16)
  'bogorodskoe', 'veshnyaki', 'vostochnoe-izmajlovo', 'vostochnyj', 'golyanovo',
  'ivanovskoe', 'izmajlovo', 'kosino-uhtomskij', 'metrogorodok', 'novogireevo',
  'novokosino', 'perovo', 'preobrazhenskoe', 'severnoe-izmajlovo', 'sokolinaya-gora', 'sokolniki',
  // ЮВАО (12)
  'vyhino-zhulebino', 'kapotnya', 'kuzminki', 'lefortovo', 'lyublino',
  'marino', 'nekrasovka', 'nizhegorodskij', 'pechatniki', 'ryazanskij',
  'tekstilshchiki', 'yuzhno-portovyj',
  // ЮАО (16)
  'biryulevo-vostochnoe', 'biryulevo-zapadnoe', 'brateevo', 'danilovskij', 'donskoj',
  'zyablikovo', 'moskvorechye-saburovo', 'nagatino-sadovniki', 'nagatinskij-zaton',
  'nagornyj', 'orehovo-borisovo-severnoe', 'orehovo-borisovo-yuzhnoe', 'caricyno',
  'chertanovo-severnoe', 'chertanovo-centralnoe', 'chertanovo-yuzhnoe',
  // ЮЗАО (12)
  'akademicheskij', 'gagarinskij', 'zyuzino', 'konkovo', 'kotlovka',
  'lomonosovskij', 'obruchevskij', 'severnoe-butovo', 'teplyj-stan',
  'cheryomushki', 'yuzhnoe-butovo', 'yasenevo',
  // ЗАО (13)
  'vnukovo', 'dorogomilovo', 'krylatskoe', 'kuntsevo', 'mozhajskij',
  'novo-peredelkino', 'ochakovo-matveevskoe', 'prospekt-vernadskogo', 'ramenki',
  'solncevo', 'troparyovo-nikulino', 'filyovskij-park', 'fili-davydkovo',
  // СЗАО (8)
  'kurkino', 'mitino', 'pokrovskoe-streshnevo', 'severnoe-tushino',
  'strogino', 'horoshevo-mnevniki', 'shchukino', 'yuzhnoe-tushino',
  // НАО (8)
  'sosenskoe', 'vnukovskoe', 'voronovskoe', 'desenovskoe', 'kievskij',
  'kokoshkino', 'marushkinskoe', 'moskovskij',
  // ТАО (10)
  'troitsk', 'shcherbinka', 'filimonkovskoe', 'pervomajskoe', 'novofeodorovskoe',
  'rogovskoe', 'krasnopahorskoe', 'klenovskoe', 'shhapovskoe', 'voskresenskoe',
  // Зеленоград (5)
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
  'klopy-v-kvartire'
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
  
  // Страницы районов (125 страниц)
  neighborhoodSlugs.forEach(slug => {
    routes.push({
      path: `/rajony/${slug}`,
      outputPath: `rajony/${slug}/index.html`
    });
  });
  
  return routes;
}

// Validate generated HTML quality
function validateHtml(html: string, route: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
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
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Replace all head tags with helmet data
function replaceHeadTags(html: string, helmet: { title: string; meta: string; link: string; script: string }): string {
  // 1. Replace title
  if (helmet.title) {
    html = html.replace(/<title>.*?<\/title>/, helmet.title);
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
        
        await build({
          configFile: false,
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
            
            // Validate HTML quality
            const validation = validateHtml(html, route.path);
            
            if (!validation.valid) {
              console.warn(`⚠️  ${route.path}: Quality issues:`);
              validation.errors.forEach(err => console.warn(`   - ${err}`));
            }
            
            // Write the file
            const outputPath = resolve(distDir, route.outputPath);
            const outputDir = dirname(outputPath);
            
            if (!existsSync(outputDir)) {
              mkdirSync(outputDir, { recursive: true });
            }
            
            writeFileSync(outputPath, html);
            
            const sizeKb = (html.length / 1024).toFixed(1);
            console.log(`✓ ${route.path} → ${route.outputPath} (${sizeKb}KB)`);
            successCount++;
            
          } catch (error) {
            console.error(`❌ ${route.path}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            errorCount++;
          }
        }
        
        console.log(`\n📊 SSG Results: ${successCount} success, ${errorCount} errors\n`);
        
        if (successCount > 0) {
          console.log('✅ SSG prerendering complete! Static HTML files generated in dist/\n');
        }
        
      } catch (error) {
        console.error('❌ SSG prerendering failed:', error);
      }
    }
  };
}
