import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DOMPurify from "dompurify";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import HeroBackground from "@/components/HeroBackground";
import TableOfContents, { generateContentWithIds, extractHeadings } from "@/components/TableOfContents";
import RelatedArticles from "@/components/RelatedArticles";
import InternalLinks from "@/components/InternalLinks";
import TLDRBlock from "@/components/blog/TLDRBlock";
import VisibleFAQ from "@/components/blog/VisibleFAQ";
import SourcesList from "@/components/blog/SourcesList";
import CompactCTA from "@/components/blog/CompactCTA";
import { getArticleBySlug } from "@/data/blog";
import { getBlogCategoryImage } from "@/data/districtImages";
import { Button } from "@/components/ui/button";
import { SEO_CONFIG } from "@/lib/seo";
import { User } from "lucide-react";

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
  const hasFaq = post.faq && post.faq.length > 0;

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{`${post.title} | Санитарные Решения`}</title>
        <meta name="description" content={post.excerpt} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href={`${SEO_CONFIG.baseUrl}/blog/${post.slug}/`} />
        <link rel="alternate" hrefLang="ru" href={`${SEO_CONFIG.baseUrl}/blog/${post.slug}/`} />
        <link rel="alternate" hrefLang="x-default" href={`${SEO_CONFIG.baseUrl}/blog/${post.slug}/`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${SEO_CONFIG.baseUrl}/blog/${post.slug}/`} />
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

      {/* BlogPosting Schema.org with dateModified */}
      <StructuredData 
        type="Article"
        post={{
          title: post.title,
          excerpt: post.excerpt,
          date: post.date,
          slug: post.slug,
          author: post.author,
          authorRole: post.authorRole,
          dateModified: post.updatedAt,
          category: post.category,
          keywords: post.tags,
          wordCount: post.wordCount || post.content?.split(/\s+/).length
        }}
        baseUrl={SEO_CONFIG.baseUrl}
      />
      
      {/* FAQPage Schema — only when VisibleFAQ is rendered */}
      {hasFaq && (
        <StructuredData 
          type="FAQPage"
          questions={post.faq!}
        />
      )}
      
      <Header />

      {/* Breadcrumbs */}
      <section className="pt-28 pb-4 px-4 border-b">
        <div className="container mx-auto max-w-4xl">
          <Breadcrumbs 
            items={[
              { label: "Блог", href: "/blog" },
              { label: post.title }
            ]} 
          />
        </div>
      </section>

      {/* Article Header with Background */}
      <section className="relative py-12 px-4 overflow-hidden">
        <HeroBackground 
          image={getBlogCategoryImage(post.category)}
          blur={6}
          opacity={0.50}
          overlay="gradient"
          altText={`${post.category} - ${post.title}`}
        />
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-sm px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium backdrop-blur-sm">
                {post.category}
              </span>
              <span className="text-sm text-muted-foreground">
                {new Date(post.date).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground">
              {post.title}
            </h1>
            
            {post.author && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">{post.author}</p>
                  <p className="text-sm text-muted-foreground">{post.authorRole}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TL;DR Block */}
      {post.tldr && post.tldr.length > 0 && (
        <div className="container mx-auto max-w-4xl px-4">
          <TLDRBlock items={post.tldr} />
        </div>
      )}

      {/* Article Content with TOC */}
      <section className="pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className={showToc ? "flex flex-col lg:grid lg:grid-cols-[250px_1fr] gap-8" : ""}>
            {showToc && (
              <aside className="hidden lg:block">
                <div className="sticky top-28">
                  <TableOfContents content={post.content} />
                </div>
              </aside>
            )}

            <div className="w-full max-w-full lg:max-w-3xl mx-auto lg:mx-0 overflow-x-auto">
              {showToc && (
                <div className="lg:hidden mb-8">
                  <TableOfContents content={post.content} className="max-h-[40vh] overflow-y-auto" />
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
                      ALLOWED_TAGS: ['h2', 'h3', 'h4', 'p', 'strong', 'li', 'ul', 'ol', 'em', 'br', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'blockquote', 'span'], 
                      ALLOWED_ATTR: ['id', 'class'] 
                    }
                  )
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Visible FAQ */}
      {hasFaq && <VisibleFAQ faq={post.faq!} />}

      {/* Sources */}
      {post.sources && post.sources.length > 0 && (
        <SourcesList sources={post.sources} />
      )}

      {/* Related Articles */}
      <RelatedArticles
        currentPostId={post.id}
        category={post.category}
        tags={post.tags}
        maxItems={3}
      />

      {/* Compact CTA */}
      <CompactCTA />

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

      <Footer />
    </div>
  );
};

export default BlogPost;
