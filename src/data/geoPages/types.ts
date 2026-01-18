/**
 * === GEO PAGES TYPES ===
 * Типы данных для географических landing pages по округам Москвы
 */

export type DistrictCode = 'cao' | 'sao' | 'svao' | 'vao' | 'uvao' | 'uao' | 'uzao' | 'zao' | 'szao';

export type ServiceType = 'dezinfekciya' | 'dezinsekciya' | 'deratizaciya';

export interface DistrictInfo {
  code: DistrictCode;
  name: string;
  fullName: string;
  districts: string[];
  arrivalTime: string;
  centerCoords: { lat: number; lng: number };
  characteristics: string[];
}

export interface GeoPageSpecific {
  icon: string;
  title: string;
  description: string;
}

export interface GeoPageCase {
  type: string;
  title: string;
  area: string;
  task: string;
  solution: string;
  date: string;
}

export interface GeoPageReview {
  rating: number;
  district: string;
  text: string;
  author: string;
  role: string;
  date: string;
}

export interface GeoPagePricing {
  apartments: {
    type: string;
    area: string;
    price: string;
    time: string;
  }[];
  offices: {
    area: string;
    price: string;
    time: string;
  }[];
  restaurants: {
    type: string;
    price: string;
    frequency: string;
  }[];
}

export interface GeoPageData {
  // Идентификация
  districtCode: DistrictCode;
  serviceType: ServiceType;
  slug: string;
  
  // SEO
  seo: {
    title: string;
    description: string;
    h1: string;
    keywords: string[];
  };
  
  // Hero
  hero: {
    subtitle: string;
    usps: string[];
  };
  
  // Хлебные крошки
  breadcrumbs: {
    text: string;
    url: string;
  }[];
  
  // Информация об округе
  districtInfo: DistrictInfo;
  
  // Специфика округа (6 пунктов)
  specifics: GeoPageSpecific[];
  
  // Цены
  pricing: GeoPagePricing;
  
  // Кейсы (2-3)
  cases: GeoPageCase[];
  
  // Отзывы (3)
  reviews: GeoPageReview[];
  
  // Статистика
  stats: {
    objectsCount: number;
    avgArrival: string;
    rating: number;
  };
}
