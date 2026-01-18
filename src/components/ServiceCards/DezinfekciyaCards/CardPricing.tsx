/**
 * === CARD 4: ЦЕНЫ И КАЛЬКУЛЯТОР ===
 * Прайс-лист и мини-калькулятор стоимости
 * 
 * @section id="ceny"
 * @features Калькулятор + таблица цен + список включённого
 */

import { useState } from 'react';
import { dezinfekciyaData } from '@/data/dezinfekciyaData';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Check, Calculator } from 'lucide-react';

interface CardPricingProps {
  onOrderClick: () => void;
}

const CardPricing = ({ onOrderClick }: CardPricingProps) => {
  const { pricing, includedInPrice } = dezinfekciyaData;
  
  // Состояние калькулятора
  const [area, setArea] = useState(50);
  const [method, setMethod] = useState<'cold' | 'hot'>('cold');

  /**
   * Расчёт стоимости на основе площади и метода
   * @returns Цена в рублях
   */
  const calculatePrice = (): number => {
    const basePrice = method === 'cold' ? 1000 : 1500;
    const pricePerSqm = method === 'cold' ? 20 : 30;
    
    if (area <= 50) return basePrice;
    if (area <= 100) return method === 'cold' ? 2000 : 3000;
    if (area <= 200) return method === 'cold' ? 3500 : 5000;
    
    // Для площади > 200 м²
    return Math.round(basePrice + (area - 50) * pricePerSqm);
  };

  const price = calculatePrice();

  return (
    <section 
      id="ceny"
      className="service-card relative min-h-[80vh] flex items-center bg-muted/30"
      aria-labelledby="pricing-heading"
    >
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Заголовок */}
        <div className="text-center mb-8 md:mb-12">
          <h2 
            id="pricing-heading"
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3"
          >
            Стоимость дезинфекции
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Рассчитайте стоимость онлайн или позвоните для точного расчёта
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Калькулятор */}
          <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold">Калькулятор стоимости</h3>
            </div>

            {/* Площадь */}
            <div className="mb-6">
              <Label className="text-base mb-3 block">
                Площадь помещения: <span className="text-primary font-bold">{area} м²</span>
              </Label>
              <Slider
                value={[area]}
                onValueChange={(value) => setArea(value[0])}
                min={20}
                max={300}
                step={10}
                className="w-full"
                aria-label="Выберите площадь помещения"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>20 м²</span>
                <span>300 м²</span>
              </div>
            </div>

            {/* Метод */}
            <div className="mb-6">
              <Label className="text-base mb-3 block">Метод обработки:</Label>
              <RadioGroup 
                value={method} 
                onValueChange={(val) => setMethod(val as 'cold' | 'hot')}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cold" id="cold" />
                  <Label htmlFor="cold" className="cursor-pointer">
                    💨 Холодный туман
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hot" id="hot" />
                  <Label htmlFor="hot" className="cursor-pointer">
                    🔥 Горячий туман
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Итого */}
            <div className="bg-primary/5 rounded-xl p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-1">Ориентировочная стоимость:</p>
              <p className="text-3xl md:text-4xl font-bold text-primary">
                {price.toLocaleString('ru-RU')} ₽
              </p>
            </div>

            <Button 
              onClick={onOrderClick} 
              size="lg" 
              className="w-full text-base"
            >
              Заказать за {price.toLocaleString('ru-RU')} ₽
            </Button>
          </div>

          {/* Таблица цен + Что входит */}
          <div className="space-y-6">
            {/* Таблица */}
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 md:p-4 font-semibold">Площадь</th>
                    <th className="text-center p-3 md:p-4 font-semibold">💨 Холодный</th>
                    <th className="text-center p-3 md:p-4 font-semibold">🔥 Горячий</th>
                  </tr>
                </thead>
                <tbody>
                  {pricing.map((row, index) => (
                    <tr 
                      key={index}
                      className={index % 2 === 0 ? 'bg-card' : 'bg-muted/20'}
                    >
                      <td className="p-3 md:p-4 font-medium">{row.area}</td>
                      <td className="p-3 md:p-4 text-center">{row.cold}</td>
                      <td className="p-3 md:p-4 text-center text-primary font-medium">{row.hot}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Что входит в стоимость */}
            <div className="bg-card rounded-xl p-5 md:p-6 border border-border">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                Что входит в стоимость:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {includedInPrice.map((item, index) => (
                  <li 
                    key={index}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardPricing;
