/**
 * === СТРАНИЦА УСЛУГИ: ДЕЗИНФЕКЦИЯ ===
 * URL: /uslugi/dezinfekciya
 * С интегрированной SEO-системой
 */

import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import Header from '@/components/Header';
import ServiceTabNav from '@/components/ServiceTabNav';
import DezinfekciyaCards from '@/components/ServiceCards/DezinfekciyaCards';
import { dezinfekciyaData, dezinfekciyaSchemas } from '@/data/dezinfekciyaData';
import PageLoader from '@/components/PageLoader';
import CalculatorModal from '@/components/CalculatorModal';
import { SEO } from '@/components/SEO';
import RelatedPages from '@/components/SEO/RelatedPages';

const Footer = lazy(() => import('@/components/Footer'));

const DezinfekciyaPage = () => {
  const { seo, tabs, faq } = dezinfekciyaData;
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const sectionIds = tabs.map(tab => tab.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            const sectionId = entry.target.id;
            if (sectionIds.includes(sectionId)) {
              setActiveTab(sectionId);
            }
          }
        });
      },
      { threshold: 0.3, rootMargin: '-140px 0px -50% 0px' }
    );

    sectionIds.forEach(id => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [tabs]);

  const handleTabClick = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  const handleOrderClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // Breadcrumb items for SEO
  const breadcrumbItems = [
    { name: "Главная", url: "/" },
    { name: "Услуги", url: "/#services" },
    { name: "Дезинфекция" }
  ];

  return (
    <>
      {/* Unified SEO Components */}
      <SEO
        pageType="service"
        path="/uslugi/dezinfekciya"
        data={{
          service: "Дезинфекция",
          price: 2000
        }}
        customMeta={{
          title: seo.title,
          description: seo.description,
          keywords: seo.keywords
        }}
        includeOrganization
        breadcrumbs={breadcrumbItems}
        faq={faq}
        service={{
          name: "Дезинфекция помещений",
          description: seo.description,
          url: "/uslugi/dezinfekciya",
          minPrice: 2000,
          maxPrice: 15000,
          areaServed: ["Москва", "Московская область"]
        }}
      />

      <Header />
      <ServiceTabNav tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick} />

      <main>
        <DezinfekciyaCards onOrderClick={handleOrderClick} />
        
        {/* Related Pages Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <RelatedPages currentSlug="dezinfekciya" />
          </div>
        </section>
      </main>

      <Suspense fallback={<PageLoader />}>
        <Footer />
      </Suspense>

      <CalculatorModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
      />
    </>
  );
};

export default DezinfekciyaPage;
