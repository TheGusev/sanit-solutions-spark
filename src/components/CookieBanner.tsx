import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Показываем баннер через 2 секунды, если пользователь еще не дал согласие
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const accepted = localStorage.getItem('cookies-accepted');
        if (!accepted) {
          setIsVisible(true);
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleAccept = (all: boolean) => {
    setIsClosing(true);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('cookies-accepted', all ? 'all' : 'necessary');
        localStorage.setItem('cookies-accepted-date', new Date().toISOString());
      }
      setIsVisible(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4 
        bg-background/95 backdrop-blur-sm border-t border-border shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${isClosing ? 'translate-y-full' : 'translate-y-0'}`}
      role="dialog"
      aria-label="Уведомление о cookies"
    >
      <div className="container mx-auto max-w-4xl flex flex-row items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Cookie className="h-5 w-5 text-primary shrink-0 hidden sm:block" aria-hidden="true" />
          <p className="text-xs sm:text-sm text-muted-foreground">
            <span className="sm:hidden">Мы используем cookies.{' '}
              <Link to="/privacy" className="text-primary hover:underline font-medium">Подробнее</Link>
            </span>
            <span className="hidden sm:inline">
              Мы используем cookies для улучшения работы сайта и аналитики. 
              Продолжая использование сайта, вы соглашаетесь с нашей{' '}
              <Link to="/privacy" className="text-primary hover:underline font-medium">политикой конфиденциальности</Link>
              {' '}и{' '}
              <Link to="/terms" className="text-primary hover:underline font-medium">пользовательским соглашением</Link>.
            </span>
          </p>
        </div>
        <div className="flex gap-1.5 sm:gap-2 shrink-0">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleAccept(false)}
            className="whitespace-nowrap text-xs sm:text-sm h-7 sm:h-9 px-2 sm:px-3"
          >
            <span className="sm:hidden">Нет</span>
            <span className="hidden sm:inline">Только необходимые</span>
          </Button>
          <Button 
            size="sm"
            onClick={() => handleAccept(true)}
            className="whitespace-nowrap text-xs sm:text-sm h-7 sm:h-9 px-2 sm:px-3"
          >
            <span className="sm:hidden">ОК</span>
            <span className="hidden sm:inline">Принять все</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CookieBanner;
