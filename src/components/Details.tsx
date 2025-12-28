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
    description: "При лёгкой и средней степени заражения и соблюдении рекомендаций специалиста мы сопровождаем объект до 30 дней: при необходимости проводим повторную обработку тех же зон на льготных условиях или бесплатно — по решению мастера. Гарантия распространяется на обработанные зоны и фиксируется в договоре.",
    isHighlight: true,
    color: "text-accent"
  },
  {
    icon: Microscope,
    title: "Профессиональная диагностика",
    description: "Выезд специалиста для детальной оценки ситуации и составления плана работ. Определяем масштаб проблемы, выявляем источники заражения, пути проникновения вредителей. Подбираем оптимальное решение с учётом особенностей объекта: наличия детей, животных, аллергиков. Диагностика бесплатна при заказе обработки.",
    color: "text-primary"
  },
  {
    icon: Pill,
    title: "Сертифицированные препараты IV класса опасности",
    description: "Используем только профессиональные средства с государственной регистрацией и сертификатами соответствия. IV класс опасности — минимальный риск для человека и животных по классификации Роспотребнадзора. После проветривания (2-4 часа) помещение полностью безопасно для всех членов семьи, включая детей и питомцев.",
    color: "text-blue-500"
  },
  {
    icon: FileText,
    title: "Официальное оформление для СЭС",
    description: "Предоставляем полный пакет документов, который принимается при любых проверках: договор на оказание услуг, акт выполненных работ с указанием площади и методов, сертификаты на все препараты. Для предприятий общепита и пищевых производств ведём журналы учёта дезинфекционных мероприятий.",
    color: "text-green-600"
  },
  {
    icon: BadgeDollarSign,
    title: "Гибкая система скидок",
    description: "Скидки от площади помещения (от 50 м² — минус 10%), постоянным клиентам (от второго заказа — минус 15%), при заключении договоров на регулярное обслуживание (ежемесячно или ежеквартально). Для управляющих компаний и ТСЖ — специальные условия на обработку подъездов и подвалов.",
    color: "text-orange-500"
  },
  {
    icon: Zap,
    title: "Экстренный выезд 24/7",
    description: "Срочная обработка в течение 2-х часов по Москве и в течение 3-х часов по Московской области. Работаем круглосуточно, без выходных и праздников. Экстренный выезд актуален при подготовке к проверке СЭС, массовом появлении вредителей, для гостиниц и общепита с непрерывным циклом работы.",
    color: "text-yellow-500"
  }
];

const guaranteeConditions = [
  {
    title: "Степень заражения",
    description: "При первичной обработке степень заражения не выше 1 балла (не массовое заселение, нет старых очагов)"
  },
  {
    title: "Отсутствие самолечения",
    description: "До нашего визита не проводились самостоятельные обработки бытовой химией, которые снижают эффективность профессиональных препаратов"
  },
  {
    title: "Подготовка помещения",
    description: "Клиент подготовил помещение и соблюдает рекомендации мастера (уборка, доступ к зонам обработки, отсутствие повторного заноса и т.п.)"
  },
  {
    title: "Безопасность жильцов",
    description: "При наличии грудных детей, беременных, пожилых, хронических заболеваний и животных схема обработки может быть щадящей, поэтому результат достигается поэтапно, с возможными повторными визитами"
  },
  {
    title: "Документальное оформление",
    description: "Все детали и объём гарантий прописываются в договоре и акте осмотра объекта"
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
                  <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto mx-4 sm:mx-0">
                    <DialogHeader className="animate-fade-in-up">
                      <DialogTitle className="text-2xl">Условия гарантийного сопровождения</DialogTitle>
                      <DialogDescription className="text-base mt-4">
                        Для предоставления гарантийного сопровождения необходимо соблюдение следующих условий:
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      {guaranteeConditions.map((condition, index) => (
                        <div 
                          key={index}
                          className="flex gap-3 opacity-0 animate-fade-in-up"
                          style={{ animationDelay: `${(index + 1) * 100}ms` }}
                        >
                          <span 
                            className="text-green-600 dark:text-green-400 font-bold flex-shrink-0 opacity-0 animate-scale-in"
                            style={{ animationDelay: `${(index + 1) * 100 + 50}ms` }}
                          >
                            ✓
                          </span>
                          <p className="text-muted-foreground leading-relaxed">
                            <strong>{condition.title}:</strong> {condition.description}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t opacity-0 animate-fade-in-up" style={{ animationDelay: "700ms" }}>
                      <button 
                        onClick={() => setIsGuaranteeDialogOpen(false)}
                        className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                      >
                        Понятно
                      </button>
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
