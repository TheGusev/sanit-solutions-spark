import { AlertCircle, AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { getPageVariation, colorSchemes } from '@/lib/contentVariations';

interface WarningBlockProps {
  children: React.ReactNode;
  slug: string;
  icon?: 'alert' | 'warning' | 'info' | 'shield';
}

export function WarningBlock({ children, slug, icon = 'alert' }: WarningBlockProps) {
  const variation = getPageVariation(slug);
  const colors = colorSchemes[variation.warningColor];
  
  const icons = {
    alert: AlertCircle,
    warning: AlertTriangle,
    info: Info,
    shield: ShieldAlert
  };
  
  const Icon = icons[icon];
  
  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border-l-4 ${colors.bg} ${colors.border} mb-4`}>
      <div className={`flex-shrink-0 ${colors.text} mt-0.5`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className={`flex-1 ${colors.text} text-sm leading-relaxed`}>
        {children}
      </div>
    </div>
  );
}
