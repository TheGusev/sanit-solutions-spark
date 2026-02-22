/**
 * AI-Citability Linter: validates blog articles for AI-readiness.
 * Run: npx tsx scripts/validate-ai-ready.ts
 */

import { allBlogArticles } from '../src/data/blog';

const PROMO_PATTERNS = [
  /звоните/i,
  /\+7\s*\(\d{3}\)/,
  /оставьте заявку/i,
  /закажите/i,
  /от \d+\s*₽\/мес/i,
  /whatsapp|telegram|viber/i,
];

const SOURCES_WHITELIST = [
  'consultant.ru',
  'garant.ru',
  'rospotrebnadzor.ru',
  'docs.cntd.ru',
  'fao.org',
  'who.int',
  'government.ru',
];

const LEGAL_MARKERS = ['штраф', 'документ', 'проверк'];

type Level = 'error' | 'warning';
interface Issue { level: Level; article: string; rule: string; detail: string; }

const issues: Issue[] = [];

function isGenerator(slug: string): boolean {
  // Generated articles have numeric IDs in specific ranges or known slug patterns
  const a = allBlogArticles.find(x => x.slug === slug);
  if (!a) return false;
  return a.id >= 500; // legacy articles are 1-9
}

function getContentParagraphs(content: string): string[] {
  return content.split(/\n\n+/).map(p => p.trim()).filter(p => p.length > 20 && !p.startsWith('#') && !p.startsWith('|'));
}

for (const article of allBlogArticles) {
  const gen = isGenerator(article.slug);
  const isLegal = article.intent === 'laws' || article.intent === 'docs';
  const lvl = (rule: Level): Level => gen ? rule : 'warning';

  // 1. tldr check
  if (!article.tldr || article.tldr.length === 0) {
    issues.push({ level: lvl('error'), article: article.slug, rule: 'tldr-missing', detail: 'No tldr field' });
  } else if (article.tldr.length < 3 || article.tldr.length > 6) {
    issues.push({ level: 'warning', article: article.slug, rule: 'tldr-length', detail: `tldr has ${article.tldr.length} items (expected 3-6)` });
  }

  // 2. sources for legal
  if (isLegal) {
    if (!article.sources || article.sources.length < 3) {
      issues.push({ level: 'error', article: article.slug, rule: 'sources-missing', detail: `Legal article needs >= 3 sources, has ${article.sources?.length || 0}` });
    }
    // whitelist check
    if (article.sources) {
      for (const src of article.sources) {
        if (!src.url.startsWith('https://')) {
          issues.push({ level: 'error', article: article.slug, rule: 'sources-https', detail: `Source URL not https: ${src.url}` });
        }
        const allowed = SOURCES_WHITELIST.some(d => src.url.includes(d));
        if (!allowed) {
          issues.push({ level: 'error', article: article.slug, rule: 'sources-whitelist', detail: `Source domain not in whitelist: ${src.url}` });
        }
      }
    }
    // legal markers in headings
    const headings = article.content.match(/^#{2,3}\s+.+$/gm) || [];
    const hasMarkers = LEGAL_MARKERS.some(m => headings.some(h => h.toLowerCase().includes(m)));
    if (!hasMarkers) {
      issues.push({ level: 'error', article: article.slug, rule: 'legal-markers', detail: 'No H2/H3 headings with штраф/документ/проверк markers' });
    }
  }

  // 3. promo-first check (first 5 paragraphs)
  const paragraphs = getContentParagraphs(article.content);
  const first5 = paragraphs.slice(0, 5);
  for (let i = 0; i < first5.length; i++) {
    for (const pat of PROMO_PATTERNS) {
      if (pat.test(first5[i])) {
        issues.push({ level: lvl('error'), article: article.slug, rule: 'promo-first', detail: `Promo in paragraph ${i + 1}: "${first5[i].slice(0, 60)}..."` });
      }
    }
  }

  // 4. promo density
  const promoCount = paragraphs.filter(p => PROMO_PATTERNS.some(pat => pat.test(p))).length;
  const density = paragraphs.length > 0 ? promoCount / paragraphs.length : 0;
  if (density > 0.1) {
    issues.push({ level: lvl('error'), article: article.slug, rule: 'promo-density', detail: `${(density * 100).toFixed(0)}% promo paragraphs (max 10%)` });
  }

  // 5. updatedAt
  if (!article.updatedAt) {
    issues.push({ level: 'warning', article: article.slug, rule: 'updatedAt-missing', detail: 'No updatedAt field' });
  }

  // 6. FAQ answers without CTA
  if (article.faq) {
    for (const faq of article.faq) {
      for (const pat of PROMO_PATTERNS) {
        if (pat.test(faq.answer)) {
          issues.push({ level: 'error', article: article.slug, rule: 'faq-cta', detail: `FAQ answer contains promo: "${faq.answer.slice(0, 60)}..."` });
        }
      }
    }
  }
}

// Report
const errors = issues.filter(i => i.level === 'error');
const warnings = issues.filter(i => i.level === 'warning');

console.log(`\n📋 AI-Citability Lint: ${allBlogArticles.length} articles checked\n`);

if (errors.length > 0) {
  console.log(`❌ ${errors.length} ERRORS:`);
  for (const e of errors) {
    console.log(`  [${e.rule}] ${e.article}: ${e.detail}`);
  }
}

if (warnings.length > 0) {
  console.log(`\n⚠️  ${warnings.length} WARNINGS:`);
  for (const w of warnings) {
    console.log(`  [${w.rule}] ${w.article}: ${w.detail}`);
  }
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All articles pass AI-citability checks!');
}

console.log(`\n📊 Summary: ${errors.length} errors, ${warnings.length} warnings\n`);

process.exit(errors.length > 0 ? 1 : 0);
