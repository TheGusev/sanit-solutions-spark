import { Zap, CheckCircle, Shield, Pill, UserCheck } from 'lucide-react';

const advantages = [
  {
    icon: Zap,
    title: 'Выезд за 30 минут',
    description: 'Самый быстрый отклик в Москве. Работаем круглосуточно, без выходных и праздников.',
  },
  {
    icon: CheckCircle,
    title: 'Лицензия Роспотребнадзора',
    description: 'Все специалисты сертифицированы. Предоставляем официальные документы после обработки.',
  },
  {
    icon: Shield,
    title: 'Гарантия до 1 года',
    description: 'Бесплатная повторная обработка при необходимости. Полная ответственность за результат.',
  },
  {
    icon: Pill,
    title: 'Безопасные препараты',
    description: 'IV класс опасности. Безопасно для детей, беременных и домашних животных.',
  },
  {
    icon: UserCheck,
    title: 'Опытные специалисты',
    description: 'Средний стаж работы — 8 лет. Регулярное обучение и повышение квалификации.',
  },
];

const CardAdvantages = () => {
  return (
    <section
      id="advantages"
      className="stacking-card"
      style={{ '--card-index': 2 } as React.CSSProperties}
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-8 md:mb-12 text-center">
          Почему выбирают нас
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {advantages.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`flex gap-4 ${index === advantages.length - 1 ? 'md:col-span-2 md:max-w-md md:mx-auto' : ''}`}
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2 text-lg">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
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

export default CardAdvantages;
