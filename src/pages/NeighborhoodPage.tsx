import { useParams, Navigate, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, Clock, Check, Phone, ArrowRight, Shield, Award, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import CalculatorModal from '@/components/CalculatorModal';
import { getNeighborhoodBySlug, getNeighborhoodsByDistrict, neighborhoods, Neighborhood } from '@/data/neighborhoods';
import { getDistrictById, districtPages } from '@/data/districtPages';
import { SEO_CONFIG } from '@/lib/seo';
import { useState } from 'react';

const NeighborhoodPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const neighborhood = slug ? getNeighborhoodBySlug(slug) : undefined;
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  if (!neighborhood) {
    return <Navigate to="/rajony" replace />;
  }

  // Get parent district
  const parentDistrict = getDistrictById(neighborhood.districtId);
  
  // Get sibling neighborhoods (same district)
  const siblingNeighborhoods = getNeighborhoodsByDistrict(neighborhood.districtId)
    .filter(n => n.slug !== neighborhood.slug)
    .slice(0, 6);

  // Services with prices
  const services = [
    { title: "Дезинфекция", href: "/uslugi/dezinfekciya", price: 1000 + neighborhood.surcharge, icon: "🦠" },
    { title: "Дезинсекция", href: "/uslugi/dezinsekciya", price: 1200 + neighborhood.surcharge, icon: "🪳" },
    { title: "Дератизация", href: "/uslugi/deratizaciya", price: 1400 + neighborhood.surcharge, icon: "🐀" },
    { title: "Озонирование", href: "/uslugi/ozonirovanie", price: 1500 + neighborhood.surcharge, icon: "💨" },
  ];

  // Schema.org LocalBusiness with areaServed
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Санитарные Решения",
    "description": neighborhood.metaDescription,
    "telephone": SEO_CONFIG.phone,
    "url": `${SEO_CONFIG.baseUrl}/rajony/${neighborhood.slug}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Москва",
      "addressRegion": neighborhood.fullName
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": neighborhood.center[0],
      "longitude": neighborhood.center[1]
    },
    "areaServed": {
      "@type": "Place",
      "name": `${neighborhood.fullName}, Москва`
    },
    "priceRange": `от ${1000 + neighborhood.surcharge}₽`,
    "openingHours": "Mo-Su 00:00-23:59"
  };

  // Service Schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Дезинфекция",
    "name": `Дезинфекция в ${neighborhood.name}`,
    "description": neighborhood.metaDescription,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Санитарные Решения"
    },
    "areaServed": {
      "@type": "Place",
      "name": `${neighborhood.fullName}, Москва`
    },
    "offers": {
      "@type": "Offer",
      "price": 1000 + neighborhood.surcharge,
      "priceCurrency": "RUB"
    }
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": neighborhood.faq.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Главная", "item": SEO_CONFIG.baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Районы Москвы", "item": `${SEO_CONFIG.baseUrl}/rajony` },
      { "@type": "ListItem", "position": 3, "name": neighborhood.name, "item": `${SEO_CONFIG.baseUrl}/rajony/${neighborhood.slug}` }
    ]
  };

  // Breadcrumb items for component
  const breadcrumbItems = [
    { label: "Районы Москвы", href: "/rajony" },
    { label: neighborhood.name }
  ];

  return (
    <>
      <Helmet>
        <title>{neighborhood.metaTitle}</title>
        <meta name="description" content={neighborhood.metaDescription} />
        <link rel="canonical" href={`${SEO_CONFIG.baseUrl}/rajony/${neighborhood.slug}`} />
        <link rel="alternate" hrefLang="ru" href={`${SEO_CONFIG.baseUrl}/rajony/${neighborhood.slug}`} />
        <link rel="alternate" hrefLang="x-default" href={`${SEO_CONFIG.baseUrl}/rajony/${neighborhood.slug}`} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        
        {/* Open Graph */}
        <meta property="og:title" content={neighborhood.metaTitle} />
        <meta property="og:description" content={neighborhood.metaDescription} />
        <meta property="og:url" content={`${SEO_CONFIG.baseUrl}/rajony/${neighborhood.slug}`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={SEO_CONFIG.ogImage} />
        <meta property="og:locale" content={SEO_CONFIG.locale} />
        <meta property="og:site_name" content={SEO_CONFIG.companyName} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={neighborhood.metaTitle} />
        <meta name="twitter:description" content={neighborhood.metaDescription} />
        <meta name="twitter:image" content={SEO_CONFIG.ogImage} />
        
        {/* Schema.org */}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
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

        {/* Hero Section */}
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              {/* District badge */}
              {parentDistrict && (
                <Link 
                  to={`/uslugi/${parentDistrict.slug}`}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
                >
                  <MapPin className="w-4 h-4" />
                  <span>{parentDistrict.fullName}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {neighborhood.h1}
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl">
                {neighborhood.description.slice(0, 200)}...
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 mb-8">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 py-2 px-4">
                  <Clock className="w-4 h-4 mr-2" />
                  Выезд {neighborhood.responseTime}
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 py-2 px-4">
                  <Shield className="w-4 h-4 mr-2" />
                  Гарантия 1 год
                </Badge>
                <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 py-2 px-4">
                  от {1000 + neighborhood.surcharge}₽
                </Badge>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <a href={`tel:${SEO_CONFIG.phoneClean}`}>
                    <Phone className="w-5 h-5 mr-2" />
                    {SEO_CONFIG.phone}
                  </a>
                </Button>
                <Button size="lg" variant="outline" onClick={() => setIsCalculatorOpen(true)}>
                  Рассчитать стоимость
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Услуги в {neighborhood.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {services.map((service) => (
                <Link key={service.href} to={service.href}>
                  <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-primary/50">
                    <CardContent className="p-6 text-center">
                      <span className="text-3xl mb-3 block">{service.icon}</span>
                      <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                      <p className="text-2xl font-bold text-primary">от {service.price}₽</p>
                      {neighborhood.surcharge > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">включая выезд</p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                О дезинфекции в {neighborhood.name}
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {neighborhood.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Landmarks */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Известные места в {neighborhood.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {neighborhood.landmarks.map((landmark, idx) => (
                <Badge key={idx} variant="secondary" className="text-sm py-2 px-4">
                  <MapPin className="w-3 h-3 mr-1" />
                  {landmark}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Streets */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="bg-background rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Улицы, которые мы обслуживаем</h2>
              <p className="text-muted-foreground mb-4">
                Мы уже работали на этих улицах в {neighborhood.name}:
              </p>
              <div className="flex flex-wrap gap-2">
                {neighborhood.streets.map((street, idx) => (
                  <Badge key={idx} variant="outline" className="text-sm py-1.5 px-3">
                    {street}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Us */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">
              Почему выбирают нас в {neighborhood.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2">
                <CardContent className="p-6">
                  <Clock className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-bold text-lg mb-2">Быстрый выезд</h3>
                  <p className="text-muted-foreground">
                    Приезжаем в {neighborhood.name} за {neighborhood.responseTime}. 
                    Работаем круглосуточно без выходных.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="p-6">
                  <Shield className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-bold text-lg mb-2">Гарантия результата</h3>
                  <p className="text-muted-foreground">
                    Даём гарантию 1 год на все виды работ. 
                    Если проблема вернётся — обработаем бесплатно.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="p-6">
                  <Award className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-bold text-lg mb-2">Сертифицированные средства</h3>
                  <p className="text-muted-foreground">
                    Используем только безопасные препараты, 
                    разрешённые Роспотребнадзором.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Частые вопросы о дезинфекции в {neighborhood.name}
            </h2>
            <Accordion type="single" collapsible className="max-w-3xl">
              {neighborhood.faq.map((item, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`}>
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Вызвать дезинфектора в {neighborhood.name}
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Выезд за {neighborhood.responseTime} • Гарантия 1 год • От {1000 + neighborhood.surcharge}₽
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <a href={`tel:${SEO_CONFIG.phoneClean}`}>
                  <Phone className="w-5 h-5 mr-2" />
                  {SEO_CONFIG.phone}
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" onClick={() => setIsCalculatorOpen(true)}>
                Рассчитать стоимость
              </Button>
            </div>
          </div>
        </section>

        {/* Sibling Neighborhoods */}
        {siblingNeighborhoods.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Другие районы {parentDistrict?.name || 'округа'}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {siblingNeighborhoods.map((n) => (
                  <Link key={n.slug} to={`/rajony/${n.slug}`}>
                    <Card className="h-full hover:shadow-md transition-all hover:-translate-y-1">
                      <CardContent className="p-4 text-center">
                        <h3 className="font-semibold text-sm">{n.name}</h3>
                        <p className="text-xs text-muted-foreground">{n.responseTime}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-6">
                <Link to="/rajony" className="text-primary hover:underline font-medium">
                  Все районы Москвы →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Parent District Link */}
        {parentDistrict && (
          <section className="py-8 bg-muted/30">
            <div className="container mx-auto px-4 text-center">
              <Link 
                to={`/uslugi/${parentDistrict.slug}`}
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                <MapPin className="w-4 h-4" />
                Все услуги в {parentDistrict.fullName} →
              </Link>
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* Calculator Modal */}
      <CalculatorModal 
        open={isCalculatorOpen} 
        onOpenChange={setIsCalculatorOpen} 
      />
    </>
  );
};

export default NeighborhoodPage;
