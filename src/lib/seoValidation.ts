/**
 * Централизованный SEO-валидатор
 * 
 * Проверяет Title (40-65 символов), Description (140-165 символов),
 * H1 (20-80 символов), и минимальное количество слов (500-650).
 */

// NOTE: neighborhoodSlugs is NOT imported here to avoid circular dependency
// (seoRoutes.ts imports from this file). Instead, validateRouteIntegrity
// accepts an optional Set<string> of neighborhoods passed by the caller.

export const SEO_LIMITS = {
  title: { min: 40, max: 65, optimalMax: 60 },
  description: { min: 140, max: 165, optimalMax: 160 },
  h1: { min: 20, max: 80 },
  wordCount: { base: 500, nch: 650 },
};

export interface SEOValidationResult {
  valid: boolean;
  warnings: string[];
  errors: string[];
  meta: {
    titleLength: number;
    descriptionLength: number;
    wordCount?: number;
  };
}

/**
 * Проверяет SEO-метаданные страницы
 */
export function validateSEO(meta: {
  title: string;
  description: string;
  h1?: string;
  wordCount?: number;
  isNchPage?: boolean;
}): SEOValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Проверка Title
  const titleLength = meta.title.length;
  if (titleLength < SEO_LIMITS.title.min) {
    warnings.push(`Title слишком короткий: ${titleLength} символов (мин: ${SEO_LIMITS.title.min})`);
  }
  if (titleLength > SEO_LIMITS.title.max) {
    errors.push(`Title слишком длинный: ${titleLength} символов (макс: ${SEO_LIMITS.title.max})`);
  } else if (titleLength > SEO_LIMITS.title.optimalMax) {
    warnings.push(`Title длиннее оптимального: ${titleLength} символов (оптимум: ≤${SEO_LIMITS.title.optimalMax})`);
  }

  // Проверка Description
  const descriptionLength = meta.description.length;
  if (descriptionLength < SEO_LIMITS.description.min) {
    warnings.push(`Description слишком короткое: ${descriptionLength} символов (мин: ${SEO_LIMITS.description.min})`);
  }
  if (descriptionLength > SEO_LIMITS.description.max) {
    errors.push(`Description слишком длинное: ${descriptionLength} символов (макс: ${SEO_LIMITS.description.max})`);
  } else if (descriptionLength > SEO_LIMITS.description.optimalMax) {
    warnings.push(`Description длиннее оптимального: ${descriptionLength} символов (оптимум: ≤${SEO_LIMITS.description.optimalMax})`);
  }

  // Проверка H1
  if (meta.h1) {
    const h1Length = meta.h1.length;
    if (h1Length < SEO_LIMITS.h1.min) {
      warnings.push(`H1 слишком короткий: ${h1Length} символов (мин: ${SEO_LIMITS.h1.min})`);
    }
    if (h1Length > SEO_LIMITS.h1.max) {
      warnings.push(`H1 слишком длинный: ${h1Length} символов (макс: ${SEO_LIMITS.h1.max})`);
    }
  }

  // Проверка word count
  if (meta.wordCount !== undefined) {
    const minWords = meta.isNchPage ? SEO_LIMITS.wordCount.nch : SEO_LIMITS.wordCount.base;
    if (meta.wordCount < minWords) {
      warnings.push(`Тонкий контент: ${meta.wordCount} слов (мин: ${minWords})`);
    }
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors,
    meta: {
      titleLength,
      descriptionLength,
      wordCount: meta.wordCount,
    },
  };
}

/**
 * Подсчитывает слова в HTML, исключая скрипты и стили
 */
export function countWordsInHtml(html: string): number {
  // Удаляем скрипты и стили
  const textContent = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Считаем слова длиной > 2 символов (игнорируем предлоги)
  return textContent.split(' ').filter(w => w.length > 2).length;
}

/**
 * Извлекает Title из HTML
 */
export function extractTitle(html: string): string | null {
  const match = html.match(/<title>([^<]+)<\/title>/i);
  return match ? match[1].trim() : null;
}

/**
 * Извлекает Description из HTML
 */
export function extractDescription(html: string): string | null {
  const match = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
  return match ? match[1].trim() : null;
}

/**
 * Извлекает H1 из HTML
 */
export function extractH1(html: string): string | null {
  const match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  return match ? match[1].trim() : null;
}

/**
 * Форматирует Title под лимит символов
 * Обрезает с конца, сохраняя смысл
 */
export function formatTitleForLimit(title: string, maxLength: number = SEO_LIMITS.title.optimalMax): string {
  if (title.length <= maxLength) return title;
  
  // Обрезаем до последнего пробела перед лимитом
  const truncated = title.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.7) {
    return truncated.substring(0, lastSpace);
  }
  
  return truncated;
}

