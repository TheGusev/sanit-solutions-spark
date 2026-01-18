/**
 * === SUBPAGE DATA TYPES ===
 * Типы данных для подстраниц услуг
 * 
 * @description Универсальная структура для всех подстраниц
 * @note Используется для дезинфекции, дезинсекции, дератизации
 */

export type ServiceCategory = 'dezinfekciya' | 'dezinsekciya' | 'deratizaciya';

export interface SubpageSEO {
  title: string;           // До 60 символов
  description: string;     // До 160 символов
  h1: string;
  keywords: string[];
}

export interface SubpageHeroData {
  subtitle: string;
  badges: { icon: string; text: string }[];
  rating: { score: number; reviews: number };
}

export interface SubpageBreadcrumb {
  text: string;
  url: string;
}

export interface SubpageReason {
  icon: string;
  title: string;
  description: string;
}

export interface SubpageProcessStep {
  number: number;
  title: string;
  weDoItems: string[];
  youDoItems?: string[];
  duration: string;
  infoBox?: { type: 'blue' | 'orange'; icon: string; title: string; text: string };
}

export interface SubpagePricingRow {
  cells: string[];
  highlighted?: boolean;
}

export interface SubpagePricing {
  headers: string[];
  rows: SubpagePricingRow[];
  included: string[];
  additional?: { name: string; price: string }[];
}

export interface SubpageAdvantage {
  icon: string;
  title: string;
  description: string;
}

export interface SubpageFAQItem {
  question: string;
  answer: string;
}

export interface SubpageRelatedService {
  icon: string;
  title: string;
  price: string;
  url: string;
}

export interface SubpageData {
  // Идентификация
  category: ServiceCategory;
  slug: string;
  
  // SEO
  seo: SubpageSEO;
  
  // Хлебные крошки
  breadcrumbs: SubpageBreadcrumb[];
  
  // Hero секция
  hero: SubpageHeroData;
  
  // Когда нужна услуга (6 причин)
  reasons: {
    title: string;
    leadText: string;
    items: SubpageReason[];
  };
  
  // Этапы работы (4 шага)
  process: {
    title: string;
    steps: SubpageProcessStep[];
  };
  
  // Цены
  pricing: SubpagePricing;
  
  // Преимущества (6 шт)
  advantages: SubpageAdvantage[];
  
  // FAQ (10+ вопросов)
  faq: SubpageFAQItem[];
  
  // Связанные услуги
  relatedServices: SubpageRelatedService[];
}

/**
 * Утилита для получения подстраницы по категории и slug
 */
export function getSubpageKey(category: ServiceCategory, slug: string): string {
  return `${category}/${slug}`;
}
