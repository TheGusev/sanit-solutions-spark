/**
 * === SEO UTILITIES ===
 * Централизованные утилиты для SEO-оптимизации
 * 
 * @description Генерация мета-тегов, Schema.org, внутренняя перелинковка
 */

export const BASE_URL = 'https://goruslugimsk.ru';
export const PHONE = '+7 (906) 998-98-88';
export const PHONE_RAW = '+79069989888';

// ============= META TEMPLATES =============

export interface MetaData {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogImage?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export interface PageData {
  service?: string;
  price?: number;
  location?: string;
  district?: string;
  articleTitle?: string;
  excerpt?: string;
  tags?: string[];
  publishDate?: string;
  modifiedDate?: string;
  author?: string;
  category?: string;
}

type PageType = 'home' | 'service' | 'subservice' | 'geo' | 'article' | 'pricing' | 'contacts' | 'blog';

/**
 * Генерация мета-данных для страницы
 */
export function generateMeta(pageType: PageType, data: PageData, path: string): MetaData {
  const canonicalUrl = `${BASE_URL}${path}`;
  
  const templates: Record<PageType, () => Omit<MetaData, 'canonicalUrl'>> = {
    home: () => ({
      title: 'Дезинфекция и дезинсекция в Москве от 2000₽ – Выезд за 30 минут',
      description: `Профессиональная дезинфекция, дезинсекция, дератизация в Москве и МО ⚡ Выезд за 30 минут ✅ Гарантия до 1 года ✅ Лицензия Роспотребнадзора ☎️ ${PHONE}`,
      keywords: 'дезинфекция москва, дезинсекция москва, уничтожение клопов, дезинфекция квартир, служба дезинфекции, дератизация москва',
      type: 'website',
    }),
    
    service: () => ({
      title: `${data.service} в Москве от ${data.price}₽ – Гарантия 1 год | Санитарные Решения`,
      description: `Профессиональная ${data.service?.toLowerCase()} в Москве и МО ⚡ Выезд за 30 минут ✅ Безопасные препараты ✅ Лицензия Роспотребнадзора ☎️ ${PHONE}`,
      keywords: `${data.service?.toLowerCase()} москва, ${data.service?.toLowerCase()} цена, служба ${data.service?.toLowerCase()}, ${data.service?.toLowerCase()} недорого`,
      type: 'website',
    }),
    
    subservice: () => ({
      title: `${data.service} ${data.location || ''} от ${data.price}₽ – Выезд за 30 минут`,
      description: `${data.service} ${data.location || ''} ⚡ Быстрый выезд ✅ Гарантия результата ✅ Безопасные препараты ☎️ ${PHONE}`,
      keywords: `${data.service?.toLowerCase()} ${data.location?.toLowerCase() || ''}, ${data.service?.toLowerCase()} цена, заказать ${data.service?.toLowerCase()}`,
      type: 'website',
    }),
    
    geo: () => ({
      title: `${data.service} в ${data.district} Москвы от ${data.price}₽ – Выезд за 20 минут`,
      description: `${data.service} в ${data.district} ⚡ Обслуживаем все районы округа ✅ Быстрый выезд ✅ Гарантия результата ☎️ ${PHONE}`,
      keywords: `${data.service?.toLowerCase()} ${data.district?.toLowerCase()}, ${data.service?.toLowerCase()} москва ${data.district?.toLowerCase()}, служба дезинфекции ${data.district?.toLowerCase()}`,
      type: 'website',
    }),
    
    article: () => ({
      title: `${data.articleTitle} – ${new Date().getFullYear()} | Блог Санитарные Решения`,
      description: data.excerpt?.substring(0, 155) || '',
      keywords: data.tags?.join(', ') || '',
      type: 'article',
      publishedTime: data.publishDate,
      modifiedTime: data.modifiedDate,
      author: data.author || 'Санитарные Решения',
      section: data.category,
      tags: data.tags,
    }),
    
    pricing: () => ({
      title: 'Цены на дезинфекцию и дезинсекцию в Москве 2026 | Калькулятор стоимости',
      description: `Прозрачные цены на дезинфекцию, дезинсекцию и дератизацию в Москве. Онлайн калькулятор стоимости. Без скрытых доплат ☎️ ${PHONE}`,
      keywords: 'цены дезинфекция, стоимость дезинсекции, прайс дератизация, калькулятор дезинфекции москва',
      type: 'website',
    }),
    
    contacts: () => ({
      title: 'Контакты службы дезинфекции в Москве | Санитарные Решения',
      description: `Свяжитесь с нами для заказа дезинфекции ☎️ ${PHONE} ✅ Работаем 24/7 ✅ Выезд по Москве и МО`,
      keywords: 'контакты дезинфекция москва, телефон службы дезинфекции, заказать дезинсекцию',
      type: 'website',
    }),
    
    blog: () => ({
      title: 'Блог о дезинфекции и дезинсекции | Полезные статьи от экспертов',
      description: 'Полезные статьи о дезинфекции, борьбе с вредителями и санитарии. Советы профессионалов, обзоры методов, ответы на частые вопросы.',
      keywords: 'блог дезинфекция, статьи о вредителях, как избавиться от клопов, борьба с тараканами',
      type: 'website',
    }),
  };
  
  const template = templates[pageType]?.() || templates.home();
  
  return {
    ...template,
    canonicalUrl,
    ogImage: '/og-image.jpg',
  };
}

// ============= SCHEMA.ORG GENERATORS =============

/**
 * Генерация LocalBusiness Schema (для всех страниц)
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#organization`,
    "name": "Санитарные Решения",
    "alternateName": "СанРешения",
    "description": "Профессиональная дезинфекция, дезинсекция и дератизация в Москве и Московской области",
    "url": BASE_URL,
    "logo": `${BASE_URL}/logo.png`,
    "image": `${BASE_URL}/og-image.jpg`,
    "telephone": PHONE_RAW,
    "email": "info@goruslugimsk.ru",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Москва",
      "addressLocality": "Москва",
      "addressRegion": "Москва",
      "postalCode": "101000",
      "addressCountry": "RU"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "55.755",
      "longitude": "37.622"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    },
    "priceRange": "2000-50000 RUB",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "247",
      "bestRating": "5",
      "worstRating": "1"
    },
    "areaServed": [
      { "@type": "City", "name": "Москва" },
      { "@type": "State", "name": "Московская область" }
    ],
    "sameAs": [
      "https://vk.com/sanitarnie_resheniya",
      "https://t.me/sanitarnie_resheniya"
    ]
  };
}

/**
 * Генерация Service Schema
 */
export function generateServiceSchema(service: {
  name: string;
  description: string;
  url: string;
  minPrice: number;
  maxPrice: number;
  areaServed?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": service.name,
    "name": service.name,
    "description": service.description,
    "url": `${BASE_URL}${service.url}`,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Санитарные Решения",
      "telephone": PHONE_RAW,
      "url": BASE_URL
    },
    "areaServed": (service.areaServed || ['Москва', 'Московская область']).map(area => ({
      "@type": "City",
      "name": area
    })),
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": service.minPrice,
      "highPrice": service.maxPrice,
      "priceCurrency": "RUB",
      "availability": "https://schema.org/InStock"
    }
  };
}

