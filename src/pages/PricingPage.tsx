/**
 * === СТРАНИЦА ЦЕНЫ ===
 * Прозрачное ценообразование + калькулятор для расчёта
 * 
 * @цель Конверсия: посетитель видит цену → оставляет заявку
 * @структура Калькулятор + таблицы цен + FAQ по ценам
 * @url /ceny
 */

import { useState, useEffect, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Calculator, 
  Check, 
  Phone, 
  ArrowRight, 
  ArrowLeft,
  Shield,
  FileText,
  Clock,
  Zap,
  Calendar,
  BadgePercent
} from 'lucide-react';
import { LeadFormModal } from '@/components/LeadFormModal';

const Footer = lazy(() => import('@/components/Footer'));

// Типы услуг
const services = [
  { id: 'dezinfekciya', name: 'Дезинфекция', icon: '🧴', basePrice: 2000 },
  { id: 'dezinsekciya', name: 'Дезинсекция', icon: '🐜', basePrice: 2500 },
  { id: 'deratizaciya', name: 'Дератизация', icon: '🐀', basePrice: 3000 },
  { id: 'kompleks', name: 'Комплекс', icon: '⚡', basePrice: 4000, discount: 15 },
];

// Типы помещений
const roomTypes = [
  { id: 'kvartira', name: 'Квартира', icon: '🏠', multiplier: 1.0 },
  { id: 'dom', name: 'Дом', icon: '🏡', multiplier: 1.2 },
  { id: 'ofis', name: 'Офис', icon: '🏢', multiplier: 1.3 },
  { id: 'sklad', name: 'Склад', icon: '🏭', multiplier: 0.8 },
  { id: 'kafe', name: 'Кафе/Ресторан', icon: '🍽️', multiplier: 1.5 },
  { id: 'other', name: 'Другое', icon: '📦', multiplier: 1.0 },
];

// Дополнительные услуги
const additionalServices = [
  { id: 'express', name: 'Экспресс-выезд (1-2 часа)', description: 'Приедем в течение 1-2 часов', price: 1000, icon: <Zap className="w-5 h-5" /> },
  { id: 'weekend', name: 'Выезд в выходной/праздник', description: 'Работаем в субботу, воскресенье', price: 500, icon: <Calendar className="w-5 h-5" /> },
  { id: 'warranty', name: 'Расширенная гарантия (2 года)', description: 'Стандартная 1 год, расширенная 2 года', price: 800, icon: <Shield className="w-5 h-5" /> },
  { id: 'documents', name: 'Пакет документов для СЭС', description: 'Все документы для Роспотребнадзора', price: 1500, icon: <FileText className="w-5 h-5" /> },
];

// Таблицы цен
const priceTables = {
  dezinfekciya: [
    { type: 'Квартира', area: 'До 50 м²', cold: '2000₽', hot: '3000₽', time: '1-1.5 часа' },
    { type: '', area: '50-100 м²', cold: '3500₽', hot: '5000₽', time: '1.5-2 часа' },
    { type: '', area: '100-200 м²', cold: '6000₽', hot: '8500₽', time: '2-3 часа' },
    { type: '', area: 'Более 200 м²', cold: 'Индивидуально', hot: 'Индивидуально', time: 'от 3 часов' },
    { type: 'Офис', area: 'До 100 м²', cold: '5000₽', hot: '7000₽', time: '2-3 часа' },
    { type: '', area: '100-300 м²', cold: '12000₽', hot: '16000₽', time: '4-5 часов' },
    { type: '', area: 'Более 300 м²', cold: 'от 40₽/м²', hot: 'от 50₽/м²', time: 'Договорная' },
  ],
  dezinsekciya: [
    { type: 'Квартира', area: 'До 50 м²', cold: '2500₽', hot: '3500₽', time: '1-2 часа' },
    { type: '', area: '50-100 м²', cold: '4000₽', hot: '5500₽', time: '2-3 часа' },
    { type: '', area: '100-200 м²', cold: '7000₽', hot: '9500₽', time: '3-4 часа' },
    { type: 'Офис', area: 'До 100 м²', cold: '6000₽', hot: '8000₽', time: '2-3 часа' },
    { type: '', area: '100-300 м²', cold: '14000₽', hot: '18000₽', time: '4-6 часов' },
  ],
  deratizaciya: [
    { type: 'Квартира', area: 'До 50 м²', cold: '3000₽', hot: '—', time: '1-2 часа' },
    { type: '', area: '50-100 м²', cold: '4500₽', hot: '—', time: '2-3 часа' },
    { type: 'Дом/Участок', area: 'До 10 соток', cold: '5000₽', hot: '—', time: '2-3 часа' },
    { type: '', area: '10-30 соток', cold: '8000₽', hot: '—', time: '3-4 часа' },
    { type: 'Склад/Производство', area: 'До 500 м²', cold: '15000₽', hot: '—', time: '4-6 часов' },
  ],
  other: [
    { type: 'Озонирование', area: 'До 50 м²', cold: '3000₽', hot: '—', time: '2-3 часа' },
    { type: '', area: '50-100 м²', cold: '5000₽', hot: '—', time: '3-4 часа' },
    { type: 'Дезодорация', area: 'До 50 м²', cold: '2500₽', hot: '—', time: '1-2 часа' },
    { type: '', area: '50-100 м²', cold: '4000₽', hot: '—', time: '2-3 часа' },
    { type: 'Санитарный сертификат', area: 'Любая', cold: 'от 5000₽', hot: '—', time: '1-3 дня' },
  ],
};

