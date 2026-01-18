import { Link } from 'react-router-dom';
import { Microscope, Bug, Rat, Sparkles, Wind, FileCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const services = [
  {
    icon: Bug,
    title: 'Дезинсекция',
    price: 'от 2 500 ₽',
    href: '/uslugi/dezinsekciya',
    description: 'Уничтожение насекомых',
  },
  {
    icon: Microscope,
    title: 'Дезинфекция',
    price: 'от 2 000 ₽',
    href: '/uslugi/dezinfekciya',
    description: 'Уничтожение вирусов и бактерий',
  },
  {
    icon: Rat,
    title: 'Дератизация',
    price: 'от 3 000 ₽',
    href: '/uslugi/deratizaciya',
    description: 'Уничтожение грызунов',
  },
  {
    icon: Sparkles,
    title: 'Озонирование',
    price: 'от 3 000 ₽',
    href: '/uslugi/ozonirovanie',
    description: 'Очистка воздуха озоном',
  },
  {
    icon: Wind,
    title: 'Дезодорация',
    price: 'от 2 500 ₽',
    href: '/uslugi/dezodoraciya',
    description: 'Устранение неприятных запахов',
  },
  {
    icon: FileCheck,
    title: 'Сертификация СЭС',
    price: 'от 5 000 ₽',
    href: '/uslugi/sertifikaciya',
    description: 'Санитарные документы',
  },
];

const CardServices = () => {
  return (
    <section
      id="uslugi"
      className="stacking-card"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-8 md:mb-12 text-center">
          Наши услуги
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.title}
                to={service.href}
                className="group bg-muted/50 hover:bg-muted rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {service.description}
                    </p>
                    <p className="text-accent font-bold">{service.price}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Подробнее
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CardServices;
