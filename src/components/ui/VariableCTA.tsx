import { Button } from '@/components/ui/button';
import { getPageVariation, ctaButtons } from '@/lib/contentVariations';

interface VariableCTAProps {
  slug: string;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'secondary';
  className?: string;
  fallback: string;
}

export function VariableCTA({ 
  slug, 
  onClick, 
  variant = 'outline',
  className = '',
  fallback 
}: VariableCTAProps) {
  // Get variation
  const variation = getPageVariation(slug);
  
  // Get CTA text for this variation
  const ctaText = ctaButtons[variation] || fallback;

  return (
    <Button 
      size="lg" 
      variant={variant} 
      className={className}
      onClick={onClick}
    >
      {ctaText}
    </Button>
  );
}
