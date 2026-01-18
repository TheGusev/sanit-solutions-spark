import { Phone, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CardHeroProps {
  onCalculatorClick: () => void;
}

const CardHero = ({ onCalculatorClick }: CardHeroProps) => {
  const handleCall = () => {
    window.location.href = 'tel:+79069989888';
  };

  return (
    <section
      id="hero"
      className="stacking-card relative overflow-hidden py-12 md:py-20"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
          Профессиональная дезинфекция и дезинсекция в Москве
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
          <span className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Выезд за 30 минут
          </span>
          <span className="mx-3">•</span>
          <span className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Гарантия до 1 года
          </span>
          <span className="mx-3 hidden md:inline">•</span>
          <br className="md:hidden" />
          <span className="inline-flex items-center gap-2 mt-2 md:mt-0">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Лицензия Роспотребнадзора
          </span>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button
            size="lg"
            onClick={onCalculatorClick}
            className="bg-accent hover:bg-accent/90 text-white px-8 py-6 text-lg"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Рассчитать стоимость
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={handleCall}
            className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 text-lg"
          >
            <Phone className="w-5 h-5 mr-2" />
            Позвонить
          </Button>
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="text-yellow-400 text-xl">★</span>
            ))}
          </div>
          <span className="font-semibold text-foreground">4.9</span>
          <span className="text-sm">(247 отзывов)</span>
        </div>
      </div>
    </section>
  );
};

export default CardHero;
