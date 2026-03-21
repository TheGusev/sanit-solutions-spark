import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Home, Building2, Warehouse, Factory, 
  Snowflake, Flame, Target, Diamond, Microscope, Bug, Rat, Sparkles, 
  Calendar, CalendarCheck, FileText, User, Briefcase, Building, Phone, 
  Percent, TrendingUp, Check, ChevronDown, MoreHorizontal, FileText as FileTextIcon
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { LeadFormModal } from "./LeadFormModal";
import { CompactRequestModal } from "./CompactRequestModal"; // ← ДОБАВЛЕНО
import { QuickCallForm } from "./QuickCallForm";
import StickyCTA from "./StickyCTA";
import DesktopStickySidebar from "./DesktopStickySidebar";
import { useTraffic } from "@/contexts/TrafficContext";
import { supabase } from "@/lib/supabaseClient";
import { trackGoal } from "@/lib/analytics";

// Предустановки калькулятора по интентам
const CALCULATOR_DEFAULTS_BY_INTENT: Record<string, Partial<{
  premiseType: string;
  serviceType: string;
  clientType: string;
  treatmentType: string;
}>> = {
  flat_bedbugs: { premiseType: 'apartment', serviceType: 'disinsection', clientType: 'individual' },
  flat_cockroaches: { premiseType: 'apartment', serviceType: 'disinsection', clientType: 'individual' },
  flat_general: { premiseType: 'apartment', serviceType: 'disinfection', clientType: 'individual' },
  office_disinfection: { premiseType: 'office', serviceType: 'disinfection', clientType: 'company' },
  office_general: { premiseType: 'office', serviceType: 'disinfection', clientType: 'company' },
  warehouse_deratization: { premiseType: 'warehouse', serviceType: 'deratization', clientType: 'company' },
  warehouse_general: { premiseType: 'warehouse', serviceType: 'disinfection', clientType: 'company' },
  restaurant_disinfection: { premiseType: 'office', serviceType: 'disinfection', clientType: 'company' },
  restaurant_general: { premiseType: 'office', serviceType: 'complex', clientType: 'company' },
  ses_check_preparation: { premiseType: 'office', serviceType: 'disinfection', clientType: 'company', treatmentType: 'complex' },
  b2b_general: { clientType: 'company', serviceType: 'complex' },
  production_facility: { premiseType: 'production', serviceType: 'complex', clientType: 'company' },
  shop_store: { premiseType: 'office', serviceType: 'disinfection', clientType: 'company' }
};

interface CalculatorProps {
  isModal?: boolean;
}

