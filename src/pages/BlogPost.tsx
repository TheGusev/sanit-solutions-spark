import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DOMPurify from "dompurify";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import TableOfContents, { generateContentWithIds, extractHeadings } from "@/components/TableOfContents";
import RelatedArticles from "@/components/RelatedArticles";
import InternalLinks from "@/components/InternalLinks";
import { getArticleBySlug } from "@/data/blog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO_CONFIG } from "@/lib/seo";

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const post = slug ? getArticleBySlug(slug) : undefined;
  
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

  const headings = extractHeadings(post.content);
  const showToc = headings.length >= 3;

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{`${post.title} | Санитарные Решения`}</title>
        <meta name="description" content={post.excerpt} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href={`${SEO_CONFIG.baseUrl}/blog/${post.slug}`} />
        <link rel="alternate" hrefLang="ru" href={`${SEO_CONFIG.baseUrl}/blog/${post.slug}`} />
        <link rel="alternate" hrefLang="x-default" href={`${SEO_CONFIG.baseUrl}/blog/${post.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${SEO_CONFIG.baseUrl}/blog/${post.slug}`} />
        <meta property="og:title" content={`${post.title} | ${SEO_CONFIG.companyName}`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={SEO_CONFIG.ogImage} />
        <meta property="og:locale" content={SEO_CONFIG.locale} />
        <meta property="og:site_name" content={SEO_CONFIG.companyName} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${post.title} | ${SEO_CONFIG.companyName}`} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={SEO_CONFIG.ogImage} />
      </Helmet>

      {/* Article Schema.org with enhanced metadata */}
      <StructuredData 
        type="Article"
        post={{
          title: post.title,
          excerpt: post.excerpt,
          date: post.date,
          slug: post.slug,
          category: post.category,
          keywords: post.tags,
          wordCount: post.wordCount || post.content?.split(/\s+/).length
        }}
        baseUrl={SEO_CONFIG.baseUrl}
      />
      
      {/* FAQPage Schema if article has FAQ */}
      {post.faq && post.faq.length > 0 && (
        <StructuredData 
          type="FAQPage"
          questions={post.faq}
        />
      )}
      
      <Header />

      {/* Breadcrumbs */}
      <section className="pt-28 pb-8 px-4 border-b">
        <div className="container mx-auto max-w-4xl">
          <Breadcrumbs 
            items={[
              { label: "Блог", href: "/blog" },
              { label: post.title }
            ]} 
          />
        </div>
      </section>

      {/* Article Header */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
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

      {/* Article Content with TOC */}
      <section className="pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className={showToc ? "grid lg:grid-cols-[250px_1fr] gap-8" : ""}>
            {/* Table of Contents - Desktop Sidebar */}
            {showToc && (
              <aside className="hidden lg:block">
                <div className="sticky top-28">
                  <TableOfContents content={post.content} />
                </div>
              </aside>
            )}

            {/* Main Content */}
            <div className="max-w-3xl mx-auto lg:mx-0">
              {/* Mobile TOC */}
              {showToc && (
                <div className="lg:hidden mb-8">
                  <TableOfContents content={post.content} />
                </div>
              )}

              <div 
                className="prose prose-lg max-w-none
                  prose-headings:text-foreground prose-headings:font-bold prose-headings:scroll-mt-28
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                  prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-ul:text-muted-foreground prose-ul:my-4
                  prose-li:my-2
                "
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(
                    generateContentWithIds(post.content),
                    { 
                      ALLOWED_TAGS: ['h2', 'h3', 'p', 'strong', 'li', 'ul', 'ol', 'em', 'br', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div'], 
                      ALLOWED_ATTR: ['id', 'class'] 
                    }
                  )
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <RelatedArticles
        currentPostId={post.id}
        category={post.category}
        tags={post.tags}
        maxItems={3}
      />

      {/* Related Services based on tags */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Связанные услуги
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: 'Дезинфекция', href: '/uslugi/dezinfekciya', price: 'от 1000₽', tags: ['дезинфекция', 'вирусы', 'бактерии'] },
              { title: 'Дезинсекция', href: '/uslugi/dezinsekciya', price: 'от 1200₽', tags: ['насекомые', 'тараканы', 'клопы', 'блохи'] },
              { title: 'Дератизация', href: '/uslugi/deratizaciya', price: 'от 1400₽', tags: ['грызуны', 'крысы', 'мыши'] },
              { title: 'Озонирование', href: '/uslugi/ozonirovanie', price: 'от 1500₽', tags: ['озон', 'запах', 'дезодорация'] },
              { title: 'Дезодорация', href: '/uslugi/dezodoraciya', price: 'от 1000₽', tags: ['запах', 'дезодорация'] },
            ]
              .filter(service => 
                post.tags?.some(tag => 
                  service.tags.some(st => tag.toLowerCase().includes(st) || st.includes(tag.toLowerCase()))
                )
              )
              .slice(0, 3)
              .map((service) => (
                <Link key={service.href} to={service.href}>
                  <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1">
                    <CardContent className="p-6 text-center">
                      <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                      <p className="text-primary font-medium">{service.price}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))
            }
          </div>
        </div>
      </section>

      {/* Internal Links for SEO */}
      <InternalLinks
        currentService={
          post.tags?.some(t => t.toLowerCase().includes('тараканы') || t.toLowerCase().includes('клопы') || t.toLowerCase().includes('блохи'))
            ? 'dezinsekciya'
            : post.tags?.some(t => t.toLowerCase().includes('крыс') || t.toLowerCase().includes('мыш'))
              ? 'deratizaciya'
              : undefined
        }
        title="Полезные ссылки"
        maxLinks={8}
      />

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
