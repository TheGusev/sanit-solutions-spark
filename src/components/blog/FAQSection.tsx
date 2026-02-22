import { HelpCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FAQItem[];
  className?: string;
}

const FAQSection = ({ items, className }: FAQSectionProps) => {
  if (!items || items.length === 0) return null;

  const faqLD = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className={cn("py-8 md:py-12 mx-auto max-w-3xl", className)}>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqLD)}</script>
      </Helmet>

      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Вопросы и ответы
        </h2>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <details
            key={i}
            className="group border border-border rounded-lg bg-card"
            {...(i === 0 ? { open: true } : {})}
          >
            <summary className="flex items-center justify-between cursor-pointer px-4 py-3.5 text-base md:text-lg font-medium text-foreground select-none min-h-[48px] list-none [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <span className="ml-2 shrink-0 text-muted-foreground transition-transform group-open:rotate-180">
                ▾
              </span>
            </summary>
            <div className="px-4 pb-4 text-base text-muted-foreground leading-[1.75]">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
