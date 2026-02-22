/**
 * Объединённый экспорт LLM-оптимизированных статей.
 * Каждый тематический файл содержит до ~40 статей.
 */

import { llmPestsArticles } from './pests';
import { llmMethodsArticles } from './methods';
import { llmLegalCommercialArticles } from './legal-commercial';
import { llmSafetyTipsArticles } from './safety-tips';
import type { BlogArticle } from '../types';

export const llmOptimizedArticles: BlogArticle[] = [
  ...llmPestsArticles,
  ...llmMethodsArticles,
  ...llmLegalCommercialArticles,
  ...llmSafetyTipsArticles,
];
