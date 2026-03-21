import { Link } from "react-router-dom";
import { MapPin, ChevronDown } from "lucide-react";
import { neighborhoods, getNeighborhoodsByDistrict } from "@/data/neighborhoods";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const districtGroups = [
  { id: 'cao', name: 'ЦАО', fullName: 'Центральный округ' },
  { id: 'sao', name: 'САО', fullName: 'Северный округ' },
  { id: 'svao', name: 'СВАО', fullName: 'Северо-Восточный округ' },
  { id: 'vao', name: 'ВАО', fullName: 'Восточный округ' },
  { id: 'yuvao', name: 'ЮВАО', fullName: 'Юго-Восточный округ' },
  { id: 'yao', name: 'ЮАО', fullName: 'Южный округ' },
  { id: 'yzao', name: 'ЮЗАО', fullName: 'Юго-Западный округ' },
  { id: 'zao', name: 'ЗАО', fullName: 'Западный округ' },
  { id: 'szao', name: 'СЗАО', fullName: 'Северо-Западный округ' },
  { id: 'nao', name: 'НАО', fullName: 'Новомосковский округ' },
  { id: 'tao', name: 'ТАО', fullName: 'Троицкий округ' },
  { id: 'zelao', name: 'ЗелАО', fullName: 'Зеленоградский округ' },
];

const ServiceAreaCollapsible = () => {
  return (
    <Collapsible>
      <CollapsibleTrigger className="w-full flex items-center justify-between bg-card rounded-xl p-4 md:p-6 border border-border hover:bg-muted/50 transition-all shadow-sm hover:shadow-md group cursor-pointer min-h-[72px] md:min-h-[88px]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          </div>
          <div className="text-left">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">
              Все {neighborhoods?.length || 130} районов Москвы
            </h2>
            <p className="text-muted-foreground text-sm md:text-base hidden sm:block">
              Дезинсекция и дератизация в каждом районе
            </p>
          </div>
        </div>
        <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4 md:mt-6">
        <div className="bg-card rounded-lg border border-border p-4 space-y-6">
          {districtGroups.map(district => {
            const districtNeighborhoods = getNeighborhoodsByDistrict(district.id);
            if (!districtNeighborhoods || districtNeighborhoods.length === 0) return null;
            
            return (
              <div key={district.id}>
                <h4 className="font-bold text-sm mb-3 text-muted-foreground">
                  {district.name} — {district.fullName} ({districtNeighborhoods.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {districtNeighborhoods.map(n => (
                    <Link 
                      key={n.slug} 
                      to={`/rajony/${n.slug}`}
                      className="text-sm px-3 py-1.5 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {n.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
          
          <div className="pt-4 border-t border-border text-center">
            <Link 
              to="/rajony"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              Открыть полный каталог районов →
            </Link>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ServiceAreaCollapsible;
