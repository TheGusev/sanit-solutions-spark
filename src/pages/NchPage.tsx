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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Phone, Clock, Shield, CheckCircle, MapPin, Star, AlertTriangle, Award } from 'lucide-react';
import { getPestBySlug } from '@/data/pests';
import { neighborhoods } from '@/data/neighborhoods';
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
  const { service, pest: pestSlug, neighborhood: neighborhoodSlug } = useParams<{
    service: string;
    pest: string;
    neighborhood: string;
  }>();
  
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
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-10 md:py-14">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={breadcrumbItems} />
            
            <div className="mt-6 max-w-4xl">
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
