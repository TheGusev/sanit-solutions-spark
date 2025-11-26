import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Calculator from "@/components/Calculator";
import DiscountPopup from "@/components/DiscountPopup";
import Details from "@/components/Details";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

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
      <Services />
      <Calculator />
      <Details />
      <Reviews />
      <Contact />
      <Footer />
      
      <DiscountPopup 
        open={showDiscountPopup} 
        onOpenChange={setShowDiscountPopup}
      />
    </div>
  );
};

export default Index;
