import { Plugin } from 'vite';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { pathToFileURL } from 'url';

interface SSGRoute {
  path: string;
  outputPath: string;
}

// Static routes to prerender
const staticRoutes: SSGRoute[] = [
  { path: '/', outputPath: 'index.html' },
  { path: '/contacts', outputPath: 'contacts/index.html' },
  { path: '/blog', outputPath: 'blog/index.html' },
  { path: '/privacy', outputPath: 'privacy/index.html' },
];

// Services (from services.ts)
const servicesSlugs = [
  'dezinfekciya',
  'dezinsekciya', 
  'deratizaciya',
  'ozonirovanie',
  'dezodoraciya',
  'sertifikaciya'
];

// Blog posts (from blogPosts.ts)
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

// Generate all routes
function getAllRoutes(): SSGRoute[] {
  const routes = [...staticRoutes];
  
  // Add service pages
  servicesSlugs.forEach(slug => {
    routes.push({
      path: `/uslugi/${slug}`,
      outputPath: `uslugi/${slug}/index.html`
    });
  });
  
  // Add blog posts
  blogSlugs.forEach(slug => {
    routes.push({
      path: `/blog/${slug}`,
      outputPath: `blog/${slug}/index.html`
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
            
            // Replace entire root div content (including SSR fallback) with rendered content
            let html = template.replace(
              /<div id="root">[\s\S]*?<\/div>/,
              `<div id="root">${result.html}</div>`
            );
            
            // Update head tags if helmet provided them
            if (result.helmet.title) {
              html = html.replace(/<title>.*?<\/title>/, result.helmet.title);
            }
            
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
