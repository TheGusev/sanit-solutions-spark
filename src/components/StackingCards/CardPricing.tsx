import { useState, useMemo } from 'react';
import { Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface CardPricingProps {
  onCalculatorClick: () => void;
}

const services = [
  { id: 'dezinfekciya', name: 'Дезинфекция', basePrice: 1000, pricePerM2: 20 },
  { id: 'dezinsekciya', name: 'Дезинсекция', basePrice: 1200, pricePerM2: 25 },
  { id: 'deratizaciya', name: 'Дератизация', basePrice: 1400, pricePerM2: 30 },
  { id: 'ozonirovanie', name: 'Озонирование', basePrice: 800, pricePerM2: 15 },
  { id: 'dezodoraciya', name: 'Дезодорация', basePrice: 1000, pricePerM2: 20 },
];

const priceTable = [
  { service: 'Дезинфекция', object: '1-комн. квартира', price: 'от 1 000 ₽' },
  { service: 'Дезинсекция', object: '2-комн. квартира', price: 'от 2 200 ₽' },
  { service: 'Дератизация', object: 'Частный дом', price: 'от 2 500 ₽' },
  { service: 'Озонирование', object: 'Офис до 100 м²', price: 'от 1 500 ₽' },
  { service: 'Дезодорация', object: 'Коммерческое помещение', price: 'от 2 500 ₽' },
];

const CardPricing = ({ onCalculatorClick }: CardPricingProps) => {
  const [selectedService, setSelectedService] = useState(services[0].id);
  const [area, setArea] = useState([50]);

  const calculatedPrice = useMemo(() => {
    const service = services.find(s => s.id === selectedService);
    if (!service) return 0;
    return service.basePrice + (service.pricePerM2 * area[0]);
  }, [selectedService, area]);

  return (
    <section
      id="ceny"
      className="stacking-card bg-muted/30"
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-8 md:mb-12 text-center">
          Рассчитайте стоимость услуги
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator */}
          <div className="bg-muted/50 rounded-2xl p-6 md:p-8">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Быстрый расчёт
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Услуга
                </label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Площадь: <span className="text-primary font-bold">{area[0]} м²</span>
                </label>
                <Slider
                  value={area}
                  onValueChange={setArea}
                  min={20}
                  max={500}
                  step={10}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>20 м²</span>
                  <span>500 м²</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-muted-foreground">Примерная стоимость:</span>
                  <span className="text-2xl font-bold text-accent">
                    {calculatedPrice.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                
                <Button 
                  onClick={onCalculatorClick}
                  className="w-full bg-accent hover:bg-accent/90"
                >
                  Рассчитать подробно
                </Button>
              </div>
            </div>
          </div>
          
          {/* Price table */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Базовые цены
            </h3>
            
            <div className="bg-muted/30 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Услуга</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Объект</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">Цена</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {priceTable.map((row, index) => (
                    <tr key={index} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 text-sm text-foreground">{row.service}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{row.object}</td>
                      <td className="px-4 py-3 text-sm text-accent font-semibold text-right">{row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <p className="text-xs text-muted-foreground mt-4">
              * Окончательная стоимость зависит от площади, степени заражения и типа объекта
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardPricing;
