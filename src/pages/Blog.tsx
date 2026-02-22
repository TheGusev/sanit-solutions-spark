import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import { allBlogArticles, blogCategories } from "@/data/blog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  BookOpen, Sparkles, TrendingUp, LayoutGrid, Bug, FlaskConical,
  FileText, Shield, Lightbulb, Scale, Mouse
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const BASE_URL = "https://goruslugimsk.ru";

// Category icon mapping
const categoryIcons: Record<string, { icon: LucideIcon; emoji: string }> = {
  "Все": { icon: LayoutGrid, emoji: "📋" },
  "Дезинфекция": { icon: FlaskConical, emoji: "🧪" },
  "Дезинсекция": { icon: Bug, emoji: "🪳" },
  "Дератизация": { icon: Mouse, emoji: "🐀" },
  "Насекомые": { icon: Bug, emoji: "🪳" },
  "Грызуны": { icon: Mouse, emoji: "🐀" },
  "Советы": { icon: Lightbulb, emoji: "💡" },
  "Законодательство": { icon: Scale, emoji: "📜" },
  "Препараты": { icon: FlaskConical, emoji: "🧴" },
  "Случаи из практики": { icon: FileText, emoji: "📋" },
  "Безопасность": { icon: Shield, emoji: "🛡️" },
};

