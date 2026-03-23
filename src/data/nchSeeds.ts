/**
 * Генератор НЧ-страниц (услуга + вредитель + район).
 * Тиерированная модель: ~774 страниц.
 * 
 * Tier 1: top 4 pests × all 131 neighborhoods = ~524
 * Tier 2: next 4 pests × top 40 neighborhoods = ~160
 * Tier 3: remaining 6 pests × top 15 neighborhoods = ~90
 */

import { pests } from './pests';
import { neighborhoodSlugs, topNeighborhoods, tier2Neighborhoods } from '@/lib/seoRoutes';

export interface NchPage {
  id: string;
  service: 'dezinsekciya' | 'deratizaciya';
  pest: string;
  neighborhood: string;
  priority: 1 | 2 | 3; // 1 = tier 1 (highest), 3 = tier 3 (lowest)
  keyword: string;
}

// Re-export для обратной совместимости
export { topNeighborhoods } from '@/lib/seoRoutes';

// Tiered pest groups
export const tier1Pests = ['tarakany', 'klopy', 'krysy', 'myshi'];
export const tier2PestsList = ['muravyi', 'blohi', 'mol']; // kroty removed — outdoor MO service, not urban neighborhoods
export const tier3PestsList = ['komary', 'muhi', 'osy-shershni', 'cheshuynitsy', 'kleshchi', 'mokricy'];
export const topPests = tier1Pests;

/**
 * Генерирует массив НЧ-страниц для SSG (тиерированная модель).
 */
export function generateNchSeeds(): NchPage[] {
  const seeds: NchPage[] = [];
  
  // Tier 1: top 4 pests × all neighborhoods
  tier1Pests.forEach(pestSlug => {
    const pest = pests.find(p => p.slug === pestSlug);
    if (!pest) return;
    
    neighborhoodSlugs.forEach(neighborhoodSlug => {
      seeds.push({
        id: `${pest.serviceType}-${pestSlug}-${neighborhoodSlug}`,
        service: pest.serviceType,
        pest: pestSlug,
        neighborhood: neighborhoodSlug,
        priority: 1,
        keyword: `уничтожение ${pest.genitive} ${neighborhoodSlug}`
      });
    });
  });
  
  // Tier 2: next 4 pests × top 40 neighborhoods
  tier2PestsList.forEach(pestSlug => {
    const pest = pests.find(p => p.slug === pestSlug);
    if (!pest) return;
    
    tier2Neighborhoods.forEach(neighborhoodSlug => {
      seeds.push({
        id: `${pest.serviceType}-${pestSlug}-${neighborhoodSlug}`,
        service: pest.serviceType,
        pest: pestSlug,
        neighborhood: neighborhoodSlug,
        priority: 2,
        keyword: `уничтожение ${pest.genitive} ${neighborhoodSlug}`
      });
    });
  });
  
  // Tier 3: remaining 6 pests × top 15 neighborhoods
  tier3PestsList.forEach(pestSlug => {
    const pest = pests.find(p => p.slug === pestSlug);
    if (!pest) return;
    
    topNeighborhoods.forEach(neighborhoodSlug => {
      seeds.push({
        id: `dezinsekciya-${pestSlug}-${neighborhoodSlug}`,
        service: 'dezinsekciya',
        pest: pestSlug,
        neighborhood: neighborhoodSlug,
        priority: 3,
        keyword: `уничтожение ${pest.genitive} ${neighborhoodSlug}`
      });
    });
  });
  
  return seeds;
}

// Предварительно генерируем для использования в SSG
export const nchSeeds = generateNchSeeds();

// Получить НЧ-страницу по параметрам
export function getNchPage(service: string, pest: string, neighborhood: string): NchPage | undefined {
  return nchSeeds.find(
    n => n.service === service && n.pest === pest && n.neighborhood === neighborhood
  );
}

// Получить НЧ-страницы по услуге
export function getNchByService(service: 'dezinsekciya' | 'deratizaciya'): NchPage[] {
  return nchSeeds.filter(n => n.service === service);
}

// Получить НЧ-страницы по району
export function getNchByNeighborhood(neighborhood: string): NchPage[] {
  return nchSeeds.filter(n => n.neighborhood === neighborhood);
}

// Получить НЧ-страницы по вредителю
export function getNchByPest(pest: string): NchPage[] {
  return nchSeeds.filter(n => n.pest === pest);
}

// Статистика для отладки
export function getNchStats() {
  const byPriority = {
    1: nchSeeds.filter(n => n.priority === 1).length,
    2: nchSeeds.filter(n => n.priority === 2).length,
    3: nchSeeds.filter(n => n.priority === 3).length
  };
  
  const byService = {
    dezinsekciya: nchSeeds.filter(n => n.service === 'dezinsekciya').length,
    deratizaciya: nchSeeds.filter(n => n.service === 'deratizaciya').length
  };
  
  return {
    total: nchSeeds.length,
    byPriority,
    byService
  };
}
