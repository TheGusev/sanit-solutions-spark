import { useState } from "react";
import { moscowDistricts, moscowRegion, ServiceArea } from "@/data/serviceAreas";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, MapPin, Phone } from "lucide-react";
import YandexMap from "@/components/YandexMap";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ServiceAreaMap = () => {
  const [selectedArea, setSelectedArea] = useState<ServiceArea>(moscowDistricts[0]);

  return (
    <section className="py-10 md:py-20 bg-background" id="service-areas">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">
            🗺️ Зоны обслуживания
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
            Работаем по всей Москве и Московской области с быстрым выездом
          </p>
        </div>
        
        {/* SEO text block - hidden on mobile */}
        <div className="hidden md:block max-w-4xl mx-auto mb-10 space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            <strong className="text-foreground">Работаем во всех округах Москвы</strong> — от центра до МКАД. 
            Время выезда специалиста в пределах МКАД составляет от 30 минут до 1 часа. 
            По Московской области время выезда — от 1 до 3 часов в зависимости от удалённости населённого пункта. 
            Обслуживаем Подольск, Мытищи, Химки, Балашиху, Королёв, Люберцы и другие города ближнего и дальнего Подмосковья.
          </p>
          <p className="leading-relaxed">
            <strong className="text-foreground">Особенности работы в частном секторе:</strong> для владельцев 
            загородных домов, коттеджей и дач предлагаем комплексные решения — дополнительно обрабатываем 
            прилегающую территорию, подвалы, чердаки, хозяйственные постройки, погреба. Устанавливаем 
            барьерную защиту периметра участка от грызунов и насекомых. Стоимость выезда за МКАД — от 500₽ 
            в зависимости от расстояния.
          </p>
        </div>

        {/* Mobile: Accordion */}
        <div className="md:hidden">
          <Accordion type="single" collapsible>
            <AccordionItem value="map" className="border rounded-lg bg-card">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <span className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Показать карту и список районов
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                {/* Info panel */}
                <Card className="p-3 mb-4 bg-muted/30">
                  <div className="space-y-3">
                    <div>
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {selectedArea.name}
                      </Badge>
                      <h3 className="text-lg font-bold mb-1">
                        {selectedArea.fullName}
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold">Доплата: {selectedArea.surcharge}</p>
                          <p className="text-xs text-muted-foreground">
                            {selectedArea.distance || "Центральная Москва"}
                          </p>
                        </div>
                      </div>

                      {selectedArea.responseTime && (
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold">Время выезда: {selectedArea.responseTime}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 space-y-1.5">
                      <Button 
                        className="w-full text-sm whitespace-normal"
                        onClick={() => {
                          const calculatorElement = document.getElementById('calculator');
                          if (calculatorElement) {
                            calculatorElement.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        Заказать выезд
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full text-sm whitespace-normal" 
                        onClick={() => window.location.href = 'tel:+79069989888'}
                      >
                        <Phone className="mr-2 h-4 w-4 flex-shrink-0" />
                        +7 (906) 998-98-88
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Map */}
                <Card className="p-0 overflow-hidden bg-muted/30 mb-4">
                  <YandexMap 
                    selectedArea={selectedArea}
                    onAreaSelect={setSelectedArea}
                    districts={moscowDistricts}
                    regions={moscowRegion}
                  />
                </Card>

                {/* District badges */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground mb-2">
                      Округа Москвы
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {moscowDistricts.map(district => (
                        <Badge
                          key={district.id}
                          variant={selectedArea.id === district.id ? "default" : "outline"}
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => setSelectedArea(district)}
                        >
                          {district.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground mb-2">
                      Московская область
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {moscowRegion.map(region => (
                        <Badge
                          key={region.id}
                          variant={selectedArea.id === region.id ? "default" : "outline"}
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => setSelectedArea(region)}
                        >
                          {region.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Desktop: как есть */}
        <div className="hidden md:block">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 max-w-7xl mx-auto mb-8 lg:mb-12">
            {/* Info panel */}
            <div className="order-1 lg:order-2 w-full lg:w-[350px] lg:flex-shrink-0">
              <Card className="p-4 lg:p-6 lg:sticky lg:top-4 bg-card overflow-hidden">
                <div className="space-y-6">
                  <div>
                    <Badge variant="secondary" className="mb-2 text-sm">
                      {selectedArea.name}
                    </Badge>
                    <h3 className="text-2xl font-bold mb-2">
                      {selectedArea.fullName}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-base font-semibold">Обслуживаем</p>
                        <p className="text-sm text-muted-foreground">
                          Выполняем все виды работ
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-base font-semibold">Доплата: {selectedArea.surcharge}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedArea.distance || "Центральная Москва"}
                        </p>
                      </div>
                    </div>

                    {selectedArea.responseTime && (
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-base font-semibold">Время выезда</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedArea.responseTime}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 space-y-3">
                    <Button 
                      className="w-full whitespace-normal"
                      onClick={() => {
                        const calculatorElement = document.getElementById('calculator');
                        if (calculatorElement) {
                          calculatorElement.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      Заказать выезд
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full whitespace-normal" 
                      onClick={() => window.location.href = 'tel:+79069989888'}
                    >
                      <Phone className="mr-2 h-4 w-4 flex-shrink-0" />
                      +7 (906) 998-98-88
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Yandex Map */}
            <div className="order-2 lg:order-1 w-full lg:flex-1">
              <Card className="p-0 overflow-hidden bg-muted/30">
                <YandexMap 
                  selectedArea={selectedArea}
                  onAreaSelect={setSelectedArea}
                  districts={moscowDistricts}
                  regions={moscowRegion}
                />
              </Card>
            </div>
          </div>

          {/* District badges */}
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h3 className="text-sm font-bold text-muted-foreground mb-3">
                Округа Москвы
              </h3>
              <div className="flex flex-wrap gap-2">
                {moscowDistricts.map(district => (
                  <Badge
                    key={district.id}
                    variant={selectedArea.id === district.id ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => setSelectedArea(district)}
                  >
                    {district.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-muted-foreground mb-3">
                Московская область
              </h3>
              <div className="flex flex-wrap gap-2">
                {moscowRegion.map(region => (
                  <Badge
                    key={region.id}
                    variant={selectedArea.id === region.id ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => setSelectedArea(region)}
                  >
                    {region.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreaMap;
