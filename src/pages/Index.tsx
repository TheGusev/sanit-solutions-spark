import { useEffect, useState, lazy, Suspense } from "react";
import SectionLoader from "@/components/SectionLoader";
import { useMLPrediction } from "@/hooks/useMLPrediction";
import { generateIndexMetadata } from "@/lib/metadata";
import SEOHead from "@/components/SEOHead";

// Critical components - above the fold, load immediately
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MobileQuickCTA from "@/components/MobileQuickCTA";
import TrustBadge from "@/components/TrustBadge";

// New components for restructured layout
const MiniPricing = lazy(() => import("@/components/MiniPricing"));
const WhyUsExtended = lazy(() => import("@/components/WhyUsExtended"));
const WorkProcess = lazy(() => import("@/components/WorkProcess"));
const PricingByArea = lazy(() => import("@/components/PricingByArea"));
const ServiceAreaMap = lazy(() => import("@/components/ServiceAreaMap"));
const ServiceAreaCollapsible = lazy(() => import("@/components/ServiceAreaCollapsible"));
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

