import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { BlogArticle } from "@/data/blog/types";

interface RelatedQueriesProps {
  articles: BlogArticle[];
}

const RelatedQueries = ({ articles }: RelatedQueriesProps) => {
  if (!articles.length) return null;

  return (
    <section className="px-4 pb-8">
      <div className="container mx-auto max-w-4xl">
        <div className="border rounded-lg p-5 bg-muted/20">
          <h3 className="text-base font-semibold text-foreground mb-3">
            Похожие вопросы
          </h3>
          <ul className="space-y-2">
            {articles.map(a => (
              <li key={a.slug}>
                <Link
                  to={`/blog/${a.slug}`}
                  className="flex items-center gap-2 text-sm text-primary hover:underline group"
                >
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  <span>{a.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default RelatedQueries;
