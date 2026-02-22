import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface VisibleFAQProps {
  faq: FAQItem[];
}

const VisibleFAQ = ({ faq }: VisibleFAQProps) => {
  if (!faq || faq.length === 0) return null;

  return (
    <section className="py-8 md:py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-6 h-6 text-primary" />
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Вопросы и ответы
          </h2>
        </div>
        <Accordion type="single" collapsible defaultValue="faq-0">
          {faq.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-base md:text-lg font-medium min-h-[48px] py-4">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-[1.75]">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default VisibleFAQ;
