// Хелпер для получения текстов из централизованного словаря

import { copyMap, CopyVariant } from '@/config/copyMap';

export function getCopy(
  section: string, 
  intent: string | null, 
  variant: string = 'A' // Support any variant string
): CopyVariant {
  const sectionCopy = copyMap[section];
  
  if (!sectionCopy) {
    console.warn(`Section ${section} not found in copyMap`);
    return copyMap.hero.default.A; // Fallback
  }
  
  const intentKey = intent && sectionCopy[intent] ? intent : 'default';
  const intentData = sectionCopy[intentKey];
  
  // Fallback to variant A if requested variant doesn't exist
  return intentData[variant] || intentData['A'] || copyMap.hero.default.A;
}
