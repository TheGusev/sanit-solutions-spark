import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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

  const handlePhoneClick = () => {
    trackGoal("phone_click", {
      intent: context?.intent,
      variant: context?.variantId,
      source: "header",
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOrderClick = () => {
    if (onCalculatorClick) {
      onCalculatorClick();
    }
    setMobileMenuOpen(false);
  };

  const services = [
    { title: "Дезинфекция помещений", href: "/uslugi/dezinfekciya" },
    { title: "Дезинсекция", href: "/uslugi/dezinsekciya" },
    { title: "Дератизация", href: "/uslugi/deratizaciya" },
    { title: "Озонирование", href: "/uslugi/ozonirovanie" },
    { title: "Дезодорация", href: "/uslugi/dezodoraciya" },
    { title: "Санитарная сертификация", href: "/uslugi/sertifikaciya" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[1100] h-[var(--header-height)] bg-background/95 backdrop-blur-sm border-b border-border transition-shadow duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
      role="banner"
    >
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
            <span className="text-lg md:text-xl font-bold text-primary leading-tight block">
              Санитарные Решения
            </span>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Дезинфекция МСК и МО
            </p>
          </Link>

          {/* Desktop: Phone + CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+79069989888"
              onClick={handlePhoneClick}
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-5 h-5 text-primary" />
              <span className="font-semibold">+7 (906) 998-98-88</span>
            </a>

            <ThemeToggle />

            <Button
              onClick={handleOrderClick}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6"
            >
              Заказать звонок
            </Button>
          </div>

          {/* Mobile: Theme + Menu */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Открыть меню"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[350px] bg-background"
              >
                <SheetHeader>
                  <SheetTitle className="text-left text-primary">
                    Меню
                  </SheetTitle>
                </SheetHeader>

                <nav
                  className="flex flex-col gap-2 mt-6"
                  aria-label="Мобильная навигация"
                  role="navigation"
                >
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-3 px-4 text-base font-medium hover:bg-muted rounded-lg transition-colors"
                  >
                    Главная
                  </Link>

                  <div className="py-2">
                    <p className="px-4 text-sm font-semibold text-muted-foreground mb-2">
                      Услуги
                    </p>
                    {services.map((service) => (
                      <Link
                        key={service.href}
                        to={service.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2.5 px-4 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                      >
                        {service.title}
                      </Link>
                    ))}
                  </div>

                  <Link
                    to="/blog"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-3 px-4 text-base font-medium hover:bg-muted rounded-lg transition-colors"
                  >
                    Блог
                  </Link>
                  <Link
                    to="/contacts"
                    onClick={() => setMobileMenuOpen(false)}
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
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 py-3 px-4 text-base font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      +7 (906) 998-98-88
                    </a>

                    <Button
                      onClick={handleOrderClick}
                      className="w-full mt-3 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                    >
                      Заказать звонок
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
