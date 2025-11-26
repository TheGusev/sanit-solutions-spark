// Хелпер для получения текстов из централизованного словаря

import { copyMap, CopyVariant } from '@/config/copyMap';

export function getCopy(
  section: string, 
  intent: string | null, 
  variant: 'A' | 'B' = 'A'
): CopyVariant {
  const sectionCopy = copyMap[section];
  
  if (!sectionCopy) {
    console.warn(`Section ${section} not found in copyMap`);
    return copyMap.hero.default.A; // Fallback
  }
  
  const intentKey = intent && sectionCopy[intent] ? intent : 'default';
  return sectionCopy[intentKey][variant];
}
