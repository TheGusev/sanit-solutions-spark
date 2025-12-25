import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatsCounter from "@/components/StatsCounter";
import TrustBadges from "@/components/TrustBadges";
import IntentBanner from "@/components/IntentBanner";
import Services from "@/components/Services";
import WorkProcess from "@/components/WorkProcess";
import Calculator from "@/components/Calculator";
import DiscountPopup from "@/components/DiscountPopup";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import Details from "@/components/Details";
import ServiceAreaMap from "@/components/ServiceAreaMap";
import FAQ from "@/components/FAQ";
import BlogPreview from "@/components/BlogPreview";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import ABTestDebug from "@/components/ABTestDebug";
import { useMLPrediction } from "@/hooks/useMLPrediction";
import { useScrollDepth } from "@/hooks/useScrollDepth";

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
      
      <Header />
      <Hero onDiscountClick={() => setShowDiscountPopup(true)} />
      <StatsCounter />
      <TrustBadges />
      <IntentBanner />
      <Services />
      <WorkProcess />
      <Calculator />
      <Details />
      <ServiceAreaMap />
      <FAQ />
      <BlogPreview />
      <Reviews />
      <Footer />
      
      <DiscountPopup 
        open={showDiscountPopup} 
        onOpenChange={setShowDiscountPopup}
      />
      <ExitIntentPopup />
      <FloatingButtons />
      
      {/* A/B Test Debug Panel - Ctrl+Shift+D to toggle */}
      {showDebug && <ABTestDebug />}
    </div>
  );
};

export default Index;
