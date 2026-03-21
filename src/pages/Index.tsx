import { useEffect, useState, lazy, Suspense } from "react";
import SectionLoader from "@/components/SectionLoader";
import { useMLPrediction } from "@/hooks/useMLPrediction";
import { useScrollDepth } from "@/hooks/useScrollDepth";
import { useHomepageGoals } from "@/hooks/useHomepageGoals";
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
  
  // Track scroll depth goals
  useScrollDepth();
  useHomepageGoals();

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
      
      {/* Mobile Quick CTA - right after hero for mobile users */}
      <MobileQuickCTA onCalculatorClick={handleOpenCalculator} />
      
      {/* Official trust badge */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          <TrustBadge />
        </div>
      </section>
      
      {/* Mini pricing - immediately after hero */}
      <div data-section="pricing">
        <Suspense fallback={<SectionLoader />}>
          <MiniPricing />
        </Suspense>
      </div>
      
      {/* Short "Why Us" block */}
      <Suspense fallback={<SectionLoader />}>
        <WhyUsExtended />
      </Suspense>

      {/* Work Process - how we work */}
      <div data-section="work-process">
        <Suspense fallback={<SectionLoader />}>
          <WorkProcess />
        </Suspense>
      </div>
      
      {/* Full pricing tables with surcharges */}
      <Suspense fallback={<SectionLoader />}>
        <PricingByArea />
      </Suspense>
      
      {/* Service area map */}
      <Suspense fallback={<SectionLoader />}>
        <ServiceAreaMap />
      </Suspense>
      
      {/* Districts + Reviews — side by side on desktop */}
      <section className="py-4 md:py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <Suspense fallback={<SectionLoader />}>
              <ServiceAreaCollapsible />
            </Suspense>
            <Suspense fallback={<SectionLoader />}>
              <Reviews />
            </Suspense>
          </div>
        </div>
      </section>
      
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

