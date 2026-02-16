demercurizaciyaimport { Microscope, Bug, Rat, Sparkles, Wind, AlertTriangle, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const services = [
  { icon: Microscope, title: "Дезинфекция квартиры", href: "/uslugi/dezinfekciya" },
  { icon: Bug, title: "Дезинсекция (тараканы, клопы)", href: "/uslugi/dezinsekciya" },
  { icon: Rat, title: "Дератизация", href: "/uslugi/deratizaciya" },
  { icon: Sparkles, title: "Озонирование", href: "/uslugi/ozonirovanie" },
  { icon: Wind, title: "Удаление запахов", href: "/uslugi/dezodoraciya" },
  { icon: AlertTriangle, title: "Демеркуризация", href: "/uslugi/demerkurizaciya" },
];

const MiniPricing = ({ citySlug }: { citySlug?: string }) => {
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
          Наши основные услуги
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto mb-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={index}
                to={citySlug ? `/goroda/${citySlug}${service.href}` : service.href}
                className="group"
              >
                <div className="bg-card rounded-xl p-4 text-center shadow-sm hover:shadow-lg transition-all">
                  <h3 className="text-sm font-medium text-foreground mb-3 leading-tight min-h-[2.5rem]">
                    {service.title}
                  </h3>
                  <span className="text-xs text-muted-foreground flex items-center justify-center">
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

