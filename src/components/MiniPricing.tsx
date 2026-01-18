import { Microscope, Bug, Rat, Sparkles, Wind, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  { icon: Microscope, title: "Дезинфекция квартиры", price: "от 1 000 ₽" },
  { icon: Bug, title: "Дезинсекция (тараканы, клопы)", price: "от 1 200 ₽" },
  { icon: Rat, title: "Дератизация", price: "от 1 400 ₽" },
  { icon: Sparkles, title: "Озонирование", price: "от 800 ₽" },
  { icon: Wind, title: "Удаление запахов", price: "от 1 000 ₽" },
  { icon: FileCheck, title: "Сертификация СЭС", price: "от 2 000 ₽" },
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
              <div
                key={index}
                className="bg-card rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-sm font-medium text-foreground mb-2 leading-tight min-h-[2.5rem]">
                  {service.title}
                </h3>
                <p className="text-lg font-bold text-primary">{service.price}</p>
              </div>
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
