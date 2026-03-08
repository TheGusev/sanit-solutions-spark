import { useParams, Link } from 'react-router-dom';
import NotFound from './NotFound';
import { Helmet } from 'react-helmet-async';
import { MapPin, Clock, Phone, ArrowRight, Shield, Award, CheckCircle, Home, Building2, UtensilsCrossed, Warehouse, Factory, Bug } from 'lucide-react';
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
import { getNeighborhoodBySlug, getNeighborhoodsByDistrict } from '@/data/neighborhoods';
import { allBlogArticles } from '@/data/blog';
import { getDistrictById } from '@/data/districtPages';
import { getNeighborhoodContent } from '@/data/neighborhoodContent';
import { generateNeighborhoodContent } from '@/lib/neighborhoodContentGenerator';
import { getNeighborhoodImages, getCategoryLabel } from '@/data/neighborhoodImages';
import { SEO_CONFIG } from '@/lib/seo';
import { useState } from 'react';
import { IconFromKey, type IconKey } from '@/lib/iconMap';

// Variation system imports
import { VariableHeading } from '@/components/ui/VariableHeading';
import { WarningBlock } from '@/components/ui/WarningBlock';
import { VariableCTA } from '@/components/ui/VariableCTA';
import { getPageVariation, cardStyles } from '@/lib/contentVariations';
import SectionHeading from '@/components/ui/SectionHeading';

// JSON-LD imports
import { generateNeighborhoodLD, generateBreadcrumbLD, generateFAQLD, generateServiceLD, renderJSONLD } from '@/lib/jsonLD';

const NeighborhoodPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const neighborhood = slug ? getNeighborhoodBySlug(slug) : undefined;
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  if (!neighborhood) {
    return <NotFound />;
  }

  const locationText = neighborhood.prepositional || `в ${neighborhood.name}`;

  // Get variation for this neighborhood
  const variation = getPageVariation(neighborhood.slug);
  const variationSlug = neighborhood.slug;

  // Get parent district
  const parentDistrict = getDistrictById(neighborhood.districtId);
  
  // Get sibling neighborhoods (same district)
  const siblingNeighborhoods = getNeighborhoodsByDistrict(neighborhood.districtId)
    .filter(n => n.slug !== neighborhood.slug)
    .slice(0, 6);

  // Расширенный контент для района (ручной или автогенерированный)
  const extendedContent = getNeighborhoodContent(neighborhood.slug) 
    || generateNeighborhoodContent(neighborhood);
  
  // Изображения для района
  const neighborhoodImagesData = getNeighborhoodImages(neighborhood.slug);

  // Services with prices
  const services: { title: string; href: string; price: number; iconKey: IconKey }[] = [
    { title: "Дезинфекция", href: "/uslugi/dezinfekciya", price: 1000 + neighborhood.surcharge, iconKey: "virus" },
    { title: "Дезинсекция", href: "/uslugi/dezinsekciya", price: 1200 + neighborhood.surcharge, iconKey: "bug" },
    { title: "Дератизация", href: "/uslugi/deratizaciya", price: 1400 + neighborhood.surcharge, iconKey: "mouse" },
    { title: "Озонирование", href: "/uslugi/ozonirovanie", price: 1500 + neighborhood.surcharge, iconKey: "wind" },
  ];

  // ========== JSON-LD SCHEMAS (NEW!) ==========
  
  // LocalBusiness schema
  const localBusinessSchema = generateNeighborhoodLD({
    name: neighborhood.name,
    slug: neighborhood.slug,
    description: neighborhood.metaDescription,
    coordinates: neighborhood.center
  });

  // Breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbLD([
    { name: "Главная", url: SEO_CONFIG.baseUrl },
    { name: "Районы Москвы", url: `${SEO_CONFIG.baseUrl}/rajony` },
    { name: neighborhood.name, url: `${SEO_CONFIG.baseUrl}/rajony/${neighborhood.slug}` }
  ]);

  // FAQ schema
  const faqSchema = generateFAQLD(neighborhood.faq.map(item => ({
    question: item.question,
    answer: item.answer
  })));

  // Service schema for main service
  const serviceSchema = generateServiceLD({
    name: `Дезинфекция ${locationText}`,
    description: neighborhood.metaDescription,
    url: `${SEO_CONFIG.baseUrl}/rajony/${neighborhood.slug}`,
    price: 1000 + neighborhood.surcharge
  });

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
        <link rel="canonical" href={`${SEO_CONFIG.baseUrl}/rajony/${neighborhood.slug}/`} />
        <link rel="alternate" hrefLang="ru" href={`${SEO_CONFIG.baseUrl}/rajony/${neighborhood.slug}/`} />
        <link rel="alternate" hrefLang="x-default" href={`${SEO_CONFIG.baseUrl}/rajony/${neighborhood.slug}/`} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        
        {/* Open Graph */}
        <meta property="og:title" content={neighborhood.metaTitle} />
        <meta property="og:description" content={neighborhood.metaDescription} />
        <meta property="og:url" content={`${SEO_CONFIG.baseUrl}/rajony/${neighborhood.slug}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={SEO_CONFIG.ogImage} />
        <meta property="og:locale" content={SEO_CONFIG.locale} />
        <meta property="og:site_name" content={SEO_CONFIG.companyName} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={neighborhood.metaTitle} />
        <meta name="twitter:description" content={neighborhood.metaDescription} />
        <meta name="twitter:image" content={SEO_CONFIG.ogImage} />
        
        {/* JSON-LD Structured Data (NEW!) */}
        <script type="application/ld+json">
          {renderJSONLD(localBusinessSchema)}
        </script>
        <script type="application/ld+json">
          {renderJSONLD(breadcrumbSchema)}
        </script>
        <script type="application/ld+json">
          {renderJSONLD(faqSchema)}
        </script>
        <script type="application/ld+json">
          {renderJSONLD(serviceSchema)}
        </script>
      </Helmet>

      <Header />

      <main className="min-h-screen pt-20">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Hero Section with Background Image */}
        <section className="relative py-16 md:py-24 min-h-[60vh] flex items-center overflow-hidden">
          {/* Background image */}
          {neighborhoodImagesData && (
            <>
              {/* Цветовая подложка */}
              <div className="absolute inset-0 bg-primary/5" aria-hidden="true" />
              {/* Mobile version: brighter background */}
              <div 
                className="absolute inset-0 bg-cover bg-center md:hidden"
                style={{ 
                  backgroundImage: `url('${neighborhoodImagesData.heroImage}')`,
                  filter: 'blur(6px)',
                  transform: 'scale(1.1)',
                  opacity: 0.60
                }}
                role="img"
                aria-label={neighborhoodImagesData.altText}
              />
              {/* Desktop version */}
              <div 
                className="absolute inset-0 bg-cover bg-center hidden md:block"
                style={{ 
                  backgroundImage: `url('${neighborhoodImagesData.heroImage}')`,
                  filter: 'blur(8px)',
                  transform: 'scale(1.1)',
                  opacity: 0.45
                }}
                role="img"
                aria-label={neighborhoodImagesData.altText}
              />
              {/* Gradient overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-background/35 to-background/25 dark:from-background/60 dark:via-background/50 dark:to-background/40" />
            </>
          )}
          {/* Fallback gradient if no image */}
          {!neighborhoodImagesData && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
          )}
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left column - text content */}
              <div className="max-w-xl">
                {/* District badge */}
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
                
                {/* Variable H1 with service keywords for SEO (Issue #12) */}
                <VariableHeading 
                  slug={variationSlug} 
                  category="hero" 
                  level="h1" 
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
                  fallback={`Дезинфекция и дезинсекция ${locationText}`}
                />
                
                <p className="text-lg md:text-xl text-muted-foreground mb-6">
                  Профессиональная обработка квартир, офисов и коммерческих помещений. 
                  Выезд мастера — {neighborhood.responseTime}. Гарантия результата.
                </p>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-3 mb-8">
                  <Badge className="bg-success/20 text-success py-2 px-4 backdrop-blur-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    Выезд {neighborhood.responseTime}
                  </Badge>
                  <Badge className="bg-primary/20 text-primary py-2 px-4 backdrop-blur-sm">
                    <Shield className="w-4 h-4 mr-2" />
                    Гарантия до 3 лет
                  </Badge>
                  <Badge className="bg-warning/20 text-warning py-2 px-4 backdrop-blur-sm">
                    от {1000 + neighborhood.surcharge}₽
                  </Badge>
                </div>

                {/* CTA buttons with variation */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <a href={`tel:${SEO_CONFIG.phoneClean}`}>
                      <Phone className="w-5 h-5 mr-2" />
                      {SEO_CONFIG.phone}
                    </a>
                  </Button>
                  <VariableCTA 
                    slug={variationSlug} 
                    onClick={() => setIsCalculatorOpen(true)}
                    fallback="Рассчитать стоимость"
                  />
                </div>
              </div>
              
              {/* Right column - hero image card (desktop only) */}
              {neighborhoodImagesData && (
                <div className="hidden lg:block">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img 
                      src={neighborhoodImagesData.heroImage}
                      alt={neighborhoodImagesData.altText}
                      className="w-full h-80 object-cover"
                      loading="eager"
                    />
                    {/* Badge overlay */}
                    <div className="absolute bottom-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
                      <p className="font-bold">Гарантия до 3 лет!</p>
                      <p className="text-sm opacity-90">На все виды услуг</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Warning Block */}
        <WarningBlock slug={variationSlug} />

        {/* Services Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <VariableHeading 
              slug={variationSlug} 
              category="services" 
              level="h2" 
              className="text-2xl md:text-3xl font-bold mb-6"
              fallback={`Услуги ${locationText}`}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {services.map((service) => (
                <Link key={service.href} to={service.href}>
                  <Card className={`h-full transition-all ${cardStyles[variation]}`}>
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


        {/* Property Gallery Section */}
        {neighborhoodImagesData && neighborhoodImagesData.galleryImages.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <SectionHeading label="ОБЪЕКТЫ" title={`Обрабатываем все типы объектов ${locationText}`} align="left" />
              <p className="text-muted-foreground mb-8 max-w-2xl">
                От старого фонда до элитной недвижимости — гарантируем результат для любого типа помещений
              </p>
              
              {/* Gallery Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {neighborhoodImagesData.galleryImages.map((image, index) => (
                  <div 
                    key={index} 
                    className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={image.url}
                        alt={`${image.title} - дезинфекция ${locationText}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-semibold text-lg mb-1">{image.title}</h3>
                      <div className="flex items-center text-white/80 text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Обработка от 2500₽
                      </div>
                    </div>
                    
                    {/* Category badge */}
                    <Badge className="absolute top-4 right-4" variant="secondary">
                      {getCategoryLabel(image.category)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Расширенный контент для района */}
        {extendedContent && (
          <>
            {/* Введение с фоном */}
            <section className="py-12 bg-primary/5">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  <SectionHeading label="О РАЙОНЕ" title={`Дезинфекция и дезинсекция в районе ${extendedContent.name}`} align="left" />
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {extendedContent.intro}
                  </p>
                </div>
              </div>
            </section>

            {/* Почему мы */}
            <section className="py-12">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  <SectionHeading label="ПОЧЕМУ МЫ" title={`Почему выбирают нас ${locationText}`} align="left" />
                  <div className="grid md:grid-cols-2 gap-4">
                    {extendedContent.whyUs.map((reason, index) => (
                      <div 
                        key={index}
                        className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Зона покрытия */}
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

            {/* Преимущества */}
            <section className="py-12">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold mb-6">Наши преимущества</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {extendedContent.advantages.map((advantage, index) => (
                      <div 
                        key={index}
                        className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg"
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

        {/* Object Types Grid */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <SectionHeading label="ОБЪЕКТЫ" title={`Выберите тип объекта ${locationText}`} align="left" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: 'Квартира', icon: Home, slug: 'kvartir' },
                { name: 'Частный дом', icon: Home, slug: 'domov' },
                { name: 'Офис', icon: Building2, slug: 'ofisov' },
                { name: 'Ресторан / кафе', icon: UtensilsCrossed, slug: 'restoranov' },
                { name: 'Склад', icon: Warehouse, slug: 'skladov' },
                { name: 'Производство', icon: Factory, slug: 'proizvodstv' },
              ].map((obj) => (
                <Link key={obj.slug} to={`/uslugi/dezinsekciya/${obj.slug}`}>
                  <Card className="h-full hover:shadow-md transition-all hover:-translate-y-1">
                    <CardContent className="p-5 flex flex-col items-center text-center gap-2">
                      <obj.icon className="w-8 h-8 text-primary" />
                      <h3 className="font-semibold text-sm">{obj.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Pests */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <SectionHeading label="ВРЕДИТЕЛИ" title={`Популярные вредители ${locationText}`} align="left" />
            <div className="flex flex-wrap gap-3">
              {[
                { name: 'Клопы', slug: 'klopy', emoji: '🪳' },
                { name: 'Тараканы', slug: 'tarakany', emoji: '🪳' },
                { name: 'Грызуны', slug: 'myshi', emoji: '🐀' },
                { name: 'Муравьи', slug: 'muravi', emoji: '🐜' },
                { name: 'Моль', slug: 'mol', emoji: '🦋' },
              ].map((pest) => (
                <Link key={pest.slug} to={`/uslugi/dezinsekciya/${pest.slug}`}>
                  <Badge variant="secondary" className="text-sm py-2.5 px-5 cursor-pointer hover:bg-primary/10 transition-colors">
                    <span className="mr-1.5">{pest.emoji}</span>
                    {pest.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Related Blog Articles */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <SectionHeading label="ПОЛЕЗНЫЕ МАТЕРИАЛЫ" title={`Статьи для жителей ${locationText}`} align="left" />
            <div className="grid md:grid-cols-3 gap-4">
              {allBlogArticles
                .filter(a => ['Советы', 'Дезинсекция', 'Законы'].includes(a.category))
                .slice(0, 3)
                .map((article) => (
                  <Link key={article.slug} to={`/blog/${article.slug}`}>
                    <Card className="h-full hover:shadow-md transition-all hover:-translate-y-1">
                      <CardContent className="p-5">
                        <Badge variant="secondary" className="mb-2 text-xs">{article.category}</Badge>
                        <h3 className="font-semibold text-sm leading-snug mb-1">{article.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{article.excerpt}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* Landmarks */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <SectionHeading label="ОРИЕНТИРЫ" title={`Известные места ${locationText}`} align="left" />
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
              <SectionHeading label="УЛИЦЫ" title="Улицы, которые мы обслуживаем" align="left" />
              <p className="text-muted-foreground mb-4">
                Мы уже работали на этих улицах {locationText}:
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
            <SectionHeading label="ПРЕИМУЩЕСТВА" title={`Почему выбирают нас ${locationText}`} align="left" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2">
                <CardContent className="p-6">
                  <Clock className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-bold text-lg mb-2">Быстрый выезд</h3>
                  <p className="text-muted-foreground">
                    Приезжаем {locationText} за {neighborhood.responseTime}. 
                    Работаем круглосуточно без выходных.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="p-6">
                  <Shield className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-bold text-lg mb-2">Гарантия результата</h3>
                  <p className="text-muted-foreground">
                    Даём гарантию до 3 лет на все виды работ. 
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
            <SectionHeading label="ВОПРОСЫ И ОТВЕТЫ" title={`Частые вопросы о дезинфекции ${locationText}`} align="left" />
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
            <VariableHeading 
              slug={variationSlug} 
              category="cta" 
              level="h2" 
              className="text-2xl md:text-3xl font-bold mb-4"
              fallback={`Вызвать дезинфектора ${locationText}`}
            />
            <p className="text-lg mb-8 opacity-90">
              Выезд за {neighborhood.responseTime} • Гарантия до 3 лет • От {1000 + neighborhood.surcharge}₽
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <a href={`tel:${SEO_CONFIG.phoneClean}`}>
                  <Phone className="w-5 h-5 mr-2" />
                  {SEO_CONFIG.phone}
                </a>
              </Button>
              <VariableCTA 
                slug={variationSlug} 
                onClick={() => setIsCalculatorOpen(true)}
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                fallback="Рассчитать стоимость"
              />
            </div>
          </div>
        </section>

        {/* Sibling Neighborhoods */}
        {siblingNeighborhoods.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <SectionHeading label="СОСЕДНИЕ РАЙОНЫ" title={`Другие районы ${parentDistrict?.name || 'округа'}`} align="left" />
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

        {/* Internal Links for SEO */}
        <InternalLinks
          currentNeighborhood={neighborhood.slug}
          currentService="dezinsekciya"
          title="Услуги в других районах Москвы"
          maxLinks={12}
        />
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
