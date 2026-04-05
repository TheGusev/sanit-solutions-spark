/**
 * Централизованная логика внутренней перелинковки.
 * Все функции фильтруют через isSeoLinkable() — noindex страницы никогда не попадают в выдачу.
 */

import { pests, getPestsByService } from '@/data/pests';
import { moleCities } from '@/data/moleCities';
import { objectTypes } from '@/data/objects';
import { servicePages, getRelatedArticlesForPest, getRelatedArticlesForService } from '@/data/services';
import { neighborhoods } from '@/data/neighborhoods';
import { moscowRegionCities } from '@/data/moscowRegion';
import { topNeighborhoods } from '@/lib/seoRoutes';
import { tier1Pests } from '@/data/nchSeeds';
import { SEO_CONFIG } from '@/lib/seo';

// ============================================================
// isSeoLinkable — фильтр: только indexable targets
// ============================================================

const EXCLUDED_PREFIXES = ['/admin', '/privacy', '/terms', '/login'];

/** Checks if a given path is an indexable SEO target (no noindex, no utility pages) */
export function isSeoLinkable(path: string): boolean {
  // Exclude utility pages
  if (EXCLUDED_PREFIXES.some(p => path.startsWith(p))) return false;

  // Exclude NCH Tier 2/3 pages (3-segment /uslugi/service/pest/neighborhood where pest is not tier1)
  const parts = path.replace(/^\/|\/$/g, '').split('/');
  if (parts.length === 4 && parts[0] === 'uslugi') {
    const pestSlug = parts[2];
    if (!tier1Pests.includes(pestSlug)) return false;
  }

  return true;
}

// ============================================================
// Page cluster detection
// ============================================================

export type PageCluster = 'service-hub' | 'pest-page' | 'object-page' | 'geo-hub' | 'geo-city' | 'blog' | 'ses' | 'other';

export function getPageCluster(pathname: string): PageCluster {
  const p = pathname.replace(/\/$/, '') || '/';
  if (p.startsWith('/blog')) return 'blog';
  if (p === '/rajony' || p.startsWith('/rajony/')) return 'geo-hub';
  if (p === '/moscow-oblast' || p.startsWith('/moscow-oblast/')) return 'geo-city';
  if (p === '/sluzhba-dezinsekcii') return 'ses';

  if (p.startsWith('/uslugi/')) {
    const segments = p.replace('/uslugi/', '').split('/');
    if (segments.length === 1) return 'service-hub';
    // Check if second segment is an object or a pest
    const secondSeg = segments[1];
    const isObject = objectTypes.some(o => o.slug === secondSeg);
    if (isObject) return 'object-page';
    return 'pest-page';
  }

  return 'other';
}

// ============================================================
// Related services (3-6 links within same cluster)
// ============================================================

export interface InternalLinkItem {
  url: string;
  text: string;
}

const SERVICE_NAMES: Record<string, string> = {
  dezinfekciya: 'Дезинфекция',
  dezinsekciya: 'Дезинсекция',
  deratizaciya: 'Дератизация',
  ozonirovanie: 'Озонирование',
  'obrabotka-uchastkov': 'Обработка участков',
  'borba-s-krotami': 'Борьба с кротами',
  dezodoraciya: 'Дезодорация',
  
};

/**
 * For pest pages: related pests + parent hub.
 * For service hubs: pest pages of this service.
 * For outdoor: related outdoor services.
 */
