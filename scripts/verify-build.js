#!/usr/bin/env node
/**
 * verify-build.js — 10-block post-build QA audit.
 * Pure Node.js, zero external dependencies.
 * Exit(1) on any FAIL or CRITICAL.
 */

const fs = require('fs');
const path = require('path');

// ── Counters ──────────────────────────────────────────────────
let total = 0, pass = 0, fail = 0, warn = 0, critical = 0;

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

function PASS(msg) { total++; pass++; console.log(`  ${GREEN}✓ PASS${RESET} ${msg}`); }
function FAIL(msg) { total++; fail++; console.log(`  ${RED}✗ FAIL${RESET} ${msg}`); }
function WARN(msg) { total++; warn++; console.log(`  ${YELLOW}⚠ WARN${RESET} ${msg}`); }
function CRITICAL(msg) { total++; critical++; console.log(`  ${RED}✗✗ CRITICAL${RESET} ${msg}`); }
function header(n, title) { console.log(`\n${CYAN}${BOLD}${'═'.repeat(60)}${RESET}\n${CYAN}${BOLD}БЛОК ${n}: ${title}${RESET}\n${CYAN}${BOLD}${'═'.repeat(60)}${RESET}`); }

// ══════════════════════════════════════════════════════════════
// БЛОК 1: ФИЗИЧЕСКОЕ НАЛИЧИЕ ФАЙЛОВ
// ══════════════════════════════════════════════════════════════
header(1, 'ФИЗИЧЕСКОЕ НАЛИЧИЕ ФАЙЛОВ');

const criticalPaths = [
  // Базовые
  'dist/index.html',
  'dist/contacts/index.html',
  'dist/otzyvy/index.html',
  'dist/sluzhba-dezinsekcii/index.html',
  'dist/uslugi/obrabotka-uchastkov/index.html',
  // Клопы — квалификаторы
  'dist/uslugi/dezinsekciya/klopy/index.html',
  'dist/uslugi/dezinsekciya/klopov-v-kvartire/index.html',
  'dist/uslugi/dezinsekciya/postelnyh-klopov/index.html',
  'dist/uslugi/dezinsekciya/domashnih-klopov/index.html',
  'dist/uslugi/dezinsekciya/tarakanov-v-kvartire/index.html',
  // Методы обработки
  'dist/uslugi/dezinsekciya/holodnym-tumanom/index.html',
  'dist/uslugi/dezinsekciya/parom/index.html',
  'dist/uslugi/dezinsekciya/srochno/index.html',
  'dist/uslugi/dezinsekciya/kruglosutochno/index.html',
  // Новые вредители
  'dist/uslugi/dezinsekciya/komary/index.html',
  'dist/uslugi/dezinsekciya/kleshchi/index.html',
  'dist/uslugi/dezinsekciya/muhi/index.html',
  'dist/uslugi/dezinsekciya/osy-shershni/index.html',
  'dist/uslugi/dezinsekciya/cheshuynitsy/index.html',
  'dist/uslugi/dezinsekciya/mokricy/index.html',
  // Дезинфекция по районам
  'dist/uslugi/dezinfekciya/arbat/index.html',
  'dist/uslugi/dezinfekciya/maryino/index.html',
  'dist/uslugi/dezinfekciya/tverskoy/index.html',
  // Гео — районы
  'dist/rajony/arbat/index.html',
  'dist/rajony/maryino/index.html',
  // НЧ-страницы (вредитель + район)
  'dist/uslugi/dezinsekciya/klopy/arbat/index.html',
  'dist/uslugi/dezinsekciya/tarakany/maryino/index.html',
  'dist/uslugi/dezinsekciya/komary/tverskoy/index.html',
  // Новые объекты
  'dist/uslugi/dezinsekciya/gostinic/index.html',
  'dist/uslugi/dezinsekciya/detskih-sadov/index.html',
  'dist/uslugi/ozonirovanie/avtomobiley/index.html',
  // Города МО
  'dist/moscow-oblast/khimki/index.html',
  'dist/moscow-oblast/khimki/dezinsekciya/index.html',
  'dist/moscow-oblast/klin/index.html',
  'dist/moscow-oblast/chekhov/index.html',
  // Блог
  'dist/blog/index.html',
];

