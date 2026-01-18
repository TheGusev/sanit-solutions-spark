/**
 * === SERVICE SUBPAGE ===
 * Универсальная страница подуслуги
 */

import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SubpageLayout } from '@/components/SubpageLayout';
import { CalculatorModal } from '@/components/CalculatorModal';
import { getSubpage, getSubpageUrl } from '@/data/subpages';
import type { ServiceCategory } from '@/data/subpages/types';

export default function ServiceSubpage() {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // Validate and get subpage data
  const subpage = getSubpage(category as ServiceCategory, slug || '');

  if (!subpage) {
    return <Navigate to="/404" replace />;
  }

  const canonicalUrl = `https://goruslugimsk.ru${getSubpageUrl(subpage)}`;

  // Schema.org structured data
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: subpage.seo.h1,
    name: subpage.seo.h1,
    description: subpage.seo.description,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Санитарные Решения',
      telephone: '+7-906-998-98-88',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Москва',
        addressRegion: 'Москва',
      },
    },
    areaServed: {
      '@type': 'City',
      name: 'Москва',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: subpage.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: subpage.breadcrumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.text,
      item: `https://goruslugimsk.ru${crumb.url}`,
    })),
  };

  return (
    <>
      <Helmet>
        <title>{subpage.seo.title}</title>
        <meta name="description" content={subpage.seo.description} />
        <meta name="keywords" content={subpage.seo.keywords.join(', ')} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={subpage.seo.title} />
        <meta property="og:description" content={subpage.seo.description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        
        {/* Schema.org */}
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Header />
      
      <main>
        <SubpageLayout data={subpage} onOrderClick={() => setIsCalculatorOpen(true)} />
      </main>

      <Footer />

      <CalculatorModal open={isCalculatorOpen} onOpenChange={setIsCalculatorOpen} />
    </>
  );
}
