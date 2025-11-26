import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatsCounter from "@/components/StatsCounter";
import TrustBadges from "@/components/TrustBadges";
import IntentBanner from "@/components/IntentBanner";
import Services from "@/components/Services";
import WorkProcess from "@/components/WorkProcess";
import Calculator from "@/components/Calculator";
import DiscountPopup from "@/components/DiscountPopup";
import Details from "@/components/Details";
import ServiceAreaMap from "@/components/ServiceAreaMap";
import FAQ from "@/components/FAQ";
import BlogPreview from "@/components/BlogPreview";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";

const Index = () => {
  const [showDiscountPopup, setShowDiscountPopup] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      // Show popup after 60% scroll, only once per session
      if (scrollPercentage > 60 && !sessionStorage.getItem("discountShown")) {
        setShowDiscountPopup(true);
        sessionStorage.setItem("discountShown", "true");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
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
      <FloatingButtons />
    </div>
  );
};

export default Index;
