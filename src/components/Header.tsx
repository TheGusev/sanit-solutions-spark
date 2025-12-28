import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/ThemeToggle";
import { trackGoal } from "@/lib/analytics";
import { useTraffic } from "@/contexts/TrafficContext";

const Header = () => {
  const { context } = useTraffic();
  const [isScrolled, setIsScrolled] = useState(false);
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

  const services = [
    { title: "Дезинфекция", href: "/uslugi/dezinfekciya" },
    { title: "Дезинсекция", href: "/uslugi/dezinsekciya" },
    { title: "Дератизация", href: "/uslugi/deratizaciya" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/95 backdrop-blur-sm border-b border-border">
      <div 
        className={`h-full transition-transform duration-300 origin-top ${isScrolled ? 'scale-y-[0.875]' : 'scale-y-100'}`}
        style={{ willChange: 'transform' }}
      >
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-3">
            <Link to="/">
              <span className="text-base md:text-xl font-bold text-primary leading-tight block">Санитарные Решения</span>
              <p className="text-xs text-muted-foreground">Дезинфекция МСК и МО</p>
            </Link>
          </div>

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
                <button onClick={() => scrollToSection("calculator")} className="text-sm font-medium hover:text-primary transition-colors">
                  Калькулятор
                </button>
                <button onClick={() => scrollToSection("reviews")} className="text-sm font-medium hover:text-primary transition-colors">
                  Отзывы
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
                href="tel:+79939289488"
                onClick={handlePhoneClick}
                className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm hover:bg-primary/20 transition-colors animate-fade-in"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="hidden lg:inline">+7 (993) 928-94-88</span>
                <span className="lg:hidden">Позвонить</span>
              </a>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              onClick={() => scrollToSection("calculator")} 
              size="sm"
              className="bg-primary hover:bg-primary-dark text-primary-foreground font-semibold text-sm md:text-base px-3 md:px-4"
            >
              Рассчитать
            </Button>
          </div>
        </div>
      </div>
      </div>
    </header>
  );
};

export default Header;
