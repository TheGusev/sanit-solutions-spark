import { Microscope, Bug, Rat, Sparkles, Wind, FileCheck, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const services = [
  { icon: Microscope, title: "Дезинфекция квартиры", price: "от 2 000 ₽", href: "/uslugi/dezinfekciya" },
  { icon: Bug, title: "Дезинсекция (тараканы, клопы)", price: "от 2 500 ₽", href: "/uslugi/dezinsekciya" },
  { icon: Rat, title: "Дератизация", price: "от 3 000 ₽", href: "/uslugi/deratizaciya" },
  { icon: Sparkles, title: "Озонирование", price: "от 3 000 ₽", href: "/uslugi/ozonirovanie" },
  { icon: Wind, title: "Удаление запахов", price: "от 2 500 ₽", href: "/uslugi/dezodoraciya" },
  { icon: FileCheck, title: "Сертификация СЭС", price: "от 5 000 ₽", href: "/uslugi/sertifikaciya" },
];

const MiniPricing = () => {
  const scrollToPricing = () => {
    const element = document.getElementById("pricing-by-area");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-10 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Цены на <span className="text-primary">основные услуги</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto mb-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={index}
                to={service.href}
                className="group"
              >
                <div className="bg-card rounded-xl p-4 text-center shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-primary/20 h-full flex flex-col">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-sm font-medium text-foreground mb-2 leading-tight min-h-[2.5rem] group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-lg font-bold text-primary mb-2">{service.price}</p>
                  <span className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-auto group-hover:text-primary transition-colors">
                    Подробнее
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <Button
            onClick={scrollToPricing}
            variant="outline"
            size="lg"
            className="font-semibold"
          >
            Смотреть полный прайс
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MiniPricing;
