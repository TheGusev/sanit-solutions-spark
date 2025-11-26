import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const BlogPreview = () => {
  const latestPosts = blogPosts.slice(0, 3);

  return (
    <section id="blog" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            📚 Полезные статьи
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Экспертные советы и рекомендации по дезинфекции и борьбе с вредителями
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {latestPosts.map((post, index) => (
            <Link 
              key={post.id} 
              to={`/blog/${post.slug}`}
              className="group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="text-6xl mb-4">{post.image}</div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                </CardHeader>
                <CardContent>
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
