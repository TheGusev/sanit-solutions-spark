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

// Классы для активного состояния меню (смягчено для dark mode)
const getActiveMenuClass = (isActive: boolean) => {
  if (!isActive) return 'hover:bg-muted';
  return 'bg-russia-red/10 dark:bg-russia-red/5 text-russia-red dark:text-russia-red/90 border-l-4 border-russia-red';
};

const Header = ({ onCalculatorClick }: HeaderProps) => {
  const { context } = useTraffic();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
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
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          setScrollProgress(docHeight > 0 ? Math.min((window.scrollY / docHeight) * 100, 100) : 0);
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

  // 3-уровневая структура меню с подкатегориями вредителей
  const servicesMenu = [
    {
      title: "Дезинсекция",
      href: "/uslugi/dezinsekciya",
      subItems: [
        { title: "От тараканов", href: "/uslugi/dezinsekciya/tarakany" },
        { title: "От клопов", href: "/uslugi/dezinsekciya/klopy" },
        { title: "От муравьёв", href: "/uslugi/dezinsekciya/muravyi" },
        { title: "От блох", href: "/uslugi/dezinsekciya/blohi" },
        { title: "От моли", href: "/uslugi/dezinsekciya/mol" },
      ]
    },
    {
      title: "Дератизация",
      href: "/uslugi/deratizaciya",
      subItems: [
        { title: "От крыс", href: "/uslugi/deratizaciya/krysy" },
        { title: "От мышей", href: "/uslugi/deratizaciya/myshi" },
      ]
    },
    { title: "Дезинфекция", href: "/uslugi/dezinfekciya", subItems: [] },
    { title: "Озонирование", href: "/uslugi/ozonirovanie", subItems: [] },
    { title: "Дезодорация", href: "/uslugi/dezodoraciya", subItems: [] },
    { title: "Демеркуризация", href: "/uslugi/demerkurizaciya", subItems: [] },
    { title: "Борьба с кротами", href: "/uslugi/borba-s-krotami", subItems: [] },
    { title: "Обработка участков", href: "/uslugi/obrabotka-uchastkov", subItems: [] },
  ];

  const infoLinks = [
    { title: "По округам Москвы", href: "/uslugi/po-okrugam-moskvy" },
    { title: "По городам МО", href: "/moscow-oblast" },
    { title: "Районы Москвы", href: "/rajony" },
    { title: "Подготовка к дезинфекции", href: "/blog/kak-podgotovit-pomeshchenie" },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Обработчик клика для снятия :focus и закрытия меню
  const handleMenuItemClick = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLElement).blur();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Триколорная полоска */}
      <div className="absolute top-0 left-0 right-0 h-1 flex z-50">
        <div className="flex-1 bg-white dark:bg-white/90"></div>
        <div className="flex-1 bg-primary"></div>
        <div className="flex-1 bg-russia-red"></div>
      </div>
      {/* Прогресс-бар прокрутки */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] z-50">
        <div 
          className="h-full bg-gradient-to-r from-primary to-russia-red transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
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
          <nav className="hidden lg:flex flex-wrap items-center gap-x-4 xl:gap-x-6 gap-y-2">
            {isHomePage ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
                    Услуги
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-background border shadow-lg z-50 max-h-[70vh] overflow-y-auto">
                    {servicesMenu.map((service) => (
                      <div key={service.href}>
                        <DropdownMenuItem asChild>
                          <Link to={service.href} className="cursor-pointer font-medium">
                            {service.title}
                          </Link>
                        </DropdownMenuItem>
                        {service.subItems && service.subItems.length > 0 && (
                          <div className="pl-4 border-l-2 border-russia-red/30 ml-2 mb-1">
                            {service.subItems.map((sub) => (
                              <DropdownMenuItem key={sub.href} asChild>
                                <Link 
                                  to={sub.href} 
                                  className="cursor-pointer text-sm text-muted-foreground hover:text-russia-red"
                                >
                                  {sub.title}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <button onClick={handleCalculatorClick} className="text-sm font-medium hover:text-primary transition-colors">
                  Калькулятор
                </button>
                <button onClick={() => scrollToSection("reviews")} className="text-sm font-medium hover:text-primary transition-colors">
                  Отзывы
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
                    Информация
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-background border shadow-lg z-50">
                    {infoLinks.map((link) => (
                      <DropdownMenuItem key={link.href} asChild>
                        <Link to={link.href} className="cursor-pointer">
                          {link.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem asChild>
                      <button onClick={() => scrollToSection("faq")} className="w-full text-left cursor-pointer">
                        Частые вопросы
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                  <DropdownMenuContent align="start" className="bg-background border shadow-lg z-50 max-h-[70vh] overflow-y-auto">
                    {servicesMenu.map((service) => (
                      <div key={service.href}>
                        <DropdownMenuItem asChild>
                          <Link to={service.href} className="cursor-pointer font-medium">
                            {service.title}
                          </Link>
                        </DropdownMenuItem>
                        {service.subItems && service.subItems.length > 0 && (
                          <div className="pl-4 border-l-2 border-russia-red/30 ml-2 mb-1">
                            {service.subItems.map((sub) => (
                              <DropdownMenuItem key={sub.href} asChild>
                                <Link 
                                  to={sub.href} 
                                  className="cursor-pointer text-sm text-muted-foreground hover:text-russia-red"
                                >
                                  {sub.title}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
                    Информация
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-background border shadow-lg z-50">
                    {infoLinks.map((link) => (
                      <DropdownMenuItem key={link.href} asChild>
                        <Link to={link.href} className="cursor-pointer">
                          {link.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem asChild>
                      <Link to="/#faq" className="cursor-pointer">
                        Частые вопросы
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            <Link 
              to="/blog" 
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/blog' || location.pathname.startsWith('/blog/')
                  ? 'text-russia-red border-b-2 border-russia-red pb-0.5'
                  : 'hover:text-primary'
              }`}
            >
              Блог
            </Link>
            <Link 
              to="/contacts" 
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/contacts'
                  ? 'text-russia-red border-b-2 border-russia-red pb-0.5'
                  : 'hover:text-primary'
              }`}
            >
              Контакты
            </Link>
            <Link 
              to="/team" 
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/team'
                  ? 'text-russia-red border-b-2 border-russia-red pb-0.5'
                  : 'hover:text-primary'
              }`}
            >
              Команда
            </Link>
            {isScrolled && (
              <a 
                href="tel:84950181817"
                onClick={handlePhoneClick}
                className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm hover:bg-primary/20 transition-colors animate-fade-in"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="hidden lg:inline">8-495-018-18-17</span>
                <span className="lg:hidden">Позвонить</span>
              </a>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2">
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
          <div className="flex lg:hidden items-center gap-2">
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
                          <div className="space-y-1 pl-2">
                            {servicesMenu.map((service) => (
                              <div key={service.href}>
                                <SheetClose asChild>
                                  <Link
                                    to={service.href}
                                    className="block py-2.5 px-4 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
                                  >
                                    {service.title}
                                  </Link>
                                </SheetClose>
                                {service.subItems && service.subItems.length > 0 && (
                                  <div className="ml-4 border-l-2 border-russia-red/30 pl-2 space-y-1 mt-1">
                                    {service.subItems.map((sub) => (
                                      <SheetClose key={sub.href} asChild>
                                        <Link
                                          to={sub.href}
                                          className="block py-1.5 px-3 rounded-lg hover:bg-muted transition-colors text-xs text-muted-foreground hover:text-russia-red"
                                        >
                                          {sub.title}
                                        </Link>
                                      </SheetClose>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="info" className="border-none">
                        <AccordionTrigger className="py-3 px-4 rounded-lg hover:bg-muted hover:no-underline font-medium">
                          Информация
                        </AccordionTrigger>
                        <AccordionContent className="pb-0">
                          <div className="space-y-1 pl-4">
                            {infoLinks.map((link) => (
                              <SheetClose key={link.href} asChild>
                                <Link
                                  to={link.href}
                                  className="block py-2.5 px-4 rounded-lg hover:bg-muted transition-colors text-sm text-muted-foreground hover:text-foreground"
                                >
                                  {link.title}
                                </Link>
                              </SheetClose>
                            ))}
                            {isHomePage ? (
                              <button
                                onClick={() => {
                                  closeMobileMenu();
                                  scrollToSection("faq");
                                }}
                                className="block w-full text-left py-2.5 px-4 rounded-lg hover:bg-muted transition-colors text-sm text-muted-foreground hover:text-foreground"
                              >
                                Частые вопросы
                              </button>
                            ) : (
                              <SheetClose asChild>
                                <Link
                                  to="/#faq"
                                  className="block py-2.5 px-4 rounded-lg hover:bg-muted transition-colors text-sm text-muted-foreground hover:text-foreground"
                                >
                                  Частые вопросы
                                </Link>
                              </SheetClose>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    
                    <SheetClose asChild>
                      <Link 
                        to="/blog" 
                        onClick={handleMenuItemClick}
                        className={`block py-3 px-4 rounded-lg transition-colors font-medium focus:outline-none ${
                          getActiveMenuClass(location.pathname === '/blog' || location.pathname.startsWith('/blog/'))
                        }`}
                      >
                        Блог
                      </Link>
                    </SheetClose>
                    
                    <SheetClose asChild>
                      <Link 
                        to="/contacts" 
                        onClick={handleMenuItemClick}
                        className={`block py-3 px-4 rounded-lg transition-colors font-medium focus:outline-none ${
                          getActiveMenuClass(location.pathname === '/contacts')
                        }`}
                      >
                        Контакты
                      </Link>
                    </SheetClose>
                    
                    <SheetClose asChild>
                      <Link 
                        to="/team" 
                        onClick={handleMenuItemClick}
                        className={`block py-3 px-4 rounded-lg transition-colors font-medium focus:outline-none ${
                          getActiveMenuClass(location.pathname === '/team')
                        }`}
                      >
                        Команда
                      </Link>
                    </SheetClose>
                  </nav>
                  
                  {/* Mobile Menu Footer */}
                  <div className="p-4 border-t space-y-3">
                    <a 
                      href="tel:84950181817"
                      onClick={handlePhoneClick}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      8-495-018-18-17
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
