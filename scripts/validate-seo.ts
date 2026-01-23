/**
 * SEO Validation Script
 * 
 * Run after build to validate:
 * - Internal links (no 404s)
 * - Orphan pages (reachable in 3 clicks)
 * - Link density (max 200 per page)
 * - Duplicate content detection
 * - Schema.org validation
 * - Sitemap validation
 * - robots.txt validation
 * 
 * Usage: npx tsx scripts/validate-seo.ts
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'fs';
import { resolve, relative, join } from 'path';

interface ValidationReport {
  totalPages: number;
  totalLinks: number;
  avgLinksPerPage: number;
  avgWordCount: number;
  deadLinks: Array<{ page: string; link: string }>;
  orphanPages: string[];
  thinContent: Array<{ page: string; wordCount: number }>;
  tooManyLinks: Array<{ page: string; linkCount: number }>;
  duplicateTitles: Map<string, string[]>;
  duplicateDescriptions: Map<string, string[]>;
  schemaErrors: string[];
  sitemapValid: boolean;
  sitemapUrlCount: number;
  robotsValid: boolean;
}

const DIST_DIR = resolve(process.cwd(), 'dist');
const MIN_WORD_COUNT = 400; // Порог для "тонкого" контента
const MAX_LINKS_PER_PAGE = 200;
const MAX_CLICK_DEPTH = 3;

// Рекурсивно получить все HTML файлы
function getAllHtmlFiles(dir: string, files: string[] = []): string[] {
  if (!existsSync(dir)) return files;
  
  const entries = readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllHtmlFiles(fullPath, files);
    } else if (entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Преобразовать путь файла в URL
function filePathToUrl(filePath: string): string {
  let url = '/' + relative(DIST_DIR, filePath)
    .replace(/\\/g, '/')
    .replace(/index\.html$/, '')
    .replace(/\.html$/, '');
  
  // Убрать trailing slash для корня
  if (url === '/') return url;
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

// Извлечь все внутренние ссылки из HTML
function extractInternalLinks(html: string): string[] {
  const linkRegex = /href="(\/[^"#?]*?)"/g;
  const links: string[] = [];
  let match;
  
  while ((match = linkRegex.exec(html)) !== null) {
    let link = match[1];
    // Нормализация
    if (link !== '/' && link.endsWith('/')) {
      link = link.slice(0, -1);
    }
    links.push(link);
  }
  
  return [...new Set(links)]; // Уникальные
}

// Извлечь title
function extractTitle(html: string): string | null {
  const match = html.match(/<title>([^<]+)<\/title>/i);
  return match ? match[1].trim() : null;
}

// Извлечь description
function extractDescription(html: string): string | null {
  const match = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
  return match ? match[1].trim() : null;
}

// Подсчитать слова в HTML
function countWords(html: string): number {
  const text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  return text.split(' ').filter(w => w.length > 2).length;
}

// Извлечь JSON-LD схемы
function extractSchemas(html: string): string[] {
  const schemaRegex = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  const schemas: string[] = [];
  let match;
  
  while ((match = schemaRegex.exec(html)) !== null) {
    schemas.push(match[1]);
  }
  
  return schemas;
}

// Валидация JSON-LD
function validateSchema(jsonStr: string): { valid: boolean; error?: string } {
  try {
    const schema = JSON.parse(jsonStr);
    
    // Базовые проверки
    if (!schema['@context'] || !schema['@type']) {
      return { valid: false, error: 'Missing @context or @type' };
    }
    
    return { valid: true };
  } catch (e) {
    return { valid: false, error: `Invalid JSON: ${e}` };
  }
}

// Проверка orphan страниц (BFS)
function findOrphanPages(pages: Map<string, string[]>, allUrls: Set<string>): string[] {
  const startUrl = '/';
  const visited = new Set<string>();
  const queue: Array<{ url: string; depth: number }> = [{ url: startUrl, depth: 0 }];
  
  while (queue.length > 0) {
    const { url, depth } = queue.shift()!;
    
    if (visited.has(url) || depth > MAX_CLICK_DEPTH) continue;
    visited.add(url);
    
    const links = pages.get(url) || [];
    for (const link of links) {
      if (!visited.has(link) && allUrls.has(link)) {
        queue.push({ url: link, depth: depth + 1 });
      }
    }
  }
  
  // Страницы, которые не достижимы за 3 клика
  const orphans: string[] = [];
  allUrls.forEach(url => {
    if (!visited.has(url) && url !== '/privacy') { // /privacy может быть orphan
      orphans.push(url);
    }
  });
  
  return orphans;
}

// Валидация sitemap
function validateSitemap(): { valid: boolean; urlCount: number; errors: string[] } {
  const errors: string[] = [];
  let urlCount = 0;
  
  // Проверяем sitemap-index.xml
  const indexPath = resolve(DIST_DIR, 'sitemap-index.xml');
  if (!existsSync(indexPath)) {
    errors.push('sitemap-index.xml not found');
    return { valid: false, urlCount: 0, errors };
  }
  
  const indexContent = readFileSync(indexPath, 'utf-8');
  
  // Проверяем формат XML
  if (!indexContent.includes('<?xml version="1.0"') || !indexContent.includes('<sitemapindex')) {
    errors.push('Invalid sitemap-index.xml format');
  }
  
  // Извлекаем ссылки на дочерние sitemap
  const sitemapLocs = indexContent.match(/<loc>([^<]+)<\/loc>/g) || [];
  
  for (const loc of sitemapLocs) {
    const filename = loc.replace(/<\/?loc>/g, '').split('/').pop();
    if (!filename) continue;
    
    const sitemapPath = resolve(DIST_DIR, filename);
    if (!existsSync(sitemapPath)) {
      errors.push(`Sitemap file not found: ${filename}`);
      continue;
    }
    
    const content = readFileSync(sitemapPath, 'utf-8');
    const urls = (content.match(/<url>/g) || []).length;
    urlCount += urls;
  }
  
  return { valid: errors.length === 0, urlCount, errors };
}

// Валидация robots.txt
function validateRobots(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  const robotsPath = resolve(DIST_DIR, 'robots.txt');
  if (!existsSync(robotsPath)) {
    // Проверяем в public/
    const publicRobotsPath = resolve(process.cwd(), 'public/robots.txt');
    if (!existsSync(publicRobotsPath)) {
      errors.push('robots.txt not found');
      return { valid: false, errors };
    }
  }
  
  const content = readFileSync(existsSync(robotsPath) ? robotsPath : resolve(process.cwd(), 'public/robots.txt'), 'utf-8');
  
  // Проверяем ссылку на sitemap
  if (!content.includes('sitemap-index.xml')) {
    errors.push('robots.txt does not reference sitemap-index.xml');
  }
  
  // Проверяем Host для Yandex
  if (!content.includes('Host:')) {
    errors.push('robots.txt missing Host directive for Yandex');
  }
  
  return { valid: errors.length === 0, errors };
}

// Основная функция валидации
async function runValidation(): Promise<ValidationReport> {
  console.log('🔍 Starting SEO validation...\n');
  
  const report: ValidationReport = {
    totalPages: 0,
    totalLinks: 0,
    avgLinksPerPage: 0,
    avgWordCount: 0,
    deadLinks: [],
    orphanPages: [],
    thinContent: [],
    tooManyLinks: [],
    duplicateTitles: new Map(),
    duplicateDescriptions: new Map(),
    schemaErrors: [],
    sitemapValid: false,
    sitemapUrlCount: 0,
    robotsValid: false,
  };
  
  // Получаем все HTML файлы
  const htmlFiles = getAllHtmlFiles(DIST_DIR);
  report.totalPages = htmlFiles.length;
  
  if (htmlFiles.length === 0) {
    console.error('❌ No HTML files found in dist/. Run build first.');
    return report;
  }
  
  console.log(`📄 Found ${htmlFiles.length} HTML pages\n`);
  
  // Собираем данные о всех страницах
  const pageData = new Map<string, {
    url: string;
    links: string[];
    title: string | null;
    description: string | null;
    wordCount: number;
    schemas: string[];
  }>();
  
  const allUrls = new Set<string>();
  
  for (const filePath of htmlFiles) {
    const url = filePathToUrl(filePath);
    const html = readFileSync(filePath, 'utf-8');
    const links = extractInternalLinks(html);
    const title = extractTitle(html);
    const description = extractDescription(html);
    const wordCount = countWords(html);
    const schemas = extractSchemas(html);
    
    allUrls.add(url);
    pageData.set(url, { url, links, title, description, wordCount, schemas });
    report.totalLinks += links.length;
  }
  
  report.avgLinksPerPage = Math.round(report.totalLinks / report.totalPages);
  
  // Анализ страниц
  let totalWords = 0;
  const linkGraph = new Map<string, string[]>();
  
  for (const [url, data] of pageData) {
    linkGraph.set(url, data.links);
    totalWords += data.wordCount;
    
    // Проверка dead links
    for (const link of data.links) {
      const normalizedLink = link.endsWith('/') ? link.slice(0, -1) : link;
      if (!allUrls.has(normalizedLink) && !allUrls.has(link) && !allUrls.has(link + '/')) {
        // Пропускаем некоторые специальные пути
        if (!link.startsWith('/tel:') && !link.startsWith('/mailto:') && link !== '/') {
          report.deadLinks.push({ page: url, link });
        }
      }
    }
    
    // Проверка link density
    if (data.links.length > MAX_LINKS_PER_PAGE) {
      report.tooManyLinks.push({ page: url, linkCount: data.links.length });
    }
    
    // Проверка thin content
    if (data.wordCount < MIN_WORD_COUNT) {
      report.thinContent.push({ page: url, wordCount: data.wordCount });
    }
    
    // Проверка дублей title
    if (data.title) {
      if (!report.duplicateTitles.has(data.title)) {
        report.duplicateTitles.set(data.title, []);
      }
      report.duplicateTitles.get(data.title)!.push(url);
    }
    
    // Проверка дублей description
    if (data.description) {
      if (!report.duplicateDescriptions.has(data.description)) {
        report.duplicateDescriptions.set(data.description, []);
      }
      report.duplicateDescriptions.get(data.description)!.push(url);
    }
    
    // Проверка Schema.org
    for (const schema of data.schemas) {
      const validation = validateSchema(schema);
      if (!validation.valid) {
        report.schemaErrors.push(`${url}: ${validation.error}`);
      }
    }
  }
  
  report.avgWordCount = Math.round(totalWords / report.totalPages);
  
  // Поиск orphan страниц
  report.orphanPages = findOrphanPages(linkGraph, allUrls);
  
  // Валидация sitemap
  const sitemapResult = validateSitemap();
  report.sitemapValid = sitemapResult.valid;
  report.sitemapUrlCount = sitemapResult.urlCount;
  if (!sitemapResult.valid) {
    sitemapResult.errors.forEach(e => console.warn(`⚠️  Sitemap: ${e}`));
  }
  
  // Валидация robots.txt
  const robotsResult = validateRobots();
  report.robotsValid = robotsResult.valid;
  if (!robotsResult.valid) {
    robotsResult.errors.forEach(e => console.warn(`⚠️  Robots: ${e}`));
  }
  
  return report;
}

// Вывод отчёта
function printReport(report: ValidationReport): void {
  console.log('\n' + '='.repeat(60));
  console.log('                   SEO VALIDATION REPORT');
  console.log('='.repeat(60) + '\n');
  
  // Dead links
  if (report.deadLinks.length === 0) {
    console.log('✅ Internal links: All links valid');
  } else {
    console.log(`❌ Dead links: ${report.deadLinks.length} found`);
    report.deadLinks.slice(0, 10).forEach(({ page, link }) => {
      console.log(`   ${page} → ${link}`);
    });
    if (report.deadLinks.length > 10) {
      console.log(`   ... and ${report.deadLinks.length - 10} more`);
    }
  }
  
  // Orphan pages
  if (report.orphanPages.length === 0) {
    console.log(`✅ Orphan pages: All pages reachable in ${MAX_CLICK_DEPTH} clicks`);
  } else {
    console.log(`⚠️  Orphan pages: ${report.orphanPages.length} pages not reachable in ${MAX_CLICK_DEPTH} clicks`);
    report.orphanPages.slice(0, 5).forEach(page => {
      console.log(`   ${page}`);
    });
    if (report.orphanPages.length > 5) {
      console.log(`   ... and ${report.orphanPages.length - 5} more`);
    }
  }
  
  // Link density
  if (report.tooManyLinks.length === 0) {
    console.log(`✅ Link density: Max ${MAX_LINKS_PER_PAGE} links per page (OK)`);
  } else {
    console.log(`⚠️  Link density: ${report.tooManyLinks.length} pages exceed ${MAX_LINKS_PER_PAGE} links`);
    report.tooManyLinks.forEach(({ page, linkCount }) => {
      console.log(`   ${page}: ${linkCount} links`);
    });
  }
  
  // Thin content
  if (report.thinContent.length === 0) {
    console.log(`✅ Content quality: All pages have ${MIN_WORD_COUNT}+ words`);
  } else {
    console.log(`⚠️  Thin content: ${report.thinContent.length} pages below ${MIN_WORD_COUNT} words`);
    report.thinContent.slice(0, 5).forEach(({ page, wordCount }) => {
      console.log(`   ${page}: ${wordCount} words`);
    });
    if (report.thinContent.length > 5) {
      console.log(`   ... and ${report.thinContent.length - 5} more`);
    }
  }
  
  // Duplicate titles
  let duplicateTitleCount = 0;
  report.duplicateTitles.forEach((pages, title) => {
    if (pages.length > 1) duplicateTitleCount++;
  });
  if (duplicateTitleCount === 0) {
    console.log('✅ Titles: All unique');
  } else {
    console.log(`⚠️  Duplicate titles: ${duplicateTitleCount} duplicates found`);
  }
  
  // Duplicate descriptions
  let duplicateDescCount = 0;
  report.duplicateDescriptions.forEach((pages, desc) => {
    if (pages.length > 1) duplicateDescCount++;
  });
  if (duplicateDescCount === 0) {
    console.log('✅ Descriptions: All unique');
  } else {
    console.log(`⚠️  Duplicate descriptions: ${duplicateDescCount} duplicates found`);
  }
  
  // Schema errors
  if (report.schemaErrors.length === 0) {
    console.log('✅ Schema.org: All schemas valid');
  } else {
    console.log(`❌ Schema errors: ${report.schemaErrors.length} errors found`);
    report.schemaErrors.slice(0, 5).forEach(err => {
      console.log(`   ${err}`);
    });
  }
  
  // Sitemap
  if (report.sitemapValid) {
    console.log(`✅ Sitemap: Valid (${report.sitemapUrlCount} URLs)`);
  } else {
    console.log('❌ Sitemap: Invalid');
  }
  
  // Robots
  if (report.robotsValid) {
    console.log('✅ robots.txt: Valid');
  } else {
    console.log('❌ robots.txt: Invalid');
  }
  
  // Summary
  console.log('\n' + '-'.repeat(60));
  console.log('SUMMARY');
  console.log('-'.repeat(60));
  console.log(`Total pages:          ${report.totalPages}`);
  console.log(`Total links:          ${report.totalLinks}`);
  console.log(`Avg links per page:   ${report.avgLinksPerPage}`);
  console.log(`Avg word count:       ${report.avgWordCount}`);
  console.log(`Sitemap URLs:         ${report.sitemapUrlCount}`);
  console.log(`Dead links:           ${report.deadLinks.length}`);
  console.log(`Orphan pages:         ${report.orphanPages.length}`);
  console.log(`Thin content pages:   ${report.thinContent.length}`);
  console.log(`Duplicate titles:     ${duplicateTitleCount}`);
  console.log(`Duplicate descs:      ${duplicateDescCount}`);
  console.log(`Schema errors:        ${report.schemaErrors.length}`);
  
  // Status
  const hasErrors = report.deadLinks.length > 0 || report.schemaErrors.length > 0 || !report.sitemapValid || !report.robotsValid;
  const hasWarnings = report.orphanPages.length > 0 || report.thinContent.length > 0 || duplicateTitleCount > 0 || duplicateDescCount > 0;
  
  console.log('\n' + '='.repeat(60));
  if (hasErrors) {
    console.log('❌ Status: ERRORS FOUND - Fix before deploy');
    process.exit(1);
  } else if (hasWarnings) {
    console.log('⚠️  Status: WARNINGS - Review recommended');
    process.exit(0);
  } else {
    console.log('✅ Status: READY TO DEPLOY');
    process.exit(0);
  }
}

// Запуск
runValidation()
  .then(printReport)
  .catch(error => {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  });
