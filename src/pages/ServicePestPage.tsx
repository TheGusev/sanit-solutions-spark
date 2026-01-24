/**
 * Шаблон страницы: Услуга + Вредитель
 * URL: /uslugi/dezinsekciya/tarakany, /uslugi/deratizaciya/krysy
 * 
 * SEO: Уничтожение [вредитель] в Москве от [цена]₽ — Гарантия 1 год
 */

import { useParams, Navigate, Link } from 'react-router-dom';
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
import { Phone, Clock, Shield, CheckCircle, AlertTriangle, MapPin } from 'lucide-react';
import { getPestBySlug, pests } from '@/data/pests';
import { servicePages } from '@/data/services';
import { topNeighborhoods } from '@/data/nchSeeds';
import { neighborhoods } from '@/data/neighborhoods';
import { SEO_CONFIG, generateSEOMeta } from '@/lib/seo';

export default function ServicePestPage() {
  // Поддержка обоих форматов params: старый {service, pest} и новый {parentSlug, subSlug}
  const params = useParams<{ service?: string; pest?: string; parentSlug?: string; subSlug?: string }>();
  const service = params.service || params.parentSlug;
  const pestSlug = params.pest || params.subSlug;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [service, pestSlug]);
  
  // Валидация параметров
  const validServices = ['dezinsekciya', 'deratizaciya'];
  if (!service || !validServices.includes(service) || !pestSlug) {
    return <Navigate to="/404" replace />;
  }
  
  const pest = getPestBySlug(pestSlug);
  const serviceData = servicePages.find(s => s.slug === service);
  
  if (!pest || !serviceData || pest.serviceType !== service) {
    return <Navigate to="/404" replace />;
  }
  
  // SEO
  const serviceName = service === 'dezinsekciya' ? 'Дезинсекция' : 'Дератизация';
  const pageTitle = `Уничтожение ${pest.genitive} в Москве от ${pest.priceFrom}₽ — ${SEO_CONFIG.companyName}`;
  const pageDescription = `${serviceName} ${pest.genitive} в Москве и МО от ${pest.priceFrom}₽ ⚡ Выезд за 1 час ✅ Гарантия до 1 года ✅ ${pest.shortDescription} ☎️ ${SEO_CONFIG.phone}`;
  const canonicalPath = `/uslugi/${service}/${pestSlug}`;
  const seoMeta = generateSEOMeta(canonicalPath, pageTitle, pageDescription);
  
  // Breadcrumbs
  const breadcrumbItems = [
    { label: 'Услуги', href: '/uslugi/dezinsekciya' },
    { label: serviceName, href: `/uslugi/${service}` },
    { label: pest.name }
  ];
  
  // Schema.org
  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Уничтожение ${pest.genitive}`,
    description: pest.description,
    provider: {
      '@type': 'LocalBusiness',
      name: SEO_CONFIG.companyName,
      telephone: SEO_CONFIG.phone,
      url: SEO_CONFIG.baseUrl
    },
    areaServed: {
      '@type': 'City',
      name: 'Москва'
    },
    offers: {
      '@type': 'Offer',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: pest.priceFrom,
        priceCurrency: 'RUB',
        minPrice: pest.priceFrom
      }
    }
  };
  
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Сколько стоит уничтожение ${pest.genitive}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Стоимость уничтожения ${pest.genitive} начинается от ${pest.priceFrom}₽. Итоговая цена зависит от площади помещения и степени заражения.`
        }
      },
      {
        '@type': 'Question',
        name: `Как быстро исчезнут ${pest.namePlural.toLowerCase()}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${pest.namePlural} начинают погибать в первые сутки. Полное уничтожение занимает ${pest.timeToResult}.`
        }
      }
    ]
  };
  
  // Топ-районы для перелинковки
  const topNeighborhoodData = topNeighborhoods.slice(0, 8).map(slug => 
    neighborhoods.find(n => n.slug === slug)
  ).filter(Boolean);
  
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
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-16">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={breadcrumbItems} />
            
            <div className="mt-6 max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{pest.icon}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  pest.dangerLevel === 'high' ? 'bg-red-100 text-red-700' :
                  pest.dangerLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {pest.dangerLevel === 'high' ? 'Высокая опасность' :
                   pest.dangerLevel === 'medium' ? 'Средняя опасность' : 'Низкая опасность'}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Уничтожение {pest.genitive} в Москве
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-6">
                {pest.description}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>Результат за {pest.timeToResult}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Гарантия до 1 года</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Москва и МО</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="whitespace-normal">
                  <a href={`tel:${SEO_CONFIG.phoneClean}`}>
                    <Phone className="w-5 h-5 mr-2" />
                    Позвонить: {SEO_CONFIG.phone}
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild className="whitespace-normal">
                  <Link to="/#calculator">Рассчитать стоимость</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Price Block */}
        <AnimatedSection className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Стоимость уничтожения {pest.genitive}</h2>
              <div className="bg-background rounded-xl p-6 shadow-sm">
                <div className="text-4xl font-bold text-primary mb-2">
                  от {pest.priceFrom}₽
                </div>
                <p className="text-muted-foreground mb-4">
                  Включено: выезд, диагностика, обработка, гарантия
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {pest.methods.map((method, index) => (
                    <span key={index} className="px-3 py-1 bg-primary/10 rounded-full text-sm">
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
        
        {/* Signs Section */}
        <AnimatedSection className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Как понять, что у вас {pest.namePlural.toLowerCase()}?
            </h2>
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {pest.signs.map((sign, index) => (
                <Card key={index}>
                  <CardContent className="flex items-start gap-3 p-4">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>{sign}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </AnimatedSection>
        
        {/* Prevention Section */}
        <AnimatedSection className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Профилактика появления {pest.genitive}
            </h2>
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {pest.prevention.map((tip, index) => (
                <Card key={index}>
                  <CardContent className="flex items-start gap-3 p-4">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </AnimatedSection>
        
        {/* Districts Links */}
        <AnimatedSection className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Уничтожение {pest.genitive} по районам Москвы
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
              {topNeighborhoodData.map((neighborhood) => neighborhood && (
                <Link
                  key={neighborhood.slug}
                  to={`/uslugi/${service}/${pestSlug}/${neighborhood.slug}`}
                  className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors text-center text-sm font-medium"
                >
                  {neighborhood.name}
                </Link>
              ))}
            </div>
            <div className="text-center mt-6">
              <Button variant="outline" asChild>
                <Link to="/rajony">Все районы Москвы →</Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>
        
        {/* FAQ */}
        <AnimatedSection className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Частые вопросы</h2>
            <div className="max-w-2xl mx-auto">
              <Accordion type="single" collapsible>
                <AccordionItem value="q1">
                  <AccordionTrigger>
                    Сколько стоит уничтожение {pest.genitive}?
                  </AccordionTrigger>
                  <AccordionContent>
                    Стоимость начинается от {pest.priceFrom}₽. Итоговая цена зависит от площади помещения, степени заражения и выбранного метода обработки.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q2">
                  <AccordionTrigger>
                    Как быстро исчезнут {pest.namePlural.toLowerCase()}?
                  </AccordionTrigger>
                  <AccordionContent>
                    {pest.namePlural} начинают погибать в первые сутки после обработки. Полное уничтожение популяции занимает {pest.timeToResult}.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q3">
                  <AccordionTrigger>
                    Безопасна ли обработка для детей и животных?
                  </AccordionTrigger>
                  <AccordionContent>
                    Да, мы используем сертифицированные препараты IV класса опасности (малоопасные). После проветривания помещение полностью безопасно.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q4">
                  <AccordionTrigger>
                    Даёте ли гарантию?
                  </AccordionTrigger>
                  <AccordionContent>
                    Да, мы предоставляем гарантию до 1 года. При повторном появлении вредителей в гарантийный период проводим повторную обработку бесплатно.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </AnimatedSection>
        
        {/* CTA */}
        <AnimatedSection className="py-12 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Закажите уничтожение {pest.genitive} сейчас
            </h2>
            <p className="text-lg opacity-90 mb-6">
              Выезд мастера в течение 1 часа. Работаем 24/7.
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
          currentService={service}
          currentPest={pestSlug}
          title="Другие услуги"
        />
      </main>
      
      <Footer />
    </>
  );
}
