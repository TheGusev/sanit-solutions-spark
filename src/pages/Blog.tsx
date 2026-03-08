import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import { allBlogArticles, blogCategories } from "@/data/blog";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, LayoutGrid, Bug, FlaskConical,
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
  const [visibleCount, setVisibleCount] = useState(30);

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

  const itemListSource = selectedCategory === "Все" ? allBlogArticles : filteredPosts;
  const itemListData = itemListSource.slice(0, 50).map((post, index) => ({
    name: post.title,
    url: `${BASE_URL}/blog/${post.slug}`,
    position: index + 1,
    description: post.excerpt,
    datePublished: post.date
  }));
  const itemListName = selectedCategory === "Все" 
    ? "Блог о дезинфекции и борьбе с вредителями" 
    : `Статьи блога: ${selectedCategory}`;
  const itemListDesc = selectedCategory === "Все"
    ? "Полезные статьи о дезинфекции, борьбе с вредителями и поддержании здоровой среды от экспертов ООО Санитарные Решения"
    : `Экспертные статьи в категории «${selectedCategory}» от специалистов ООО Санитарные Решения`;

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
        name={itemListName}
        description={itemListDesc}
        items={itemListData}
      />
      
      <Header />

      {/* Breadcrumbs */}
      <section className="pt-28 pb-4 px-2 md:px-4 border-b">
        <div className="container mx-auto max-w-6xl">
          <Breadcrumbs items={[{ label: "Блог" }]} />
        </div>
      </section>

      {/* Clean Hero — no background image */}
      <section className="py-8 md:py-12 px-3 md:px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-foreground">
            Полезные статьи
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
            Экспертные советы о дезинфекции и защите от вредителей.
            В блоге собрано <span className="font-medium text-foreground">{allBlogArticles.length} статей</span> от наших профессионалов.
          </p>
        </div>
      </section>

      {/* Category Book/Folder Cards */}
      <section className="py-6 md:py-8 px-3 md:px-4 border-b">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-3">
            {blogCategories.map((category) => {
              const catConfig = categoryIcons[category] || { icon: FileText, emoji: "📄" };
              const isActive = selectedCategory === category;
              const count = category === "Все" ? allBlogArticles.length : allBlogArticles.filter(p => p.category === category).length;
              
              return (
                <button
                  key={category}
                  onClick={() => { setSelectedCategory(category); setVisibleCount(30); }}
                  className={`
                    flex items-center gap-3 rounded-xl px-4 py-3.5 md:py-4 text-left
                    transition-colors duration-200 border
                    ${isActive
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-card text-card-foreground border-border hover:bg-muted'
                    }
                  `}
                >
                  <span className="text-xl md:text-2xl shrink-0">{catConfig.emoji}</span>
                  <div className="min-w-0">
                    <div className="text-sm md:text-base font-semibold truncate">{category}</div>
                    <div className={`text-xs ${isActive ? 'opacity-80' : 'text-muted-foreground'}`}>
                      {count} {count === 1 ? 'статья' : count < 5 ? 'статьи' : 'статей'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-8 md:py-16 px-2 md:px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col gap-3">
            {filteredPosts.slice(0, visibleCount).map((post) => {
              const isPopular = popularSlugs.includes(post.slug);
              
              return (
                <Link 
                  key={post.id} 
                  to={`/blog/${post.slug}`}
                  className="group"
                >
                  <div className="rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2.5 py-0.5 rounded-full border border-border text-muted-foreground font-medium">
                          {post.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {post.readTime}
                        </span>
                      </div>
                      {isPopular && (
                        <span className="text-xs text-primary font-medium flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> Популярное
                        </span>
                      )}
                    </div>
                    <h3 className="text-base md:text-lg font-bold leading-snug mb-1 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
          {visibleCount < filteredPosts.length && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" onClick={() => setVisibleCount(c => c + 30)}>
                Показать ещё ({filteredPosts.length - visibleCount} осталось)
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-3 md:px-4 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
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