// FAQ
const faqItems = [
  {
    question: 'Почему цены "от"?',
    answer: 'Итоговая стоимость зависит от площади, степени заражения, доступности помещения и выбранного метода обработки. Указанные цены — базовые, для стандартных объектов без осложняющих факторов.',
  },
  {
    question: 'Есть ли скрытые доплаты?',
    answer: 'Нет. Мы озвучиваем финальную стоимость до начала работ и фиксируем её в договоре. После осмотра объекта цена не меняется. Доплат не будет ни при каких обстоятельствах.',
  },
  {
    question: 'Как можно оплатить?',
    answer: 'Оплата производится после выполнения работ и подписания акта. Принимаем наличные, банковские карты, переводы по СБП. Для юридических лиц — безналичный расчёт с НДС.',
  },
  {
    question: 'Есть ли скидки?',
    answer: 'Да! Скидка 10% при заказе от 50 000₽, скидка 15% на комплексные услуги (дезинфекция + дезинсекция + дератизация), скидки постоянным клиентам и при заключении договора на обслуживание.',
  },
  {
    question: 'Что входит в стоимость?',
    answer: 'В базовую стоимость входит: выезд специалиста, осмотр объекта, обработка всех помещений, препараты и расходные материалы, консультация по профилактике, гарантия на работы.',
  },
  {
    question: 'Нужно ли платить за повторную обработку?',
    answer: 'В период гарантии повторная обработка бесплатна. Стандартная гарантия — 1 год. Можно оформить расширенную гарантию на 2 года за дополнительную плату.',
  },
];

