import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight, X } from "lucide-react";
import { trackGoal } from "@/lib/analytics";
import { useTraffic } from "@/contexts/TrafficContext";

interface StickyCTAProps {
  price: number;
  discount: number;
  onOrderClick: () => void;
}

const StickyCTA = ({ price, discount, onOrderClick }: StickyCTAProps) => {
  const { context } = useTraffic();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [hasTrackedView, setHasTrackedView] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Показываем после прокрутки 40% страницы
      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      const isScrolledPast40 = scrollPercent > 0.4;
      
      // Скрываем в футере
      const footerEl = document.querySelector('footer');
      const isInFooter = footerEl && footerEl.getBoundingClientRect().top < window.innerHeight;
      
      setIsVisible(isScrolledPast40 && !isInFooter && !isDismissed);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  useEffect(() => {
    if (isVisible && !hasTrackedView) {
      trackGoal('sticky_cta_view', {
        intent: context?.intent,
        variant: context?.variantId,
        price,
        discount
      });
      setHasTrackedView(true);
    }
  }, [isVisible, hasTrackedView, context, price, discount]);

  const handleClick = () => {
    trackGoal('sticky_cta_click', {
      intent: context?.intent,
      variant: context?.variantId,
      price,
      discount
    });
    onOrderClick();
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("stickyCTADismissed", "true");
  };

  const handleCall = () => {
    trackGoal('sticky_cta_call', {
      intent: context?.intent,
      variant: context?.variantId
    });
    window.location.href = "tel:+79939289488";
  };

  // Восстанавливаем состояние при монтировании
  useEffect(() => {
    if (sessionStorage.getItem("stickyCTADismissed")) {
      setIsDismissed(true);
    }
  }, []);

  if (!isVisible) return null;

  const formattedPrice = new Intl.NumberFormat('ru-RU').format(price);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border shadow-lg animate-in slide-in-from-bottom duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Цена и скидка */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-primary">
                {formattedPrice} ₽
              </span>
              {discount > 0 && (
                <span className="text-xs sm:text-sm bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                  -{discount}%
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate hidden sm:block">
              Рассчитанная стоимость услуги
            </p>
          </div>

          {/* Кнопки */}
          <div className="flex items-center gap-2">
            {/* Кнопка звонка на мобильном */}
            <Button
              variant="outline"
              size="icon"
              className="sm:hidden"
              onClick={handleCall}
            >
              <Phone className="h-4 w-4" />
            </Button>

            {/* Основная CTA */}
            <Button 
              onClick={handleClick}
              className="font-bold text-sm sm:text-base px-4 sm:px-6"
            >
              <span className="hidden sm:inline">Оформить заявку</span>
              <span className="sm:hidden">Заказать</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>

            {/* Кнопка закрытия */}
            <button
              onClick={handleDismiss}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Закрыть"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyCTA;
