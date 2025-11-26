// Динамический баннер под Hero с контентом, зависящим от интента

import { useTraffic } from '@/contexts/TrafficContext';
import { Check, Shield } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { getCopy } from '@/lib/copyUtils';

export default function IntentBanner() {
  const { context, isLoading } = useTraffic();

  // Не показываем баннер, пока контекст не загружен
  if (isLoading || !context) {
    return null;
  }

  // Получаем текст из централизованного словаря с A/B вариантом
  const copy = getCopy('intent_banner', context.intent, context.variantId || 'A');

  return (
    <AnimatedSection animation="fade-up" className="py-8 md:py-12 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-card rounded-3xl p-6 md:p-10 shadow-xl border border-border/50">
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  {copy.title}
                </h3>
                <p className="text-muted-foreground text-base md:text-lg">
                  {copy.description}
                </p>
              </div>

              {/* Особенности */}
              {copy.features && copy.features.length > 0 && (
                <ul className="grid gap-3 md:grid-cols-2">
                  {copy.features.map((feature, index) => (
                    <li key={index} className="flex gap-2 items-start">
                      <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