const existingFiles = [];

for (const p of criticalPaths) {
  if (fs.existsSync(p)) {
    PASS(p);
    existingFiles.push(p);
  } else {
    FAIL(`Файл не найден: ${p}`);
  }
}

// ══════════════════════════════════════════════════════════════
// БЛОК 2: ПРОВЕРКА РАЗМЕРА ФАЙЛОВ
// ══════════════════════════════════════════════════════════════
header(2, 'ПРОВЕРКА РАЗМЕРА ФАЙЛОВ');

for (const p of existingFiles) {
  const size = fs.statSync(p).size;
  const kb = (size / 1024).toFixed(1);
  if (size < 5000) {
    CRITICAL(`${p}: ${kb} KB (< 5 KB — пустой/битый)`);
  } else if (size < 15000) {
    FAIL(`${p}: ${kb} KB (< 15 KB — вероятно NotFound)`);
  } else {
    PASS(`${p}: ${kb} KB`);
  }
}

// ══════════════════════════════════════════════════════════════
// БЛОК 3: SEO-АУДИТ КОНТЕНТА
// ══════════════════════════════════════════════════════════════
header(3, 'SEO-АУДИТ КОНТЕНТА');

const forbiddenStrings = [
  'Тарифы на дезинфекция',
  'Тарифы на дезинсекция',
  'Уничтожение клопы',
  'в undefined',
  'lovable.app',
  'localhost',
  '127.0.0.1',
  'Гарантия 1 год',
  'до 1 года',
  'TODO',
  'FIXME',
  'console.log',
];

for (const p of existingFiles) {
  const html = fs.readFileSync(p, 'utf-8');
  const label = p.replace('dist/', '');

  // 3.1 — Required tags
  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  if (!titleMatch || titleMatch[1].length < 20) {
    FAIL(`[${label}] <title> отсутствует или < 20 символов`);
  } else {
    PASS(`[${label}] <title> OK (${titleMatch[1].length} символов)`);
  }

  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  if (!descMatch || descMatch[1].length < 50) {
    FAIL(`[${label}] meta description отсутствует или < 50 символов`);
  } else {
    PASS(`[${label}] meta description OK`);
  }

  const canonicalMatch = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  if (!canonicalMatch || !canonicalMatch[1]) {
    FAIL(`[${label}] canonical отсутствует`);
  } else {
    PASS(`[${label}] canonical OK`);
  }

  const h1Matches = html.match(/<h1[\s>]/gi);
  if (!h1Matches || h1Matches.length === 0) {
    FAIL(`[${label}] нет <h1>`);
  } else if (h1Matches.length > 1) {
    FAIL(`[${label}] найдено ${h1Matches.length} тегов <h1> (должен быть 1)`);
  } else {
    PASS(`[${label}] <h1> OK`);
  }

  if (html.includes('window.ym') || html.includes('ym(')) {
    PASS(`[${label}] Яндекс.Метрика OK`);
  } else {
    FAIL(`[${label}] Яндекс.Метрика не найдена`);
  }

  if (html.includes('"@context"') && html.includes('schema.org')) {
    PASS(`[${label}] Schema.org OK`);
  } else {
    FAIL(`[${label}] Schema.org не найдена`);
  }

  // 3.2 — Forbidden strings
  for (const forbidden of forbiddenStrings) {
    // Skip console.log check in script tags
    if (forbidden === 'console.log') {
      // Only check outside of <script> tags
      const withoutScripts = html.replace(/<script[\s\S]*?<\/script>/gi, '');
      if (withoutScripts.includes(forbidden)) {
        FAIL(`[${label}] Найден "${forbidden}" вне <script>`);
      }
    } else if (forbidden === 'TODO' || forbidden === 'FIXME') {
      const withoutScripts = html.replace(/<script[\s\S]*?<\/script>/gi, '');
      if (withoutScripts.includes(forbidden)) {
        FAIL(`[${label}] Найден "${forbidden}" вне <script>`);
      }
    } else {
      if (html.includes(forbidden)) {
        FAIL(`[${label}] Найден запрещённый текст: "${forbidden}"`);
      }
    }
  }

  // 3.3 — Canonical domain check
  if (canonicalMatch && canonicalMatch[1]) {
    const href = canonicalMatch[1];
    if (!href.startsWith('https://goruslugimsk.ru')) {
      FAIL(`[${label}] Canonical не начинается с https://goruslugimsk.ru: ${href}`);
    } else {
      PASS(`[${label}] Canonical домен OK`);
    }
  }
}

