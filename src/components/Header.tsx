import { Button } from "@/components/ui/button";

const Header = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🧪</div>
            <div>
              <h1 className="text-xl font-bold text-primary">Санитарные Решения</h1>
              <p className="text-xs text-muted-foreground">Дезинфекция МСК • Юр.лица, ИП, физ.лица</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection("services")} className="text-sm font-medium hover:text-primary transition-colors">
              Услуги
            </button>
            <button onClick={() => scrollToSection("calculator")} className="text-sm font-medium hover:text-primary transition-colors">
              Калькулятор
            </button>
            <button onClick={() => scrollToSection("reviews")} className="text-sm font-medium hover:text-primary transition-colors">
              Отзывы
            </button>
            <button onClick={() => scrollToSection("contact")} className="text-sm font-medium hover:text-primary transition-colors">
              Контакты
            </button>
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
