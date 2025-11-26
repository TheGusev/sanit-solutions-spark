import { Button } from "@/components/ui/button";

interface HeroProps {
  onDiscountClick: () => void;
}

const Hero = ({ onDiscountClick }: HeroProps) => {
  const scrollToCalculator = () => {
    const element = document.getElementById("calculator");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-pattern overflow-hidden pt-20">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl opacity-5">🦠</div>
        <div className="absolute top-40 right-20 text-7xl opacity-5">🧫</div>
        <div className="absolute bottom-40 left-1/4 text-5xl opacity-5">💊</div>
        <div className="absolute bottom-20 right-1/3 text-6xl opacity-5">🧪</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-slide-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Полная дезинфекция помещений{" "}
            <span className="text-primary">для бизнеса и дома</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10">
            Безопасные профессиональные услуги для Москвы
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={onDiscountClick}
              size="lg"
              className="gradient-accent hover:opacity-90 text-accent-foreground font-bold text-lg px-8 py-6 h-auto"
            >
              🎁 Получить скидку до 30%
            </Button>
            
            <Button 
              onClick={scrollToCalculator}
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold text-lg px-8 py-6 h-auto"
            >
              📊 Рассчитать стоимость
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-2xl shadow-sm hover-lift">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-bold text-lg mb-2">Быстрый выезд</h3>
              <p className="text-sm text-muted-foreground">В течение 2-х часов по Москве</p>
            </div>
            
            <div className="bg-card p-6 rounded-2xl shadow-sm hover-lift">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-bold text-lg mb-2">Сертификаты</h3>
              <p className="text-sm text-muted-foreground">Все необходимые документы</p>
            </div>
            
            <div className="bg-card p-6 rounded-2xl shadow-sm hover-lift">
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="font-bold text-lg mb-2">Гарантия</h3>
              <p className="text-sm text-muted-foreground">На все виды работ</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