// ══════════════════════════════════════════════════════════════
// БЛОК 4: ПРОВЕРКА ЯНДЕКС.МЕТРИКИ И ЦЕЛЕЙ
// ══════════════════════════════════════════════════════════════
header(4, 'ЯНДЕКС.МЕТРИКА И ЦЕЛИ');

function checkFileContains(filePath, patterns, label) {
  if (!fs.existsSync(filePath)) {
    FAIL(`Файл не найден: ${filePath}`);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  for (const [pattern, desc] of patterns) {
    if (content.includes(pattern)) {
      PASS(`[${label}] ${desc}`);
    } else {
      FAIL(`[${label}] Не найдено: ${desc}`);
    }
  }
}

// analytics.ts
checkFileContains('src/lib/analytics.ts', [
  ['getYmGoalPrefix', 'функция getYmGoalPrefix()'],
  ['YANDEX_COUNTER_ID', 'константа YANDEX_COUNTER_ID'],
], 'analytics.ts');

// Verify counter is not empty/placeholder
const analyticsContent = fs.existsSync('src/lib/analytics.ts') ? fs.readFileSync('src/lib/analytics.ts', 'utf-8') : '';
if (analyticsContent.match(/YANDEX_COUNTER_ID\s*=\s*\d{5,}/)) {
  PASS('[analytics.ts] Счётчик Метрики — числовая константа');
} else {
  FAIL('[analytics.ts] Счётчик Метрики — пустой или плейсхолдер');
}

if (analyticsContent.includes('window.ym(undefined') || analyticsContent.includes('window.ym(null')) {
  FAIL('[analytics.ts] Найден window.ym(undefined/null, ...)');
} else {
  PASS('[analytics.ts] Нет window.ym(undefined/null)');
}

// ServiceQuiz.tsx
checkFileContains('src/components/ServiceQuiz.tsx', [
  ["sessionStorage.getItem('quiz_source')", 'проверка quiz_source'],
  ['sticky_quiz_lead_', 'цель sticky_quiz_lead_'],
  ['quiz_lead_', 'цель quiz_lead_'],
], 'ServiceQuiz.tsx');

// LeadFormModal.tsx
checkFileContains('src/components/LeadFormModal.tsx', [
  ['calc_lead_', 'цель calc_lead_'],
], 'LeadFormModal.tsx');

// ══════════════════════════════════════════════════════════════
// БЛОК 5: ПРОВЕРКА SITEMAP
// ══════════════════════════════════════════════════════════════
header(5, 'SITEMAP');

const sitemapIndexPath = fs.existsSync('dist/sitemap-index.xml') ? 'dist/sitemap-index.xml' : (fs.existsSync('dist/sitemap.xml') ? 'dist/sitemap.xml' : null);

if (!sitemapIndexPath) {
  FAIL('Sitemap не найден (ни sitemap-index.xml, ни sitemap.xml)');
} else {
  PASS(`Sitemap найден: ${sitemapIndexPath}`);
  const sitemapContent = fs.readFileSync(sitemapIndexPath, 'utf-8');

  // Count sub-sitemaps or URLs
  const sitemapTags = (sitemapContent.match(/<sitemap>/gi) || []).length;
  const urlTags = (sitemapContent.match(/<url>/gi) || []).length;

  if (sitemapTags > 0) {
    PASS(`Sub-sitemaps в индексе: ${sitemapTags}`);
    // Read each sub-sitemap and count total URLs
    const locMatches = sitemapContent.match(/<loc>([^<]+)<\/loc>/gi) || [];
    let totalUrls = 0;
    for (const locTag of locMatches) {
      const loc = locTag.replace(/<\/?loc>/g, '');
      // Convert URL to local path
      const localPath = loc.replace('https://goruslugimsk.ru/', 'dist/');
      if (fs.existsSync(localPath)) {
        const subContent = fs.readFileSync(localPath, 'utf-8');
        totalUrls += (subContent.match(/<url>/gi) || []).length;
      }
    }
    if (totalUrls >= 700) {
      PASS(`Всего URL в sub-sitemaps: ${totalUrls} (≥700)`);
    } else if (totalUrls > 0) {
      FAIL(`Всего URL в sub-sitemaps: ${totalUrls} (< 700)`);
    }
  } else if (urlTags >= 700) {
    PASS(`URL в sitemap: ${urlTags} (≥700)`);
  } else {
    FAIL(`URL в sitemap: ${urlTags} (< 700)`);
  }

  // Check for bad domains
  if (sitemapContent.includes('lovable.app') || sitemapContent.includes('localhost')) {
    FAIL('Sitemap содержит lovable.app или localhost');
  } else {
    PASS('Sitemap: нет lovable.app/localhost');
  }

  // Critical URLs
  const criticalSitemapUrls = [
    'https://goruslugimsk.ru/uslugi/dezinsekciya/klopy/',
    'https://goruslugimsk.ru/sluzhba-dezinsekcii/',
    'https://goruslugimsk.ru/otzyvy/',
  ];

  // Check in index or sub-sitemaps
  let allSitemapText = sitemapContent;
  // Also load sub-sitemaps if index
  if (sitemapTags > 0) {
    const locMatches2 = sitemapContent.match(/<loc>([^<]+)<\/loc>/gi) || [];
    for (const locTag of locMatches2) {
      const loc = locTag.replace(/<\/?loc>/g, '');
      const localPath = loc.replace('https://goruslugimsk.ru/', 'dist/');
      if (fs.existsSync(localPath)) {
        allSitemapText += fs.readFileSync(localPath, 'utf-8');
      }
    }
  }

  for (const url of criticalSitemapUrls) {
    if (allSitemapText.includes(url)) {
      PASS(`Sitemap содержит ${url}`);
    } else {
      FAIL(`Sitemap НЕ содержит ${url}`);
    }
  }
}

// ══════════════════════════════════════════════════════════════
// БЛОК 6: ПРОВЕРКА ROBOTS.TXT
// ══════════════════════════════════════════════════════════════
header(6, 'ROBOTS.TXT');

const robotsPath = fs.existsSync('dist/robots.txt') ? 'dist/robots.txt' : (fs.existsSync('public/robots.txt') ? 'public/robots.txt' : null);

if (!robotsPath) {
  FAIL('robots.txt не найден');
} else {
  PASS(`robots.txt найден: ${robotsPath}`);
  const robots = fs.readFileSync(robotsPath, 'utf-8');

  if (robots.includes('Sitemap: https://goruslugimsk.ru/sitemap-index.xml') || robots.includes('Sitemap: https://goruslugimsk.ru/sitemap.xml')) {
    PASS('robots.txt содержит корректный Sitemap');
  } else {
    FAIL('robots.txt не содержит Sitemap с goruslugimsk.ru');
  }

  // Check for full disallow on *
  const lines = robots.split('\n');
  let currentAgent = '';
  let hasFullDisallow = false;
  for (const line of lines) {
    const agentMatch = line.match(/^User-agent:\s*(.+)/i);
    if (agentMatch) currentAgent = agentMatch[1].trim();
    if (currentAgent === '*' && /^Disallow:\s*\/\s*$/i.test(line)) {
      hasFullDisallow = true;
    }
  }
  if (hasFullDisallow) {
    FAIL('robots.txt содержит Disallow: / для User-agent: *');
  } else {
    PASS('robots.txt: нет полного Disallow для *');
  }

  if (robots.includes('Disallow: /admin/')) {
    PASS('robots.txt: Disallow: /admin/ присутствует');
  } else {
    FAIL('robots.txt: нет Disallow: /admin/');
  }
}

// ══════════════════════════════════════════════════════════════
// БЛОК 7: ПРОВЕРКА ПЕРЕЛИНКОВКИ
// ══════════════════════════════════════════════════════════════
header(7, 'ПЕРЕЛИНКОВКА');

const footerLinks = ['/otzyvy', '/sluzhba-dezinsekcii', '/uslugi/obrabotka-uchastkov'];

if (fs.existsSync('src/components/Footer.tsx')) {
  const footer = fs.readFileSync('src/components/Footer.tsx', 'utf-8');
  for (const link of footerLinks) {
    if (footer.includes(link)) {
      PASS(`Footer содержит ссылку на ${link}`);
    } else {
      FAIL(`Footer НЕ содержит ссылку на ${link} (orphan page!)`);
    }
  }
} else {
  FAIL('Footer.tsx не найден');
}

if (fs.existsSync('src/components/InternalLinks.tsx')) {
  const il = fs.readFileSync('src/components/InternalLinks.tsx', 'utf-8');
  if (il.includes('Смотрите также') || il.includes('InternalLinks')) {
    PASS('InternalLinks.tsx: блок перелинковки присутствует');
  } else {
    FAIL('InternalLinks.tsx: блок перелинковки не найден');
  }
} else {
  FAIL('InternalLinks.tsx не найден');
}

// ══════════════════════════════════════════════════════════════
// БЛОК 8: ПРОВЕРКА БЕЗОПАСНОСТИ КОДА
// ══════════════════════════════════════════════════════════════
header(8, 'БЕЗОПАСНОСТЬ КОДА');

function scanDir(dir, ext) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip node_modules, .git, dist
      if (['node_modules', '.git', 'dist', '__tests__'].includes(entry.name)) continue;
      results.push(...scanDir(fullPath, ext));
    } else if (!ext || ext.some(e => entry.name.endsWith(e))) {
      results.push(fullPath);
    }
  }
  return results;
}

