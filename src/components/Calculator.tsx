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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <Label htmlFor="premise">Тип помещения</Label>
                <Select value={premiseType} onValueChange={setPremiseType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">🏠 Квартира</SelectItem>
                    <SelectItem value="house">🏡 Дом</SelectItem>
                    <SelectItem value="office">🏢 Офис</SelectItem>
                    <SelectItem value="warehouse">📦 Склад</SelectItem>
                    <SelectItem value="shop">🛒 Магазин</SelectItem>
                    <SelectItem value="production">🏭 Производство</SelectItem>
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
                    <SelectItem value="cold">❄️ Холодный туман</SelectItem>
                    <SelectItem value="hot">🔥 Горячий туман</SelectItem>
                    <SelectItem value="spot">🎯 Точечная</SelectItem>
                    <SelectItem value="complex">💎 Комплексная</SelectItem>
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
                    <SelectItem value="disinfection">🦠 Дезинфекция</SelectItem>
                    <SelectItem value="disinsection">🐜 Дезинсекция</SelectItem>
                    <SelectItem value="deratization">🐀 Дератизация</SelectItem>
                    <SelectItem value="complex">✨ Комплекс</SelectItem>
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
                    <SelectItem value="once">📅 Разово</SelectItem>
                    <SelectItem value="monthly">📆 Ежемесячно</SelectItem>
                    <SelectItem value="quarterly">📋 Ежеквартально</SelectItem>
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
                    <SelectItem value="individual">👤 Физ. лицо</SelectItem>
                    <SelectItem value="ip">💼 ИП</SelectItem>
                    <SelectItem value="company">🏢 Юр. лицо</SelectItem>
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
              📞 Заказать консультацию и расчёт
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;