export function getRelatedServices(serviceSlug: string, pestSlug?: string): InternalLinkItem[] {
  const links: InternalLinkItem[] = [];

  if (pestSlug) {
    // On a pest page → link to other pests of same service + parent hub
    const pest = pests.find(p => p.slug === pestSlug);
    const relatedSlugs = pest?.relatedPests || [];

    // Related pests first
    relatedSlugs.slice(0, 4).forEach(rSlug => {
      const rPest = pests.find(p => p.slug === rSlug);
      if (rPest) {
        const url = `/uslugi/${serviceSlug}/${rSlug}/`;
        if (isSeoLinkable(url)) {
          links.push({ url, text: `Уничтожение ${rPest.genitive}` });
        }
      }
    });

    // Parent service hub
    if (SERVICE_NAMES[serviceSlug]) {
      links.push({
        url: `/uslugi/${serviceSlug}/`,
        text: `${SERVICE_NAMES[serviceSlug]} — все услуги`,
      });
    }
  } else {
    // On a service hub → link to top pest pages
    if (serviceSlug === 'dezinsekciya' || serviceSlug === 'deratizaciya') {
      const servicePests = getPestsByService(serviceSlug);
      servicePests.slice(0, 4).forEach(p => {
        const url = `/uslugi/${serviceSlug}/${p.slug}/`;
        if (isSeoLinkable(url)) {
          links.push({ url, text: `Уничтожение ${p.genitive}` });
        }
      });
    }

    // Cross-link related service hubs
    if (serviceSlug === 'borba-s-krotami') {
      links.push({ url: '/uslugi/obrabotka-uchastkov/', text: 'Обработка участков' });
    } else if (serviceSlug === 'obrabotka-uchastkov') {
      links.push({ url: '/uslugi/borba-s-krotami/', text: 'Борьба с кротами' });
    }
  }

  return links.slice(0, 6);
}

// ============================================================
// Related geo links (6-8 top neighborhoods + MO cities)
// ============================================================

export function getRelatedGeoLinks(serviceSlug?: string, pestSlug?: string): InternalLinkItem[] {
  const links: InternalLinkItem[] = [];

  // Only link to Tier 1 NCH pages (indexable)
  if (serviceSlug && pestSlug && tier1Pests.includes(pestSlug)) {
    // For pest pages: link to NCH pages of same pest in top neighborhoods
    topNeighborhoods.slice(0, 8).forEach(nSlug => {
      const n = neighborhoods.find(nb => nb.slug === nSlug);
      if (n) {
        const url = `/uslugi/${serviceSlug}/${pestSlug}/${nSlug}/`;
        if (isSeoLinkable(url)) {
          links.push({ url, text: n.name });
        }
      }
    });
  } else {
    // For service hubs: link to neighborhood pages via /rajony/
    topNeighborhoods.slice(0, 8).forEach(nSlug => {
      const n = neighborhoods.find(nb => nb.slug === nSlug);
      if (n) {
        links.push({ url: `/rajony/${n.slug}/`, text: n.name });
      }
    });
  }

  // Add 2-3 MO cities if relevant (not for borba-s-krotami which has its own MO system)
  if (serviceSlug && serviceSlug !== 'borba-s-krotami') {
    moscowRegionCities.slice(0, 3).forEach(city => {
      links.push({
        url: `/moscow-oblast/${city.slug}/`,
        text: city.name,
      });
    });
  }

  return links;
}

// ============================================================
// Related blog links (2-3 articles)
// ============================================================

export function getRelatedBlogLinks(serviceSlug?: string, pestSlug?: string): InternalLinkItem[] {
  let articles: { slug: string; title: string }[] = [];

  if (pestSlug) {
    articles = getRelatedArticlesForPest(pestSlug).slice(0, 3);
  } else if (serviceSlug) {
    articles = getRelatedArticlesForService(serviceSlug).slice(0, 3);
  }

  return articles.map(a => ({
    url: `/blog/${a.slug}/`,
    text: a.title,
  }));
}

// ============================================================
// Related objects (4-6 object pages)
// ============================================================

export function getRelatedObjects(serviceSlug: string, currentObjectSlug?: string): InternalLinkItem[] {
  const service = servicePages.find(s => s.slug === serviceSlug);
  if (!service) return [];

  // Only for services that have object pages
  const servicesWithObjects = ['dezinsekciya', 'dezinfekciya', 'deratizaciya', 'ozonirovanie', 'demerkurizaciya'];
  if (!servicesWithObjects.includes(serviceSlug)) return [];

  return objectTypes
    .filter(o => o.slug !== currentObjectSlug)
    .slice(0, 5)
    .map(o => ({
      url: `/uslugi/${serviceSlug}/${o.slug}/`,
      text: `${service.title} ${o.genitive}`,
    }))
    .filter(l => isSeoLinkable(l.url));
}

// ============================================================
// Breadcrumb items generation
// ============================================================

export interface BreadcrumbItemData {
  label: string;
  href?: string;
}

