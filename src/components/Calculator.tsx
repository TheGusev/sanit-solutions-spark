import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Home, Building2, Warehouse, ShoppingCart, Factory, Snowflake, Flame, Target, Diamond, Microscope, Bug, Rat, Sparkles, Calendar, CalendarCheck, FileText, User, Briefcase, Building, Phone, Percent } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const Calculator = () => {
  const [area, setArea] = useState<number>(50);
  const [premiseType, setPremiseType] = useState<string>("apartment");
  const [treatmentType, setTreatmentType] = useState<string>("cold");
  const [serviceType, setServiceType] = useState<string>("disinfection");
  const [period, setPeriod] = useState<string>("once");
  const [clientType, setClientType] = useState<string>("individual");

  const calculatePrice = () => {
    let basePrice = 50; // base price per m²

    // Premise type multiplier
    const premiseMultiplier: Record<string, number> = {
      apartment: 1,
      house: 1.2,
      office: 1.3,
      warehouse: 1.5,
      shop: 1.4,
      production: 1.6,
    };

    // Treatment type multiplier
    const treatmentMultiplier: Record<string, number> = {
      cold: 1,
      hot: 1.3,
      spot: 0.8,
      complex: 1.5,
    };

    // Service type multiplier
    const serviceMultiplier: Record<string, number> = {
      disinfection: 1,
      disinsection: 1.2,
      deratization: 1.1,
      complex: 1.8,
    };

    // Period multiplier
    const periodMultiplier: Record<string, number> = {
      once: 1,
      monthly: 0.85,
      quarterly: 0.9,
    };

    const price =
      basePrice *
      area *
      premiseMultiplier[premiseType] *
      treatmentMultiplier[treatmentType] *
      serviceMultiplier[serviceType] *
      periodMultiplier[period];

    return Math.round(price);
  };

  const calculateDiscount = () => {
    const discount = Math.min(30, Math.floor((area / 100) * 10));
    return discount;
  };

  const totalPrice = calculatePrice();
  const discount = calculateDiscount();
  const discountAmount = Math.round((totalPrice * discount) / 100);
  const finalPrice = totalPrice - discountAmount;

  const handleConsultation = () => {
    const phone = prompt("Введите ваш номер телефона для консультации:");
    if (phone) {
      toast.success("Спасибо! Мы свяжемся с вами в ближайшее время.", {
        description: `Расчёт: ${finalPrice}₽ (скидка ${discount}%)`,
      });
    }
  };

  return (
    <section id="calculator" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-slide-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Рассчитайте <span className="text-primary">стоимость</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Получите точную цену с учётом автоматической скидки
            </p>
          </div>

          <div className="bg-card p-8 rounded-3xl shadow-xl">
            {/* Блок визуализации скидки */}
            <div className="bg-gradient-to-r from-primary/10 to-success/10 p-6 rounded-2xl mb-8">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Percent className="w-5 h-5 text-primary" />
                Калькулятор скидки
              </h3>
              
              {/* Слайдер площади */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <Label>Площадь: <span className="font-bold text-primary">{area} м²</span></Label>
                  <span className="text-sm text-muted-foreground">10 - 500 м²</span>
                </div>
                <Slider
                  value={[area]}
                  onValueChange={(values) => setArea(values[0])}
                  min={10}
                  max={500}
                  step={10}
                  className="mb-2"
                />
                {/* Пороговые отметки под слайдером */}
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>10м²</span>
                  <span>100м² (10%)</span>
                  <span>200м² (20%)</span>
                  <span>300м²+ (30%)</span>
                </div>
              </div>
              
              {/* Прогресс-бар скидки */}
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Ваша скидка</span>
                  <span className="font-bold text-success text-lg">{discount}%</span>
                </div>
                <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                  {/* Заполненная часть */}
                  <div 
                    className="absolute h-full bg-gradient-to-r from-success/70 to-success rounded-full transition-all duration-300"
                    style={{ width: `${(discount / 30) * 100}%` }}
                  />
                  {/* Маркеры порогов */}
                  <div className="absolute inset-0 flex">
                    <div className="w-1/3 border-r border-background/50" />
                    <div className="w-1/3 border-r border-background/50" />
                    <div className="w-1/3" />
                  </div>
                </div>
                {/* Подписи под прогресс-баром */}
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0%</span>
                  <span>10%</span>
                  <span>20%</span>
                  <span>30%</span>
                </div>
              </div>
              
              {/* Динамическая подсказка */}
              {discount < 30 && (
                <div className="bg-background/50 p-3 rounded-lg text-sm">
                  <span className="text-muted-foreground">💡 </span>
                  {discount < 10 && (
                    <span>Увеличьте площадь до <strong>100 м²</strong> и получите <strong className="text-success">10% скидку</strong>!</span>
                  )}
                  {discount >= 10 && discount < 20 && (
                    <span>Ещё <strong>{200 - area} м²</strong> до <strong className="text-success">20% скидки</strong>!</span>
                  )}
                  {discount >= 20 && discount < 30 && (
                    <span>Ещё <strong>{300 - area} м²</strong> до <strong className="text-success">максимальной 30% скидки</strong>!</span>
                  )}
                </div>
              )}
              {discount >= 30 && (
                <div className="bg-success/20 p-3 rounded-lg text-sm text-success font-medium">
                  🎉 Поздравляем! Вы получаете максимальную скидку 30%!
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <Label htmlFor="premise">Тип помещения</Label>
                <Select value={premiseType} onValueChange={setPremiseType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment"><Home className="w-4 h-4 inline mr-2" />Квартира</SelectItem>
                    <SelectItem value="house"><Building2 className="w-4 h-4 inline mr-2" />Дом</SelectItem>
                    <SelectItem value="office"><Building className="w-4 h-4 inline mr-2" />Офис</SelectItem>
                    <SelectItem value="warehouse"><Warehouse className="w-4 h-4 inline mr-2" />Склад</SelectItem>
                    <SelectItem value="shop"><ShoppingCart className="w-4 h-4 inline mr-2" />Магазин</SelectItem>
                    <SelectItem value="production"><Factory className="w-4 h-4 inline mr-2" />Производство</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="area">Площадь (м²)</Label>
                <Input
                  id="area"
                  type="number"
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  min="10"
                  max="10000"
                />
              </div>

              <div>
                <Label htmlFor="treatment">Тип обработки</Label>
                <Select value={treatmentType} onValueChange={setTreatmentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cold"><Snowflake className="w-4 h-4 inline mr-2" />Холодный туман</SelectItem>
                    <SelectItem value="hot"><Flame className="w-4 h-4 inline mr-2" />Горячий туман</SelectItem>
                    <SelectItem value="spot"><Target className="w-4 h-4 inline mr-2" />Точечная</SelectItem>
                    <SelectItem value="complex"><Diamond className="w-4 h-4 inline mr-2" />Комплексная</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="service">Услуга</Label>
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disinfection"><Microscope className="w-4 h-4 inline mr-2" />Дезинфекция</SelectItem>
                    <SelectItem value="disinsection"><Bug className="w-4 h-4 inline mr-2" />Дезинсекция</SelectItem>
                    <SelectItem value="deratization"><Rat className="w-4 h-4 inline mr-2" />Дератизация</SelectItem>
                    <SelectItem value="complex"><Sparkles className="w-4 h-4 inline mr-2" />Комплекс</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="period">Периодичность</Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once"><Calendar className="w-4 h-4 inline mr-2" />Разово</SelectItem>
                    <SelectItem value="monthly"><CalendarCheck className="w-4 h-4 inline mr-2" />Ежемесячно</SelectItem>
                    <SelectItem value="quarterly"><FileText className="w-4 h-4 inline mr-2" />Ежеквартально</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="client">Статус клиента</Label>
                <Select value={clientType} onValueChange={setClientType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual"><User className="w-4 h-4 inline mr-2" />Физ. лицо</SelectItem>
                    <SelectItem value="ip"><Briefcase className="w-4 h-4 inline mr-2" />ИП</SelectItem>
                    <SelectItem value="company"><Building className="w-4 h-4 inline mr-2" />Юр. лицо</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-muted/50 p-6 rounded-2xl mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Базовая стоимость</p>
                  <p className="text-2xl font-bold line-through text-muted-foreground">{totalPrice}₽</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ваша скидка</p>
                  <p className="text-2xl font-bold text-success">{discount}% (-{discountAmount}₽)</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Итоговая цена</p>
                  <p className="text-3xl font-bold text-primary">{finalPrice}₽</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleConsultation}
              className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-bold text-lg py-6 h-auto"
            >
              <Phone className="w-5 h-5 mr-2" />
              Заказать консультацию и расчёт
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;
