import { useEffect, useState, lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import SectionLoader from "@/components/SectionLoader";
import { useMLPrediction } from "@/hooks/useMLPrediction";
import { useScrollDepth } from "@/hooks/useScrollDepth";

// Critical components - above the fold, load immediately
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MobileQuickCTA from "@/components/MobileQuickCTA";

// New components for restructured layout
const MiniPricing = lazy(() => import("@/components/MiniPricing"));
const WhyUsExtended = lazy(() => import("@/components/WhyUsExtended"));
const PricingByArea = lazy(() => import("@/components/PricingByArea"));
const ServiceAreaMap = lazy(() => import("@/components/ServiceAreaMap"));
const ServiceDistricts = lazy(() => import("@/components/ServiceDistricts"));
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
  
  // Track scroll depth goals
  useScrollDepth();

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

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Helmet>
        <title>Дезинфекция, дезинсекция, дератизация в Москве — Санитарные Решения</title>
        <meta name="description" content="Профессиональная СЭС служба в Москве ⚡ Дезинфекция, дезинсекция, дератизация ✅ Лицензия Роспотребнадзора ✅ Гарантия до 1 года ☎️ +7 (906) 998-98-88" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta httpEquiv="last-modified" content="2026-01-18T00:00:00+03:00" />
        <link rel="canonical" href="https://goruslugimsk.ru/" />
        <link rel="alternate" hrefLang="ru" href="https://goruslugimsk.ru/" />
        <link rel="alternate" hrefLang="x-default" href="https://goruslugimsk.ru/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goruslugimsk.ru/" />
        <meta property="og:title" content="Дезинфекция, дезинсекция, дератизация в Москве — Санитарные Решения" />
        <meta property="og:description" content="Профессиональная СЭС служба в Москве ⚡ Дезинфекция, дезинсекция, дератизация ✅ Гарантия до 1 года" />
      </Helmet>
      
      {/* Critical - Above the fold */}
      <Header onCalculatorClick={handleOpenCalculator} />
      <Hero onCalculatorClick={handleOpenCalculator} />
      
      {/* Mobile Quick CTA - right after hero for mobile users */}
      <MobileQuickCTA onCalculatorClick={handleOpenCalculator} />
      
      {/* Mini pricing - immediately after hero */}
      <Suspense fallback={<SectionLoader />}>
        <MiniPricing />
      </Suspense>
      
      {/* Short "Why Us" block */}
      <Suspense fallback={<SectionLoader />}>
        <WhyUsExtended />
      </Suspense>
      
      {/* Full pricing tables with surcharges */}
      <Suspense fallback={<SectionLoader />}>
        <PricingByArea />
      </Suspense>
      
      {/* Service area map */}
      <Suspense fallback={<SectionLoader />}>
        <ServiceAreaMap />
      </Suspense>
      
      {/* Districts Section */}
      <Suspense fallback={<SectionLoader />}>
        <ServiceDistricts />
      </Suspense>
      
      {/* Reviews */}
      <Suspense fallback={<SectionLoader />}>
        <Reviews />
      </Suspense>
      
      {/* Work Gallery */}
      <Suspense fallback={<SectionLoader />}>
        <WorkGallery />
      </Suspense>
      
      {/* FAQ */}
      <Suspense fallback={<SectionLoader />}>
        <FAQ />
      </Suspense>
      
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
