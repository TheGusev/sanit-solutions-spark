import { useEffect, useState, lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import SectionLoader from "@/components/SectionLoader";
import { useMLPrediction } from "@/hooks/useMLPrediction";
import { useScrollDepth } from "@/hooks/useScrollDepth";

// Critical components - above the fold, load immediately
import Header from "@/components/Header";
import StickyTabNav from "@/components/StickyTabNav";

// Main Stacking Cards component
const StackingCards = lazy(() => import("@/components/StackingCards"));

// Lazy-loaded components
const Footer = lazy(() => import("@/components/Footer"));

// Modal and floating components
const CalculatorModal = lazy(() => import("@/components/CalculatorModal"));
const ReviewFormModal = lazy(() => import("@/components/ReviewFormModal"));
const FloatingButtons = lazy(() => import("@/components/FloatingButtons"));
const StickyCTA = lazy(() => import("@/components/StickyCTA"));
const ABTestDebug = lazy(() => import("@/components/ABTestDebug"));

const Index = () => {
  const [showDebug, setShowDebug] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Integrate ML prediction in main flow for real-time personalization
  const { prediction, isLoading: mlLoading } = useMLPrediction();

  // Track scroll depth goals
  useScrollDepth();

  useEffect(() => {
    // Toggle debug panel with Ctrl+Shift+D
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        e.preventDefault();
        setShowDebug((prev) => !prev);
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

  const handleOpenReviewForm = () => {
    setShowReviewForm(true);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Helmet>
        <title>
          Санитарные Решения - Дезинфекция в Москве | Профессиональные услуги
        </title>
        <meta
          name="description"
          content="Дезинфекция, дезинсекция, дератизация в Москве от 1500₽. Выезд за 15 минут. Гарантия до 1 года. Документы для СЭС. Договор с юр.лицами. Звоните: +7 (906) 998-98-88"
        />
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta httpEquiv="last-modified" content="2026-01-04T00:00:00+03:00" />
        <link rel="canonical" href="https://goruslugimsk.ru/" />
        <link rel="alternate" hrefLang="ru" href="https://goruslugimsk.ru/" />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://goruslugimsk.ru/"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goruslugimsk.ru/" />
        <meta
          property="og:title"
          content="Санитарные Решения - Дезинфекция в Москве | Профессиональные услуги"
        />
        <meta
          property="og:description"
          content="Дезинфекция, дезинсекция, дератизация в Москве от 1500₽. Выезд за 15 минут. Гарантия до 1 года."
        />
      </Helmet>

      {/* Fixed Header - 70px */}
      <Header onCalculatorClick={handleOpenCalculator} />

      {/* Sticky Tab Navigation - sticks below header */}
      <StickyTabNav />

      {/* Main content with proper padding for fixed header + sticky tabs */}
      <main className="pt-[var(--total-nav-height)]">
        {/* 8 Stacking Cards */}
        <Suspense fallback={<SectionLoader />}>
          <StackingCards 
            onCalculatorClick={handleOpenCalculator}
            onReviewClick={handleOpenReviewForm}
          />
        </Suspense>

        {/* Footer */}
        <Suspense fallback={<SectionLoader />}>
          <Footer />
        </Suspense>
      </main>

      {/* Calculator Modal */}
      <Suspense fallback={null}>
        <CalculatorModal
          open={showCalculator}
          onOpenChange={setShowCalculator}
        />
      </Suspense>

      {/* Review Form Modal */}
      <Suspense fallback={null}>
        <ReviewFormModal
          isOpen={showReviewForm}
          onClose={() => setShowReviewForm(false)}
        />
      </Suspense>

      {/* Floating action buttons */}
      <Suspense fallback={null}>
        <FloatingButtons />
      </Suspense>

      {/* Sticky CTA for mobile - shows after 40% scroll */}
      <Suspense fallback={null}>
        <StickyCTA
          price={2500}
          discount={15}
          onOrderClick={handleOpenCalculator}
        />
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
