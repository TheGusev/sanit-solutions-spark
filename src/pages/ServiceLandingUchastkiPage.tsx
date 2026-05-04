import { useState } from "react";
import { getServicePriceMap, getServicePriceStepIndex } from "@/data/quizPriceMap";
import { trackGoal } from "@/lib/analytics";
import Header from "@/components/Header";
import ServiceQuiz from "@/components/ServiceQuiz";
import Footer from "@/components/Footer";
import RelatedServices from "@/components/RelatedServices";
import RelatedGeoLinks from "@/components/RelatedGeoLinks";
import RelatedBlogLinks from "@/components/RelatedBlogLinks";
import SEOHead from "@/components/SEOHead";
import AnimatedSection from "@/components/AnimatedSection";
import HeroCallbackForm from "@/components/HeroCallbackForm";
import SectionHeading from "@/components/ui/SectionHeading";
import TrustBadge from "@/components/TrustBadge";
import WorkProcess from "@/components/WorkProcess";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Phone, TreePine, Bug, Droplets, Shield, Leaf, Calculator, Clock, Award, FlaskConical, CheckCircle2, Beaker, Sprout, Heart } from "lucide-react";
import CalculatorModal from "@/components/CalculatorModal";
import { SERVICE_GALLERY, GALLERY_SUBTITLES } from "@/data/serviceGallery";
import type { PageMetadata } from "@/lib/metadata";

const metadata: PageMetadata = {
  title: "Обработка участков от клещей, комаров, слизней и борщевика в Москве и МО",
  description: "Профессиональная обработка дачных участков от клещей, комаров, слизней, борщевика. Безопасные препараты, гарантия до 3 лет. Выезд по Москве и МО.",
  canonical: "https://goruslugimsk.ru/uslugi/obrabotka-uchastkov",
  schema: {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Обработка участков от вредителей",
    provider: { "@type": "LocalBusiness", name: "Санитарные Решения", telephone: "+74950181817" },
    areaServed: { "@type": "City", name: "Москва" },
    description: "Обработка дачных участков и территорий от клещей, комаров, слизней и борщевика",
  },
};

const targets = [
  { icon: Bug, title: "Клещи", desc: "Иксодовые клещи — переносчики боррелиоза и энцефалита. Обработка газонов, кустарников, лесных зон." },
  { icon: Droplets, title: "Комары", desc: "Уничтожение личинок и взрослых особей на всей территории участка. Защита на 1–2 месяца." },
  { icon: Leaf, title: "Борщевик", desc: "Химическая обработка борщевика Сосновского. Предотвращение повторного роста." },
  { icon: TreePine, title: "Короед и вредители деревьев", desc: "Инъекции в ствол дерева и опрыскивание кроны от короеда, щитовки, тли." },
  { icon: Bug, title: "Слизни", desc: "Уничтожение слизней на грядках, в теплицах и на газонах. Защита урожая безопасными методами." },
];

const preparations = [
  { name: "Цифокс", type: "Циперметрин 25%", duration: "До 2 месяцев", purpose: "Клещи, комары, мошка" },
  { name: "Сипаз-Супер", type: "Циперметрин + ПБО", duration: "До 6 недель", purpose: "Иксодовые клещи на газоне" },
  { name: "Медилис-Ципер", type: "Циперметрин 25%", duration: "До 45 дней", purpose: "Комары, мухи, слепни" },
  { name: "Дельта Зона", type: "Дельтаметрин 2,5%", duration: "До 60 дней", purpose: "Барьерная обработка периметра" },
  { name: "Раундап / Торнадо", type: "Глифосат 360 г/л", duration: "Уничтожает корень", purpose: "Борщевик Сосновского" },
];

const safetyFacts = [
  { icon: Heart, title: "4-й класс опасности", desc: "Малоопасные для человека и питомцев препараты при соблюдении регламента обработки." },
  { icon: Sprout, title: "Безопасно для растений", desc: "Препараты не накапливаются в почве, не угнетают рост газона и декоративных культур." },
  { icon: Clock, title: "Через 30–60 минут — можно", desc: "После высыхания препарата (30–60 мин) территория безопасна для людей и животных." },
  { icon: Award, title: "Сертификаты Роспотребнадзора", desc: "Все средства зарегистрированы, имеют свидетельства госрегистрации и СанПиН-соответствие." },
];

