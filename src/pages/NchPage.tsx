/**
 * Шаблон НЧ-страницы: Услуга + Вредитель + Район
 * URL: /uslugi/dezinsekciya/tarakany/arbat
 * 
 * SEO: Уничтожение тараканов в Арбат — от 1200₽, выезд 30 мин
 * Контент: 650-800 слов, уникальный для каждой комбинации
 */

import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import AnimatedSection from '@/components/AnimatedSection';
import InternalLinks from '@/components/InternalLinks';
import { generateLocalBusiness } from '@/components/StructuredData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Phone, Clock, Shield, CheckCircle, MapPin, Star, AlertTriangle, Award } from 'lucide-react';
import { getPestBySlug } from '@/data/pests';
import { getPestImage } from '@/data/pestImages';
import { neighborhoods } from '@/data/neighborhoods';
import { getNeighborhoodHeroImage } from '@/data/neighborhoodImages';
import { SEO_CONFIG, generateSEOMeta } from '@/lib/seo';
import {
  generateIntro, 
  generateLocalFeatures, 
  generateWhyFolkMethodsDontWork,
  generateGuaranteeText,
  generateFAQ,
  generateFAQSchema
} from '@/lib/contentGenerator';

export default function NchPage() {
  // Поддержка как старых параметров (pest, neighborhood), так и новых (segment2, segment3)
  const params = useParams<{
    service?: string;
    pest?: string;
    neighborhood?: string;
    segment2?: string;
    segment3?: string;
  }>();
  
  const service = params.service;
  const pestSlug = params.pest || params.segment2;
  const neighborhoodSlug = params.neighborhood || params.segment3;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [service, pestSlug, neighborhoodSlug]);
  
  // Валидация
  const validServices = ['dezinsekciya', 'deratizaciya'];
  if (!service || !validServices.includes(service) || !pestSlug || !neighborhoodSlug) {
    return <Navigate to="/404" replace />;
  }
  
  const pest = getPestBySlug(pestSlug);
  const neighborhood = neighborhoods.find(n => n.slug === neighborhoodSlug);
  const pestImage = getPestImage(pestSlug);
  
  if (!pest || !neighborhood || pest.serviceType !== service) {
    return <Navigate to="/404" replace />;
  }
  
  // SEO - оптимизированные лимиты (Title: 40-60, Description: 140-160)
  const serviceName = service === 'dezinsekciya' ? 'Дезинсекция' : 'Дератизация';
  
  // Title: ~55 символов
  const pageTitle = `${pest.name} в ${neighborhood.name} — от ${pest.priceFrom}₽ | Выезд 30 мин`;
  
  // Description: ~155 символов  
  const pageDescription = `Уничтожение ${pest.genitive} в ${neighborhood.name} от ${pest.priceFrom}₽. Выезд за 30 мин, гарантия 1 год. Безопасные препараты. ☎️ ${SEO_CONFIG.phone}`;
  
  const canonicalPath = `/uslugi/${service}/${pestSlug}/${neighborhoodSlug}`;
  const seoMeta = generateSEOMeta(canonicalPath, pageTitle, pageDescription);
  
  // Breadcrumbs
  const breadcrumbItems = [
    { label: 'Услуги', href: `/uslugi/${service}` },
    { label: serviceName, href: `/uslugi/${service}` },
    { label: pest.name, href: `/uslugi/${service}/${pestSlug}` },
    { label: neighborhood.name }
  ];
  
  // Контекст для генерации контента
  const districtName = neighborhood.districtId.toUpperCase();
  const responseTime = neighborhood.responseTime || (districtName.includes('ЦАО') ? '30-45 мин' : '40-60 мин');
  
  const contentContext = {
    service: service as 'dezinsekciya' | 'deratizaciya',
    pest,
    neighborhoodName: neighborhood.name,
    districtId: neighborhood.districtId,
    responseTime,
    priceFrom: pest.priceFrom,
  };
  
  // Генерация контента
  const introText = generateIntro(contentContext);
  const localFeatures = generateLocalFeatures(contentContext);
  const whyFolkMethodsDontWork = generateWhyFolkMethodsDontWork(contentContext);
  const guaranteeText = generateGuaranteeText(contentContext);
  const faqItems = generateFAQ(contentContext);
  
  // Schema.org
  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Уничтожение ${pest.genitive} в ${neighborhood.name}`,
    description: `Профессиональная ${serviceName.toLowerCase()} ${pest.genitive} в районе ${neighborhood.name}. Выезд за 30-60 минут, гарантия до 1 года.`,
    provider: {
      '@type': 'LocalBusiness',
      name: SEO_CONFIG.companyName,
      telephone: SEO_CONFIG.phone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Москва',
        addressRegion: neighborhood.name
      }
    },
    areaServed: {
      '@type': 'Place',
      name: `Район ${neighborhood.name}, Москва`
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
  
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: SEO_CONFIG.baseUrl },
      { '@type': 'ListItem', position: 2, name: serviceName, item: `${SEO_CONFIG.baseUrl}/uslugi/${service}` },
      { '@type': 'ListItem', position: 3, name: pest.name, item: `${SEO_CONFIG.baseUrl}/uslugi/${service}/${pestSlug}` },
      { '@type': 'ListItem', position: 4, name: neighborhood.name, item: seoMeta.canonical }
    ]
  };
  
  const faqSchema = generateFAQSchema(faqItems);
  
  const localBusinessSchema = generateLocalBusiness(
    `${serviceName} от ${pest.genitive}`,
    neighborhood.name,
    neighborhoodSlug,
    service
  );
  
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
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen">
        {/* Hero Section с комбинированным фоном */}
        <section className="relative py-10 md:py-14 min-h-[45vh] overflow-hidden">
          {/* СЛОЙ 1: Изображение вредителя */}
          {pestImage && (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url('${pestImage.image}')`,
                filter: 'blur(8px)',
                transform: 'scale(1.1)',
                opacity: 0.06
              }}
              aria-hidden="true"
            />
          )}
          
          {/* СЛОЙ 2: Изображение района (слабее) */}
          <div 
            className="absolute inset-0 bg-cover bg-right"
            style={{ 
              backgroundImage: `url('${getNeighborhoodHeroImage(neighborhoodSlug)}')`,
              filter: 'blur(10px)',
              transform: 'scale(1.1)',
              opacity: 0.03
            }}
            aria-hidden="true"
          />
          
          {/* Градиентные overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/60" />
          
          {/* Fallback если нет изображения */}
          {!pestImage && (
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background" />
          )}
          
          <div className="container mx-auto px-4 relative z-10">
            <Breadcrumbs items={breadcrumbItems} />
            
            <div className="mt-6 grid md:grid-cols-3 gap-8 items-start">
              {/* Текстовый блок - 2/3 ширины */}
              <div className="md:col-span-2">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-3xl">{pest.icon}</span>
                  <span className="px-3 py-1 bg-primary/10 rounded-full text-sm font-medium">
                    {districtName}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Выезд {responseTime}
                  </span>
                </div>
                
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                  Уничтожение {pest.genitive} в районе {neighborhood.name}
                </h1>
                
                <p className="text-lg text-muted-foreground mb-6">
                  {introText}
                </p>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>Выезд за {responseTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-5 h-5 text-primary" />
                    <span>Гарантия 1 год</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>{neighborhood.name}, {districtName}</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" asChild className="whitespace-normal">
                    <a href={`tel:${SEO_CONFIG.phoneClean}`}>
                      <Phone className="w-5 h-5 mr-2" />
                      {SEO_CONFIG.phone}
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="whitespace-normal">
                    <Link to="/#calculator">Рассчитать стоимость</Link>
                  </Button>
                </div>
              </div>
              
              {/* Изображение вредителя - 1/3 ширины */}
              {pestImage && (
                <div className="hidden md:block">
                  <div className="relative rounded-2xl overflow-hidden shadow-lg bg-background/80 backdrop-blur-sm">
                    <img 
                      src={pestImage.image}
                      alt={pestImage.altText}
                      className="w-full h-56 object-cover"
                      loading="eager"
                      width="300"
                      height="224"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <div className="flex items-center gap-2 text-white text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="font-medium">Избавим за 1 день!</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Price & Features */}
        <AnimatedSection className="py-10 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Price Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Стоимость в {neighborhood.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">
                    от {pest.priceFrom}₽
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Выезд в {neighborhood.name} — бесплатно
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Диагностика включена
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Гарантия до 1 года
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Безопасные препараты IV класса
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              {/* Local Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Почему мы в {neighborhood.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {localFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </AnimatedSection>
        
        {/* About the problem in this area */}
        <AnimatedSection className="py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose prose-sm">
              <h2 className="text-xl font-bold mb-4">
                {pest.name} в районе {neighborhood.name}: особенности и решения
              </h2>
              <p>
                Район {neighborhood.name} ({districtName}) — {neighborhood.description || 'один из районов Москвы с разнообразной застройкой'}. 
                {pest.namePlural} часто появляются в многоквартирных домах, особенно на первых этажах и в старом жилом фонде.
              </p>
              <p>
                {pest.description} Чтобы полностью избавиться от {pest.genitive}, необходима профессиональная обработка 
                с использованием современных препаратов.
              </p>
              <h3 className="text-lg font-semibold mt-6 mb-3">Как мы работаем в {neighborhood.name}</h3>
              <ol className="list-decimal pl-4 space-y-2">
                <li><strong>Заявка:</strong> Вы звоните или оставляете заявку на сайте</li>
                <li><strong>Выезд:</strong> Мастер приезжает в {neighborhood.name} за {responseTime}</li>
                <li><strong>Диагностика:</strong> Осмотр помещения, определение степени заражения</li>
                <li><strong>Обработка:</strong> Применяем {pest.methods.join(', ')}</li>
                <li><strong>Гарантия:</strong> Даём гарантию до 1 года на все работы</li>
              </ol>
              <p className="mt-4">
                Результат заметен через {pest.timeToResult}. При необходимости проводим повторную обработку бесплатно.
              </p>
            </div>
          </div>
        </AnimatedSection>
        
        {/* Why folk methods don't work */}
        <AnimatedSection className="py-10 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">
                    Почему народные методы не помогают от {pest.genitive}
                  </h2>
                  <div className="text-muted-foreground whitespace-pre-line">
                    {whyFolkMethodsDontWork}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
        
        {/* Signs */}
        <AnimatedSection className="py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-bold mb-6 text-center">
              Признаки появления {pest.genitive}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {pest.signs.slice(0, 4).map((sign, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{sign}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
        
        {/* Guarantee */}
        <AnimatedSection className="py-10 bg-green-50 dark:bg-green-950/20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold mb-4">Наша гарантия</h2>
              <p className="text-muted-foreground">
                {guaranteeText}
              </p>
            </div>
          </div>
        </AnimatedSection>
        
        {/* FAQ */}
        <AnimatedSection className="py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-bold mb-6 text-center">Вопросы и ответы</h2>
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
        <AnimatedSection className="py-10 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-xl md:text-2xl font-bold mb-3">
              Закажите обработку в {neighborhood.name}
            </h2>
            <p className="opacity-90 mb-4">
              Выезд за {responseTime}. Гарантия 1 год. Безопасно для людей и животных.
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
          currentNeighborhood={neighborhoodSlug}
          title="Смотрите также"
        />
      </main>
      
      <Footer />
    </>
  );
}
