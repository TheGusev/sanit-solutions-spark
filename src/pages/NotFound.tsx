import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Home, Bug, Mouse, Wind, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const popularServices = [
  {
    name: "Дезинфекция",
    url: "/uslugi/dezinfekciya/",
    price: "от 1 000 ₽",
    Icon: Shield,
  },
  {
    name: "Дезинсекция",
    url: "/uslugi/dezinsekciya/",
    price: "от 1 200 ₽",
    Icon: Bug,
  },
  {
    name: "Дератизация",
    url: "/uslugi/deratizaciya/",
    price: "от 1 400 ₽",
    Icon: Mouse,
  },
  {
    name: "Озонирование",
    url: "/uslugi/ozonirovanie/",
    price: "от 1 500 ₽",
    Icon: Wind,
  },
];

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);

    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);

    return () => {
      if (metaRobots.parentNode) {
        document.head.removeChild(metaRobots);
      }
    };
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>404 - Страница не найдена | Санитарные Решения</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center px-4 max-w-lg">
          <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
          <p className="mb-2 text-2xl font-semibold text-foreground">Страница не найдена</p>
          <p className="mb-8 text-muted-foreground">
            Возможно, она была удалена или перемещена
          </p>
          <Button asChild size="lg">
            <a href="/" className="inline-flex items-center gap-2">
              <Home className="h-5 w-5" />
              Вернуться на главную
            </a>
          </Button>

          {/* Блок популярных услуг */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-4">
              Возможно, вы искали:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {popularServices.map((service) => (
                <a
                  key={service.url}
                  href={service.url}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all text-left group"
                >
                  <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-background text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <service.Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {service.name}
                    </div>
                    <div className="text-xs text-primary font-medium">
                      {service.price}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Контакты */}
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              ООО «Санитарные Решения»
            </p>
            <a
              href="tel:+79069989888"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              📞 8 (906) 998-98-88
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
