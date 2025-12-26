import { useState, useEffect, lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import SectionLoader from "@/components/SectionLoader";
import { useMLPrediction } from "@/hooks/useMLPrediction";
import { useScrollDepth } from "@/hooks/useScrollDepth";

// Critical components - above the fold, load immediately
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatsCounter from "@/components/StatsCounter";
import TrustBadges from "@/components/TrustBadges";
import IntentBanner from "@/components/IntentBanner";

// Below-the-fold components - lazy loaded
const Services = lazy(() => import("@/components/Services"));
const WorkProcess = lazy(() => import("@/components/WorkProcess"));
const Calculator = lazy(() => import("@/components/Calculator"));
const Details = lazy(() => import("@/components/Details"));
const ServiceAreaMap = lazy(() => import("@/components/ServiceAreaMap"));
const FAQ = lazy(() => import("@/components/FAQ"));
const BlogPreview = lazy(() => import("@/components/BlogPreview"));
const Reviews = lazy(() => import("@/components/Reviews"));
const Footer = lazy(() => import("@/components/Footer"));

// Interactive components - lazy loaded
const DiscountPopup = lazy(() => import("@/components/DiscountPopup"));
const ExitIntentPopup = lazy(() => import("@/components/ExitIntentPopup"));
const FloatingButtons = lazy(() => import("@/components/FloatingButtons"));
const ABTestDebug = lazy(() => import("@/components/ABTestDebug"));

const Index = () => {
  const [showDiscountPopup, setShowDiscountPopup] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  
  // Integrate ML prediction in main flow for real-time personalization
  const { prediction, isLoading: mlLoading } = useMLPrediction();
  
  // Track scroll depth goals
  useScrollDepth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      // Show popup after 60% scroll, only once per session
      if (scrollPercentage > 60 && !sessionStorage.getItem("discountShown")) {
        setShowDiscountPopup(true);
        sessionStorage.setItem("discountShown", "true");
      }
    };

    // Toggle debug panel with Ctrl+Shift+D
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setShowDebug(prev => !prev);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Helmet>
        <link rel="canonical" href="https://goruslugimsk.ru/" />
        <link rel="alternate" hrefLang="ru" href="https://goruslugimsk.ru/" />
      </Helmet>
      
      {/* Critical - Above the fold */}
      <Header />
      <Hero onDiscountClick={() => setShowDiscountPopup(true)} />
      <StatsCounter />
      <TrustBadges />
      <IntentBanner />
      
      {/* Below the fold - Lazy loaded */}
      <Suspense fallback={<SectionLoader />}>
        <Services />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <WorkProcess />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Calculator />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Details />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <ServiceAreaMap />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <FAQ />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <BlogPreview />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Reviews />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Footer />
      </Suspense>
      
      {/* Interactive components */}
      <Suspense fallback={null}>
        <DiscountPopup 
          open={showDiscountPopup} 
          onOpenChange={setShowDiscountPopup}
        />
      </Suspense>
      <Suspense fallback={null}>
        <ExitIntentPopup />
      </Suspense>
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