/**
 * Генерация Article Schema
 */
export function generateArticleSchema(article: {
  title: string;
  excerpt: string;
  slug: string;
  publishDate: string;
  modifiedDate?: string;
  author?: string;
  authorTitle?: string;
  category?: string;
  tags?: string[];
  wordCount?: number;
  readTime?: number;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.image || `${BASE_URL}/og-image.jpg`,
    "datePublished": article.publishDate,
    "dateModified": article.modifiedDate || article.publishDate,
    "author": {
      "@type": "Person",
      "name": article.author || "Эксперт Санитарные Решения",
      "jobTitle": article.authorTitle || "Специалист по дезинфекции"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Санитарные Решения",
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${article.slug}`
    },
    "articleSection": article.category,
    "keywords": article.tags?.join(', '),
    ...(article.wordCount && { "wordCount": article.wordCount }),
    ...(article.readTime && { "timeRequired": `PT${article.readTime}M` })
  };
}

/**
 * Генерация FAQ Schema
 */
export function generateFAQSchema(questions: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  };
}

/**
 * Генерация Breadcrumb Schema
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url?: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      ...(item.url && { "item": item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}` })
    }))
  };
}

/**
 * Генерация PriceSpecification Schema
 */
export function generatePriceSchema(services: Array<{ name: string; minPrice: number; maxPrice: number }>) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "name": "Прайс-лист на услуги дезинфекции",
    "itemListElement": services.map(service => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": service.name
      },
      "priceSpecification": {
        "@type": "PriceSpecification",
        "minPrice": service.minPrice,
        "maxPrice": service.maxPrice,
        "priceCurrency": "RUB"
      }
    }))
  };
}

// ============= INTERNAL LINKING =============

export interface InternalLink {
  anchor: string;
  url: string;
  title?: string;
}

/**
 * Карта внутренних ссылок по страницам
 * Расширенная версия для всех услуг, подстраниц и статей
 */
