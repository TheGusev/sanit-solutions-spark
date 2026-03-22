import { Phone, Check, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import AnimatedSection from "@/components/AnimatedSection";
import { trackGoal, getYmGoalPrefix } from "@/lib/analytics";

interface Tariff {
  name: string;
  price: string;
  popular?: boolean;
  features: string[];
}

interface ServiceTariffsProps {
  tariffs: Tariff[];
  serviceTitle: string;
  serviceAccusative?: string;
}

const ServiceTariffs = ({ tariffs, serviceTitle, serviceAccusative }: ServiceTariffsProps) => {
  if (!tariffs || tariffs.length === 0) return null;

  return (
    <section className="py-12 md:py-20 bg-muted/30" id="tariffs">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Тарифы на {serviceAccusative || serviceTitle.toLowerCase()}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Выберите подходящий тариф — или позвоните для индивидуального расчёта
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {tariffs.map((tariff, idx) => (
            <AnimatedSection key={idx} animation="fade-up" delay={idx * 100}>
              <Card
                className={cn(
                  "h-full flex flex-col relative overflow-hidden transition-shadow",
                  tariff.popular
                    ? "border-primary border-2 shadow-lg md:scale-105 md:z-10"
                    : "border"
                )}
              >
                {tariff.popular && (
                  <div className="absolute top-0 right-0">
                    <Badge className="rounded-none rounded-bl-lg px-3 py-1.5 text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Популярный
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6 flex flex-col flex-1">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">{tariff.name}</h3>
                    <div className="text-3xl font-bold text-primary">
                      {tariff.price}
                    </div>
                  </div>

                  <ul className="space-y-3 flex-1 mb-6">
                    {tariff.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    size="lg"
                    variant={tariff.popular ? "default" : "outline"}
                    className="w-full min-h-[48px] text-base"
                    asChild
                  >
                    <a href="tel:84950181817">
                      <Phone className="w-4 h-4 mr-2" />
                      Заказать
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceTariffs;
