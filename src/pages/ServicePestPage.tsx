/**
 * Шаблон страницы: Услуга + Вредитель
 * URL: /uslugi/dezinsekciya/tarakany, /uslugi/deratizaciya/krysy
 */

import { useParams, Link } from 'react-router-dom';
import NotFound from './NotFound';
import SEOHead from '@/components/SEOHead';
import type { PageMetadata } from '@/lib/metadata';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import AnimatedSection from '@/components/AnimatedSection';
import InternalLinks from '@/components/InternalLinks';
import ServiceQuiz from '@/components/ServiceQuiz';
import ServiceTariffs from '@/components/ServiceTariffs';
import WhyProblemReturns from '@/components/WhyProblemReturns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Phone, Clock, Shield, CheckCircle, AlertTriangle, MapPin, ChevronRight } from 'lucide-react';
import { getPestBySlug, pests } from '@/data/pests';
import { IconFromKey, getIconKeyFromEmoji } from '@/lib/iconMap';
import { getPestImage } from '@/data/pestImages';
import { servicePages, getRelatedArticlesForPest } from '@/data/services';
import { topNeighborhoods } from '@/data/nchSeeds';
import { neighborhoods } from '@/data/neighborhoods';
import { SEO_CONFIG, generateSEOMeta } from '@/lib/seo';
import ServiceStickyBar from '@/components/ServiceStickyBar';
import HeroCallbackForm from '@/components/HeroCallbackForm';
import LazySection from '@/components/LazySection';

