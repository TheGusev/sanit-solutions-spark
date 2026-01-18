/**
 * === CARD 1: ОПИСАНИЕ УСЛУГИ ===
 * Первая карточка страницы дезинфекции
 * Содержит H1, хлебные крошки, описание и ключевые факты
 * 
 * @section id="opisanie"
 * @seo H1 должен быть единственным на странице
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, ChevronRight } from 'lucide-react';
import { dezinfekciyaData } from '@/data/dezinfekciyaData';

interface CardDescriptionProps {
  onOrderClick: () => void;
}

const CardDescription = ({ onOrderClick }: CardDescriptionProps) => {
  const { seo, breadcrumbs, description } = dezinfekciyaData;

  return (
    <section 
      id="opisanie"
      className="service-card relative min-h-[80vh] flex items-center"
      aria-labelledby="service-h1"
    >
      {/* Background gradient overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--background) / 0.98) 0%, hsl(var(--primary) / 0.05) 100%)'
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        {/* Хлебные крошки */}
        <nav 
          className="flex items-center gap-2 text-sm text-muted-foreground mb-6 md:mb-8"
          aria-label="Хлебные крошки"
        >
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.href} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="w-4 h-4" aria-hidden="true" />}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-foreground font-medium" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link 
                  to={crumb.href} 
                  className="hover:text-primary transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* H1 - главный заголовок страницы */}
        <h1 
          id="service-h1"
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 md:mb-8 max-w-3xl"
        >
          {seo.h1}
        </h1>

        {/* Описание услуги */}
        <p className="text-lg md:text-xl text-muted-foreground mb-8 md:mb-12 max-w-2xl leading-relaxed">
          {description.text}
        </p>

        {/* Ключевые факты - 3 колонки */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12 max-w-3xl">
          {description.facts.map((fact, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-4 rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm"
            >
              <span className="text-2xl md:text-3xl" role="img" aria-hidden="true">
                {fact.icon}
              </span>
              <div>
                <h3 className="font-semibold text-foreground text-sm md:text-base">
                  {fact.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {fact.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA кнопки */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            size="lg" 
            onClick={onOrderClick}
            className="text-base md:text-lg px-6 md:px-8"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Заказать услугу
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            asChild
            className="text-base md:text-lg px-6 md:px-8"
          >
            <a href="tel:+79069989888">
              <Phone className="w-5 h-5 mr-2" />
              +7 (906) 998-98-88
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CardDescription;
