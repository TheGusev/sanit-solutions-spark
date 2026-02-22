import { BookOpen } from "lucide-react";
import type { BlogArticleSource } from "@/data/blog/types";

interface SourcesListProps {
  sources: BlogArticleSource[];
}

const SourcesList = ({ sources }: SourcesListProps) => {
  if (!sources || sources.length === 0) return null;

  return (
    <section className="py-10 px-4 bg-muted/30">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            Источники и нормативные документы
          </h2>
        </div>
        <ol className="space-y-2 list-decimal list-inside">
          {sources.map((source, i) => (
            <li key={i} className="text-muted-foreground text-sm leading-relaxed">
              <a
                href={source.url}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="text-primary hover:underline"
              >
                {source.title}
              </a>
              {source.publisher && (
                <span className="text-muted-foreground/70"> — {source.publisher}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default SourcesList;
