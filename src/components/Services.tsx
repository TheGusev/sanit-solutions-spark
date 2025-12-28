import { Bug, Rat, Wind, Flower, FileText, Microscope } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const services = [
  {
    icon: Microscope,
    title: "Дезинфекция",
    shortDescription: "Уничтожение вирусов, бактерий и грибков профессиональными средствами",
    fullDescription: "Профессиональная дезинфекция помещений включает комплексное уничтожение вирусов, бактерий, грибков и плесени. Применяем методы холодного и горячего тумана, которые проникают во все труднодоступные места — щели, вентиляцию, за мебель. Когда нужна дезинфекция: после ремонта, при появлении плесени, после инфекционных заболеваний, подготовка к проверке СЭС, профилактика в офисах и на производстве. Процесс работы: выезд специалиста → диагностика объекта → обработка сертифицированными препаратами → контроль результата → гарантийное сопровождение до 30 дней.",
    color: "text-primary",
    link: "/uslugi/dezinfekciya"
  },
  {
    icon: Bug,
    title: "Дезинсекция",
    shortDescription: "Избавление от насекомых: тараканы, клопы, муравьи, комары",
    fullDescription: "Дезинсекция — это профессиональное уничтожение насекомых-вредителей: тараканов, клопов, муравьёв, блох, комаров, мух. Используем препараты пролонгированного действия с эффектом «домино» — насекомые переносят средство в гнёзда и заражают сородичей. Когда нужна дезинсекция: появление насекомых в квартире или офисе, профилактика перед заселением, регулярная обработка пищевых производств и общепита. Процесс работы: осмотр помещения → определение вида и степени заражения → барьерная обработка → контроль через 10-14 дней → гарантия до 1 года при соблюдении рекомендаций.",
    color: "text-orange-500",
    link: "/uslugi/dezinsekciya"
  },
  {
    icon: Rat,
    title: "Дератизация",
    shortDescription: "Борьба с грызунами: крысы, мыши, полёвки",
    fullDescription: "Дератизация помещений — уничтожение крыс, мышей и полёвок. Применяем комплексный подход: установка приманочных станций с родентицидами, ловушки, барьерная защита периметра. Когда нужна дератизация: обнаружены следы грызунов (помёт, погрызы), порча продуктов и упаковки, характерный запах, шорохи в стенах и под полом. Процесс работы: осмотр объекта → выявление путей проникновения → установка приманок в безопасных местах → герметизация ходов → контрольные проверки → документы для СЭС.",
    color: "text-amber-700",
    link: "/uslugi/deratizaciya"
  },
  {
    icon: Wind,
    title: "Озонирование",
    shortDescription: "Глубокая очистка воздуха и устранение запахов",
    fullDescription: "Озонирование — экологичный метод глубокой очистки воздуха и поверхностей. Озон (O₃) проникает в структуру материалов и окисляет органические загрязнения на молекулярном уровне. Эффективно против вирусов, бактерий, спор плесени и неприятных запахов. Когда нужно озонирование: после ремонта или пожара, устранение запаха табака или сырости, дезинфекция автомобилей, обработка медицинских и детских учреждений. После проветривания (30-60 минут) помещение полностью безопасно для людей и животных.",
    color: "text-sky-400",
    link: "/uslugi/ozonirovanie"
  },
  {
    icon: Flower,
    title: "Дезодорация",
    shortDescription: "Устранение неприятных запахов любой интенсивности",
    fullDescription: "Профессиональная дезодорация устраняет неприятные запахи, а не маскирует их. Нейтрализуем источники на молекулярном уровне: запахи после пожара, от домашних животных, табака, плесени, канализации, трупные запахи. Применяем комбинацию методов: сухой туман, озонирование, ферментные нейтрализаторы. Когда нужна дезодорация: стойкий запах не выветривается, продажа или аренда недвижимости, после затопления или пожара. Результат — полное устранение запаха, а не временная маскировка.",
    color: "text-pink-400",
    link: "/uslugi/dezodoraciya"
  },
  {
    icon: FileText,
    title: "Сертификация",
    shortDescription: "Полный пакет документов для проверяющих органов",
    fullDescription: "Подготовка документов для СЭС, Роспотребнадзора и других проверяющих органов. Выдаём полный пакет: договор на оказание услуг, акт выполненных работ, сертификаты на препараты, журналы учёта дезинфекционных мероприятий. Когда нужна сертификация: открытие бизнеса (общепит, магазин, производство), плановые и внеплановые проверки СЭС, продление санитарных разрешений. Помогаем подготовиться к проверке: консультация, оформление журналов, рекомендации по устранению нарушений.",
    color: "text-green-600",
    link: "/uslugi/sertifikaciya"
  }
];

const Services = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section id="services" className="py-10 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-up" className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Наши <span className="text-primary">услуги</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Комплексные решения для защиты вашего здоровья и бизнеса
          </p>
        </AnimatedSection>

        <div ref={ref} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 stagger-children ${isVisible ? 'visible' : ''}`}>
          {services.map((service, index) => {
            const CardContent = (
            <>
                <div className="flex items-center gap-3 md:block">
                  <div className="flex-shrink-0 md:w-16 md:h-16 lg:w-20 lg:h-20 md:mb-4 md:rounded-xl md:bg-primary/10 flex items-center justify-center">
                    <service.icon className={`w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 ${service.color}`} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold md:mb-3">{service.title}</h3>
                </div>
                <p className="text-muted-foreground mt-2 md:mt-0 text-sm md:text-base">{service.shortDescription}</p>
                <p className="text-muted-foreground/80 mt-3 text-sm leading-relaxed hidden md:block">{service.fullDescription}</p>
                {service.link && (
                  <span className="inline-block mt-3 text-primary font-medium text-sm">
                    Подробнее →
                  </span>
                )}
              </>
            );

            if (service.link) {
              return (
                <Link
                  key={index}
                  to={service.link}
                  className="bg-card p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl shadow-sm hover-lift relative overflow-hidden block hover:shadow-md transition-shadow"
                >
                  {CardContent}
                </Link>
              );
            }

            return (
              <div
                key={index}
                className="bg-card p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl shadow-sm hover-lift relative overflow-hidden"
              >
                {CardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
