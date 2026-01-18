/**
 * === CARD 2: ТИПЫ ПОМЕЩЕНИЙ ===
 * Сетка карточек с типами помещений для дезинфекции
 * 
 * @section id="pomeshheniya"
 * @layout Grid 3x2 на desktop, 1 колонка на mobile
 */

import { dezinfekciyaData } from '@/data/dezinfekciyaData';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CardRoomsProps {
  onOrderClick: () => void;
}

const CardRooms = ({ onOrderClick }: CardRoomsProps) => {
  const { rooms } = dezinfekciyaData;

  return (
    <section 
      id="pomeshheniya"
      className="service-card relative min-h-[80vh] flex items-center bg-muted/30"
      aria-labelledby="rooms-heading"
    >
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Заголовок секции */}
        <div className="text-center mb-8 md:mb-12">
          <h2 
            id="rooms-heading"
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3"
          >
            Дезинфекция помещений
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Выберите тип вашего помещения для расчёта стоимости
          </p>
        </div>

        {/* Сетка карточек помещений */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {rooms.map((room, index) => (
            <article 
              key={index}
              className="room-card group bg-card rounded-xl p-5 md:p-6 border border-border/50 
                         shadow-sm hover:shadow-lg transition-all duration-300 
                         hover:-translate-y-2 hover:border-primary/30 cursor-pointer"
              onClick={onOrderClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onOrderClick()}
              aria-label={`Дезинфекция ${room.name.toLowerCase()} ${room.price}`}
            >
              {/* Иконка и название */}
              <div className="flex items-center gap-3 mb-4">
                <span 
                  className="text-3xl md:text-4xl" 
                  role="img" 
                  aria-hidden="true"
                >
                  {room.icon}
                </span>
                <div>
                  <h3 className="font-bold text-lg md:text-xl text-foreground group-hover:text-primary transition-colors">
                    {room.name}
                  </h3>
                  <p className="text-primary font-semibold">
                    {room.price}
                  </p>
                </div>
              </div>

              {/* Время работы */}
              <p className="text-sm text-muted-foreground mb-3">
                ⏱️ Время работы: {room.time}
              </p>

              {/* Особенности */}
              <ul className="space-y-1.5 mb-4">
                {room.features.map((feature, featureIndex) => (
                  <li 
                    key={featureIndex}
                    className="text-sm text-muted-foreground flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Кнопка */}
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full group-hover:bg-primary/10 group-hover:text-primary"
              >
                Подробнее
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </article>
          ))}
        </div>

        {/* Примечание */}
        <p className="text-center text-sm text-muted-foreground mt-8 max-w-2xl mx-auto">
          * Окончательная стоимость рассчитывается после осмотра помещения. 
          Возможны скидки при заказе нескольких услуг.
        </p>
      </div>
    </section>
  );
};

export default CardRooms;
