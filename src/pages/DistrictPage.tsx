import { Link, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, Clock, Check, Building, Home, Utensils, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import CalculatorModal from '@/components/CalculatorModal';
import InternalLinks from '@/components/InternalLinks';
import { getDistrictById, districtPages } from '@/data/districtPages';
import { getNeighborhoodsByDistrict } from '@/data/neighborhoods';
import { SEO_CONFIG } from '@/lib/seo';
import { useState } from 'react';

// New district components
import DistrictHero from '@/components/district/DistrictHero';
import DistrictSpecifics from '@/components/district/DistrictSpecifics';
import DistrictPricing from '@/components/district/DistrictPricing';
import DistrictCases from '@/components/district/DistrictCases';
import DistrictReviews from '@/components/district/DistrictReviews';
import DistrictCTA from '@/components/district/DistrictCTA';

// Variation system imports
import VariableHeading from '@/components/ui/VariableHeading';
import WarningBlock from '@/components/ui/WarningBlock';
import VariableCTA from '@/components/ui/VariableCTA';

// District variations
import { getDistrictType, districtHeadings, districtWarnings, districtCTA, districtBenefits } from '@/lib/districtVariations';

const DistrictPage = () => {
  const location = useLocation();
  // Extract district ID from URL path (e.g., /okruga/cao -> cao)
  const pathMatch = location.pathname.match(/\/okruga\/(\w+)/);
  const districtId = pathMatch ? pathMatch[1] : undefined;
  const district = districtId ? getDistrictById(districtId) : undefined;
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  if (!district) {
    return <Navigate to="/uslugi/po-okrugam-moskvy" replace />;
  }

  // Get district type and content variations
  const districtType = getDistrictType(district.id);
  const headings = districtHeadings[districtType];
  const warning = districtWarnings[districtType];
  const ctaText = districtCTA[districtType];
  const benefits = districtBenefits[districtType];

  const services = [
    { title: "Дезинфекция", href: "/uslugi/dezinfekciya", price: 1000 + district.surcharge },
    { title: "Дезинсекция", href: "/uslugi/dezinsekciya", price: 1200 + district.surcharge },
    { title: "Дератизация", href: "/uslugi/deratizaciya", price: 1400 + district.surcharge },
    { title: "Озонирование", href: "/uslugi/ozonirovanie", price: 1500 + district.surcharge },
  ];

  const otherDistricts = districtPages.filter(d => d.id !== district.id).slice(0, 4);
  const canonicalUrl = `${SEO_CONFIG.baseUrl}/okruga/${district.id}`;

  // Schema.org LocalBusiness
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `${SEO_CONFIG.companyName} — ${headings.hero}`,
    "description": district.metaDescription,
    "telephone": SEO_CONFIG.phone,
    "url": canonicalUrl,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Москва",
      "addressRegion": district.fullName,
      "addressCountry": "RU"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": district.center[0],
      "longitude": district.center[1]
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": district.fullName + ", Москва"
    },
    "priceRange": `от ${1000 + district.surcharge}₽`,
    "openingHours": "Mo-Su 00:00-23:59"
  };

  // Schema.org Service
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Дезинфекция",
    "name": headings.hero,
    "description": district.metaDescription,
    "provider": {
      "@type": "LocalBusiness",
      "name": SEO_CONFIG.companyName
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": district.fullName + ", Москва"
    },
    "offers": {
      "@type": "Offer",
      "price": 1000 + district.surcharge,
      "priceCurrency": "RUB"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": district.faq.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Главная", "item": SEO_CONFIG.baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Услуги", "item": `${SEO_CONFIG.baseUrl}/#services` },
      { "@type": "ListItem", "position": 3, "name": "По округам Москвы", "item": `${SEO_CONFIG.baseUrl}/uslugi/po-okrugam-moskvy` },
      { "@type": "ListItem", "position": 4, "name": `${district.name}`, "item": canonicalUrl }
    ]
  };

  const breadcrumbItems = [
    { label: "Услуги", href: "/#services" },
    { label: "По округам Москвы", href: "/uslugi/po-okrugam-moskvy" },
    { label: district.name }
  ];

  return (
    <>
      <Helmet>
        <title>{district.metaTitle}</title>
        <meta name="description" content={district.metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hrefLang="ru" href={canonicalUrl} />
        <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${headings.hero} — ${SEO_CONFIG.companyName}`} />
        <meta property="og:description" content={district.metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={SEO_CONFIG.ogImage} />
        <meta property="og:locale" content={SEO_CONFIG.locale} />
        <meta property="og:site_name" content={SEO_CONFIG.companyName} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${headings.hero} — ${SEO_CONFIG.companyName}`} />
        <meta name="twitter:description" content={district.metaDescription} />
        <meta name="twitter:image" content={SEO_CONFIG.ogImage} />
        
        {/* Schema.org */}
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Header />

      <main className="min-h-screen pt-20">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Hero Section with Variable Heading */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{headings.hero}</h1>
            <p className="text-xl text-gray-700 mb-8">{district.description}</p>
            
            {/* Warning Block */}
            <div className={`p-6 rounded-lg ${warning.accent === 'warning' ? 'bg-amber-50 border-amber-300' : 'bg-blue-50 border-blue-300'} border-2`}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {warning.accent === 'warning' ? '⚠️' : 'ℹ️'}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">{warning.title}</h3>
                  <p className="text-gray-700">{warning.text}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button 
                size="lg" 
                onClick={() => setIsCalculatorOpen(true)}
                className="text-lg px-8 py-6"
              >
                {ctaText}
              </Button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">{headings.services}</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {services.map((service) => (
                <Link key={service.href} to={service.href}>
                  <Card className="h-full hover:shadow-lg border-2 hover:border-primary/50 transition-all">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                      <p className="text-2xl font-bold text-primary mb-2">от {service.price}₽</p>
                      <span className="text-primary font-semibold hover:underline">Подробнее →</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Наши преимущества</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg shadow">
                  <span className="text-2xl flex-shrink-0">✅</span>
                  <p className="text-lg">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Neighborhoods */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">Районы в {district.name}</h2>
            
            {(() => {
              const neighborhoodPages = getNeighborhoodsByDistrict(district.id);
              if (neighborhoodPages.length > 0) {
                return (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
                    {neighborhoodPages.map((n) => (
                      <Link 
                        key={n.id} 
                        to={`/rajony/${n.slug}`}
                        className="block"
                      >
                        <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 h-full">
                          <CardContent className="p-3 text-center">
                            <span className="font-medium text-sm">{n.name}</span>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                );
              }
              return (
                <div className="flex flex-wrap gap-2 mb-6">
                  {district.neighborhoods.map((n, idx) => (
                    <Badge key={idx} variant="secondary" className="text-sm py-1.5 px-3">
                      {n}
                    </Badge>
                  ))}
                </div>
              );
            })()}
            
            <div className="mb-6">
              <Link 
                to="/rajony" 
                className="text-primary hover:underline font-medium"
              >
                Смотреть все районы Москвы →
              </Link>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
              <span className="font-medium">Среднее время выезда: {district.responseTime}</span>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">Частые вопросы про {district.name}</h2>
            <Accordion type="single" collapsible className="max-w-3xl">
              {district.faq.map((item, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`}>
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-primary/5 rounded-2xl p-12">
              <h2 className="text-3xl font-bold mb-6">{ctaText}</h2>
              <Button 
                size="lg" 
                onClick={() => setIsCalculatorOpen(true)}
                className="text-lg px-8 py-6"
              >
                {ctaText}
              </Button>
              <p className="mt-6 text-lg">Звоните: <a href="tel:+74951234567" className="font-bold text-primary">+7 (495) 123-45-67</a></p>
            </div>
          </div>
        </section>

        {/* Other Districts */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">Другие округа Москвы</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {otherDistricts.map((d) => (
                <Link key={d.id} to={`/okruga/${d.id}`}>
                  <Card className="hover:shadow-md transition-shadow hover:-translate-y-1">
                    <CardContent className="p-4 text-center">
                      <h3 className="font-bold text-primary">{d.name}</h3>
                      <p className="text-xs text-muted-foreground">{d.responseTime}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <CalculatorModal 
        open={isCalculatorOpen} 
        onOpenChange={setIsCalculatorOpen} 
      />
    </>
  );
};

export default DistrictPage;
