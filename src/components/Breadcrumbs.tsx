import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm text-muted-foreground">
      {/* Home link */}
      <Link 
        to="/" 
        className="flex items-center hover:text-primary transition-colors"
        aria-label="Главная страница"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {/* Separator after Home */}
      <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" aria-hidden="true" />
      
      {/* Dynamic breadcrumb items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} className="flex items-center">
            {item.href && !isLast ? (
              <Link 
                to={item.href} 
                className="hover:text-primary transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ) : (
              <span 
                className={`whitespace-nowrap ${isLast ? 'font-medium text-foreground' : ''}`}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
            
            {/* Separator between items (but not after last) */}
            {!isLast && (
              <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" aria-hidden="true" />
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;

