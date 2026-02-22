import { useParams, Link, useNavigate } from "react-router-dom";
import NotFound from './NotFound';
import { useEffect, Suspense, lazy } from "react";
import { Check, Phone, ChevronRight, Shield, Clock, Award, FileText, ShieldCheck, AlertTriangle, Beaker, CheckCircle } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WorkProcess from "@/components/WorkProcess";
import AnimatedSection from "@/components/AnimatedSection";
import { getServiceBySlug, servicePages, getRelatedArticlesForService } from "@/data/services";
import { getDistrictById } from "@/data/districtPages";
import { trackGoal } from "@/lib/analytics";
import { useTraffic } from "@/contexts/TrafficContext";
import SEOHead from "@/components/SEOHead";
import { generateServiceMetadata } from "@/lib/metadata";
import PageLoader from "@/components/PageLoader";
import ServiceStickyBar from "@/components/ServiceStickyBar";
import HeroCallbackForm from "@/components/HeroCallbackForm";
import ServiceQuiz from "@/components/ServiceQuiz";
import ServiceTariffs from "@/components/ServiceTariffs";
import WhyProblemReturns from "@/components/WhyProblemReturns";
import LazySection from "@/components/LazySection";

// Ленивая загрузка DistrictPage для избежания циклических зависимостей
const DistrictPage = lazy(() => import("./DistrictPage"));

const ServicePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { context } = useTraffic();

  const districtSlug = slug || "";
  const isDistrictPage = districtSlug.startsWith('dezinfekciya-');
  const service = getServiceBySlug(districtSlug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Проверяем, является ли это страницей округа ДЕЗИНФЕКЦИИ
  if (isDistrictPage) {
    const districtId = districtSlug.replace('dezinfekciya-', '');
    const district = getDistrictById(districtId);
    
    if (district) {
      return (
        <Suspense fallback={<PageLoader />}>
          <DistrictPage districtId={districtId} />
        </Suspense>
      );
    }
  }

  if (!service) {
    return <NotFound />;
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

  const displayServices = service.relatedServices
    ? servicePages.filter(s => service.relatedServices!.includes(s.slug))
    : servicePages.filter(s => s.slug !== service.slug);
  

  const metadata = generateServiceMetadata({
    serviceName: service.title,
    serviceSlug: service.slug,
    priceFrom: service.priceFrom,
    pricePer: service.pricePer,
    description: service.metaDescription,
  });

  // Schema.org разметка
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "serviceType": service.title,
    "provider": {
      "@type": "LocalBusiness",
      "name": "ООО Санитарные Решения",
      "telephone": "8-495-018-18-17",
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Главная",
        "item": "https://goruslugimsk.ru"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Услуги",
        "item": "https://goruslugimsk.ru/#services"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": service.title,
        "item": `https://goruslugimsk.ru/uslugi/${service.slug}`
      }
    ]
  };

  metadata.schema = [schemaMarkup, faqSchema, breadcrumbSchema];

  return (
    <>
      <SEOHead metadata={metadata} pagePath={`/uslugi/${service.slug}`} />
      <Header />

      <main className="pt-20 pb-16 md:pb-0">
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-background py-12 md:py-20 min-h-[60vh] overflow-hidden">
          {/* Фоновое изображение для услуги */}
          {service.heroImage && (
            <>
              <div className="absolute inset-0 bg-primary/5" aria-hidden="true" />
              <style dangerouslySetInnerHTML={{ __html: `
                .service-hero-bg {
                  opacity: 0.45;
                }
                @media (min-width: 768px) {
                  .service-hero-bg {
                    opacity: 0.55;
                  }
                }
              `}} />
              <div 
                className="absolute inset-0 bg-cover bg-center service-hero-bg"
                style={{ backgroundImage: `url('${service.heroImage}')` }}
                role="img"
                aria-label={service.title}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/65 to-background/40" />
              <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/40" />
            </>
          )}
          <div className="container mx-auto px-4">
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
                  {service.heroTitle || metadata.h1}
                </h1>
                <div className="tricolor-underline mb-4">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p className="text-lg md:text-xl text-muted-foreground mb-4">
                  {service.heroSubtitle}
                </p>

                {/* Hero Bullets */}
                {service.heroBullets && service.heroBullets.length > 0 && (
                  <ul className="space-y-2 mb-6">
                    {service.heroBullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-base">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" onClick={handleCalculatorClick} className="text-lg">
                    Рассчитать стоимость
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="tel:84950181817" onClick={handlePhoneClick}>
                      <Phone className="w-5 h-5 mr-2" />
                      Позвонить
                    </a>
                  </Button>
                </div>

                <HeroCallbackForm serviceSlug={service.slug} />

                <div className="flex flex-wrap gap-6 mt-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <span>Гарантия {service.guaranteeYears || (service.slug === 'borba-s-krotami' ? '6 месяцев' : 'до 1 года')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>Выезд в течение часа</span>
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

        {/* Service Quiz */}
        <LazySection minHeight="400px">
          {service.quizSteps && service.quizSteps.length > 0 && (
            <ServiceQuiz
              steps={service.quizSteps}
              serviceSlug={service.slug}
              serviceTitle={service.title}
            />
          )}
        </LazySection>

        {/* Service Tariffs */}
        <LazySection minHeight="300px">
          {service.tariffs && service.tariffs.length > 0 && (
            <ServiceTariffs tariffs={service.tariffs} serviceTitle={service.title} />
          )}
        </LazySection>

        {/* Why Problem Returns */}
        <LazySection minHeight="250px">
          {service.returnReasons && service.returnReasons.length > 0 && (
            <WhyProblemReturns returnReasons={service.returnReasons} serviceTitle={service.title} />
          )}
        </LazySection>

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

        {/* When Needed (NEW) */}
        {service.whenNeeded && (
          <section className="py-12 md:py-20">
            <div className="container mx-auto px-4">
              <AnimatedSection animation="fade-up" className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                  Когда нужна {service.title.toLowerCase()}
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  {service.whenNeeded.intro}
                </p>
              </AnimatedSection>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {service.whenNeeded.reasons.map((reason, idx) => (
                  <AnimatedSection key={idx} animation="fade-up" delay={idx * 100}>
                    <Card className="h-full hover:shadow-lg transition-shadow border-l-4 border-l-primary">
                      <CardContent className="p-6">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                          <AlertTriangle className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">{reason.title}</h3>
                        <p className="text-muted-foreground text-sm">{reason.description}</p>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Description & Benefits */}
        <section className="py-12 md:py-20 bg-muted/30">
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
        <section className="py-12 md:py-20">
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

        {/* Safety Info (NEW) */}
        {service.safetyInfo && (
          <section className="py-12 md:py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <AnimatedSection animation="fade-up" className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                  Безопасность препаратов
                </h2>
              </AnimatedSection>

              <div className="max-w-3xl mx-auto space-y-4">
                {service.safetyInfo.map((info, idx) => (
                  <AnimatedSection key={idx} animation="fade-up" delay={idx * 100}>
                    <div className="flex items-start gap-4 bg-card rounded-xl p-5 border">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-base pt-2">{info}</p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        )}

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

        {/* Process / Work Process */}
        {service.process ? (
          <section className="py-12 md:py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <AnimatedSection animation="fade-up" className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                  Этапы работы
                </h2>
              </AnimatedSection>

              <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
                {service.process.map((step, idx) => (
                  <AnimatedSection key={idx} animation="fade-up" delay={idx * 100}>
                    <Card className="h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                            {step.step}
                          </div>
                          <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground font-medium">
                            {step.duration}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground text-sm">{step.description}</p>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <WorkProcess />
        )}

        {/* Pricing Table (NEW) */}
        {service.pricing && (
          <section id="pricing-by-area" className="py-12 md:py-20">
            <div className="container mx-auto px-4">
              <AnimatedSection animation="fade-up" className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                  Стоимость {service.title.toLowerCase()} в Москве
                </h2>
              </AnimatedSection>

              <div className="max-w-4xl mx-auto">
                <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-bold">Тип объекта</TableHead>
                        {service.pricingType !== 'area' && <TableHead className="font-bold">Площадь</TableHead>}
                        {service.pricingType === 'area' ? (
                          <>
                            <TableHead className="font-bold">Площадь</TableHead>
                            <TableHead className="font-bold">Стоимость</TableHead>
                          </>
                        ) : (
                          <>
                            <TableHead className="font-bold">{service.pricing.some(p => p.hotFog && p.hotFog !== '—') ? 'Холодный туман' : 'Стоимость'}</TableHead>
                            {service.pricing.some(p => p.hotFog && p.hotFog !== '—') && (
                              <TableHead className="font-bold">Горячий туман</TableHead>
                            )}
                          </>
                        )}
                        <TableHead className="font-bold">Время</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {service.pricing.map((row, idx) => (
                        <TableRow key={idx} className={row.highlighted ? 'bg-primary/5 font-medium' : ''}>
                          <TableCell className="font-medium">{row.type}</TableCell>
                          {service.pricingType === 'area' ? (
                            <>
                              <TableCell>{row.area}</TableCell>
                              <TableCell className="font-bold text-primary">{row.price}</TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell>{row.area}</TableCell>
                              <TableCell className="font-bold text-primary">{row.coldFog}</TableCell>
                              {service.pricing.some(p => p.hotFog && p.hotFog !== '—') && (
                                <TableCell className="font-bold text-primary">{row.hotFog}</TableCell>
                              )}
                            </>
                          )}
                          <TableCell>{row.duration}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Included in price */}
                {service.includedInPrice && (
                  <AnimatedSection animation="fade-up" className="mt-8">
                    <h3 className="text-xl font-bold mb-4 text-center">Что входит в стоимость</h3>
                    <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                      {service.includedInPrice.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </AnimatedSection>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Guarantees (NEW) */}
        {service.guarantees && (
          <section className="py-12 md:py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <AnimatedSection animation="fade-up" className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                  Гарантии и документы
                </h2>
              </AnimatedSection>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {service.guarantees.map((guarantee, idx) => {
                  const icons = [FileText, Shield, ShieldCheck, Beaker];
                  const Icon = icons[idx % icons.length];
                  return (
                    <AnimatedSection key={idx} animation="fade-up" delay={idx * 100}>
                      <div className="text-center p-6 bg-card rounded-xl border">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-sm font-medium">{guarantee}</p>
                      </div>
                    </AnimatedSection>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        <LazySection minHeight="300px">
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
        </LazySection>

        {/* CTA */}
        <section className="py-12 md:py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <AnimatedSection animation="fade-up">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                Закажите {service.title.toLowerCase()} сегодня
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                Оставьте заявку или позвоните — выезд мастера в течение часа. 
                Работаем круглосуточно без выходных.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" variant="secondary" onClick={handleCalculatorClick} className="text-lg">
                  Рассчитать стоимость
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                  <a href="tel:84950181817" onClick={handlePhoneClick}>
                    <Phone className="w-5 h-5 mr-2" />
                    8-495-018-18-17
                  </a>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Related Articles */}
        {(() => {
          const relatedArticles = getRelatedArticlesForService(service.slug);
          if (relatedArticles.length > 0) {
            return (
              <section className="py-12 md:py-20">
                <div className="container mx-auto px-4">
                  <AnimatedSection animation="fade-up" className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                      Полезные статьи
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      Читайте материалы по теме для более глубокого понимания вопроса
                    </p>
                  </AnimatedSection>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {relatedArticles.map((article, idx) => (
                      <AnimatedSection key={article.slug} animation="fade-up" delay={idx * 100}>
                        <Link to={`/blog/${article.slug}`}>
                          <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                            <CardContent className="p-6">
                              <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                                {article.category}
                              </span>
                              <h3 className="text-lg font-bold mt-3 mb-2 line-clamp-2">{article.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{article.excerpt}</p>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{article.readTime}</span>
                                <span className="text-primary flex items-center gap-1">
                                  Читать
                                  <ChevronRight className="w-4 h-4" />
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </AnimatedSection>
                    ))}
                  </div>
                </div>
              </section>
            );
          }
          return null;
        })()}

        {/* Districts quick links */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="fade-up" className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {service.title} по округам Москвы
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Работаем во всех административных округах столицы с выездом от 15 минут
              </p>
            </AnimatedSection>

            <div className="flex flex-wrap justify-center gap-3">
              {['ЦАО', 'САО', 'СВАО', 'ВАО', 'ЮВАО', 'ЮАО', 'ЮЗАО', 'ЗАО', 'СЗАО'].map((name, idx) => {
                const slugs = ['cao', 'sao', 'svao', 'vao', 'yuvao', 'yao', 'yzao', 'zao', 'szao'];
                return (
                  <Link 
                    key={idx} 
                    to={`/uslugi/dezinfekciya-${slugs[idx]}`}
                    className="px-4 py-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-full transition-colors text-sm font-medium"
                  >
                    {name}
                  </Link>
                );
              })}
            </div>
            <div className="text-center mt-6">
              <Link to="/uslugi/po-okrugam-moskvy" className="text-primary hover:underline font-medium">
                Все округа Москвы →
              </Link>
            </div>
          </div>
        </section>

        {/* SEO Accordion */}
        <LazySection minHeight="80px">
          {service.seoText && (
            <section className="py-8 md:py-12">
              <div className="container mx-auto px-4 max-w-4xl">
                <Accordion type="single" collapsible>
                  <AccordionItem value="seo" className="bg-card rounded-xl px-6 border">
                    <AccordionTrigger className="text-left text-lg font-bold hover:no-underline min-h-[48px]">
                      Подробно об услуге
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                      {service.seoText.split('\n').map((p, i) => (
                        <p key={i} className="mb-3">{p.trim()}</p>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </section>
          )}
        </LazySection>

        {/* Related / Other Services */}
        <section className="py-12 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="fade-up" className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {service.relatedServices ? 'Может быть полезно' : 'Другие услуги'}
              </h2>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {displayServices.map((otherService, idx) => (
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
        <ServiceStickyBar />
      </main>

      <Footer />
    </>
  );
};

export default ServicePage;
