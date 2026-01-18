import { MapPin, Clock, Shield, Phone, Calculator, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DistrictPage } from '@/data/districtPages';

interface DistrictHeroProps {
  district: DistrictPage;
  onCalculatorOpen?: () => void;
}

const DistrictHero = ({ district, onCalculatorOpen }: DistrictHeroProps) => {
  return (
    <section className="relative min-h-[50vh] bg-gradient-to-br from-primary/90 to-green-600/80 text-white overflow-hidden">
      {/* Parallax background effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-20"
        style={{ 
          backgroundImage: `url('/placeholder.svg')`,
          backgroundAttachment: 'fixed'
        }}
        role="img"
        aria-label="Фоновое изображение — санитарная обработка помещений в округе"
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/70 to-green-600/75" />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-16 md:py-20">
        {/* H1 */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 max-w-3xl">
          {district.h1}
        </h1>

        {/* Subtitle with districts */}
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-6">
          Обслуживаем все районы {district.fullName}: {district.neighborhoods.slice(0, 4).join(', ')} и другие. 
          Быстрый выезд в любую точку округа.
        </p>

        {/* USP Badges */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-4 py-2 text-sm">
            <Clock className="w-4 h-4 mr-2" />
            Выезд {district.responseTime}
          </Badge>
          <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-4 py-2 text-sm">
            <MapPin className="w-4 h-4 mr-2" />
            Знаем район
          </Badge>
          <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-4 py-2 text-sm">
            <Shield className="w-4 h-4 mr-2" />
            {district.surcharge === 0 ? 'Бесплатный выезд' : `Доплата ${district.surcharge}₽`}
          </Badge>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button 
            size="lg" 
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={onCalculatorOpen}
          >
            <Calculator className="w-5 h-5 mr-2" />
            Рассчитать стоимость
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-white/10 border-white text-white hover:bg-white hover:text-primary"
            asChild
          >
            <a href="tel:+79069989888">
              <Phone className="w-5 h-5 mr-2" />
              Позвонить сейчас
            </a>
          </Button>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 text-white/90">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="font-semibold">4.9</span>
          <span className="text-white/70">(247 отзывов)</span>
        </div>
      </div>
    </section>
  );
};

export default DistrictHero;
