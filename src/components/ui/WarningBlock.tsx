import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getPageVariation, warningContent } from '@/lib/contentVariations';

interface WarningBlockProps {
  slug: string;
}

export function WarningBlock({ slug }: WarningBlockProps) {
  // Get variation
  const variation = getPageVariation(slug);
  
  // Get warning content for this variation
  const warning = warningContent[variation];
  
  // If no warning content, don't render
  if (!warning || !warning.text) {
    return null;
  }

  return (
    <section className="py-8 bg-muted/50">
      <div className="container mx-auto px-4">
        <Alert variant="default" className={`border-l-4 ${warning.accent === 'warning' ? 'border-yellow-500' : warning.accent === 'info' ? 'border-blue-500' : 'border-primary'}`}>
          <AlertTriangle className="h-5 w-5" />
          <AlertDescription className="ml-2">
            <span className="font-semibold">{warning.title}</span>
            <br />
            {warning.text}
          </AlertDescription>
        </Alert>
      </div>
    </section>
  );
}

