/**
 * Генерация HTML для <head> секции (для SSG)
 */

import type { PageMetadata } from './metadata';

/**
 * Генерирует HTML для <head> секции
 */
export function generateHeadHTML(metadata: PageMetadata): string {
  const {
    title,
    description,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    keywords,
    noindex,
    schema,
  } = metadata;

  const metaTags: string[] = [];

  // Basic meta
  metaTags.push(`<title>${escapeHtml(title)}</title>`);
  metaTags.push(`<meta name="description" content="${escapeHtml(description)}">`);

  // Robots
  if (noindex) {
    metaTags.push(`<meta name="robots" content="noindex, nofollow">`);
  } else {
    metaTags.push(`<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">`);
  }

  // Canonical
  if (canonical) {
    metaTags.push(`<link rel="canonical" href="${escapeHtml(canonical)}">`);
    metaTags.push(`<link rel="alternate" hrefLang="ru" href="${escapeHtml(canonical)}">`);
    metaTags.push(`<link rel="alternate" hrefLang="x-default" href="${escapeHtml(canonical)}">`);
  }

  // Keywords (optional, менее важны в 2026)
  if (keywords && keywords.length > 0) {
    metaTags.push(`<meta name="keywords" content="${escapeHtml(keywords.join(', '))}">`);
  }

  // Open Graph
  metaTags.push(`<meta property="og:type" content="website">`);
  if (canonical) {
    metaTags.push(`<meta property="og:url" content="${escapeHtml(canonical)}">`);
  }
  metaTags.push(`<meta property="og:title" content="${escapeHtml(ogTitle || title)}">`);
  metaTags.push(`<meta property="og:description" content="${escapeHtml(ogDescription || description)}">`);
  if (ogImage) {
    metaTags.push(`<meta property="og:image" content="${escapeHtml(ogImage)}">`);
  }
  metaTags.push(`<meta property="og:site_name" content="Санитарные Решения">`);
  metaTags.push(`<meta property="og:locale" content="ru_RU">`);

  // Twitter Card
  metaTags.push(`<meta name="twitter:card" content="summary_large_image">`);
  metaTags.push(`<meta name="twitter:title" content="${escapeHtml(ogTitle || title)}">`);
  metaTags.push(`<meta name="twitter:description" content="${escapeHtml(ogDescription || description)}">`);
  if (ogImage) {
    metaTags.push(`<meta name="twitter:image" content="${escapeHtml(ogImage)}">`);
  }

  // Schema.org JSON-LD
  if (schema) {
    const schemaArray = Array.isArray(schema) ? schema : [schema];
    schemaArray.forEach(s => {
      metaTags.push(`<script type="application/ld+json">${JSON.stringify(s)}</script>`);
    });
  }

  return metaTags.join('\n    ');
}

/**
 * Экранирует HTML для безопасной вставки
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Генерирует мета-теги для Helmet (React)
 */
export function generateHelmetProps(metadata: PageMetadata) {
  const {
    title,
    description,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    keywords,
    noindex,
  } = metadata;

  return {
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'robots', content: noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
      ...(keywords ? [{ name: 'keywords', content: keywords.join(', ') }] : []),
      // Open Graph
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: canonical },
      { property: 'og:title', content: ogTitle || title },
      { property: 'og:description', content: ogDescription || description },
      { property: 'og:image', content: ogImage },
      { property: 'og:site_name', content: 'Санитарные Решения' },
      { property: 'og:locale', content: 'ru_RU' },
      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: ogTitle || title },
      { name: 'twitter:description', content: ogDescription || description },
      { name: 'twitter:image', content: ogImage },
    ],
    link: [
      { rel: 'canonical', href: canonical },
      { rel: 'alternate', hrefLang: 'ru', href: canonical },
      { rel: 'alternate', hrefLang: 'x-default', href: canonical },
    ],
  };
}
