import { Phone, Clock, Star, Zap, BadgeCheck, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DistrictPage } from '@/data/districtPages';

type ServiceType = 'dezinfekciya' | 'dezinsekciya' | 'deratizaciya';

const SERVICE_CTA_LABELS: Record<ServiceType, string> = {
  dezinfekciya: 'дезинфекцию',
  dezinsekciya: 'дезинсекцию',
  deratizaciya: 'дератизацию',
};

interface DistrictCTAProps {
  district: DistrictPage;
  serviceType?: ServiceType;
}

const DistrictCTA = ({ district, serviceType = 'dezinfekciya' }: DistrictCTAProps) => {
  const getStats = () => {
    const baseObjects: Record<string, number> = {
      cao: 312, sao: 287, svao: 256, vao: 234,
      yuvao: 198, yao: 267, yzao: 245, zao: 223, szao: 189,
      nao: 142, tao: 156, zelao: 167,
    };

    return {
      objectsCount: baseObjects[district.id] || 200,
      avgTime: district.responseTime.split('-')[0] || '30',
      rating: 4.9,
    };
  };

  const stats = getStats();

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-primary to-green-600 rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Закажите {SERVICE_CTA_LABELS[serviceType]} в {district.name} прямо сейчас
            </h2>

            <div className="flex items-center justify-center gap-2 mb-8 text-white/90">
              <Zap className="w-5 h-5" />
              <span>Приедем за {stats.avgTime} минут в любую точку {district.fullName}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl md:text-4xl font-bold">{stats.objectsCount}</div>
                <div className="text-sm text-white/80">Объектов в {district.name}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-center gap-1 text-3xl md:text-4xl font-bold">
                  {stats.avgTime}
                  <span className="text-lg">мин</span>
                </div>
                <div className="text-sm text-white/80">Средний выезд</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-center gap-1 text-3xl md:text-4xl font-bold">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  {stats.rating}
                </div>
                <div className="text-sm text-white/80">Рейтинг</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
                <a href="tel:84950181817">
                  <Phone className="w-5 h-5 mr-2" />
                  8-495-018-18-17
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/80">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Среднее время ответа: 2 минуты
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <BadgeCheck className="w-4 h-4" /> Работаем официально
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" /> Лицензия Роспотребнадзора
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DistrictCTA;
