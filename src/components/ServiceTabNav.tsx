/**
 * === ВНУТРЕННЯЯ НАВИГАЦИЯ СТРАНИЦЫ УСЛУГИ ===
 * Sticky табы для навигации между секциями страницы услуги
 * 
 * @component ServiceTabNav
 * @param tabs - Массив табов с id и label
 * @param activeTab - ID активного таба
 * @param onTabClick - Callback при клике на таб
 */

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface ServiceTab {
  id: string;
  label: string;
}

interface ServiceTabNavProps {
  tabs: ServiceTab[];
  activeTab: string;
  onTabClick: (tabId: string) => void;
  className?: string;
}

const ServiceTabNav = ({ tabs, activeTab, onTabClick, className }: ServiceTabNavProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  /**
   * Скролл активного таба в центр контейнера на мобильных
   * @note Автоматически вызывается при изменении activeTab
   */
  useEffect(() => {
    if (activeTabRef.current && containerRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeTab]);

  /**
   * Обработчик клика по табу
   * @param tabId - ID секции для скролла
   */
  const handleTabClick = (tabId: string) => {
    onTabClick(tabId);
    
    // Скролл к секции с учётом sticky элементов
    const section = document.getElementById(tabId);
    if (section) {
      const offsetTop = section.offsetTop - 140; // Header + tabs offset
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav 
      className={cn(
        "service-tabs sticky z-[900] bg-background border-b-2 border-primary/10",
        "top-[70px] md:top-[140px]", // Header only on mobile, Header + Main tabs on desktop
        className
      )}
      aria-label="Навигация по странице услуги"
    >
      <div className="container mx-auto px-4">
        <div 
          ref={containerRef}
          className="service-tabs-container flex gap-2 md:gap-4 overflow-x-auto py-3 scrollbar-hide"
          role="tablist"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              ref={activeTab === tab.id ? activeTabRef : null}
              onClick={() => handleTabClick(tab.id)}
              data-section={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={tab.id}
              className={cn(
                "service-tab px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-medium",
                "rounded-lg whitespace-nowrap transition-all duration-300",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default ServiceTabNav;
