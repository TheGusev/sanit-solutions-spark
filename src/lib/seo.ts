/**
 * Унифицированные SEO-утилиты для всего сайта.
 * Используйте эти константы и функции для единообразия метаданных.
 */

export const SEO_CONFIG = {
  baseUrl: 'https://goruslugimsk.ru',
  companyName: 'Санитарные Решения',
  phone: '8-495-018-18-17',
  phoneClean: '84950181817',
  ogImage: 'https://goruslugimsk.ru/og-image.jpg',
  locale: 'ru_RU',
};

export interface SEOMeta {
  title: string;
  description: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  robots?: string;
  hreflangRu?: string;
  hreflangDefault?: string;
}

/**
 * Нормализует путь, добавляя trailing slash (кроме корня)
 */
export function normalizePathWithTrailingSlash(path: string): string {
  if (path === '/' || path === '') return '/';
  return path.endsWith('/') ? path : `${path}/`;
}

/**
 * Генерирует полный набор SEO-метаданных для страницы.
 */
export function generateSEOMeta(
  path: string, 
  title: string, 
  description: string,
  options?: {
    ogType?: string;
    robots?: string;
    ogImage?: string;
  }
): SEOMeta {
  // Нормализуем путь с trailing slash
  const normalizedPath = normalizePathWithTrailingSlash(path);
  const fullUrl = `${SEO_CONFIG.baseUrl}${normalizedPath}`;
  
  return {
    title,
    description,
    canonical: fullUrl,
    ogTitle: title,
    ogDescription: description,
    ogImage: options?.ogImage || SEO_CONFIG.ogImage,
    ogType: options?.ogType || 'website',
    robots: options?.robots || 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    hreflangRu: fullUrl,
    hreflangDefault: fullUrl,
  };
}

/**
 * Формат заголовка услуги: "[Услуга] в Москве от [цена]₽ — Гарантия 1 год | Санитарные Решения"
 */
export function formatServiceTitle(serviceName: string, priceFrom: number): string {
  return `${serviceName} в Москве от ${priceFrom}₽ — Гарантия 1 год | ${SEO_CONFIG.companyName}`;
}

/**
 * Формат описания услуги
 */
export function formatServiceDescription(serviceName: string, priceFrom: number, features: string[]): string {
  const featuresText = features.slice(0, 3).map(f => `• ${f}`).join(' ');
  return `Профессиональная ${serviceName.toLowerCase()} в Москве от ${priceFrom}₽ ${featuresText} ${SEO_CONFIG.phone}`;
}

/**
 * Формат заголовка округа: "Дезинфекция в [Округ] Москвы от [цена]₽ — Выезд [время] | Санитарные Решения"
 */
export function formatDistrictTitle(districtName: string, priceFrom: number, responseTime: string): string {
  return `Дезинфекция в ${districtName} Москвы от ${priceFrom}₽ — Выезд ${responseTime} | ${SEO_CONFIG.companyName}`;
}

/**
 * Формат заголовка блога
 */
export function formatBlogTitle(postTitle: string): string {
  return `${postTitle} | ${SEO_CONFIG.companyName}`;
}