// Top featured slugs — guides & legal articles shown first
const topFeaturedSlugs = [
  'vidy-dezinfekcii',
  'borba-s-tarakanami',
  'klopy-v-kvartire',
  'gryzuny-v-dome',
  'kak-podgotovit-pomeshchenie',
  'dezinfekciya-ofisa',
  'ozonirovaniye-pomeshcheniy',
  'sezonnost-vreditelej',
];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Все");

  const baseList = selectedCategory === "Все" 
    ? allBlogArticles 
    : allBlogArticles.filter(post => post.category === selectedCategory);

  const filteredPosts = [...baseList].sort((a, b) => {
    const aIdx = topFeaturedSlugs.indexOf(a.slug);
    const bIdx = topFeaturedSlugs.indexOf(b.slug);
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return 0;
  });

  const isNewArticle = (dateString: string) => {
    const articleDate = new Date(dateString);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return articleDate > thirtyDaysAgo;
  };

  const popularSlugs = allBlogArticles.slice(0, 5).map(a => a.slug);

  const itemListData = allBlogArticles.slice(0, 50).map((post, index) => ({
    name: post.title,
    url: `${BASE_URL}/blog/${post.slug}`,
    position: index + 1,
    description: post.excerpt,
    datePublished: post.date
  }));

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{`Блог о дезинфекции — ${allBlogArticles.length} статей | Санитарные Решения`}</title>
        <meta name="description" content="Полезные статьи о дезинфекции, борьбе с вредителями и поддержании здоровой среды. Экспертные советы от специалистов ООО Санитарные Решения." />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href="https://goruslugimsk.ru/blog/" />
        <link rel="alternate" hrefLang="ru" href="https://goruslugimsk.ru/blog/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goruslugimsk.ru/blog/" />
        <meta property="og:title" content="Блог о дезинфекции | Санитарные Решения" />
        <meta property="og:description" content="Полезные статьи о дезинфекции, борьбе с вредителями и поддержании здоровой среды." />
        <meta property="og:image" content="https://storage.googleapis.com/msgsndr/TPScApsdHM0g97SZIF3E/media/67627bc8700fb0e19a0b3c10.jpeg" />
        <meta property="og:site_name" content="Санитарные Решения" />
        <meta property="og:locale" content="ru_RU" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Блог о дезинфекции | Санитарные Решения" />
        <meta name="twitter:description" content="Полезные статьи о дезинфекции, борьбе с вредителями и поддержании здоровой среды." />
        <meta name="twitter:image" content="https://storage.googleapis.com/msgsndr/TPScApsdHM0g97SZIF3E/media/67627bc8700fb0e19a0b3c10.jpeg" />
        <link rel="alternate" hrefLang="x-default" href="https://goruslugimsk.ru/blog/" />
      </Helmet>

      <StructuredData 
        type="ItemList"
        name="Блог о дезинфекции и борьбе с вредителями"
        description="Полезные статьи о дезинфекции, борьбе с вредителями и поддержании здоровой среды от экспертов ООО Санитарные Решения"
        items={itemListData}
      />
      
      <Header />

      {/* Breadcrumbs */}
      <section className="pt-28 pb-4 px-4 border-b">
        <div className="container mx-auto max-w-6xl">
          <Breadcrumbs items={[{ label: "Блог" }]} />
        </div>
      </section>

      {/* Clean Hero — no background image */}
      <section className="py-8 md:py-12 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-foreground flex items-center justify-center gap-3">
            <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            Полезные статьи
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Экспертные советы о дезинфекции и борьбе с вредителями.
            <span className="font-medium text-foreground"> {allBlogArticles.length} статей</span> от профессионалов.
          </p>
          
          <div className="h-1 w-32 mx-auto flex rounded-full overflow-hidden mt-4">
            <div className="flex-1 bg-white border-y border-l border-border dark:border-transparent"></div>
            <div className="flex-1 bg-primary"></div>
            <div className="flex-1 bg-russia-red"></div>
          </div>
        </div>
      </section>

      {/* Category Swipe Carousel */}
      <section className="py-4 md:py-6 px-4 border-b">
        <div className="container mx-auto max-w-6xl">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 md:flex-wrap md:justify-center md:gap-3 md:overflow-visible md:pb-0">
            {blogCategories.map((category) => {
              const catConfig = categoryIcons[category] || { icon: FileText, emoji: "📄" };
              const IconComp = catConfig.icon;
              const count = category === "Все" ? allBlogArticles.length : allBlogArticles.filter(p => p.category === category).length;
              
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full text-xs md:text-sm px-3 md:px-4 py-2 h-auto whitespace-nowrap shrink-0 gap-1.5"
                >
                  <IconComp className="w-4 h-4" />
                  {category}
                  <span className="opacity-60 text-[10px] md:text-xs">({count})</span>
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-10 md:py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredPosts.map((post) => {
              const redCategories = ['Насекомые', 'Советы', 'Законодательство'];
              const gradientCategories = ['Грызуны', 'Случаи из практики'];
              
              const getCategoryClass = () => {
                if (redCategories.includes(post.category)) {
                  return "bg-russia-red/10 text-russia-red border border-russia-red/30";
                }
                if (gradientCategories.includes(post.category)) {
                  return "bg-gradient-to-r from-primary to-russia-red text-white border border-transparent";
                }
                return "bg-primary/10 text-primary border border-primary/30";
              };
              
              const isPopular = popularSlugs.includes(post.slug);
              const isNew = isNewArticle(post.date);
              
              return (
                <Link 
                  key={post.id} 
                  to={`/blog/${post.slug}`}
                  className="group"
                >
                  <Card className="h-full relative border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    {isNew && (
                      <span className="absolute top-3 right-3 bg-gradient-to-r from-russia-red to-secondary text-white text-[10px] px-2.5 py-1 rounded-full font-medium shadow-md z-10 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Новое
                      </span>
                    )}
                    {isPopular && !isNew && (
                      <span className="absolute top-3 right-3 bg-gradient-to-r from-primary to-russia-red text-white text-[10px] px-2.5 py-1 rounded-full font-medium shadow-md z-10 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Популярное
                      </span>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getCategoryClass()}`}>
                          {post.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold group-hover:text-primary transition-colors leading-snug">
                        {post.title}
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.date).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                        <Button variant="outline" size="sm" className="text-xs h-7 px-3" tabIndex={-1}>
                          Читать
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Нужна профессиональная помощь?
          </h2>
          <p className="text-base md:text-lg mb-8 opacity-90">
            Наши специалисты готовы проконсультировать вас и решить любую проблему
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => {
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.location.href = '/#contact';
              }
            }}
          >
            Получить консультацию
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
