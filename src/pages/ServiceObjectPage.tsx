/**
 * Шаблон страницы: Услуга + Тип объекта
 * URL: /uslugi/dezinsekciya/kvartir
 */

import { useParams, Link } from 'react-router-dom';
import NotFound from './NotFound';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import AnimatedSection from '@/components/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Phone, Clock, Shield, CheckCircle, Building, Star, Ruler } from 'lucide-react';
import InternalLinks from '@/components/InternalLinks';
import { getObjectBySlug } from '@/data/objects';
import { servicePages } from '@/data/services';
import { SEO_CONFIG, generateSEOMeta } from '@/lib/seo';

export default function ServiceObjectPage() {
  // Поддержка обоих форматов params: старый {service, object} и новый {parentSlug, subSlug}
  const params = useParams<{ service?: string; object?: string; parentSlug?: string; subSlug?: string }>();
  const serviceSlug = params.service || params.parentSlug;
  const objectSlug = params.object || params.subSlug;
  
  useEffect(() => { window.scrollTo(0, 0); }, [serviceSlug, objectSlug]);
  
  const validServices = ['dezinsekciya', 'dezinfekciya', 'deratizaciya', 'ozonirovanie', 'demerkurizaciya'];
  if (!serviceSlug || !validServices.includes(serviceSlug) || !objectSlug) {
    return <NotFound />;
  }
  
  const objectType = getObjectBySlug(objectSlug);
  const service = servicePages.find(s => s.slug === serviceSlug);
  
  if (!objectType || !service) {
    return <NotFound />;
  }
  
  const serviceName = service.title;
  const serviceGen = service.nameGenitive || serviceName.toLowerCase();
  const serviceAcc = service.nameAccusative || serviceName.toLowerCase();
  const priceFrom = Math.round((service.priceFrom || 1500) * objectType.priceMultiplier);
  const genderAdj = serviceName.endsWith('ие') ? 'Профессиональное' : 'Профессиональная';
  
  const pageTitle = `${serviceName} ${objectType.genitive} в Москве — от ${priceFrom}₽ | Выезд 30 мин`;
  const pageDescription = `${genderAdj} ${serviceName.toLowerCase()} ${objectType.genitive} в Москве от ${priceFrom}₽. Гарантия до 3 лет. ☎️ ${SEO_CONFIG.phone}`;
  const seoMeta = generateSEOMeta(`/uslugi/${serviceSlug}/${objectSlug}`, pageTitle, pageDescription);
  
  const breadcrumbItems = [
    { label: 'Услуги', href: '/uslugi/dezinsekciya' },
    { label: serviceName, href: `/uslugi/${serviceSlug}` },
    { label: objectType.namePlural }
  ];
  
  const faqItems = [
    { question: `Сколько стоит ${serviceName.toLowerCase()} ${objectType.genitive}?`, answer: `От ${priceFrom}₽. В стоимость входит выезд, диагностика и гарантия.` },
    { question: `Как подготовить ${objectType.accusative} к ${serviceGen}?`, answer: `Обеспечьте доступ к плинтусам, уберите продукты, выведите людей и животных на 2-3 часа.` },
    { question: `Сколько времени занимает ${serviceName.toLowerCase()} ${objectType.genitive}?`, answer: `${objectType.averageTime}. Зависит от площади (${objectType.minArea}-${objectType.maxArea} м²).` },
    { question: `Даёте ли гарантию на ${serviceAcc}?`, answer: `Да, гарантия до 3 лет. Повторная обработка бесплатно.` }
  ];
  
  const schemaMarkup = {
    '@context': 'https://schema.org', '@type': 'Service',
    name: `${serviceName} ${objectType.genitive} в Москве`,
    description: objectType.description,
    provider: { '@type': 'LocalBusiness', name: SEO_CONFIG.companyName, telephone: SEO_CONFIG.phone },
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
      
      <main className="min-h-screen pt-16">
        <section className="bg-gradient-to-b from-primary/5 to-background py-10 md:py-14">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="mt-6 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-3xl">{objectType.icon}</span>
                <span className="px-3 py-1 bg-primary/10 rounded-full text-sm font-medium">{objectType.namePlural}</span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">{serviceName} {objectType.genitive} в Москве</h1>
              <p className="text-lg text-muted-foreground mb-6">{objectType.description}</p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm"><Clock className="w-5 h-5 text-primary" /><span>{objectType.averageTime}</span></div>
                <div className="flex items-center gap-2 text-sm"><Shield className="w-5 h-5 text-primary" /><span>Гарантия до 3 лет</span></div>
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
                <CardHeader><CardTitle className="flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500" />Стоимость</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">от {priceFrom}₽</div>
                  <ul className="space-y-2 text-sm">
                    {['Выезд — бесплатно', 'Диагностика включена', 'Гарантия до 3 лет', 'Безопасные препараты'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Building className="w-5 h-5 text-primary" />Особенности</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {objectType.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />{feature}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </AnimatedSection>

        {/* Этапы обработки */}
        <AnimatedSection className="py-10">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-xl font-bold mb-6 text-center">Этапы {serviceGen} {objectType.genitive}</h2>
            <div className="grid md:grid-cols-5 gap-4">
              {[
                { step: '1', title: 'Заявка', desc: `Вы звоните или оставляете заявку. Мы уточняем детали: тип ${objectType.genitive}, площадь, характер проблемы.` },
                { step: '2', title: 'Диагностика', desc: `Специалист приезжает, осматривает ${objectType.accusative}, определяет степень заражения и оптимальный метод обработки.` },
                { step: '3', title: 'Подготовка', desc: `Готовим оборудование и препараты. Вы обеспечиваете доступ к помещению и убираете продукты.` },
                { step: '4', title: 'Обработка', desc: `Проводим ${serviceAcc} методом холодного или горячего тумана. Время: ${objectType.averageTime}.` },
                { step: '5', title: 'Контроль', desc: `Выдаём акт ${serviceGen} и гарантию до 3 лет. При необходимости — повторная обработка бесплатно.` },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-2 font-bold">{item.step}</div>
                  <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Почему мы */}
        <AnimatedSection className="py-10 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-xl font-bold mb-6 text-center">Почему выбирают нас для {serviceGen} {objectType.genitive}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: 'Опыт с 2012 года', desc: `Более 10 лет специализируемся в области ${serviceGen} ${objectType.genitive}. Обработали 15 000+ объектов в Москве.` },
                { title: 'Безопасные препараты', desc: `Используем сертифицированные средства IV класса опасности. Безопасны для людей и домашних животных после проветривания.` },
                { title: 'Гарантия до 3 лет', desc: `Даём письменную гарантию. Если проблема вернётся — повторная обработка бесплатно, без доплат.` },
                { title: 'Документы для проверок', desc: `Выдаём полный пакет документов: акт ${serviceGen}, сертификаты на препараты, договор. Для СЭС и Роспотребнадзора.` },
              ].map((item, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Типичные проблемы */}
        <AnimatedSection className="py-10">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-xl font-bold mb-6 text-center">Типичные проблемы при обработке {objectType.genitive}</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: 'Самостоятельная обработка', desc: 'Бытовые аэрозоли дают временный эффект. Вредители вырабатывают устойчивость к слабым дозам и возвращаются.' },
                { title: 'Затягивание проблемы', desc: 'Каждая неделя промедления увеличивает популяцию вредителей. Чем раньше обработка — тем дешевле и проще.' },
                { title: 'Частичная обработка', desc: `${objectType.namePlural} требуют комплексного подхода. Обработка только одной комнаты не решает проблему — вредители мигрируют.` },
              ].map((item, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
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
            <h2 className="text-xl md:text-2xl font-bold mb-3">Закажите {serviceAcc} {objectType.genitive}</h2>
            <p className="opacity-90 mb-4">Выезд за 30 минут. Гарантия до 3 лет.</p>
            <Button size="lg" variant="secondary" asChild><a href={`tel:${SEO_CONFIG.phoneClean}`}><Phone className="w-5 h-5 mr-2" />{SEO_CONFIG.phone}</a></Button>
          </div>
        </AnimatedSection>
        
        <InternalLinks 
          currentService={serviceSlug} 
          variant="grid" 
          title="Смотрите также" 
        />
      </main>
      
      <Footer />
    </>
  );
}
