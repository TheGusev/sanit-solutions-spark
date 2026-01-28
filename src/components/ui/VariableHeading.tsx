import { getPageVariation, headings } from '@/lib/contentVariations';
import { createElement } from 'react';

interface VariableHeadingProps {
  slug: string;
  category: 'hero' | 'services' | 'cta';
  level: 'h1' | 'h2' | 'h3';
  className?: string;
  fallback: string;
}

export function VariableHeading({ 
  slug, 
  category, 
  level, 
  className = '',
  fallback 
}: VariableHeadingProps) {
  // Get variation
  const variation = getPageVariation(slug);
  
  // Get headings for this variation
  const variationHeadings = headings[variation];
  
  // Get text for this category, fallback to provided fallback
  const text = variationHeadings?.[category] || fallback;

  // Create heading element
  return createElement(level, { className }, text);
}

