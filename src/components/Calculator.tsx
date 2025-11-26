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
import { Home, Building2, Warehouse, ShoppingCart, Factory, Snowflake, Flame, Target, Diamond, Microscope, Bug, Rat, Sparkles, Calendar, CalendarCheck, FileText, User, Briefcase, Building, Phone, Percent, TrendingUp } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  // Generate chart data for price visualization
  const generateChartData = () => {
    const areas = [10, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500];
    return areas.map(areaPoint => {
      const discount = Math.min(30, Math.floor((areaPoint / 100) * 10));
      const multiplier = (100 - discount) / 100;
      
      return {
        area: areaPoint,
        cold: Math.round(50 * areaPoint * 1.0 * multiplier),
        hot: Math.round(50 * areaPoint * 1.3 * multiplier),
        spot: Math.round(50 * areaPoint * 0.8 * multiplier),
        complex: Math.round(50 * areaPoint * 1.5 * multiplier),
      };
    });
  };

  // Calculate base values FIRST
  const totalPrice = calculatePrice();
  const discount = calculateDiscount();
  const discountAmount = Math.round((totalPrice * discount) / 100);
  const finalPrice = totalPrice - discountAmount;

  // Calculate prices for all treatment types for comparison
  const calculateComparisonPrices = () => {
    const treatmentTypes = [
      { key: "cold", name: "❄️ Холодный туман", multiplier: 1.0 },
      { key: "hot", name: "🔥 Горячий туман", multiplier: 1.3 },
      { key: "spot", name: "🎯 Точечная", multiplier: 0.8 },
      { key: "complex", name: "💎 Комплексная", multiplier: 1.5 },
    ];

    return treatmentTypes.map(treatment => {
      const basePrice = Math.round(50 * area * treatment.multiplier);
      const discountAmount = Math.round((basePrice * discount) / 100);
      const finalPrice = basePrice - discountAmount;
      
      return {
        ...treatment,
        basePrice,
        finalPrice,
        savings: discountAmount,
        isRecommended: treatment.key === "spot" && area < 100,
      };
    });
  };

  const chartData = generateChartData();
  const comparisonData = calculateComparisonPrices();

  const handleConsultation = () => {
    const phone = prompt("Введите ваш номер телефона для консультации:");
    if (phone && phone.trim()) {
      // Формируем сообщение для WhatsApp
      const message = `🔔 Новая заявка с калькулятора!
    
📱 Телефон клиента: ${phone}
📐 Площадь: ${area} м²
🏠 Тип помещения: ${premiseType === 'apartment' ? 'Квартира' : premiseType === 'house' ? 'Дом' : premiseType === 'office' ? 'Офис' : premiseType === 'warehouse' ? 'Склад' : premiseType === 'shop' ? 'Магазин' : 'Производство'}
🔧 Услуга: ${serviceType === 'disinfection' ? 'Дезинфекция' : serviceType === 'disinsection' ? 'Дезинсекция' : serviceType === 'deratization' ? 'Дератизация' : 'Комплекс'}
⚙️ Обработка: ${treatmentType === 'cold' ? 'Холодный туман' : treatmentType === 'hot' ? 'Горячий туман' : treatmentType === 'spot' ? 'Точечная' : 'Комплексная'}
📅 Периодичность: ${period === 'once' ? 'Разово' : period === 'monthly' ? 'Ежемесячно' : 'Ежеквартально'}

💰 Базовая цена: ${totalPrice}₽
📉 Скидка: ${discount}% (-${discountAmount}₽)
✅ Итого: ${finalPrice}₽`;

      // Открываем WhatsApp с готовым сообщением
      const whatsappUrl = `https://wa.me/79069989888?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
      toast.success("Спасибо! Мы свяжемся с вами в ближайшее время.", {
        description: `Расчёт: ${finalPrice}₽ (скидка ${discount}%)`,
      });
    }
  };

  return (
    <section id="calculator" className="py-10 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 md:mb-12 animate-slide-in">
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

            {/* График изменения цены */}
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-2xl mb-8">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Как меняется цена в зависимости от площади
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="area" 
                    label={{ value: 'Площадь (м²)', position: 'insideBottom', offset: -5 }}
                    className="text-xs"
                  />
                  <YAxis 
                    label={{ value: 'Цена (₽)', angle: -90, position: 'insideLeft' }}
                    className="text-xs"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => `${value}₽`}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px' }}
                    iconType="line"
                  />
                  <ReferenceLine 
                    x={area} 
                    stroke="hsl(var(--primary))" 
                    strokeDasharray="3 3"
                    label={{ value: 'Текущая', position: 'top', fill: 'hsl(var(--primary))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cold" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Холодный туман"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hot" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    name="Горячий туман"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="spot" 
                    stroke="#22C55E" 
                    strokeWidth={2}
                    name="Точечная"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="complex" 
                    stroke="#A855F7" 
                    strokeWidth={2}
                    name="Комплексная"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Таблица сравнения типов обработки */}
            <div className="bg-gradient-to-r from-accent/5 to-success/5 p-6 rounded-2xl mb-8">
              <h3 className="text-lg font-bold mb-4">
                Сравнение типов обработки при площади {area} м²
              </h3>
              
              {/* Десктопная таблица */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">Тип обработки</TableHead>
                      <TableHead className="text-right font-bold">Базовая цена</TableHead>
                      <TableHead className="text-right font-bold">Со скидкой</TableHead>
                      <TableHead className="text-right font-bold">Экономия</TableHead>
                      <TableHead className="text-center font-bold">Рекомендация</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comparisonData.map((item) => (
                      <TableRow key={item.key} className={item.key === treatmentType ? "bg-primary/5" : ""}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right text-muted-foreground line-through">
                          {item.basePrice.toLocaleString()}₽
                        </TableCell>
                        <TableCell className="text-right font-bold text-success">
                          {item.finalPrice.toLocaleString()}₽
                        </TableCell>
                        <TableCell className="text-right text-success">
                          -{item.savings.toLocaleString()}₽
                        </TableCell>
                        <TableCell className="text-center">
                          {item.isRecommended && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/20 text-success">
                              ВЫГОДНО
                            </span>
                          )}
                          {item.key === treatmentType && !item.isRecommended && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                              ВЫБРАНО
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Мобильные карточки */}
              <div className="md:hidden space-y-3">
                {comparisonData.map((item) => (
                  <div 
                    key={item.key} 
                    className={`p-4 rounded-xl border ${
                      item.key === treatmentType 
                        ? "border-primary bg-primary/5" 
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold">{item.name}</h4>
                      {item.isRecommended && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-success/20 text-success">
                          ВЫГОДНО
                        </span>
                      )}
                      {item.key === treatmentType && !item.isRecommended && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                          ВЫБРАНО
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Базовая</p>
                        <p className="font-medium line-through">{item.basePrice.toLocaleString()}₽</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Со скидкой</p>
                        <p className="font-bold text-success">{item.finalPrice.toLocaleString()}₽</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Экономия</p>
                        <p className="font-medium text-success">-{item.savings.toLocaleString()}₽</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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

            <div className="bg-muted/50 p-3 sm:p-6 rounded-2xl mb-4 sm:mb-6">
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">Базовая стоимость</p>
                  <p className="text-base sm:text-2xl font-bold line-through text-muted-foreground">{totalPrice}₽</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">Ваша скидка</p>
                  <p className="text-base sm:text-2xl font-bold text-success">{discount}% (-{discountAmount}₽)</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">Итоговая цена</p>
                  <p className="text-lg sm:text-3xl font-bold text-primary">{finalPrice}₽</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleConsultation}
              className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-bold text-sm sm:text-lg py-4 sm:py-6 h-auto whitespace-normal"
            >
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
              Заказать консультацию и расчёт
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;
