/**
 * === CARD 6: FAQ ===
 * Аккордеон с частыми вопросами
 * 
 * @section id="faq"
 * @seo Schema.org FAQPage markup
 */

import { dezinfekciyaData } from '@/data/dezinfekciyaData';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Phone, MessageCircle, HelpCircle } from 'lucide-react';

interface CardFAQProps {
  onOrderClick: () => void;
}

const CardFAQ = ({ onOrderClick }: CardFAQProps) => {
  const { faq } = dezinfekciyaData;

  return (
    <section 
      id="faq"
      className="service-card relative min-h-[80vh] flex items-center bg-muted/30"
      aria-labelledby="faq-heading"
    >
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Заголовок */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 text-primary mb-3">
            <HelpCircle className="w-6 h-6" />
            <span className="text-sm font-medium uppercase tracking-wider">FAQ</span>
          </div>
          <h2 
            id="faq-heading"
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3"
          >
            Частые вопросы о дезинфекции
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ответы на популярные вопросы наших клиентов
          </p>
        </div>

        {/* Аккордеон */}
        <div className="max-w-3xl mx-auto mb-10">
          <Accordion type="single" collapsible className="space-y-3">
            {faq.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card rounded-xl border border-border/50 px-5 md:px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left text-base md:text-lg font-medium py-4 md:py-5 hover:no-underline hover:text-primary">
                  <span className="flex items-start gap-3">
                    <span className="text-primary">❓</span>
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 md:pb-5 pl-8">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA секция */}
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-muted-foreground mb-6">
            Не нашли ответ на свой вопрос? Свяжитесь с нами!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={onOrderClick}
              className="text-base px-8"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Заказать дезинфекцию
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              asChild
              className="text-base px-8"
            >
              <a href="tel:+79069989888">
                <Phone className="w-5 h-5 mr-2" />
                +7 (906) 998-98-88
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardFAQ;
