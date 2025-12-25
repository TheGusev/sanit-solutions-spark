import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Check, Phone, ChevronRight, Shield, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WorkProcess from "@/components/WorkProcess";
import AnimatedSection from "@/components/AnimatedSection";
import { getServiceBySlug, servicePages } from "@/data/services";
import { trackGoal } from "@/lib/analytics";
import { useTraffic } from "@/contexts/TrafficContext";

const ServicePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { context } = useTraffic();
  const service = getServiceBySlug(slug || "");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!service) {
    useEffect(() => {
      navigate("/404");
    }, [navigate]);
    return null;
  }

  const handlePhoneClick = () => {
    trackGoal('phone_click', {
      intent: context?.intent,
      source: 'service_page',
      service: service.slug
    });
  };

  const handleCalculatorClick = () => {
    trackGoal('calculator_click', {
      intent: context?.intent,
      source: 'service_page',
      service: service.slug
    });
    navigate('/#calculator');
  };

  const otherServices = servicePages.filter(s => s.slug !== service.slug);

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "serviceType": service.title,
    "provider": {
      "@type": "LocalBusiness",
      "name": "ООО Санитарные Решения",
      "telephone": "+7-906-998-98-88",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Москва",
        "addressCountry": "RU"
      }
    },
    "areaServed": {
      "@type": "City",
      "name": "Москва"
    },
    "description": service.metaDescription,
    "offers": {
      "@type": "Offer",
      "priceSpecification": {
        "@type": "PriceSpecification",
        "price": service.priceFrom,
        "priceCurrency": "RUB",
        "unitText": service.pricePer
      }
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": service.faq.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>{service.metaTitle}</title>
        <meta name="description" content={service.metaDescription} />
        <link rel="canonical" href={`https://goruslugimsk.ru/uslugi/${service.slug}`} />
        <link rel="alternate" hrefLang="ru" href={`https://goruslugimsk.ru/uslugi/${service.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://goruslugimsk.ru/uslugi/${service.slug}`} />
        <meta property="og:title" content={service.metaTitle} />
        <meta property="og:description" content={service.metaDescription} />
        <meta property="og:image" content="https://goruslugimsk.ru/og-image.jpg" />
        <meta property="og:site_name" content="Санитарные Решения" />
        <meta property="og:locale" content="ru_RU" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={service.metaTitle} />
        <meta name="twitter:description" content={service.metaDescription} />
        <meta name="twitter:image" content="https://goruslugimsk.ru/og-image.jpg" />
        
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-background py-12 md:py-20">
          <div className="container mx-auto px-4">
            {/* Breadcrumbs */}
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Главная</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/#services">Услуги</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{service.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="max-w-4xl">
              <AnimatedSection animation="fade-up">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  {service.heroTitle}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8">
                  {service.heroSubtitle}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" onClick={handleCalculatorClick} className="text-lg">
                    Рассчитать стоимость
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="tel:+79069989888" onClick={handlePhoneClick}>
                      <Phone className="w-5 h-5 mr-2" />
                      Позвонить
                    </a>
                  </Button>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-6 mt-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <span>Гарантия до 1 года</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>Выезд за 2 часа</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    <span>Лицензия Роспотребнадзора</span>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Price highlight */}
        <section className="py-6 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <span className="text-lg opacity-90">Стоимость услуги</span>
                <div className="text-3xl md:text-4xl font-bold">
                  от {service.priceFrom.toLocaleString('ru-RU')} ₽ <span className="text-lg font-normal opacity-80">за {service.pricePer}</span>
                </div>
              </div>
              <Button size="lg" variant="secondary" onClick={handleCalculatorClick}>
                Узнать точную цену
              </Button>
            </div>
          </div>
        </section>

        {/* Description & Benefits */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <AnimatedSection animation="fade-right">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  О услуге {service.title.toLowerCase()}
                </h2>
                <div className="prose prose-lg text-muted-foreground">
                  {service.description.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4">{paragraph.trim()}</p>
                  ))}
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fade-left">
                <h3 className="text-xl md:text-2xl font-bold mb-6">Преимущества</h3>
                <ul className="space-y-4">
                  {service.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-lg">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Methods */}
        <section className="py-12 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="fade-up" className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                Методы обработки
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Выбираем оптимальный метод в зависимости от объекта и степени заражения
              </p>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.methods.map((method, idx) => (
                <AnimatedSection key={idx} animation="fade-up" delay={idx * 100}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <span className="text-2xl font-bold text-primary">{idx + 1}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{method.title}</h3>
                      <p className="text-muted-foreground">{method.description}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Target Pests (if applicable) */}
        {service.targetPests && (
          <section className="py-12 md:py-20">
            <div className="container mx-auto px-4">
              <AnimatedSection animation="fade-up" className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                  {service.slug === 'dezinsekciya' ? 'От каких насекомых избавляем' : 'От каких грызунов избавляем'}
                </h2>
              </AnimatedSection>

              <div className="flex flex-wrap justify-center gap-4">
                {service.targetPests.map((pest, idx) => (
                  <AnimatedSection key={idx} animation="fade-up" delay={idx * 50}>
                    <div className="px-6 py-3 bg-card rounded-full border shadow-sm text-lg font-medium">
                      {pest}
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Work Process */}
        <WorkProcess />

        {/* FAQ */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="fade-up" className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                Часто задаваемые вопросы
              </h2>
            </AnimatedSection>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {service.faq.map((item, idx) => (
                  <AnimatedSection key={idx} animation="fade-up" delay={idx * 100}>
                    <AccordionItem value={`item-${idx}`} className="bg-card rounded-xl px-6 border">
                      <AccordionTrigger className="text-left text-lg hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-base">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </AnimatedSection>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <AnimatedSection animation="fade-up">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                Закажите {service.title.toLowerCase()} сегодня
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                Оставьте заявку или позвоните — выезд мастера в течение 2 часов. 
                Работаем круглосуточно без выходных.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" variant="secondary" onClick={handleCalculatorClick} className="text-lg">
                  Рассчитать стоимость
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                  <a href="tel:+79069989888" onClick={handlePhoneClick}>
                    <Phone className="w-5 h-5 mr-2" />
                    +7 (906) 998-98-88
                  </a>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Other Services */}
        <section className="py-12 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="fade-up" className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Другие услуги
              </h2>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {otherServices.map((otherService, idx) => (
                <AnimatedSection key={otherService.slug} animation="fade-up" delay={idx * 100}>
                  <Link to={`/uslugi/${otherService.slug}`}>
                    <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                      <CardContent className="p-6 flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{otherService.title}</h3>
                          <p className="text-muted-foreground">от {otherService.priceFrom.toLocaleString('ru-RU')} ₽</p>
                        </div>
                        <ChevronRight className="w-6 h-6 text-muted-foreground" />
                      </CardContent>
                    </Card>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ServicePage;
