import { Phone, Search, Microscope, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: Phone,
    number: 1,
    title: 'Звонок и консультация',
    description: 'Бесплатная оценка ситуации и расчёт стоимости по телефону',
  },
  {
    icon: Search,
    number: 2,
    title: 'Выезд специалиста',
    description: 'Осмотр и диагностика проблемы на месте в удобное время',
  },
  {
    icon: Microscope,
    number: 3,
    title: 'Профессиональная обработка',
    description: 'Современное оборудование и сертифицированные препараты',
  },
  {
    icon: CheckCircle,
    number: 4,
    title: 'Гарантия и поддержка',
    description: 'Документы, гарантия до 1 года и контроль результата',
  },
];

const CardProcess = () => {
  return (
    <section
      id="process"
      className="stacking-card"
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-8 md:mb-12 text-center">
          Как мы работаем — 4 простых шага
        </h2>
        
        {/* Desktop: Horizontal timeline */}
        <div className="hidden md:block">
          {/* Timeline line */}
          <div className="relative">
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-primary/20" />
            <div className="absolute top-6 left-0 w-1/4 h-0.5 bg-primary" />
            
            <div className="grid grid-cols-4 gap-4">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.number} className="relative text-center">
                    {/* Circle with number */}
                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4 font-bold text-lg relative z-10">
                      {step.number}
                    </div>
                    
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    
                    <h3 className="font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Mobile: Vertical timeline */}
        <div className="md:hidden space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative flex gap-4">
                {/* Vertical line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-primary/20" />
                )}
                
                {/* Circle with number */}
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold text-lg relative z-10">
                  {step.number}
                </div>
                
                <div className="flex-1 pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CardProcess;
