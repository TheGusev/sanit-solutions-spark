/**
 * SSR-версия главной страницы
 * Без клиентских hooks (useMLPrediction, useScrollDepth) и lazy loading
 * Только статический контент для поисковых ботов
 */

import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MiniPricing from "@/components/MiniPricing";
import WhyUsExtended from "@/components/WhyUsExtended";
import PricingByArea from "@/components/PricingByArea";
import ServiceAreaMap from "@/components/ServiceAreaMap";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

// SSR-safe no-op function for calculator (no modal in SSR)
const noop = () => {};

const IndexSSR = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Санитарные Решения — Дезинфекция в Москве и МО | От 1000₽</title>
        <meta name="description" content="Профессиональная дезинфекция, дезинсекция и дератизация в Москве и Московской области. Уничтожение тараканов, клопов, грызунов. Гарантия результата. Выезд за 15 минут." />
        <meta name="keywords" content="дезинфекция, дезинсекция, дератизация, Москва, МО, уничтожение тараканов, уничтожение клопов, санитарная обработка" />
        <link rel="canonical" href="https://goruslugimsk.ru/" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Санитарные Решения — Дезинфекция в Москве" />
        <meta property="og:description" content="Профессиональная дезинфекция, дезинсекция и дератизация. Гарантия результата." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goruslugimsk.ru/" />
        <link rel="alternate" hrefLang="ru" href="https://goruslugimsk.ru/" />
        <link rel="alternate" hrefLang="x-default" href="https://goruslugimsk.ru/" />
      </Helmet>

      {/* StructuredData is already in index.html, no need to render here */}

      {/* Critical above-the-fold components */}
      <Header onCalculatorClick={noop} />
      <Hero onCalculatorClick={noop} />

      {/* Main content sections */}
      <MiniPricing />
      <WhyUsExtended />
      <PricingByArea />
      <ServiceAreaMap />
      <Reviews />
      <FAQ />
      <FinalCTA onOpenCalculator={noop} />
      <Footer />

      {/* Note: Modal components (CalculatorModal, FloatingButtons, StickyCTA, etc.) 
          are not rendered in SSR as they require client-side interactivity */}
    </div>
  );
};

export default IndexSSR;
