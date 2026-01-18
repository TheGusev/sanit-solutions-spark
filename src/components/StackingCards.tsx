import { Link } from "react-router-dom";
import { ArrowRight, Microscope, Bug, Rat, Sparkles, Wind, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCard {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  price: string;
  href: string;
  color: string;
}

const services: ServiceCard[] = [
  {
    id: 1,
    title: "Дезинфекция помещений",
    description: "Уничтожение вирусов, бактерий и микробов. Профессиональная обработка для безопасности вашего здоровья.",
    icon: Microscope,
    price: "от 2 000 ₽",
    href: "/uslugi/dezinfekciya",
    color: "from-blue-500/10 to-blue-600/5",
  },
  {
    id: 2,
    title: "Дезинсекция",
    description: "Уничтожение тараканов, клопов, муравьёв и других насекомых. Гарантия результата до 1 года.",
    icon: Bug,
    price: "от 2 500 ₽",
    href: "/uslugi/dezinsekciya",
    color: "from-amber-500/10 to-amber-600/5",
  },
  {
    id: 3,
    title: "Дератизация",
    description: "Борьба с крысами и мышами. Современные методы без вреда для людей и домашних животных.",
    icon: Rat,
    price: "от 3 000 ₽",
    href: "/uslugi/deratizaciya",
    color: "from-red-500/10 to-red-600/5",
  },
  {
    id: 4,
    title: "Озонирование",
    description: "Глубокая очистка воздуха и поверхностей озоном. Устранение запахов и аллергенов.",
    icon: Sparkles,
    price: "от 3 000 ₽",
    href: "/uslugi/ozonirovanie",
    color: "from-cyan-500/10 to-cyan-600/5",
  },
  {
    id: 5,
    title: "Дезодорация",
    description: "Профессиональное устранение неприятных запахов любого происхождения.",
    icon: Wind,
    price: "от 2 500 ₽",
    href: "/uslugi/dezodoraciya",
    color: "from-green-500/10 to-green-600/5",
  },
  {
    id: 6,
    title: "Сертификация СЭС",
    description: "Оформление санитарных документов для бизнеса. Подготовка к проверкам Роспотребнадзора.",
    icon: FileCheck,
    price: "от 5 000 ₽",
    href: "/uslugi/sertifikaciya",
    color: "from-purple-500/10 to-purple-600/5",
  },
];

const StackingCards = () => {
  return (
    <section id="services" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Наши услуги
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Профессиональные санитарные услуги для частных лиц и организаций в Москве и Московской области
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6 md:space-y-0">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.id}
                to={service.href}
                className={cn(
                  "block md:sticky bg-card border border-border rounded-2xl p-6 md:p-8",
                  "shadow-sm hover:shadow-lg transition-all duration-300",
                  "transform hover:-translate-y-1",
                  "group"
                )}
                style={{
                  // Stacking effect: each card sticks slightly lower
                  // @ts-ignore - CSS custom property
                  "--card-index": index,
                  top: `calc(var(--total-nav-height) + ${index * 12}px)`,
                  zIndex: 10 + index,
                }}
              >
                <div className={cn(
                  "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-50 transition-opacity duration-300 group-hover:opacity-100",
                  service.color
                )} />
                
                <div className="relative flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm md:text-base line-clamp-2">
                      {service.description}
                    </p>
                  </div>

                  {/* Price & Arrow */}
                  <div className="flex items-center justify-between md:flex-col md:items-end gap-2 md:gap-1 flex-shrink-0">
                    <span className="text-lg md:text-xl font-bold text-accent">
                      {service.price}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-primary font-medium group-hover:gap-2 transition-all">
                      Подробнее
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StackingCards;
