import { useState } from "react";
import { trackGoal } from "@/lib/analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import AnimatedSection from "@/components/AnimatedSection";
import HeroCallbackForm from "@/components/HeroCallbackForm";
import SectionHeading from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Phone, Shield, Clock, Award, Bug, Zap, CheckCircle, Users, Beaker, Calculator } from "lucide-react";
import { trackGoal } from "@/lib/analytics";
import CalculatorModal from "@/components/CalculatorModal";
import type { PageMetadata } from "@/lib/metadata";

const metadata: PageMetadata = {
  title: "Служба дезинсекции в Москве — вызвать специалиста круглосуточно",
  description: "Профессиональная служба дезинсекции в Москве. Уничтожение тараканов, клопов, блох и других насекомых. Выезд за 30 минут, гарантия до 3 лет.",
  canonical: "https://goruslugimsk.ru/sluzhba-dezinsekcii",
  schema: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Санитарные Решения — Служба дезинсекции",
    description: "Профессиональная служба дезинсекции в Москве и МО",
    url: "https://goruslugimsk.ru/sluzhba-dezinsekcii",
    telephone: "+74950181817",
    areaServed: { "@type": "City", name: "Москва" },
    openingHours: "Mo-Su 00:00-23:59",
  },
};

const advantages = [
  { icon: Clock, title: "Выезд за 30 минут", desc: "Оперативная реакция на вызов в любое время суток" },
  { icon: Shield, title: "Гарантия до 3 лет", desc: "Бесплатная повторная обработка при возвращении вредителей" },
  { icon: Award, title: "Сертифицированные препараты", desc: "Безопасные для людей и животных средства IV класса опасности" },
  { icon: Users, title: "Опытные специалисты", desc: "Обученные дезинфекторы с опытом работы от 5 лет" },
  { icon: Zap, title: "Современное оборудование", desc: "Генераторы холодного и горячего тумана, УМО-установки" },
  { icon: Bug, title: "Любые насекомые", desc: "Тараканы, клопы, блохи, муравьи, моль, комары и другие" },
];

const faq = [
  { q: "Сколько стоит вызов службы дезинсекции?", a: "Стоимость обработки от 2 500 ₽ за однокомнатную квартиру. Точная цена зависит от площади, типа вредителей и метода обработки." },
  { q: "Как быстро приедет дезинсектор?", a: "В пределах Москвы — от 30 минут после оформления заявки. Мы работаем круглосуточно без выходных." },
  { q: "Безопасна ли обработка для детей и животных?", a: "Да, мы используем сертифицированные препараты IV класса опасности. После проветривания помещение полностью безопасно." },
  { q: "Нужна ли повторная обработка?", a: "В большинстве случаев достаточно одной обработки. При сильном заражении может потребоваться повторный визит — он входит в гарантию." },
  { q: "Как подготовить помещение к обработке?", a: "Уберите продукты питания, посуду, личные вещи. Отодвиньте мебель от стен на 10-15 см. Подробную инструкцию дадим при оформлении заявки." },
];

const ServiceSESPage = () => {
  const [showCalculator, setShowCalculator] = useState(false);
  return (
    <>
      <SEOHead metadata={metadata} pagePath="/sluzhba-dezinsekcii" />
      <Header />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="/">Главная</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>Служба дезинсекции</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Служба дезинсекции в&nbsp;Москве
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Профессиональное уничтожение насекомых с гарантией результата до 3 лет. 
                  Выезд специалиста за 30 минут, работаем круглосуточно.
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  {["Тараканы", "Клопы", "Блохи", "Муравьи", "Моль", "Комары"].map(p => (
                    <span key={p} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">{p}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="gap-2" asChild>
                    <a href="tel:84950181817" onClick={() => trackGoal('phone_click', { source: 'ses_hero' })}>
                      <Phone className="h-5 w-5" /> 8-495-018-18-17
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2" onClick={() => { trackGoal('calculator_click', { source: 'ses_hero' }); setShowCalculator(true); }}>
                    <Calculator className="h-5 w-5" /> Рассчитать стоимость
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <img 
                  src="/images/work/specialist-closeup.jpg" 
                  alt="Специалист службы дезинсекции в защитном костюме" 
                  width={600} height={400} 
                  loading="lazy" decoding="async"
                  className="rounded-xl shadow-lg w-full object-cover max-h-[280px]"
                />
                <HeroCallbackForm serviceSlug="dezinsekciya" />
              </div>
            </div>
          </div>
        </section>

        {/* Advantages */}
        <AnimatedSection>
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <SectionHeading title="Почему выбирают нашу службу" subtitle="Профессиональный подход к каждому объекту" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {advantages.map(a => (
                  <Card key={a.title}>
                    <CardContent className="p-6 flex gap-4 items-start">
                      <a.icon className="h-8 w-8 text-primary flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-foreground mb-1">{a.title}</h3>
                        <p className="text-sm text-muted-foreground">{a.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* How it works */}
        <AnimatedSection>
          <section className="py-16">
            <div className="container mx-auto px-4">
              <SectionHeading title="Как мы работаем" subtitle="От заявки до результата — 4 простых шага" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {[
                  { step: 1, t: "Заявка", d: "Звоните или оставляете заявку на сайте" },
                  { step: 2, t: "Диагностика", d: "Специалист осматривает объект и определяет вид вредителей" },
                  { step: 3, t: "Обработка", d: "Проводим дезинсекцию современным оборудованием" },
                  { step: 4, t: "Гарантия", d: "Выдаём документы и гарантию до 3 лет" },
                ].map(s => (
                  <div key={s.step} className="text-center">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">{s.step}</div>
                    <h3 className="font-bold text-foreground mb-1">{s.t}</h3>
                    <p className="text-sm text-muted-foreground">{s.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* FAQ */}
        <AnimatedSection>
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4 max-w-3xl">
              <SectionHeading title="Частые вопросы" />
              <Accordion type="single" collapsible className="mt-8">
                {faq.map((f, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger>{f.q}</AccordionTrigger>
                    <AccordionContent>{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </AnimatedSection>

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Закажите дезинсекцию прямо сейчас</h2>
            <p className="mb-6 opacity-90">Звоните — выезд специалиста в течение 30 минут</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" variant="secondary" className="gap-2" asChild>
                <a href="tel:84950181817" onClick={() => trackGoal('ses_cta_call')}><Phone className="h-5 w-5" /> 8-495-018-18-17</a>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary gap-2" onClick={() => setShowCalculator(true)}>
                <Calculator className="h-5 w-5" /> Рассчитать стоимость
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <CalculatorModal open={showCalculator} onOpenChange={setShowCalculator} />
    </>
  );
};

export default ServiceSESPage;
