/**
 * === RELATED PAGES COMPONENT ===
 * Блок связанных страниц для внутренней перелинковки
 */

import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getRelatedPages } from '@/lib/seo';

interface RelatedPagesProps {
  currentSlug: string;
  title?: string;
  className?: string;
}

export function RelatedPages({ currentSlug, title = 'Смотрите также:', className = '' }: RelatedPagesProps) {
  const pages = getRelatedPages(currentSlug);
  
  if (pages.length === 0) return null;
  
  return (
    <div className={`bg-muted/30 rounded-xl p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="grid gap-3">
        {pages.map((page, idx) => (
          <Link
            key={idx}
            to={page.url}
            className="flex items-center justify-between p-3 bg-card rounded-lg border hover:border-primary transition-colors group"
          >
            <div>
              <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                {page.title}
              </span>
              {page.description && (
                <p className="text-sm text-muted-foreground">{page.description}</p>
              )}
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RelatedPages;
