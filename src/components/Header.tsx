import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Beaker, Phone } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Beaker className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">Санитарные Решения</h1>
              <p className="text-xs text-muted-foreground">Дезинфекция МСК • Юр.лица, ИП, физ.лица</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {isHomePage ? (
              <>
                <button onClick={() => scrollToSection("services")} className="text-sm font-medium hover:text-primary transition-colors">
                  Услуги
                </button>
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
                <Link to="/#services" className="text-sm font-medium hover:text-primary transition-colors">
                  Услуги
                </Link>
              </>
            )}
            <Link to="/gallery" className="text-sm font-medium hover:text-primary transition-colors">
              Работы
            </Link>
            <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors">
              Блог
            </Link>
            {isHomePage && (
              <button onClick={() => scrollToSection("contact")} className="text-sm font-medium hover:text-primary transition-colors">
                Контакты
              </button>
            )}
            {isScrolled && (
              <a href="tel:+74951234567" className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors flex items-center gap-1 animate-fade-in">
                <Phone className="w-4 h-4" />
                +7 (495) 123-45-67
              </a>
            )}
          </nav>

          <Button
            onClick={() => scrollToSection("calculator")} 
            className="bg-primary hover:bg-primary-dark text-primary-foreground font-semibold"
          >
            Рассчитать
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
