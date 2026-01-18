import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, ChevronDown, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import ThemeToggle from "@/components/ThemeToggle";
import { trackGoal } from "@/lib/analytics";
import { useTraffic } from "@/contexts/TrafficContext";

interface HeaderProps {
  onCalculatorClick?: () => void;
}

const Header = ({ onCalculatorClick }: HeaderProps) => {
  const { context } = useTraffic();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  const handlePhoneClick = () => {
    trackGoal('phone_click', {
      intent: context?.intent,
      variant: context?.variantId,
      source: 'header'
    });
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 100);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCalculatorClick = () => {
    if (onCalculatorClick) {
      onCalculatorClick();
    } else {
      scrollToSection("calculator");
    }
  };

  const services = [
    { title: "Дезинфекция помещений", href: "/uslugi/dezinfekciya" },
    { title: "Дезинсекция (уничтожение насекомых)", href: "/uslugi/dezinsekciya" },
    { title: "Дератизация (борьба с грызунами)", href: "/uslugi/deratizaciya" },
    { title: "Озонирование", href: "/uslugi/ozonirovanie" },
    { title: "Дезодорация", href: "/uslugi/dezodoraciya" },
    { title: "Санитарная сертификация", href: "/uslugi/sertifikaciya" },
  ];

  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
    setServicesOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/95 backdrop-blur-sm border-b border-border">
      <div 
        className={`h-full transition-transform duration-300 origin-top ${isScrolled ? 'scale-y-[0.875]' : 'scale-y-100'}`}
        style={{ willChange: 'transform' }}
      >
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link to="/">
                <span className="text-base md:text-xl font-bold text-primary leading-tight block">Санитарные Решения</span>
                <p className="text-xs text-muted-foreground">Дезинфекция МСК и МО</p>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-wrap items-center gap-x-4 lg:gap-x-6 gap-y-2" aria-label="Основная навигация">
              <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                Главная
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
                  Услуги
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-background border shadow-lg z-50">
                  {services.map((service) => (
                    <DropdownMenuItem key={service.href} asChild>
                      <Link to={service.href} className="cursor-pointer">
                        {service.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors">
                Блог
              </Link>
              <Link to="/contacts" className="text-sm font-medium hover:text-primary transition-colors">
                Контакты
              </Link>
              
              {isScrolled && (
                <a 
                  href="tel:+79069989888"
                  onClick={handlePhoneClick}
                  className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm hover:bg-primary/20 transition-colors animate-fade-in"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden lg:inline">+7 (906) 998-98-88</span>
                  <span className="lg:hidden">Позвонить</span>
                </a>
              )}
            </nav>

            {/* Right side controls */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              
              {/* Desktop CTA */}
              <Button
                onClick={handleCalculatorClick} 
                size="sm"
                className="hidden md:inline-flex bg-primary hover:bg-primary-dark text-primary-foreground font-semibold text-sm md:text-base px-3 md:px-4"
              >
                Рассчитать
              </Button>

              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden" aria-label="Открыть меню">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-background">
                  <SheetHeader>
                    <SheetTitle className="text-left text-primary">Меню</SheetTitle>
                  </SheetHeader>
                  
                  <nav className="flex flex-col gap-2 mt-6" aria-label="Мобильная навигация">
                    <Link 
                      to="/" 
                      onClick={handleMobileNavClick}
                      className="py-3 px-4 text-base font-medium hover:bg-muted rounded-lg transition-colors"
                    >
                      Главная
                    </Link>
                    
                    <Collapsible open={servicesOpen} onOpenChange={setServicesOpen}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full py-3 px-4 text-base font-medium hover:bg-muted rounded-lg transition-colors">
                        Услуги
                        <ChevronDown className={`w-5 h-5 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-4">
                        {services.map((service) => (
                          <Link
                            key={service.href}
                            to={service.href}
                            onClick={handleMobileNavClick}
                            className="block py-2.5 px-4 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                          >
                            {service.title}
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                    
                    <Link 
                      to="/blog" 
                      onClick={handleMobileNavClick}
                      className="py-3 px-4 text-base font-medium hover:bg-muted rounded-lg transition-colors"
                    >
                      Блог
                    </Link>
                    <Link 
                      to="/contacts" 
                      onClick={handleMobileNavClick}
                      className="py-3 px-4 text-base font-medium hover:bg-muted rounded-lg transition-colors"
                    >
                      Контакты
                    </Link>
                    
                    {/* Mobile contact section */}
                    <div className="border-t border-border mt-4 pt-4">
                      <a 
                        href="tel:+79069989888"
                        onClick={() => {
                          handlePhoneClick();
                          handleMobileNavClick();
                        }}
                        className="flex items-center gap-3 py-3 px-4 text-base font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Phone className="w-5 h-5" />
                        +7 (906) 998-98-88
                      </a>
                      
                      <Button
                        onClick={() => {
                          handleCalculatorClick();
                          handleMobileNavClick();
                        }}
                        className="w-full mt-3 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold"
                      >
                        Рассчитать стоимость
                      </Button>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