export default function PricingPage() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [area, setArea] = useState(50);
  const [additionals, setAdditionals] = useState<Record<string, boolean>>({});
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', comment: '' });

  // Расчёт цены
  const calculatePrice = () => {
    const service = services.find(s => s.id === selectedService);
    const room = roomTypes.find(r => r.id === selectedRoom);
    
    if (!service) return { base: 0, additional: 0, discount: 0, total: 0 };
    
    // Базовая цена + надбавка за площадь
    let basePrice = service.basePrice;
    const areaSurcharge = Math.floor(area / 10) * 200;
    basePrice += areaSurcharge;
    
    // Множитель помещения
    if (room) {
      basePrice *= room.multiplier;
    }
    
    // Дополнительные услуги
    let additionalPrice = 0;
    Object.entries(additionals).forEach(([key, checked]) => {
      if (checked) {
        const addon = additionalServices.find(a => a.id === key);
        if (addon) additionalPrice += addon.price;
      }
    });
    
    // Скидка на комплекс
    let discount = 0;
    if (service.discount) {
      discount = (basePrice + additionalPrice) * (service.discount / 100);
    }
    
    const total = Math.round(basePrice + additionalPrice - discount);
    
    return {
      base: Math.round(basePrice),
      additional: additionalPrice,
      discount: Math.round(discount),
      total,
    };
  };

  const price = calculatePrice();

  const handleNextStep = () => {
    if (step === 1 && !selectedService) return;
    if (step === 2 && !selectedRoom) return;
    setStep(prev => Math.min(prev + 1, 5));
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowLeadForm(true);
  };

  const getServiceName = () => services.find(s => s.id === selectedService)?.name || 'Не выбрано';
  const getRoomName = () => roomTypes.find(r => r.id === selectedRoom)?.name || 'Не выбрано';

  return (
    <>
      <Helmet>
        <title>Цены на дезинфекцию и дезинсекцию в Москве 2026 | Калькулятор стоимости</title>
        <meta name="description" content="Прозрачные цены на дезинфекцию, дезинсекцию и дератизацию в Москве. Онлайн калькулятор стоимости. Без скрытых доплат. Гарантия результата." />
        <meta name="keywords" content="цены дезинфекция, стоимость дезинсекции, прайс дератизация, калькулятор дезинфекции" />
        <link rel="canonical" href="https://goruslugimsk.ru/ceny" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "PriceSpecification",
            "name": "Цены на дезинфекцию и дезинсекцию",
            "priceCurrency": "RUB",
            "price": "2000",
            "minPrice": "2000",
            "maxPrice": "50000"
          })}
        </script>
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero */}
        <section className="py-12 md:py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Прозрачные цены на дезинфекцию и дезинсекцию
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Стоимость рассчитывается индивидуально в зависимости от площади, 
              типа помещения и сложности работ. Без скрытых доплат.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border">
                <BadgePercent className="w-5 h-5 text-primary" />
                <span className="font-medium">Фиксированная цена</span>
              </div>
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border">
                <FileText className="w-5 h-5 text-primary" />
                <span className="font-medium">Смета до начала работ</span>
              </div>
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-medium">Никаких доплат</span>
              </div>
            </div>
          </div>
        </section>

        {/* Калькулятор */}
        <section id="calculator" className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 flex items-center justify-center gap-2">
                <Calculator className="w-8 h-8 text-primary" />
                Рассчитать стоимость онлайн
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Ответьте на несколько вопросов и узнайте примерную стоимость услуги. 
                Точный расчёт менеджер сделает по телефону.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
              {/* Форма калькулятора */}
              <div className="lg:col-span-3 bg-card rounded-2xl p-6 md:p-8 border shadow-lg">
                {/* Прогресс */}
                <div className="flex items-center gap-2 mb-8">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="flex-1 flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {step > s ? <Check className="w-4 h-4" /> : s}
                      </div>
                      {s < 5 && (
                        <div className={`flex-1 h-1 rounded ${step > s ? 'bg-primary' : 'bg-muted'}`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Шаг 1: Услуга */}
                {step === 1 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <h3 className="text-xl font-semibold">Шаг 1: Выберите услугу</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {services.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => setSelectedService(service.id)}
                          className={`relative p-6 rounded-xl border-2 text-center transition-all ${
                            selectedService === service.id 
                              ? 'border-primary bg-primary/5 scale-[1.02]' 
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          {service.discount && (
                            <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full">
                              -{service.discount}%
                            </span>
                          )}
                          <span className="text-4xl block mb-2">{service.icon}</span>
                          <span className="font-semibold block">{service.name}</span>
                          <span className="text-primary font-bold">от {service.basePrice}₽</span>
                        </button>
                      ))}
                    </div>
                    <Button 
                      onClick={handleNextStep} 
                      className="w-full" 
                      size="lg"
                      disabled={!selectedService}
                    >
                      Далее <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}

                {/* Шаг 2: Тип помещения */}
                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <button onClick={handlePrevStep} className="text-muted-foreground hover:text-foreground flex items-center gap-1">
                      <ArrowLeft className="w-4 h-4" /> Назад
                    </button>
                    <h3 className="text-xl font-semibold">Шаг 2: Тип помещения</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {roomTypes.map((room) => (
                        <button
                          key={room.id}
                          onClick={() => setSelectedRoom(room.id)}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            selectedRoom === room.id 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <span className="text-3xl block mb-2">{room.icon}</span>
                          <span className="font-medium">{room.name}</span>
                        </button>
                      ))}
                    </div>
                    <Button 
                      onClick={handleNextStep} 
                      className="w-full" 
                      size="lg"
                      disabled={!selectedRoom}
                    >
                      Далее <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}

                {/* Шаг 3: Площадь */}
                {step === 3 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <button onClick={handlePrevStep} className="text-muted-foreground hover:text-foreground flex items-center gap-1">
                      <ArrowLeft className="w-4 h-4" /> Назад
                    </button>
                    <h3 className="text-xl font-semibold">Шаг 3: Площадь помещения</h3>
                    
                    <div className="space-y-4">
                      <Label className="text-lg">
                        Площадь: <span className="text-primary font-bold">{area} м²</span>
                      </Label>
                      <Slider
                        value={[area]}
                        onValueChange={(val) => setArea(val[0])}
                        min={20}
                        max={500}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>20 м²</span>
                        <span>500 м²</span>
                      </div>
                      
                      <div className="pt-4">
                        <Label>Или введите точную площадь:</Label>
                        <Input
                          type="number"
                          value={area}
                          onChange={(e) => setArea(Math.max(20, Math.min(10000, parseInt(e.target.value) || 20)))}
                          min={20}
                          max={10000}
                          className="mt-2"
                        />
                      </div>
                    </div>
                    
                    <Button onClick={handleNextStep} className="w-full" size="lg">
                      Далее <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}

                {/* Шаг 4: Допуслуги */}
                {step === 4 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <button onClick={handlePrevStep} className="text-muted-foreground hover:text-foreground flex items-center gap-1">
                      <ArrowLeft className="w-4 h-4" /> Назад
                    </button>
                    <h3 className="text-xl font-semibold">Шаг 4: Дополнительные услуги (опционально)</h3>
                    
                    <div className="space-y-3">
                      {additionalServices.map((addon) => (
                        <label
                          key={addon.id}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            additionals[addon.id] 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={additionals[addon.id] || false}
                              onCheckedChange={(checked) => 
                                setAdditionals(prev => ({ ...prev, [addon.id]: !!checked }))
                              }
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                {addon.icon}
                                <span className="font-medium">{addon.name}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{addon.description}</p>
                            </div>
                          </div>
                          <span className="font-bold text-primary">+{addon.price}₽</span>
                        </label>
                      ))}
                    </div>
                    
                    <Button onClick={handleNextStep} className="w-full" size="lg">
                      Рассчитать <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}

                {/* Шаг 5: Результат и форма */}
                {step === 5 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <button onClick={handlePrevStep} className="text-muted-foreground hover:text-foreground flex items-center gap-1">
                      <ArrowLeft className="w-4 h-4" /> Изменить параметры
                    </button>
                    <h3 className="text-xl font-semibold">Ваша заявка готова!</h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label>Ваше имя *</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Как к вам обращаться"
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Телефон *</Label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+7 (___) ___-__-__"
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Email (необязательно)</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="email@example.com"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Комментарий</Label>
                        <Input
                          value={formData.comment}
                          onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                          placeholder="Дополнительная информация"
                          className="mt-1"
                        />
                      </div>
                      
                      <Button type="submit" className="w-full" size="lg">
                        Отправить заявку
                      </Button>
                      
                      <p className="text-sm text-muted-foreground text-center">
                        Менеджер перезвонит в течение 5 минут для уточнения деталей
                      </p>
                    </form>
                  </div>
                )}
              </div>

              {/* Результат */}
              <div className="lg:col-span-2">
                <div className="sticky top-24 bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Расчёт стоимости
                  </h3>

                  {/* Параметры */}
                  <div className="bg-white/10 rounded-xl p-4 mb-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="opacity-80">Услуга:</span>
                      <span className="font-medium">{getServiceName()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-80">Помещение:</span>
                      <span className="font-medium">{getRoomName()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-80">Площадь:</span>
                      <span className="font-medium">{area} м²</span>
                    </div>
                  </div>

                  {/* Детализация */}
                  <div className="bg-white/10 rounded-xl p-4 mb-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Базовая стоимость</span>
                      <span>{price.base}₽</span>
                    </div>
                    {Object.entries(additionals).map(([key, checked]) => {
                      if (!checked) return null;
                      const addon = additionalServices.find(a => a.id === key);
                      return addon ? (
                        <div key={key} className="flex justify-between opacity-80">
                          <span>+ {addon.name}</span>
                          <span>{addon.price}₽</span>
                        </div>
                      ) : null;
                    })}
                    {price.discount > 0 && (
                      <div className="flex justify-between text-yellow-300">
                        <span>Скидка 15%</span>
                        <span>-{price.discount}₽</span>
                      </div>
                    )}
                  </div>

                  {/* Итого */}
                  <div className="bg-black/20 rounded-xl p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg">ИТОГО:</span>
                      <span className="text-3xl font-bold">{price.total}₽</span>
                    </div>
                  </div>

                  {/* Гарантии */}
                  <div className="space-y-2 text-sm mb-6">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Цена фиксируется до начала работ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Без скрытых доплат</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Гарантия результата</span>
                    </div>
                  </div>

                  <a
                    href="tel:+79069989888"
                    className="block w-full py-4 bg-white text-primary text-center rounded-xl font-bold text-lg hover:scale-105 transition-transform"
                  >
                    <Phone className="w-5 h-5 inline mr-2" />
                    Позвонить сейчас
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Таблицы цен */}
        <section className="py-12 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Прайс-лист на услуги
            </h2>

            <Tabs defaultValue="dezinfekciya" className="max-w-5xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
                <TabsTrigger value="dezinfekciya">🧴 Дезинфекция</TabsTrigger>
                <TabsTrigger value="dezinsekciya">🐜 Дезинсекция</TabsTrigger>
                <TabsTrigger value="deratizaciya">🐀 Дератизация</TabsTrigger>
                <TabsTrigger value="other">📋 Другие</TabsTrigger>
              </TabsList>

              {Object.entries(priceTables).map(([key, rows]) => (
                <TabsContent key={key} value={key}>
                  <div className="overflow-x-auto rounded-xl border bg-card">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-4 font-semibold">Тип помещения</th>
                          <th className="text-left p-4 font-semibold">Площадь</th>
                          <th className="text-center p-4 font-semibold">💨 Холодный туман</th>
                          <th className="text-center p-4 font-semibold">🔥 Горячий туман</th>
                          <th className="text-center p-4 font-semibold">⏱️ Время</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-card' : 'bg-muted/20'}>
                            <td className="p-4 font-medium">{row.type}</td>
                            <td className="p-4">{row.area}</td>
                            <td className="p-4 text-center text-primary font-medium">{row.cold}</td>
                            <td className="p-4 text-center text-primary font-medium">{row.hot}</td>
                            <td className="p-4 text-center text-muted-foreground">{row.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Вопросы о ценах
            </h2>

            <Accordion type="single" collapsible className="max-w-3xl mx-auto">
              {faqItems.map((item, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger className="text-left text-lg font-medium">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Остались вопросы по ценам?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Позвоните нам для бесплатной консультации и точного расчёта стоимости
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+79069989888"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform"
              >
                <Phone className="w-5 h-5" />
                +7 (906) 998-98-88
              </a>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowLeadForm(true)}
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                Заказать звонок
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Suspense fallback={<div className="h-64 bg-muted animate-pulse" />}>
        <Footer />
      </Suspense>

      <LeadFormModal 
        open={showLeadForm} 
        onOpenChange={setShowLeadForm}
        calculatorData={{
          premiseType: getRoomName(),
          area: area,
          serviceType: getServiceName(),
          treatmentType: 'Холодный туман',
          period: 'single',
          clientType: 'private',
          totalPrice: price.base,
          discount: selectedService === 'kompleks' ? 15 : 0,
          discountAmount: price.discount,
          finalPrice: price.total,
        }}
      />
    </>
  );
}
