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

// Clean AI-generated content from obvious patterns
const cleanAIContent = (text: string): string => {
  return text
    // Remove emoji checkboxes at line start
    .replace(/^[✅❌⚠️📍🔴🟢🟡🎯💡📌]\s*/gm, '')
    // Remove "Важно:", "Следует:" etc at line start
    .replace(/^(Важно|Следует|Необходимо|Обратите внимание|Примечание):\s*/gim, '')
    // Remove "Рассмотрим подробнее", "Давайте разберём"
    .replace(/^(Рассмотрим подробнее|Давайте разберём|Итак)[:,]?\s*/gim, '')
    // Replace double spaces
    .replace(/  +/g, ' ');
};

export const extractHeadings = (content: string): TocItem[] => {
  const headings: TocItem[] = [];
  const cleanedContent = cleanAIContent(content);
  const lines = cleanedContent.split('\n');

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

// Process Markdown table rows into HTML
const processTable = (rows: string[]): string => {
  if (rows.length < 2) return rows.map(r => `<p>${r}</p>`).join('');
  
  // Filter out separator row (|---|---|)
  const dataRows = rows.filter(row => !row.match(/^\|[\s-:|]+\|$/));
  if (dataRows.length === 0) return '';
  
  const headerCells = dataRows[0].split('|').filter(c => c.trim()).map(c => c.trim());
  const bodyRows = dataRows.slice(1);
  
  let html = '<div class="overflow-x-auto my-6"><table class="blog-table w-full border-collapse rounded-lg overflow-hidden">';
  html += '<thead><tr>';
  headerCells.forEach(cell => {
    html += `<th class="bg-primary text-primary-foreground px-4 py-3 text-left font-semibold text-sm">${cell}</th>`;
  });
  html += '</tr></thead><tbody>';
  
  bodyRows.forEach((row, i) => {
    const cells = row.split('|').filter(c => c.trim()).map(c => c.trim());
    const bgClass = i % 2 === 0 ? 'bg-background' : 'bg-muted/30';
    html += `<tr class="${bgClass} hover:bg-muted/50 transition-colors">`;
    cells.forEach(cell => {
      html += `<td class="px-4 py-3 border-b border-border text-muted-foreground">${cell}</td>`;
    });
    html += '</tr>';
  });
  
  html += '</tbody></table></div>';
  return html;
};

export const generateContentWithIds = (content: string): string => {
  const cleanedContent = cleanAIContent(content);
  const lines = cleanedContent.split('\n');
  let result = '';
  let inTable = false;
  let tableRows: string[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' = 'ul';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Handle table rows
    if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
      if (!inTable) {
        // Close any open list
        if (inList) {
          result += listType === 'ul' ? '</ul>' : '</ol>';
          inList = false;
        }
        inTable = true;
        tableRows = [];
      }
      tableRows.push(trimmedLine);
      continue;
    }
    
    // End of table
    if (inTable && !trimmedLine.startsWith('|')) {
      result += processTable(tableRows);
      inTable = false;
      tableRows = [];
    }
    
    // Headers
    if (line.startsWith('## ')) {
      if (inList) {
        result += listType === 'ul' ? '</ul>' : '</ol>';
        inList = false;
      }
      const title = line.replace('## ', '');
      const id = transliterate(title);
      result += `<h2 id="${id}">${title}</h2>`;
    } else if (line.startsWith('### ')) {
      if (inList) {
        result += listType === 'ul' ? '</ul>' : '</ol>';
        inList = false;
      }
      const title = line.replace('### ', '');
      const id = transliterate(title);
      result += `<h3 id="${id}">${title}</h3>`;
    } else if (line.startsWith('**') && line.endsWith('**')) {
      if (inList) {
        result += listType === 'ul' ? '</ul>' : '</ol>';
        inList = false;
      }
      result += `<p><strong>${line.replace(/\*\*/g, '')}</strong></p>`;
    } else if (line.startsWith('- ')) {
      // Unordered list
      if (!inList || listType !== 'ul') {
        if (inList) result += '</ol>';
        result += '<ul>';
        inList = true;
        listType = 'ul';
      }
      result += `<li>${line.replace('- ', '')}</li>`;
    } else if (/^\d+\.\s/.test(line)) {
      // Ordered list
      if (!inList || listType !== 'ol') {
        if (inList) result += '</ul>';
        result += '<ol>';
        inList = true;
        listType = 'ol';
      }
      result += `<li>${line.replace(/^\d+\.\s/, '')}</li>`;
    } else if (trimmedLine === '') {
      if (inList) {
        result += listType === 'ul' ? '</ul>' : '</ol>';
        inList = false;
      }
    } else {
      if (inList) {
        result += listType === 'ul' ? '</ul>' : '</ol>';
        inList = false;
      }
      result += `<p>${line}</p>`;
    }
  }
  
  // Close any remaining structures
  if (inTable && tableRows.length > 0) {
    result += processTable(tableRows);
  }
  if (inList) {
    result += listType === 'ul' ? '</ul>' : '</ol>';
  }
  
  return result;
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
