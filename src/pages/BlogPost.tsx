import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { blogPosts } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const post = blogPosts.find((p) => p.slug === slug);
  
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Санитарные Решения`;
    }
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-muted-foreground mb-8">Статья не найдена</p>
            <Button onClick={() => navigate('/blog')}>
              Вернуться к статьям
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Breadcrumbs */}
      <section className="pt-28 pb-8 px-4 border-b">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              Главная
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/blog" className="hover:text-primary">
              Блог
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{post.title}</span>
          </div>
        </div>
      </section>

      {/* Article Header */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              {(() => {
                const Icon = post.image;
                return <Icon className="w-20 h-20 text-primary" />;
              })()}
            </div>
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-sm px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
                {post.category}
              </span>
              <span className="text-sm text-muted-foreground">
                {new Date(post.date).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
              <span className="text-sm text-muted-foreground">
                {post.readTime}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div 
            className="prose prose-lg max-w-none
              prose-headings:text-foreground prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
              prose-strong:text-foreground prose-strong:font-semibold
              prose-ul:text-muted-foreground prose-ul:my-4
              prose-li:my-2
            "
            dangerouslySetInnerHTML={{ 
              __html: post.content.split('\n').map(line => {
                if (line.startsWith('## ')) {
                  return `<h2>${line.replace('## ', '')}</h2>`;
                } else if (line.startsWith('**') && line.endsWith('**')) {
                  return `<p><strong>${line.replace(/\*\*/g, '')}</strong></p>`;
                } else if (line.startsWith('✅') || line.startsWith('❌') || line.startsWith('📍') || line.startsWith('⚠️')) {
                  return `<p>${line}</p>`;
                } else if (line.startsWith('- ')) {
                  return `<li>${line.replace('- ', '')}</li>`;
                } else if (line.trim() === '') {
                  return '';
                } else {
                  return `<p>${line}</p>`;
                }
              }).join('')
            }}
          />
        </div>
      </section>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Похожие статьи
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link 
                  key={relatedPost.id} 
                  to={`/blog/${relatedPost.slug}`}
                  className="group"
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <div className="w-full h-40 bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-2xl flex items-center justify-center mb-4">
                        {(() => {
                          const Icon = relatedPost.image;
                          return <Icon className="w-16 h-16 text-primary" />;
                        })()}
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium inline-block mb-3">
                        {relatedPost.category}
                      </span>
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Остались вопросы?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Закажите бесплатную консультацию — наши специалисты помогут решить вашу проблему
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => {
              window.location.href = '/#contact';
            }}
          >
            Заказать консультацию
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPost;
