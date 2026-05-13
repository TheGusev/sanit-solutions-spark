import { useEffect, useState, lazy, Suspense } from "react";
import SectionLoader from "@/components/SectionLoader";
import { useMLPrediction } from "@/hooks/useMLPrediction";
import { generateIndexMetadata } from "@/lib/metadata";
import SEOHead from "@/components/SEOHead";

// Critical components - above the fold, load immediately
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MobileQuickCTA from "@/components/MobileQuickCTA";
import HeroCallbackForm from "@/components/HeroCallbackForm";
import { Phone, ShieldCheck, Clock3, Wallet } from "lucide-react";

// New components for restructured layout
const MiniPricing = lazy(() => import("@/components/MiniPricing"));
const WhyUsExtended = lazy(() => import("@/components/WhyUsExtended"));
const WorkProcess = lazy(() => import("@/components/WorkProcess"));
const PricingByArea = lazy(() => import("@/components/PricingByArea"));
const ServiceAreaMap = lazy(() => import("@/components/ServiceAreaMap"));
const Reviews = lazy(() => import("@/components/Reviews"));
const WorkGallery = lazy(() => import("@/components/WorkGallery"));
const FAQ = lazy(() => import("@/components/FAQ"));
const FinalCTA = lazy(() => import("@/components/FinalCTA"));
const Footer = lazy(() => import("@/components/Footer"));

// Modal and floating components
const CalculatorModal = lazy(() => import("@/components/CalculatorModal"));
const FloatingButtons = lazy(() => import("@/components/FloatingButtons"));
const ABTestDebug = lazy(() => import("@/components/ABTestDebug"));

const Index = () => {
  const [showDebug, setShowDebug] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  
  // Integrate ML prediction in main flow for real-time personalization
  const { prediction, isLoading: mlLoading } = useMLPrediction();
  
  // Global goals now handled by useGlobalGoals in TrafficProvider

  useEffect(() => {
    // Toggle debug panel with Ctrl+Shift+D
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setShowDebug(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleOpenCalculator = () => {
    setShowCalculator(true);
  };

  // Генерируем метаданные с валидацией
  const metadata = generateIndexMetadata();

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* SEO Head с автоматической валидацией */}
      <SEOHead metadata={metadata} pagePath="/" />
      
      {/* Critical - Above the fold */}
      <Header onCalculatorClick={handleOpenCalculator} />
      <Hero onCalculatorClick={handleOpenCalculator} />

      <main id="main-content">
        {/* Краткий цитируемый ответ — для GEO/AI и быстрого ориентирования */}
        <section
          aria-label="Краткая информация о компании"
          className="py-6 md:py-8 bg-background border-b border-border/40"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
              <article className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <p className="text-sm md:text-base text-foreground/85 leading-snug">
                  <strong className="text-foreground">Лицензия Роспотребнадзора</strong> — гарантия до 3 лет на все виды работ.
                </p>
              </article>
              <article className="flex items-start gap-3">
                <Clock3 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <p className="text-sm md:text-base text-foreground/85 leading-snug">
                  <strong className="text-foreground">Выезд в день обращения</strong> по Москве и МО, работаем круглосуточно.
                </p>
              </article>
              <article className="flex items-start gap-3">
                <Wallet className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <p className="text-sm md:text-base text-foreground/85 leading-snug">
                  <strong className="text-foreground">Цены от 1 000 ₽</strong> — фиксированная стоимость, без скрытых надбавок.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Контактная форма обратного звонка — видимая в статическом HTML */}
        <section
          aria-label="Заказать обратный звонок"
          className="py-6 md:py-10 bg-muted/30"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto text-center mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                Закажите бесплатный обратный звонок
              </h2>
              <p className="text-sm md:text-base text-muted-foreground mt-2">
                Перезвоним в течение 15 минут и рассчитаем стоимость
              </p>
            </div>
            <div className="max-w-xl mx-auto">
              <HeroCallbackForm serviceSlug="homepage" />
            </div>
          </div>
        </section>

        {/* 1. Короткий прайс — сразу после Hero */}
        <div data-section="pricing">
          <Suspense fallback={<SectionLoader />}>
            <MiniPricing />
          </Suspense>
        </div>

        {/* Mobile Quick CTA — после прайса, чтобы пользователь сначала увидел услуги */}
        <MobileQuickCTA onCalculatorClick={handleOpenCalculator} />

        {/* 2. Почему мы */}
        <Suspense fallback={<SectionLoader />}>
          <WhyUsExtended />
        </Suspense>

        {/* 3. Как мы работаем */}
        <div data-section="work-process">
          <Suspense fallback={<SectionLoader />}>
            <WorkProcess />
          </Suspense>
        </div>

        {/* 4. Визуальные доказательства — галерея до/после */}
        <div data-section="gallery">
          <Suspense fallback={<SectionLoader />}>
            <WorkGallery />
          </Suspense>
        </div>

        {/* 5. Соц.доказательство — отзывы во всю ширину */}
        <section className="py-4 md:py-8 bg-background">
          <div className="container mx-auto px-4">
            <div data-section="reviews">
              <Suspense fallback={<SectionLoader />}>
                <Reviews />
              </Suspense>
            </div>
          </div>
        </section>

        {/* 6. Полный прайс с надбавками */}
        <Suspense fallback={<SectionLoader />}>
          <PricingByArea />
        </Suspense>

        {/* 7. География работы */}
        <Suspense fallback={<SectionLoader />}>
          <ServiceAreaMap />
        </Suspense>

        {/* 8. FAQ */}
        <div data-section="faq">
          <Suspense fallback={<SectionLoader />}>
            <FAQ />
          </Suspense>
        </div>

        {/* Final CTA */}
        <Suspense fallback={<SectionLoader />}>
          <FinalCTA onOpenCalculator={handleOpenCalculator} />
        </Suspense>
      </main>

      {/* Footer */}
      <Suspense fallback={<SectionLoader />}>
        <Footer />
      </Suspense>
      
      {/* Calculator Modal */}
      <Suspense fallback={null}>
        <CalculatorModal 
          open={showCalculator} 
          onOpenChange={setShowCalculator} 
        />
      </Suspense>
      
      {/* Floating action buttons */}
      <Suspense fallback={null}>
        <FloatingButtons />
      </Suspense>
      
      {/* A/B Test Debug Panel - Ctrl+Shift+D to toggle */}
      {showDebug && (
        <Suspense fallback={null}>
          <ABTestDebug />
        </Suspense>
      )}
    </div>
  );
};

export default Index;

