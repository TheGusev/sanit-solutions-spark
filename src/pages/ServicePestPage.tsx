/**
 * Шаблон страницы: Услуга + Вредитель
 * URL: /uslugi/dezinsekciya/tarakany, /uslugi/deratizaciya/krysy
 */

import { useParams, Link } from 'react-router-dom';
import NotFound from './NotFound';
import SEOHead from '@/components/SEOHead';
import type { PageMetadata } from '@/lib/metadata';
import { useEffect, useState } from 'react';
import CalculatorModal from '@/components/CalculatorModal';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import AnimatedSection from '@/components/AnimatedSection';
import RelatedServices from '@/components/RelatedServices';
import RelatedGeoLinks from '@/components/RelatedGeoLinks';
import RelatedBlogLinks from '@/components/RelatedBlogLinks';
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
import { staticReviews } from '@/data/reviews';
import { supabase } from '@/lib/supabaseClient';
import { topNeighborhoods } from '@/data/nchSeeds';
import { neighborhoods } from '@/data/neighborhoods';
import { SEO_CONFIG, generateSEOMeta } from '@/lib/seo';
import ServiceStickyBar from '@/components/ServiceStickyBar';
import HeroCallbackForm from '@/components/HeroCallbackForm';
import LazySection from '@/components/LazySection';
import WorkProcess from '@/components/WorkProcess';
import { Badge } from '@/components/ui/badge';
import { SERVICE_GALLERY, GALLERY_SUBTITLES } from '@/data/serviceGallery';

