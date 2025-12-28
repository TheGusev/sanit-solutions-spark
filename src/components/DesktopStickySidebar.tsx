import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Percent, TrendingDown, Calculator, Check } from "lucide-react";
import { LeadFormModal } from "./LeadFormModal";
import { trackGoal } from "@/lib/analytics";
import { useTraffic } from "@/contexts/TrafficContext";

interface DesktopStickySidebarProps {
  finalPrice: number;
  totalPrice: number;
  discount: number;
  area: number;
  premiseType: string;
  serviceType: string;
  getPremiseLabel: () => string;
  getServiceLabel: () => string;
}

const DesktopStickySidebar = ({
  finalPrice,
  totalPrice,
  discount,
  area,
  premiseType,
  serviceType,
  getPremiseLabel,
  getServiceLabel,
}: DesktopStickySidebarProps) => {
  const { context } = useTraffic();
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Track visibility for analytics
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      trackGoal('desktop_sticky_view', {
        intent: context?.intent,
        variant: context?.variantId,
        finalPrice,
        discount
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, [context, finalPrice, discount]);

  const handleOrder = () => {
    trackGoal('desktop_sticky_click', {
      intent: context?.intent,
      variant: context?.variantId,
      action: 'order',
      finalPrice,
      discount
    });
    setShowLeadForm(true);
  };

  const handleWhatsApp = () => {
    trackGoal('desktop_sticky_click', {
      intent: context?.intent,
      variant: context?.variantId,
      action: 'whatsapp',
      finalPrice
    });
    
    const message = `Здравствуйте! Хочу заказать ${getServiceLabel().toLowerCase()} для ${getPremiseLabel().toLowerCase()}, площадь ${area} м². Расчётная стоимость: ${finalPrice}₽ (скидка ${discount}%)`;
    window.open(`https://wa.me/79939289488?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handlePhone = () => {
    trackGoal('desktop_sticky_click', {
      intent: context?.intent,
      variant: context?.variantId,
      action: 'phone'
    });
    window.location.href = 'tel:+79939289488';
  };

  return (
    <>
      <div 
        className={`sticky top-24 h-fit transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="bg-card rounded-2xl shadow-xl border border-border/50 overflow-hidden">
          {/* Header with gradient */}
          <div className="gradient-hero p-4 text-primary-foreground">
            <div className="flex items-center gap-2 mb-1">
              <Calculator className="w-5 h-5" />
              <span className="font-semibold">Ваш расчёт</span>
            </div>
            <p className="text-sm opacity-90">Актуальная цена с учётом скидки</p>
          </div>
          
          {/* Price block */}
          <div className="p-5 space-y-4">
            {/* Summary */}
            <div className="space-y-2 pb-4 border-b border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Объект:</span>
                <span className="font-medium">{getPremiseLabel()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Площадь:</span>
                <span className="font-medium">{area} м²</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Услуга:</span>
                <span className="font-medium">{getServiceLabel()}</span>
              </div>
            </div>
            
            {/* Prices */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Базовая цена:</span>
                <span className="line-through text-muted-foreground">{totalPrice.toLocaleString('ru-RU')} ₽</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-success flex items-center gap-1 text-sm">
                  <TrendingDown className="w-4 h-4" />
                  Скидка {discount}%:
                </span>
                <span className="text-success font-medium">
                  -{(totalPrice - finalPrice).toLocaleString('ru-RU')} ₽
                </span>
              </div>
              
              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">Итого:</span>
                  <span className="text-3xl font-bold text-primary">
                    {finalPrice.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>
            </div>
            
            {/* Discount badge */}
            {discount >= 10 && (
              <div className="flex items-center gap-2 p-3 bg-success/10 rounded-lg border border-success/20">
                <Percent className="w-5 h-5 text-success" />
                <div>
                  <p className="text-success font-semibold text-sm">Повышенная скидка!</p>
                  <p className="text-xs text-muted-foreground">За площадь от 100 м²</p>
                </div>
              </div>
            )}
            
            {/* CTA Buttons */}
            <div className="space-y-3 pt-2">
              <Button 
                onClick={handleOrder}
                className="w-full h-12 text-base font-bold gradient-hero hover:opacity-90 transition-opacity"
                size="lg"
              >
                <Check className="w-5 h-5 mr-2" />
                Оформить заявку
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={handleWhatsApp}
                  variant="outline"
                  className="h-11 border-success text-success hover:bg-success hover:text-success-foreground"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
                
                <Button 
                  onClick={handlePhone}
                  variant="outline"
                  className="h-11"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Позвонить
                </Button>
              </div>
            </div>
            
            {/* Trust indicators */}
            <div className="pt-3 border-t border-border space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-3 h-3 text-success" />
                <span>Выезд в день обращения</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3 h-3 text-success" />
                <span>Гарантия результата</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3 h-3 text-success" />
                <span>Безопасные препараты</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Lead Form Modal */}
      <LeadFormModal
        open={showLeadForm}
        onOpenChange={setShowLeadForm}
        calculatorData={{
          area,
          premiseType,
          serviceType,
          treatmentType: 'cold',
          period: 'once',
          clientType: 'individual',
          totalPrice,
          discount,
          discountAmount: totalPrice - finalPrice,
          finalPrice,
        }}
      />
    </>
  );
};

export default DesktopStickySidebar;
