import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { blogPosts } from '@/data/blogPosts';

const CardBlog = () => {
  // Get first 3 blog posts
  const latestPosts = blogPosts.slice(0, 3);

  return (
    <section
      id="blog"
      className="stacking-card"
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-8 md:mb-12 text-center">
          Полезные материалы
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {latestPosts.map((post) => {
            const Icon = post.image;
            return (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group bg-muted/30 hover:bg-muted/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Icon header */}
                <div className="h-32 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <Icon className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" />
                </div>
                
                <div className="p-5">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  
                  <span className="inline-flex items-center text-primary text-sm font-medium">
                    Читать
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/blog">
              Все статьи
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CardBlog;
