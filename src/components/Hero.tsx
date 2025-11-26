import { Button } from "@/components/ui/button";
import { Microscope, Pill, Beaker, Gift, BarChart3, Zap, CheckCircle, Shield } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useParallax } from "@/hooks/useParallax";

interface HeroProps {
  onDiscountClick: () => void;
}

const Hero = ({ onDiscountClick }: HeroProps) => {
  const parallaxOffset = useParallax(0.3);
  
  const scrollToCalculator = () => {
    const element = document.getElementById("calculator");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-pattern overflow-hidden pt-20">
      {/* Background decorative elements with parallax */}
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none parallax-bg"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      >
        <Microscope className="absolute top-20 left-10 w-24 h-24 text-primary/5" />
        <Pill className="absolute top-40 right-20 w-28 h-28 text-primary/5" />
        <Beaker className="absolute bottom-40 left-1/4 w-20 h-20 text-primary/5" />
        <Microscope className="absolute bottom-20 right-1/3 w-24 h-24 text-primary/5" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection animation="fade-up" className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
            Полная дезинфекция помещений{" "}
            <span className="text-primary">для бизнеса и дома</span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-10">
            Безопасные профессиональные услуги для Москвы
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={onDiscountClick}
              size="lg"
              className="gradient-accent hover:opacity-90 text-accent-foreground font-bold text-lg px-8 py-6 h-auto animate-pulse-attention"
            >
              <Gift className="w-5 h-5 mr-2" />
              Получить скидку до 30%
            </Button>
            
            <Button 
              onClick={scrollToCalculator}
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold text-lg px-8 py-6 h-auto"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Рассчитать стоимость
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-card p-4 md:p-6 lg:p-8 rounded-2xl shadow-sm hover-lift">
              <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Быстрый выезд</h3>
              <p className="text-sm text-muted-foreground">В течение 2-х часов по Москве</p>
            </div>
            
            <div className="bg-card p-6 rounded-2xl shadow-sm hover-lift">
              <div className="w-12 h-12 mb-3 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-bold text-lg mb-2">Сертификаты</h3>
              <p className="text-sm text-muted-foreground">Все необходимые документы</p>
            </div>
            
            <div className="bg-card p-6 rounded-2xl shadow-sm hover-lift">
              <div className="w-12 h-12 mb-3 rounded-xl bg-accent/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold text-lg mb-2">Гарантия</h3>
              <p className="text-sm text-muted-foreground">На все виды работ</p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Hero;
