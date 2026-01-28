import { useParams, Link } from 'react-router-dom';
import NotFound from './NotFound';
import { Helmet } from 'react-helmet-async';
import { MapPin, Clock, Phone, ArrowRight, Shield, Award, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import CalculatorModal from '@/components/CalculatorModal';
import InternalLinks from '@/components/InternalLinks';
import { ImageGallery } from '@/components/ImageGallery';
import { getNeighborhoodBySlug, getNeighborhoodsByDistrict, getNeighborhoodContent, getNeighborhoodImages, getCategoryLabel } from '@/data/neighborhoods';
import { getDistrictById } from '@/data/districtPages';
import { SEO_CONFIG } from '@/lib/seo';
import { useState } from 'react';
import { IconFromKey, type IconKey } from '@/lib/iconMap';

// Variation system imports
import { VariableHeading } from '@/components/ui/VariableHeading';
import { WarningBlock } from '@/components/ui/WarningBlock';
import { VariableCTA } from '@/components/ui/VariableCTA';
import { getPageVariation, cardStyles } from '@/lib/contentVariations';

const NeighborhoodPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const neighborhood = slug ? getNeighborhoodBySlug(slug) : undefined;
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  if (!neighborhood) {
    return <NotFound />;
  }

  // Variation slug
  const variationSlug = `/rajony/${neighborhood.slug}`;
  const variation = getPageVariation(variationSlug);

  // Parent district
  const parentDistrict = getDistrictById(neighborhood.districtId);
  
  // Sibling neighborhoods
  const siblingNeighborhoods = getNeighborhoodsByDistrict(neighborhood.districtId)
    .filter(n => n.slug !== neighborhood.slug)
    .slice(0, 6);

  const extendedContent = getNeighborhoodContent(neighborhood.slug);
  const neighborhoodImagesData = getNeighborhoodImages(neighborhood.slug);

  // Services with prices
  const services: { title: string; href: string; price: number; iconKey: IconKey }[] = [
    { title: 'Дезинфекция', href: '/uslugi/dezinfekciya', price: 1000 + neighborhood.surcharge, iconKey: 'virus' },
    { title: 'Дезинсекция', href: '/uslugi/dezinsekciya', price: 1200 + neighborhood.surcharge, iconKey: 'bug' },
    { title: 'Дератизация', href: '/uslugi/deratizaciya', price: 1400 + neighborhood.surcharge, iconKey: 'mouse' },
    { title: 'Озонирование', href: '/uslugi/ozonirovanie', price: 1500 + neighborhood.surcharge, iconKey: 'wind' },
  ];

  // Schema.org LocalBusiness
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Санитарные Решения',
    description: neighborhood.metaDescription,
    telephone: SEO_CONFIG.phone,
    url: `${SEO_CONFIG.baseUrl}/rajony/${neighborhood.slug}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Москва',
      addressRegion: neighborhood.fullName,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: neighborhood.center[0],
      longitude: neighborhood.center[1],
    },
    areaServed: {
      '@type': 'Place',
      name: `${neighborhood.fullName}, Москва`,
    },
    priceRange: `от ${1000 + neighborhood.surcharge}₽`,
    openingHours: 'Mo-Su 00:00-23:59',
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Дезинфекция',
    name: `Дезинфекция в ${neighborhood.name}`,
    description: neighborhood.metaDescription,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Санитарные Решения',
    },
    areaServed: {
      '@type': 'Place',
      name: `${neighborhood.fullName}, Москва`,
    },
    offers: {
      '@type': 'Offer',
      price: 1000 + neighborhood.surcharge,
      priceCurrency: 'RUB',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: neighborhood.faq.map(item => ({
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
      { '@type': 'ListItem', position: 2, name: 'Районы Москвы', item: `${SEO_CONFIG.baseUrl}/rajony` },
      { '@type': 'ListItem', position: 3, name: neighborhood.name, item: `${SEO_CONFIG.baseUrl}/rajony/${neighborhood.slug}` },
    ],
  };

  const breadcrumbItems = [
    { label: 'Районы Москвы', href: '/rajony' },
    { label: neighborhood.name },
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

        <meta property="og:title" content={neighborhood.metaTitle} />
        <meta property="og:description" content={neighborhood.metaDescription} />
        <meta property="og:url" content={`${SEO_CONFIG.baseUrl}/rajony/${neighborhood.slug}`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={SEO_CONFIG.ogImage} />
        <meta property="og:locale" content={SEO_CONFIG.locale} />
        <meta property="og:site_name" content={SEO_CONFIG.companyName} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={neighborhood.metaTitle} />
        <meta name="twitter:description" content={neighborhood.metaDescription} />
        <meta name="twitter:image" content={SEO_CONFIG.ogImage} />

        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Header />

      <main className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Hero */}
        <section className="relative py-16 md:py-24 min-h-[60vh] flex items-center overflow-hidden">
          {neighborhoodImagesData && (
            <>
              <div className="absolute inset-0 bg-primary/5" aria-hidden="true" />
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('${neighborhoodImagesData.heroImage}')`,
                  filter: 'blur(8px)',
                  transform: 'scale(1.1)',
                  opacity: 0.3,
                }}
                role="img"
                aria-label={neighborhoodImagesData.altText}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-background/50 to-background/40 dark:from-background/70 dark:via-background/60 dark:to-background/50" />
            </>
          )}
          {!neighborhoodImagesData && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
          )}

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="max-w-xl">
                {parentDistrict && (
                  <Link
                    to={`/uslugi/${parentDistrict.slug}`}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{parentDistrict.fullName}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}

                <VariableHeading
                  slug={variationSlug}
                  category="hero"
                  level="h1"
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
                />

                <p className="text-lg md:text-xl text-muted-foreground mb-6">
                  {neighborhood.description.slice(0, 200)}...
                </p>

                <WarningBlock slug={variationSlug} icon="info">
                  <div className="flex flex-wrap gap-3">
                    <Badge className="bg-success/20 text-success py-2 px-4 backdrop-blur-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      Выезд {neighborhood.responseTime}
                    </Badge>
                    <Badge className="bg-primary/20 text-primary py-2 px-4 backdrop-blur-sm">
                      <Shield className="w-4 h-4 mr-2" />
                      Гарантия 1 год
                    </Badge>
                    <Badge className="bg-warning/20 text-warning py-2 px-4 backdrop-blur-sm">
                      от {1000 + neighborhood.surcharge}₽
                    </Badge>
                  </div>
                </WarningBlock>

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Button size="lg" asChild>
                    <a href={`tel:${SEO_CONFIG.phoneClean}`}>
                      <Phone className="w-5 h-5 mr-2" />
                      {SEO_CONFIG.phone}
                    </a>
                  </Button>
                  <VariableCTA slug={variationSlug} variant="outline" />
                </div>
              </div>

              {neighborhoodImagesData && (
                <div className="hidden lg:block">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={neighborhoodImagesData.heroImage}
                      alt={neighborhoodImagesData.altText}
                      className="w-full h-80 object-cover"
                      loading="eager"
                    />
                    <div className="absolute bottom-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
                      <p className="font-bold">Гарантия 12 месяцев!</p>
                      <p className="text-sm opacity-90">На все виды услуг</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <VariableHeading
              slug={variationSlug}
              category="services"
              level="h2"
              className="text-2xl md:text-3xl font-bold mb-6"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {services.map(service => (
                <Link key={service.href} to={service.href}>
                  <Card className={`h-full hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-primary/50 ${cardStyles[variation.cardStyle]}`}>
                    <CardContent className="p-6 text-center">
                      <div className="mb-3 flex justify-center">
                        <IconFromKey iconKey={service.iconKey} className="w-8 h-8 text-primary" />
                      </div>
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
              <VariableHeading
                slug={variationSlug}
                category="about"
                level="h2"
                className="text-2xl md:text-3xl font-bold mb-6"
              />
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {neighborhood.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        {neighborhoodImagesData && neighborhoodImagesData.galleryImages.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Обрабатываем все типы объектов в {neighborhood.name}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl">
                От старого фонда до элитной недвижимости — гарантируем результат для любого типа помещений
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {neighborhoodImagesData.galleryImages.map((image, index) => (
                  <div
                    key={index}
                    className={`group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${cardStyles[variation.cardStyle]}`}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={image.url}
                        alt={`${image.title} - дезинфекция в ${neighborhood.name}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-semibold text-lg mb-1">{image.title}</h3>
                      <div className="flex items-center text-white/80 text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Обработка от 2500₽
                      </div>
                    </div>
                    <Badge className="absolute top-4 right-4" variant="secondary">
                      {getCategoryLabel(image.category)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Extended content */}
        {extendedContent && (
          <>
            <section className="py-12 bg-primary/5">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  <VariableHeading
                    slug={variationSlug}
                    category="intro"
                    level="h2"
                    className="text-2xl md:text-3xl font-bold mb-4"
                  />
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {extendedContent.intro}
                  </p>
                </div>
              </div>
            </section>

            <section className="py-12">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  <VariableHeading
                    slug={variationSlug}
                    category="whyChooseUs"
                    level="h2"
                    className="text-2xl font-bold mb-6"
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    {extendedContent.whyUs.map((reason, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-4 rounded-lg ${cardStyles[variation.cardStyle]}`}
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="py-12 bg-muted/30">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold mb-3">Зона обслуживания</h2>
                      <p className="text-muted-foreground mb-4">
                        {extendedContent.coverage}
                      </p>
                      <div>
                        <p className="font-medium mb-2">Ближайшие станции метро и ориентиры:</p>
                        <div className="flex flex-wrap gap-2">
                          {extendedContent.landmarks.map((landmark, index) => (
                            <Badge key={index} variant="secondary" className="text-sm py-1.5 px-3">
                              <MapPin className="w-3 h-3 mr-1" />
                              {landmark}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-12">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  <VariableHeading
                    slug={variationSlug}
                    category='benefits'
                    level="h2"
                    className="text-2xl font-bold mb-6"
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    {extendedContent.advantages.map((advantage, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-4 rounded-lg ${cardStyles[variation.cardStyle]}`}
                      >
                        <Award className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{advantage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

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

        {/* Why Us static cards */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <VariableHeading
              slug={variationSlug}
              category="guarantees"
              level="h2"
              className="text-2xl md:text-3xl font-bold mb-8"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className={cardStyles[variation.cardStyle]}>
                <CardContent className="p-6">
                  <Clock className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-bold text-lg mb-2">Быстрый выезд</h3>
                  <p className="text-muted-foreground">
                    Приезжаем в {neighborhood.name} за {neighborhood.responseTime}. Работаем круглосуточно без выходных.
                  </p>
                </CardContent>
              </Card>
              <Card className={cardStyles[variation.cardStyle]}>
                <CardContent className="p-6">
                  <Shield className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-bold text-lg mb-2">Гарантия результата</h3>
                  <p className="text-muted-foreground">
                    Даём гарантию 1 год на все виды работ. Если проблема вернётся — обработаем бесплатно.
                  </p>
                </CardContent>
              </Card>
              <Card className={cardStyles[variation.cardStyle]}>
                <CardContent className="p-6">
                  <Award className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-bold text-lg mb-2">Сертифицированные средства</h3>
                  <p className="text-muted-foreground">
                    Используем только безопасные препараты, разрешённые Роспотребнадзором.
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

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <VariableHeading
              slug={variationSlug}
              category="cta"
              level="h2"
              className="text-2xl md:text-3xl font-bold mb-4"
            />
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
              <VariableCTA slug={variationSlug} variant="ghost" />
            </div>
          </div>
        </section>

        {/* Sibling neighborhoods */}
        {siblingNeighborhoods.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Другие районы {parentDistrict?.name || 'округа'}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {siblingNeighborhoods.map(n => (
                  <Link key={n.slug} to={`/rajony/${n.slug}`}>
                    <Card className={`h-full hover:shadow-md transition-all hover:-translate-y-1 ${cardStyles[variation.cardStyle]}`}>
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

        <InternalLinks
          currentNeighborhood={neighborhood.slug}
          currentService="dezinsekciya"
          title="Услуги в других районах Москвы"
          maxLinks={12}
        />
      </main>

      <Footer />

      <CalculatorModal
        open={isCalculatorOpen}
        onOpenChange={setIsCalculatorOpen}
      />
    </>
  );
};

export default NeighborhoodPage;
