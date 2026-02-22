import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { trackAIReferral, detectDarkAITraffic } from "@/lib/analytics";
import DOMPurify from "dompurify";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import TableOfContents, { generateContentWithIds, extractHeadings } from "@/components/TableOfContents";
import RelatedArticles from "@/components/RelatedArticles";
import InternalLinks from "@/components/InternalLinks";
import TLDRBlock from "@/components/blog/TLDRBlock";
import VisibleFAQ from "@/components/blog/VisibleFAQ";
import SourcesList from "@/components/blog/SourcesList";
import CompactCTA from "@/components/blog/CompactCTA";
import { getArticleBySlug } from "@/data/blog";
import { Button } from "@/components/ui/button";
import { SEO_CONFIG } from "@/lib/seo";
import { User, Clock, Calendar, List } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const post = slug ? getArticleBySlug(slug) : undefined;
  
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Санитарные Решения`;
      trackAIReferral();
      detectDarkAITraffic();
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

      {/* Clean Editorial Header — no background image */}
      <section className="py-8 md:py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs md:text-sm px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.date).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
            {post.readTime && (
              <span className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
            {post.title}
          </h1>

          {post.author && (
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{post.author}</p>
                <p className="text-xs text-muted-foreground">{post.authorRole}</p>
              </div>
            </div>
          )}

          {/* Триколор-акцент */}
          <div className="h-1 w-32 flex rounded-full overflow-hidden">
            <div className="flex-1 bg-white border-y border-l border-border dark:border-transparent"></div>
            <div className="flex-1 bg-primary"></div>
            <div className="flex-1 bg-russia-red"></div>
          </div>
        </div>
      </section>

      {/* Article Content with TOC */}
      <section className="pb-12 md:pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className={showToc ? "flex flex-col lg:grid lg:grid-cols-[250px_1fr] gap-8" : ""}>
            {showToc && (
              <aside className="hidden lg:block">
                <div className="sticky top-28">
                  <TableOfContents content={post.content} />
                </div>
              </aside>
            )}

            <div className="w-full max-w-full lg:max-w-3xl mx-auto lg:mx-0">
              {/* TL;DR inside content container */}
              {post.tldr && post.tldr.length > 0 && (
                <TLDRBlock items={post.tldr} />
              )}

              {/* Mobile TOC Accordion */}
              {showToc && (
                <div className="lg:hidden mb-6">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="toc" className="border rounded-lg bg-muted/30">
                      <AccordionTrigger className="px-4 py-3 text-sm font-medium min-h-[48px]">
                        <span className="flex items-center gap-2">
                          <List className="w-4 h-4 text-primary" />
                          Содержание
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-3">
                        <TableOfContents content={post.content} />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}

              <div 
                className="prose prose-lg max-w-none
                  prose-headings:text-foreground prose-headings:font-bold prose-headings:scroll-mt-28
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                  prose-p:text-muted-foreground prose-p:leading-[1.75] prose-p:mb-5
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-ul:text-muted-foreground prose-ul:my-4
                  prose-li:my-2
                  prose-table:overflow-x-auto
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
