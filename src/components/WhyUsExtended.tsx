import { Shield, Award, FileCheck, Clock, CheckCircle2 } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const sections = [
  {
    icon: Award,
    title: "Лицензии и квалификация",
    content: "Все специалисты нашей компании проходят обязательное обучение и аттестацию по программам Роспотребнадзора. Имеем лицензию на осуществление дезинфекционной деятельности и членство в СРО дезинфекторов. Регулярно повышаем квалификацию и следим за новыми методами борьбы с вредителями. Каждый мастер имеет личную книжку дезинфектора с отметками о прохождении медосмотров.",
    color: "text-primary"
  },
  {
    icon: Shield,
    title: "Безопасность препаратов — IV класс опасности",
    content: "Что означает IV класс опасности? Это минимальный уровень риска по классификации Роспотребнадзора — препараты малоопасны для человека и теплокровных животных. Все средства сертифицированы, имеют государственную регистрацию и разрешены для применения в жилых помещениях, детских и медицинских учреждениях. После обработки и проветривания (2-4 часа) помещение полностью безопасно для детей, пожилых людей и домашних питомцев. Препараты не оставляют пятен и неприятного запаха.",
    color: "text-green-600"
  },
  {
    icon: FileCheck,
    title: "Документы для проверок СЭС",
    content: "Предоставляем полный пакет документов, которые принимаются Роспотребнадзором и СЭС при любых проверках: договор на оказание услуг, акт выполненных работ с указанием площади и методов обработки, сертификаты соответствия на все препараты, свидетельства о государственной регистрации средств. Для предприятий общепита и пищевых производств ведём журналы учёта дезинфекционных мероприятий. Помогаем подготовиться к плановым проверкам и устранить замечания.",
    color: "text-blue-500"
  },
  {
    icon: Clock,
    title: "Гарантийные обязательства — до 30 дней сопровождения",
    content: "При лёгкой и средней степени заражения предоставляем гарантийное сопровождение до 30 дней. Что это значит: если в течение гарантийного периода проблема вернётся — проводим повторную обработку бесплатно или на льготных условиях (по решению мастера). Условия гарантии: соблюдение рекомендаций специалиста, отсутствие повторного заноса вредителей, подготовка помещения согласно инструкции. Все условия фиксируются в договоре и акте осмотра объекта.",
    color: "text-accent"
  }
];

const WhyUsExtended = () => {
  return (
    <section className="py-10 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-up" className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            Профессиональный подход к <span className="text-primary">каждому объекту</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Работаем по стандартам, которые гарантируют результат и безопасность
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {sections.map((section, index) => (
            <AnimatedSection 
              key={index} 
              animation="fade-up" 
              delay={index * 100}
              className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center`}>
                  <section.icon className={`w-6 h-6 ${section.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">{section.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Key points summary */}
        <div className="mt-8 md:mt-12 bg-muted/50 rounded-xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-primary">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-bold">100%</span>
              </div>
              <p className="text-xs text-muted-foreground">Лицензированные специалисты</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-primary">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-bold">IV класс</span>
              </div>
              <p className="text-xs text-muted-foreground">Безопасные препараты</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-primary">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-bold">30 дней</span>
              </div>
              <p className="text-xs text-muted-foreground">Гарантийное сопровождение</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-primary">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-bold">Полный пакет</span>
              </div>
              <p className="text-xs text-muted-foreground">Документы для СЭС</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsExtended;
