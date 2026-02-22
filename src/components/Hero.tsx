import { Button } from "@/components/ui/button";
import { Zap, CheckCircle, Shield, Calculator } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useParallax } from "@/hooks/useParallax";
import { useTraffic } from "@/contexts/TrafficContext";
import { getCopy } from "@/lib/copyUtils";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef, useCallback, useState } from "react";
import { trackGoal } from "@/lib/analytics";

// Два фона с ротацией
const HERO_BACKGROUNDS = [
  '/images/work/hero-fog-living.png',
  '/images/work/hero-bed-spray.png',
  '/images/work/hero-bathroom.png',
  '/images/work/hero-kitchen.png'
];

// Фоновые изображения для карточек
const HERO_CARD_BACKGROUNDS = [
  '/images/hero-cards/fast-response.jpg',
  '/images/hero-cards/certificates.jpg',
  '/images/hero-cards/guarantee.jpg'
];

interface HeroProps {
  onCalculatorClick?: () => void;
}

// ⚠️ SEO: H1 фиксирован для стабильности индексации
const SEO_H1_TITLE = "Профессиональная СЭС служба";
const SEO_H1_HIGHLIGHT = "в Москве и области";

const Hero = ({ onCalculatorClick }: HeroProps) => {
  const { context } = useTraffic();
  const parallaxOffset = useParallax(0.3);
  const hasLoggedView = useRef(false);
  const [bgIndex, setBgIndex] = useState(0);

  // Ротация фонов каждые 6 секунд
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const timer = setInterval(() => {
      setBgIndex(prev => (prev + 1) % HERO_BACKGROUNDS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);
  
  // Получаем текст из централизованного словаря
  const copy = getCopy('hero', context?.intent, context?.variantId || 'A');
  
  // Логируем показ hero для A/B анализа (один раз)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (context && context.initialized && !hasLoggedView.current) {
      hasLoggedView.current = true;
      
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
      }).catch(() => {});
    }
  }, [context?.initialized]);
  
  const handleCalculatorClick = useCallback(() => {
    if (onCalculatorClick) {
      onCalculatorClick();
    } else if (typeof document !== 'undefined') {
      const element = document.getElementById("calculator");
      element?.scrollIntoView({ behavior: "smooth" });
    }
  }, [onCalculatorClick]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {HERO_BACKGROUNDS.map((bg, i) => (
        <div
          key={bg}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{ 
            backgroundImage: `url('${bg}')`,
            transform: `translateY(${parallaxOffset}px)`,
            opacity: i === bgIndex ? 1 : 0,
          }}
          role="img"
          aria-label="Панорама Москвы — зона обслуживания СЭС"
        />
      ))}
      
      {/* Lighter overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/50 to-background/30 dark:from-background/80 dark:via-background/65 dark:to-background/50" />

      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection animation="fade-up" className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
            {SEO_H1_TITLE}{" "}
            <span className="text-primary">{SEO_H1_HIGHLIGHT}</span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-10">
            {copy.subtitle || "Дезинфекция, дезинсекция, дератизация • Лицензия Роспотребнадзора • Гарантия до 1 года"}
          </p>

          <div className="flex justify-center">
            <Button 
              onClick={() => {
                trackGoal('hero_cta_click', {
                  intent: context?.intent,
                  variant: context?.variantId,
                  button: 'order_and_calculate'
                });
                handleCalculatorClick();
              }}
              size="lg"
              className="gradient-accent hover:opacity-90 text-accent-foreground font-bold text-lg px-8 py-6 h-auto whitespace-normal"
            >
              <Calculator className="w-5 h-5 mr-2 flex-shrink-0" />
              Заказать обработку и рассчитать стоимость
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {HERO_CARD_BACKGROUNDS.map((bg, i) => {
              const cards = [
                { Icon: Zap, color: 'primary', title: 'Выезд за 15 минут', mobileDesc: 'Самый быстрый в Москве', desc: 'Самый быстрый выезд в Москве' },
                { Icon: CheckCircle, color: 'success', title: 'Сертификаты', mobileDesc: 'Все документы', desc: 'Все необходимые документы' },
                { Icon: Shield, color: 'accent', title: 'Гарантия', mobileDesc: 'На все работы', desc: 'На все виды работ' },
              ];
              const card = cards[i];
              return (
                <AnimatedSection key={i} animation="fade-up" delay={i * 150}>
                  <div className="relative overflow-hidden bg-card rounded-xl shadow-sm hover-lift">
                    <img 
                      src={bg}
                      alt={card.title}
                      width={400}
                      height={300}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ opacity: 0.96 }}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/70 via-card/30 to-transparent" />
                    <div className="relative p-3 md:p-6 lg:p-8 flex md:flex-col items-center md:items-start justify-between md:justify-start">
                      <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-0">
                        <div className={`md:w-12 md:h-12 lg:w-14 lg:h-14 md:mb-3 md:rounded-xl md:bg-${card.color}/10 md:flex md:items-center md:justify-center`}>
                          <card.Icon className={`w-5 h-5 md:w-6 md:h-6 text-${card.color} flex-shrink-0`} />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm md:text-lg md:mb-2">
                            {card.title} <span className="font-normal md:hidden">— {card.mobileDesc}</span>
                          </h3>
                          <p className="hidden md:block text-sm font-medium">{card.desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Hero;
