import { useParams, Navigate, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, Clock, Check, Building, Home, Utensils, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CalculatorModal from '@/components/CalculatorModal';
import { getDistrictById, districtPages } from '@/data/districtPages';
import { useState } from 'react';

// New district components
import DistrictHero from '@/components/district/DistrictHero';
import DistrictSpecifics from '@/components/district/DistrictSpecifics';
import DistrictPricing from '@/components/district/DistrictPricing';
import DistrictCases from '@/components/district/DistrictCases';
import DistrictReviews from '@/components/district/DistrictReviews';
import DistrictCTA from '@/components/district/DistrictCTA';

const DistrictPage = () => {
  const location = useLocation();
  // Extract district ID from URL path (e.g., /uslugi/dezinfekciya-cao -> cao)
  const pathMatch = location.pathname.match(/\/uslugi\/dezinfekciya-(\w+)/);
  const districtId = pathMatch ? pathMatch[1] : undefined;
  const district = districtId ? getDistrictById(districtId) : undefined;
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  if (!district) {
    return <Navigate to="/uslugi/po-okrugam-moskvy" replace />;
  }

  const services = [
    { title: "Дезинфекция", href: "/uslugi/dezinfekciya", price: 1000 + district.surcharge },
    { title: "Дезинсекция", href: "/uslugi/dezinsekciya", price: 1200 + district.surcharge },
    { title: "Дератизация", href: "/uslugi/deratizaciya", price: 1400 + district.surcharge },
    { title: "Озонирование", href: "/uslugi/ozonirovanie", price: 1500 + district.surcharge },
  ];

  const otherDistricts = districtPages.filter(d => d.id !== district.id).slice(0, 4);

  // Schema.org with geo data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Дезинфекция",
    "name": `Дезинфекция в ${district.name} Москвы`,
    "description": district.metaDescription,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Санитарные Решения",
      "telephone": "+7-906-998-98-88",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Москва",
        "addressRegion": district.fullName
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": district.center[0],
        "longitude": district.center[1]
      }
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": district.fullName + ", Москва"
    },
    "priceRange": `от ${1000 + district.surcharge}₽`
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

  return (
    <>
      <Helmet>
        <title>{district.metaTitle}</title>
        <meta name="description" content={district.metaDescription} />
        <link rel="canonical" href={`https://goruslugimsk.ru/uslugi/${district.slug}`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`Дезинфекция в ${district.name} Москвы — Санитарные Решения`} />
        <meta property="og:description" content={district.metaDescription} />
        <meta property="og:url" content={`https://goruslugimsk.ru/uslugi/${district.slug}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Header />

      <main className="min-h-screen">
        {/* Hero with parallax */}
        <DistrictHero 
          district={district} 
          onCalculatorOpen={() => setIsCalculatorOpen(true)} 
        />

        {/* District specifics (2x3 grid) */}
        <DistrictSpecifics district={district} />

        {/* Neighborhoods */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Районы {district.name}, которые мы обслуживаем
            </h2>
            <div className="flex flex-wrap gap-2">
              {district.neighborhoods.map((n, idx) => (
                <Badge key={idx} variant="secondary" className="text-sm py-1.5 px-3">
                  {n}
                </Badge>
              ))}
            </div>
            
            {/* Response time badge */}
            <div className="mt-6 inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-lg">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Среднее время выезда: {district.responseTime}</span>
            </div>
          </div>
        </section>

        {/* Pricing with tabs */}
        <DistrictPricing district={district} />

        {/* Cases */}
        <DistrictCases district={district} />

        {/* Reviews */}
        <DistrictReviews district={district} />

        {/* Services in district */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Услуги в {district.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {services.map((service) => (
                <Link key={service.href} to={service.href}>
                  <Card className="h-full hover:shadow-md transition-shadow hover:-translate-y-1">
                    <CardContent className="p-6 text-center">
                      <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                      <p className="text-2xl font-bold text-primary">от {service.price}₽</p>
                      {district.surcharge > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">включая выезд</p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Popular objects */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Популярные объекты в {district.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {district.popularObjects.map((obj, idx) => (
                <Card key={idx}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {idx === 0 && <Home className="w-5 h-5 text-primary" />}
                      {idx === 1 && <Building className="w-5 h-5 text-primary" />}
                      {idx === 2 && <Utensils className="w-5 h-5 text-primary" />}
                      {obj.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {obj.items.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Worked streets */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="bg-muted/50 rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-4">Мы уже работали на этих улицах</h2>
              <p className="text-muted-foreground mb-4">
                Вот некоторые адреса в {district.name}, где мы успешно провели обработку:
              </p>
              <div className="flex flex-wrap gap-2">
                {district.workedStreets.map((street, idx) => (
                  <Badge key={idx} variant="outline" className="text-sm">
                    {street}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Частые вопросы про {district.name}</h2>
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

        {/* Final CTA with stats */}
        <DistrictCTA district={district} />

        {/* Other districts */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Другие округа Москвы</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {otherDistricts.map((d) => (
                <Link key={d.id} to={`/uslugi/${d.slug}`}>
                  <Card className="hover:shadow-md transition-shadow hover:-translate-y-1">
                    <CardContent className="p-4 text-center">
                      <h3 className="font-bold text-primary">{d.name}</h3>
                      <p className="text-xs text-muted-foreground">{d.responseTime}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link to="/uslugi/po-okrugam-moskvy" className="text-primary hover:underline font-medium">
                Все округа Москвы →
              </Link>
            </div>
          </div>
        </section>
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

export default DistrictPage;
