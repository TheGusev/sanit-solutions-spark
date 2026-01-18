/**
 * === SERVICE SUBPAGE ===
 * Универсальная страница подуслуги с интегрированной SEO-системой
 */

import { useParams, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SubpageLayout } from '@/components/SubpageLayout';
import { CalculatorModal } from '@/components/CalculatorModal';
import { SEO } from '@/components/SEO';
import RelatedPages from '@/components/SEO/RelatedPages';
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

  const pageUrl = getSubpageUrl(subpage);

  // Breadcrumb items for SEO
  const breadcrumbItems = subpage.breadcrumbs.map(crumb => ({
    name: crumb.text,
    url: crumb.url
  }));

  return (
    <>
      {/* Unified SEO Components */}
      <SEO
        pageType="subservice"
        path={pageUrl}
        data={{
          service: subpage.seo.h1,
          location: "в Москве",
          price: 2000
        }}
        customMeta={{
          title: subpage.seo.title,
          description: subpage.seo.description,
          keywords: subpage.seo.keywords.join(', ')
        }}
        includeOrganization
        breadcrumbs={breadcrumbItems}
        faq={subpage.faq}
        service={{
          name: subpage.seo.h1,
          description: subpage.seo.description,
          url: pageUrl,
          minPrice: 2000,
          maxPrice: 15000,
          areaServed: ["Москва", "Московская область"]
        }}
      />

      <Header />
      
      <main>
        <SubpageLayout data={subpage} onOrderClick={() => setIsCalculatorOpen(true)} />
        
        {/* Related Pages Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <RelatedPages currentSlug={`${category}_${slug}`} />
          </div>
        </section>
      </main>

      <Footer />

      <CalculatorModal open={isCalculatorOpen} onOpenChange={setIsCalculatorOpen} />
    </>
  );
}
