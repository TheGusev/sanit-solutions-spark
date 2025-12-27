import { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

// Transliteration helper for generating IDs
const transliterate = (text: string): string => {
  const map: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
    'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', ' ': '-'
  };

  return text
    .toLowerCase()
    .split('')
    .map(char => map[char] || char)
    .join('')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const extractHeadings = (content: string): TocItem[] => {
  const headings: TocItem[] = [];
  const lines = content.split('\n');

  lines.forEach((line) => {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const title = match[2].trim();
      const id = transliterate(title);
      headings.push({ id, title, level });
    }
  });

  return headings;
};

export const generateContentWithIds = (content: string): string => {
  return content.split('\n').map(line => {
    if (line.startsWith('## ')) {
      const title = line.replace('## ', '');
      const id = transliterate(title);
      return `<h2 id="${id}">${title}</h2>`;
    } else if (line.startsWith('### ')) {
      const title = line.replace('### ', '');
      const id = transliterate(title);
      return `<h3 id="${id}">${title}</h3>`;
    } else if (line.startsWith('**') && line.endsWith('**')) {
      return `<p><strong>${line.replace(/\*\*/g, '')}</strong></p>`;
    } else if (line.startsWith('✅') || line.startsWith('❌') || line.startsWith('📍') || line.startsWith('⚠️')) {
      return `<p>${line}</p>`;
    } else if (line.startsWith('- ')) {
      return `<li>${line.replace('- ', '')}</li>`;
    } else if (line.trim() === '') {
      return '';
    } else {
      return `<p>${line}</p>`;
    }
  }).join('');
};

const TableOfContents = ({ content, className }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>('');
  
  const headings = useMemo(() => extractHeadings(content), [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className={cn("p-4 rounded-lg bg-muted/30 border", className)}>
      <h4 className="font-semibold text-sm mb-3 text-foreground">
        📑 Содержание
      </h4>
      <ul className="space-y-2">
        {headings.map(({ id, title, level }) => (
          <li 
            key={id}
            className={cn(
              level === 3 && "ml-4"
            )}
          >
            <button
              onClick={() => scrollToHeading(id)}
              className={cn(
                "text-sm text-left w-full hover:text-primary transition-colors",
                activeId === id 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground"
              )}
            >
              {title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
