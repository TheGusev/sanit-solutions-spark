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
import { blogPosts } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";

const BASE_URL = "https://goruslugimsk.ru";

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

  const headings = extractHeadings(post.content);
  const showToc = headings.length >= 3;

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{post.title} | Санитарные Решения</title>
        <meta name="description" content={post.excerpt} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href={`${BASE_URL}/blog/${post.slug}`} />
        <link rel="alternate" hrefLang="ru" href={`${BASE_URL}/blog/${post.slug}`} />
        <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}/blog/${post.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${BASE_URL}/blog/${post.slug}`} />
        <meta property="og:title" content={`${post.title} | Санитарные Решения`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content="https://storage.googleapis.com/msgsndr/TPScApsdHM0g97SZIF3E/media/67627bc8700fb0e19a0b3c10.jpeg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://storage.googleapis.com/msgsndr/TPScApsdHM0g97SZIF3E/media/67627bc8700fb0e19a0b3c10.jpeg" />
      </Helmet>

      {/* BlogPosting Schema.org */}
      <StructuredData 
        type="BlogPosting"
        post={{
          title: post.title,
          excerpt: post.excerpt,
          date: post.date,
          slug: post.slug
        }}
        baseUrl={BASE_URL}
      />
      
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
                    { ALLOWED_TAGS: ['h2', 'h3', 'p', 'strong', 'li', 'ul', 'ol', 'em', 'br'], ALLOWED_ATTR: ['id'] }
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