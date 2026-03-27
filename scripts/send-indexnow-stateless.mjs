/**
 * Stateless IndexNow sender for Yandex.
 * Parses all dist/sitemap-*.xml files and sends a daily batch of 50 URLs.
 * No state files needed — batch index is computed from the date.
 */

import { readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

const HOST = 'goruslugimsk.ru';
const KEY = 'goruslugimsk-2026-indexnow';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://yandex.com/indexnow';
const START_DATE = new Date('2026-03-27').getTime();
const LIMIT = 50;

// 1. Parse all sitemap-*.xml files from dist/
const distDir = resolve('dist');
const sitemapFiles = readdirSync(distDir).filter(f => f.startsWith('sitemap-') && f.endsWith('.xml'));

const urls = [];
for (const file of sitemapFiles) {
  const content = readFileSync(resolve(distDir, file), 'utf-8');
  const matches = content.matchAll(/<loc>([^<]+)<\/loc>/g);
  for (const m of matches) {
    urls.push(m[1]);
  }
}

console.log(`📄 Found ${sitemapFiles.length} sitemap files with ${urls.length} total URLs`);

if (urls.length === 0) {
  console.log('⚠️ No URLs found, exiting.');
  process.exit(0);
}

// 2. Compute today's batch
const daysPassed = Math.floor((Date.now() - START_DATE) / (1000 * 60 * 60 * 24));
const startIndex = (daysPassed * LIMIT) % urls.length;

// Handle wrap-around
let urlsBatch;
if (startIndex + LIMIT <= urls.length) {
  urlsBatch = urls.slice(startIndex, startIndex + LIMIT);
} else {
  urlsBatch = [...urls.slice(startIndex), ...urls.slice(0, (startIndex + LIMIT) - urls.length)];
}

console.log(`📅 Day ${daysPassed} | startIndex=${startIndex} | batch=${urlsBatch.length} URLs`);
console.log(`   First: ${urlsBatch[0]}`);
console.log(`   Last:  ${urlsBatch[urlsBatch.length - 1]}`);

// 3. Send to Yandex IndexNow
const body = {
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: urlsBatch,
};

try {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  
  console.log(`\n🚀 IndexNow response: ${response.status} ${response.statusText}`);
  
  if (!response.ok) {
    const text = await response.text();
    console.error(`❌ Error body: ${text}`);
    process.exit(1);
  }
  
  console.log(`✅ Successfully submitted ${urlsBatch.length} URLs to Yandex IndexNow`);
} catch (err) {
  console.error(`❌ Network error: ${err.message}`);
  process.exit(1);
}