export const internalLinksMap: Record<string, InternalLink[]> = {
  // === ГЛАВНАЯ ===
  home: [
    { anchor: 'дезинфекция', url: '/uslugi/dezinfekciya', title: 'Услуги дезинфекции' },
    { anchor: 'дезинсекция', url: '/uslugi/dezinsekciya', title: 'Услуги дезинсекции' },
    { anchor: 'дератизация', url: '/uslugi/deratizaciya', title: 'Услуги дератизации' },
    { anchor: 'уничтожение клопов', url: '/uslugi/dezinsekciya/unichtozhenie-klopov', title: 'Уничтожение клопов' },
    { anchor: 'борьба с тараканами', url: '/uslugi/dezinsekciya/unichtozhenie-tarakanov', title: 'Уничтожение тараканов' },
    { anchor: 'озонирование', url: '/uslugi/ozonirovanie', title: 'Озонирование помещений' },
    { anchor: 'рассчитать стоимость', url: '/ceny', title: 'Калькулятор стоимости' },
  ],

  // === ДЕЗИНФЕКЦИЯ ===
  dezinfekciya: [
    { anchor: 'дезинфекция квартир', url: '/uslugi/dezinfekciya/kvartir', title: 'Дезинфекция квартир' },
    { anchor: 'дезинфекция офисов', url: '/uslugi/dezinfekciya/ofisov', title: 'Дезинфекция офисов' },
    { anchor: 'холодный туман', url: '/uslugi/dezinfekciya/holodnyj-tuman', title: 'Обработка холодным туманом' },
    { anchor: 'горячий туман', url: '/uslugi/dezinfekciya/goryachij-tuman', title: 'Обработка горячим туманом' },
    { anchor: 'дезинфекция домов', url: '/uslugi/dezinfekciya/domov', title: 'Дезинфекция частных домов' },
    { anchor: 'дезинфекция складов', url: '/uslugi/dezinfekciya/skladov', title: 'Дезинфекция складов' },
    { anchor: 'рассчитать стоимость', url: '/ceny', title: 'Калькулятор стоимости' },
  ],
  'dezinfekciya_kvartir': [
    { anchor: 'дезинфекция офисов', url: '/uslugi/dezinfekciya/ofisov', title: 'Дезинфекция офисов' },
    { anchor: 'озонирование', url: '/uslugi/ozonirovanie', title: 'Озонирование помещений' },
    { anchor: 'уничтожение клопов', url: '/uslugi/dezinsekciya/unichtozhenie-klopov', title: 'Уничтожение клопов' },
    { anchor: 'устранение запахов', url: '/uslugi/dezodoraciya', title: 'Дезодорация' },
  ],
  'dezinfekciya_ofisov': [
    { anchor: 'дезинфекция квартир', url: '/uslugi/dezinfekciya/kvartir', title: 'Дезинфекция квартир' },
    { anchor: 'дезинфекция складов', url: '/uslugi/dezinfekciya/skladov', title: 'Дезинфекция складов' },
    { anchor: 'уничтожение тараканов', url: '/uslugi/dezinsekciya/unichtozhenie-tarakanov', title: 'Уничтожение тараканов' },
    { anchor: 'документы для СЭС', url: '/uslugi/sertifikaciya', title: 'Санитарная сертификация' },
  ],
  'dezinfekciya_holodnyj-tuman': [
    { anchor: 'горячий туман', url: '/uslugi/dezinfekciya/goryachij-tuman', title: 'Обработка горячим туманом' },
    { anchor: 'дезинфекция квартир', url: '/uslugi/dezinfekciya/kvartir', title: 'Дезинфекция квартир' },
    { anchor: 'озонирование', url: '/uslugi/ozonirovanie', title: 'Озонирование помещений' },
  ],
  'dezinfekciya_goryachij-tuman': [
    { anchor: 'холодный туман', url: '/uslugi/dezinfekciya/holodnyj-tuman', title: 'Обработка холодным туманом' },
    { anchor: 'дезинфекция офисов', url: '/uslugi/dezinfekciya/ofisov', title: 'Дезинфекция офисов' },
    { anchor: 'уничтожение клопов', url: '/uslugi/dezinsekciya/unichtozhenie-klopov', title: 'Уничтожение клопов' },
  ],

  // === ДЕЗИНСЕКЦИЯ ===
  dezinsekciya: [
    { anchor: 'уничтожение клопов', url: '/uslugi/dezinsekciya/unichtozhenie-klopov', title: 'Уничтожение клопов' },
    { anchor: 'уничтожение тараканов', url: '/uslugi/dezinsekciya/unichtozhenie-tarakanov', title: 'Уничтожение тараканов' },
    { anchor: 'уничтожение муравьёв', url: '/uslugi/dezinsekciya/unichtozhenie-muravev', title: 'Уничтожение муравьёв' },
    { anchor: 'уничтожение блох', url: '/uslugi/dezinsekciya/unichtozhenie-bloh', title: 'Уничтожение блох' },
    { anchor: 'борьба с комарами', url: '/uslugi/dezinsekciya/unichtozhenie-komarov', title: 'Уничтожение комаров' },
    { anchor: 'рассчитать стоимость', url: '/ceny', title: 'Калькулятор стоимости' },
  ],
  'dezinsekciya_unichtozhenie-klopov': [
    { anchor: 'уничтожение тараканов', url: '/uslugi/dezinsekciya/unichtozhenie-tarakanov', title: 'Уничтожение тараканов' },
    { anchor: 'уничтожение блох', url: '/uslugi/dezinsekciya/unichtozhenie-bloh', title: 'Уничтожение блох' },
    { anchor: 'дезинфекция квартир', url: '/uslugi/dezinfekciya/kvartir', title: 'Дезинфекция квартир' },
    { anchor: 'горячий туман', url: '/uslugi/dezinfekciya/goryachij-tuman', title: 'Обработка горячим туманом' },
  ],
  'dezinsekciya_unichtozhenie-tarakanov': [
    { anchor: 'уничтожение клопов', url: '/uslugi/dezinsekciya/unichtozhenie-klopov', title: 'Уничтожение клопов' },
    { anchor: 'уничтожение муравьёв', url: '/uslugi/dezinsekciya/unichtozhenie-muravev', title: 'Уничтожение муравьёв' },
    { anchor: 'дезинфекция офисов', url: '/uslugi/dezinfekciya/ofisov', title: 'Дезинфекция офисов' },
    { anchor: 'документы для СЭС', url: '/uslugi/sertifikaciya', title: 'Санитарная сертификация' },
  ],
  'dezinsekciya_unichtozhenie-muravev': [
    { anchor: 'уничтожение тараканов', url: '/uslugi/dezinsekciya/unichtozhenie-tarakanov', title: 'Уничтожение тараканов' },
    { anchor: 'уничтожение блох', url: '/uslugi/dezinsekciya/unichtozhenie-bloh', title: 'Уничтожение блох' },
    { anchor: 'дезинфекция квартир', url: '/uslugi/dezinfekciya/kvartir', title: 'Дезинфекция квартир' },
  ],
  'dezinsekciya_unichtozhenie-bloh': [
    { anchor: 'уничтожение клопов', url: '/uslugi/dezinsekciya/unichtozhenie-klopov', title: 'Уничтожение клопов' },
    { anchor: 'дезинфекция квартир', url: '/uslugi/dezinfekciya/kvartir', title: 'Дезинфекция квартир' },
    { anchor: 'дератизация', url: '/uslugi/deratizaciya', title: 'Уничтожение грызунов' },
  ],
  'dezinsekciya_unichtozhenie-komarov': [
    { anchor: 'уничтожение мух', url: '/uslugi/dezinsekciya/unichtozhenie-muh', title: 'Уничтожение мух' },
    { anchor: 'обработка участка', url: '/uslugi/dezinsekciya', title: 'Дезинсекция' },
    { anchor: 'дезодорация', url: '/uslugi/dezodoraciya', title: 'Устранение запахов' },
  ],
  'dezinsekciya_unichtozhenie-muh': [
    { anchor: 'борьба с комарами', url: '/uslugi/dezinsekciya/unichtozhenie-komarov', title: 'Уничтожение комаров' },
    { anchor: 'дезинфекция', url: '/uslugi/dezinfekciya', title: 'Дезинфекция помещений' },
    { anchor: 'документы для СЭС', url: '/uslugi/sertifikaciya', title: 'Санитарная сертификация' },
  ],

  // === ДЕРАТИЗАЦИЯ ===
  deratizaciya: [
    { anchor: 'уничтожение крыс', url: '/uslugi/deratizaciya/unichtozhenie-krys', title: 'Уничтожение крыс' },
    { anchor: 'уничтожение мышей', url: '/uslugi/deratizaciya/unichtozhenie-myshej', title: 'Уничтожение мышей' },
    { anchor: 'дезинфекция после грызунов', url: '/uslugi/dezinfekciya', title: 'Дезинфекция помещений' },
    { anchor: 'рассчитать стоимость', url: '/ceny', title: 'Калькулятор стоимости' },
  ],
  'deratizaciya_unichtozhenie-krys': [
    { anchor: 'уничтожение мышей', url: '/uslugi/deratizaciya/unichtozhenie-myshej', title: 'Уничтожение мышей' },
    { anchor: 'дезинфекция после грызунов', url: '/uslugi/dezinfekciya/kvartir', title: 'Дезинфекция квартир' },
    { anchor: 'уничтожение блох', url: '/uslugi/dezinsekciya/unichtozhenie-bloh', title: 'Уничтожение блох' },
    { anchor: 'документы для СЭС', url: '/uslugi/sertifikaciya', title: 'Санитарная сертификация' },
  ],
  'deratizaciya_unichtozhenie-myshej': [
    { anchor: 'уничтожение крыс', url: '/uslugi/deratizaciya/unichtozhenie-krys', title: 'Уничтожение крыс' },
    { anchor: 'дезинфекция', url: '/uslugi/dezinfekciya/kvartir', title: 'Дезинфекция квартир' },
    { anchor: 'уничтожение блох', url: '/uslugi/dezinsekciya/unichtozhenie-bloh', title: 'Уничтожение блох' },
  ],

  // === ОЗОНИРОВАНИЕ ===
  ozonirovanie: [
    { anchor: 'дезинфекция', url: '/uslugi/dezinfekciya', title: 'Дезинфекция помещений' },
    { anchor: 'устранение запахов', url: '/uslugi/dezodoraciya', title: 'Дезодорация' },
    { anchor: 'дезинфекция квартир', url: '/uslugi/dezinfekciya/kvartir', title: 'Дезинфекция квартир' },
    { anchor: 'холодный туман', url: '/uslugi/dezinfekciya/holodnyj-tuman', title: 'Обработка холодным туманом' },
  ],

  // === ДЕЗОДОРАЦИЯ ===
  dezodoraciya: [
    { anchor: 'озонирование', url: '/uslugi/ozonirovanie', title: 'Озонирование помещений' },
    { anchor: 'дезинфекция', url: '/uslugi/dezinfekciya', title: 'Дезинфекция помещений' },
    { anchor: 'уничтожение грызунов', url: '/uslugi/deratizaciya', title: 'Дератизация' },
    { anchor: 'дезинфекция квартир', url: '/uslugi/dezinfekciya/kvartir', title: 'Дезинфекция квартир' },
  ],

  // === СЕРТИФИКАЦИЯ ===
  sertifikaciya: [
    { anchor: 'дезинфекция офисов', url: '/uslugi/dezinfekciya/ofisov', title: 'Дезинфекция офисов' },
    { anchor: 'дезинсекция', url: '/uslugi/dezinsekciya', title: 'Дезинсекция' },
    { anchor: 'дератизация', url: '/uslugi/deratizaciya', title: 'Дератизация' },
    { anchor: 'уничтожение тараканов', url: '/uslugi/dezinsekciya/unichtozhenie-tarakanov', title: 'Уничтожение тараканов' },
  ],

  // === ГЕО-СТРАНИЦЫ ===
  'geo_cao': [
    { anchor: 'дезинфекция в САО', url: '/uslugi/dezinfekciya-sao', title: 'Дезинфекция в САО' },
    { anchor: 'дезинсекция', url: '/uslugi/dezinsekciya', title: 'Уничтожение насекомых' },
    { anchor: 'уничтожение клопов', url: '/uslugi/dezinsekciya/unichtozhenie-klopov', title: 'Уничтожение клопов' },
  ],
  'geo_sao': [
    { anchor: 'дезинфекция в ЦАО', url: '/uslugi/dezinfekciya-cao', title: 'Дезинфекция в ЦАО' },
    { anchor: 'дезинфекция в СВАО', url: '/uslugi/dezinfekciya-svao', title: 'Дезинфекция в СВАО' },
    { anchor: 'уничтожение тараканов', url: '/uslugi/dezinsekciya/unichtozhenie-tarakanov', title: 'Уничтожение тараканов' },
  ],
  'geo_svao': [
    { anchor: 'дезинфекция в САО', url: '/uslugi/dezinfekciya-sao', title: 'Дезинфекция в САО' },
    { anchor: 'дезинфекция в ВАО', url: '/uslugi/dezinfekciya-vao', title: 'Дезинфекция в ВАО' },
    { anchor: 'уничтожение клопов', url: '/uslugi/dezinsekciya/unichtozhenie-klopov', title: 'Уничтожение клопов' },
  ],
  'geo_vao': [
    { anchor: 'дезинфекция в СВАО', url: '/uslugi/dezinfekciya-svao', title: 'Дезинфекция в СВАО' },
    { anchor: 'дезинфекция в ЮВАО', url: '/uslugi/dezinfekciya-uvao', title: 'Дезинфекция в ЮВАО' },
    { anchor: 'дератизация', url: '/uslugi/deratizaciya', title: 'Уничтожение грызунов' },
  ],
  'geo_uvao': [
    { anchor: 'дезинфекция в ВАО', url: '/uslugi/dezinfekciya-vao', title: 'Дезинфекция в ВАО' },
    { anchor: 'дезинфекция в ЮАО', url: '/uslugi/dezinfekciya-uao', title: 'Дезинфекция в ЮАО' },
    { anchor: 'уничтожение крыс', url: '/uslugi/deratizaciya/unichtozhenie-krys', title: 'Уничтожение крыс' },
  ],
  'geo_uao': [
    { anchor: 'дезинфекция в ЮВАО', url: '/uslugi/dezinfekciya-uvao', title: 'Дезинфекция в ЮВАО' },
    { anchor: 'дезинфекция в ЮЗАО', url: '/uslugi/dezinfekciya-uzao', title: 'Дезинфекция в ЮЗАО' },
    { anchor: 'дезинсекция', url: '/uslugi/dezinsekciya', title: 'Уничтожение насекомых' },
  ],
  'geo_uzao': [
    { anchor: 'дезинфекция в ЮАО', url: '/uslugi/dezinfekciya-uao', title: 'Дезинфекция в ЮАО' },
    { anchor: 'дезинфекция в ЗАО', url: '/uslugi/dezinfekciya-zao', title: 'Дезинфекция в ЗАО' },
    { anchor: 'уничтожение мышей', url: '/uslugi/deratizaciya/unichtozhenie-myshej', title: 'Уничтожение мышей' },
  ],
  'geo_zao': [
    { anchor: 'дезинфекция в ЮЗАО', url: '/uslugi/dezinfekciya-uzao', title: 'Дезинфекция в ЮЗАО' },
    { anchor: 'дезинфекция в СЗАО', url: '/uslugi/dezinfekciya-szao', title: 'Дезинфекция в СЗАО' },
    { anchor: 'уничтожение тараканов', url: '/uslugi/dezinsekciya/unichtozhenie-tarakanov', title: 'Уничтожение тараканов' },
  ],
  'geo_szao': [
    { anchor: 'дезинфекция в ЗАО', url: '/uslugi/dezinfekciya-zao', title: 'Дезинфекция в ЗАО' },
    { anchor: 'дезинфекция в САО', url: '/uslugi/dezinfekciya-sao', title: 'Дезинфекция в САО' },
    { anchor: 'дератизация', url: '/uslugi/deratizaciya', title: 'Уничтожение грызунов' },
  ],

  // === СТАТЬИ БЛОГА ПО КАТЕГОРИЯМ ===
  'article_vrediteli': [
    { anchor: 'уничтожение клопов', url: '/uslugi/dezinsekciya/unichtozhenie-klopov', title: 'Профессиональное уничтожение клопов' },
    { anchor: 'уничтожение тараканов', url: '/uslugi/dezinsekciya/unichtozhenie-tarakanov', title: 'Уничтожение тараканов' },
    { anchor: 'дезинсекция', url: '/uslugi/dezinsekciya', title: 'Услуги дезинсекции' },
    { anchor: 'уничтожение мышей', url: '/uslugi/deratizaciya/unichtozhenie-myshej', title: 'Уничтожение мышей' },
    { anchor: 'заказать обработку', url: '/ceny', title: 'Рассчитать стоимость' },
  ],
  'article_sovety': [
    { anchor: 'дезинфекция квартир', url: '/uslugi/dezinfekciya/kvartir', title: 'Дезинфекция квартир' },
    { anchor: 'дезинфекция', url: '/uslugi/dezinfekciya', title: 'Услуги дезинфекции' },
    { anchor: 'озонирование', url: '/uslugi/ozonirovanie', title: 'Озонирование помещений' },
    { anchor: 'позвонить специалисту', url: '/contacts', title: 'Контакты' },
  ],
  'article_zakony': [
    { anchor: 'документы для СЭС', url: '/uslugi/sertifikaciya', title: 'Санитарная сертификация' },
    { anchor: 'дезинфекция офисов', url: '/uslugi/dezinfekciya/ofisov', title: 'Дезинфекция офисов' },
    { anchor: 'дератизация', url: '/uslugi/deratizaciya', title: 'Дератизация' },
  ],
  'article_preparaty': [
    { anchor: 'холодный туман', url: '/uslugi/dezinfekciya/holodnyj-tuman', title: 'Обработка холодным туманом' },
    { anchor: 'горячий туман', url: '/uslugi/dezinfekciya/goryachij-tuman', title: 'Обработка горячим туманом' },
    { anchor: 'дезинфекция', url: '/uslugi/dezinfekciya', title: 'Услуги дезинфекции' },
  ],
  'article_kejsy': [
    { anchor: 'дезинсекция', url: '/uslugi/dezinsekciya', title: 'Услуги дезинсекции' },
    { anchor: 'дератизация', url: '/uslugi/deratizaciya', title: 'Услуги дератизации' },
    { anchor: 'заказать обработку', url: '/ceny', title: 'Рассчитать стоимость' },
  ],

  // Общий fallback для статей
  article: [
    { anchor: 'профессиональная дезинфекция', url: '/uslugi/dezinfekciya', title: 'Услуги дезинфекции' },
    { anchor: 'заказать обработку', url: '/ceny', title: 'Рассчитать стоимость' },
    { anchor: 'уничтожение клопов', url: '/uslugi/dezinsekciya/unichtozhenie-klopov', title: 'Уничтожение клопов' },
    { anchor: 'борьба с тараканами', url: '/uslugi/dezinsekciya/unichtozhenie-tarakanov', title: 'Уничтожение тараканов' },
    { anchor: 'позвонить специалисту', url: '/contacts', title: 'Контакты' },
    { anchor: 'дезинсекция', url: '/uslugi/dezinsekciya', title: 'Услуги дезинсекции' },
    { anchor: 'дератизация', url: '/uslugi/deratizaciya', title: 'Услуги дератизации' },
  ],
};

