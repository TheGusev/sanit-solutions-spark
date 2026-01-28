import { getPageVariation, textVariants, buttonStyles, colorSchemes } from '@/lib/contentVariations';
import { Button } from '@/components/ui/button';

interface VariableCTAProps {
  slug: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function VariableCTA({ slug, onClick, variant = 'primary', className = '' }: VariableCTAProps) {
  const variation = getPageVariation(slug);
  const texts = variant === 'primary' ? textVariants.ctaButtons : textVariants.ctaSecondary;
  const text = texts[variation.ctaTextVariant % texts.length];
  const btnStyle = buttonStyles[variation.buttonStyle];
  const colors = colorSchemes[variation.accentColor];
  
  return (
    <Button onClick={onClick} className={`${btnStyle} ${colors.accent} text-white font-semibold transition-colors ${className}`}>
      {text}
    </Button>
  );
}
