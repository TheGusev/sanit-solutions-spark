import { Bug, Rat, Wind, Flower, FileText, Microscope } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const services = [
  {
    icon: Microscope,
    title: "Дезинфекция",
    description: "Уничтожение вирусов, бактерий и грибков профессиональными средствами",
    color: "text-primary"
  },
  {
    icon: Bug,
    title: "Дезинсекция",
    description: "Избавление от насекомых: тараканы, клопы, муравьи, комары",
    isHit: true,
    color: "text-orange-500"
  },
  {
    icon: Rat,
    title: "Дератизация",
    description: "Борьба с грызунами: крысы, мыши, полёвки",
    color: "text-amber-700"
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
    <section id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-up" className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Наши <span className="text-primary">услуги</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Комплексные решения для защиты вашего здоровья и бизнеса
          </p>
        </AnimatedSection>

        <div ref={ref} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children ${isVisible ? 'visible' : ''}`}>
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-2xl shadow-sm hover-lift relative overflow-hidden"
            >
              {service.isHit && (
                <div className="absolute -top-1 -right-12 bg-gradient-accent text-accent-foreground px-12 py-1 text-xs font-bold rotate-45 shadow-lg">
                  ХИТ ПРОДАЖ
                </div>
              )}
              <div className="w-20 h-20 mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                <service.icon className={`w-10 h-10 ${service.color}`} />
              </div>
              <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
