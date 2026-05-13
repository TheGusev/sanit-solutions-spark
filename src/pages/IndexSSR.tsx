/**
 * SSR-версия главной страницы
 * Без клиентских hooks (useMLPrediction, useScrollDepth) и lazy loading
 * Только статический контент для поисковых ботов
 */

import { Helmet } from "react-helmet-async";
import { ShieldCheck, Clock3, Wallet } from "lucide-react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HeroCallbackForm from "@/components/HeroCallbackForm";
import MiniPricing from "@/components/MiniPricing";
import WhyUsExtended from "@/components/WhyUsExtended";
import PricingByArea from "@/components/PricingByArea";
import ServiceAreaMap from "@/components/ServiceAreaMap";
import ServiceAreaCollapsible from "@/components/ServiceAreaCollapsible";
import Reviews from "@/components/Reviews";
import WorkGallery from "@/components/WorkGallery";
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
        <meta name="keywords" content="дезинфекция, дезинсекция, дератизация, Москва, МО, уничтожение тараканов, уничтожение клопов, СЭС, борьба с грызунами" />
        <link rel="canonical" href="https://goruslugimsk.ru/" />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
        <meta httpEquiv="Strict-Transport-Security" content="max-age=63072000; includeSubDomains; preload" />
        <meta property="og:title" content="Дезинфекция, дезинсекция, дератизация в Москве и МО" />
        <meta property="og:description" content="СЭС служба в Москве: дезинфекция, дезинсекция, дератизация. Лицензия Роспотребнадзора. Гарантия до 3 лет." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goruslugimsk.ru/" />
        <meta property="og:image" content="https://goruslugimsk.ru/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@goruslugimsk" />
        <meta name="twitter:title" content="Дезинфекция, дезинсекция, дератизация в Москве и МО" />
        <meta name="twitter:description" content="СЭС служба в Москве: дезинфекция, дезинсекция, дератизация. Гарантия до 3 лет." />
        <meta name="twitter:image" content="https://goruslugimsk.ru/og-image.jpg" />
        <meta name="twitter:image:alt" content="Дезинфекция, дезинсекция и дератизация в Москве" />
        <link rel="alternate" hrefLang="ru" href="https://goruslugimsk.ru/" />
        <link rel="alternate" hrefLang="x-default" href="https://goruslugimsk.ru/" />
      </Helmet>

      {/* StructuredData is already in index.html, no need to render here */}

      {/* Critical above-the-fold components */}
      <Header onCalculatorClick={noop} />
      <Hero onCalculatorClick={noop} />

      <main id="main-content">
        {/* Тематический H2 — связывает H1 ↔ title ↔ контент в одну тему для Я.Директа */}
        <h2 className="sr-only">Дезинфекция, дезинсекция и дератизация в Москве и МО</h2>

        {/* Краткий цитируемый ответ — для GEO/AI */}
        <section
          aria-label="Краткая информация о компании"
          className="py-6 md:py-8 bg-background border-b border-border/40"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
              <article className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <p className="text-sm md:text-base text-foreground/85 leading-snug">
                  <strong className="text-foreground">Лицензия Роспотребнадзора</strong> — гарантия до 3 лет на все виды работ.
                </p>
              </article>
              <article className="flex items-start gap-3">
                <Clock3 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <p className="text-sm md:text-base text-foreground/85 leading-snug">
                  <strong className="text-foreground">Выезд в день обращения</strong> по Москве и МО, работаем круглосуточно.
                </p>
              </article>
              <article className="flex items-start gap-3">
                <Wallet className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <p className="text-sm md:text-base text-foreground/85 leading-snug">
                  <strong className="text-foreground">Цены от 1 000 ₽</strong> — фиксированная стоимость, без скрытых надбавок.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Контактная форма — видимая в статическом HTML */}
        <section
          aria-label="Заказать обратный звонок"
          className="py-6 md:py-10 bg-muted/30"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto text-center mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                Закажите бесплатный обратный звонок
              </h2>
              <p className="text-sm md:text-base text-muted-foreground mt-2">
                Перезвоним в течение 15 минут и рассчитаем стоимость
              </p>
            </div>
            <div className="max-w-xl mx-auto">
              <HeroCallbackForm serviceSlug="homepage" />
            </div>
          </div>
        </section>

        {/* Main content sections */}
        <MiniPricing />
        <WhyUsExtended />
        <WorkGallery />
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
      </main>

      <Footer />

      {/* Note: Modal components (CalculatorModal, FloatingButtons, StickyCTA, etc.) 
          are not rendered in SSR as they require client-side interactivity */}
    </div>
  );
};

export default IndexSSR;
