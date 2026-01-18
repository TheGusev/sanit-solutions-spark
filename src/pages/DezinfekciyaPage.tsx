/**
 * === СТРАНИЦА УСЛУГИ: ДЕЗИНФЕКЦИЯ ===
 * URL: /uslugi/dezinfekciya
 */

import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import ServiceTabNav from '@/components/ServiceTabNav';
import DezinfekciyaCards from '@/components/ServiceCards/DezinfekciyaCards';
import { dezinfekciyaData, dezinfekciyaSchemas } from '@/data/dezinfekciyaData';
import PageLoader from '@/components/PageLoader';
import CalculatorModal from '@/components/CalculatorModal';

const Footer = lazy(() => import('@/components/Footer'));

const DezinfekciyaPage = () => {
  const { seo, tabs } = dezinfekciyaData;
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

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />
        <link rel="canonical" href={seo.canonical} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:url" content={seo.canonical} />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify(dezinfekciyaSchemas.service)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(dezinfekciyaSchemas.faq)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(dezinfekciyaSchemas.breadcrumb)}
        </script>
      </Helmet>

      <Header />
      <ServiceTabNav tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick} />

      <main>
        <DezinfekciyaCards onOrderClick={handleOrderClick} />
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
