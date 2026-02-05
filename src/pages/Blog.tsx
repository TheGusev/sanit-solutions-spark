import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import HeroBackground from "@/components/HeroBackground";
import { allBlogArticles, blogCategories } from "@/data/blog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookOpen, Sparkles, TrendingUp } from "lucide-react";
const BASE_URL = "https://goruslugimsk.ru";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Все");

  const filteredPosts = selectedCategory === "Все" 
    ? allBlogArticles 
    : allBlogArticles.filter(post => post.category === selectedCategory);

  // Определяем "новые" статьи (менее 30 дней)
  const isNewArticle = (dateString: string) => {
    const articleDate = new Date(dateString);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return articleDate > thirtyDaysAgo;
  };

  // Топ-5 популярных статей (первые в списке)
  const popularSlugs = allBlogArticles.slice(0, 5).map(a => a.slug);

  // ItemList data for Schema.org
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
        <link rel="canonical" href="https://goruslugimsk.ru/blog" />
        <link rel="alternate" hrefLang="ru" href="https://goruslugimsk.ru/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goruslugimsk.ru/blog" />
        <meta property="og:title" content="Блог о дезинфекции | Санитарные Решения" />
        <meta property="og:description" content="Полезные статьи о дезинфекции, борьбе с вредителями и поддержании здоровой среды." />
        <meta property="og:image" content="https://storage.googleapis.com/msgsndr/TPScApsdHM0g97SZIF3E/media/67627bc8700fb0e19a0b3c10.jpeg" />
        <meta property="og:site_name" content="Санитарные Решения" />
        <meta property="og:locale" content="ru_RU" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Блог о дезинфекции | Санитарные Решения" />
        <meta name="twitter:description" content="Полезные статьи о дезинфекции, борьбе с вредителями и поддержании здоровой среды." />
        <meta name="twitter:image" content="https://storage.googleapis.com/msgsndr/TPScApsdHM0g97SZIF3E/media/67627bc8700fb0e19a0b3c10.jpeg" />
        <link rel="alternate" hrefLang="x-default" href="https://goruslugimsk.ru/blog" />
      </Helmet>

      {/* ItemList Schema.org for blog articles */}
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

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 overflow-hidden">
        {/* Фоновое изображение */}
        <HeroBackground 
          image="/images/neighborhoods/interior-park.png"
          blur={10}
          opacity={0.38}
          overlay="gradient"
          altText="Блог о дезинфекции и борьбе с вредителями"
        />
        
        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground flex items-center justify-center gap-3">
            <BookOpen className="w-10 h-10 md:w-12 md:h-12 text-primary" />
            Полезные статьи
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Экспертные советы о дезинфекции, борьбе с вредителями и поддержании здоровой среды в вашем доме или офисе. 
            <span className="font-medium text-foreground"> {allBlogArticles.length} статей</span> от профессионалов.
          </p>
          
          {/* Триколор-линия под заголовком */}
          <div className="h-1 w-48 mx-auto flex rounded-full overflow-hidden mt-6">
            <div className="flex-1 bg-white border-y border-l border-border dark:border-transparent"></div>
            <div className="flex-1 bg-primary"></div>
            <div className="flex-1 bg-russia-red"></div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 md:py-8 px-4 border-b">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-3 md:justify-center">
            {blogCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full text-xs md:text-sm px-2 md:px-4 py-1.5 md:py-2 h-auto whitespace-normal"
              >
                {category}
                {category !== "Все" && (
                  <span className="ml-1 opacity-70">
                    ({allBlogArticles.filter(p => p.category === category).length})
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => {
              // Категории с красным акцентом
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
                  <Card className="h-full relative hover:shadow-lg hover:shadow-russia-red/10 transition-all duration-300 hover:-translate-y-1">
                    {/* Бейджи */}
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
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getCategoryClass()}`}>
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
                      <p className="text-muted-foreground mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {new Date(post.date).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="text-russia-red group-hover:underline">
                          Читать →
                        </span>
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
      <section className="py-16 px-4 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Нужна профессиональная помощь?
          </h2>
          <p className="text-lg mb-8 opacity-90">
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
