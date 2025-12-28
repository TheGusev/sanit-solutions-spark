import { useState } from "react";
import { servicePrices } from "@/data/servicePrices";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, ArrowDown, CheckCircle } from "lucide-react";
import { LeadFormModal } from "@/components/LeadFormModal";
import AnimatedSection from "@/components/AnimatedSection";

const PricingMinimal = () => {
  const [showLeadForm, setShowLeadForm] = useState(false);
  
  const popularServices = servicePrices.filter(s => s.isPopular);
  
  const scrollToFullPrices = () => {
    const element = document.getElementById("calculator");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="pricing" className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              💰 Популярные услуги
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Самые востребованные решения по доступным ценам
            </p>
          </div>
        </AnimatedSection>
        
        {/* Popular Services Grid */}
        <AnimatedSection animation="fade-up" delay={100}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto mb-8">
            {popularServices.map((service) => (
              <Card 
                key={service.id}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/80 backdrop-blur-sm"
              >
                <CardContent className="p-4 md:p-5 text-center">
                  <div className="text-3xl md:text-4xl mb-2">{service.icon}</div>
                  <h3 className="font-semibold text-foreground text-sm md:text-base mb-1 line-clamp-2">
                    {service.service}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                    {service.object}
                  </p>
                  <p className="text-lg md:text-xl font-bold text-primary">
                    {service.price}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimatedSection>

        {/* Benefits */}
        <AnimatedSection animation="fade-up" delay={200}>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Выезд от 15 мин</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Гарантия до 1 года</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Договор и акт</span>
            </div>
          </div>
        </AnimatedSection>

        {/* Single CTA */}
        <AnimatedSection animation="scale" delay={300}>
          <div className="flex flex-col items-center gap-4">
            <Button 
              size="lg"
              onClick={() => setShowLeadForm(true)}
              className="text-base md:text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
            >
              <Phone className="mr-2 h-5 w-5" />
              Заказать консультацию
            </Button>
            
            <button
              onClick={scrollToFullPrices}
              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              <ArrowDown className="h-4 w-4" />
              Все цены и калькулятор
            </button>
          </div>
        </AnimatedSection>
      </div>
      
      {/* Lead Form Modal */}
      <LeadFormModal
        open={showLeadForm}
        onOpenChange={setShowLeadForm}
        calculatorData={{
          premiseType: "Квартира",
          area: 50,
          serviceType: "Консультация",
          treatmentType: "standard",
          period: "Разовая",
          clientType: "Частное лицо",
          totalPrice: 2000,
          discount: 0,
          discountAmount: 0,
          finalPrice: 2000
        }}
      />
    </section>
  );
};

export default PricingMinimal;
