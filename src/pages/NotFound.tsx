import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

// Паттерны старых WordPress URL для редиректа
const OLD_WORDPRESS_PATTERNS = ['/2022/', '/wp-admin', '/wp-content', '/wp-includes', '/feed/'];

const NotFound = () => {
  const location = useLocation();
  
  // Проверка на старый WordPress URL
  const isOldWordPress = OLD_WORDPRESS_PATTERNS.some(pattern => 
    location.pathname.startsWith(pattern)
  );

  useEffect(() => {
    // Редирект старых WordPress URL на главную для SEO
    if (isOldWordPress) {
      // Добавляем canonical перед редиректом
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = 'https://goruslugimsk.ru/';
      document.head.appendChild(link);
      
      // Редирект на главную
      window.location.replace('/');
      return;
    }

    console.error("404 Error: User attempted to access non-existent route:", location.pathname);

    // Add noindex meta tag for search engines
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);

    return () => {
      if (metaRobots.parentNode) {
        document.head.removeChild(metaRobots);
      }
    };
  }, [location.pathname, isOldWordPress]);

  // Не рендерим UI для старых WordPress URL (редирект в useEffect)
  if (isOldWordPress) return null;

  return (
    <>
      <Helmet>
        <title>404 - Страница не найдена | Санитарные Решения</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
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
    </>
  );
};

export default NotFound;
