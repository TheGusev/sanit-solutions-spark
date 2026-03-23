/**
 * Коммерческий лендинг: Борьба с кротами в [Город МО]
 * URL: /uslugi/borba-s-krotami/:citySlug/
 */

import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import NotFound from './NotFound';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import AnimatedSection from '@/components/AnimatedSection';
import ServiceTariffs from '@/components/ServiceTariffs';
import ServiceQuiz from '@/components/ServiceQuiz';
import InternalLinks from '@/components/InternalLinks';
import CalculatorModal from '@/components/CalculatorModal';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Clock, Shield, MapPin, CheckCircle, Award } from 'lucide-react';
import { getMoleCityBySlug, moleCities } from '@/data/moleCities';
import { getPestBySlug } from '@/data/pests';
import { SEO_CONFIG, generateSEOMeta } from '@/lib/seo';
import { generateLocalBusiness } from '@/components/StructuredData';
import { quizPriceMaps } from '@/data/quizPriceMap';
import { trackGoal } from '@/lib/analytics';

export default function MoleCityPage() {
  const { citySlug } = useParams<{ citySlug: string }>();
  const [showCalculator, setShowCalculator] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [citySlug]);

  const city = citySlug ? getMoleCityBySlug(citySlug) : undefined;
  const pest = getPestBySlug('kroty');

  if (!city || !pest) return <NotFound />;

  const path = `/uslugi/borba-s-krotami/${city.slug}`;
  const seo = generateSEOMeta(
    path,
    `Борьба с кротами ${city.prepositional} — от ${pest.priceFrom}₽ | ${SEO_CONFIG.companyName}`,
    `Профессиональное уничтожение кротов ${city.prepositional} (${city.highway}). Газация, кротоловки, барьерная защита. Выезд ${city.responseTime}. Гарантия 6 месяцев. ${SEO_CONFIG.phone}`
  );

  const breadcrumbs = [
    { label: 'Главная', path: '/' },
    { label: 'Услуги', path: '/uslugi/dezinfekciya/' },
    { label: 'Борьба с кротами', path: '/uslugi/borba-s-krotami/' },
    { label: city.name },
  ];

  const relatedCities = city.relatedCities
    .map(s => moleCities.find(c => c.slug === s))
    .filter(Boolean);

  const priceMap = quizPriceMaps['borba-s-krotami'];

  // JSON-LD
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Борьба с кротами ${city.prepositional}`,
    description: seo.description,
    provider: {
      '@type': 'LocalBusiness',
      name: SEO_CONFIG.companyName,
      telephone: SEO_CONFIG.phone,
    },
    areaServed: {
      '@type': 'City',
      name: city.name,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'RUB',
      price: pest.priceFrom,
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'RUB',
        price: pest.priceFrom,
        unitText: 'за обработку',
      },
    },
  };

  const faqJsonLd = city.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: city.faq.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null;

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={seo.canonical} />
        <meta property="og:title" content={seo.ogTitle} />
        <meta property="og:description" content={seo.ogDescription} />
        <meta property="og:url" content={seo.canonical} />
        <meta property="og:type" content="website" />
        <meta name="robots" content={seo.robots} />
        <script type="application/ld+json">{JSON.stringify(serviceJsonLd)}</script>
        {faqJsonLd && <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>}
      </Helmet>

      <Header />

      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={breadcrumbs} />
            <AnimatedSection animation="fade-up" className="max-w-3xl mt-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Борьба с кротами {city.prepositional} — от {pest.priceFrom}₽
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Профессиональное уничтожение кротов на участках {city.prepositional} ({city.highway}).
                Газация тоннелей, кротоловки, барьерная защита. Гарантия 6 месяцев.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  { icon: Clock, text: `Выезд ${city.responseTime}` },
                  { icon: Shield, text: 'Гарантия 6 мес.' },
                  { icon: MapPin, text: city.highway },
                  { icon: Award, text: 'Договор + акт' },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm bg-card rounded-lg px-3 py-2 border">
                    <Icon className="w-4 h-4 text-primary" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="min-h-[48px] text-base" asChild>
                  <a href={`tel:${SEO_CONFIG.phoneClean}`} onClick={() => trackGoal('mole_city_call', { city: city.slug })}>
                    <Phone className="w-4 h-4 mr-2" />
                    {SEO_CONFIG.phone}
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="min-h-[48px] text-base" onClick={() => setShowCalculator(true)}>
                  Рассчитать стоимость
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Специфика района */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="fade-up" className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Почему кроты выбирают участки {city.prepositional}
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p>
                  <strong>{city.soilType}</strong> — характерный грунт {city.prepositional} ({city.highway}, {city.distanceFromMkad} от МКАД).
                  Такая почва идеальна для кротов: легко поддаётся рытью, хорошо удерживает влагу и обеспечивает обилие дождевых червей — основного корма кротов.
                </p>
                {city.landmarks.length > 0 && (
                  <p>
                    В окрестностях {city.landmarks.join(', ')} проблема особенно актуальна: обширные газоны, ухоженные сады и ландшафтные зоны привлекают кротов из прилегающих лесных территорий.
                  </p>
                )}
                <p>
                  За сутки один крот прокладывает до 30 метров новых тоннелей, повреждая корневую систему растений, газоны и садовые дорожки.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Методы */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="fade-up" className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Как мы уничтожаем кротов {city.prepositional}
              </h2>
            </AnimatedSection>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { title: 'Газация тоннелей', desc: 'Введение фумигационных средств в систему ходов. Уничтожает кротов в активных тоннелях.' },
                { title: 'Кротоловки', desc: 'Установка механических ловушек в активных ходах. Гуманный и эффективный метод.' },
                { title: 'Репеллентный барьер', desc: 'Обработка почвы по периметру участка. Предотвращает повторное проникновение.' },
                { title: 'Виброотпугиватели', desc: 'Установка вибрационных отпугивателей для постоянной защиты после обработки.' },
              ].map((method, i) => (
                <AnimatedSection key={i} animation="fade-up" delay={i * 100}>
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <CheckCircle className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-bold mb-2">{method.title}</h3>
                      <p className="text-sm text-muted-foreground">{method.desc}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Тарифы */}
        {pest.tariffs && (
          <ServiceTariffs
            tariffs={pest.tariffs}
            serviceTitle="борьбу с кротами"
            serviceAccusative={`борьбу с кротами ${city.prepositional}`}
          />
        )}

        {/* Квиз */}
        {pest.quizSteps && (
          <section className="py-12 md:py-16">
            <div className="container mx-auto px-4 max-w-2xl">
              <ServiceQuiz
                steps={pest.quizSteps}
                serviceSlug="borba-s-krotami"
                serviceTitle={`Борьба с кротами ${city.prepositional}`}
                basePrice={`от ${pest.priceFrom} ₽`}
                priceMap={priceMap?.prices}
                priceStepIndex={priceMap?.stepIndex}
              />
            </div>
          </section>
        )}

        {/* FAQ */}
        {city.faq.length > 0 && (
          <section className="py-12 md:py-16 bg-muted/30" id="faq">
            <div className="container mx-auto px-4 max-w-3xl">
              <AnimatedSection animation="fade-up" className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold">
                  Вопросы о борьбе с кротами {city.prepositional}
                </h2>
              </AnimatedSection>
              <Accordion type="single" collapsible className="space-y-2">
                {city.faq.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="bg-card border rounded-lg px-4">
                    <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        )}

        {/* Перелинковка: соседние города */}
        {relatedCities.length > 0 && (
          <section className="py-12 md:py-16">
            <div className="container mx-auto px-4 max-w-3xl">
              <AnimatedSection animation="fade-up" className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold">
                  Борьба с кротами в соседних городах
                </h2>
              </AnimatedSection>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {relatedCities.map(rc => rc && (
                  <Link
                    key={rc.slug}
                    to={`/uslugi/borba-s-krotami/${rc.slug}/`}
                    className="bg-card border rounded-lg p-4 hover:border-primary transition-colors"
                  >
                    <p className="font-medium">{rc.name}</p>
                    <p className="text-sm text-muted-foreground">{rc.highway}</p>
                    <p className="text-sm text-primary mt-1">от {pest.priceFrom} ₽</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Ссылка на блог-статью */}
        {city.blogSlug && (
          <section className="py-8">
            <div className="container mx-auto px-4 max-w-3xl text-center">
              <p className="text-muted-foreground">
                Подробнее о проблеме кротов {city.prepositional} читайте в{' '}
                <Link to={`/blog/${city.blogSlug}/`} className="text-primary hover:underline">
                  нашей статье
                </Link>
              </p>
            </div>
          </section>
        )}

        <InternalLinks />
      </main>

      <Footer />
      <CalculatorModal open={showCalculator} onOpenChange={setShowCalculator} />
    </>
  );
}
