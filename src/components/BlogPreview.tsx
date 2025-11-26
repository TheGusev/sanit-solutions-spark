import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const BlogPreview = () => {
  const latestPosts = blogPosts.slice(0, 3);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section id="blog" className="py-10 md:py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Полезные статьи
            </h2>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Экспертные советы и рекомендации по дезинфекции и борьбе с вредителями
          </p>
        </div>

        <div ref={ref} className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {latestPosts.map((post, index) => (
            <Link 
              key={post.id} 
              to={`/blog/${post.slug}`}
              className={`group transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="p-4 md:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <span className="text-primary text-sm group-hover:underline">
                    Читать полностью →
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link to="/blog">
            <Button size="lg" variant="outline">
              Все статьи
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