export default function ServicePestPage() {
  const params = useParams<{ service?: string; pest?: string; parentSlug?: string; subSlug?: string }>();
  const service = params.service || params.parentSlug;
  const pestSlug = params.pest || params.subSlug;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [service, pestSlug]);
  
  const validServices = ['dezinsekciya', 'deratizaciya'];
  if (!service || !validServices.includes(service) || !pestSlug) {
    return <NotFound />;
  }
  
  const pest = getPestBySlug(pestSlug);
  const serviceData = servicePages.find(s => s.slug === service);
  const pestImage = getPestImage(pestSlug);
  
  if (!pest || !serviceData || pest.serviceType !== service) {
    return <NotFound />;
  }
  
  const guaranteeText = pest.guaranteeYears || 'до 1 года';
  
  // SEO
  const serviceName = service === 'dezinsekciya' ? 'Дезинсекция' : 'Дератизация';
  const pageTitle = `Уничтожение ${pest.genitive} в Москве от ${pest.priceFrom}₽ — ${SEO_CONFIG.companyName}`;
  const pageDescription = `${serviceName} ${pest.genitive} в Москве и МО от ${pest.priceFrom}₽ • Выезд за 1 час • Гарантия ${guaranteeText} • ${pest.shortDescription} • ${SEO_CONFIG.phone}`;
  const canonicalPath = `/uslugi/${service}/${pestSlug}`;
  const seoMeta = generateSEOMeta(canonicalPath, pageTitle, pageDescription);
  
  const breadcrumbItems = [
    { label: 'Услуги', href: '/uslugi/dezinsekciya' },
    { label: serviceName, href: `/uslugi/${service}` },
    { label: pest.name }
  ];
  
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
    areaServed: { '@type': 'City', name: 'Москва' },
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

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://goruslugimsk.ru' },
      { '@type': 'ListItem', position: 2, name: serviceName, item: `https://goruslugimsk.ru/uslugi/${service}` },
      { '@type': 'ListItem', position: 3, name: pest.name, item: `https://goruslugimsk.ru${canonicalPath}` }
    ]
  };

  const metadata: PageMetadata = {
    title: seoMeta.title,
    description: seoMeta.description,
    canonical: seoMeta.canonical,
    ogTitle: seoMeta.ogTitle,
    ogDescription: seoMeta.ogDescription,
    ogImage: seoMeta.ogImage,
    schema: [schemaMarkup, faqSchema, breadcrumbSchema],
  };
  
  const topNeighborhoodData = topNeighborhoods.slice(0, 8).map(slug => 
    neighborhoods.find(n => n.slug === slug)
  ).filter(Boolean);
  
  return (
    <>
      <SEOHead metadata={metadata} pagePath={canonicalPath} />
      
      <Header />
      
      <main className="min-h-screen pt-16 pb-16 md:pb-0">
        {/* Hero Section */}
        <section className="relative py-12 md:py-16 min-h-[60vh] overflow-hidden">
          {pestImage && (
            <>
              <div className="absolute inset-0 bg-primary/5" aria-hidden="true" />
              <style dangerouslySetInnerHTML={{ __html: `
                .pest-hero-bg {
                  filter: blur(1px);
                  opacity: 0.95;
                  transform: scale(1.05);
                }
                @media (min-width: 768px) {
                  .pest-hero-bg {
                    filter: blur(3px);
                    opacity: 0.65;
                    transform: scale(1.05);
                  }
                }
              `}} />
              <div 
                className="absolute inset-0 bg-cover bg-center pest-hero-bg"
                style={{ backgroundImage: `url('${pestImage.image}')` }}
                role="img"
                aria-label={pestImage.altText}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-background/35 to-background/30" />
              <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/30" />
            </>
          )}
          {!pestImage && (
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background" />
          )}
          
          <div className="container mx-auto px-4 relative z-10">
            <Breadcrumbs items={breadcrumbItems} />
            
            <div className="mt-6 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <IconFromKey iconKey={getIconKeyFromEmoji(pest.icon)} className="w-7 h-7 text-primary" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    pest.dangerLevel === 'high' ? 'bg-destructive/10 text-destructive' :
                    pest.dangerLevel === 'medium' ? 'bg-warning/10 text-warning' :
                    'bg-success/10 text-success'
                  }`}>
                    {pest.dangerLevel === 'high' ? 'Высокая опасность' :
                     pest.dangerLevel === 'medium' ? 'Средняя опасность' : 'Низкая опасность'}
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  Уничтожение {pest.genitive} в Москве
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground mb-4">
                  {pest.description}
                </p>

                {/* Hero Bullets */}
                {pest.heroBullets && pest.heroBullets.length > 0 && (
                  <ul className="space-y-2 mb-6">
                    {pest.heroBullets.map((bullet, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm md:text-base">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>Результат за {pest.timeToResult}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-5 h-5 text-primary" />
                    <span>Гарантия {guaranteeText}</span>
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

                <HeroCallbackForm serviceSlug={`${service}/${pestSlug}`} />
              </div>
              
              {pestImage && (
                <div className="hidden md:block">
                  <div className="relative rounded-2xl overflow-hidden shadow-xl bg-background/80 backdrop-blur-sm">
                    <img 
                      src={pestImage.image}
                      alt={pestImage.altText}
                      className="w-full h-64 md:h-80 object-cover"
                      loading="eager"
                      width="400"
                      height="320"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex items-center gap-2 text-white">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="font-semibold">Избавим за 1 день!</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Quiz */}
        <LazySection minHeight="400px">
          {pest.quizSteps && pest.quizSteps.length > 0 && (
            <ServiceQuiz
              steps={pest.quizSteps}
              serviceSlug={`${service}/${pestSlug}`}
              serviceTitle={`Уничтожение ${pest.genitive}`}
            />
          )}
        </LazySection>

        {/* Tariffs */}
        <LazySection minHeight="300px">
          {pest.tariffs && pest.tariffs.length > 0 && (
            <ServiceTariffs
              tariffs={pest.tariffs}
              serviceTitle={`Уничтожение ${pest.genitive}`}
            />
          )}
        </LazySection>
        
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
        
        {/* Signs */}
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

        {/* WhyProblemReturns */}
        <LazySection minHeight="250px">
          {pest.returnReasons && pest.returnReasons.length > 0 && (
            <WhyProblemReturns
              returnReasons={pest.returnReasons}
              serviceTitle={`Уничтожение ${pest.genitive}`}
            />
          )}
        </LazySection>
        
        {/* Prevention */}
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
        
        {/* FAQ */}
        <LazySection minHeight="300px">
          <AnimatedSection className="py-12">
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
                      Да, мы предоставляем гарантию {guaranteeText}. При повторном появлении вредителей в гарантийный период проводим повторную обработку бесплатно.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </AnimatedSection>
        </LazySection>

        {/* SEO Accordion */}
        <LazySection minHeight="80px">
          {pest.seoText && (
            <AnimatedSection className="py-12 bg-muted/30">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="seo">
                      <AccordionTrigger className="text-xl font-bold">
                        Подробнее об уничтожении {pest.genitive}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
                          {pest.seoText.split('\n').map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </AnimatedSection>
          )}
        </LazySection>

        {/* Полезные статьи по теме */}
        {(() => {
          const relatedArticles = getRelatedArticlesForPest(pestSlug);
          if (!relatedArticles.length) return null;
          return (
            <AnimatedSection className="py-12 bg-muted/30">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
                  Полезные статьи по теме
                </h2>
                <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
                  Читайте материалы для более глубокого понимания вопроса
                </p>
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {relatedArticles.map((article) => (
                    <Link
                      key={article.slug}
                      to={`/blog/${article.slug}`}
                      className="group"
                    >
                      <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card">
                        <CardContent className="p-5">
                          <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                            {article.category}
                          </span>
                          <h3 className="text-lg font-bold mt-3 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{article.readTime}</span>
                            <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                              Читать <ChevronRight className="w-4 h-4" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          );
        })()}
        
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
        <ServiceStickyBar />
      </main>
      
      <Footer />
    </>
  );
}
