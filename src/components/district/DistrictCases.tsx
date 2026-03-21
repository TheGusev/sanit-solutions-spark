import { MapPin, Check, Building, Home, UtensilsCrossed, Bug, MousePointer2 } from 'lucide-react';
import { DistrictPage } from '@/data/districtPages';

type ServiceType = 'dezinfekciya' | 'dezinsekciya' | 'deratizaciya';

const SERVICE_CASE_LABELS: Record<ServiceType, string> = {
  dezinfekciya: 'дезинфекции',
  dezinsekciya: 'дезинсекции',
  deratizaciya: 'дератизации',
};

interface DistrictCasesProps {
  district: DistrictPage;
  serviceType?: ServiceType;
}

const DistrictCases = ({ district, serviceType = 'dezinfekciya' }: DistrictCasesProps) => {
  const getCaseType = (title: string): 'business' | 'home' | 'restaurant' => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('ресторан') || lowerTitle.includes('кафе') || lowerTitle.includes('кофе')) {
      return 'restaurant';
    }
    if (lowerTitle.includes('офис') || lowerTitle.includes('бц') || lowerTitle.includes('бизнес') || lowerTitle.includes('склад')) {
      return 'business';
    }
    return 'home';
  };

  const getTypeLabel = (type: 'business' | 'home' | 'restaurant'): string => {
    switch (type) {
      case 'business': return 'Бизнес-центр';
      case 'restaurant': return 'Общепит';
      case 'home': return 'Жильё';
    }
  };

  const getTypeIcon = (type: 'business' | 'home' | 'restaurant') => {
    switch (type) {
      case 'business': return Building;
      case 'restaurant': return UtensilsCrossed;
      case 'home': return Home;
    }
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Наши работы по {SERVICE_CASE_LABELS[serviceType]} в {district.name}
        </h2>
        <p className="text-muted-foreground mb-8">
          Примеры реальных объектов, которые мы обслужили
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {district.cases.map((caseItem, idx) => {
            const caseType = getCaseType(caseItem.title);
            const TypeIcon = getTypeIcon(caseType);
            
            return (
              <div 
                key={idx}
                className="group bg-background rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
              >
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-green-500/20 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <TypeIcon className="w-16 h-16 text-primary/30 group-hover:scale-110 transition-transform" />
                  </div>
                  
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full uppercase tracking-wide">
                      {getTypeLabel(caseType)}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">{caseItem.title}</h3>
                  
                  <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {caseItem.location}
                  </p>

                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase">Результат:</span>
                      <p className="text-sm flex items-start gap-2 mt-1">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {caseItem.result}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <span className="text-xs text-muted-foreground">
                      {['Ноябрь', 'Октябрь', 'Сентябрь', 'Декабрь'][idx % 4]} 2025
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DistrictCases;
