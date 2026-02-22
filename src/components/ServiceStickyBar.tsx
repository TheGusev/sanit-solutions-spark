import { useState, useEffect } from 'react';
import { Phone, Calculator } from 'lucide-react';
import { trackGoal } from '@/lib/analytics';
import { SEO_CONFIG } from '@/lib/seo';

export default function ServiceStickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      const footer = document.querySelector('footer');
      const footerTop = footer ? footer.getBoundingClientRect().top : Infinity;
      setVisible(scrollPercent > 0.2 && footerTop > window.innerHeight);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  const handleCall = () => {
    trackGoal('service_sticky_call', { source: 'sticky_bar' });
  };

  const handlePrice = () => {
    trackGoal('service_sticky_price', { source: 'sticky_bar' });
    const target = document.getElementById('pricing-by-area') || document.getElementById('calculator');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-sm border-t border-border shadow-lg">
      <div className="flex gap-2 p-2">
        <a
          href={`tel:${SEO_CONFIG.phoneClean}`}
          onClick={handleCall}
          className="flex-1 flex items-center justify-center gap-2 h-12 rounded-lg bg-primary text-primary-foreground font-semibold text-base"
        >
          <Phone className="w-5 h-5" />
          Позвонить
        </a>
        <button
          onClick={handlePrice}
          className="flex-1 flex items-center justify-center gap-2 h-12 rounded-lg border border-primary text-primary font-semibold text-base bg-background"
        >
          <Calculator className="w-5 h-5" />
          Узнать цену
        </button>
      </div>
    </div>
  );
}
