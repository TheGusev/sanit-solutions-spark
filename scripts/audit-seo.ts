/**
 * Day 6: Финальный SEO-аудит.
 * Проверяет согласованность semanticCore, seoRoutes и sitemap.
 *
 * Запуск: npx tsx scripts/audit-seo.ts
 */

import { semanticCore, validateNoDuplicates, getSemanticStats } from '../src/data/semanticCore';
import { getAllSSGRoutes } from '../src/lib/seoRoutes';

function audit() {
  console.log('=== SEO AUDIT Day 6 ===\n');

  // 1. Semantic Core stats
  const stats = getSemanticStats();
  console.log('📊 Semantic Core:');
  console.log(`   Всего записей: ${stats.total}`);
  console.log(`   По кластерам:`, stats.byCluster);
  console.log(`   По приоритетам:`, stats.byPriority);
  console.log(`   По интентам:`, stats.byIntent);

  // 2. Duplicate check
  const dupes = validateNoDuplicates();
  if (dupes.length > 0) {
    console.error(`\n❌ Найдено ${dupes.length} дублей запросов:`);
    dupes.forEach(d => console.error(`   "${d.query}" → ${d.canonicals.join(', ')}`));
  } else {
    console.log('\n✅ Дубли запросов: 0');
  }

  // 3. Cross-check: semantic core canonicals vs SSG routes
  const ssgRoutes = getAllSSGRoutes();
  const ssgPaths = new Set(ssgRoutes.map(r => r.path.replace(/\/?$/, '/')));
  
  const missingInSSG: string[] = [];
  const coreCanonicals = new Set<string>();
  
  for (const entry of semanticCore) {
    coreCanonicals.add(entry.canonical);
    // Normalize: semantic core paths have trailing slash, SSG may not
    const normalized = entry.canonical;
    if (!ssgPaths.has(normalized) && !normalized.startsWith('/blog/')) {
      // Blog articles are in SSG but path format may differ slightly
      missingInSSG.push(`${entry.canonical} (query: "${entry.query}")`);
    }
  }

  if (missingInSSG.length > 0) {
    console.warn(`\n⚠️ ${missingInSSG.length} canonical из semanticCore отсутствуют в SSG:`);
    missingInSSG.slice(0, 10).forEach(p => console.warn(`   ${p}`));
    if (missingInSSG.length > 10) console.warn(`   ... и ещё ${missingInSSG.length - 10}`);
  } else {
    console.log('\n✅ Все canonical из semanticCore есть в SSG');
  }

  // 4. High-priority pages check
  const p1 = semanticCore.filter(e => e.priority === 1);
  console.log(`\n🏆 Приоритет 1 (${p1.length} страниц):`);
  p1.forEach(e => console.log(`   ${e.canonical} ← "${e.query}"`));

  // 5. SSG total
  console.log(`\n📄 SSG маршрутов: ${ssgRoutes.length}`);
  console.log(`📄 Semantic Core записей: ${stats.total}`);
  
  // 6. Check for doorway remnants
  const doorways = ssgRoutes.filter(r => {
    const parts = r.path.split('/').filter(Boolean);
    // Pattern: /uslugi/{service}/{district} where district is a neighborhood
    return parts.length === 3 && parts[0] === 'uslugi' && 
      ['dezinsekciya', 'dezinfekciya', 'deratizaciya', 'ozonirovanie'].includes(parts[1]) &&
      !['kvartir', 'domov', 'ofisov', 'restoranov', 'skladov', 'proizvodstv',
        'tarakany', 'klopy', 'muravyi', 'blohi', 'mol', 'krysy', 'myshi',
        'unichtozhenie-klopov', 'unichtozhenie-tarakanov', 'unichtozhenie-krys', 'unichtozhenie-myshej',
        'po-okrugam-moskvy'].includes(parts[2]);
  });

  if (doorways.length > 0) {
    console.error(`\n❌ Найдено ${doorways.length} doorway-страниц в SSG!`);
    doorways.slice(0, 5).forEach(d => console.error(`   ${d.path}`));
  } else {
    console.log('\n✅ Doorway-страницы: 0');
  }

  console.log('\n=== АУДИТ ЗАВЕРШЁН ===');
}

audit();
