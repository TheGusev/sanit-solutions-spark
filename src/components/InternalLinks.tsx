/**
 * Компонент внутренней перелинковки для SEO.
 * Генерирует 8-12 релевантных ссылок на связанные страницы.
 * 
 * Правила перелинковки:
 * - Другие вредители той же услуги (3-4 ссылки)
 * - Соседние районы (3-4 ссылки)
 * - Главные страницы услуг (2 ссылки)
 * - Города МО при наличии (1-2 ссылки)
 */

import { Link } from 'react-router-dom';
import { pests, getPestsByService } from '@/data/pests';
import { moscowRegionCities } from '@/data/moscowRegion';
import { neighborhoodSlugs, topNeighborhoods } from '@/lib/seoRoutes';
import { neighborhoods } from '@/data/neighborhoods';
import { ArrowRight } from 'lucide-react';

interface InternalLinksProps {
  currentService?: string;
  currentPest?: string;
  currentNeighborhood?: string;
  currentCity?: string;
  variant?: 'grid' | 'list' | 'compact';
  maxLinks?: number;
  title?: string;
}

interface InternalLink {
  url: string;
  text: string;
  type: 'service' | 'pest' | 'neighborhood' | 'city';
}

export function InternalLinks({
  currentService,
  currentPest,
  currentNeighborhood,
  currentCity,
  variant = 'grid',
  maxLinks = 12,
  title = 'Смотрите также'
}: InternalLinksProps) {
  const links: InternalLink[] = [];
  
  // 1. Другие вредители той же услуги (3-4 ссылки)
  if (currentService && (currentService === 'dezinsekciya' || currentService === 'deratizaciya')) {
    const servicePests = getPestsByService(currentService);
    const otherPests = servicePests.filter(p => p.slug !== currentPest).slice(0, 4);
    
    otherPests.forEach(pest => {
      if (currentNeighborhood) {
        // НЧ-страница: ссылка на другого вредителя в том же районе
        links.push({
          url: `/uslugi/${currentService}/${pest.slug}/${currentNeighborhood}`,
          text: `Уничтожение ${pest.genitive} в районе`,
          type: 'pest'
        });
      } else {
        // Страница услуга+вредитель: ссылка на другого вредителя
        links.push({
          url: `/uslugi/${currentService}/${pest.slug}`,
          text: `Уничтожение ${pest.genitive}`,
          type: 'pest'
        });
      }
    });
  }
  
  // 2. Соседние районы (3-4 ссылки)
  if (currentNeighborhood && currentService && currentPest) {
    const currentIndex = neighborhoodSlugs.indexOf(currentNeighborhood);
    const nearbyIndices = [
      currentIndex - 2,
      currentIndex - 1,
      currentIndex + 1,
      currentIndex + 2
    ].filter(i => i >= 0 && i < neighborhoodSlugs.length && i !== currentIndex && topNeighborhoods.includes(neighborhoodSlugs[i]));
    
    nearbyIndices.slice(0, 4).forEach(index => {
      const neighborhoodSlug = neighborhoodSlugs[index];
      const neighborhood = neighborhoods.find(n => n.slug === neighborhoodSlug);
      if (neighborhood) {
        links.push({
          url: `/uslugi/${currentService}/${currentPest}/${neighborhoodSlug}`,
          text: `${currentService === 'dezinsekciya' ? 'Дезинсекция' : 'Дератизация'} в ${neighborhood.name}`,
          type: 'neighborhood'
        });
      }
    });
  } else if (currentNeighborhood) {
    // Если нет конкретного вредителя — ссылки на районы
    const currentIndex = neighborhoodSlugs.indexOf(currentNeighborhood);
    const nearbyIndices = [
      currentIndex - 1,
      currentIndex + 1,
      currentIndex + 2
    ].filter(i => i >= 0 && i < neighborhoodSlugs.length && i !== currentIndex);
    
    nearbyIndices.slice(0, 3).forEach(index => {
      const neighborhoodSlug = neighborhoodSlugs[index];
      const neighborhood = neighborhoods.find(n => n.slug === neighborhoodSlug);
      if (neighborhood) {
        links.push({
          url: `/rajony/${neighborhoodSlug}`,
          text: `Дезинсекция в ${neighborhood.name}`,
          type: 'neighborhood'
        });
      }
    });
  }
  
  // 3. Главные страницы услуг (2 ссылки)
  const mainServices = [
    { slug: 'dezinsekciya', name: 'Дезинсекция' },
    { slug: 'deratizaciya', name: 'Дератизация' },
    { slug: 'dezinfekciya', name: 'Дезинфекция' },
    { slug: 'ozonirovanie', name: 'Озонирование' }
  ];
  
  mainServices
    .filter(s => s.slug !== currentService)
    .slice(0, 2)
    .forEach(service => {
      links.push({
        url: `/uslugi/${service.slug}`,
        text: `${service.name} в Москве`,
        type: 'service'
      });
    });
  
  // 4. Города МО (1-2 ссылки)
  if (!currentCity && currentService) {
    moscowRegionCities.slice(0, 2).forEach(city => {
      links.push({
        url: `/moscow-oblast/${city.slug}/${currentService}`,
        text: `${currentService === 'dezinsekciya' ? 'Дезинсекция' : 'Дератизация'} ${city.prepositional}`,
        type: 'city'
      });
    });
  }
  
  // Ограничиваем количество ссылок
  const finalLinks = links.slice(0, maxLinks);
  
  if (finalLinks.length === 0) {
    return null;
  }
  
  if (variant === 'compact') {
    return (
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-muted-foreground">{title}</h4>
        <div className="flex flex-wrap gap-2">
          {finalLinks.map((link, index) => (
            <Link
              key={index}
              to={link.url}
              className="text-sm text-primary hover:underline"
            >
              {link.text}
            </Link>
          ))}
        </div>
      </div>
    );
  }
  
  if (variant === 'list') {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <ul className="space-y-2">
          {finalLinks.map((link, index) => (
            <li key={index}>
              <Link
                to={link.url}
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ArrowRight className="w-4 h-4" />
                {link.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  // Default: grid
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h3 className="text-xl font-bold mb-6 text-center">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {finalLinks.map((link, index) => (
            <Link
              key={index}
              to={link.url}
              className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors text-center text-sm font-medium"
            >
              {link.text}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default InternalLinks;