const Calculator = ({ isModal = false }: CalculatorProps) => {
  const { context } = useTraffic();
  
  // Основные параметры
  const [area, setArea] = useState<number>(50);
  const [premiseType, setPremiseType] = useState<string>("apartment");
  const [treatmentType, setTreatmentType] = useState<string>("cold");
  const [serviceType, setServiceType] = useState<string>("disinfection");
  const [period, setPeriod] = useState<string>("once");
  const [clientType, setClientType] = useState<string>("individual");
  const [initialized, setInitialized] = useState(false);
  
  // UI состояния
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [areaError, setAreaError] = useState<string | null>(null);
  const [areaValid, setAreaValid] = useState(true);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showCompactForm, setShowCompactForm] = useState(false); // ← ДОБАВЛЕНО
  const [showClientType, setShowClientType] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const interactFired = useRef(false);
  const priceViewFired = useRef(false);

  // Предзаполнение калькулятора на основе интента
  useEffect(() => {
    if (!initialized && context?.intent) {
      const defaults = CALCULATOR_DEFAULTS_BY_INTENT[context.intent];
      if (defaults) {
        if (defaults.premiseType) setPremiseType(defaults.premiseType);
        if (defaults.serviceType) setServiceType(defaults.serviceType);
        if (defaults.clientType) setClientType(defaults.clientType);
        if (defaults.treatmentType) setTreatmentType(defaults.treatmentType);
      }
      setInitialized(true);
    }
  }, [context, initialized]);

  // Track calc_price_view once user interacts and sees a price
  useEffect(() => {
    if (hasInteracted && !priceViewFired.current) {
      priceViewFired.current = true;
      trackGoal("calc_price_view");
    }
  }, [hasInteracted]);

  // Логирование изменений полей калькулятора
  useEffect(() => {
    if (!context || !initialized) return;

    const timeoutId = setTimeout(() => {
      supabase.functions.invoke('log-traffic-event', {
        body: {
          session_id: context.sessionId,
          page_url: window.location.href,
          referrer: context.referrer,
          utm_source: context.utm_source,
          utm_medium: context.utm_medium,
          utm_campaign: context.utm_campaign,
          utm_content: context.utm_content,
          utm_term: context.utm_term,
          keyword_raw: context.keyword,
          yclid: context.yclid,
          gclid: context.gclid,
          intent: context.intent,
          device_type: context.deviceType,
          event_type: 'calc_change',
          event_data: {
            area,
            premiseType,
            serviceType,
            treatmentType,
            period,
            clientType,
            totalPrice: calculatePrice(),
            discount: calculateDiscount(),
            finalPrice: calculatePrice() - Math.round((calculatePrice() * calculateDiscount()) / 100)
          }
        }
      }).catch(err => console.debug('Traffic event logging failed:', err));
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [area, premiseType, serviceType, treatmentType, period, clientType, context, initialized]);

  // Типы помещений
  const premiseTypes = [
    { key: 'apartment', label: 'Квартира', icon: Home },
    { key: 'house', label: 'Дом', icon: Building2 },
    { key: 'office', label: 'Офис/Магазин', icon: Building },
    { key: 'warehouse', label: 'Склад', icon: Warehouse },
    { key: 'production', label: 'Производство', icon: Factory },
    { key: 'other', label: 'Другое', icon: MoreHorizontal },
  ];

  // Методы обработки
  const treatmentTypes = [
    { key: 'cold', label: 'Холодный туман', icon: Snowflake },
    { key: 'hot', label: 'Горячий туман', icon: Flame },
    { key: 'spot', label: 'Точечная', icon: Target },
    { key: 'complex', label: 'Комплексная', icon: Diamond },
  ];

  // Услуги
  const serviceTypes = [
    { key: 'disinfection', label: 'Дезинфекция', icon: Microscope },
    { key: 'disinsection', label: 'Дезинсекция', icon: Bug },
    { key: 'deratization', label: 'Дератизация', icon: Rat },
    { key: 'complex', label: 'Комплекс', icon: Sparkles },
  ];

  // Периодичность
  const periods = [
    { key: 'once', label: 'Разово', icon: Calendar },
    { key: 'monthly', label: 'Ежемесячно', icon: CalendarCheck },
    { key: 'quarterly', label: 'Ежеквартально', icon: FileText },
  ];

  // Расчёт цены
  const calculatePrice = (): number => {
    let basePrice = 20;

    const premiseMultiplier: Record<string, number> = {
      apartment: 1, house: 1.2, office: 1.3, warehouse: 1.5, 
      shop: 1.4, restaurant: 1.4, production: 1.6, other: 1.0
    };

    const treatmentMultiplier: Record<string, number> = {
      cold: 1, hot: 1.3, spot: 0.8, complex: 1.5,
    };

    const serviceMultiplier: Record<string, number> = {
      disinfection: 1, disinsection: 1.2, deratization: 1.1, complex: 1.8,
    };

    const periodMultiplier: Record<string, number> = {
      once: 1, monthly: 0.85, quarterly: 0.9,
    };

    const price = basePrice * area * 
      (premiseMultiplier[premiseType] || 1) * 
      (treatmentMultiplier[treatmentType] || 1) * 
      (serviceMultiplier[serviceType] || 1) * 
      (periodMultiplier[period] || 1);

    return Math.round(price);
  };

  // Улучшенный расчет скидки
  const calculateDiscount = (): number => {
    let baseDiscount = 0;
    
    // Базовая скидка от площади
    baseDiscount = Math.min(30, Math.floor((area / 100) * 10));
    
    // Дополнительные скидки по типу помещения
    if (premiseType === 'apartment' && area >= 100) {
      baseDiscount += 5;
    }
    
    if ((premiseType === 'office' || premiseType === 'warehouse') && area >= 100) {
      if (area >= 200) baseDiscount += 10;
      else if (area >= 100) baseDiscount += 5;
    }
    
    // Скидка за комплексную услугу
    if (serviceType === 'complex') {
      baseDiscount += 8;
    }
    
    // Скидка за горячий туман
    if (treatmentType === 'hot') {
      baseDiscount += 3;
    }
    
    return Math.min(40, baseDiscount);
  };

  const totalPrice = calculatePrice();
  const discount = calculateDiscount();
  const discountAmount = Math.round((totalPrice * discount) / 100);
  const finalPrice = totalPrice - discountAmount;

  // Валидация площади
  const handleAreaChange = (value: number) => {
    setArea(value);
    if (!interactFired.current) {
      interactFired.current = true;
      trackGoal("calc_interact");
    }
    setHasInteracted(true);
    if (value < 30 || value > 5000) {
      setAreaError('Допустимый диапазон 30–5000 м²');
      setAreaValid(false);
    } else {
      setAreaError(null);
      setAreaValid(true);
    }
  };

  // Обработка заказа (полная форма)
  const handleOrder = () => {
    if (context) {
      supabase.functions.invoke('log-traffic-event', {
        body: {
          session_id: context.sessionId,
          page_url: window.location.href,
          utm_source: context.utm_source,
          utm_medium: context.utm_medium,
          utm_campaign: context.utm_campaign,
          utm_content: context.utm_content,
          utm_term: context.utm_term,
          keyword_raw: context.keyword,
          intent: context.intent,
          device_type: context.deviceType,
          event_type: 'calc_submit',
          event_data: {
            area,
            premiseType,
            serviceType,
            totalPrice,
            discount,
            finalPrice
          }
        }
      }).catch(err => console.debug('Traffic event logging failed:', err));
    }
    
    setShowLeadForm(true);
  };

  // Обработка компактной формы
  const handleCompactRequest = () => {
    setShowCompactForm(true);
  };

  // Получить КП для бизнеса
  const handleGetOffer = () => {
    const email = prompt("Введите ваш email для отправки коммерческого предложения:");
    if (email && email.trim()) {
      const message = `📄 Запрос коммерческого предложения
    
📧 Email: ${email}
📐 Площадь: ${area} м²
🏢 Помещение: ${getPremiseLabel()}
🔧 Услуга: ${getServiceLabel()}
⚙️ Обработка: ${getTreatmentLabel()}
📅 Периодичность: ${getPeriodLabel()}

💰 Расчётная стоимость: ${finalPrice}₽
📉 Скидка: ${discount}%`;

      window.location.href = `tel:84950181817`;
      
      toast.success("Позвоните нам для получения коммерческого предложения на ваш email.");
    }
  };

  // Вспомогательные функции для получения названий
  const getPremiseLabel = (): string => {
    const labels: Record<string, string> = {
      apartment: 'Квартира', house: 'Частный дом', office: 'Офис',
      warehouse: 'Склад', shop: 'Магазин', restaurant: 'Ресторан',
      production: 'Производство', other: 'Другое'
    };
    return labels[premiseType] || premiseType;
  };

  const getServiceLabel = (): string => {
    const labels: Record<string, string> = {
      disinfection: 'Дезинфекция', disinsection: 'Дезинсекция',
      deratization: 'Дератизация', complex: 'Комплекс'
    };
    return labels[serviceType] || serviceType;
  };

  const getTreatmentLabel = (): string => {
    const labels: Record<string, string> = {
      cold: 'Холодный туман', hot: 'Горячий туман',
      spot: 'Точечная', complex: 'Комплексная'
    };
    return labels[treatmentType] || treatmentType;
  };

  const getPeriodLabel = (): string => {
    const labels: Record<string, string> = {
      once: 'Разово', monthly: 'Ежемесячно', quarterly: 'Ежеквартально'
    };
    return labels[period] || period;
  };

  // График данных
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

  // Сравнение методов
  const calculateComparison = () => {
    return treatmentTypes.map(treatment => {
      const multipliers: Record<string, number> = {
        cold: 1.0, hot: 1.3, spot: 0.8, complex: 1.5
      };
      const basePrice = Math.round(50 * area * multipliers[treatment.key]);
      const discountAmount = Math.round((basePrice * discount) / 100);
      const finalPrice = basePrice - discountAmount;
      
      return {
        ...treatment,
        basePrice,
        finalPrice,
        savings: discountAmount,
      };
    });
  };

  // Компонент для компактной кнопки
  const CompactRequestButton = () => (
    <button
      onClick={handleCompactRequest}
      className="group flex items-center justify-center gap-2 px-4 py-2.5 border border-muted-foreground/30 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 w-full mt-4"
    >
      <div className="bg-primary/10 p-1.5 rounded-lg group-hover:bg-primary/20 transition-colors">
        <FileTextIcon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 text-left">
        <div className="font-medium text-sm text-foreground">📝 Оставить заявку</div>
        <div className="text-xs text-muted-foreground">Откроется форма для заполнения</div>
      </div>
    </button>
  );

  // Wrapper based on mode
  const Wrapper = isModal ? 'div' : 'section';
  const wrapperProps = isModal ? {} : { id: 'calculator' };
  const wrapperClassName = isModal ? '' : 'py-10 md:py-20 bg-background';

  return (
    <Wrapper {...wrapperProps} className={wrapperClassName}>
      <div className={isModal ? '' : 'container mx-auto px-4'}>
        {/* Section header - hide in modal */}
        {!isModal && (
          <div className="text-center mb-6 md:mb-12 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Рассчитайте <span className="text-primary">стоимость</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Получите точную цену с учётом автоматической скидки
            </p>
          </div>
        )}

        {/* Split layout for desktop */}
        <div className={isModal ? '' : 'max-w-6xl mx-auto lg:flex lg:gap-8'}>
          {/* Left column - Main calculator */}
          <div className={isModal ? 'w-full' : 'lg:w-7/12'}>
            <div className={isModal ? 'space-y-4' : 'bg-card p-4 sm:p-8 rounded-3xl shadow-xl mb-20 lg:mb-0'}>
            {/* БЛОК 1: Базовый расчёт */}
            <div className={isModal ? 'space-y-4' : 'space-y-6'}>
              
              {/* Что нужно обработать? */}
              <div>
                <div className="flex flex-wrap gap-2">
                  {premiseTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.key}
                        onClick={() => {
                          setPremiseType(type.key);
                          if (!interactFired.current) { interactFired.current = true; trackGoal("calc_interact"); }
                          setHasInteracted(true);
                        }}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                          premiseType === type.key
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {type.label}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Можно выбрать ближайший тип, точные детали уточним по телефону.
                </p>
              </div>

              {/* Площадь объекта */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base font-bold">Площадь объекта</Label>
                  {areaValid && (
                    <span className="text-success text-sm flex items-center gap-1">
                      <Check className="w-4 h-4" /> Ок
                    </span>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[area]}
                      onValueChange={(values) => handleAreaChange(values[0])}
                      min={30}
                      max={200}
                      step={10}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={area}
                      onChange={(e) => handleAreaChange(Number(e.target.value))}
                      className={`w-24 ${areaError ? 'border-destructive' : ''}`}
                      min={30}
                      max={5000}
                    />
                    <span className="text-sm text-muted-foreground">м²</span>
                  </div>
                  
                  {areaError && (
                    <p className="text-destructive text-sm">{areaError}</p>
                  )}
                  
                </div>
              </div>

              {/* Кто вы? - скрыто по умолчанию для физлиц */}
              {showClientType ? (
                <div>
                  <Label className="text-base font-bold mb-3 block">Кто вы?</Label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setClientType('individual');
                        setHasInteracted(true);
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                        clientType === 'individual'
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      Физ. лицо
                    </button>
                    <button
                      onClick={() => {
                        setClientType('ip');
                        setHasInteracted(true);
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                        clientType === 'ip'
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                      ИП
                    </button>
                    <button
                      onClick={() => {
                        setClientType('company');
                        setHasInteracted(true);
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                        clientType === 'company'
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      <Building className="w-4 h-4" />
                      Компания
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Блок результата */}
              <div className="bg-gradient-to-br from-primary/5 to-success/5 p-4 sm:p-6 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Базовая стоимость</span>
                  <span className="text-xl font-bold line-through text-muted-foreground">{totalPrice}₽</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Ваша скидка</span>
                  <span className="text-xl font-bold text-success">{discount}% (-{discountAmount}₽)</span>
                </div>
                
                <div className="pt-3 border-t border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold">Итоговая цена</span>
                    <span className="text-3xl sm:text-4xl font-bold text-primary">{finalPrice}₽</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ориентировочная стоимость. Точный расчёт после бесплатного осмотра.
                  </p>
                </div>
              </div>

              {/* Inline Quick Call Form - главный CTA */}
              <QuickCallForm
                calculatorData={{
                  premiseType,
                  area,
                  serviceType,
                  treatmentType,
                  period,
                  clientType,
                  totalPrice,
                  discount,
                  discountAmount,
                  finalPrice,
                }}
              />

              {/* Компактная кнопка для формы */}
              <CompactRequestButton />
              
              {/* Альтернативная кнопка для полной формы - скрыта в модале */}
              {!isModal && (
                <div className="text-center">
                  <button
                    onClick={handleOrder}
                    className="text-sm text-muted-foreground hover:text-primary underline underline-offset-2"
                  >
                    Заполнить полную форму заявки
                  </button>
                </div>
              )}
              
              {(clientType === 'ip' || clientType === 'company') && (
                <Button
                  onClick={handleGetOffer}
                  variant="outline"
                  className="w-full text-base py-4 h-auto whitespace-normal"
                >
                  Получить коммерческое предложение
                </Button>
              )}

            </div>

            {/* БЛОК 2: Расширенные настройки (аккордеон) - скрыт в модале */}
            {!isModal && (
            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced} className="mt-8">
              <CollapsibleTrigger className="w-full bg-muted/30 hover:bg-muted/50 p-4 rounded-xl transition-all flex items-center justify-between">
                <div className="text-left">
                  <h3 className="font-bold text-base">Расширенные настройки</h3>
                  <p className="text-xs text-muted-foreground">Выбор метода, услуги и периодичности</p>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-4 space-y-6 px-2">
                
                {/* Метод обработки */}
                <div>
                  <Label className="text-sm font-bold mb-3 block">Метод обработки</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {treatmentTypes.map(treatment => {
                      const Icon = treatment.icon;
                      return (
                        <button
                          key={treatment.key}
                          onClick={() => setTreatmentType(treatment.key)}
                          className={`p-3 rounded-xl border-2 transition-all text-center ${
                            treatmentType === treatment.key
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <Icon className={`w-6 h-6 mx-auto mb-2 ${treatmentType === treatment.key ? 'text-primary' : 'text-muted-foreground'}`} />
                          <p className="text-xs font-medium">{treatment.label}</p>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Мы автоматически подбираем метод, вы можете изменить вручную.
                  </p>
                </div>

                {/* Услуга */}
                <div>
                  <Label className="text-sm font-bold mb-3 block">Услуга</Label>
                  <div className="flex flex-wrap gap-2">
                    {serviceTypes.map(service => {
                      const Icon = service.icon;
                      return (
                        <button
                          key={service.key}
                          onClick={() => setServiceType(service.key)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                            serviceType === service.key
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted hover:bg-muted/80'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {service.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Периодичность */}
                <div>
                  <Label className="text-sm font-bold mb-3 block">Периодичность</Label>
                  <div className="flex flex-wrap gap-2">
                    {periods.map(p => {
                      const Icon = p.icon;
                      return (
                        <button
                          key={p.key}
                          onClick={() => setPeriod(p.key)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                            period === p.key
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted hover:bg-muted/80'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </CollapsibleContent>
            </Collapsible>
            )}

            {/* БЛОК 3: Аналитика (по клику) - скрыт в модале */}
            {!isModal && (
            <div className="mt-8 space-y-4">
              
              {/* Кнопки для показа аналитики */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowComparison(!showComparison)}
                  className="justify-start"
                >
                  {showComparison ? 'Скрыть' : 'Сравнить методы обработки'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowChart(!showChart)}
                  className="justify-start"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {showChart ? 'Скрыть' : 'Показать график цены от площади'}
                </Button>
              </div>

              {/* Блок сравнения */}
              {showComparison && (
                <div className="bg-gradient-to-r from-accent/5 to-success/5 p-4 sm:p-6 rounded-2xl animate-in fade-in duration-300">
                  <h3 className="font-bold mb-4">Сравнение методов при {area} м²</h3>
                  
                  {/* Горизонтальный свайп на мобильных */}
                  <div className="overflow-x-auto pb-2">
                    <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-4 gap-3 min-w-max sm:min-w-0">
                      {calculateComparison().map(item => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={item.key}
                            className={`p-4 rounded-xl border-2 min-w-[200px] sm:min-w-0 ${
                              treatmentType === item.key
                                ? 'border-primary bg-primary/5'
                                : 'border-border bg-card'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <Icon className="w-5 h-5 text-primary" />
                              <h4 className="font-bold text-sm">{item.label}</h4>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Базовая</span>
                                <span className="line-through">{item.basePrice}₽</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Со скидкой</span>
                                <span className="font-bold text-success">{item.finalPrice}₽</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Экономия</span>
                                <span className="text-success">-{item.savings}₽</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* График */}
              {showChart && (
                <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 sm:p-6 rounded-2xl animate-in fade-in duration-300">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Percent className="w-5 h-5 text-primary" />
                    Зависимость цены от площади
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={generateChartData()} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
                          borderRadius: '8px'
                        }}
                        formatter={(value: number) => `${value}₽`}
                      />
                      <Legend iconType="line" wrapperStyle={{ fontSize: '12px' }} />
                      <ReferenceLine 
                        x={area} 
                        stroke="hsl(var(--primary))" 
                        strokeDasharray="3 3"
                        label={{ value: 'Текущая', position: 'top' }}
                      />
                      <Line type="monotone" dataKey="cold" stroke="#3B82F6" strokeWidth={2} name="Холодный туман" dot={false} />
                      <Line type="monotone" dataKey="hot" stroke="#EF4444" strokeWidth={2} name="Горячий туман" dot={false} />
                      <Line type="monotone" dataKey="spot" stroke="#22C55E" strokeWidth={2} name="Точечная" dot={false} />
                      <Line type="monotone" dataKey="complex" stroke="#A855F7" strokeWidth={2} name="Комплексная" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

            </div>
            )}

            {/* Подпись о персональных данных */}
            <p className="text-xs text-muted-foreground text-center mt-6">
              Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
            </p>

          </div>
          </div>
          
          {/* Right column - Desktop Sticky Sidebar */}
          {!isModal && (
            <div className="hidden lg:block lg:w-5/12">
              <DesktopStickySidebar
                finalPrice={finalPrice}
                totalPrice={totalPrice}
                discount={discount}
                area={area}
                premiseType={premiseType}
                serviceType={serviceType}
                getPremiseLabel={getPremiseLabel}
                getServiceLabel={getServiceLabel}
              />
            </div>
          )}
        </div>
      </div>

      {/* Мобильный липкий бар */}
      {!isModal && (
        <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t shadow-2xl p-4 md:hidden z-50 animate-slide-up">
          <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-primary">{finalPrice}₽</p>
                {discount > 0 && (
                  <span className="text-xs text-success font-medium">-{discount}%</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Перезвоним за 15 мин</p>
            </div>
            <Button 
              onClick={handleOrder} 
              size="lg"
              className="flex-1 max-w-[200px] h-12 text-base font-bold animate-pulse hover:animate-none"
            >
              <Phone className="w-5 h-5 mr-2" />
              Заказать
            </Button>
          </div>
        </div>
      )}

      {/* Модальное окно полной формы */}
      <LeadFormModal
        open={showLeadForm}
        onOpenChange={setShowLeadForm}
        calculatorData={{
          premiseType,
          area,
          serviceType,
          treatmentType,
          period,
          clientType,
          totalPrice,
          discount,
          discountAmount,
          finalPrice,
        }}
      />

      {/* Модальное окно компактной формы */}
      <CompactRequestModal
        open={showCompactForm}
        onOpenChange={setShowCompactForm}
        calculatorData={{
          premiseType,
          area,
          serviceType,
          treatmentType,
          period,
          clientType,
          totalPrice,
          discount,
          discountAmount,
          finalPrice,
        }}
      />

      {/* Sticky CTA после прокрутки */}
      {!isModal && (
        <StickyCTA 
          price={finalPrice}
          discount={discount}
          onOrderClick={handleOrder}
        />
      )}
    </Wrapper>
  );
};

export default Calculator;
