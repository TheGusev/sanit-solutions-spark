import { useState, useEffect } from 'react';
import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LeadFormModal } from './LeadFormModal';
import { trackGoal } from '@/lib/analytics';

const FlashDiscountBadge = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Check if already shown this session
    const alreadyShown = sessionStorage.getItem('flash_badge_shown');
    if (alreadyShown) return;

    // Show after 2 seconds
    const showTimer = setTimeout(() => {
      setIsVisible(true);
      sessionStorage.setItem('flash_badge_shown', 'true');
      trackGoal('flash_badge_shown');
    }, 2000);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!isVisible || hasInteracted) return;

    // Start fading after 5 seconds
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 5000);

    // Hide completely after fade animation (1.5s)
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 6500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [isVisible, hasInteracted]);

  const handleClick = () => {
    setHasInteracted(true);
    setIsFormOpen(true);
    trackGoal('flash_badge_click');
  };

  if (!isVisible) return null;

  return (
    <>
      <div
        className={`fixed top-4 left-4 z-50 ${
          isFading ? 'animate-flash-fade-out' : 'animate-flash-slide-in'
        }`}
      >
        <Button
          onClick={handleClick}
          className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-4 py-2 text-sm font-semibold rounded-full"
        >
          <Gift className="w-4 h-4 mr-2" />
          <span>−15% сейчас!</span>
        </Button>
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
          discount: 15,
          discountAmount: 450,
          finalPrice: 2550
        }}
      />
    </>
  );
};

export default FlashDiscountBadge;
