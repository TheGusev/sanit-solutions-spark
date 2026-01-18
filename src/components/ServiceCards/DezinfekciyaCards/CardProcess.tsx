/**
 * === CARD 5: ЭТАПЫ РАБОТЫ ===
 * Вертикальный timeline с 4 шагами
 * 
 * @section id="etapy"
 * @layout Timeline с номерами и деталями
 */

import { dezinfekciyaData } from '@/data/dezinfekciyaData';
import { Phone, Clock, Shield, HeartHandshake } from 'lucide-react';

const stepIcons = [Phone, Clock, Shield, HeartHandshake];

const CardProcess = () => {
  const { steps } = dezinfekciyaData;

  return (
    <section 
      id="etapy"
      className="service-card relative min-h-[80vh] flex items-center"
      aria-labelledby="process-heading"
    >
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Заголовок */}
        <div className="text-center mb-10 md:mb-14">
          <h2 
            id="process-heading"
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3"
          >
            Как мы работаем
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Простой и понятный процесс от звонка до результата
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-2xl mx-auto">
          {steps.map((step, index) => {
            const IconComponent = stepIcons[index] || Phone;
            const isLast = index === steps.length - 1;

            return (
              <div 
                key={step.number}
                className="timeline-step relative pl-16 md:pl-20 pb-10 md:pb-14"
                data-number={step.number}
              >
                {/* Номер шага с иконкой */}
                <div 
                  className="absolute left-0 top-0 w-10 h-10 md:w-12 md:h-12 
                             bg-primary text-primary-foreground rounded-full 
                             flex items-center justify-center font-bold text-lg md:text-xl
                             shadow-lg shadow-primary/30"
                  aria-hidden="true"
                >
                  {step.number}
                </div>

                {/* Линия соединения */}
                {!isLast && (
                  <div 
                    className="absolute left-[19px] md:left-[23px] top-12 md:top-14 
                               w-0.5 h-[calc(100%-48px)] md:h-[calc(100%-56px)]
                               bg-gradient-to-b from-primary/50 to-primary/10"
                    aria-hidden="true"
                  />
                )}

                {/* Контент шага */}
                <div className="bg-card rounded-xl p-5 md:p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <IconComponent className="w-5 h-5 text-primary" />
                    <h3 className="text-lg md:text-xl font-bold text-foreground">
                      {step.title}
                    </h3>
                  </div>

                  <ul className="space-y-2">
                    {step.items.map((item, itemIndex) => (
                      <li 
                        key={itemIndex}
                        className="flex items-start gap-2 text-sm md:text-base text-muted-foreground"
                      >
                        <span 
                          className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2 flex-shrink-0" 
                          aria-hidden="true" 
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Примечание */}
        <p className="text-center text-sm text-muted-foreground mt-6 max-w-xl mx-auto">
          Весь процесс занимает от 1 до 4 часов в зависимости от площади и метода обработки. 
          Мы работаем аккуратно и профессионально.
        </p>
      </div>
    </section>
  );
};

export default CardProcess;
