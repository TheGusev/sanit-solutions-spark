import { Calculator, CheckCircle, Info } from "lucide-react";
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
];

// Группировка услуг по типу для accordion
const groupedServices = {
  "Дезинфекция": servicePricesData.filter(s => s.service.startsWith("Дезинфекция")),
  "Дезинсекция": servicePricesData.filter(s => s.service.startsWith("Дезинсекция")),
  "Дератизация": servicePricesData.filter(s => s.service.startsWith("Дератизация")),
  "Озонирование": servicePricesData.filter(s => s.service.startsWith("Озонирование")),
  "Дезодорация": servicePricesData.filter(s => s.service.startsWith("Дезодорация")),
};

// Что входит в стоимость (для примечаний)
const includedNotes = [
  { icon: Info, text: "Выезд и диагностика в пределах МКАД — бесплатно" },
  { icon: CheckCircle, text: "Обработка помещения (холодный/горячий туман)" },
  { icon: CheckCircle, text: "Безопасные препараты IV класса" },
  { icon: CheckCircle, text: "Гарантия до 1 года" },
  { icon: CheckCircle, text: "Договор и акт — бесплатно" },
  { icon: CheckCircle, text: "Консультация 24/7" },
];

const PricingByArea = () => {
  const { ref: tableRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const getMinPrice = (items: typeof servicePricesData) => {
    return items[0]?.price || "";
  };

  return (
    <section className="py-16 bg-muted/30" id="pricing-by-area">
      <div className="container mx-auto px-4">
        {/* Заголовок секции */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Цены на услуги в Москве
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Прозрачное ценообразование. Выезд и диагностика в пределах МКАД — бесплатно!
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
          
          {/* Accordion */}
          <Accordion type="single" collapsible className="divide-y divide-border">
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

          {/* Примечания под таблицей */}
          <div className="p-4 bg-muted/30 border-t border-border">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-muted-foreground">
              {includedNotes.map((note, index) => (
                <div key={index} className="flex items-center gap-1">
                  <note.icon className="w-3 h-3 text-primary flex-shrink-0" />
                  <span>{note.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingByArea;
