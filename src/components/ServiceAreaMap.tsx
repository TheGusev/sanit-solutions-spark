import { useState } from "react";
import { Link } from "react-router-dom";
import { moscowDistricts, moscowRegion, ServiceArea } from "@/data/serviceAreas";
import { neighborhoods, getNeighborhoodsByDistrict } from "@/data/neighborhoods";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, MapPin, Phone, ChevronDown } from "lucide-react";
import YandexMap from "@/components/YandexMap";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// District groups for neighborhood listing
const districtGroups = [
  { id: 'cao', name: 'ЦАО', fullName: 'Центральный округ' },
  { id: 'sao', name: 'САО', fullName: 'Северный округ' },
  { id: 'svao', name: 'СВАО', fullName: 'Северо-Восточный округ' },
  { id: 'vao', name: 'ВАО', fullName: 'Восточный округ' },
  { id: 'yuvao', name: 'ЮВАО', fullName: 'Юго-Восточный округ' },
  { id: 'yao', name: 'ЮАО', fullName: 'Южный округ' },
  { id: 'yzao', name: 'ЮЗАО', fullName: 'Юго-Западный округ' },
  { id: 'zao', name: 'ЗАО', fullName: 'Западный округ' },
  { id: 'szao', name: 'СЗАО', fullName: 'Северо-Западный округ' },
  { id: 'nao', name: 'НАО', fullName: 'Новомосковский округ' },
  { id: 'tao', name: 'ТАО', fullName: 'Троицкий округ' },
  { id: 'zelao', name: 'ЗелАО', fullName: 'Зеленоградский округ' },
];

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
                        onClick={() => window.location.href = 'tel:84950181817'}
                      >
                        <Phone className="mr-2 h-4 w-4 flex-shrink-0" />
                        8-495-018-18-17
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
                <div className="space-y-4 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground mb-2">
                      Округа Москвы
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {moscowDistricts.map(district => (
                        <Badge
                          key={district.id}
                          variant={selectedArea.id === district.id ? "default" : "outline"}
                          className="cursor-pointer hover:bg-russia-red hover:text-white transition-colors"
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
                          className="cursor-pointer hover:bg-russia-red hover:text-white transition-colors"
                          onClick={() => setSelectedArea(region)}
                        >
                          {region.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* All neighborhoods - ДОБАВЛЕН В МОБИЛКУ! */}
                <Collapsible>
                  <CollapsibleTrigger className="w-full flex items-center justify-between bg-muted rounded-lg p-3 border border-border hover:bg-muted/50 hover:border-russia-red/50 transition-colors group">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-russia-red" />
                      <span className="font-semibold text-sm">Все {neighborhoods?.length || 130} районов Москвы</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="pt-3">
                    <div className="bg-card rounded-lg border border-border p-3 space-y-4">
                      {districtGroups.map(district => {
                        const districtNeighborhoods = getNeighborhoodsByDistrict(district.id);
                        if (!districtNeighborhoods || districtNeighborhoods.length === 0) return null;
                        
                        return (
                          <div key={district.id}>
                            <h4 className="font-bold text-xs mb-2 text-muted-foreground">
                              {district.name} — {district.fullName} ({districtNeighborhoods.length})
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {districtNeighborhoods.map(n => (
                                <Link 
                                  key={n.slug} 
                                  to={`/rajony/${n.slug}`}
                                  className="text-xs px-2.5 py-1 bg-muted rounded-full hover:bg-russia-red hover:text-white transition-colors"
                                >
                                  {n.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                      
                      <div className="pt-3 border-t border-border text-center">
                        <Link 
                          to="/rajony"
                          className="inline-flex items-center gap-1 text-russia-red hover:underline font-medium text-sm"
                        >
                          Открыть полный каталог районов →
                        </Link>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

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
                      onClick={() => window.location.href = 'tel:84950181817'}
                    >
                      <Phone className="mr-2 h-4 w-4 flex-shrink-0" />
                      8-495-018-18-17
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

          {/* District badges - скрыты визуально, карта интерактивна. SEO через sr-only */}
          <div className="sr-only">
            <h3>Округа Москвы</h3>
            <ul>
              {moscowDistricts.map(district => (
                <li key={district.id}>{district.fullName}</li>
              ))}
            </ul>
            <h3>Московская область</h3>
            <ul>
              {moscowRegion.map(region => (
                <li key={region.id}>{region.name}</li>
              ))}
            </ul>
          </div>

          {/* All neighborhoods collapsible list */}
          <Collapsible className="mt-8 max-w-7xl mx-auto">
            <CollapsibleTrigger className="w-full flex items-center justify-between bg-card rounded-lg p-4 border border-border hover:bg-muted/50 hover:border-russia-red/50 transition-colors group">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-russia-red" />
                <span className="font-semibold text-lg">Все {neighborhoods?.length || 130} районов Москвы</span>
              </div>
              <ChevronDown className="w-5 h-5 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
            </CollapsibleTrigger>
            
            <CollapsibleContent className="pt-4">
              <div className="bg-card rounded-lg border border-border p-4 space-y-6">
                {districtGroups.map(district => {
                  const districtNeighborhoods = getNeighborhoodsByDistrict(district.id);
                  if (!districtNeighborhoods || districtNeighborhoods.length === 0) return null;
                  
                  return (
                    <div key={district.id}>
                      <h4 className="font-bold text-sm mb-3 text-muted-foreground">
                        {district.name} — {district.fullName} ({districtNeighborhoods.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {districtNeighborhoods.map(n => (
                          <Link 
                            key={n.slug} 
                            to={`/rajony/${n.slug}`}
                            className="text-sm px-3 py-1.5 bg-muted rounded-full hover:bg-russia-red hover:text-white transition-colors"
                          >
                            {n.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
                
                {/* Link to full overview */}
                <div className="pt-4 border-t border-border text-center">
                  <Link 
                    to="/rajony"
                    className="inline-flex items-center gap-2 text-russia-red hover:underline font-medium"
                  >
                    Открыть полный каталог районов →
                  </Link>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreaMap;

