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
  SheetClose,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ThemeToggle from "@/components/ThemeToggle";
import { trackGoal } from "@/lib/analytics";
import { useTraffic } from "@/contexts/TrafficContext";

interface HeaderProps {
  onCalculatorClick?: () => void;
}

const Header = ({ onCalculatorClick }: HeaderProps) => {
  const { context } = useTraffic();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    setIsMobileMenuOpen(false);
    if (onCalculatorClick) {
      onCalculatorClick();
    } else {
      scrollToSection("calculator");
    }
  };

  const services = [
    { title: "Дезинсекция", href: "/uslugi/dezinsekciya" },
    { title: "Дезинфекция", href: "/uslugi/dezinfekciya" },
    { title: "Дератизация", href: "/uslugi/deratizaciya" },
    { title: "Озонирование", href: "/uslugi/ozonirovanie" },
    { title: "Дезодорация", href: "/uslugi/dezodoraciya" },
    { title: "Сертификация", href: "/uslugi/sertifikaciya" },
    { title: "По округам Москвы", href: "/uslugi/po-okrugam-moskvy" },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

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
          <nav className="hidden md:flex flex-wrap items-center gap-x-4 lg:gap-x-6 gap-y-2">
            {isHomePage ? (
              <>
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
                    <DropdownMenuItem asChild>
                      <button onClick={() => scrollToSection("services")} className="w-full text-left cursor-pointer text-muted-foreground">
                        Все услуги
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button onClick={handleCalculatorClick} className="text-sm font-medium hover:text-primary transition-colors">
                  Калькулятор
                </button>
                <button onClick={() => scrollToSection("reviews")} className="text-sm font-medium hover:text-primary transition-colors">
                  Отзывы
                </button>
                <button onClick={() => scrollToSection("faq")} className="text-sm font-medium hover:text-primary transition-colors">
                  Вопросы
                </button>
              </>
            ) : (
              <>
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
                <Link to="/#faq" className="text-sm font-medium hover:text-primary transition-colors">
                  Вопросы
                </Link>
              </>
            )}
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

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Button
              onClick={handleCalculatorClick} 
              size="sm"
              className="bg-primary hover:bg-primary-dark text-primary-foreground font-semibold text-sm md:text-base px-3 md:px-4"
            >
              Рассчитать
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Открыть меню</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle className="text-left">
                    <span className="text-primary font-bold">Санитарные Решения</span>
                    <p className="text-xs text-muted-foreground font-normal">Дезинфекция МСК и МО</p>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col h-[calc(100%-80px)]">
                  <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    {!isHomePage && (
                      <SheetClose asChild>
                        <Link 
                          to="/" 
                          className="block py-3 px-4 rounded-lg hover:bg-muted transition-colors font-medium"
                        >
                          Главная
                        </Link>
                      </SheetClose>
                    )}
                    
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="services" className="border-none">
                        <AccordionTrigger className="py-3 px-4 rounded-lg hover:bg-muted hover:no-underline font-medium">
                          Услуги
                        </AccordionTrigger>
                        <AccordionContent className="pb-0">
                          <div className="space-y-1 pl-4">
                            {services.map((service) => (
                              <SheetClose key={service.href} asChild>
                                <Link
                                  to={service.href}
                                  className="block py-2.5 px-4 rounded-lg hover:bg-muted transition-colors text-sm text-muted-foreground hover:text-foreground"
                                >
                                  {service.title}
                                </Link>
                              </SheetClose>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    
                    <SheetClose asChild>
                      <Link 
                        to="/blog" 
                        className="block py-3 px-4 rounded-lg hover:bg-muted transition-colors font-medium"
                      >
                        Блог
                      </Link>
                    </SheetClose>
                    
                    <SheetClose asChild>
                      <Link 
                        to="/contacts" 
                        className="block py-3 px-4 rounded-lg hover:bg-muted transition-colors font-medium"
                      >
                        Контакты
                      </Link>
                    </SheetClose>
                    
                    {isHomePage ? (
                      <button
                        onClick={() => {
                          closeMobileMenu();
                          scrollToSection("faq");
                        }}
                        className="block w-full text-left py-3 px-4 rounded-lg hover:bg-muted transition-colors font-medium"
                      >
                        Частые вопросы
                      </button>
                    ) : (
                      <SheetClose asChild>
                        <Link 
                          to="/#faq" 
                          className="block py-3 px-4 rounded-lg hover:bg-muted transition-colors font-medium"
                        >
                          Частые вопросы
                        </Link>
                      </SheetClose>
                    )}
                  </nav>
                  
                  {/* Mobile Menu Footer */}
                  <div className="p-4 border-t space-y-3">
                    <a 
                      href="tel:+79069989888"
                      onClick={handlePhoneClick}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      +7 (906) 998-98-88
                    </a>
                    <Button
                      onClick={handleCalculatorClick}
                      className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-semibold"
                    >
                      Рассчитать стоимость
                    </Button>
                  </div>
                </div>
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
