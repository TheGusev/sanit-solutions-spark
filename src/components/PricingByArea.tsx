import { useState } from "react";
import { MapPin, Clock, Calculator, Phone, CheckCircle, Gift, Info, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { moscowDistricts, moscowRegion } from "@/data/serviceAreas";
import { servicePrices, includedServices, discounts } from "@/data/servicePrices";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { LeadFormModal } from "@/components/LeadFormModal";

const PricingByArea = () => {
  const { ref: tableRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: surchargeRef, isVisible: isSurchargeVisible } = useScrollAnimation({ threshold: 0.1 });
  const [showLeadForm, setShowLeadForm] = useState(false);

  const scrollToCalculator = () => {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
  };

  const getSurchargeColor = (surcharge: string) => {
    if (surcharge === "Бесплатно") return "bg-green-500/20 text-green-700 dark:text-green-400";
    if (surcharge === "По запросу") return "bg-blue-500/20 text-blue-700 dark:text-blue-400";
    if (surcharge.includes("+1500") || surcharge.includes("+1000")) return "bg-blue-500/20 text-blue-700 dark:text-blue-400";
    return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
  };

  return (
    <section className="py-16 bg-muted/30" id="pricing-area">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            💰 Цены на услуги
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Прозрачное ценообразование. Выезд в пределах МКАД — от 15 минут!
          </p>
        </div>

        {/* Main Prices Table */}
        <div ref={tableRef} className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border mb-8">
          <div className="bg-primary/10 px-6 py-4 border-b border-border">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Базовые цены на услуги
            </h3>
          </div>
          
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Услуга</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Объект</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Цена</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {servicePrices.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-muted/30 transition-all duration-500 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/10'} ${
                      isVisible 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-4'
                    }`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <td className="px-4 py-3">
                      <span className="font-semibold text-foreground">{item.service}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-muted-foreground">{item.object}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-primary text-lg">{item.price}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-border">
            {servicePrices.map((item, index) => (
              <div 
                key={item.id} 
                className={`p-4 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/10'} transition-all duration-500 ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-foreground">{item.service}</span>
                  <span className="font-bold text-primary">{item.price}</span>
                </div>
                <span className="text-sm text-muted-foreground">{item.object}</span>
              </div>
            ))}
          </div>

          {/* Notes under table */}
          <div className="p-4 bg-muted/30 border-t border-border">
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Info className="w-3 h-3 text-primary" />
                <span>Цены указаны для ЦАО/САО (выезд бесплатно)</span>
              </div>
              <div className="flex items-center gap-1">
                <Gift className="w-3 h-3 text-primary" />
                <span>Скидка 15% при заказе 2+ услуг</span>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Surcharges Section */}
        <div ref={surchargeRef} className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Moscow Districts */}
          <div className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border">
            <div className="bg-primary/10 px-6 py-4 border-b border-border">
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Car className="w-5 h-5 text-primary" />
                Доплата за выезд — Москва
              </h3>
            </div>
            
            <div className="divide-y divide-border">
              {moscowDistricts.map((district, index) => (
                <div 
                  key={district.id} 
                  className={`p-4 hover:bg-muted/30 transition-all duration-500 ${
                    isSurchargeVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${index * 60}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{district.fullName}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSurchargeColor(district.surcharge)}`}>
                      {district.surcharge === "Бесплатно" ? "✓ Бесплатно" : district.surcharge}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {district.responseTime}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Moscow Region */}
          <div className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border">
            <div className="bg-primary/10 px-6 py-4 border-b border-border">
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Доплата за выезд — Подмосковье
              </h3>
            </div>
            
            <div className="divide-y divide-border">
              {moscowRegion.map((region, index) => (
                <div 
                  key={region.id} 
                  className={`p-4 hover:bg-muted/30 transition-all duration-500 ${
                    isSurchargeVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-foreground">{region.name}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">{region.distance}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSurchargeColor(region.surcharge)}`}>
                      {region.surcharge}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {region.responseTime}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="p-4 bg-muted/30 border-t border-border">
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-green-500/40"></span>
                  <span className="text-muted-foreground">Бесплатно</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-yellow-500/40"></span>
                  <span className="text-muted-foreground">+500 ₽</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-blue-500/40"></span>
                  <span className="text-muted-foreground">+1000 ₽ и более</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What's Included & Discounts */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* What's Included */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Что входит в стоимость
            </h4>
            <ul className="space-y-3">
              {includedServices.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Discounts */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              Скидки и акции
            </h4>
            <ul className="space-y-3">
              {discounts.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="flex-shrink-0">{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={scrollToCalculator}
            className="gap-2"
          >
            <Calculator className="w-5 h-5" />
            Рассчитать точную стоимость
          </Button>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => setShowLeadForm(true)}
            className="gap-2"
          >
            <Gift className="w-5 h-5" />
            Заказать со скидкой 15%
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            asChild
          >
            <a href="tel:+79939289488" className="gap-2">
              <Phone className="w-5 h-5" />
              Позвонить
            </a>
          </Button>
        </div>
      </div>

      {/* Lead Form Modal */}
      <LeadFormModal 
        open={showLeadForm}
        onOpenChange={setShowLeadForm}
        calculatorData={{
          premiseType: "По запросу",
          area: 0,
          serviceType: "Комплексный заказ",
          treatmentType: "По согласованию",
          period: "Разовая обработка",
          clientType: "Физическое лицо",
          totalPrice: 0,
          discount: 15,
          discountAmount: 0,
          finalPrice: 0
        }}
      />
    </section>
  );
};

export default PricingByArea;