const technologyPoints = [
  "Холодный туман генератором — мелкодисперсный аэрозоль (10–50 мкм) проникает в траву, кустарники и крону деревьев",
  "Барьерная обработка периметра — отдельный контур по границе участка предотвращает заход новых вредителей",
  "Расход препарата 50–80 мл рабочего раствора на 1 м² — соответствует регламенту СанПиН 3.5.2.3472-17",
  "Кратность 1–3 обработки за сезон в зависимости от плотности популяции и типа вредителя",
  "Перед работой — обход территории, картирование зон активности (норы грызунов, мокрые низины, кучи листвы)",
  "После обработки — инструктаж по срокам полива газона (не ранее 24 ч), сбору урожая (3–5 дней)",
];

const pricing = [
  { area: "до 6 соток", price: "4 000 ₽" },
  { area: "6–10 соток", price: "5 500 ₽" },
  { area: "10–20 соток", price: "8 000 ₽" },
  { area: "20–50 соток", price: "12 000 ₽" },
  { area: "от 50 соток", price: "договорная" },
];

const faq = [
  { q: "Когда лучше обрабатывать участок от клещей?", a: "Оптимальное время — апрель–май, до начала активности клещей. Повторная обработка рекомендуется в июле–августе." },
  { q: "Безопасна ли обработка для домашних животных?", a: "Да, после высыхания препарата (2–3 часа) территория полностью безопасна для людей и животных." },
  { q: "Как долго действует обработка?", a: "Защита от клещей — до 45 дней, от комаров — до 30 дней. Рекомендуем 2–3 обработки за сезон." },
  { q: "Вы работаете в Московской области?", a: "Да, мы обслуживаем всю Москву и Московскую область. Выезд за МКАД — бесплатно до 30 км." },
  { q: "Нужно ли убирать урожай перед обработкой?", a: "Плодовые деревья и грядки с урожаем обрабатываются щадящими биопрепаратами. Обычно достаточно выждать 3–5 дней до сбора." },
  { q: "Как избавиться от слизней на участке?", a: "Мы применяем комплексный подход: обработка грядок и газонов специальными моллюскоцидами, создание барьерных зон. Препараты безопасны для почвы и растений." },
];

const galleryItems = SERVICE_GALLERY['obrabotka-uchastkov'] || [];
const gallerySubtitle = GALLERY_SUBTITLES['obrabotka-uchastkov'] || '';

