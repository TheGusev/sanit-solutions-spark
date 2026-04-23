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
import ServiceAreaCollapsible from "@/components/ServiceAreaCollapsible";
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
        <title>Дезинфекция, дезинсекция, дератизация в Москве и МО</title>
        <meta name="description" content="СЭС служба в Москве: дезинфекция, дезинсекция, дератизация. Лицензия Роспотребнадзора. Гарантия до 3 лет. Выезд за 15 минут." />
        <meta name="keywords" content="дезинфекция, дезинсекция, дератизация, Москва, МО, уничтожение тараканов, уничтожение клопов, санитарная обработка" />
        <link rel="canonical" href="https://goruslugimsk.ru/" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Дезинфекция, дезинсекция, дератизация в Москве и МО" />
        <meta property="og:description" content="СЭС служба в Москве: дезинфекция, дезинсекция, дератизация. Лицензия Роспотребнадзора. Гарантия до 3 лет." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goruslugimsk.ru/" />
        <meta property="og:image" content="https://goruslugimsk.ru/og-image.jpg" />
        <link rel="alternate" hrefLang="ru" href="https://goruslugimsk.ru/" />
        <link rel="alternate" hrefLang="x-default" href="https://goruslugimsk.ru/" />
      </Helmet>

      {/* StructuredData is already in index.html, no need to render here */}

      {/* Critical above-the-fold components */}
      <Header onCalculatorClick={noop} />
      <Hero onCalculatorClick={noop} />

      {/* Тематический H2 — связывает H1 ↔ title ↔ контент в одну тему для Я.Директа */}
      <h2 className="sr-only">Дезинфекция, дезинсекция и дератизация в Москве и МО</h2>

      {/* Main content sections */}
      <MiniPricing />
      <WhyUsExtended />
      <PricingByArea />
      <ServiceAreaMap />
      <section className="py-4 md:py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <ServiceAreaCollapsible />
            <Reviews />
          </div>
        </div>
      </section>
      <FAQ />
      <FinalCTA onOpenCalculator={noop} />
      <Footer />

      {/* Note: Modal components (CalculatorModal, FloatingButtons, StickyCTA, etc.) 
          are not rendered in SSR as they require client-side interactivity */}
    </div>
  );
};

export default IndexSSR;
