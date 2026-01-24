import { useState } from "react";
import { Calculator, CheckCircle, Gift, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Данные цен
const servicePricesData = [
  { id: 1, service: "Дезинфекция", object: "1-комнатная квартира", price: "от 1000 ₽" },
  { id: 2, service: "Дезинфекция", object: "2-3 комнатная квартира", price: "от 1500 ₽" },
  { id: 3, service: "Дезинфекция", object: "Офис до 50 м²", price: "от 1800 ₽" },
  { id: 4, service: "Дезинфекция", object: "Склад от 100 м²", price: "от 2500 ₽" },
  { id: 5, service: "Дезинсекция (тараканы, клопы)", object: "1-комнатная квартира", price: "от 1200 ₽" },
  { id: 6, service: "Дезинсекция", object: "2-3 комнатная квартира", price: "от 1800 ₽" },
  { id: 7, service: "Дезинсекция", object: "Частный дом", price: "от 2000 ₽" },
  { id: 8, service: "Дератизация (крысы, мыши)", object: "Квартира", price: "от 1400 ₽" },
  { id: 9, service: "Дератизация", object: "Частный дом", price: "от 2000 ₽" },
  { id: 10, service: "Дератизация", object: "Склад/подвал", price: "от 2500 ₽" },
  { id: 11, service: "Озонирование", object: "Квартира до 50 м²", price: "от 1500 ₽" },
  { id: 12, service: "Озонирование", object: "Офис 50-100 м²", price: "от 2000 ₽" },
  { id: 13, service: "Дезодорация", object: "Квартира", price: "от 1200 ₽" },
  { id: 14, service: "Дезодорация", object: "После пожара/затопления", price: "от 2500 ₽" },
  { id: 15, service: "Сертификация", object: "Документы для СЭС", price: "от 3000 ₽" },
];

// Группировка услуг по типу для мобильного accordion
const groupedServices = {
  "Дезинфекция": servicePricesData.filter(s => s.service.startsWith("Дезинфекция")),
  "Дезинсекция": servicePricesData.filter(s => s.service.startsWith("Дезинсекция")),
  "Дератизация": servicePricesData.filter(s => s.service.startsWith("Дератизация")),
  "Озонирование": servicePricesData.filter(s => s.service.startsWith("Озонирование")),
  "Дезодорация": servicePricesData.filter(s => s.service.startsWith("Дезодорация")),
  "Сертификация": servicePricesData.filter(s => s.service.startsWith("Сертификация")),
};


// Что входит в стоимость
const includedServicesData = [
  "Бесплатный выезд и диагностика (ЦАО/САО)",
  "Обработка помещения (холодный/горячий туман)",
  "Безопасные препараты IV класса",
  "Гарантия до 1 года",
  "Договор и акт",
  "Консультация 24/7",
];

// Скидки и акции
const discountsData = [
  { text: "15% при заказе 2+ услуг" },
  { text: "10% для постоянных клиентов" },
  { text: "5% при оплате онлайн" },
  { text: "Бесплатная повторная обработка (по гарантии)" },
];

const PricingByArea = () => {
  const { ref: tableRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const scrollToCalculator = () => {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
  };


  const getMinPrice = (items: typeof servicePricesData) => {
    return items[0]?.price || "";
  };

  return (
    <section className="py-16 bg-muted/30" id="pricing-by-area">
      <div className="container mx-auto px-4">
        {/* СЕКЦИЯ 1: БАЗОВЫЕ ЦЕНЫ */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Цены на услуги в Москве
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Прозрачное ценообразование. Выезд в ЦАО/САО — бесплатно!
          </p>
        </div>

        {/* Таблица цен */}
        <div ref={tableRef} className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border mb-8">
          <div className="bg-primary/10 px-6 py-4 border-b border-border">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Базовые цены на услуги
            </h3>
          </div>
          
          {/* Unified Accordion for all devices */}
          <Accordion type="single" collapsible defaultValue="Дезинфекция" className="divide-y divide-border">
            {Object.entries(groupedServices).map(([serviceName, items]) => (
              <AccordionItem key={serviceName} value={serviceName} className="border-0">
                <AccordionTrigger className="px-4 md:px-6 py-3 md:py-4 hover:no-underline hover:bg-muted/30">
                  <div className="flex items-center justify-between w-full pr-2">
                    <span className="font-bold text-foreground text-left text-base md:text-lg">
                      {serviceName}
                    </span>
                    <span className="text-success font-bold text-sm md:text-base">
                      {getMinPrice(items)}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <div className="divide-y divide-border/50">
                    {items.map((item, index) => (
                      <div 
                        key={item.id} 
                        className={`px-4 md:px-6 py-2 md:py-3 flex justify-between bg-muted/20 transition-all duration-300 ${
                          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                        }`}
                        style={{ transitionDelay: `${index * 50}ms` }}
                      >
                        <span className="text-muted-foreground text-sm md:text-base">{item.object}</span>
                        <span className="text-success font-semibold text-sm md:text-base">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* 4 примечания под таблицей */}
          <div className="p-4 bg-muted/30 border-t border-border">
            <div className="grid sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Info className="w-3 h-3 text-primary flex-shrink-0" />
                <span>Цены указаны для ЦАО/САО (выезд бесплатно)</span>
              </div>
              <div className="flex items-center gap-1">
                <Gift className="w-3 h-3 text-primary flex-shrink-0" />
                <span>Скидка 15% при заказе 2+ услуг</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />
                <span>В стоимость входит: диагностика, обработка, гарантия</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />
                <span>Договор и акт — бесплатно</span>
              </div>
            </div>
          </div>
        </div>


        {/* СЕКЦИЯ 3: ЧТО ВХОДИТ + СКИДКИ */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Что входит в стоимость */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Что входит в стоимость
            </h4>
            <ul className="space-y-3">
              {includedServicesData.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-success mt-0.5 flex-shrink-0">✅</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Скидки и акции */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              Скидки и акции
            </h4>
            <ul className="space-y-3">
              {discountsData.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-success mt-0.5 flex-shrink-0">✅</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* СЕКЦИЯ 4: CTA-КНОПКА */}
        <div className="flex justify-center">
          <Button 
            size="lg" 
            onClick={scrollToCalculator}
            className="gap-2"
          >
            <Calculator className="w-5 h-5" />
            Рассчитать стоимость
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingByArea;
