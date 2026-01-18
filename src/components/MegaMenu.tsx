/**
 * === MEGA MENU NAVIGATION ===
 * Компонент выпадающего меню для навигации по услугам
 * 
 * @description Открывается при hover на таб "Услуги"
 * @features 
 *  - Debounce открытия/закрытия (200ms/300ms)
 *  - 4 колонки с категориями услуг
 *  - Адаптивный дизайн (аккордеон на мобильных)
 *  - Плавные CSS анимации
 * 
 * @performance Использует CSS transitions вместо JS анимаций
 * @accessibility ARIA labels для screen readers
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, ChevronDown } from 'lucide-react';
import { megaMenuData, MegaMenuColumn, MegaMenuSection } from '@/data/megaMenuData';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

interface MegaMenuProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onLinkClick: () => void;
}

/**
 * Renders a single section within a column
 */
const MenuSection: React.FC<{ 
  section: MegaMenuSection; 
  onLinkClick: () => void;
}> = ({ section, onLinkClick }) => (
  <div className="mega-menu-section mb-4">
    <div className="mega-menu-section-title">
      <span>{section.icon}</span>
      <span>{section.title}</span>
    </div>
    <ul className="space-y-1">
      {section.links.map((link, idx) => (
        <li key={idx}>
          <Link
            to={link.url}
            onClick={onLinkClick}
            className={cn(
              "mega-menu-link",
              link.popular && "popular"
            )}
          >
            {link.text}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

/**
 * Renders a column with sections (Дезинфекция, Дезинсекция, Дератизация)
 */
const MenuColumnWithSections: React.FC<{ 
  column: MegaMenuColumn; 
  onLinkClick: () => void;
}> = ({ column, onLinkClick }) => (
  <div className="mega-menu-column">
    <h3>
      <span>{column.icon}</span>
      <span>{column.title}</span>
    </h3>
    {column.sections?.map((section, idx) => (
      <MenuSection key={idx} section={section} onLinkClick={onLinkClick} />
    ))}
  </div>
);

/**
 * Renders a column with service cards (Другие услуги)
 */
const MenuColumnWithServices: React.FC<{ 
  column: MegaMenuColumn; 
  onLinkClick: () => void;
}> = ({ column, onLinkClick }) => (
  <div className="mega-menu-column">
    <h3>
      <span>{column.icon}</span>
      <span>{column.title}</span>
    </h3>
    <div className="space-y-3">
      {column.services?.map((service, idx) => (
        <Link
          key={idx}
          to={service.url}
          onClick={onLinkClick}
          className="mega-menu-service-card"
        >
          <span className="text-2xl">{service.icon}</span>
          <div>
            <div className="font-medium text-foreground">{service.name}</div>
            <div className="text-sm text-muted-foreground">{service.description}</div>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

/**
 * Mobile accordion version of the menu
 */
const MobileMenu: React.FC<{ onLinkClick: () => void }> = ({ onLinkClick }) => {
  const [openColumn, setOpenColumn] = React.useState<string | null>(null);

  return (
    <div className="space-y-2">
      {megaMenuData.columns.map((column) => (
        <Collapsible
          key={column.id}
          open={openColumn === column.id}
          onOpenChange={(open) => setOpenColumn(open ? column.id : null)}
        >
          <CollapsibleTrigger className="w-full flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
            <span className="flex items-center gap-2 font-medium">
              <span>{column.icon}</span>
              <span>{column.title}</span>
            </span>
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform duration-200",
              openColumn === column.id && "rotate-180"
            )} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pl-4">
            {column.sections?.map((section, idx) => (
              <div key={idx} className="mb-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                  <span>{section.icon}</span>
                  <span>{section.title}</span>
                </div>
                <ul className="space-y-1">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link
                        to={link.url}
                        onClick={onLinkClick}
                        className={cn(
                          "block py-2 px-3 text-sm rounded-md hover:bg-primary/10 hover:text-primary transition-colors",
                          link.popular && "font-medium"
                        )}
                      >
                        {link.text}
                        {link.popular && <span className="ml-1">🔥</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {column.services?.map((service, idx) => (
              <Link
                key={idx}
                to={service.url}
                onClick={onLinkClick}
                className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-primary/10 transition-colors"
              >
                <span className="text-xl">{service.icon}</span>
                <div>
                  <div className="text-sm font-medium">{service.name}</div>
                  <div className="text-xs text-muted-foreground">{service.description}</div>
                </div>
              </Link>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};

/**
 * Promo banner at the bottom of the menu
 */
const PromoBanner: React.FC = () => (
  <div className="mega-menu-banner">
    <div className="flex items-center gap-4">
      <span className="text-2xl">🎁</span>
      <div>
        <h4 className="font-semibold text-lg">{megaMenuData.banner.title}</h4>
        <div className="flex items-center gap-2 text-white/90">
          <Phone className="h-4 w-4" />
          <span>{megaMenuData.banner.phone}</span>
        </div>
      </div>
    </div>
    <Button
      variant="secondary"
      className="bg-white text-primary hover:bg-white/90 font-semibold"
      asChild
    >
      <a href={`tel:${megaMenuData.banner.phone.replace(/[^\d+]/g, '')}`}>
        {megaMenuData.banner.buttonText}
      </a>
    </Button>
  </div>
);

/**
 * Main MegaMenu component
 */
const MegaMenu: React.FC<MegaMenuProps> = ({ 
  isOpen, 
  onMouseEnter, 
  onMouseLeave,
  onLinkClick 
}) => {
  const isMobile = useIsMobile();

  return (
    <div
      role="menu"
      aria-label="Меню услуг"
      aria-hidden={!isOpen}
      className={cn("mega-menu", isOpen && "active")}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="max-w-7xl mx-auto">
        {isMobile ? (
          <MobileMenu onLinkClick={onLinkClick} />
        ) : (
          <>
            {/* 4-column grid for desktop */}
            <div className="mega-menu-grid">
              {megaMenuData.columns.map((column) => (
                column.services ? (
                  <MenuColumnWithServices 
                    key={column.id} 
                    column={column} 
                    onLinkClick={onLinkClick}
                  />
                ) : (
                  <MenuColumnWithSections 
                    key={column.id} 
                    column={column} 
                    onLinkClick={onLinkClick}
                  />
                )
              ))}
            </div>
            
            {/* Promo banner */}
            <PromoBanner />
          </>
        )}
      </div>
    </div>
  );
};

export default MegaMenu;
