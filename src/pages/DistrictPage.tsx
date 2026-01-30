import { Link, Navigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Clock, Building, Home, Utensils } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

import DistrictHero from '@/components/district/DistrictHero';
import DistrictSpecifics from '@/components/district/DistrictSpecifics';
import DistrictPricing from '@/components/district/DistrictPricing';
import DistrictCases from '@/components/district/DistrictCases';
import DistrictReviews from '@/components/district/DistrictReviews';
import DistrictCTA from '@/components/district/DistrictCTA';

interface DistrictPageProps {
  districtId?: string;
}

const DistrictPage = ({ districtId: propDistrictId }: DistrictPageProps) => {
  const params = useParams<{ districtId: string }>();
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // Используем districtId из пропсов или из URL params
  const districtId = propDistrictId || params.districtId;
  
  const district = districtId ? getDistrictById(districtId) : undefined;

  // Если округ не найден по id — уводим на список округов
  if (!district) {
    return <Navigate to="/uslugi/po-okrugam-moskvy" replace />;
  }

  // ---------------------------------------------------------------------------
  // 2. Сервисы, другие округа, канонический URL
  // ---------------------------------------------------------------------------
  const services = [
    { title: 'Дезинфекция', href: '/uslugi/dezinfekciya', price: 1000 + district.surcharge },
    { title: 'Дезинсекция', href: '/uslugi/dezinsekciya', price: 1200 + district.surcharge },
    { title: 'Дератизация', href: '/uslugi/deratizaciya', price: 1400 + district.surcharge },
    { title: 'Озонирование', href: '/uslugi/ozonirovanie', price: 1500 + district.surcharge },
  ];

  const otherDistricts = districtPages.filter((d) => d.id !== district.id).slice(0, 4);
  const canonicalUrl = `${SEO_CONFIG.baseUrl}/uslugi/${district.slug}`;

  // ---------------------------------------------------------------------------
  // 3. JSON‑LD схемы
  // ---------------------------------------------------------------------------
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `${SEO_CONFIG.companyName} — Дезинфекция в ${district.name}`,
    description: district.metaDescription,
    telephone: SEO_CONFIG.phone,
    url: canonicalUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Москва',
      addressRegion: district.fullName,
      addressCountry: 'RU',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: district.center[0],
      longitude: district.center[1],
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: `${district.fullName}, Москва`,
    },
    priceRange: `от ${1000 + district.surcharge}₽`,
    openingHours: 'Mo-Su 00:00-23:59',
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Дезинфекция',
    name: `Дезинфекция в ${district.name} Москвы`,
    description: district.metaDescription,
    provider: {
      '@type': 'LocalBusiness',
      name: SEO_CONFIG.companyName,
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: `${district.fullName}, Москва`,
    },
    offers: {
      '@type': 'Offer',
      price: 1000 + district.surcharge,
      priceCurrency: 'RUB',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: district.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: SEO_CONFIG.baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Услуги', item: `${SEO_CONFIG.baseUrl}/#services` },
      { '@type': 'ListItem', position: 3, name: 'По округам Москвы', item: `${SEO_CONFIG.baseUrl}/uslugi/po-okrugam-moskvy` },
      { '@type': 'ListItem', position: 4, name: `Дезинфекция в ${district.name}`, item: canonicalUrl },
    ],
  };

  const breadcrumbItems = [
    { label: 'Услуги', href: '/#services' },
    { label: 'По округам Москвы', href: '/uslugi/po-okrugam-moskvy' },
    { label: `Дезинфекция в ${district.name}` },
  ];

  // ---------------------------------------------------------------------------
  // 4. Рендер страницы
  // ---------------------------------------------------------------------------
  return (
    <>
      <Helmet>
        <title>{district.metaTitle}</title>
        <meta name="description" content={district.metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hrefLang="ru" href={canonicalUrl} />
        <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />

        <meta
          property="og:title"
          content={`Дезинфекция в ${district.name} Москвы — ${SEO_CONFIG.companyName}`}
        />
        <meta property="og:description" content={district.metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={SEO_CONFIG.ogImage} />
        <meta property="og:locale" content={SEO_CONFIG.locale} />
        <meta property="og:site_name" content={SEO_CONFIG.companyName} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`Дезинфекция в ${district.name} Москвы — ${SEO_CONFIG.companyName}`}
        />
        <meta name="twitter:description" content={district.metaDescription} />
        <meta name="twitter:image" content={SEO_CONFIG.ogImage} />

        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Header />

      <main className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <DistrictHero district={district} onCalculatorOpen={() => setIsCalculatorOpen(true)} />

        <DistrictSpecifics district={district} />

        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Районы в {district.name}</h2>

            {(() => {
              const neighborhoodPages = getNeighborhoodsByDistrict(district.id);
              if (neighborhoodPages.length > 0) {
                return (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
                    {neighborhoodPages.map((n) => (
                      <Link key={n.id} to={`/rajony/${n.slug}`} className="block">
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
              <Link to="/rajony" className="text-primary hover:underline font-medium">
                Смотреть все 125 районов Москвы →
              </Link>
            </div>

            <div className="flex items-center gap-2 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Среднее время выезда: {district.responseTime}</span>
            </div>
          </div>
        </section>

        <DistrictPricing district={district} />

        <DistrictCases district={district} />

        <DistrictReviews district={district} />

        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Услуги дезинфекции в {district.name}
            </h2>
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

        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Популярные объекты в {district.name}
            </h2>
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

        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Частые вопросы про {district.name}
            </h2>
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

        <DistrictCTA district={district} />

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

        <InternalLinks currentService="dezinfekciya" title="Другие услуги в Москве" maxLinks={12} />
      </main>

      <Footer />

      <CalculatorModal open={isCalculatorOpen} onOpenChange={setIsCalculatorOpen} />
    </>
  );
};

export default DistrictPage;
