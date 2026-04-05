/**
 * Блок "Смежные услуги" / "С какими проблемами ещё обращаются"
 * Показывает 3-6 релевантных карточек из того же кластера.
 * Exclude: noindex targets, current page, unrelated clusters.
 */

import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { getRelatedServices } from '@/lib/internalLinking';

interface RelatedServicesProps {
  serviceSlug: string;
  pestSlug?: string;
  title?: string;
}

export default function RelatedServices({ serviceSlug, pestSlug, title }: RelatedServicesProps) {
  const links = getRelatedServices(serviceSlug, pestSlug);

  if (links.length === 0) return null;

  const heading = title || (pestSlug ? 'С какими проблемами ещё обращаются' : 'Основные услуги');

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <h3 className="text-xl font-bold mb-6 text-center">{heading}</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {links.map((link) => (
            <Link key={link.url} to={link.url}>
              <Card className="h-full hover:shadow-md transition-all hover:-translate-y-0.5 hover:border-primary/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="font-medium text-sm">{link.text}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
