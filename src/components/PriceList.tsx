import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Microscope, Bug, Rat, Wind, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const priceData = [
  {
    service: "Дезинфекция",
    icon: Microscope,
    color: "text-primary",
    prices: {
      small: "от 2 500₽",
      medium: "от 4 500₽",
      large: "от 6 500₽",
      xlarge: "договорная"
    }
  },
  {
    service: "Дезинсекция",
    subtitle: "(клопы, тараканы)",
    icon: Bug,
    color: "text-orange-500",
    isHit: true,
    prices: {
      small: "от 3 000₽",
      medium: "от 5 400₽",
      large: "от 7 800₽",
      xlarge: "договорная"
    }
  },
  {
    service: "Дератизация",
    subtitle: "(грызуны)",
    icon: Rat,
    color: "text-green-500",
    prices: {
      small: "от 2 750₽",
      medium: "от 4 950₽",
      large: "от 7 150₽",
      xlarge: "договорная"
    }
  },
  {
    service: "Озонирование",
    icon: Wind,
    color: "text-blue-500",
    prices: {
      small: "от 2 000₽",
      medium: "от 3 500₽",
      large: "от 5 000₽",
      xlarge: "договорная"
    }
  },
  {
    service: "Комплексная обработка",
    icon: Sparkles,
    color: "text-purple-500",
    prices: {
      small: "от 4 500₽",
      medium: "от 8 100₽",
      large: "от 11 700₽",
      xlarge: "договорная"
    }
  }
];

const propertyTypes = [
  { key: "small", label: "до 50м²" },
  { key: "medium", label: "до 100м²" },
  { key: "large", label: "Дом/Офис" },
  { key: "xlarge", label: "от 200м²" }
];

const PriceList = () => {
  const { ref, isVisible } = useScrollAnimation();

  const scrollToCalculator = () => {
    const calculator = document.querySelector('#calculator');
    if (calculator) {
      calculator.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section ref={ref} className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h2 className="text-3xl md:text-4xl font-bold">Цены на услуги</h2>
              <Badge className="bg-orange-500 text-white hover:bg-orange-600">
                Скидка до 30%
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ориентировочные цены на наши услуги. Точную стоимость рассчитайте в калькуляторе ниже.
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left py-4 px-6 font-semibold">Услуга</th>
                  {propertyTypes.map((type) => (
                    <th key={type.key} className="text-center py-4 px-4 font-semibold">
                      {type.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {priceData.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-b border-border hover:bg-accent/50 transition-colors ${
                      index % 2 === 0 ? "bg-muted/20" : ""
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-background ${item.color}`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.service}</span>
                            {item.isHit && (
                              <Badge className="bg-orange-500 text-white text-xs">
                                ХИТ
                              </Badge>
                            )}
                          </div>
                          {item.subtitle && (
                            <span className="text-sm text-muted-foreground">
                              {item.subtitle}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    {propertyTypes.map((type) => (
                      <td key={type.key} className="text-center py-4 px-4 font-medium">
                        {item.prices[type.key as keyof typeof item.prices]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="grid gap-4 md:hidden">
            {priceData.map((item, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg bg-muted ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{item.service}</h3>
                      {item.isHit && (
                        <Badge className="bg-orange-500 text-white text-xs">
                          ХИТ
                        </Badge>
                      )}
                    </div>
                    {item.subtitle && (
                      <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {propertyTypes.map((type) => (
                    <div key={type.key} className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-xs text-muted-foreground mb-1">
                        {type.label}
                      </div>
                      <div className="font-semibold">
                        {item.prices[type.key as keyof typeof item.prices]}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              Точную стоимость рассчитайте в калькуляторе с учетом ваших условий
            </p>
            <Button
              size="lg"
              onClick={scrollToCalculator}
              className="gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Рассчитать точную стоимость
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceList;
