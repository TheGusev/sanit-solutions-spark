import { Shield, Microscope, Pill, FileText, BadgeDollarSign, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const details = [
  {
    icon: Shield,
    title: "30-дневная гарантия результата",
    description: "Гарантируем 100% результат на все виды услуг. Если проблема вернётся в течение 30 дней — повторная обработка бесплатно или полный возврат денег.",
    isHighlight: true,
    color: "text-accent"
  },
  {
    icon: Microscope,
    title: "Профессиональная диагностика",
    description: "Выезд специалиста для оценки ситуации и составления плана работ. Определяем масштаб проблемы и подбираем оптимальное решение.",
    color: "text-primary"
  },
  {
    icon: Pill,
    title: "Сертифицированные препараты",
    description: "Используем только профессиональные средства с подтверждёнными документами. Безопасно для людей и животных.",
    color: "text-blue-500"
  },
  {
    icon: FileText,
    title: "Официальное оформление",
    description: "Предоставляем все необходимые документы: договор, акт выполненных работ, сертификаты на препараты.",
    color: "text-green-600"
  },
  {
    icon: Shield,
    title: "Гарантия качества",
    description: "Гарантируем результат на все виды услуг. При необходимости проводим повторную обработку бесплатно.",
    color: "text-success"
  },
  {
    icon: BadgeDollarSign,
    title: "Гибкая система скидок",
    description: "Скидки от площади помещения, постоянным клиентам, при заключении договоров на обслуживание.",
    color: "text-orange-500"
  },
  {
    icon: Zap,
    title: "Экстренный выезд",
    description: "Срочная обработка в течение 2-х часов по Москве. Работаем 24/7 без выходных и праздников.",
    color: "text-yellow-500"
  }
];

const Details = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Почему <span className="text-primary">выбирают нас</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Надёжность, качество и профессионализм в каждой детали
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {details.map((detail, index) => (
          <div
            key={index}
            className={`p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl shadow-sm hover-lift transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            } ${
              detail.isHighlight
                ? "gradient-accent text-white col-span-1 md:col-span-2 lg:col-span-3 border-4 border-accent/30"
                : "bg-card"
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-3 md:block mb-3 md:mb-0">
              <div className={cn(
                "flex-shrink-0 md:w-14 md:h-14 lg:w-16 lg:h-16 md:mb-4 md:rounded-xl flex items-center justify-center",
                detail.isHighlight ? "md:bg-accent/20 md:animate-pulse-attention" : "md:bg-primary/10"
              )}>
                <detail.icon className={cn("w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8", detail.isHighlight ? "text-white" : detail.color)} />
              </div>
              <h3 className={`text-lg md:text-xl font-bold md:mb-3 ${detail.isHighlight ? "md:text-2xl" : ""}`}>
                {detail.title}
              </h3>
            </div>
            <p className={`leading-relaxed ${detail.isHighlight ? "text-white/90 md:text-lg" : "text-muted-foreground"}`}>
              {detail.description}
            </p>
          </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Details;