const srcFiles = scanDir('src', ['.ts', '.tsx', '.js', '.jsx']);
const debuggerFiles = [];
const apiKeyFiles = [];
const consoleLogFiles = [];
const todoFiles = [];

for (const f of srcFiles) {
  const content = fs.readFileSync(f, 'utf-8');
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // debugger
    if (/\bdebugger\b/.test(line) && !line.trim().startsWith('//') && !line.trim().startsWith('*')) {
      debuggerFiles.push(`${f}:${i + 1}`);
    }
    // API keys (skip type declarations, imports, comments)
    if (!line.trim().startsWith('//') && !line.trim().startsWith('*') && !line.includes('interface') && !line.includes('type ')) {
      if (/\bsk-[a-zA-Z0-9]{20,}/.test(line) || /\bAIza[a-zA-Z0-9]{30,}/.test(line) || /\bAKIA[a-zA-Z0-9]{16,}/.test(line)) {
        apiKeyFiles.push(`${f}:${i + 1}`);
      }
    }
    // console.log (only in non-test files)
    if (!f.includes('__tests__') && !f.includes('.test.') && /\bconsole\.log\b/.test(line) && !line.trim().startsWith('//')) {
      consoleLogFiles.push(`${f}:${i + 1}`);
    }
    // TODO/FIXME
    if (/\b(TODO|FIXME)\b/.test(line)) {
      todoFiles.push(`${f}:${i + 1}`);
    }
  }
}

if (debuggerFiles.length > 0) {
  FAIL(`Найден debugger в ${debuggerFiles.length} местах:`);
  debuggerFiles.forEach(f => console.log(`    ${RED}→ ${f}${RESET}`));
} else {
  PASS('Нет debugger в коде');
}

if (apiKeyFiles.length > 0) {
  CRITICAL(`Найдены API-ключи в ${apiKeyFiles.length} местах:`);
  apiKeyFiles.forEach(f => console.log(`    ${RED}→ ${f}${RESET}`));
} else {
  PASS('Нет API-ключей в коде');
}

if (consoleLogFiles.length > 0) {
  WARN(`console.log найден в ${consoleLogFiles.length} местах (не критично)`);
} else {
  PASS('Нет console.log в коде');
}

if (todoFiles.length > 0) {
  WARN(`TODO/FIXME найден в ${todoFiles.length} местах`);
} else {
  PASS('Нет TODO/FIXME в коде');
}

// ══════════════════════════════════════════════════════════════
// БЛОК 9: ПРОВЕРКА ИЗОБРАЖЕНИЙ
// ══════════════════════════════════════════════════════════════
header(9, 'ИЗОБРАЖЕНИЯ (ДОСТУПНОСТЬ)');

const pageFiles = scanDir('src/pages', ['.tsx']);
let imgIssues = 0;