const ServiceLandingUchastkiPage = () => {
  const [showCalculator, setShowCalculator] = useState(false);
  return (
    <>
      <SEOHead metadata={metadata} pagePath="/uslugi/obrabotka-uchastkov" />
      <Header />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/work/outdoor-treatment.png')" }}
          />
          {/* Brighter overlay — фото остаётся насыщенным */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/55 via-background/20 to-transparent dark:from-background/70 dark:via-background/35 dark:to-background/10" />
          <div className="container mx-auto px-4 relative z-10">
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
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">
                  Обработка участков от&nbsp;вредителей
                </h1>
                <div className="flex gap-1 mb-4">
                  <span className="h-1 w-10 rounded bg-white" />
                  <span className="h-1 w-10 rounded bg-[#003DA5]" />
                  <span className="h-1 w-10 rounded bg-[#CC0000]" />
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  Защитите свой участок от клещей, комаров, слизней и борщевика.
                  Профессиональная обработка безопасными препаратами с гарантией результата.
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  <Button size="lg" className="gap-2" asChild>
                    <a href="tel:84950181817" onClick={() => trackGoal('phone_click')}>
                      <Phone className="h-5 w-5" /> 8-495-018-18-17
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2" onClick={() => { trackGoal('calc_open'); setShowCalculator(true); }}>
                    <Calculator className="h-5 w-5" /> Рассчитать стоимость
                  </Button>
                </div>
                {/* Trust badges */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-5 w-5 text-primary" />
                    <span>Гарантия до 3 лет</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Выезд за 1 час</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="h-5 w-5 text-primary" />
                    <span>Лицензия СЭС</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <HeroCallbackForm serviceSlug="obrabotka-uchastkov" />
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        {galleryItems.length > 0 && (
          <AnimatedSection>
            <section className="py-16 bg-muted/30">
              <div className="container mx-auto px-4">
                <SectionHeading title="До и после обработки участка" />
                {gallerySubtitle && (
                  <p className="text-center text-muted-foreground mt-2 mb-8">{gallerySubtitle}</p>
                )}
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  {galleryItems.map((item, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="relative">
                        <img
                          src={item.src}
                          alt={item.title}
                          width={800}
                          height={600}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-48 object-cover"
                        />
                        <Badge className={`absolute top-3 left-3 ${item.badgeColor}`}>
                          {item.badge}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          </AnimatedSection>
        )}

        {/* Targets */}
        <AnimatedSection>
          <section className="py-16">
            <div className="container mx-auto px-4">
              <SectionHeading title="От каких вредителей обрабатываем" />
              {/* 5 карточек центрируются: 3 в первом ряду, 2 во втором по центру */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-6 mt-8 max-w-6xl mx-auto">
                {targets.map((t, i) => (
                  <Card
                    key={t.title}
                    className={`lg:col-span-2 ${i === 3 ? 'lg:col-start-2' : ''}`}
                  >
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

        {/* NEW: Препараты и безопасность */}
        <AnimatedSection>
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4 max-w-6xl">
              <SectionHeading
                label="ПРЕПАРАТЫ И БЕЗОПАСНОСТЬ"
                title="Какие препараты применяем"
                subtitle="Сертифицированные средства Роспотребнадзора 4 класса опасности — безопасны для людей, питомцев и растений"
              />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                {preparations.map((p) => (
                  <Card key={p.name} className="border-l-4 border-l-primary">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <FlaskConical className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-foreground">{p.name}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2"><strong>Действующее вещество:</strong> {p.type}</p>
                      <p className="text-sm text-foreground mb-1">{p.purpose}</p>
                      <p className="text-xs text-primary font-medium">Защита: {p.duration}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
                {safetyFacts.map((s) => (
                  <Card key={s.title}>
                    <CardContent className="p-5 text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <s.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-bold text-foreground text-sm mb-1">{s.title}</h3>
                      <p className="text-xs text-muted-foreground">{s.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* NEW: Технология обработки */}
        <AnimatedSection>
          <section className="py-16">
            <div className="container mx-auto px-4 max-w-4xl">
              <SectionHeading
                label="ТЕХНОЛОГИЯ"
                title="Как проходит химическая обработка участка"
                subtitle="Прозрачный процесс по регламенту СанПиН — без вреда для газона и урожая"
              />
              <ul className="mt-8 space-y-3">
                {technologyPoints.map((point, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </AnimatedSection>

        {/* Work Process */}
        <WorkProcess />

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
              <div className="mt-6">
                <TrustBadge />
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Quiz */}
        <ServiceQuiz
          serviceSlug="obrabotka-uchastkov"
          serviceTitle="Обработка участков"
          basePrice="4 000 ₽"
          priceMap={getServicePriceMap("obrabotka-uchastkov")}
          priceStepIndex={getServicePriceStepIndex("obrabotka-uchastkov")}
          steps={[
            { question: "Что беспокоит?", options: ["Клещи", "Комары", "Борщевик", "Слизни", "Несколько вредителей"] },
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
                <a href="tel:84950181817" onClick={() => trackGoal('phone_click')}><Phone className="h-5 w-5" /> 8-495-018-18-17</a>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary gap-2" onClick={() => setShowCalculator(true)}>
                <Calculator className="h-5 w-5" /> Рассчитать стоимость
              </Button>
            </div>
          </div>
        </section>
        <RelatedServices serviceSlug="obrabotka-uchastkov" />
        <RelatedGeoLinks serviceSlug="obrabotka-uchastkov" />
        <RelatedBlogLinks serviceSlug="obrabotka-uchastkov" />
      </main>
      <Footer />
      <CalculatorModal open={showCalculator} onOpenChange={setShowCalculator} />
    </>
  );
};

export default ServiceLandingUchastkiPage;
