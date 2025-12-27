import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);

    // Add noindex meta tag for search engines (важно для деиндексации старых WordPress страниц)
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
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center px-4">
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
      </div>
    </div>
  );
};

export default NotFound;
