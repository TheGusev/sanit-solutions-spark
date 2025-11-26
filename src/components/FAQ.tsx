import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AnimatedSection from "@/components/AnimatedSection";

const faqs = [
  {
    question: "Как долго действует обработка?",
    answer: "Эффект от профессиональной обработки сохраняется от 3 до 12 месяцев в зависимости от типа услуги и условий помещения. При соблюдении рекомендаций специалиста результат может быть ещё дольше."
  },
  {
    question: "Безопасно ли для людей и животных?",
    answer: "Да, мы используем только сертифицированные препараты, одобренные Роспотребнадзором. После обработки помещение полностью безопасно для людей и животных через 2-4 часа проветривания."
  },
  {
    question: "Сколько времени занимает обработка?",
    answer: "Время обработки зависит от площади помещения и типа услуги. Обычно обработка занимает от 30 минут до 2 часов. Наш специалист назовёт точное время после диагностики."
  },
  {
    question: "Нужна ли подготовка помещения?",
    answer: "Да, минимальная подготовка необходима: убрать продукты питания и посуду в закрытые шкафы, вынести домашних животных, провести влажную уборку. Наш специалист даст подробные инструкции при записи."
  },
  {
    question: "Какие документы вы предоставляете?",
    answer: "После выполнения работ мы предоставляем акт выполненных работ, гарантийный талон и сертификат соответствия на использованные препараты. Все документы официальные и заверены печатью компании."
  },
  {
    question: "Есть ли гарантия на услуги?",
    answer: "Да, мы предоставляем гарантию 30 дней на все виды обработки. Если в течение этого времени проблема вернётся, мы проведём повторную обработку бесплатно или вернём деньги."
  },
  {
    question: "Работаете ли вы в выходные?",
    answer: "Да, мы работаем без выходных с 8:00 до 22:00. Возможен срочный выезд в течение 2-3 часов. Стоимость обработки в выходные не отличается от будних дней."
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="py-8 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-up" className="text-center mb-6 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Частые вопросы
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Ответы на самые популярные вопросы о наших услугах
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={200} className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FAQ;