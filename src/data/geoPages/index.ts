/**
 * === GEO PAGES INDEX ===
 * Централизованный экспорт географических страниц
 */

export * from './types';
export { moscowDistricts, getDistrictInfo, getAllDistricts } from './districts';
export { dezinfekciyaGeoPages } from './dezinfekciyaGeoPages';
export { dezinsekciyaGeoPages } from './dezinsekciyaGeoPages';
export { deratizaciyaGeoPages } from './deratizaciyaGeoPages';

import { dezinfekciyaGeoPages } from './dezinfekciyaGeoPages';
import { dezinsekciyaGeoPages } from './dezinsekciyaGeoPages';
import { deratizaciyaGeoPages } from './deratizaciyaGeoPages';
import type { GeoPageData } from './types';

export const allGeoPages: GeoPageData[] = [
  ...dezinfekciyaGeoPages,
  ...dezinsekciyaGeoPages,
  ...deratizaciyaGeoPages
];

export function getGeoPage(slug: string): GeoPageData | undefined {
  return allGeoPages.find((page) => page.slug === slug);
}

export function getGeoPageUrl(page: GeoPageData): string {
  return `/uslugi/${page.slug}`;
}
