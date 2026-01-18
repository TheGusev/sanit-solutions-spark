/**
 * === GEO PAGES INDEX ===
 * Централизованный экспорт географических страниц
 */

export * from './types';
export { moscowDistricts, getDistrictInfo, getAllDistricts } from './districts';
export { dezinfekciyaGeoPages } from './dezinfekciyaGeoPages';

import { dezinfekciyaGeoPages } from './dezinfekciyaGeoPages';
import type { GeoPageData } from './types';

export const allGeoPages: GeoPageData[] = [...dezinfekciyaGeoPages];

export function getGeoPage(slug: string): GeoPageData | undefined {
  return allGeoPages.find((page) => page.slug === slug);
}

export function getGeoPageUrl(page: GeoPageData): string {
  return `/uslugi/${page.slug}`;
}
