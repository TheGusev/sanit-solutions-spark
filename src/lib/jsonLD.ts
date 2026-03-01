import { SEO_CONFIG } from './seo';

// Organization schema (главная организация)
export function generateOrganizationLD() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "ГорУслуги — Санитарные Решения",
    "alternateName": SEO_CONFIG.companyName,
    "description": "Профессиональная дезинфекция, дезинсекция и дератизация в Москве и Московской области. Лицензированные специалисты, гарантия до 3 лет.",
    "url": SEO_CONFIG.baseUrl,
    "telephone": SEO_CONFIG.phone,
    "email": "west-centro@mail.ru",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Москва",
      "addressRegion": "Московская область",
      "addressCountry": "RU"
    },
    "areaServed": [
      { "@type": "City", "name": "Москва" },
      { "@type": "AdministrativeArea", "name": "Московская область" }
    ],
    "priceRange": "₽₽",
    "openingHours": "Mo-Su 00:00-23:59",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Санитарные услуги",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Дезинсекция" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Дератизация" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Дезинфекция" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Дезодорация" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Озонирование" } }
      ]
    },
    "sameAs": [
      "https://vk.com/yourpage",
      "https://t.me/yourpage"
    ]
  };
}

// LocalBusiness для страниц районов
export function generateNeighborhoodLD(neighborhood: {
  name: string;
  slug: string;
  description?: string;
  coordinates?: [number, number];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `${SEO_CONFIG.companyName} — ${neighborhood.name}`,
    "description": `Дезинфекция в районе ${neighborhood.name}, Москва. Выезд специалиста в течение 15 минут.`,
    "url": `${SEO_CONFIG.baseUrl}/rajony/${neighborhood.slug}`,
    "telephone": SEO_CONFIG.phone,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Москва",
      "addressRegion": neighborhood.name,
      "addressCountry": "RU"
    },
    "geo": neighborhood.coordinates ? {
      "@type": "GeoCoordinates",
      "latitude": neighborhood.coordinates[0],
      "longitude": neighborhood.coordinates[1]
    } : undefined,
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": `${neighborhood.name}, Москва`
    },
    "priceRange": "от 1000₽",
    "openingHours": "Mo-Su 00:00-23:59"
  };
}

// Service schema для страниц услуг
export function generateServiceLD(service: {
  name: string;
  description: string;
  url: string;
  price?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": service.name,
    "name": service.name,
    "description": service.description,
    "url": service.url,
    "provider": {
      "@type": "LocalBusiness",
      "name": SEO_CONFIG.companyName,
      "telephone": SEO_CONFIG.phone
    },
    "areaServed": {
      "@type": "City",
      "name": "Москва"
    },
    "offers": service.price ? {
      "@type": "Offer",
      "price": service.price,
      "priceCurrency": "RUB",
      "availability": "https://schema.org/InStock"
    } : undefined
  };
}

// BreadcrumbList для хлебных крошек
export function generateBreadcrumbLD(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

// FAQ schema
export function generateFAQLD(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

// Review/AggregateRating schema
export function generateReviewLD(reviews: Array<{
  author: string;
  rating: number;
  text: string;
  date?: string;
}>) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": SEO_CONFIG.companyName,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length,
      "reviewCount": reviews.length,
      "bestRating": 5,
      "worstRating": 1
    },
    "review": reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "datePublished": review.date || new Date().toISOString().split('T')[0],
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": 5,
        "worstRating": 1
      },
      "reviewBody": review.text
    }))
  };
}

// Helper для вставки в <head>
export function renderJSONLD(schema: object) {
  return JSON.stringify(schema);
}
