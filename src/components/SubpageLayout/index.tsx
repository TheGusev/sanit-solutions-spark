/**
 * === SUBPAGE LAYOUT COMPONENTS ===
 * Компоненты для отображения подстраниц услуг
 */

import { Link } from 'react-router-dom';
import { Phone, Calculator, Star, ChevronRight, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { SubpageData } from '@/data/subpages/types';

interface SubpageLayoutProps {
  data: SubpageData;
  onOrderClick: () => void;
}

export function SubpageLayout({ data, onOrderClick }: SubpageLayoutProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 140;
      window.scrollTo({ top: el.offsetTop - offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Mini Sticky Nav */}
      <div className="sticky top-[70px] z-40 bg-background border-b border-border py-3">
        <div className="container">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {[
              { id: 'opisanie', label: 'Описание' },
              { id: 'ceny', label: 'Цены' },
              { id: 'etapy', label: 'Этапы' },
              { id: 'faq', label: 'FAQ' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors whitespace-nowrap"
              >
                {tab.label}
              </button>
            ))}
            <Button size="sm" onClick={onOrderClick} className="ml-auto">
              Заказать
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-primary/90 to-accent/80 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container relative z-10 py-16">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-white/80 mb-6 flex-wrap">
            {data.breadcrumbs.map((crumb, idx) => (
              <span key={idx} className="flex items-center gap-2">
                {idx > 0 && <ChevronRight className="w-4 h-4" />}
                {idx === data.breadcrumbs.length - 1 ? (
                  <span className="text-white">{crumb.text}</span>
                ) : (
                  <Link to={crumb.url} className="hover:text-white transition-colors">
                    {crumb.text}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          <h1 className="text-3xl md:text-5xl font-bold mb-6 max-w-3xl">{data.seo.h1}</h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">{data.hero.subtitle}</p>

          {/* Badges */}
          <div className="flex flex-wrap gap-3 mb-8">
            {data.hero.badges.map((badge, idx) => (
              <span key={idx} className="px-4 py-2 bg-white text-primary rounded-full text-sm font-medium">
                {badge.icon} {badge.text}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Button size="lg" onClick={onOrderClick} className="bg-accent hover:bg-accent/90 text-white">
              <Calculator className="w-5 h-5 mr-2" />
              Рассчитать стоимость
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <a href="tel:+79069989888">
                <Phone className="w-5 h-5 mr-2" />
                Позвонить
              </a>
            </Button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 text-white/90">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="font-bold">{data.hero.rating.score}</span>
            <span>({data.hero.rating.reviews} отзывов)</span>
          </div>
        </div>
      </section>

      {/* Reasons Section */}
      <section id="opisanie" className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">{data.reasons.title}</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl">{data.reasons.leadText}</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.reasons.items.map((reason, idx) => (
              <div key={idx} className="p-6 bg-muted rounded-xl text-center hover:shadow-lg transition-shadow">
                <span className="text-4xl mb-4 block">{reason.icon}</span>
                <h3 className="font-bold mb-2">{reason.title}</h3>
                <p className="text-sm text-muted-foreground">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="etapy" className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <h2 className="text-2xl md:text-4xl font-bold mb-12">{data.process.title}</h2>
          <div className="relative pl-8 md:pl-16">
            <div className="absolute left-3 md:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-accent" />
            {data.process.steps.map((step, idx) => (
              <div key={idx} className="relative mb-12 last:mb-0">
                <div className="absolute -left-5 md:-left-10 w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center font-bold text-primary">
                  {step.number}
                </div>
                <div className="bg-background p-6 rounded-xl shadow-sm ml-4">
                  <h3 className="font-bold text-lg mb-4">{step.title}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Что делаем мы:</p>
                      <ul className="space-y-1">
                        {step.weDoItems.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {step.youDoItems && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Что нужно от вас:</p>
                        <ul className="space-y-1">
                          {step.youDoItems.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  {step.infoBox && (
                    <div className={`mt-4 p-4 rounded-lg ${step.infoBox.type === 'blue' ? 'bg-primary/10 border-l-4 border-primary' : 'bg-orange-100 border-l-4 border-orange-500'}`}>
                      <p className="font-medium">{step.infoBox.icon} {step.infoBox.title}</p>
                      <p className="text-sm mt-1">{step.infoBox.text}</p>
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {step.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="ceny" className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-2xl md:text-4xl font-bold mb-8">Стоимость услуги</h2>
          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse bg-background rounded-xl overflow-hidden shadow-sm">
              <thead className="bg-primary text-white">
                <tr>
                  {data.pricing.headers.map((h, i) => (
                    <th key={i} className="p-4 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.pricing.rows.map((row, i) => (
                  <tr key={i} className={`border-b ${row.highlighted ? 'bg-primary/5' : ''} hover:bg-muted/50`}>
                    {row.cells.map((cell, j) => (
                      <td key={j} className="p-4">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-muted rounded-xl">
              <h3 className="font-bold mb-4">✅ Что входит в стоимость</h3>
              <ul className="space-y-2">
                {data.pricing.included.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-accent mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {data.pricing.additional && (
              <div className="p-6 bg-muted rounded-xl">
                <h3 className="font-bold mb-4">Дополнительные услуги</h3>
                <ul className="space-y-2">
                  {data.pricing.additional.map((item, i) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span className="font-medium">{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-8 p-6 bg-primary/5 rounded-xl text-center">
            <h3 className="font-bold text-lg mb-2">Рассчитать точную стоимость</h3>
            <p className="text-muted-foreground mb-4">Оставьте заявку — перезвоним за 5 минут</p>
            <Button size="lg" onClick={onOrderClick}>Рассчитать стоимость</Button>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <h2 className="text-2xl md:text-4xl font-bold mb-12">Почему выбирают нас</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.advantages.map((adv, idx) => (
              <div key={idx} className="p-6 bg-background rounded-xl">
                <span className="text-3xl mb-4 block">{adv.icon}</span>
                <h3 className="font-bold mb-2">{adv.title}</h3>
                <p className="text-sm text-muted-foreground">{adv.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24">
        <div className="container max-w-3xl">
          <h2 className="text-2xl md:text-4xl font-bold mb-8">Частые вопросы</h2>
          <Accordion type="single" collapsible className="space-y-4">
            {data.faq.map((item, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`} className="bg-muted rounded-xl px-6">
                <AccordionTrigger className="text-left font-medium">{item.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-accent text-white text-center">
        <div className="container">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Закажите услугу прямо сейчас</h2>
          <p className="text-lg text-white/90 mb-8">Выезд за 30 минут. Работаем круглосуточно.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <a href="tel:+79069989888">📞 +7 (906) 998-98-88</a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={onOrderClick}>
              Заказать обратный звонок
            </Button>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Другие услуги</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {data.relatedServices.map((service, idx) => (
              <Link key={idx} to={service.url} className="p-6 bg-muted rounded-xl hover:shadow-lg transition-shadow group">
                <span className="text-3xl mb-3 block">{service.icon}</span>
                <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">{service.title}</h3>
                <p className="text-accent font-medium">{service.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
