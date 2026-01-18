/**
 * === CARD 3: МЕТОДЫ ДЕЗИНФЕКЦИИ ===
 * Сравнение холодного и горячего тумана
 * 
 * @section id="metody"
 * @layout 2 колонки методов + сравнительная таблица
 */

import { dezinfekciyaData } from '@/data/dezinfekciyaData';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface CardMethodsProps {
  onOrderClick: () => void;
}

const CardMethods = ({ onOrderClick }: CardMethodsProps) => {
  const { methods, methodsComparison } = dezinfekciyaData;

  return (
    <section 
      id="metody"
      className="service-card relative min-h-[80vh] flex items-center"
      aria-labelledby="methods-heading"
    >
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Заголовок */}
        <div className="text-center mb-8 md:mb-12">
          <h2 
            id="methods-heading"
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3"
          >
            Методы дезинфекции
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Выбираем оптимальный метод под ваши задачи
          </p>
        </div>

        {/* Карточки методов */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto mb-10 md:mb-14">
          {/* Холодный туман */}
          <div className="method-card bg-gradient-to-br from-card to-muted/50 rounded-2xl p-6 md:p-8 border-2 border-border hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl md:text-5xl" role="img" aria-hidden="true">
                {methods.cold.icon}
              </span>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground">
                  {methods.cold.name}
                </h3>
                <p className="text-primary font-semibold text-lg">
                  {methods.cold.price}
                </p>
              </div>
            </div>

            <p className="text-muted-foreground mb-5 leading-relaxed">
              {methods.cold.description}
            </p>

            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>Частицы: {methods.cold.particles}</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>Температура: {methods.cold.temp}</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>Безопасно через {methods.cold.time}</span>
              </li>
            </ul>

            <Button onClick={onOrderClick} className="w-full">
              Заказать холодный туман
            </Button>
          </div>

          {/* Горячий туман */}
          <div className="method-card bg-gradient-to-br from-card to-primary/5 rounded-2xl p-6 md:p-8 border-2 border-primary/30 hover:border-primary transition-colors relative overflow-hidden">
            {/* Бейдж "Рекомендуем" */}
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
              Рекомендуем
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl md:text-5xl" role="img" aria-hidden="true">
                {methods.hot.icon}
              </span>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground">
                  {methods.hot.name}
                </h3>
                <p className="text-primary font-semibold text-lg">
                  {methods.hot.price}
                </p>
              </div>
            </div>

            <p className="text-muted-foreground mb-5 leading-relaxed">
              {methods.hot.description}
            </p>

            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>Частицы: {methods.hot.particles}</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>Температура: {methods.hot.temp}</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>Эффективность: {methods.hot.effectiveness}</span>
              </li>
            </ul>

            <Button onClick={onOrderClick} className="w-full">
              Заказать горячий туман
            </Button>
          </div>
        </div>

        {/* Сравнительная таблица */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold text-center mb-4">
            Сравнение методов
          </h3>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-3 md:p-4 font-semibold">Параметр</th>
                  <th className="text-center p-3 md:p-4 font-semibold">💨 Холодный</th>
                  <th className="text-center p-3 md:p-4 font-semibold">🔥 Горячий</th>
                </tr>
              </thead>
              <tbody>
                {methodsComparison.map((row, index) => (
                  <tr 
                    key={index} 
                    className={index % 2 === 0 ? 'bg-card' : 'bg-muted/20'}
                  >
                    <td className="p-3 md:p-4 font-medium">{row.param}</td>
                    <td className="p-3 md:p-4 text-center">{row.cold}</td>
                    <td className="p-3 md:p-4 text-center text-primary font-medium">{row.hot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardMethods;
