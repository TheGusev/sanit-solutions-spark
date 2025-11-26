import { Button } from "@/components/ui/button";
import { Microscope, Pill, Beaker, Gift, BarChart3, Zap, CheckCircle, Shield } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useParallax } from "@/hooks/useParallax";
import { useTraffic } from "@/contexts/TrafficContext";

interface HeroProps {
  onDiscountClick: () => void;
}

interface HeroContent {
  title: string;
  highlight: string;
  subtitle: string;
}

const HERO_CONTENT_BY_INTENT: Record<string, HeroContent> = {
  flat_bedbugs: {
    title: "Профессиональная дезинсекция квартир",
    highlight: "в Москве и МО",
    subtitle: "Уничтожаем клопов, тараканов и других насекомых с гарантией результата"
  },
  flat_cockroaches: {
    title: "Профессиональная дезинсекция квартир",
    highlight: "в Москве и МО",
    subtitle: "Уничтожаем клопов, тараканов и других насекомых с гарантией результата"
  },
  flat_general: {
    title: "Дезинфекция и дезинсекция квартир",
    highlight: "для жителей Москвы",
    subtitle: "Безопасные профессиональные услуги с гарантией до 30 дней"
  },
  office_disinfection: {
    title: "Дезинфекция и дезинсекция офисов",
    highlight: "для юридических лиц",
    subtitle: "Работаем по договорам, готовим документы для СЭС и Роспотребнадзора"
  },
  office_general: {
    title: "Санитарные услуги для офисов",
    highlight: "и бизнес-центров",
    subtitle: "Комплексная обработка коммерческих помещений с полным пакетом документов"
  },
  warehouse_deratization: {
    title: "Дератизация и защита складов",
    highlight: "от грызунов и птиц",
    subtitle: "Комплексные решения для логистических центров и складских комплексов"
  },
  warehouse_general: {
    title: "Санитарная обработка складов",
    highlight: "и промышленных объектов",
    subtitle: "Профессиональная дезинфекция и дезинсекция для бизнеса"
  },
  restaurant_disinfection: {
    title: "Дезинфекция для предприятий общепита",
    highlight: "в соответствии с СЭС",
    subtitle: "Санитарная обработка ресторанов, кафе и кухонь с документами"
  },
  restaurant_general: {
    title: "Санитарные услуги для общепита",
    highlight: "в Москве и МО",
    subtitle: "Полный комплекс услуг для ресторанов, кафе и пищевых производств"
  },
  ses_check_preparation: {
    title: "Подготовка к проверке СЭС",
    highlight: "срочная обработка",
    subtitle: "Дезинфекция с полным пакетом документов для Роспотребнадзора"
  },
  b2b_general: {
    title: "Санитарные услуги для бизнеса",
    highlight: "договоры и документы",
    subtitle: "Профессиональная обработка объектов для юридических лиц и ИП"
  },
  production_facility: {
    title: "Обработка промышленных объектов",
    highlight: "и производств",
    subtitle: "Дезинфекция, дезинсекция, дератизация для заводов и цехов"
  },
  shop_store: {
    title: "Санитарная обработка магазинов",
    highlight: "и торговых площадей",
    subtitle: "Дезинфекция торговых залов и складов с сертификатами"
  }
};

const DEFAULT_HERO_CONTENT: HeroContent = {
  title: "Полная дезинфекция помещений",
  highlight: "для бизнеса и дома",
  subtitle: "Безопасные профессиональные услуги для Москвы"
};

const Hero = ({ onDiscountClick }: HeroProps) => {
  const { context } = useTraffic();
  const parallaxOffset = useParallax(0.3);
  
  // Получаем контент в зависимости от интента
  const heroContent = context?.intent && HERO_CONTENT_BY_INTENT[context.intent]
    ? HERO_CONTENT_BY_INTENT[context.intent]
    : DEFAULT_HERO_CONTENT;
  
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
            {heroContent.title}{" "}
            <span className="text-primary">{heroContent.highlight}</span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-10">
            {heroContent.subtitle}
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
            <AnimatedSection animation="fade-up" delay={0}>
              <div className="bg-card p-3 md:p-6 lg:p-8 rounded-xl shadow-sm hover-lift flex md:flex-col items-center md:items-start justify-between md:justify-start">
                <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-0">
                  <div className="md:w-12 md:h-12 lg:w-14 lg:h-14 md:mb-3 md:rounded-xl md:bg-primary/10 md:flex md:items-center md:justify-center">
                    <Zap className="w-5 h-5 md:w-6 md:h-6 text-primary flex-shrink-0" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm md:text-lg md:mb-2">
                      Быстрый выезд <span className="text-muted-foreground font-normal md:hidden">— В течение 2-х часов</span>
                    </h3>
                    <p className="hidden md:block text-sm text-muted-foreground">В течение 2-х часов по Москве</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection animation="fade-up" delay={150}>
              <div className="bg-card p-3 md:p-6 lg:p-8 rounded-xl shadow-sm hover-lift flex md:flex-col items-center md:items-start justify-between md:justify-start">
                <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-0">
                  <div className="md:w-12 md:h-12 lg:w-14 lg:h-14 md:mb-3 md:rounded-xl md:bg-success/10 md:flex md:items-center md:justify-center">
                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-success flex-shrink-0" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm md:text-lg md:mb-2">
                      Сертификаты <span className="text-muted-foreground font-normal md:hidden">— Все документы</span>
                    </h3>
                    <p className="hidden md:block text-sm text-muted-foreground">Все необходимые документы</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection animation="fade-up" delay={300}>
              <div className="bg-card p-3 md:p-6 lg:p-8 rounded-xl shadow-sm hover-lift flex md:flex-col items-center md:items-start justify-between md:justify-start">
                <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-0">
                  <div className="md:w-12 md:h-12 lg:w-14 lg:h-14 md:mb-3 md:rounded-xl md:bg-accent/10 md:flex md:items-center md:justify-center">
                    <Shield className="w-5 h-5 md:w-6 md:h-6 text-accent flex-shrink-0" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm md:text-lg md:mb-2">
                      Гарантия <span className="text-muted-foreground font-normal md:hidden">— На все работы</span>
                    </h3>
                    <p className="hidden md:block text-sm text-muted-foreground">На все виды работ</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Hero;
