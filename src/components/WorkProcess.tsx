import { memo } from "react";
import { Phone, Search, Beaker, CheckCircle } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";

const steps = [
  {
    number: 1,
    icon: Phone,
    title: "Звонок и консультация",
    description: "Бесплатная оценка ситуации по телефону. Ответим на все вопросы и подберём подходящее решение.",
    borderClass: "card-border-blue",
    label: "ЗА 15 МИНУТ",
    labelColor: "text-primary",
  },
  {
    number: 2,
    icon: Search,
    title: "Диагностика помещения",
    description: "Выезд специалиста для осмотра. Определяем масштаб проблемы и составляем план обработки.",
    borderClass: "card-border-red",
    label: "ЧЕРЕЗ 1–3 ЧАСА",
    labelColor: "text-russia-red",
  },
  {
    number: 3,
    icon: Beaker,
    title: "Профессиональная обработка",
    description: "Выполняем работы сертифицированными препаратами. Используем современное оборудование.",
    borderClass: "card-border-green",
    label: "ЧЕРЕЗ 24 ЧАСА",
    labelColor: "text-[hsl(var(--patriot-green))]",
  },
  {
    number: 4,
    icon: CheckCircle,
    title: "Проверка и сертификат",
    description: "Контрольная проверка результата. Выдаём документы и активируем гарантию на 30 дней.",
    borderClass: "card-border-gold",
    label: "ГАРАНТИЯ",
    labelColor: "text-[hsl(var(--patriot-gold))]",
  }
];

const WorkProcess = memo(() => {
  return (
    <section className="py-8 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeading
          label="КАК МЫ РАБОТАЕМ"
          title="От звонка до чистого помещения"
          subtitle="Прозрачный процесс от заявки до гарантии результата"
        />

        {/* Desktop: Horizontal Timeline */}
        <div className="hidden md:flex relative max-w-6xl mx-auto">
          {/* Connection Line */}
          <div className="absolute top-16 left-0 right-0 h-0.5 bg-border timeline-line"></div>

          {steps.map((step, index) => (
            <AnimatedSection 
              key={index} 
              animation="scale"
              delay={index * 150}
              className="flex-1 relative"
            >
              <div className="flex flex-col items-center text-center px-4">
                {/* Icon Circle */}
                <div className="w-32 h-32 rounded-full bg-primary/10 border-4 border-background shadow-lg flex items-center justify-center mb-6 relative z-10 hover:scale-110 transition-transform">
                  <step.icon className={`w-14 h-14 ${step.labelColor}`} />
                </div>
                
                {/* Step Number */}
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mb-2 shadow-md">
                  {step.number}
                </div>

                {/* Timing Label */}
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${step.labelColor} mb-2`}>
                  {step.label}
                </span>

                {/* Content */}
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Mobile: Cards with colored left-border */}
        <div className="md:hidden space-y-4 max-w-md mx-auto">
          {steps.map((step, index) => (
            <AnimatedSection
              key={index} 
              animation="fade-up"
              delay={index * 150}
            >
              <div className={`bg-card rounded-xl p-4 shadow-sm border border-border ${step.borderClass}`}>
                <div className="flex items-start gap-3">
                  {/* Number Circle */}
                  <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm flex-shrink-0">
                    {step.number}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${step.labelColor}`}>
                      {step.label}
                    </span>
                    <h3 className="text-base font-bold text-foreground mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
});

WorkProcess.displayName = "WorkProcess";

export default WorkProcess;
