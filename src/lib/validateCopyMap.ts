// Утилита для валидации copyMap против copyGuidelines

import { copyMap, copyGuidelines } from '@/config/copyMap';

interface ValidationWarning {
  section: string;
  intent: string;
  variant: string;
  field: string;
  issue: string;
  actual: number;
  limit: number;
}

/**
 * Проверяет все варианты копирайта на соответствие длинным лимитам из copyGuidelines
 */
export function validateCopyMap(): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // Validate hero section
  const heroGuidelines = copyGuidelines.hero;
  
  Object.entries(copyMap.hero).forEach(([intent, variants]) => {
    // Determine guidelines for this intent
    const guidelines = heroGuidelines._defaults;
    
    // Check variants A-F
    Object.entries(variants as Record<string, any>).forEach(([variant, copy]) => {
      // Check title length
      if (copy.title && copy.title.length > guidelines.titleMaxChars) {
        warnings.push({
          section: 'hero',
          intent,
          variant,
          field: 'title',
          issue: `Превышена максимальная длина заголовка`,
          actual: copy.title.length,
          limit: guidelines.titleMaxChars
        });
      }

      // Check subtitle length
      if (copy.subtitle && copy.subtitle.length > guidelines.subtitleMaxChars) {
        warnings.push({
          section: 'hero',
          intent,
          variant,
          field: 'subtitle',
          issue: `Превышена максимальная длина подзаголовка`,
          actual: copy.subtitle.length,
          limit: guidelines.subtitleMaxChars
        });
      }

      // Check CTA length
      if (copy.cta_primary && copy.cta_primary.length > guidelines.ctaLabelMaxChars) {
        warnings.push({
          section: 'hero',
          intent,
          variant,
          field: 'cta_primary',
          issue: `Превышена максимальная длина CTA кнопки`,
          actual: copy.cta_primary.length,
          limit: guidelines.ctaLabelMaxChars
        });
      }

      if (copy.cta_secondary && copy.cta_secondary.length > guidelines.ctaLabelMaxChars) {
        warnings.push({
          section: 'hero',
          intent,
          variant,
          field: 'cta_secondary',
          issue: `Превышена максимальная длина CTA кнопки`,
          actual: copy.cta_secondary.length,
          limit: guidelines.ctaLabelMaxChars
        });
      }
    });
  });

  return warnings;
}

/**
 * Выводит предупреждения в консоль для разработчиков
 */
export function logCopyMapWarnings(): void {
  const warnings = validateCopyMap();

  if (warnings.length === 0) {
    console.log('✅ copyMap validation passed: all variants within length limits');
    return;
  }

  console.warn(`⚠️ copyMap validation found ${warnings.length} warnings:`);
  warnings.forEach(w => {
    console.warn(
      `  ${w.section}.${w.intent}.${w.variant}.${w.field}: ` +
      `${w.issue} (${w.actual} символов, лимит ${w.limit})`
    );
  });
}
