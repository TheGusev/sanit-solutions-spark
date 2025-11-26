import { useState } from "react";
import { moscowDistricts, moscowRegion, ServiceArea } from "@/data/serviceAreas";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const ServiceAreaMap = () => {
  const [selectedArea, setSelectedArea] = useState<ServiceArea>(moscowDistricts[0]);
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);

  const allAreas = [...moscowDistricts, ...moscowRegion];

  return (
    <section className="py-20 bg-background" id="service-areas">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">
            🗺️ Зоны обслуживания
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Работаем по всей Москве и Московской области с быстрым выездом
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {/* Map visualization */}
          <div className="lg:col-span-2">
            <Card className="p-8 bg-muted/30">
              <div className="relative aspect-square max-w-xl mx-auto">
                {/* Simplified Moscow map representation */}
                <svg viewBox="0 0 400 400" className="w-full h-full">
                  {/* Central ring (CAO) */}
                  <circle
                    cx="200"
                    cy="200"
                    r="60"
                    className={cn(
                      "transition-all duration-300 cursor-pointer stroke-2",
                      selectedArea.id === "cao" || hoveredArea === "cao"
                        ? "fill-primary stroke-primary"
                        : "fill-muted stroke-border hover:fill-primary/30"
                    )}
                    onClick={() => setSelectedArea(moscowDistricts.find(d => d.id === "cao")!)}
                    onMouseEnter={() => setHoveredArea("cao")}
                    onMouseLeave={() => setHoveredArea(null)}
                  />
                  <text x="200" y="205" textAnchor="middle" className="fill-card-foreground font-bold text-sm pointer-events-none">
                    ЦАО
                  </text>

                  {/* Northern districts */}
                  <path
                    d="M 200 140 L 140 80 L 200 60 L 260 80 Z"
                    className={cn(
                      "transition-all duration-300 cursor-pointer stroke-2",
                      selectedArea.id === "sao" || hoveredArea === "sao"
                        ? "fill-primary stroke-primary"
                        : "fill-muted stroke-border hover:fill-primary/30"
                    )}
                    onClick={() => setSelectedArea(moscowDistricts.find(d => d.id === "sao")!)}
                    onMouseEnter={() => setHoveredArea("sao")}
                    onMouseLeave={() => setHoveredArea(null)}
                  />
                  <text x="200" y="95" textAnchor="middle" className="fill-card-foreground font-bold text-xs pointer-events-none">
                    САО
                  </text>

                  {/* North-East */}
                  <path
                    d="M 260 140 L 260 80 L 320 80 L 320 140 Z"
                    className={cn(
                      "transition-all duration-300 cursor-pointer stroke-2",
                      selectedArea.id === "svao" || hoveredArea === "svao"
                        ? "fill-primary stroke-primary"
                        : "fill-muted stroke-border hover:fill-primary/30"
                    )}
                    onClick={() => setSelectedArea(moscowDistricts.find(d => d.id === "svao")!)}
                    onMouseEnter={() => setHoveredArea("svao")}
                    onMouseLeave={() => setHoveredArea(null)}
                  />
                  <text x="290" y="115" textAnchor="middle" className="fill-card-foreground font-bold text-xs pointer-events-none">
                    СВАО
                  </text>

                  {/* East */}
                  <path
                    d="M 260 200 L 320 140 L 340 200 L 320 260 Z"
                    className={cn(
                      "transition-all duration-300 cursor-pointer stroke-2",
                      selectedArea.id === "vao" || hoveredArea === "vao"
                        ? "fill-primary stroke-primary"
                        : "fill-muted stroke-border hover:fill-primary/30"
                    )}
                    onClick={() => setSelectedArea(moscowDistricts.find(d => d.id === "vao")!)}
                    onMouseEnter={() => setHoveredArea("vao")}
                    onMouseLeave={() => setHoveredArea(null)}
                  />
                  <text x="305" y="205" textAnchor="middle" className="fill-card-foreground font-bold text-xs pointer-events-none">
                    ВАО
                  </text>

                  {/* South-East */}
                  <path
                    d="M 260 260 L 320 260 L 320 320 L 260 320 Z"
                    className={cn(
                      "transition-all duration-300 cursor-pointer stroke-2",
                      selectedArea.id === "yuvao" || hoveredArea === "yuvao"
                        ? "fill-primary stroke-primary"
                        : "fill-muted stroke-border hover:fill-primary/30"
                    )}
                    onClick={() => setSelectedArea(moscowDistricts.find(d => d.id === "yuvao")!)}
                    onMouseEnter={() => setHoveredArea("yuvao")}
                    onMouseLeave={() => setHoveredArea(null)}
                  />
                  <text x="290" y="295" textAnchor="middle" className="fill-card-foreground font-bold text-xs pointer-events-none">
                    ЮВАО
                  </text>

                  {/* South */}
                  <path
                    d="M 200 260 L 260 320 L 200 340 L 140 320 Z"
                    className={cn(
                      "transition-all duration-300 cursor-pointer stroke-2",
                      selectedArea.id === "yao" || hoveredArea === "yao"
                        ? "fill-primary stroke-primary"
                        : "fill-muted stroke-border hover:fill-primary/30"
                    )}
                    onClick={() => setSelectedArea(moscowDistricts.find(d => d.id === "yao")!)}
                    onMouseEnter={() => setHoveredArea("yao")}
                    onMouseLeave={() => setHoveredArea(null)}
                  />
                  <text x="200" y="315" textAnchor="middle" className="fill-card-foreground font-bold text-xs pointer-events-none">
                    ЮАО
                  </text>

                  {/* South-West */}
                  <path
                    d="M 140 260 L 80 260 L 80 320 L 140 320 Z"
                    className={cn(
                      "transition-all duration-300 cursor-pointer stroke-2",
                      selectedArea.id === "yzao" || hoveredArea === "yzao"
                        ? "fill-primary stroke-primary"
                        : "fill-muted stroke-border hover:fill-primary/30"
                    )}
                    onClick={() => setSelectedArea(moscowDistricts.find(d => d.id === "yzao")!)}
                    onMouseEnter={() => setHoveredArea("yzao")}
                    onMouseLeave={() => setHoveredArea(null)}
                  />
                  <text x="110" y="295" textAnchor="middle" className="fill-card-foreground font-bold text-xs pointer-events-none">
                    ЮЗАО
                  </text>

                  {/* West */}
                  <path
                    d="M 140 200 L 80 140 L 60 200 L 80 260 Z"
                    className={cn(
                      "transition-all duration-300 cursor-pointer stroke-2",
                      selectedArea.id === "zao" || hoveredArea === "zao"
                        ? "fill-primary stroke-primary"
                        : "fill-muted stroke-border hover:fill-primary/30"
                    )}
                    onClick={() => setSelectedArea(moscowDistricts.find(d => d.id === "zao")!)}
                    onMouseEnter={() => setHoveredArea("zao")}
                    onMouseLeave={() => setHoveredArea(null)}
                  />
                  <text x="95" y="205" textAnchor="middle" className="fill-card-foreground font-bold text-xs pointer-events-none">
                    ЗАО
                  </text>

                  {/* North-West */}
                  <path
                    d="M 140 140 L 80 80 L 80 140 L 140 80 Z"
                    className={cn(
                      "transition-all duration-300 cursor-pointer stroke-2",
                      selectedArea.id === "szao" || hoveredArea === "szao"
                        ? "fill-primary stroke-primary"
                        : "fill-muted stroke-border hover:fill-primary/30"
                    )}
                    onClick={() => setSelectedArea(moscowDistricts.find(d => d.id === "szao")!)}
                    onMouseEnter={() => setHoveredArea("szao")}
                    onMouseLeave={() => setHoveredArea(null)}
                  />
                  <text x="110" y="115" textAnchor="middle" className="fill-card-foreground font-bold text-xs pointer-events-none">
                    СЗАО
                  </text>
                </svg>
              </div>
            </Card>
          </div>

          {/* Info panel */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4 bg-card">
              <div className="space-y-6">
                <div>
                  <Badge variant="secondary" className="mb-3">
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
                      <p className="font-semibold">Обслуживаем</p>
                      <p className="text-sm text-muted-foreground">
                        Выполняем все виды работ
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{selectedArea.price}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedArea.distance || "Центральная Москва"}
                      </p>
                    </div>
                  </div>

                  {selectedArea.responseTime && (
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Время выезда</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedArea.responseTime}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 space-y-3">
                  <Button 
                    className="w-full"
                    onClick={() => {
                      const calculatorElement = document.getElementById('calculator');
                      if (calculatorElement) {
                        calculatorElement.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    Заказать выезд в {selectedArea.name}
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="tel:+79069989888">
                      <Phone className="mr-2 h-4 w-4" />
                      +7 (906) 998-98-88
                    </a>
                  </Button>
                </div>
              </div>
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
    </section>
  );
};

export default ServiceAreaMap;
