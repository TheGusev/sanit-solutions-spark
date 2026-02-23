import { useParams, Link } from "react-router-dom";
import NotFound from './NotFound';
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Phone, Check, Shield, Clock, Award, ChevronRight } from "lucide-react";
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
import AnimatedSection from "@/components/AnimatedSection";
import { getSubpageByPath } from "@/data/serviceSubpages";
import { getServiceBySlug } from "@/data/services";
import { trackGoal } from "@/lib/analytics";
import CalculatorModal from "@/components/CalculatorModal";

const ServiceSubpage = () => {
  const { parentSlug, subSlug } = useParams<{ parentSlug: string; subSlug: string }>();
  const [showCalculator, setShowCalculator] = useState(false);
  const subpage = getSubpageByPath(parentSlug || "", subSlug || "");
  const parentService = getServiceBySlug(parentSlug || "");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [parentSlug, subSlug]);

  if (!subpage) {
    return <NotFound />;
  }

  const handlePhoneClick = () => {
    trackGoal('phone_click', { source: 'subpage', service: subpage.fullPath });
  };

  const handleCalculatorClick = () => {
    trackGoal('calculator_click', { source: 'subpage', service: subpage.fullPath });
    setShowCalculator(true);
  };

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": subpage.title,
    "name": subpage.h1,
    "description": subpage.metaDescription,
    "provider": {
      "@type": "LocalBusiness",
      "name": "ООО Санитарные Решения",
      "telephone": "8-495-018-18-17",
      "address": { "@type": "PostalAddress", "addressLocality": "Москва", "addressCountry": "RU" }
    },
    "areaServed": { "@type": "City", "name": "Москва" },
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": subpage.priceFrom,
      "priceCurrency": "RUB"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": subpage.faq.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": { "@type": "Answer", "text": item.answer }
    }))
  };

  return (
    <>
      <Helmet>
        <title>{subpage.metaTitle}</title>
        <meta name="description" content={subpage.metaDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://goruslugimsk.ru${subpage.fullPath.endsWith('/') ? subpage.fullPath : subpage.fullPath + '/'}`} />
        <meta property="og:title" content={subpage.metaTitle} />
        <meta property="og:description" content={subpage.metaDescription} />
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] bg-gradient-to-br from-primary via-primary/90 to-accent flex items-center">
          <div className="absolute inset-0 bg-black/20" />
          <div className="container mx-auto px-4 py-16 relative z-10">
            <Breadcrumb className="mb-6">
              <BreadcrumbList className="text-white/80">
                <BreadcrumbItem><BreadcrumbLink asChild><Link to="/" className="hover:text-white">Главная</Link></BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/60" />
                <BreadcrumbItem><BreadcrumbLink asChild><Link to={`/uslugi/${parentSlug}`} className="hover:text-white">{parentService?.title || 'Услуги'}</Link></BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/60" />
                <BreadcrumbItem><BreadcrumbPage className="text-white">{subpage.title}</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{subpage.h1}</h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl">{subpage.heroSubtitle}</p>

            <div className="flex flex-wrap gap-3 mb-8">
              <span className="px-4 py-2 bg-white/20 backdrop-blur rounded-full text-white text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" /> Выезд 30 мин
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur rounded-full text-white text-sm flex items-center gap-2">
                <Shield className="w-4 h-4" /> Гарантия
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur rounded-full text-white text-sm flex items-center gap-2">
                <Award className="w-4 h-4" /> Лицензия
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" onClick={handleCalculatorClick} className="text-lg">
                Рассчитать стоимость
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
                <a href="tel:84950181817" onClick={handlePhoneClick}>
                  <Phone className="w-5 h-5 mr-2" /> Позвонить
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* When Needed */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="fade-up">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Когда нужна {subpage.title.toLowerCase()}</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-4xl">{subpage.whenNeeded.intro}</p>
            </AnimatedSection>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {subpage.whenNeeded.reasons.map((reason, idx) => (
                <AnimatedSection key={idx} animation="fade-up" delay={idx * 100}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4">{reason.icon}</div>
                      <h3 className="font-bold text-lg mb-2">{reason.title}</h3>
                      <p className="text-sm text-muted-foreground">{reason.description}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Process Timeline */}
        <section className="py-12 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="fade-up" className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Как проходит обработка</h2>
            </AnimatedSection>
            
            <div className="max-w-3xl mx-auto space-y-6">
              {subpage.process.map((step, idx) => (
                <AnimatedSection key={idx} animation="fade-up" delay={idx * 100}>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                      <p className="text-muted-foreground mb-3">{step.description}</p>
                      <ul className="space-y-1 mb-2">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-primary" /> {detail}
                          </li>
                        ))}
                      </ul>
                      <span className="text-sm text-muted-foreground">⏱️ {step.duration}</span>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="fade-up" className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Стоимость {subpage.title.toLowerCase()}</h2>
            </AnimatedSection>
            
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse bg-card rounded-xl overflow-hidden shadow-lg">
                <thead className="bg-primary text-primary-foreground">
                  <tr>
                    <th className="p-4 text-left">Тип</th>
                    <th className="p-4 text-left">Площадь</th>
                    <th className="p-4 text-left">Холодный туман</th>
                    <th className="p-4 text-left">Горячий туман</th>
                    <th className="p-4 text-left">Время</th>
                  </tr>
                </thead>
                <tbody>
                  {subpage.pricing.map((price, idx) => (
                    <tr key={idx} className={`border-b ${price.highlighted ? 'bg-primary/5' : ''}`}>
                      <td className="p-4 font-medium">{price.type}</td>
                      <td className="p-4 text-muted-foreground">{price.area}</td>
                      <td className="p-4 font-bold text-primary">{price.coldFog}</td>
                      <td className="p-4 font-bold text-primary">{price.hotFog}</td>
                      <td className="p-4 text-muted-foreground">{price.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary" /> Что входит в стоимость
                  </h3>
                  <ul className="space-y-2">
                    {subpage.includedInPrice.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Дополнительные услуги</h3>
                  <ul className="space-y-2">
                    {subpage.additionalServices.map((item, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">{item}</li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" onClick={handleCalculatorClick}>
                    Рассчитать точную стоимость
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Advantages */}
        <section className="py-12 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="fade-up" className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold">Почему выбирают нас</h2>
            </AnimatedSection>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {subpage.advantages.map((adv, idx) => (
                <AnimatedSection key={idx} animation="fade-up" delay={idx * 100}>
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="text-3xl mb-3">{adv.icon}</div>
                      <h3 className="font-bold mb-2">{adv.title}</h3>
                      <p className="text-sm text-muted-foreground">{adv.description}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="fade-up" className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold">Частые вопросы</h2>
            </AnimatedSection>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {subpage.faq.map((item, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`} className="bg-card rounded-xl px-6 border">
                    <AccordionTrigger className="text-left hover:no-underline">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Закажите {subpage.title.toLowerCase()} сегодня</h2>
            <p className="text-lg opacity-90 mb-8">Выезд специалиста за 30 минут. Работаем круглосуточно.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="secondary" onClick={handleCalculatorClick}>Рассчитать стоимость</Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <a href="tel:84950181817" onClick={handlePhoneClick}>
                  <Phone className="w-5 h-5 mr-2" /> 8-495-018-18-17
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Related Services */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Другие услуги</h2>
            <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {subpage.relatedServices.map((service, idx) => (
                <Link key={idx} to={service.slug}>
                  <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl mb-3">{service.icon}</div>
                      <h3 className="font-bold mb-1">{service.title}</h3>
                      <p className="text-primary font-medium">{service.price}</p>
                      <ChevronRight className="w-5 h-5 mx-auto mt-2 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Districts quick links */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
              Услуга по округам Москвы
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
              Работаем во всех административных округах столицы с выездом от 15 минут
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {['ЦАО', 'САО', 'СВАО', 'ВАО', 'ЮВАО', 'ЮАО', 'ЮЗАО', 'ЗАО', 'СЗАО'].map((name, idx) => {
                const slugs = ['cao', 'sao', 'svao', 'vao', 'yuvao', 'yao', 'yzao', 'zao', 'szao'];
                return (
                  <Link 
                    key={idx} 
                    to={`/uslugi/dezinfekciya-${slugs[idx]}`}
                    className="px-4 py-2 bg-background hover:bg-primary hover:text-primary-foreground rounded-full transition-colors text-sm font-medium border"
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

        {/* Back to parent service */}
        <section className="py-8">
          <div className="container mx-auto px-4 text-center">
            <Link to={`/uslugi/${parentSlug}`} className="inline-flex items-center text-primary hover:underline font-medium">
              ← Вернуться к услуге {parentService?.title || 'Услуги'}
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <CalculatorModal open={showCalculator} onOpenChange={setShowCalculator} />
    </>
  );
};

export default ServiceSubpage;
