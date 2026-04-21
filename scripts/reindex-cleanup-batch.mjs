/**
 * One-shot IndexNow push for cleanup Batch 2 + Batch 3 + Money-pages.
 * Notifies Yandex to re-crawl URLs whose indexability changed (noindex/canonical override).
 *
 * Reads sitemap-blog.xml live to discover blog slugs, then adds hand-picked
 * Batch 3 + money-pages URLs.
 */

const HOST = 'goruslugimsk.ru';
const KEY = 'goruslugimsk-2026-indexnow';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://yandex.com/indexnow';
const SITEMAP_BLOG = `https://${HOST}/sitemap-blog.xml`;

// Batch 2 — discover from live blog sitemap
const BLOG_PATTERNS = [
  /\/blog\/kak-izbavitsya-ot-/i,
  /\/blog\/professionalnaya-obrabotka-ot-/i,
  /\/blog\/posle-obrabotki-/i,
  /\/blog\/podgotovka-k-obrabotke-/i,
];

// Batch 3 — pest/object cleanup (hardcoded, 6 URL)
const BATCH_3 = [
  `https://${HOST}/uslugi/dezinsekciya/domashnih-klopov/`,
  `https://${HOST}/uslugi/dezinsekciya/postelnyh-klopov/`,
  `https://${HOST}/uslugi/dezinsekciya/unichtozhenie-klopov/`,
  `https://${HOST}/uslugi/ozonirovanie/gostinic/`,
  `https://${HOST}/uslugi/ozonirovanie/hostela/`,
  `https://${HOST}/uslugi/ozonirovanie/magazinov/`,
];

// Money-pages — consolidation beneficiaries
const MONEY_PAGES = [
  `https://${HOST}/uslugi/dezinsekciya/klopy/`,
  `https://${HOST}/uslugi/dezinsekciya/tarakany/`,
  `https://${HOST}/uslugi/deratizaciya/krysy/`,
  `https://${HOST}/uslugi/dezinsekciya/`,
  `https://${HOST}/uslugi/ozonirovanie/`,
];

// 1. Stale-deploy guard: check Last-Modified on a sample URL
const sampleRes = await fetch(`https://${HOST}/blog/posle-obrabotki-domov/`, { method: 'HEAD' });
const lastMod = sampleRes.headers.get('last-modified');
console.log(`🔎 Sample Last-Modified: ${lastMod}`);
const lastModDate = lastMod ? new Date(lastMod) : null;
const ageDays = lastModDate ? Math.floor((Date.now() - lastModDate.getTime()) / 86400000) : null;
if (ageDays !== null && ageDays > 1) {
  console.warn(`⚠️  WARNING: production HTML is ${ageDays} days old. Yandex may re-crawl stale version without noindex meta.`);
  console.warn(`   Recommended: deploy first, then re-run this script.`);
} else {
  console.log(`✅ Production HTML is fresh (${ageDays}d old).`);
}

// 2. Fetch blog sitemap and filter
const xml = await fetch(SITEMAP_BLOG).then(r => r.text());
const allBlogUrls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const batch2 = allBlogUrls.filter(u => BLOG_PATTERNS.some(re => re.test(u)));
console.log(`📚 Batch 2 (blog noindex): ${batch2.length} URLs`);

// 3. Combine
const urlList = [...new Set([...batch2, ...BATCH_3, ...MONEY_PAGES])];
console.log(`📦 Total: ${urlList.length} URLs (${batch2.length} blog + ${BATCH_3.length} pest/obj + ${MONEY_PAGES.length} money)`);

// 4. Send to Yandex IndexNow (max 10000/req, we're well under)
const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };
const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});
console.log(`\n🚀 Yandex IndexNow → ${res.status} ${res.statusText}`);
if (!res.ok) {
  console.error(`❌ Body: ${await res.text()}`);
  process.exit(1);
}
console.log(`✅ Sent ${urlList.length} URLs for re-crawl.`);
console.log(`\n📋 First 5: ${urlList.slice(0, 5).join('\n   ')}`);
