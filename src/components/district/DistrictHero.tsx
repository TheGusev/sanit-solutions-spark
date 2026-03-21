import { MapPin, Clock, Shield, Phone, Calculator, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DistrictPage } from '@/data/districtPages';
import { getDistrictImage } from '@/data/districtImages';
import HeroBackground from '@/components/HeroBackground';

type ServiceType = 'dezinfekciya' | 'dezinsekciya' | 'deratizaciya';

const SERVICE_LABELS: Record<ServiceType, { name: string; nameGenitive: string; verb: string }> = {
  dezinfekciya: { name: 'Дезинфекция', nameGenitive: 'дезинфекции', verb: 'Проведём дезинфекцию' },
  dezinsekciya: { name: 'Дезинсекция', nameGenitive: 'дезинсекции', verb: 'Проведём дезинсекцию' },
  deratizaciya: { name: 'Дератизация', nameGenitive: 'дератизации', verb: 'Проведём дератизацию' },
};

interface DistrictHeroProps {
  district: DistrictPage;
  serviceType?: ServiceType;
  onCalculatorOpen?: () => void;
}

const DistrictHero = ({ district, serviceType = 'dezinfekciya', onCalculatorOpen }: DistrictHeroProps) => {
  const heroImage = getDistrictImage(district.id);
  const svc = SERVICE_LABELS[serviceType];
  
  // Адаптивный H1: используем название услуги вместо захардкоженного district.h1
  const adaptedH1 = serviceType === 'dezinfekciya'
    ? district.h1
    : `${svc.name} в ${district.name} Москвы — выезд за ${district.responseTime}`;
  
  return (
    <section className="relative min-h-[50vh] overflow-hidden">
      <HeroBackground 
        image={heroImage}
        blur={1}
        opacity={0.60}
        overlay="none"
        altText={`${svc.name} помещений в ${district.fullName}`}
      />
      
      <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/70 to-green-600/75" />
      
      <div className="relative container mx-auto px-4 py-16 md:py-20 text-white">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 max-w-3xl">
          {adaptedH1}
        </h1>
        
        <div className="h-1 w-48 flex rounded-full overflow-hidden mb-6">
          <div className="flex-1 bg-white/90"></div>
          <div className="flex-1 bg-blue-400"></div>
          <div className="flex-1 bg-russia-red"></div>
        </div>

        <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-8">
          {svc.verb} во всех районах {district.fullName}: {district.neighborhoods.slice(0, 4).join(', ')} и другие. 
          Быстрый выезд в любую точку округа.
        </p>

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
            <a href="tel:84950181817">
              <Phone className="w-5 h-5 mr-2" />
              Позвонить сейчас
            </a>
          </Button>
        </div>

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
