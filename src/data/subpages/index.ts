/**
 * === SUBPAGES INDEX ===
 * Централизованный экспорт всех подстраниц услуг
 */

export * from './types';
export { dezinfekciyaSubpages } from './dezinfekciyaSubpages';
export { dezinsekciyaSubpages } from './dezinsekciyaSubpages';
export { deratizaciyaSubpages } from './deratizaciyaSubpages';

import { dezinfekciyaSubpages } from './dezinfekciyaSubpages';
import { dezinsekciyaSubpages } from './dezinsekciyaSubpages';
import { deratizaciyaSubpages } from './deratizaciyaSubpages';
import type { SubpageData, ServiceCategory } from './types';

// Все подстраницы в одном массиве
export const allSubpages: SubpageData[] = [
  ...dezinfekciyaSubpages,
  ...dezinsekciyaSubpages,
  ...deratizaciyaSubpages,
];

/**
 * Получить подстраницу по категории и slug
 */
export function getSubpage(category: ServiceCategory, slug: string): SubpageData | undefined {
  return allSubpages.find(
    (page) => page.category === category && page.slug === slug
  );
}

/**
 * Получить все подстраницы категории
 */
export function getSubpagesByCategory(category: ServiceCategory): SubpageData[] {
  return allSubpages.filter((page) => page.category === category);
}

/**
 * Получить URL подстраницы
 */
export function getSubpageUrl(subpage: SubpageData): string {
  return `/uslugi/${subpage.category}/${subpage.slug}`;
}

/**
 * Проверить, существует ли подстраница
 */
export function subpageExists(category: string, slug: string): boolean {
  return allSubpages.some(
    (page) => page.category === category && page.slug === slug
  );
}