/**
 * Получить связанные страницы для текущей
 * Расширенная версия с полной картой перелинковки
 */
export function getRelatedPages(currentSlug: string): Array<{ title: string; url: string; description?: string }> {
  const relatedMap: Record<string, Array<{ title: string; url: string; description?: string }>> = {
    // === ОСНОВНЫЕ УСЛУГИ ===
    'dezinfekciya': [
      { title: 'Дезинсекция', url: '/uslugi/dezinsekciya', description: 'Уничтожение насекомых' },
      { title: 'Дератизация', url: '/uslugi/deratizaciya', description: 'Уничтожение грызунов' },
      { title: 'Озонирование', url: '/uslugi/ozonirovanie', description: 'Очистка воздуха озоном' },
      { title: 'Дезинфекция квартир', url: '/uslugi/dezinfekciya/kvartir', description: 'Обработка жилых помещений' },
    ],
    'dezinsekciya': [
      { title: 'Дезинфекция', url: '/uslugi/dezinfekciya', description: 'Обеззараживание помещений' },
      { title: 'Дератизация', url: '/uslugi/deratizaciya', description: 'Уничтожение грызунов' },
      { title: 'Уничтожение клопов', url: '/uslugi/dezinsekciya/unichtozhenie-klopov', description: 'Избавление от клопов' },
      { title: 'Цены и калькулятор', url: '/ceny', description: 'Рассчитать стоимость' },
    ],
    'deratizaciya': [
      { title: 'Дезинфекция', url: '/uslugi/dezinfekciya', description: 'Обеззараживание помещений' },
      { title: 'Дезинсекция', url: '/uslugi/dezinsekciya', description: 'Уничтожение насекомых' },
      { title: 'Уничтожение крыс', url: '/uslugi/deratizaciya/unichtozhenie-krys', description: 'Избавление от крыс' },
      { title: 'Цены и калькулятор', url: '/ceny', description: 'Рассчитать стоимость' },
    ],
    'ozonirovanie': [
      { title: 'Дезинфекция', url: '/uslugi/dezinfekciya', description: 'Обеззараживание помещений' },
      { title: 'Дезодорация', url: '/uslugi/dezodoraciya', description: 'Устранение запахов' },
      { title: 'Дезинфекция квартир', url: '/uslugi/dezinfekciya/kvartir', description: 'Обработка жилых помещений' },
    ],
    'dezodoraciya': [
      { title: 'Озонирование', url: '/uslugi/ozonirovanie', description: 'Очистка воздуха озоном' },
      { title: 'Дезинфекция', url: '/uslugi/dezinfekciya', description: 'Обеззараживание помещений' },
      { title: 'Дезинфекция квартир', url: '/uslugi/dezinfekciya/kvartir', description: 'Обработка жилых помещений' },
    ],
    'sertifikaciya': [
      { title: 'Дезинфекция офисов', url: '/uslugi/dezinfekciya/ofisov', description: 'Для бизнеса' },
      { title: 'Дезинсекция', url: '/uslugi/dezinsekciya', description: 'Уничтожение насекомых' },
      { title: 'Дератизация', url: '/uslugi/deratizaciya', description: 'Уничтожение грызунов' },
    ],

    // === ПОДСТРАНИЦЫ ДЕЗИНФЕКЦИИ ===
    'dezinfekciya_kvartir': [
      { title: 'Дезинфекция офисов', url: '/uslugi/dezinfekciya/ofisov', description: 'Для бизнеса' },
      { title: 'Озонирование', url: '/uslugi/ozonirovanie', description: 'Очистка воздуха' },
      { title: 'Уничтожение клопов', url: '/uslugi/dezinsekciya/unichtozhenie-klopov', description: 'Избавление от клопов' },
    ],
    'dezinfekciya_ofisov': [
      { title: 'Дезинфекция квартир', url: '/uslugi/dezinfekciya/kvartir', description: 'Для частных лиц' },
      { title: 'Санитарная сертификация', url: '/uslugi/sertifikaciya', description: 'Документы для СЭС' },
      { title: 'Уничтожение тараканов', url: '/uslugi/dezinsekciya/unichtozhenie-tarakanov', description: 'Избавление от тараканов' },
    ],
    'dezinfekciya_holodnyj-tuman': [
      { title: 'Горячий туман', url: '/uslugi/dezinfekciya/goryachij-tuman', description: 'Термическая обработка' },
      { title: 'Дезинфекция квартир', url: '/uslugi/dezinfekciya/kvartir', description: 'Обработка жилья' },
      { title: 'Озонирование', url: '/uslugi/ozonirovanie', description: 'Очистка воздуха' },
    ],
    'dezinfekciya_goryachij-tuman': [
      { title: 'Холодный туман', url: '/uslugi/dezinfekciya/holodnyj-tuman', description: 'Мелкодисперсная обработка' },
      { title: 'Уничтожение клопов', url: '/uslugi/dezinsekciya/unichtozhenie-klopov', description: 'Эффективно против клопов' },
      { title: 'Дезинфекция офисов', url: '/uslugi/dezinfekciya/ofisov', description: 'Для бизнеса' },
    ],

    // === ПОДСТРАНИЦЫ ДЕЗИНСЕКЦИИ ===
    'dezinsekciya_unichtozhenie-klopov': [
      { title: 'Уничтожение тараканов', url: '/uslugi/dezinsekciya/unichtozhenie-tarakanov', description: 'Избавление от тараканов' },
      { title: 'Уничтожение блох', url: '/uslugi/dezinsekciya/unichtozhenie-bloh', description: 'Избавление от блох' },
      { title: 'Дезинфекция квартир', url: '/uslugi/dezinfekciya/kvartir', description: 'Комплексная обработка' },
    ],
    'dezinsekciya_unichtozhenie-tarakanov': [
      { title: 'Уничтожение клопов', url: '/uslugi/dezinsekciya/unichtozhenie-klopov', description: 'Избавление от клопов' },
      { title: 'Уничтожение муравьёв', url: '/uslugi/dezinsekciya/unichtozhenie-muravev', description: 'Избавление от муравьёв' },
      { title: 'Санитарная сертификация', url: '/uslugi/sertifikaciya', description: 'Документы для СЭС' },
    ],
    'dezinsekciya_unichtozhenie-muravev': [
      { title: 'Уничтожение тараканов', url: '/uslugi/dezinsekciya/unichtozhenie-tarakanov', description: 'Избавление от тараканов' },
      { title: 'Уничтожение блох', url: '/uslugi/dezinsekciya/unichtozhenie-bloh', description: 'Избавление от блох' },
      { title: 'Дезинфекция квартир', url: '/uslugi/dezinfekciya/kvartir', description: 'Комплексная обработка' },
    ],
    'dezinsekciya_unichtozhenie-bloh': [
      { title: 'Уничтожение клопов', url: '/uslugi/dezinsekciya/unichtozhenie-klopov', description: 'Избавление от клопов' },
      { title: 'Дератизация', url: '/uslugi/deratizaciya', description: 'Уничтожение грызунов' },
      { title: 'Дезинфекция', url: '/uslugi/dezinfekciya/kvartir', description: 'Комплексная обработка' },
    ],
    'dezinsekciya_unichtozhenie-komarov': [
      { title: 'Уничтожение мух', url: '/uslugi/dezinsekciya/unichtozhenie-muh', description: 'Избавление от мух' },
      { title: 'Дезодорация', url: '/uslugi/dezodoraciya', description: 'Устранение запахов' },
      { title: 'Дезинсекция', url: '/uslugi/dezinsekciya', description: 'Все услуги' },
    ],
    'dezinsekciya_unichtozhenie-muh': [
      { title: 'Уничтожение комаров', url: '/uslugi/dezinsekciya/unichtozhenie-komarov', description: 'Избавление от комаров' },
      { title: 'Санитарная сертификация', url: '/uslugi/sertifikaciya', description: 'Документы для СЭС' },
      { title: 'Дезинфекция', url: '/uslugi/dezinfekciya', description: 'Обеззараживание' },
    ],

    // === ПОДСТРАНИЦЫ ДЕРАТИЗАЦИИ ===
    'deratizaciya_unichtozhenie-krys': [
      { title: 'Уничтожение мышей', url: '/uslugi/deratizaciya/unichtozhenie-myshej', description: 'Избавление от мышей' },
      { title: 'Дезинфекция', url: '/uslugi/dezinfekciya/kvartir', description: 'После грызунов' },
      { title: 'Уничтожение блох', url: '/uslugi/dezinsekciya/unichtozhenie-bloh', description: 'Блохи от грызунов' },
    ],
    'deratizaciya_unichtozhenie-myshej': [
      { title: 'Уничтожение крыс', url: '/uslugi/deratizaciya/unichtozhenie-krys', description: 'Избавление от крыс' },
      { title: 'Дезинфекция', url: '/uslugi/dezinfekciya/kvartir', description: 'После грызунов' },
      { title: 'Уничтожение блох', url: '/uslugi/dezinsekciya/unichtozhenie-bloh', description: 'Блохи от грызунов' },
    ],

    // === ГЕО-СТРАНИЦЫ ===
    'geo_cao': [
      { title: 'Дезинфекция в САО', url: '/uslugi/dezinfekciya-sao', description: 'Северный округ' },
      { title: 'Дезинсекция', url: '/uslugi/dezinsekciya', description: 'Уничтожение насекомых' },
      { title: 'Цены', url: '/ceny', description: 'Рассчитать стоимость' },
    ],
    'geo_sao': [
      { title: 'Дезинфекция в ЦАО', url: '/uslugi/dezinfekciya-cao', description: 'Центральный округ' },
      { title: 'Дезинфекция в СВАО', url: '/uslugi/dezinfekciya-svao', description: 'Северо-Восток' },
      { title: 'Дератизация', url: '/uslugi/deratizaciya', description: 'Уничтожение грызунов' },
    ],
    'geo_svao': [
      { title: 'Дезинфекция в САО', url: '/uslugi/dezinfekciya-sao', description: 'Северный округ' },
      { title: 'Дезинфекция в ВАО', url: '/uslugi/dezinfekciya-vao', description: 'Восточный округ' },
      { title: 'Дезинсекция', url: '/uslugi/dezinsekciya', description: 'Уничтожение насекомых' },
    ],
    'geo_vao': [
      { title: 'Дезинфекция в СВАО', url: '/uslugi/dezinfekciya-svao', description: 'Северо-Восток' },
      { title: 'Дезинфекция в ЮВАО', url: '/uslugi/dezinfekciya-uvao', description: 'Юго-Восток' },
      { title: 'Дератизация', url: '/uslugi/deratizaciya', description: 'Уничтожение грызунов' },
    ],
    'geo_uvao': [
      { title: 'Дезинфекция в ВАО', url: '/uslugi/dezinfekciya-vao', description: 'Восточный округ' },
      { title: 'Дезинфекция в ЮАО', url: '/uslugi/dezinfekciya-uao', description: 'Южный округ' },
      { title: 'Дезинсекция', url: '/uslugi/dezinsekciya', description: 'Уничтожение насекомых' },
    ],
    'geo_uao': [
      { title: 'Дезинфекция в ЮВАО', url: '/uslugi/dezinfekciya-uvao', description: 'Юго-Восток' },
      { title: 'Дезинфекция в ЮЗАО', url: '/uslugi/dezinfekciya-uzao', description: 'Юго-Запад' },
      { title: 'Дератизация', url: '/uslugi/deratizaciya', description: 'Уничтожение грызунов' },
    ],
    'geo_uzao': [
      { title: 'Дезинфекция в ЮАО', url: '/uslugi/dezinfekciya-uao', description: 'Южный округ' },
      { title: 'Дезинфекция в ЗАО', url: '/uslugi/dezinfekciya-zao', description: 'Западный округ' },
      { title: 'Дезинсекция', url: '/uslugi/dezinsekciya', description: 'Уничтожение насекомых' },
    ],
    'geo_zao': [
      { title: 'Дезинфекция в ЮЗАО', url: '/uslugi/dezinfekciya-uzao', description: 'Юго-Запад' },
      { title: 'Дезинфекция в СЗАО', url: '/uslugi/dezinfekciya-szao', description: 'Северо-Запад' },
      { title: 'Дератизация', url: '/uslugi/deratizaciya', description: 'Уничтожение грызунов' },
    ],
    'geo_szao': [
      { title: 'Дезинфекция в ЗАО', url: '/uslugi/dezinfekciya-zao', description: 'Западный округ' },
      { title: 'Дезинфекция в САО', url: '/uslugi/dezinfekciya-sao', description: 'Северный округ' },
      { title: 'Дезинсекция', url: '/uslugi/dezinsekciya', description: 'Уничтожение насекомых' },
    ],

    // === СТАТЬИ БЛОГА ПО КАТЕГОРИЯМ ===
    'article_vrediteli': [
      { title: 'Дезинсекция', url: '/uslugi/dezinsekciya', description: 'Профессиональная обработка' },
      { title: 'Уничтожение клопов', url: '/uslugi/dezinsekciya/unichtozhenie-klopov', description: 'Избавление от клопов' },
      { title: 'Дератизация', url: '/uslugi/deratizaciya', description: 'Уничтожение грызунов' },
    ],
    'article_sovety': [
      { title: 'Дезинфекция', url: '/uslugi/dezinfekciya', description: 'Обеззараживание' },
      { title: 'Озонирование', url: '/uslugi/ozonirovanie', description: 'Очистка воздуха' },
      { title: 'Все услуги', url: '/', description: 'Каталог услуг' },
    ],
    'article_zakony': [
      { title: 'Сертификация', url: '/uslugi/sertifikaciya', description: 'Документы для СЭС' },
      { title: 'Дезинфекция офисов', url: '/uslugi/dezinfekciya/ofisov', description: 'Для бизнеса' },
      { title: 'Контакты', url: '/contacts', description: 'Связаться с нами' },
    ],
    'article_preparaty': [
      { title: 'Холодный туман', url: '/uslugi/dezinfekciya/holodnyj-tuman', description: 'Метод обработки' },
      { title: 'Горячий туман', url: '/uslugi/dezinfekciya/goryachij-tuman', description: 'Метод обработки' },
      { title: 'Дезинфекция', url: '/uslugi/dezinfekciya', description: 'Все методы' },
    ],
    'article_kejsy': [
      { title: 'Дезинсекция', url: '/uslugi/dezinsekciya', description: 'Уничтожение насекомых' },
      { title: 'Дератизация', url: '/uslugi/deratizaciya', description: 'Уничтожение грызунов' },
      { title: 'Цены', url: '/ceny', description: 'Рассчитать стоимость' },
    ],
  };
  
  return relatedMap[currentSlug] || [
    { title: 'Все услуги', url: '/', description: 'Каталог услуг' },
    { title: 'Цены', url: '/ceny', description: 'Калькулятор стоимости' },
    { title: 'Блог', url: '/blog', description: 'Полезные статьи' },
    { title: 'Контакты', url: '/contacts', description: 'Связаться с нами' },
  ];
}

