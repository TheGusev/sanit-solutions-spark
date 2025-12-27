import { useState, useEffect } from 'react';
import { X, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LeadFormModal } from './LeadFormModal';
import { trackGoal } from '@/lib/analytics';

const StickyDiscountBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    // Check if already dismissed this session
    const dismissed = sessionStorage.getItem('sticky_banner_dismissed');
    if (dismissed) return;

    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercent > 60 && !isVisible) {
        setIsVisible(true);
        trackGoal('sticky_banner_shown');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  const handleClick = () => {
    setIsFormOpen(true);
    trackGoal('sticky_banner_click');
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('sticky_banner_dismissed', 'true');
    trackGoal('sticky_banner_dismissed');
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed bottom-4 left-4 z-50 animate-banner-slide-up">
        <div className="bg-card border border-border rounded-lg shadow-lg p-3 flex items-center gap-3 max-w-[280px]">
          <div className="bg-gradient-to-br from-success to-primary rounded-full p-2 flex-shrink-0">
            <Percent className="w-5 h-5 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Скидка 30% онлайн
            </p>
            <p className="text-xs text-muted-foreground">
              Только при заказе с сайта
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Button
              onClick={handleClick}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs px-3 py-1 h-7"
            >
              Хочу!
            </Button>
            
            <button
              onClick={handleDismiss}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Закрыть"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <LeadFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        calculatorData={{
          premiseType: 'apartment',
          area: 50,
          serviceType: 'disinsection',
          treatmentType: 'cold_fog',
          period: 'once',
          clientType: 'individual',
          totalPrice: 3000,
          discount: 30,
          discountAmount: 900,
          finalPrice: 2100
        }}
      />
    </>
  );
};

export default StickyDiscountBanner;
