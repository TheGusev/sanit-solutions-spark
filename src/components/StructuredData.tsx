import { Helmet } from 'react-helmet-async';

// Types for different Schema.org schemas
export interface BreadcrumbItem {
  name: string;
  url?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BlogPostData {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  author?: string;
  dateModified?: string;
  wordCount?: number;
  category?: string;
  keywords?: string[];
  image?: string;
}

export interface ListItemData {
  name: string;
  url: string;
  position: number;
  description?: string;
  datePublished?: string;
}

export interface ServiceData {
  name: string;
  description: string;
  url: string;
  priceRange?: string;
}

// Schema type definitions
type StructuredDataProps =
  | { type: 'BreadcrumbList'; items: BreadcrumbItem[]; baseUrl: string }
  | { type: 'FAQPage'; questions: FAQItem[] }
  | { type: 'BlogPosting'; post: BlogPostData; baseUrl: string }
  | { type: 'ItemList'; name: string; description: string; items: ListItemData[] }
  | { type: 'Service'; service: ServiceData }
  | { type: 'Article'; post: BlogPostData; baseUrl: string };

// Schema generators
const generateBreadcrumbList = (items: BreadcrumbItem[], baseUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    ...(item.url && { "item": item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}` })
  }))
});

const generateFAQPage = (questions: FAQItem[]) => ({
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
});

const generateBlogPosting = (post: BlogPostData, baseUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  "description": post.excerpt,
  "datePublished": post.date,
  "author": {
    "@type": "Organization",
    "name": post.author || "ООО Санитарные Решения"
  },
  "publisher": {
    "@type": "Organization",
    "name": "ООО Санитарные Решения",
    "url": baseUrl
  },
  "mainEntityOfPage": `${baseUrl}/blog/${post.slug}`
});

const generateItemList = (name: string, description: string, items: ListItemData[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": name,
  "description": description,
  "numberOfItems": items.length,
  "itemListElement": items.map(item => ({
    "@type": "ListItem",
    "position": item.position,
    "url": item.url,
    "name": item.name,
    ...(item.description && { "description": item.description }),
    ...(item.datePublished && { "datePublished": item.datePublished })
  }))
});

const generateService = (service: ServiceData) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": service.name,
  "description": service.description,
  "url": service.url,
  ...(service.priceRange && { "priceRange": service.priceRange }),
  "provider": {
    "@type": "Organization",
    "name": "ООО Санитарные Решения"
  }
});

const generateArticle = (post: BlogPostData, baseUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": post.title,
  "description": post.excerpt,
  "datePublished": post.date,
  "dateModified": post.dateModified || post.date,
  "author": {
    "@type": "Organization",
    "name": post.author || "ООО Санитарные Решения",
    "url": baseUrl
  },
  "publisher": {
    "@type": "Organization",
    "name": "ООО Санитарные Решения",
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/og-image.jpg`
    }
  },
  "image": post.image || `${baseUrl}/og-image.jpg`,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `${baseUrl}/blog/${post.slug}`
  },
  ...(post.wordCount && { "wordCount": post.wordCount }),
  ...(post.category && { "articleSection": post.category }),
  ...(post.keywords && { "keywords": post.keywords.join(", ") })
});

const StructuredData = (props: StructuredDataProps) => {
  let schema: object;

  switch (props.type) {
    case 'BreadcrumbList':
      schema = generateBreadcrumbList(props.items, props.baseUrl);
      break;
    case 'FAQPage':
      schema = generateFAQPage(props.questions);
      break;
    case 'BlogPosting':
      schema = generateBlogPosting(props.post, props.baseUrl);
      break;
    case 'ItemList':
      schema = generateItemList(props.name, props.description, props.items);
      break;
    case 'Service':
      schema = generateService(props.service);
      break;
    case 'Article':
      schema = generateArticle(props.post, props.baseUrl);
      break;
    default:
      return null;
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
