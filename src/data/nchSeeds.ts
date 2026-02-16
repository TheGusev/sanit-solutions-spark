/**
 * Генератор НЧ-страниц (услуга + вредитель + район).
 * Создаёт первую волну 300-500 низкочастотных страниц.
 * 
 * Логика приоритизации:
 * 1. Топ-вредители × Топ-районы = высший приоритет
 * 2. Все вредители × Топ-районы = средний приоритет
 * 3. Топ-вредители × все районы = низкий приоритет
 */

import { pests, dezinsekciyaPestSlugs, deratizaciyaPestSlugs } from './pests';
import { neighborhoodSlugs, topNeighborhoods } from '@/lib/seoRoutes';

export interface NchPage {
  id: string;
  service: 'dezinsekciya' | 'deratizaciya';
  pest: string;
  neighborhood: string;
  priority: 1 | 2 | 3; // 1 = высший, 3 = низший
  keyword: string;
}

// Топ-15 районов — импортированы из seoRoutes.ts (единый источник истины)
// Re-export для обратной совместимости
export { topNeighborhoods } from '@/lib/seoRoutes';

// Топ-вредители по спросу
export const topPests = ['tarakany', 'klopy', 'krysy', 'myshi'];

/**
 * Генерирует массив НЧ-страниц для SSG.
 * Средний объём: ~300-500 страниц.
 */
export function generateNchSeeds(): NchPage[] {
  const seeds: NchPage[] = [];
  
  // Волна 1: Топ-вредители × Топ-районы (приоритет 1)
  // 4 вредителя × 20 районов = 80 страниц
  topPests.forEach(pestSlug => {
    const pest = pests.find(p => p.slug === pestSlug);
    if (!pest) return;
    
    topNeighborhoods.forEach(neighborhoodSlug => {
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
  
  // Волна 2: Все вредители × Топ-районы (приоритет 2)
  // (7 вредителей - 4 топа) × 20 районов = 60 страниц
  const otherPests = pests.filter(p => !topPests.includes(p.slug));
  otherPests.forEach(pest => {
    topNeighborhoods.forEach(neighborhoodSlug => {
      seeds.push({
        id: `${pest.serviceType}-${pest.slug}-${neighborhoodSlug}`,
        service: pest.serviceType,
        pest: pest.slug,
        neighborhood: neighborhoodSlug,
        priority: 2,
        keyword: `уничтожение ${pest.genitive} ${neighborhoodSlug}`
      });
    });
  });
  
  // Волна 3: Топ-вредители × остальные районы (приоритет 2-3)
  // 4 вредителя × (125 - 20) районов = 420 страниц (берём первые 40 из оставшихся = 160)
  const otherNeighborhoods = neighborhoodSlugs
    .filter(n => !topNeighborhoods.includes(n))
    .slice(0, 40); // Ограничиваем для средней волны
  
  topPests.forEach(pestSlug => {
    const pest = pests.find(p => p.slug === pestSlug);
    if (!pest) return;
    
    otherNeighborhoods.forEach((neighborhoodSlug, index) => {
      seeds.push({
        id: `${pest.serviceType}-${pestSlug}-${neighborhoodSlug}`,
        service: pest.serviceType,
        pest: pestSlug,
        neighborhood: neighborhoodSlug,
        priority: index < 20 ? 2 : 3,
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
