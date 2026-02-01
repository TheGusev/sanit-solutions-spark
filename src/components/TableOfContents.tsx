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
    // Эмодзи в начале строк
    .replace(/^[✅❌⚠️📍🔴🟢🟡🎯💡📌🔒✨🛡️⭐🏆🔥📢📋]\s*/gm, '')
    
    // AI-вводные фразы в начале строк
    .replace(/^(Важно|Следует|Необходимо|Обратите внимание|Примечание|Стоит отметить|Нельзя не упомянуть):\s*/gim, '')
    .replace(/^(Рассмотрим подробнее|Давайте разберём|Итак|В данной статье|В этой статье|Начнём с того)[,:.]?\s*/gim, '')
    .replace(/^(Как уже упоминалось|Как было сказано|Как мы видим|Очевидно, что|Важно понимать, что)[,:.]?\s*/gim, '')
    
    // Переходные фразы AI в середине текста
    .replace(/(Таким образом|Подводя итог|В заключение|Резюмируя|Исходя из вышесказанного)[,:.]?\s*/gi, '')
    .replace(/(Безусловно|Несомненно|Очевидно|Конечно же|Естественно)[,:.]?\s*/gi, '')
    .replace(/(Следует отметить|Стоит подчеркнуть|Хотелось бы отметить)[,:.]?\s*/gi, '')
    
    // Избыточные усилители
    .replace(/\bочень\s+(важно|нужно|необходимо)\b/gi, '$1')
    .replace(/\bдостаточно\s+(легко|просто|быстро)\b/gi, '$1')
    .replace(/\bабсолютно\s+(необходимо|важно)\b/gi, 'необходимо')
    .replace(/\bкрайне\s+(важно|необходимо)\b/gi, '$1')
    
    // Формальные конструкции
    .replace(/представляется возможным/gi, 'можно')
    .replace(/является\s+(\w+)\s+решением/gi, '— $1 решение')
    .replace(/данн(ый|ая|ое|ые)\s+/gi, '')
    .replace(/вышеуказанн(ый|ая|ое|ые)\s+/gi, '')
    .replace(/нижеследующ(ий|ая|ее|ие)\s+/gi, '')
    
    // Канцеляризмы
    .replace(/в связи с тем, что/gi, 'так как')
    .replace(/в случае если/gi, 'если')
    .replace(/в настоящее время/gi, 'сейчас')
    .replace(/на сегодняшний день/gi, 'сейчас')
    .replace(/осуществлять\s+/gi, '')
    .replace(/производить\s+(обработку|уборку|очистку)/gi, '$1')
    
    // Двойные пробелы и лишние переносы
    .replace(/  +/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

// Process inline markdown (bold, italic, links, code)
const processInlineMarkdown = (text: string): string => {
  return text
    // Bold: **text** → <strong>text</strong>
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic: *text* → <em>text</em> (but not inside bold)
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
    // Links: [text](url) → <a href="url">text</a>
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
    // Inline code: `text` → <code>text</code>
    .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>');
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
  if (rows.length < 2) return rows.map(r => `<p>${processInlineMarkdown(r)}</p>`).join('');
  
  // Filter out separator row (|---|---|)
  const dataRows = rows.filter(row => !row.match(/^\|[\s-:|]+\|$/));
  if (dataRows.length === 0) return '';
  
  const headerCells = dataRows[0].split('|').filter(c => c.trim()).map(c => c.trim());
  const bodyRows = dataRows.slice(1);
  
  let html = '<div class="overflow-x-auto my-6"><table class="blog-table w-full border-collapse rounded-lg overflow-hidden">';
  html += '<thead><tr>';
  headerCells.forEach(cell => {
    html += `<th class="bg-primary text-primary-foreground px-4 py-3 text-left font-semibold text-sm">${processInlineMarkdown(cell)}</th>`;
  });
  html += '</tr></thead><tbody>';
  
  bodyRows.forEach((row, i) => {
    const cells = row.split('|').filter(c => c.trim()).map(c => c.trim());
    const bgClass = i % 2 === 0 ? 'bg-background' : 'bg-muted/30';
    html += `<tr class="${bgClass} hover:bg-muted/50 transition-colors">`;
    cells.forEach(cell => {
      html += `<td class="px-4 py-3 border-b border-border text-muted-foreground">${processInlineMarkdown(cell)}</td>`;
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
  let inBlockquote = false;
  let blockquoteLines: string[] = [];
  let inCallout = false;
  let calloutType = '';
  let calloutLines: string[] = [];
  
  const closeList = () => {
    if (inList) {
      result += listType === 'ul' ? '</ul>' : '</ol>';
      inList = false;
    }
  };
  
  const processBlockquote = () => {
    if (blockquoteLines.length > 0) {
      const processedLines = blockquoteLines.map(line => processInlineMarkdown(line));
      result += `<blockquote class="blog-quote">${processedLines.join('<br/>')}</blockquote>`;
      blockquoteLines = [];
    }
    inBlockquote = false;
  };
  
  const processCallout = () => {
    if (calloutLines.length > 0) {
      const icons: Record<string, string> = { tip: '💡', warning: '⚠️', info: 'ℹ️', danger: '🚨' };
      const icon = icons[calloutType] || 'ℹ️';
      const variantClass = calloutType === 'tip' ? 'callout-tip' : 
                           calloutType === 'warning' ? 'callout-warning' :
                           calloutType === 'danger' ? 'callout-danger' : 'callout-info';
      const processedContent = calloutLines.map(line => processInlineMarkdown(line)).join(' ');
      result += `<div class="blog-callout ${variantClass}"><span class="callout-icon">${icon}</span><div class="callout-content">${processedContent}</div></div>`;
      calloutLines = [];
    }
    inCallout = false;
    calloutType = '';
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Handle callout blocks (:::tip, :::warning, :::info, :::danger)
    if (trimmedLine.startsWith(':::')) {
      const type = trimmedLine.replace(':::', '').trim().toLowerCase();
      if (type && !inCallout) {
        closeList();
        if (inBlockquote) processBlockquote();
        inCallout = true;
        calloutType = type;
        calloutLines = [];
        continue;
      } else if (inCallout && !type) {
        processCallout();
        continue;
      }
    }
    
    if (inCallout) {
      calloutLines.push(trimmedLine);
      continue;
    }
    
    // Handle blockquotes (> text)
    if (trimmedLine.startsWith('> ')) {
      if (!inBlockquote) {
        closeList();
        if (inTable) {
          result += processTable(tableRows);
          inTable = false;
          tableRows = [];
        }
        inBlockquote = true;
        blockquoteLines = [];
      }
      blockquoteLines.push(trimmedLine.replace(/^>\s?/, ''));
      continue;
    }
    
    // End blockquote if line doesn't start with >
    if (inBlockquote && !trimmedLine.startsWith('>')) {
      processBlockquote();
    }
    
    // Handle table rows
    if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
      if (!inTable) {
        closeList();
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
      closeList();
      const title = line.replace('## ', '');
      const id = transliterate(title);
      result += `<h2 id="${id}">${processInlineMarkdown(title)}</h2>`;
    } else if (line.startsWith('### ')) {
      closeList();
      const title = line.replace('### ', '');
      const id = transliterate(title);
      result += `<h3 id="${id}">${processInlineMarkdown(title)}</h3>`;
    } else if (line.startsWith('#### ')) {
      closeList();
      const title = line.replace('#### ', '');
      result += `<p><strong>${processInlineMarkdown(title)}</strong></p>`;
    } else if (line.startsWith('**') && line.endsWith('**')) {
      closeList();
      result += `<p><strong>${line.replace(/\*\*/g, '')}</strong></p>`;
    } else if (line.startsWith('- ')) {
      // Unordered list
      if (!inList || listType !== 'ul') {
        if (inList) result += '</ol>';
        result += '<ul>';
        inList = true;
        listType = 'ul';
      }
      result += `<li>${processInlineMarkdown(line.replace('- ', ''))}</li>`;
    } else if (/^\d+\.\s/.test(line)) {
      // Ordered list
      if (!inList || listType !== 'ol') {
        if (inList) result += '</ul>';
        result += '<ol>';
        inList = true;
        listType = 'ol';
      }
      result += `<li>${processInlineMarkdown(line.replace(/^\d+\.\s/, ''))}</li>`;
    } else if (trimmedLine === '') {
      closeList();
    } else {
      closeList();
      result += `<p>${processInlineMarkdown(line)}</p>`;
    }
  }
  
  // Close any remaining structures
  if (inTable && tableRows.length > 0) {
    result += processTable(tableRows);
  }
  if (inList) {
    result += listType === 'ul' ? '</ul>' : '</ol>';
  }
  if (inBlockquote && blockquoteLines.length > 0) {
    processBlockquote();
  }
  if (inCallout && calloutLines.length > 0) {
    processCallout();
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
    <nav className={cn("p-4 rounded-lg bg-muted/30 border lg:max-h-none", className)}>
      <h4 className="font-semibold text-sm mb-3 text-foreground flex items-center">
        <span className="w-1 h-5 bg-russia-red rounded-full mr-2"></span>
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
                "text-sm text-left w-full transition-colors border-l-2 pl-3",
                activeId === id 
                  ? "text-russia-red font-medium border-russia-red" 
                  : "text-muted-foreground border-transparent hover:text-russia-red hover:border-russia-red/50"
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
