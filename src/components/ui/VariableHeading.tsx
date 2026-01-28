import { getTextVariant, textVariants } from '@/lib/contentVariations';

interface VariableHeadingProps {
  slug: string;
  category: keyof typeof textVariants;
  level?: 'h1' | 'h2' | 'h3' | 'h4';
  className?: string;
}

export function VariableHeading({ slug, category, level = 'h2', className = '' }: VariableHeadingProps) {
  const text = getTextVariant(slug, category);
  const Tag = level;
  return <Tag className={className}>{text}</Tag>;
}
