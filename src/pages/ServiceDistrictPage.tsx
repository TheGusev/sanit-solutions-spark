/**
 * Шаблон страницы: Услуга + Район
 * URL: /uslugi/dezinsekciya/arbat
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
import { Phone, Clock, Shield, CheckCircle, MapPin, Star } from 'lucide-react';
import { neighborhoods } from '@/data/neighborhoods';
import { servicePages } from '@/data/services';
import { pests } from '@/data/pests';
import { SEO_CONFIG, generateSEOMeta } from '@/lib/seo';
import { generateLocalFeatures } from '@/lib/contentGenerator';

export default function ServiceDistrictPage() {
  const { service: serviceSlug, district: districtSlug } = useParams<{ service: string; district: string }>();
  
  useEffect(() => { window.scrollTo(0, 0); }, [serviceSlug, districtSlug]);
  
  const validServices = ['dezinsekciya', 'dezinfekciya', 'deratizaciya', 'ozonirovanie'];
  if (!serviceSlug || !validServices.includes(serviceSlug) || !districtSlug) {
    return <Navigate to="/404" replace />;
  }
  
  const neighborhood = neighborhoods.find(n => n.slug === districtSlug);
  const service = servicePages.find(s => s.slug === serviceSlug);
  
  if (!neighborhood || !service) {
    return <Navigate to="/404" replace />;
  }
  
  const serviceName = service.title;
  const priceFrom = service.priceFrom || 1500;
  const districtName = neighborhood.districtId?.toUpperCase() || '';
  const responseTime = neighborhood.responseTime || (districtName.includes('ЦАО') ? '30-45 мин' : '40-60 мин');
  
  const pageTitle = `${serviceName} в ${neighborhood.name} — от ${priceFrom}₽ | Выезд ${responseTime}`;
  const pageDescription = `Профессиональная ${serviceName.toLowerCase()} в районе ${neighborhood.name} от ${priceFrom}₽. Гарантия 1 год. ☎️ ${SEO_CONFIG.phone}`;
  const seoMeta = generateSEOMeta(`/uslugi/${serviceSlug}/${districtSlug}`, pageTitle, pageDescription);
  
  const breadcrumbItems = [
    { label: 'Услуги', href: '/uslugi/dezinsekciya' },
    { label: serviceName, href: `/uslugi/${serviceSlug}` },
    { label: neighborhood.name }
  ];
  
  const servicePests = pests.filter(p => p.serviceType === serviceSlug);
  const localFeatures = generateLocalFeatures({
    service: serviceSlug as 'dezinsekciya' | 'deratizaciya' | 'dezinfekciya',
    neighborhoodName: neighborhood.name,
    districtId: neighborhood.districtId,
    responseTime,
    priceFrom,
  });
  
  const faqItems = [
    { question: `Сколько стоит ${serviceName.toLowerCase()} в ${neighborhood.name}?`, answer: `От ${priceFrom}₽. Выезд и диагностика бесплатно.` },
    { question: `Как быстро приедет мастер?`, answer: `В ${neighborhood.name} за ${responseTime}. Работаем без выходных.` },
    { question: `Какие гарантии?`, answer: `Гарантия до 1 года. Повторная обработка бесплатно.` },
    { question: `Безопасно для детей и животных?`, answer: `Да, препараты IV класса опасности. Проветрить 2-3 часа.` }
  ];
  
  const schemaMarkup = {
    '@context': 'https://schema.org', '@type': 'Service',
    name: `${serviceName} в ${neighborhood.name}`,
    description: `${serviceName} в районе ${neighborhood.name}. Выезд ${responseTime}, гарантия 1 год.`,
    provider: { '@type': 'LocalBusiness', name: SEO_CONFIG.companyName, telephone: SEO_CONFIG.phone },
    areaServed: { '@type': 'Place', name: `${neighborhood.name}, Москва` },
    offers: { '@type': 'Offer', priceSpecification: { '@type': 'PriceSpecification', price: priceFrom, priceCurrency: 'RUB' } }
  };
  
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } }))
  };
  
  return (
    <>
      <Helmet>
        <title>{seoMeta.title}</title>
        <meta name="description" content={seoMeta.description} />
        <link rel="canonical" href={seoMeta.canonical} />
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen">
        <section className="bg-gradient-to-b from-primary/5 to-background py-10 md:py-14">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="mt-6 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-primary/10 rounded-full text-sm font-medium">{districtName}</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Выезд {responseTime}</span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">{serviceName} в районе {neighborhood.name}</h1>
              <p className="text-lg text-muted-foreground mb-6">Профессиональная {serviceName.toLowerCase()} в {neighborhood.name}. Работаем с квартирами, домами, офисами.</p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm"><Clock className="w-5 h-5 text-primary" /><span>Выезд за {responseTime}</span></div>
                <div className="flex items-center gap-2 text-sm"><Shield className="w-5 h-5 text-primary" /><span>Гарантия 1 год</span></div>
                <div className="flex items-center gap-2 text-sm"><MapPin className="w-5 h-5 text-primary" /><span>{neighborhood.name}, {districtName}</span></div>
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
                    {[`Выезд в ${neighborhood.name} — бесплатно`, 'Диагностика включена', 'Гарантия до 1 года', 'Безопасные препараты'].map((item, i) => (
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
        
        {servicePests.length > 0 && (
          <AnimatedSection className="py-10">
            <div className="container mx-auto px-4">
              <h2 className="text-xl font-bold mb-6 text-center">{serviceName} в {neighborhood.name}: виды работ</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {servicePests.map((pest) => (
                  <Link key={pest.slug} to={`/uslugi/${serviceSlug}/${pest.slug}/${districtSlug}`} className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <span className="text-2xl">{pest.icon}</span>
                    <div><div className="font-medium">{pest.name}</div><div className="text-sm text-muted-foreground">от {pest.priceFrom}₽</div></div>
                  </Link>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}
        
        <AnimatedSection className="py-10 bg-muted/30">
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
            <h2 className="text-xl md:text-2xl font-bold mb-3">Закажите {serviceName.toLowerCase()} в {neighborhood.name}</h2>
            <p className="opacity-90 mb-4">Выезд за {responseTime}. Гарантия 1 год.</p>
            <Button size="lg" variant="secondary" asChild><a href={`tel:${SEO_CONFIG.phoneClean}`}><Phone className="w-5 h-5 mr-2" />{SEO_CONFIG.phone}</a></Button>
          </div>
        </AnimatedSection>
      </main>
      
      <Footer />
    </>
  );
}
