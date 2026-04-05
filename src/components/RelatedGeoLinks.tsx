/**
 * Блок "Работаем по районам Москвы"
 * 6-8 top neighborhoods (только indexable Tier 1) + кнопка "Все районы →"
 * Опционально 2-3 города МО.
 */

import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getRelatedGeoLinks } from '@/lib/internalLinking';

interface RelatedGeoLinksProps {
  serviceSlug?: string;
  pestSlug?: string;
  title?: string;
  showMoscowRegion?: boolean;
}

export default function RelatedGeoLinks({
  serviceSlug,
  pestSlug,
  title = 'Работаем по районам Москвы',
  showMoscowRegion = true,
}: RelatedGeoLinksProps) {
  const allLinks = getRelatedGeoLinks(serviceSlug, pestSlug);

  // Separate Moscow neighborhoods from MO cities
  const moscowLinks = allLinks.filter(l => !l.url.startsWith('/moscow-oblast/'));
  const moLinks = showMoscowRegion ? allLinks.filter(l => l.url.startsWith('/moscow-oblast/')) : [];

  if (moscowLinks.length === 0) return null;

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-6">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold">{title}</h3>
        </div>

        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {moscowLinks.map((link) => (
            <Link
              key={link.url}
              to={link.url}
              className="px-4 py-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-full transition-colors text-sm font-medium"
            >
              {link.text}
            </Link>
          ))}
        </div>

        <div className="text-center mt-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/rajony/" className="text-primary">
              Все районы Москвы <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        {moLinks.length > 0 && (
          <div className="mt-6">
            <p className="text-center text-sm text-muted-foreground mb-3">Московская область</p>
            <div className="flex flex-wrap justify-center gap-3">
              {moLinks.map((link) => (
                <Link
                  key={link.url}
                  to={link.url}
                  className="px-4 py-2 bg-muted/50 hover:bg-muted rounded-full transition-colors text-sm"
                >
                  {link.text}
                </Link>
              ))}
            </div>
            <div className="text-center mt-3">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/moscow-oblast/" className="text-primary">
                  Все города МО <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
