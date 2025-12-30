import { Phone, MessageCircle, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackGoal } from "@/lib/analytics";
import { useTraffic } from "@/contexts/TrafficContext";

interface MobileQuickCTAProps {
  onCalculatorClick: () => void;
}

const MobileQuickCTA = ({ onCalculatorClick }: MobileQuickCTAProps) => {
  const { context } = useTraffic();

  const handleCall = () => {
    trackGoal('phone_click', {
      intent: context?.intent,
      variant: context?.variantId,
      source: 'mobile_quick_cta'
    });
    window.location.href = "tel:+79939289488";
  };

  const handleWhatsApp = () => {
    trackGoal('whatsapp_click', {
      intent: context?.intent,
      variant: context?.variantId,
      source: 'mobile_quick_cta'
    });
    window.open(
      "https://wa.me/79939289488?text=Здравствуйте! Хочу заказать обработку.",
      "_blank"
    );
  };

  const handleCalculatorClick = () => {
    trackGoal('calculator_click', {
      intent: context?.intent,
      variant: context?.variantId,
      source: 'mobile_quick_cta'
    });
    onCalculatorClick();
  };

  return (
    <div className="md:hidden py-4 bg-primary/5 border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex gap-2">
          <Button 
            onClick={handleCall}
            className="flex-1 h-12 font-bold"
            size="lg"
          >
            <Phone className="w-5 h-5 mr-2" />
            Позвонить
          </Button>
          
          <Button 
            onClick={handleWhatsApp}
            variant="outline"
            className="flex-1 h-12 font-bold text-[#25D366] border-[#25D366]/30 hover:bg-[#25D366]/10"
            size="lg"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            WhatsApp
          </Button>
          
          <Button 
            onClick={handleCalculatorClick}
            variant="outline"
            className="flex-1 h-12 font-bold"
            size="lg"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Расчёт
          </Button>
        </div>
        
        <p className="text-center text-xs text-muted-foreground mt-2">
          Бесплатная консультация · Выезд за 15 минут
        </p>
      </div>
    </div>
  );
};

export default MobileQuickCTA;