export function getBreadcrumbItems(pathname: string): BreadcrumbItemData[] {
  const p = pathname.replace(/\/$/, '') || '/';
  const items: BreadcrumbItemData[] = [];

  if (p.startsWith('/uslugi/')) {
    const segments = p.replace('/uslugi/', '').split('/');
    const serviceSlug = segments[0];
    const serviceName = SERVICE_NAMES[serviceSlug] || serviceSlug;

    items.push({ label: serviceName, href: `/uslugi/${serviceSlug}/` });

    if (segments.length >= 2) {
      const secondSeg = segments[1];
      const pest = pests.find(pp => pp.slug === secondSeg);
      const obj = objectTypes.find(o => o.slug === secondSeg);

      if (pest) {
        items.push({ label: pest.name });
      } else if (obj) {
        items.push({ label: obj.namePlural });
      } else {
        items.push({ label: secondSeg });
      }
    }
  } else if (p.startsWith('/rajony')) {
    items.push({ label: 'Районы Москвы', href: '/rajony/' });
    const slug = p.replace('/rajony/', '');
    if (slug && slug !== 'rajony') {
      const n = neighborhoods.find(nb => nb.slug === slug);
      items.push({ label: n?.name || slug });
    }
  } else if (p.startsWith('/moscow-oblast')) {
    items.push({ label: 'Московская область', href: '/moscow-oblast/' });
    const rest = p.replace('/moscow-oblast/', '');
    if (rest && rest !== 'moscow-oblast') {
      const parts = rest.split('/');
      const city = moscowRegionCities.find(c => c.slug === parts[0]);
      if (city) {
        if (parts.length > 1) {
          items.push({ label: city.name, href: `/moscow-oblast/${city.slug}/` });
          const sName = SERVICE_NAMES[parts[1]] || parts[1];
          items.push({ label: sName });
        } else {
          items.push({ label: city.name });
        }
      }
    }
  } else if (p.startsWith('/blog')) {
    items.push({ label: 'Блог', href: '/blog/' });
    const slug = p.replace('/blog/', '');
    if (slug && slug !== 'blog') {
      items.push({ label: slug });
    }
  }

  return items;
}


//
// Related mole cities (3-5 neighboring cities for borba-s-krotami)
// ============================================================


export function getRelatedMoleCities(currentCitySlug: string): InternalLinkItem[] {
  const city = moleCities.find(c => c.slug === currentCitySlug);
  if (!city) return [];
  return city.relatedCities
    .slice(0, 5)
    .map(slug => {
      const rel = moleCities.find(c => c.slug === slug);
      return rel ? { url: `/uslugi/borba-s-krotami/${slug}/`, text: rel.name } : null;
    })
    .filter((l): l is InternalLinkItem => l !== null);
}

// ============================================================
// Related MO city services (other services in same MO city)
// ============================================================

const MO_SERVICES = ['dezinsekciya', 'deratizaciya', 'dezinfekciya'];

export function getRelatedMoCityServices(citySlug: string, currentServiceSlug: string): InternalLinkItem[] {
  return MO_SERVICES
    .filter(s => s !== currentServiceSlug)
    .map(s => ({ url: `/moscow-oblast/${citySlug}/${s}/`, text: SERVICE_NAMES[s] || s }))
    .slice(0, 4);
}

// ============================================================
// Related MO cities for same service
// ============================================================

export function getRelatedMoCitiesForService(serviceSlug: string, currentCitySlug: string): InternalLinkItem[] {
  return moscowRegionCities
    .filter(c => c.slug !== currentCitySlug)
    .slice(0, 5)
    .map(c => ({ url: `/moscow-oblast/${c.slug}/${serviceSlug}/`, text: c.name }));
}

// ============================================================
// BreadcrumbList JSON-LD schema generation
// ============================================================

export function generateBreadcrumbSchema(items: BreadcrumbItemData[]): object {
  const listItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Главная',
      item: SEO_CONFIG.baseUrl,
    },
    ...items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 2,
      name: item.label,
      ...(item.href ? { item: `${SEO_CONFIG.baseUrl}${item.href}` } : {}),
    })),
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: listItems,
  };
}
