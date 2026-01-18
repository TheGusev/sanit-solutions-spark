import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  href?: string;
}

const tabs: Tab[] = [
  { id: "hero", label: "Главная" },
  { id: "services", label: "Услуги" },
  { id: "pricing", label: "Цены" },
  { id: "about", label: "О нас" },
  { id: "contacts", label: "Контакты" },
];

interface StickyTabNavProps {
  className?: string;
}

const StickyTabNav = ({ className }: StickyTabNavProps) => {
  const [activeTab, setActiveTab] = useState<string>("hero");
  const [isSticky, setIsSticky] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Intersection Observer for section tracking
  useEffect(() => {
    if (!isHomePage) return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
          setActiveTab(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.3,
      rootMargin: "-126px 0px -50% 0px", // Account for header + tabs
    });

    // Observe all sections
    tabs.forEach((tab) => {
      const section = document.getElementById(tab.id);
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [isHomePage]);

  // Scroll active tab into view on mobile
  useEffect(() => {
    const activeButton = tabRefs.current.get(activeTab);
    if (activeButton) {
      activeButton.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeTab]);

  // Check if nav should be sticky
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabClick = useCallback((tabId: string) => {
    const section = document.getElementById(tabId);
    if (section) {
      const headerHeight = 70;
      const tabNavHeight = 56;
      const offset = headerHeight + tabNavHeight;
      const elementPosition = section.getBoundingClientRect().top + window.scrollY;
      
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
      setActiveTab(tabId);
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, currentIndex: number) => {
      let newIndex = currentIndex;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        newIndex = (currentIndex + 1) % tabs.length;
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (e.key === "Home") {
        e.preventDefault();
        newIndex = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        newIndex = tabs.length - 1;
      }

      if (newIndex !== currentIndex) {
        const newTab = tabs[newIndex];
        tabRefs.current.get(newTab.id)?.focus();
        handleTabClick(newTab.id);
      }
    },
    [handleTabClick]
  );

  // For non-home pages, show navigation links instead
  if (!isHomePage) {
    return (
      <nav
        ref={navRef}
        className={cn(
          "sticky top-[var(--header-height)] z-40 bg-background border-b border-border transition-shadow duration-300",
          isSticky && "shadow-sm",
          className
        )}
        aria-label="Навигация по сайту"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center h-14 gap-1 overflow-x-auto scrollbar-hide">
            <Link
              to="/"
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              Главная
            </Link>
            <Link
              to="/blog"
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                location.pathname.startsWith("/blog")
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              Блог
            </Link>
            <Link
              to="/contacts"
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                location.pathname === "/contacts"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              Контакты
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      ref={navRef}
      className={cn(
        "sticky top-[var(--header-height)] z-40 bg-background border-b border-border transition-shadow duration-300",
        isSticky && "shadow-sm",
        className
      )}
      role="tablist"
      aria-label="Навигация по разделам"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center h-14 gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  if (el) tabRefs.current.set(tab.id, el);
                }}
                role="tab"
                aria-selected={isActive}
                aria-controls={tab.id}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleTabClick(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
                {/* Active indicator */}
                <span
                  className={cn(
                    "absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform transition-transform duration-300",
                    isActive ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default StickyTabNav;
