/**
 * One-off IndexNow push for 24 mole-control city pages.
 * Sends to both Yandex and generic IndexNow endpoints in parallel.
 */

const HOST = 'goruslugimsk.ru';
const KEY = 'goruslugimsk-2026-indexnow';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const SLUGS = [
  'istra', 'krasnogorsk', 'nakhabino', 'dedovsk', 'odintsovo',
  'barvikha', 'usovo', 'zhukovka', 'lobnya', 'dolgoprudny-mo',
  'dmitrov-mo', 'yakhroma', 'khimki', 'chekhov-mo', 'serpukhov',
  'naro-fominsk', 'mozhaysk', 'klin-mo', 'solnechnogorsk',
  'domodedovo-mo', 'taldom', 'dubna-mo', 'ruza', 'voskresensk-mo',
];

const urlList = SLUGS.map(s => `https://${HOST}/uslugi/borba-s-krotami/${s}/`);

console.log(`📦 Pushing ${urlList.length} mole URLs to IndexNow`);
console.log(`   First: ${urlList[0]}`);
console.log(`   Last:  ${urlList[urlList.length - 1]}\n`);

const body = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList,
});

const endpoints = [
  { name: 'Yandex',  url: 'https://yandex.com/indexnow' },
  { name: 'Generic', url: 'https://api.indexnow.org/indexnow' },
];

const results = await Promise.all(endpoints.map(async ({ name, url }) => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body,
    });
    const text = await res.text();
    return { name, url, status: res.status, statusText: res.statusText, body: text || '(empty)' };
  } catch (err) {
    return { name, url, error: err.message };
  }
}));

let hasError = false;
for (const r of results) {
  console.log(`\n━━━ ${r.name} (${r.url}) ━━━`);
  if (r.error) {
    console.error(`❌ Network error: ${r.error}`);
    hasError = true;
  } else {
    const ok = r.status === 200 || r.status === 202;
    console.log(`${ok ? '✅' : '⚠️'} ${r.status} ${r.statusText}`);
    console.log(`   Body: ${r.body.slice(0, 300)}`);
    if (!ok) hasError = true;
  }
}

console.log(`\n${hasError ? '⚠️ Completed with issues' : '✅ All endpoints accepted'} — ${urlList.length} URLs submitted`);
process.exit(hasError ? 1 : 0);
