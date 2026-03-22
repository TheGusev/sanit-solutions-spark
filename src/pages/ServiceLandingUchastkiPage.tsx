import { useState } from "react";
import { trackGoal } from "@/lib/analytics";
import Header from "@/components/Header";
import ServiceQuiz from "@/components/ServiceQuiz";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Phone, TreePine, Bug, Droplets, Shield, Leaf, Calculator } from "lucide-react";
import CalculatorModal from "@/components/CalculatorModal";
import type { PageMetadata } from "@/lib/metadata";

const metadata: PageMetadata = {
  title: "Обработка участков от клещей, комаров и борщевика в Москве и МО",
  description: "Профессиональная обработка дачных участков, газонов и территорий от клещей, комаров, борщевика. Безопасные препараты, гарантия до 3 лет. Выезд по Москве и МО.",
  canonical: "https://goruslugimsk.ru/uslugi/obrabotka-uchastkov",
  schema: {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Обработка участков от вредителей",
    provider: { "@type": "LocalBusiness", name: "Санитарные Решения", telephone: "+74950181817" },
    areaServed: { "@type": "City", name: "Москва" },
    description: "Обработка дачных участков и территорий от клещей, комаров и борщевика",
  },
};

const targets = [
  { icon: Bug, title: "Клещи", desc: "Иксодовые клещи — переносчики боррелиоза и энцефалита. Обработка газонов, кустарников, лесных зон." },
  { icon: Droplets, title: "Комары", desc: "Уничтожение личинок и взрослых особей на всей территории участка. Защита на 1–2 месяца." },
  { icon: Leaf, title: "Борщевик", desc: "Химическая обработка борщевика Сосновского. Предотвращение повторного роста." },
  { icon: TreePine, title: "Короед и вредители деревьев", desc: "Инъекции в ствол дерева и опрыскивание кроны от короеда, щитовки, тли." },
];

const pricing = [
  { area: "до 6 соток", price: "от 4 000 ₽" },
  { area: "6–10 соток", price: "от 5 500 ₽" },
  { area: "10–20 соток", price: "от 8 000 ₽" },
  { area: "20–50 соток", price: "от 12 000 ₽" },
  { area: "от 50 соток", price: "договорная" },
];

const faq = [
  { q: "Когда лучше обрабатывать участок от клещей?", a: "Оптимальное время — апрель–май, до начала активности клещей. Повторная обработка рекомендуется в июле–августе." },
  { q: "Безопасна ли обработка для домашних животных?", a: "Да, после высыхания препарата (2–3 часа) территория полностью безопасна для людей и животных." },
  { q: "Как долго действует обработка?", a: "Защита от клещей — до 45 дней, от комаров — до 30 дней. Рекомендуем 2–3 обработки за сезон." },
  { q: "Вы работаете в Московской области?", a: "Да, мы обслуживаем всю Москву и Московскую область. Выезд за МКАД — бесплатно до 30 км." },
  { q: "Нужно ли убирать урожай перед обработкой?", a: "Плодовые деревья и грядки с урожаем обрабатываются щадящими биопрепаратами. Обычно достаточно выждать 3–5 дней до сбора." },
];

const ServiceLandingUchastkiPage = () => {
  const [showCalculator, setShowCalculator] = useState(false);
  return (
    <>
      <SEOHead metadata={metadata} pagePath="/uslugi/obrabotka-uchastkov" />
      <Header />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/10 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="/">Главная</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink href="/uslugi/dezinsekciya">Услуги</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>Обработка участков</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Обработка участков от&nbsp;вредителей
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Защитите свой участок от клещей, комаров и борщевика. 
                  Профессиональная обработка безопасными препаратами с гарантией результата.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="gap-2" asChild>
                    <a href="tel:84950181817" onClick={() => trackGoal('phone_click', { source: 'uchastki_hero' })}>
                      <Phone className="h-5 w-5" /> 8-495-018-18-17
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2" onClick={() => { trackGoal('calculator_click', { source: 'uchastki_hero' }); setShowCalculator(true); }}>
                    <Calculator className="h-5 w-5" /> Рассчитать стоимость
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <img 
                  src="/images/work/outdoor-treatment.png" 
                  alt="Обработка дачного участка от клещей и комаров" 
                  width={600} height={400} 
                  loading="lazy" decoding="async"
                  className="rounded-xl shadow-lg w-full object-cover max-h-[280px]"
                />
                <HeroCallbackForm serviceSlug="obrabotka-uchastkov" />
              </div>
            </div>
          </div>
        </section>

        {/* Targets */}
        <AnimatedSection>
          <section className="py-16">
            <div className="container mx-auto px-4">
              <SectionHeading title="От каких вредителей обрабатываем" />
              <div className="grid sm:grid-cols-2 gap-6 mt-8">
                {targets.map(t => (
                  <Card key={t.title}>
                    <CardContent className="p-6 flex gap-4 items-start">
                      <t.icon className="h-8 w-8 text-primary flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-foreground mb-1">{t.title}</h3>
                        <p className="text-sm text-muted-foreground">{t.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Pricing */}
        <AnimatedSection>
          <section className="py-16 bg-muted/30" data-section="pricing">
            <div className="container mx-auto px-4 max-w-2xl">
              <SectionHeading title="Стоимость обработки участка" />
              <Table className="mt-8">
                <TableHeader>
                  <TableRow>
                    <TableHead>Площадь участка</TableHead>
                    <TableHead className="text-right">Стоимость</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pricing.map(p => (
                    <TableRow key={p.area}>
                      <TableCell>{p.area}</TableCell>
                      <TableCell className="text-right font-medium">{p.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        </AnimatedSection>

        {/* Quiz */}
        <ServiceQuiz
          serviceSlug="obrabotka-uchastkov"
          serviceTitle="Обработка участков"
          steps={[
            { question: "Что беспокоит?", options: ["Клещи", "Комары", "Борщевик", "Несколько вредителей"] },
            { question: "Площадь участка?", options: ["до 6 соток", "6–10 соток", "10–20 соток", "более 20 соток"] },
            { question: "Тип территории?", options: ["Дачный участок", "Коттеджный посёлок", "Парк / сквер", "Коммерческая территория"] },
          ]}
        />

        {/* FAQ */}
        <AnimatedSection>
          <section className="py-16" data-section="faq">
            <div className="container mx-auto px-4 max-w-3xl">
              <SectionHeading title="Вопросы об обработке участков" />
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
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Закажите обработку участка</h2>
            <p className="mb-6 opacity-90">Бесплатный выезд специалиста для оценки территории</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" variant="secondary" className="gap-2" asChild>
                <a href="tel:84950181817" onClick={() => trackGoal('uchastki_cta_call')}><Phone className="h-5 w-5" /> 8-495-018-18-17</a>
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

export default ServiceLandingUchastkiPage;
