import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";

interface CitationBlockProps {
  source: string;
  quote: string;
  url?: string;
  className?: string;
}

const CitationBlock = ({ source, quote, url, className }: CitationBlockProps) => {
  return (
    <figure className={cn("my-6 md:my-8 mx-auto max-w-3xl", className)}>
      <blockquote
        cite={url}
        className="border-l-4 border-muted-foreground/30 dark:border-muted-foreground/50 bg-muted/40 rounded-r-lg px-5 py-4"
      >
        <div className="flex items-start gap-2 mb-2">
          <Scale className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
          <p className="italic text-foreground text-base leading-relaxed">
            «{quote}»
          </p>
        </div>
        <figcaption className="mt-3 text-sm text-muted-foreground">
          — <cite>{url ? <a href={url} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">{source}</a> : source}</cite>
        </figcaption>
      </blockquote>
    </figure>
  );
};

export default CitationBlock;
