/**
 * Шаблон страницы услуги в городе Московской области
 * URL: /moscow-oblast/mytishchi/dezinsekciya
 * 
 * SEO: Дезинсекция в Мытищах — от 1700₽, выезд 40 мин | Санитарные Решения
 */

import { useParams, Link } from 'react-router-dom';
import NotFound from './NotFound';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import AnimatedSection from '@/components/AnimatedSection';
import InternalLinks from '@/components/InternalLinks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Phone, Clock, Shield, CheckCircle, MapPin, Car } from 'lucide-react';
import { getCityBySlug, moscowRegionServices, type MoscowRegionService } from '@/data/moscowRegion';
import { servicePages } from '@/data/services';
import { getPestsByService } from '@/data/pests';
import { SEO_CONFIG, generateSEOMeta } from '@/lib/seo';
import { generateFAQSchema } from '@/lib/contentGenerator';

// Variation system imports
import { VariableCTA } from '@/components/ui/VariableCTA';
import { getPageVariation, cardStyles } from '@/lib/contentVariations';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function MoscowRegionServicePage() {
  const { city: citySlug, service: serviceSlug } = useParams<{ city: string; service: string }>();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [citySlug, serviceSlug]);
  
  // Валидация
  if (!citySlug || !serviceSlug) {
    return <NotFound />;
  }
  
  const city = getCityBySlug(citySlug);
  const serviceData = servicePages.find(s => s.slug === serviceSlug);
  
  if (!city || !serviceData || !moscowRegionServices.includes(serviceSlug as MoscowRegionService)) {
    return <NotFound />;
  }
  
  // Generate slug for variation system
  const slug = `/moscow-oblast/${citySlug}/${serviceSlug}`;
  const variation = getPageVariation(slug);
  
  // Цена с наценкой за выезд
  const priceWithSurcharge = serviceData.priceFrom;
  
  // SEO - оптимизированные лимиты
  const pageTitle = `${serviceData.title} ${city.prepositional} от ${priceWithSurcharge}₽ — ${SEO_CONFIG.companyName}`;
  const pageDescription = `${serviceData.title} ${city.prepositional} от ${priceWithSurcharge}₽. Выезд ${city.responseTime}. Гарантия до 3 лет. ☎️ ${SEO_CONFIG.phone}`;
  const canonicalPath = `/moscow-oblast/${citySlug}/${serviceSlug}`;
  const seoMeta = generateSEOMeta(canonicalPath, pageTitle, pageDescription);
  
  // Breadcrumbs
  const breadcrumbItems = [
    { label: 'Московская область', href: '/moscow-oblast' },
    { label: city.name, href: `/moscow-oblast/${citySlug}` },
    { label: serviceData.title }
  ];
  
  // Schema.org
  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${serviceData.title} ${city.prepositional}`,
    description: serviceData.heroSubtitle,
    provider: {
      '@type': 'LocalBusiness',
      name: SEO_CONFIG.companyName,
      telephone: SEO_CONFIG.phone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: city.name,
        addressRegion: 'Московская область'
      }
    },
    areaServed: {
      '@type': 'City',
      name: city.name
    },
    offers: {
      '@type': 'Offer',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: priceWithSurcharge,
        priceCurrency: 'RUB',
        minPrice: priceWithSurcharge
      }
    }
  };
  
  // FAQ items для Schema
  const faqItems = [
    ...serviceData.faq.slice(0, 4).map(item => ({
      question: item.question,
      answer: item.answer
    })),
    {
      question: `Как быстро приедет специалист ${city.prepositional}?`,
      answer: `Время выезда специалиста ${city.prepositional} составляет ${city.responseTime}. Работаем без выходных, выезд возможен в день обращения.`
    }
  ];
  
  const faqSchema = generateFAQSchema(faqItems);
  
  // Вредители для этой услуги
  const servicePests = (serviceSlug === 'dezinsekciya' || serviceSlug === 'deratizaciya')
    ? getPestsByService(serviceSlug)
    : [];
  
  return (
    <>
      <Helmet>
        <title>{seoMeta.title}</title>
        <meta name="description" content={seoMeta.description} />
        <meta name="robots" content={seoMeta.robots} />
        <link rel="canonical" href={seoMeta.canonical} />
        <link rel="alternate" hrefLang="ru" href={seoMeta.hreflangRu} />
        <link rel="alternate" hrefLang="x-default" href={seoMeta.hreflangDefault} />
        <meta property="og:title" content={seoMeta.ogTitle} />
        <meta property="og:description" content={seoMeta.ogDescription} />
        <meta property="og:url" content={seoMeta.canonical} />
        <meta property="og:image" content={seoMeta.ogImage} />
        <meta property="og:type" content={seoMeta.ogType} />
        <meta property="og:locale" content="ru_RU" />
        <meta property="og:site_name" content="Санитарные Решения" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoMeta.ogTitle} />
        <meta name="twitter:description" content={seoMeta.ogDescription} />
        <meta name="twitter:image" content={seoMeta.ogImage} />
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-16">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={breadcrumbItems} />
            
            <div className="mt-6 max-w-4xl">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary/10 rounded-full text-sm font-medium">
                  {city.name}, МО
                </span>
                <span className="px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
                  Выезд {city.responseTime}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {serviceData.title} {city.prepositional}
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-6">
                {serviceData.heroSubtitle}
              </p>
              
              <Alert className="border-l-4 border-blue-500 bg-blue-50/50">
                <Info className="h-5 w-5 text-blue-600" />
                <AlertDescription className="ml-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <span>Выезд {city.responseTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="w-5 h-5 text-primary" />
                      <span>{city.distance} км от МКАД</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      <span>Гарантия до 3 лет</span>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button size="lg" asChild className="whitespace-normal">
                  <a href={`tel:${SEO_CONFIG.phoneClean}`}>
                    <Phone className="w-5 h-5 mr-2" />
                    {SEO_CONFIG.phone}
                  </a>
                </Button>
                <VariableCTA slug={slug} variant="secondary" fallback="Оставить заявку" />
              </div>
            </div>
          </div>
        </section>
        
        {/* Price */}
        <AnimatedSection className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Стоимость услуг</h2>
              <div className={`bg-background rounded-xl p-6 ${cardStyles[variation]}`}>
                <div className="text-4xl font-bold text-primary mb-2">
                  от {priceWithSurcharge}₽
                </div>
                <p className="text-muted-foreground mb-4">
                  Базовая цена {serviceData.priceFrom}₽ + выезд {city.surcharge}₽
                </p>
                <ul className="space-y-2 text-left max-w-sm mx-auto">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>Диагностика включена</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>Гарантия до 3 лет</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>Безопасные препараты</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </AnimatedSection>
        
        {/* Methods */}
        <AnimatedSection className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Методы обработки</h2>
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {serviceData.methods.map((method, index) => (
                <Card key={index} className={cardStyles[variation]}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{method.title}</h3>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </AnimatedSection>
        
        {/* Pests (for dezinsekciya/deratizaciya) */}
        {servicePests.length > 0 && (
          <AnimatedSection className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6 text-center">
                От каких вредителей избавляем
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
                {servicePests.map((pest) => (
                  <div
                    key={pest.slug}
                    className={`p-4 bg-background rounded-lg text-center ${cardStyles[variation]}`}
                  >
                    <span className="text-2xl mb-2 block">{pest.icon}</span>
                    <div className="font-medium text-sm">{pest.name}</div>
                    <div className="text-xs text-muted-foreground">
                      от {pest.priceFrom + city.surcharge}₽
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}
        
        {/* Local Info */}
        <AnimatedSection className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Наши гарантии</h2>
              <div className="prose prose-sm">
                <p>
                  Мы предоставляем услуги {serviceData.title.toLowerCase()} {city.prepositional} с 2015 года.
                  За это время наши специалисты хорошо изучили особенности местной застройки.
                </p>
                <ul className="space-y-2">
                  {city.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </AnimatedSection>
        
        {/* FAQ */}
        <AnimatedSection className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Частые вопросы</h2>
            <div className="max-w-2xl mx-auto">
              <Accordion type="single" collapsible>
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`q${index}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </AnimatedSection>
        
        {/* CTA */}
        <AnimatedSection className="py-12 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Заказать {serviceData.nameAccusative?.toLowerCase() || serviceData.title.toLowerCase()} {city.prepositional}
            </h2>
            <p className="text-lg opacity-90 mb-6">
              Выезд {city.responseTime}. Гарантия до 3 лет.
            </p>
            <Button size="lg" variant="secondary" asChild className="whitespace-normal">
              <a href={`tel:${SEO_CONFIG.phoneClean}`}>
                <Phone className="w-5 h-5 mr-2" />
                {SEO_CONFIG.phone}
              </a>
            </Button>
          </div>
        </AnimatedSection>
        
        {/* Internal Links */}
        <InternalLinks
          currentService={serviceSlug}
          currentCity={citySlug}
          title="Другие услуги"
        />
      </main>
      
      <Footer />
    </>
  );
}

