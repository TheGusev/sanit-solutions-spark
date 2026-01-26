/**
 * Централизованное управление метаданными для всех страниц
 * Автоматическая валидация SEO-лимитов
 */

import { SEO_LIMITS, formatTitleForLimit, formatDescriptionForLimit } from './seoValidation';

export interface PageMetadata {
  title: string;
  description: string;
  h1?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  keywords?: string[];
  noindex?: boolean;
  schema?: object | object[];
}

export interface MetadataValidationResult {
  metadata: PageMetadata;
  warnings: string[];
  errors: string[];
}

/**
 * Валидирует и форматирует метаданные
 */
export function validateAndFormatMetadata(
  input: Partial<PageMetadata>,
  options: {
    autoFix?: boolean;
    pageType?: 'index' | 'service' | 'blog' | 'nch';
  } = {}
): MetadataValidationResult {
  const { autoFix = true, pageType = 'service' } = options;
  const warnings: string[] = [];
  const errors: string[] = [];

  let title = input.title || 'Санитарные Решения';
  let description = input.description || '';
  let h1 = input.h1 || title;

  // Валидация Title
  if (title.length < SEO_LIMITS.title.min) {
    warnings.push(`Title короткий: ${title.length} символов (мин: ${SEO_LIMITS.title.min})`);
  }
  if (title.length > SEO_LIMITS.title.max) {
    if (autoFix) {
      title = formatTitleForLimit(title);
      warnings.push(`Title обрезан: ${input.title?.length} → ${title.length} символов`);
    } else {
      errors.push(`Title длинный: ${title.length} символов (макс: ${SEO_LIMITS.title.max})`);
    }
  } else if (title.length > SEO_LIMITS.title.optimalMax) {
    warnings.push(`Title длиннее оптимального: ${title.length} символов (оптимум: ${SEO_LIMITS.title.optimalMax})`);
  }

  // Валидация Description
  if (description.length < SEO_LIMITS.description.min) {
    warnings.push(`Description короткий: ${description.length} символов (мин: ${SEO_LIMITS.description.min})`);
  }
  if (description.length > SEO_LIMITS.description.max) {
    if (autoFix) {
      description = formatDescriptionForLimit(description);
      warnings.push(`Description обрезан: ${input.description?.length} → ${description.length} символов`);
    } else {
      errors.push(`Description длинный: ${description.length} символов (макс: ${SEO_LIMITS.description.max})`);
    }
  } else if (description.length > SEO_LIMITS.description.optimalMax) {
    warnings.push(`Description длиннее оптимального: ${description.length} символов`);
  }

  // Валидация H1
  if (h1) {
    if (h1.length < SEO_LIMITS.h1.min) {
      warnings.push(`H1 короткий: ${h1.length} символов (мин: ${SEO_LIMITS.h1.min})`);
    }
    if (h1.length > SEO_LIMITS.h1.max) {
      warnings.push(`H1 длинный: ${h1.length} символов (макс: ${SEO_LIMITS.h1.max})`);
    }
  } else {
    errors.push('H1 отсутствует!');
  }

  // Open Graph - используем основные или создаём сокращённые
  const ogTitle = input.ogTitle || title;
  const ogDescription = input.ogDescription || 
    (description.length > 100 ? description.substring(0, 97) + '...' : description);

  const metadata: PageMetadata = {
    title,
    description,
    h1,
    canonical: input.canonical,
    ogTitle,
    ogDescription,
    ogImage: input.ogImage || 'https://goruslugimsk.ru/og-image.jpg',
    keywords: input.keywords,
    noindex: input.noindex || false,
    schema: input.schema,
  };

  return { metadata, warnings, errors };
}

/**
 * Генерирует метаданные для главной страницы
 */
export function generateIndexMetadata(): PageMetadata {
  return validateAndFormatMetadata({
    title: 'Дезинфекция, дезинсекция, дератизация в Москве',
    description: 'Профессиональная СЭС служба в Москве • Дезинфекция, дезинсекция, дератизация • Лицензия Роспотребнадзора • Гарантия до 1 года • +7 (906) 998-98-88',
    h1: 'Профессиональная служба СЭС в Москве и области',
    canonical: 'https://goruslugimsk.ru/',
    keywords: ['дезинфекция москва', 'дезинсекция москва', 'дератизация москва', 'сэс москва'],
  }).metadata;
}

