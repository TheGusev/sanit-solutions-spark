import { Shield, Microscope, Pill, FileText, BadgeDollarSign, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const details = [
  {
    icon: Shield,
    title: "До 30 дней гарантийного сопровождения",
    description: "При лёгкой и средней степени заражения и соблюдении рекомендаций специалиста мы сопровождаем объект до 30 дней: при необходимости проводим повторную обработку тех же зон на льготных условиях или бесплатно — по решению мастера.",
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
  const [isGuaranteeDialogOpen, setIsGuaranteeDialogOpen] = useState(false);

  return (
    <section className="py-10 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-8 md:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
            {detail.isHighlight && (
              <div className="mt-4 space-y-3">
                <p className="text-xs text-white/70 leading-relaxed">
                  * Точные условия гарантийного сопровождения (степень заражения, подготовка помещения, отсутствие самостоятельных обработок до нашего визита, наличие детей, пожилых людей и животных и др.) фиксируются в договоре и акте осмотра. Безопасность жильцов всегда имеет приоритет.
                </p>
                <Dialog open={isGuaranteeDialogOpen} onOpenChange={setIsGuaranteeDialogOpen}>
                  <DialogTrigger asChild>
                    <button className="text-sm text-white underline hover:text-white/80 transition-colors">
                      Условия гарантии
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">Условия гарантийного сопровождения</DialogTitle>
                      <DialogDescription className="text-base mt-4">
                        Для предоставления гарантийного сопровождения необходимо соблюдение следующих условий:
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="flex gap-3">
                        <span className="text-green-600 dark:text-green-400 font-bold flex-shrink-0">✓</span>
                        <p className="text-muted-foreground leading-relaxed">
                          <strong>Степень заражения:</strong> При первичной обработке степень заражения не выше 1 балла (не массовое заселение, нет старых очагов)
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-green-600 dark:text-green-400 font-bold flex-shrink-0">✓</span>
                        <p className="text-muted-foreground leading-relaxed">
                          <strong>Отсутствие самолечения:</strong> До нашего визита не проводились самостоятельные обработки бытовой химией, которые снижают эффективность профессиональных препаратов
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-green-600 dark:text-green-400 font-bold flex-shrink-0">✓</span>
                        <p className="text-muted-foreground leading-relaxed">
                          <strong>Подготовка помещения:</strong> Клиент подготовил помещение и соблюдает рекомендации мастера (уборка, доступ к зонам обработки, отсутствие повторного заноса и т.п.)
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-green-600 dark:text-green-400 font-bold flex-shrink-0">✓</span>
                        <p className="text-muted-foreground leading-relaxed">
                          <strong>Безопасность жильцов:</strong> При наличии грудных детей, беременных, пожилых, хронических заболеваний и животных схема обработки может быть щадящей, поэтому результат достигается поэтапно, с возможными повторными визитами
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-green-600 dark:text-green-400 font-bold flex-shrink-0">✓</span>
                        <p className="text-muted-foreground leading-relaxed">
                          <strong>Документальное оформление:</strong> Все детали и объём гарантий прописываются в договоре и акте осмотра объекта
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Details;
