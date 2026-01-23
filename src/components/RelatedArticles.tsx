import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { allBlogArticles, type BlogArticle } from "@/data/blog";
import { ArrowRight } from "lucide-react";

interface RelatedArticlesProps {
  currentPostId: number;
  category: string;
  tags?: string[];
  maxItems?: number;
}

/**
 * Алгоритм подбора связанных статей:
 * 1. Приоритет: статьи той же категории с общими тегами
 * 2. Вторичный: статьи той же категории без общих тегов
 * 3. Третичный: статьи других категорий с общими тегами
 * 4. Fallback: любые другие статьи
 */
const getRelatedPosts = (
  currentPostId: number,
  category: string,
  tags: string[] = [],
  maxItems: number = 3
): BlogArticle[] => {
  // Исключаем текущую статью
  const otherPosts = allBlogArticles.filter((p) => p.id !== currentPostId);
  
  if (otherPosts.length === 0) return [];

  // Функция для подсчёта общих тегов
  const countCommonTags = (postTags: string[] = []): number => {
    return postTags.filter((tag) => tags.includes(tag)).length;
  };

  // Сортировка по релевантности
  const scoredPosts = otherPosts.map((post) => {
    let score = 0;
    const commonTags = countCommonTags(post.tags);
    
    // Та же категория = +100 очков
    if (post.category === category) {
      score += 100;
    }
    
    // За каждый общий тег = +10 очков
    score += commonTags * 10;
    
    // Более новые статьи получают небольшой бонус
    const dateBonus = new Date(post.date).getTime() / 1000000000000;
    score += dateBonus;
    
    return { post, score, commonTags };
  });

  // Сортируем по убыванию score
  scoredPosts.sort((a, b) => b.score - a.score);

  return scoredPosts.slice(0, maxItems).map((item) => item.post);
};

const RelatedArticles = ({
  currentPostId,
  category,
  tags = [],
  maxItems = 3,
}: RelatedArticlesProps) => {
  const relatedPosts = getRelatedPosts(currentPostId, category, tags, maxItems);

  if (relatedPosts.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-4">
          Похожие статьи
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Читайте также материалы по теме для более глубокого понимания вопроса
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {relatedPosts.map((relatedPost) => {
            // Находим общие теги для отображения
            const commonTags = relatedPost.tags?.filter((tag) => tags.includes(tag)) || [];
            
            return (
              <Link
                key={relatedPost.id}
                to={`/blog/${relatedPost.slug}`}
                className="group"
                rel="related"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card">
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                        {relatedPost.category}
                      </span>
                      {commonTags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {relatedPost.readTime}
                      </span>
                      <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        Читать
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RelatedArticles;
