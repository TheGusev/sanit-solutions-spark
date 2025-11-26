import { Phone, Search, Beaker, CheckCircle } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const steps = [
  {
    number: 1,
    icon: Phone,
    title: "Звонок и консультация",
    description: "Бесплатная оценка ситуации по телефону. Ответим на все вопросы и подберём подходящее решение.",
    color: "text-primary"
  },
  {
    number: 2,
    icon: Search,
    title: "Диагностика помещения",
    description: "Выезд специалиста для осмотра. Определяем масштаб проблемы и составляем план обработки.",
    color: "text-blue-500"
  },
  {
    number: 3,
    icon: Beaker,
    title: "Профессиональная обработка",
    description: "Выполняем работы сертифицированными препаратами. Используем современное оборудование.",
    color: "text-purple-500"
  },
  {
    number: 4,
    icon: CheckCircle,
    title: "Проверка и сертификат",
    description: "Контрольная проверка результата. Выдаём документы и активируем гарантию на 30 дней.",
    color: "text-success"
  }
];

const WorkProcess = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-up" className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Как мы работаем?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Прозрачный процесс от заявки до гарантии результата
          </p>
        </AnimatedSection>

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
                  <step.icon className={`w-14 h-14 ${step.color}`} />
                </div>
                
                {/* Step Number */}
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mb-3 shadow-md">
                  {step.number}
                </div>

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

        {/* Mobile: Vertical Timeline */}
        <div className="md:hidden space-y-6 max-w-md mx-auto">
          {steps.map((step, index) => (
            <AnimatedSection
              key={index} 
              animation="fade-up"
              delay={index * 150}
              className="flex gap-3"
            >
              {/* Left: Icon + Number */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                  <step.icon className={`w-6 h-6 ${step.color}`} />
                </div>
                <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-12 bg-border mt-2"></div>
                )}
              </div>

              {/* Right: Content */}
              <div className="flex-1">
                <h3 className="text-base font-bold text-foreground mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkProcess;