/**
 * Компонент внутренней перелинковки для SEO.
 * Генерирует 12-16 релевантных ссылок на связанные страницы.
 * 
 * Типы ссылок:
 * - pest: Другие вредители той же услуги
 * - neighborhood: Соседние районы
 * - service: Главные страницы услуг
 * - district: Услуги по округам
 * - city: Города МО
 * - blog: Релевантные статьи блога
 * - hub: Обзорные хабы (/rajony, /moscow-oblast, /otzyvy)
 * - moleCity: Города борьбы с кротами
 */

import { Link } from 'react-router-dom';
import { pests, getPestsByService } from '@/data/pests';
import { moscowRegionCities } from '@/data/moscowRegion';
import { topNeighborhoods } from '@/lib/seoRoutes';
import { neighborhoods } from '@/data/neighborhoods';
import { moleCities } from '@/data/moleCities';
import { ArrowRight } from 'lucide-react';

interface InternalLinksProps {
  currentService?: string;
  currentPest?: string;
  currentNeighborhood?: string;
  currentCity?: string;
  currentDistrict?: string;
  currentMoleCity?: string;
  variant?: 'grid' | 'list' | 'compact';
  maxLinks?: number;
  title?: string;
}

interface InternalLink {
  url: string;
  text: string;
  type: 'service' | 'pest' | 'neighborhood' | 'city' | 'district' | 'blog' | 'hub' | 'moleCity';
}

function getDistance(a: [number, number], b: [number, number]): number {
  const dlat = a[0] - b[0];
  const dlng = a[1] - b[1];
  return Math.sqrt(dlat * dlat + dlng * dlng);
}

/** Pseudo-random shuffle based on current day (stable per day) */
function seededShuffle<T>(arr: T[]): T[] {
  const seed = new Date().getDate();
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = (seed * (i + 1) * 31) % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const okrugIds = ['cao', 'sao', 'svao', 'vao', 'yuvao', 'yao', 'yzao', 'zao', 'szao'];
const serviceKeys = ['dezinfekciya', 'dezinsekciya', 'deratizaciya'] as const;
const serviceNames: Record<string, string> = {
  dezinfekciya: 'Дезинфекция',
  dezinsekciya: 'Дезинсекция',
  deratizaciya: 'Дератизация',
  'obrabotka-uchastkov': 'Обработка участков',
  'borba-s-krotami': 'Борьба с кротами',
};
const okrugNames: Record<string, string> = { cao: 'ЦАО', sao: 'САО', svao: 'СВАО', vao: 'ВАО', yuvao: 'ЮВАО', yao: 'ЮАО', yzao: 'ЮЗАО', zao: 'ЗАО', szao: 'СЗАО' };

/** Blog articles mapped by related service keyword */
const blogByService: Record<string, { url: string; text: string }[]> = {
  dezinsekciya: [
    { url: '/blog/klopy-v-kvartire', text: 'Клопы в квартире: как избавиться' },
    { url: '/blog/borba-s-tarakanami', text: 'Борьба с тараканами: методы' },
    { url: '/blog/sezonnost-vreditelej', text: 'Сезонность вредителей' },
  ],
  deratizaciya: [
    { url: '/blog/gryzuny-v-dome', text: 'Грызуны в доме: что делать' },
    { url: '/blog/sezonnost-vreditelej', text: 'Сезонность вредителей' },
  ],
  dezinfekciya: [
    { url: '/blog/vidy-dezinfekcii', text: 'Виды дезинфекции' },
    { url: '/blog/dezinfekciya-ofisa', text: 'Дезинфекция офиса' },
    { url: '/blog/ozonirovaniye-pomeshcheniy', text: 'Озонирование помещений' },
  ],
  'obrabotka-uchastkov': [
    { url: '/blog/borshchevik-zakon-shtraf-2026', text: 'Борщевик: закон и штрафы 2026' },
    { url: '/blog/sezonnost-vreditelej', text: 'Сезонность вредителей' },
  ],
  'borba-s-krotami': [
    { url: '/blog/kroty-novorizhskoe-shosse', text: 'Кроты на Новорижском шоссе' },
    { url: '/blog/sezonnost-vreditelej', text: 'Сезонность вредителей' },
  ],
};

/** Hub pages for cross-linking */
const hubLinks: InternalLink[] = [
  { url: '/rajony', text: 'Районы Москвы — все районы', type: 'hub' },
  { url: '/moscow-oblast', text: 'Московская область — все города', type: 'hub' },
  { url: '/otzyvy', text: 'Отзывы клиентов', type: 'hub' },
  { url: '/uslugi/po-okrugam-moskvy', text: 'Услуги по округам Москвы', type: 'hub' },
  { url: '/blog', text: 'Полезные статьи', type: 'hub' },
];

export function InternalLinks({
  currentService,
  currentPest,
  currentNeighborhood,
  currentCity,
  currentDistrict,
  currentMoleCity,
  variant = 'grid',
  maxLinks = 16,
  title = 'Смотрите также'
}: InternalLinksProps) {
  const links: InternalLink[] = [];
  
  // 1. Другие вредители той же услуги (3-4 ссылки)
  if (currentService && (currentService === 'dezinsekciya' || currentService === 'deratizaciya')) {
    const servicePests = getPestsByService(currentService);
    const otherPests = servicePests.filter(p => p.slug !== currentPest).slice(0, 4);
    
    otherPests.forEach(pest => {
      if (currentNeighborhood) {
        links.push({
          url: `/uslugi/${currentService}/${pest.slug}/${currentNeighborhood}`,
          text: `Уничтожение ${pest.genitive} в районе`,
          type: 'pest'
        });
      } else {
        links.push({
          url: `/uslugi/${currentService}/${pest.slug}`,
          text: `Уничтожение ${pest.genitive}`,
          type: 'pest'
        });
      }
    });
  }
  
  // 2. Соседние районы по географической близости (3-4 ссылки)
  if (currentNeighborhood) {
    const currentNb = neighborhoods.find(n => n.slug === currentNeighborhood);
    
    const nearby = neighborhoods
      .filter(n => n.slug !== currentNeighborhood && topNeighborhoods.includes(n.slug))
      .map(n => ({
        ...n,
        distance: currentNb ? getDistance(currentNb.center, n.center) : Infinity,
        sameDistrict: currentNb ? n.districtId === currentNb.districtId : false
      }))
      .sort((a, b) => {
        if (a.sameDistrict && !b.sameDistrict) return -1;
        if (!a.sameDistrict && b.sameDistrict) return 1;
        return a.distance - b.distance;
      })
      .slice(0, 4);
    
    nearby.forEach(n => {
      if (currentService && currentPest) {
        links.push({
          url: `/uslugi/${currentService}/${currentPest}/${n.slug}`,
          text: `${serviceNames[currentService] || 'Дезинсекция'} в ${n.name}`,
          type: 'neighborhood'
        });
      } else {
        links.push({
          url: `/rajony/${n.slug}`,
          text: `Дезинсекция в ${n.name}`,
          type: 'neighborhood'
        });
      }
    });
  }
  
  // 3. Главные страницы услуг (2-3 ссылки)
  const mainServices = [
    { slug: 'dezinsekciya', name: 'Дезинсекция' },
    { slug: 'deratizaciya', name: 'Дератизация' },
    { slug: 'dezinfekciya', name: 'Дезинфекция' },
    { slug: 'ozonirovanie', name: 'Озонирование' },
    { slug: 'obrabotka-uchastkov', name: 'Обработка участков' },
    { slug: 'borba-s-krotami', name: 'Борьба с кротами' }
  ];
  
  mainServices
    .filter(s => s.slug !== currentService)
    .slice(0, 3)
    .forEach(service => {
      links.push({
        url: `/uslugi/${service.slug}`,
        text: `${service.name} в Москве`,
        type: 'service'
      });
    });
  
  // 3.5 Услуги по округам (2 ссылки)
  if (currentService) {
    const otherServices = serviceKeys.filter(s => s !== currentService);
    otherServices.slice(0, 2).forEach((s, i) => {
      const okrug = currentDistrict && okrugIds.includes(currentDistrict)
        ? currentDistrict
        : okrugIds[i % okrugIds.length];
      links.push({
        url: `/uslugi/${s}-${okrug}`,
        text: `${serviceNames[s]} в ${okrugNames[okrug] || okrug.toUpperCase()}`,
        type: 'district'
      });
    });
  }

  // 4. Города МО — рандомизированные (2 ссылки)
  if (!currentCity && currentService) {
    const shuffled = seededShuffle(moscowRegionCities.filter(c => c.slug !== currentCity));
    shuffled.slice(0, 2).forEach(city => {
      links.push({
        url: `/moscow-oblast/${city.slug}/${currentService}`,
        text: `${serviceNames[currentService] || 'Дезинфекция'} ${city.prepositional}`,
        type: 'city'
      });
    });
  }

  // 5. Города кротов (для страниц borba-s-krotami) — 2-3 ссылки
  if (currentService === 'borba-s-krotami' || currentMoleCity) {
    const otherMoleCities = seededShuffle(
      moleCities.filter(c => c.slug !== currentMoleCity)
    ).slice(0, 3);
    otherMoleCities.forEach(mc => {
      links.push({
        url: `/uslugi/borba-s-krotami/${mc.slug}`,
        text: `Кроты ${mc.prepositional}`,
        type: 'moleCity'
      });
    });
  }

  // 6. Блог-ссылки (1-2 статьи по текущей услуге)
  const blogKey = currentService || '';
  const blogArticles = blogByService[blogKey];
  if (blogArticles) {
    blogArticles.slice(0, 2).forEach(article => {
      links.push({
        url: article.url,
        text: article.text,
        type: 'blog'
      });
    });
  }

  // 7. Хабы (2 ссылки)
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const relevantHubs = hubLinks.filter(h => !currentPath.startsWith(h.url));
  seededShuffle(relevantHubs).slice(0, 2).forEach(hub => {
    links.push(hub);
  });
  
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
