import { MapPin, Clock, Banknote, Phone, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { moscowDistricts, moscowRegion } from "@/data/serviceAreas";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const PricingByArea = () => {
  const { ref: tableRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: regionRef, isVisible: isRegionVisible } = useScrollAnimation({ threshold: 0.1 });

  const scrollToCalculator = () => {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
  };

  const getZoneColor = (id: string) => {
    if (["cao", "sao"].includes(id)) return "bg-green-500/20 text-green-700 dark:text-green-400";
    if (["zelenograd", "novomoskovsk", "troitsk"].includes(id)) return "bg-blue-500/20 text-blue-700 dark:text-blue-400";
    return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
  };

  const getRegionColor = (id: string) => {
    if (id === "mo_near") return "bg-green-500/20 text-green-700 dark:text-green-400";
    if (id === "mo_far") return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
    return "bg-blue-500/20 text-blue-700 dark:text-blue-400";
  };

  return (
    <section className="py-16 bg-muted/30" id="pricing-area">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            💰 Стоимость услуг по районам Москвы
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Прозрачное ценообразование без скрытых платежей. Выезд от 15 минут!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Moscow Districts Table */}
          <div ref={tableRef} className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border">
            <div className="bg-primary/10 px-6 py-4 border-b border-border">
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Округа Москвы
              </h3>
            </div>
            
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Округ</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Мин. цена</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Время выезда</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {moscowDistricts.map((district, index) => (
                    <tr 
                      key={district.id} 
                      className={`hover:bg-muted/30 transition-all duration-500 ${
                        isVisible 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-4'
                      }`}
                      style={{ transitionDelay: `${index * 80}ms` }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getZoneColor(district.id)}`}>
                            {district.name}
                          </span>
                          <span className="text-sm text-muted-foreground hidden lg:inline">
                            {district.fullName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-foreground">{district.price}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {district.responseTime}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-border">
              {moscowDistricts.map((district, index) => (
                <div 
                  key={district.id} 
                  className={`p-4 hover:bg-muted/30 transition-all duration-500 ${
                    isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getZoneColor(district.id)}`}>
                      {district.name}
                    </span>
                    <span className="font-semibold text-foreground">{district.price}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{district.fullName}</span>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {district.responseTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Moscow Region Table */}
          <div ref={regionRef} className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border">
            <div className="bg-primary/10 px-6 py-4 border-b border-border">
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Московская область
              </h3>
            </div>
            
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Зона</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Мин. цена</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Время выезда</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {moscowRegion.map((region, index) => (
                    <tr 
                      key={region.id} 
                      className={`hover:bg-muted/30 transition-all duration-500 ${
                        isRegionVisible 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-4'
                      }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <td className="px-4 py-3">
                        <div>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getRegionColor(region.id)}`}>
                            {region.name}
                          </span>
                          <p className="text-xs text-muted-foreground mt-1">{region.distance}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-foreground">{region.price}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {region.responseTime}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-border">
              {moscowRegion.map((region, index) => (
                <div 
                  key={region.id} 
                  className={`p-4 hover:bg-muted/30 transition-all duration-500 ${
                    isRegionVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getRegionColor(region.id)}`}>
                      {region.name}
                    </span>
                    <span className="font-semibold text-foreground">{region.price}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{region.distance}</span>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {region.responseTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="p-4 bg-muted/30 border-t border-border">
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-green-500/40"></span>
                  <span className="text-muted-foreground">Быстрый выезд</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-yellow-500/40"></span>
                  <span className="text-muted-foreground">Средняя зона</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-blue-500/40"></span>
                  <span className="text-muted-foreground">Отдалённые районы</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-card rounded-2xl p-6 border border-border mb-8">
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Banknote className="w-5 h-5 text-primary" />
            Важная информация о ценах
          </h4>
          <ul className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              Стоимость выезда за МКАД — от 300₽
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              Окончательная цена зависит от площади и степени заражения
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              Скидка 10% при повторном обращении
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              Бесплатная консультация и выезд на осмотр
            </li>
          </ul>
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
            variant="outline"
            asChild
          >
            <a href="tel:+79939289488" className="gap-2">
              <Phone className="w-5 h-5" />
              Позвонить для консультации
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingByArea;