// ============= SEO AUDIT =============

export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  element?: string;
}

/**
 * Проверка SEO на клиенте (dev режим)
 */
export function runSEOAudit(): SEOIssue[] {
  if (typeof window === 'undefined') return [];
  
  const issues: SEOIssue[] = [];
  
  // Title check
  const title = document.querySelector('title');
  if (!title?.textContent) {
    issues.push({ type: 'error', message: 'Title отсутствует' });
  } else if (title.textContent.length < 30) {
    issues.push({ type: 'warning', message: `Title слишком короткий: ${title.textContent.length} символов (рекомендуется 50-60)` });
  } else if (title.textContent.length > 70) {
    issues.push({ type: 'warning', message: `Title слишком длинный: ${title.textContent.length} символов (рекомендуется 50-60)` });
  }
  
  // H1 check
  const h1s = document.querySelectorAll('h1');
  if (h1s.length === 0) {
    issues.push({ type: 'error', message: 'H1 отсутствует на странице' });
  } else if (h1s.length > 1) {
    issues.push({ type: 'warning', message: `Найдено ${h1s.length} тегов H1 (рекомендуется 1)` });
  }
  
  // Meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc?.getAttribute('content')) {
    issues.push({ type: 'error', message: 'Meta description отсутствует' });
  } else {
    const descLength = metaDesc.getAttribute('content')?.length || 0;
    if (descLength < 120) {
      issues.push({ type: 'warning', message: `Meta description короткий: ${descLength} символов` });
    } else if (descLength > 160) {
      issues.push({ type: 'warning', message: `Meta description длинный: ${descLength} символов` });
    }
  }
  
  // Images alt check
  const images = document.querySelectorAll('img');
  const imagesWithoutAlt = Array.from(images).filter(img => !img.alt);
  if (imagesWithoutAlt.length > 0) {
    issues.push({ type: 'warning', message: `${imagesWithoutAlt.length} изображений без alt-атрибута` });
  }
  
  // Canonical check
  const canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    issues.push({ type: 'error', message: 'Canonical URL отсутствует' });
  }
  
  // Schema.org check
  const schemas = document.querySelectorAll('script[type="application/ld+json"]');
  if (schemas.length === 0) {
    issues.push({ type: 'warning', message: 'Schema.org разметка отсутствует' });
  } else {
    issues.push({ type: 'info', message: `Найдено ${schemas.length} блоков Schema.org` });
  }
  
  // Internal links check
  const internalLinks = document.querySelectorAll('a[href^="/"]');
  if (internalLinks.length < 3) {
    issues.push({ type: 'warning', message: `Мало внутренних ссылок: ${internalLinks.length} (рекомендуется 3-10)` });
  }
  
  return issues;
}

/**
 * Вывод SEO аудита в консоль (только dev)
 */
export function logSEOAudit() {
  if (typeof window === 'undefined') return;
  if (import.meta.env.PROD) return;
  
  const issues = runSEOAudit();
  
  console.group('🔍 SEO Audit:', window.location.pathname);
  
  issues.forEach(issue => {
    const icon = issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : '✅';
    const method = issue.type === 'error' ? 'error' : issue.type === 'warning' ? 'warn' : 'log';
    console[method](`${icon} ${issue.message}`);
  });
  
  const errors = issues.filter(i => i.type === 'error').length;
  const warnings = issues.filter(i => i.type === 'warning').length;
  
  if (errors === 0 && warnings === 0) {
    console.log('🎉 Все SEO проверки пройдены!');
  } else {
    console.log(`📊 Итого: ${errors} ошибок, ${warnings} предупреждений`);
  }
  
  console.groupEnd();
}
