import { Bug, Rat, Wind, Flower, FileText, Microscope } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const services = [
  {
    icon: Microscope,
    title: "Дезинфекция",
    description: "Уничтожение вирусов, бактерий и грибков профессиональными средствами",
    color: "text-primary",
    link: "/uslugi/dezinfekciya"
  },
  {
    icon: Bug,
    title: "Дезинсекция",
    description: "Избавление от насекомых: тараканы, клопы, муравьи, комары",
    color: "text-orange-500",
    link: "/uslugi/dezinsekciya"
  },
  {
    icon: Rat,
    title: "Дератизация",
    description: "Борьба с грызунами: крысы, мыши, полёвки",
    color: "text-amber-700",
    link: "/uslugi/deratizaciya"
  },
  {
    icon: Wind,
    title: "Озонирование",
    description: "Глубокая очистка воздуха и устранение запахов",
    color: "text-sky-400"
  },
  {
    icon: Flower,
    title: "Дезодорация",
    description: "Устранение неприятных запахов любой интенсивности",
    color: "text-pink-400"
  },
  {
    icon: FileText,
    title: "Сертификация",
    description: "Полный пакет документов для проверяющих органов",
    color: "text-green-600"
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
                <p className="text-muted-foreground mt-2 md:mt-0">{service.description}</p>
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
