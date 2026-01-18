/**
 * === SEO COMPONENTS ===
 * Компоненты для SEO-оптимизации страниц
 */

import { Helmet } from 'react-helmet-async';
import { 
  generateMeta, 
  generateOrganizationSchema,
  generateServiceSchema,
  generateArticleSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generatePriceSchema,
  BASE_URL,
  type MetaData,
  type PageData
} from '@/lib/seo';

// ============= META TAGS COMPONENT =============

interface MetaTagsProps {
  pageType: 'home' | 'service' | 'subservice' | 'geo' | 'article' | 'pricing' | 'contacts' | 'blog';
  data?: PageData;
  path: string;
  customMeta?: Partial<MetaData>;
}

export function MetaTags({ pageType, data = {}, path, customMeta }: MetaTagsProps) {
  const meta = { ...generateMeta(pageType, data, path), ...customMeta };
  
  return (
    <Helmet>
      {/* Базовые meta */}
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords} />
      
      {/* Canonical */}
      <link rel="canonical" href={meta.canonicalUrl} />
      
      {/* Hreflang */}
      <link rel="alternate" hrefLang="ru" href={meta.canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={meta.canonicalUrl} />
      
      {/* Robots */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Open Graph */}
      <meta property="og:type" content={meta.type || 'website'} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={`${BASE_URL}${meta.ogImage || '/og-image.jpg'}`} />
      <meta property="og:url" content={meta.canonicalUrl} />
      <meta property="og:site_name" content="Санитарные Решения" />
      <meta property="og:locale" content="ru_RU" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={`${BASE_URL}${meta.ogImage || '/og-image.jpg'}`} />
      
      {/* Geo meta */}
      <meta name="geo.region" content="RU-MOW" />
      <meta name="geo.placename" content="Москва" />
      
      {/* Article specific */}
      {meta.type === 'article' && meta.publishedTime && (
        <>
          <meta property="article:published_time" content={meta.publishedTime} />
          {meta.modifiedTime && <meta property="article:modified_time" content={meta.modifiedTime} />}
          {meta.author && <meta property="article:author" content={meta.author} />}
          {meta.section && <meta property="article:section" content={meta.section} />}
          {meta.tags?.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
    </Helmet>
  );
}

// ============= SCHEMA.ORG COMPONENTS =============

export function OrganizationSchema() {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(generateOrganizationSchema())}
      </script>
    </Helmet>
  );
}

interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
  minPrice: number;
  maxPrice: number;
  areaServed?: string[];
}

export function ServiceSchema(props: ServiceSchemaProps) {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(generateServiceSchema(props))}
      </script>
    </Helmet>
  );
}

interface ArticleSchemaProps {
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
}

export function ArticleSchema(props: ArticleSchemaProps) {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(generateArticleSchema(props))}
      </script>
    </Helmet>
  );
}

interface FAQSchemaProps {
  questions: Array<{ question: string; answer: string }>;
}

export function FAQSchema({ questions }: FAQSchemaProps) {
  if (questions.length === 0) return null;
  
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(generateFAQSchema(questions))}
      </script>
    </Helmet>
  );
}

interface BreadcrumbSchemaProps {
  items: Array<{ name: string; url?: string }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(generateBreadcrumbSchema(items))}
      </script>
    </Helmet>
  );
}

interface PriceSchemaProps {
  services: Array<{ name: string; minPrice: number; maxPrice: number }>;
}

export function PriceSchema({ services }: PriceSchemaProps) {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(generatePriceSchema(services))}
      </script>
    </Helmet>
  );
}

// ============= COMBINED SEO COMPONENT =============

interface SEOProps {
  pageType: 'home' | 'service' | 'subservice' | 'geo' | 'article' | 'pricing' | 'contacts' | 'blog';
  path: string;
  data?: PageData;
  customMeta?: Partial<MetaData>;
  breadcrumbs?: Array<{ name: string; url?: string }>;
  faq?: Array<{ question: string; answer: string }>;
  service?: ServiceSchemaProps;
  article?: ArticleSchemaProps;
  includeOrganization?: boolean;
}

export function SEO({
  pageType,
  path,
  data,
  customMeta,
  breadcrumbs,
  faq,
  service,
  article,
  includeOrganization = true,
}: SEOProps) {
  return (
    <>
      <MetaTags pageType={pageType} path={path} data={data} customMeta={customMeta} />
      {includeOrganization && <OrganizationSchema />}
      {breadcrumbs && <BreadcrumbSchema items={breadcrumbs} />}
      {faq && <FAQSchema questions={faq} />}
      {service && <ServiceSchema {...service} />}
      {article && <ArticleSchema {...article} />}
    </>
  );
}

export default SEO;