/**
 * Генерирует метаданные для страницы услуги
 */
export function generateServiceMetadata(params: {
  serviceName: string;
  serviceSlug: string;
  priceFrom: number;
  pricePer: string;
  description?: string;
}): PageMetadata {
  const { serviceName, serviceSlug, priceFrom, pricePer, description } = params;

  return validateAndFormatMetadata({
    title: `${serviceName} в Москве — от ${priceFrom}₽ за ${pricePer}`,
    description: description || `Профессиональная ${serviceName.toLowerCase()} в Москве • Лицензия Роспотребнадзора • Выезд за 30 минут • Гарантия до 1 года • +7 (906) 998-98-88`,
    h1: `${serviceName} в Москве`,
    canonical: `https://goruslugimsk.ru/uslugi/${serviceSlug}`,
    keywords: [`${serviceName.toLowerCase()} москва`, `${serviceName.toLowerCase()} цена`],
  }).metadata;
}

/**
 * Генерирует метаданные для НЧ-страницы (Услуга + Вредитель + Район)
 */
export function generateNchMetadata(params: {
  service: string;
  pest: string;
  pestGenitive: string;
  location: string;
  priceFrom: number;
}): PageMetadata {
  const { service, pest, pestGenitive, location, priceFrom } = params;

  return validateAndFormatMetadata({
    title: `${service} от ${pestGenitive} в ${location} — от ${priceFrom}₽`,
    description: `Уничтожение ${pestGenitive} в ${location} • Выезд за 30 минут • Гарантия до 1 года • Безопасные препараты • +7 (906) 998-98-88`,
    h1: `${service} от ${pestGenitive} в районе ${location}`,
    canonical: `https://goruslugimsk.ru/uslugi/${service.toLowerCase()}/${pest}/${location}`,
    keywords: [`${pest} ${location}`, `уничтожение ${pestGenitive} ${location}`],
  }, { pageType: 'nch' }).metadata;
}

/**
 * Генерирует метаданные для страницы объекта (Услуга + Объект + Район)
 */
export function generateObjectDistrictMetadata(params: {
  service: string;
  serviceGenitive: string;
  object: string;
  objectGenitive: string;
  location: string;
  priceFrom: number;
}): PageMetadata {
  const { service, serviceGenitive, object, objectGenitive, location, priceFrom } = params;

  return validateAndFormatMetadata({
    title: `${service} ${objectGenitive} в ${location} — от ${priceFrom}₽`,
    description: `${service} ${objectGenitive} в районе ${location} • Профессиональная обработка • Выезд за 30 минут • Гарантия • +7 (906) 998-98-88`,
    h1: `${service} ${objectGenitive} в ${location}`,
    canonical: `https://goruslugimsk.ru/uslugi/${service.toLowerCase()}/${object}/${location}`,
    keywords: [`${serviceGenitive} ${objectGenitive} ${location}`],
  }, { pageType: 'nch' }).metadata;
}

/**
 * Генерирует метаданные для статьи блога
 */
export function generateBlogMetadata(params: {
  title: string;
  excerpt: string;
  slug: string;
  category?: string;
  readTime?: string;
}): PageMetadata {
  const { title, excerpt, slug, category, readTime } = params;

  return validateAndFormatMetadata({
    title: `${title} — Блог Санитарные Решения`,
    description: excerpt,
    h1: title,
    canonical: `https://goruslugimsk.ru/blog/${slug}`,
    keywords: category ? [category.toLowerCase()] : [],
  }, { pageType: 'blog' }).metadata;
}

/**
 * Валидирует метаданные в dev-режиме
 */
export function validateMetadataInDev(metadata: PageMetadata, pagePath: string) {
  if (import.meta.env.DEV) {
    const result = validateAndFormatMetadata(metadata, { autoFix: false });
    
    if (result.errors.length > 0) {
      console.error(`❌ SEO ERRORS на странице ${pagePath}:`, result.errors);
    }
    
    if (result.warnings.length > 0) {
      console.warn(`⚠️ SEO WARNINGS на странице ${pagePath}:`, result.warnings);
    }
  }
}