export default function ServicePestPage() {
  const params = useParams<{ service?: string; pest?: string; parentSlug?: string; subSlug?: string }>();
  const service = params.service || params.parentSlug;
  const pestSlug = params.pest || params.subSlug;
  
  const [showCalculator, setShowCalculator] = useState(false);
  const [reviews, setReviews] = useState(staticReviews);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [service, pestSlug]);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from('public_reviews')
        .select('rating')
        .order('created_at', { ascending: false });
      if (data && data.length > 0) {
        setReviews(data as any);
      }
    };
    fetchReviews();
  }, []);
  
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
  
  const guaranteeText = pest.guaranteeYears || 'до 3 лет';
  
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
  
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : '4.9';
  const reviewCount = reviews.length || staticReviews.length;

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
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avgRating,
      reviewCount: reviewCount,
      bestRating: 5,
      worstRating: 1
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
      { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://goruslugimsk.ru/' },
      { '@type': 'ListItem', position: 2, name: serviceName, item: `https://goruslugimsk.ru/uslugi/${service}/` },
      { '@type': 'ListItem', position: 3, name: pest.name }
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
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 py-12 md:py-20 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <Breadcrumbs items={breadcrumbItems} showSchema={false} />

            <div className="mt-6 grid md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-4 order-1">
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

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 order-2">
                  Уничтожение {pest.genitive} в Москве и МО
                </h1>

                {/* Триколор-разделитель */}
                <div className="flex gap-1 mb-5 order-3">
                  <span className="h-1 w-10 rounded bg-white border border-border" />
                  <span className="h-1 w-10 rounded bg-[#003DA5]" />
                  <span className="h-1 w-10 rounded bg-[#CC0000]" />
                </div>

                {/* МОБИЛЬНОЕ ВИЗУАЛЬНОЕ ДОКАЗАТЕЛЬСТВО — фото вредителя или реальные фото для клопов */}
                {pestSlug === 'klopy' ? (
                  <div className="md:hidden order-4 mb-5">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="relative rounded-xl overflow-hidden shadow-lg aspect-square">
                        <img
                          src="/images/pests/real/bedbug-mattress-real.jpg"
                          alt="Заражённый клопами матрас — реальное фото с объекта в Москве"
                          className="w-full h-full object-cover"
                          loading="eager"
                          width="400"
                          height="400"
                        />
                        <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">До</span>
                      </div>
                      <div className="relative rounded-xl overflow-hidden shadow-lg aspect-square">
                        <img
                          src="/images/pests/real/bedbug-treatment-real.jpg"
                          alt="Специалист обрабатывает квартиру от клопов — наша работа"
                          className="w-full h-full object-cover"
                          loading="eager"
                          width="400"
                          height="400"
                        />
                        <span className="absolute top-2 left-2 bg-success text-success-foreground text-xs font-bold px-2 py-1 rounded">Работа</span>
                      </div>
                    </div>
                    <video
                      className="w-full rounded-xl shadow-lg"
                      style={{ maxHeight: 240 }}
                      muted
                      playsInline
                      autoPlay
                      loop
                      preload="metadata"
                      poster="/videos/bedbug-process-poster.jpg"
                      width="640"
                      height="360"
                    >
                      <source src="/videos/bedbug-process.mp4" type="video/mp4" />
                    </video>
                  </div>
                ) : pestImage ? (
                  <div className="md:hidden order-4 mb-5">
                    <div className="relative rounded-2xl overflow-hidden shadow-xl">
                      <img
                        src={pestImage.image}
                        alt={pestImage.altText}
                        className="w-full h-56 object-cover"
                        loading="eager"
                        width="640"
                        height="360"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <div className="flex items-center gap-2 text-white">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="font-semibold text-sm">Избавим за 1 день!</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                <p className="text-lg md:text-xl text-muted-foreground mb-5 order-5">
                  {pest.description}
                </p>

                {/* Hero Bullets */}
                {pest.heroBullets && pest.heroBullets.length > 0 && (
                  <ul className="space-y-2 mb-6 order-6">
                    {pest.heroBullets.map((bullet, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm md:text-base">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex flex-wrap gap-2 mb-6 order-7">
                  {[
                    { icon: Clock, text: `Результат за ${pest.timeToResult}` },
                    { icon: Shield, text: `Гарантия ${guaranteeText}` },
                    { icon: MapPin, text: 'Москва и МО' },
                  ].map(({ icon: Icon, text }, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm bg-card rounded-lg px-3 py-2 border">
                      <Icon className="w-4 h-4 text-primary" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 order-8">
                  <Button size="lg" asChild className="whitespace-normal">
                    <a href={`tel:${SEO_CONFIG.phoneClean}`}>
                      <Phone className="w-5 h-5 mr-2" />
                      Позвонить: {SEO_CONFIG.phone}
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="whitespace-normal" onClick={() => setShowCalculator(true)}>
                    Рассчитать стоимость
                  </Button>
                </div>

                <div className="order-9">
                  <HeroCallbackForm serviceSlug={`${service}/${pestSlug}`} />
                </div>
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

        {/* Реальные фото с объекта — для клопов на десктопе */}
        {pestSlug === 'klopy' && (
          <AnimatedSection className="hidden md:block py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
                Реальные фото с объекта в Москве
              </h2>
              <p className="text-center text-muted-foreground mb-8">
                Наша работа — без стоковых картинок
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
                  <img
                    src="/images/pests/real/bedbug-mattress-real.jpg"
                    alt="Заражённый клопами матрас — фото до обработки"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width="800"
                    height="600"
                  />
                  <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-sm font-bold px-3 py-1 rounded">До обработки</span>
                </div>
                <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] bg-black">
                  <video
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    autoPlay
                    loop
                    preload="metadata"
                    poster="/videos/bedbug-process-poster.jpg"
                    width="800"
                    height="600"
                  >
                    <source src="/videos/bedbug-process.mp4" type="video/mp4" />
                  </video>
                  <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded">Процесс</span>
                </div>
                <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
                  <img
                    src="/images/pests/real/bedbug-treatment-real.jpg"
                    alt="Специалист обрабатывает квартиру парогенератором от клопов"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width="800"
                    height="600"
                  />
                  <span className="absolute top-3 left-3 bg-success text-success-foreground text-sm font-bold px-3 py-1 rounded">Наша работа</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Галерея «До → Процесс → После» — визуальное доказательство */}
        {(() => {
          const galleryItems = SERVICE_GALLERY[service] || [];
          const gallerySubtitle = GALLERY_SUBTITLES[service] || '';
          if (galleryItems.length === 0) return null;
          return (
            <AnimatedSection className="py-12 md:py-16 bg-muted/30">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
                  Как мы избавляем от {pest.genitive}: до и после
                </h2>
                {gallerySubtitle && (
                  <p className="text-center text-muted-foreground mb-8">{gallerySubtitle}</p>
                )}
                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  {galleryItems.map((item, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="relative">
                        <img
                          src={item.src}
                          alt={item.title}
                          width={800}
                          height={600}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-48 object-cover"
                        />
                        <Badge className={`absolute top-3 left-3 ${item.badgeColor}`}>
                          {item.badge}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          );
        })()}

        {/* Tariffs — цены сразу после галереи */}
        <LazySection minHeight="300px">
          {pest.tariffs && pest.tariffs.length > 0 && (
             <ServiceTariffs
               tariffs={pest.tariffs}
               serviceTitle={`Уничтожение ${pest.genitive}`}
               serviceAccusative={`уничтожение ${pest.genitive}`}
             />
          )}
        </LazySection>

        {/* Signs — диагностика */}
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

        {/* Как мы работаем */}
        <LazySection minHeight="300px">
          <WorkProcess />
        </LazySection>

        {/* Quiz — расчёт после демонстрации процесса */}
        <LazySection minHeight="400px">
          {pest.quizSteps && pest.quizSteps.length > 0 && (
            <ServiceQuiz
              steps={pest.quizSteps}
              serviceSlug={`${service}/${pestSlug}`}
              serviceTitle={`Уничтожение ${pest.genitive}`}
              basePrice={pest.tariffs?.[0]?.price || `от ${pest.priceFrom} ₽`}
            />
          )}
        </LazySection>

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
                      Стоимость начинается от {pest.priceFrom}₽. Итоговая цена зависит от площади помещения, степени заражения и выбранного метода обработки.{' '}
                      <Link to={`/uslugi/${service}/`} className="text-primary hover:underline">Подробнее о ценах на {serviceName.toLowerCase()}</Link>.
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
                      Да, мы используем сертифицированные препараты IV класса опасности (малоопасные). После проветривания помещение полностью безопасно.{' '}
                      <Link to="/blog/kak-podgotovit-pomeshchenie/" className="text-primary hover:underline">Как подготовить помещение к обработке</Link>.
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

        {/* Related Blog Links */}
        <RelatedBlogLinks serviceSlug={service} pestSlug={pestSlug} />
        
        
        {/* Финальный CTA — 2 кнопки как у эталонных лендингов */}
        <AnimatedSection className="py-12 md:py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Закажите уничтожение {pest.genitive} сейчас
            </h2>
            <p className="text-lg opacity-90 mb-6">
              Бесплатный выезд мастера в течение 1 часа по Москве и МО. Работаем 24/7.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" variant="secondary" asChild className="whitespace-normal">
                <a href={`tel:${SEO_CONFIG.phoneClean}`}>
                  <Phone className="w-5 h-5 mr-2" />
                  {SEO_CONFIG.phone}
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="whitespace-normal border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                onClick={() => setShowCalculator(true)}
              >
                Рассчитать стоимость
              </Button>
            </div>
          </div>
        </AnimatedSection>
        
        {/* Related Services */}
        <RelatedServices serviceSlug={service!} pestSlug={pestSlug} />
        
        {/* Geo Links */}
        <RelatedGeoLinks serviceSlug={service} pestSlug={pestSlug} title={`Уничтожение ${pest.genitive} по районам`} />
        <ServiceStickyBar />
      </main>
      
      <Footer />
      <CalculatorModal open={showCalculator} onOpenChange={setShowCalculator} />
    </>
  );
}