for (const f of pageFiles) {
  const content = fs.readFileSync(f, 'utf-8');
  const imgMatches = content.match(/<img\b[^>]*>/gi) || [];
  
  for (const imgTag of imgMatches) {
    // Skip honeypot / hidden fields
    if (imgTag.includes('display: none') || imgTag.includes('aria-hidden')) continue;
    
    const label = path.basename(f);
    if (!imgTag.includes('alt=') && !imgTag.includes('alt ')) {
      FAIL(`[${label}] <img> без alt: ${imgTag.substring(0, 60)}...`);
      imgIssues++;
    }
    if (!imgTag.includes('loading=')) {
      WARN(`[${label}] <img> без loading=: ${imgTag.substring(0, 60)}...`);
    }
  }
}

if (imgIssues === 0) {
  PASS('Все <img> в src/pages/ имеют alt');
}

// ══════════════════════════════════════════════════════════════
// БЛОК 10: ИТОГОВЫЙ СЧЁТ
// ══════════════════════════════════════════════════════════════
header(10, 'ИТОГОВЫЙ СЧЁТ');

console.log(`
  Всего проверок:    ${BOLD}${total}${RESET}
  Пройдено (PASS):   ${GREEN}${pass}${RESET}
  Провалено (FAIL):  ${fail > 0 ? RED : GREEN}${fail}${RESET}
  Предупреждений:    ${warn > 0 ? YELLOW : GREEN}${warn}${RESET}
  Критических:       ${critical > 0 ? RED : GREEN}${critical}${RESET}
`);

if (fail > 0 || critical > 0) {
  console.log(`${RED}${BOLD}❌ САЙТ НЕ ПРОШЁЛ QA-АУДИТ. ДЕПЛОЙ ЗАБЛОКИРОВАН.${RESET}\n`);
  process.exit(1);
} else {
  console.log(`${GREEN}${BOLD}✅ САЙТ ПРОШЁЛ ПОЛНЫЙ QA-АУДИТ. ГОТОВ К ДЕПЛОЮ.${RESET}\n`);
  process.exit(0);
}
