import { Phone, Calculator, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FinalCTAProps {
  onOpenCalculator: () => void;
}

const FinalCTA = ({ onOpenCalculator }: FinalCTAProps) => {
  const handleCall = () => {
    window.location.href = "tel:+79939289488";
  };

  const handleWhatsApp = () => {
    window.open(
      "https://wa.me/79939289488?text=Здравствуйте! Хочу заказать обработку.",
      "_blank"
    );
  };

  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Готовы избавиться от вредителей?
        </h2>
        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
          Свяжитесь с нами сейчас и получите бесплатную консультацию. 
          Выезд специалиста в день обращения!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={handleCall}
            size="lg"
            variant="secondary"
            className="font-bold text-lg px-8 py-6"
          >
            <Phone className="w-5 h-5 mr-2" />
            Позвонить
          </Button>

          <Button
            onClick={onOpenCalculator}
            size="lg"
            variant="outline"
            className="font-bold text-lg px-8 py-6 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Рассчитать стоимость
          </Button>

          <Button
            onClick={handleWhatsApp}
            size="lg"
            variant="outline"
            className="font-bold text-lg px-8 py-6 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            WhatsApp
          </Button>
        </div>

        <p className="mt-8 text-sm opacity-75">
          Работаем ежедневно с 8:00 до 22:00 · Москва и область
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;
