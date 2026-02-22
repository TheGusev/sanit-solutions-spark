import { BookOpen } from "lucide-react";
import type { BlogArticleSource } from "@/data/blog/types";

interface SourcesListProps {
  sources: BlogArticleSource[];
}

const SourcesList = ({ sources }: SourcesListProps) => {
  if (!sources || sources.length === 0) return null;

  return (
    <section className="py-8 md:py-10 px-4 bg-muted/20 border-t">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-muted-foreground/70" />
          <h2 className="text-base md:text-lg font-semibold text-muted-foreground/70">
            Источники и нормативные документы
          </h2>
        </div>
        <ol className="space-y-1.5">
          {sources.map((source, i) => (
            <li key={i} className="text-muted-foreground/70 text-xs md:text-sm leading-relaxed">
              <span className="text-muted-foreground/50 mr-1">[{i + 1}]</span>
              <a
                href={source.url}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="text-primary/80 hover:text-primary hover:underline"
              >
                {source.title}
              </a>
              {source.publisher && (
                <span className="text-muted-foreground/50"> — {source.publisher}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default SourcesList;
