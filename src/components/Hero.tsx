import { Button } from "@/components/ui/button";
import { Microscope, Pill, Beaker, Gift, BarChart3, Zap, CheckCircle, Shield } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useParallax } from "@/hooks/useParallax";
import { useTraffic } from "@/contexts/TrafficContext";
import { getCopy } from "@/lib/copyUtils";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef } from "react";
import { trackGoal } from "@/lib/analytics";

interface HeroProps {
  onDiscountClick?: () => void;
  onCalculatorClick?: () => void;
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

const Hero = ({ onDiscountClick, onCalculatorClick }: HeroProps) => {
  const { context } = useTraffic();
  const parallaxOffset = useParallax(0.3);
  const hasLoggedView = useRef(false);
  
  // Получаем текст из централизованного словаря с A/B вариантом
  const copy = getCopy('hero', context?.intent, context?.variantId || 'A');
  
  // Логируем показ hero для A/B анализа (один раз)
  useEffect(() => {
    if (context && context.initialized && !hasLoggedView.current) {
      hasLoggedView.current = true;
      
      // Fire and forget - не блокируем UI
      supabase.functions.invoke('log-traffic-event', {
        body: {
          session_id: context.sessionId,
          page_url: window.location.href,
          referrer: context.referrer,
          utm_source: context.utm_source,
          utm_medium: context.utm_medium,
          utm_campaign: context.utm_campaign,
          intent: context.intent,
          variant_id: context.variantId,
          device_type: context.deviceType,
          event_type: 'hero_view',
          event_data: {
            intent: context.intent,
            variant: context.variantId
          }
        }
      }).catch(() => {}); // Silent fail
    }
  }, [context?.initialized]);
  
  const handleCalculatorClick = () => {
    if (onCalculatorClick) {
      onCalculatorClick();
    } else {
      const element = document.getElementById("calculator");
      element?.scrollIntoView({ behavior: "smooth" });
    }
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
            {copy.title}{" "}
            <span className="text-primary">{copy.highlight}</span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-10">
            {copy.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => {
                trackGoal('hero_cta_click', {
                  intent: context?.intent,
                  variant: context?.variantId,
                  button: 'discount'
                });
                onDiscountClick();
              }}
              size="lg"
              className="gradient-accent hover:opacity-90 text-accent-foreground font-bold text-lg px-8 py-6 h-auto animate-pulse-attention"
            >
              <Gift className="w-5 h-5 mr-2" />
              {copy.cta_primary || "Получить скидку до 30%"}
            </Button>
            
            <Button 
              onClick={() => {
                trackGoal('hero_cta_click', {
                  intent: context?.intent,
                  variant: context?.variantId,
                  button: 'calculator'
                });
                handleCalculatorClick();
              }}
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold text-lg px-8 py-6 h-auto"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              {copy.cta_secondary || "Рассчитать стоимость"}
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
                      Выезд за 15 минут <span className="text-muted-foreground font-normal md:hidden">— Самый быстрый в Москве</span>
                    </h3>
                    <p className="hidden md:block text-sm text-muted-foreground">Самый быстрый выезд в Москве</p>
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
