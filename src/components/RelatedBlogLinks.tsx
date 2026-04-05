/**
 * Блок "Полезные статьи" — 2-3 релевантные статьи (карточки).
 * Если на странице уже есть related articles block, не использовать этот.
 */

import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, BookOpen } from 'lucide-react';
import { getRelatedBlogLinks } from '@/lib/internalLinking';

interface RelatedBlogLinksProps {
  serviceSlug?: string;
  pestSlug?: string;
  title?: string;
}

export default function RelatedBlogLinks({ serviceSlug, pestSlug, title = 'Полезные статьи' }: RelatedBlogLinksProps) {
  const links = getRelatedBlogLinks(serviceSlug, pestSlug);

  if (links.length === 0) return null;

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-5">
          <BookOpen className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold">{title}</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {links.map((link) => (
            <Link key={link.url} to={link.url}>
              <Card className="h-full hover:shadow-md transition-all hover:-translate-y-0.5">
                <CardContent className="p-4 flex items-center justify-between gap-2">
                  <span className="text-sm font-medium line-clamp-2">{link.text}</span>
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
