/**
 * Шаблон страницы: Услуга + Объект + Район
 * URL: /uslugi/dezinsekciya/kvartir/arbat
 */

import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import AnimatedSection from '@/components/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Phone, Clock, Shield, CheckCircle, MapPin, Star, Building, Award, Ruler } from 'lucide-react';
import InternalLinks from '@/components/InternalLinks';
import { generateLocalBusiness } from '@/components/StructuredData';
import { getObjectBySlug } from '@/data/objects';
import { neighborhoods } from '@/data/neighborhoods';
import { servicePages } from '@/data/services';
import { SEO_CONFIG, generateSEOMeta } from '@/lib/seo';
import { generateLocalFeatures } from '@/lib/contentGenerator';

export default function ServiceObjectDistrictPage() {
  // Поддержка как старых параметров (object, district), так и новых (segment2, segment3)
  const params = useParams<{
    service?: string;
    object?: string;
    district?: string;
    segment2?: string;
    segment3?: string;
  }>();
  
  const serviceSlug = params.service;
  const objectSlug = params.object || params.segment2;
  const districtSlug = params.district || params.segment3;
  
  useEffect(() => { window.scrollTo(0, 0); }, [serviceSlug, objectSlug, districtSlug]);
  
  const validServices = ['dezinsekciya', 'dezinfekciya', 'deratizaciya', 'ozonirovanie'];
  if (!serviceSlug || !validServices.includes(serviceSlug) || !objectSlug || !districtSlug) {
    return <Navigate to="/404" replace />;
  }
  
  const objectType = getObjectBySlug(objectSlug);
  const neighborhood = neighborhoods.find(n => n.slug === districtSlug);
  const service = servicePages.find(s => s.slug === serviceSlug);
  
  if (!objectType || !neighborhood || !service) {
    return <Navigate to="/404" replace />;
  }
  
  const serviceName = service.title;
  const priceFrom = Math.round((service.priceFrom || 1500) * objectType.priceMultiplier);
  const districtName = neighborhood.districtId?.toUpperCase() || '';
  const responseTime = neighborhood.responseTime || (districtName.includes('ЦАО') ? '30-45 мин' : '40-60 мин');
  
  const pageTitle = `${serviceName} ${objectType.genitive} в ${neighborhood.name} — от ${priceFrom}₽`;
  const pageDescription = `${serviceName} ${objectType.genitive} в ${neighborhood.name} от ${priceFrom}₽. Выезд ${responseTime}, гарантия 1 год. ☎️ ${SEO_CONFIG.phone}`;
  const seoMeta = generateSEOMeta(`/uslugi/${serviceSlug}/${objectSlug}/${districtSlug}`, pageTitle, pageDescription);
  
  const breadcrumbItems = [
    { label: 'Услуги', href: `/uslugi/${serviceSlug}` },
    { label: serviceName, href: `/uslugi/${serviceSlug}` },
    { label: objectType.namePlural, href: `/uslugi/${serviceSlug}/${objectSlug}` },
    { label: neighborhood.name }
  ];
  
  const localFeatures = generateLocalFeatures({
    service: serviceSlug as 'dezinsekciya' | 'deratizaciya' | 'dezinfekciya',
    neighborhoodName: neighborhood.name,
    districtId: neighborhood.districtId,
    responseTime,
    priceFrom,
  });
  
  const faqItems = [
    { question: `Сколько стоит ${serviceName.toLowerCase()} ${objectType.genitive} в ${neighborhood.name}?`, answer: `От ${priceFrom}₽ (${objectType.minArea}-${objectType.maxArea} м²). Выезд бесплатно.` },
    { question: `Как быстро приедет мастер?`, answer: `В ${neighborhood.name} за ${responseTime}. Работаем без выходных.` },
    { question: `Как подготовить ${objectType.accusative}?`, answer: `Обеспечьте доступ к плинтусам, уберите продукты, выведите людей на ${objectType.averageTime}.` },
    { question: `Даёте гарантию?`, answer: `Да, до 1 года. Повторная обработка бесплатно.` }
  ];
  
  const schemaMarkup = {
    '@context': 'https://schema.org', '@type': 'Service',
    name: `${serviceName} ${objectType.genitive} в ${neighborhood.name}`,
    description: `${serviceName} ${objectType.genitive} в районе ${neighborhood.name}. Выезд ${responseTime}, гарантия 1 год.`,
    provider: { '@type': 'LocalBusiness', name: SEO_CONFIG.companyName, telephone: SEO_CONFIG.phone },
    areaServed: { '@type': 'Place', name: `${neighborhood.name}, Москва` },
    offers: { '@type': 'Offer', priceSpecification: { '@type': 'PriceSpecification', price: priceFrom, priceCurrency: 'RUB' } }
  };
  
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } }))
  };
  
  const localBusinessSchema = generateLocalBusiness(
    `${serviceName} ${objectType.genitive}`,
    neighborhood.name,
    districtSlug,
    serviceSlug
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
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen">
        <section className="bg-gradient-to-b from-primary/5 to-background py-10 md:py-14">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="mt-6 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-3xl">{objectType.icon}</span>
                <span className="px-3 py-1 bg-primary/10 rounded-full text-sm font-medium">{districtName}</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Выезд {responseTime}</span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">{serviceName} {objectType.genitive} в районе {neighborhood.name}</h1>
              <p className="text-lg text-muted-foreground mb-6">Профессиональная {serviceName.toLowerCase()} {objectType.genitive} в {neighborhood.name}. Площадь {objectType.minArea}-{objectType.maxArea} м².</p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm"><Clock className="w-5 h-5 text-primary" /><span>Выезд за {responseTime}</span></div>
                <div className="flex items-center gap-2 text-sm"><Shield className="w-5 h-5 text-primary" /><span>Гарантия 1 год</span></div>
                <div className="flex items-center gap-2 text-sm"><MapPin className="w-5 h-5 text-primary" /><span>{neighborhood.name}</span></div>
                <div className="flex items-center gap-2 text-sm"><Ruler className="w-5 h-5 text-primary" /><span>{objectType.minArea}-{objectType.maxArea} м²</span></div>
              </div>
              <Button size="lg" asChild><a href={`tel:${SEO_CONFIG.phoneClean}`}><Phone className="w-5 h-5 mr-2" />{SEO_CONFIG.phone}</a></Button>
            </div>
          </div>
        </section>
        
        <AnimatedSection className="py-10 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500" />Стоимость в {neighborhood.name}</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">от {priceFrom}₽</div>
                  <ul className="space-y-2 text-sm">
                    {[`Выезд в ${neighborhood.name} — бесплатно`, 'Диагностика включена', 'Гарантия до 1 года', 'Безопасные препараты IV класса'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" />Почему мы в {neighborhood.name}</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {localFeatures.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />{feature}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </AnimatedSection>
        
        <AnimatedSection className="py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-bold mb-6 flex items-center justify-center gap-2"><Building className="w-6 h-6 text-primary" />Особенности работы с {objectType.namePlural.toLowerCase()}</h2>
            <div className="grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
              {objectType.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" /><span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
        
        <AnimatedSection className="py-10 bg-green-50 dark:bg-green-950/20">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <Award className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-4">Наша гарантия</h2>
            <p className="text-muted-foreground">Гарантия до 1 года на {serviceName.toLowerCase()} {objectType.genitive} в {neighborhood.name}. Повторная обработка бесплатно.</p>
          </div>
        </AnimatedSection>
        
        <AnimatedSection className="py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-bold mb-6 text-center">Вопросы и ответы</h2>
            <div className="max-w-2xl mx-auto">
              <Accordion type="single" collapsible>
                {faqItems.map((item, i) => (
                  <AccordionItem key={i} value={`q${i}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </AnimatedSection>
        
        <AnimatedSection className="py-10 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-xl md:text-2xl font-bold mb-3">Закажите {serviceName.toLowerCase()} {objectType.genitive} в {neighborhood.name}</h2>
            <p className="opacity-90 mb-4">Выезд за {responseTime}. Гарантия 1 год.</p>
            <Button size="lg" variant="secondary" asChild><a href={`tel:${SEO_CONFIG.phoneClean}`}><Phone className="w-5 h-5 mr-2" />{SEO_CONFIG.phone}</a></Button>
          </div>
        </AnimatedSection>
        
        <InternalLinks 
          currentService={serviceSlug} 
          currentNeighborhood={districtSlug}
          variant="grid" 
          title="Смотрите также" 
        />
      </main>
      
      <Footer />
    </>
  );
}