/**
 * Форматирует Description под лимит символов
 */
export function formatDescriptionForLimit(description: string, maxLength: number = SEO_LIMITS.description.optimalMax): string {
  if (description.length <= maxLength) return description;
  
  // Обрезаем до последнего пробела перед лимитом
  const truncated = description.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.7) {
    return truncated.substring(0, lastSpace);
  }
  
  return truncated;
}


// ============================================================
// Route Integrity Validator (build-time fail-fast)
// ============================================================

/** Forbidden patterns that indicate route cannibalization */
const FORBIDDEN_PATTERNS: Array<{ regex: RegExp; reason: string }> = [
  // Object+Geo: /uslugi/[service]/[object]/[neighborhood]/ — must never exist
  {
    regex: /^\/uslugi\/[a-z-]+\/(?:kvartir|domov|ofisov|restoranov|skladov|proizvodstv|gostinic|detskih-sadov|hostela|magazinov|avtomobiley)\/[a-z-]+\/$/,
    reason: 'Object+Geo cannibalization — geo slugs must NOT appear under object pages',
  },
  // Geo slug directly under /uslugi/dezinfekciya/ (doorway page pattern)
  // Allowed: pest slugs, object slugs, subpage slugs. Blocked: neighborhood slugs.
  {
    regex: /^\/uslugi\/dezinfekciya\/[a-z-]+\/$/,
    reason: 'Potential geo slug under /uslugi/dezinfekciya/ — check against neighborhood list',
  },
  // Pest masquerading as service hub: /uslugi/[pest-slug]/
  {
    regex: /^\/uslugi\/(?:tarakany|klopy|muravyi|blohi|mol|komary|muhi|osy-shershni|cheshuynitsy|kleshchi|mokricy|krysy|myshi|kroty)\/$/,
    reason: 'Pest slug at service level — must be under /uslugi/[service]/[pest]/',
  },
  // Duplicate geo: /uslugi/kroty/ (should be /uslugi/deratizaciya/kroty/)
  {
    regex: /^\/uslugi\/kroty\//,
    reason: 'Kroty leak — must live at /uslugi/deratizaciya/kroty/',
  },
];

/**
 * Validates a single route path against forbidden patterns.
 * Throws an Error in CI/Docker (fail-fast), logs warning otherwise.
 */
export function validateRouteIntegrity(path: string, neighborhoodSet?: Set<string>): void {
  
  for (const { regex, reason } of FORBIDDEN_PATTERNS) {
    if (!regex.test(path)) continue;
    
    // Special case: /uslugi/dezinfekciya/[slug]/ — only block if slug is a neighborhood
    if (reason.includes('check against neighborhood list')) {
      const match = path.match(/^\/uslugi\/dezinfekciya\/([a-z-]+)\/$/);
      if (match && (!neighborhoodSet || !neighborhoodSet.has(match[1]))) continue;
    }
    
    const isCI = typeof process !== 'undefined' && (
      process.env.GITHUB_ACTIONS === 'true' || 
      process.env.DOCKER_BUILD === 'true' ||
      process.env.CI === 'true'
    );
    
    const msg = `[SEO] Forbidden route detected: ${path}\n  Reason: ${reason}`;
    
    if (isCI) {
      throw new Error(msg);
    } else {
      console.warn(`⚠️ ${msg}`);
    }
  }
}

/**
 * Validates an entire array of routes for integrity and uniqueness.
 * Call this at the end of getAllSSGRoutes().
 */
export function validateAllRoutes(routes: Array<{ path: string }>, neighborhoodSlugsArr?: string[]): void {
  const seen = new Set<string>();
  const duplicates: string[] = [];
  const nSet = neighborhoodSlugsArr ? new Set(neighborhoodSlugsArr) : undefined;
  
  for (const route of routes) {
    // Check forbidden patterns
    validateRouteIntegrity(route.path, nSet);
    
    // Check duplicates
    if (seen.has(route.path)) {
      duplicates.push(route.path);
    } else {
      seen.add(route.path);
    }
  }
  
  if (duplicates.length > 0) {
    const msg = `[SEO] Duplicate routes detected (${duplicates.length}):\n${duplicates.slice(0, 10).join('\n')}`;
    const isCI = typeof process !== 'undefined' && (
      process.env.GITHUB_ACTIONS === 'true' || 
      process.env.DOCKER_BUILD === 'true' ||
      process.env.CI === 'true'
    );
    if (isCI) throw new Error(msg);
    else console.warn(`⚠️ ${msg}`);
  }
}
