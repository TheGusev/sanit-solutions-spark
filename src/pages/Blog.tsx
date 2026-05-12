import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RelatedServices from "@/components/RelatedServices";
import RelatedGeoLinks from "@/components/RelatedGeoLinks";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import { allBlogArticles, blogCategories } from "@/data/blog";
import { Button } from "@/components/ui/button";
import { 
  FolderOpen, Bug, FlaskConical,
  ShieldCheck, Lightbulb, Scale, Mouse, Clock, Briefcase,
  FileText
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const BASE_URL = "https://goruslugimsk.ru";

const categoryIcons: Record<string, LucideIcon> = {
  "Все": FolderOpen,
  "Дезинфекция": ShieldCheck,
  "Дезинсекция": Bug,
  "Дератизация": Mouse,
  "Советы": Lightbulb,
  "Законы": Scale,
  "Препараты": FlaskConical,
  "Кейсы": Briefcase,
};

type SortMode = 'default' | 'newest' | 'popular';

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

const popularSlugs = allBlogArticles.slice(0, 5).map(a => a.slug);

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Все");
  const [visibleCount, setVisibleCount] = useState(10);
  const [sortBy, setSortBy] = useState<SortMode>('default');
  const sortRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset visible count when sort changes
  useEffect(() => {
    setVisibleCount(10);
  }, [sortBy]);

  const filteredPosts = useMemo(() => {
    const baseList = selectedCategory === "Все" 
      ? allBlogArticles 
      : allBlogArticles.filter(post => post.category === selectedCategory);

    return [...baseList].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'popular') {
        const aPopular = popularSlugs.includes(a.slug) ? 0 : 1;
        const bPopular = popularSlugs.includes(b.slug) ? 0 : 1;
        return aPopular - bPopular;
      }
      const aIdx = topFeaturedSlugs.indexOf(a.slug);
      const bIdx = topFeaturedSlugs.indexOf(b.slug);
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
      return 0;
    });
  }, [selectedCategory, sortBy]);

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

  const sortOptions: { key: SortMode; label: string }[] = [
    { key: 'default', label: 'По умолчанию' },
    { key: 'newest', label: 'Сначала новые' },
    { key: 'popular', label: 'Популярные' },
  ];

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
      <section className="pt-28 pb-3 px-3 md:px-4 md:border-b">
        <div className="container mx-auto max-w-6xl">
          <Breadcrumbs items={[{ label: "Блог" }]} />
        </div>
      </section>

      {/* Hero */}
      <section className="pt-2 pb-6 md:py-12 px-3 md:px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05] mb-3 text-foreground">
            Полезные статьи
          </h1>
          <p className="text-[15px] md:text-lg leading-[1.45] text-muted-foreground max-w-2xl">
            Экспертные советы о дезинфекции и защите от вредителей.
            В блоге собрано <span className="font-medium text-foreground">{allBlogArticles.length} статей</span> от наших профессионалов.
          </p>
        </div>
      </section>

      {/* Category Folder Cards */}
      <section className="py-4 md:py-8 px-3 md:px-4 md:border-b md:border-border">
        <div className="container mx-auto max-w-6xl">
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-4 md:gap-x-4 md:gap-y-6"
            role="tablist"
            aria-label="Категории статей"
          >
            {blogCategories.map((category) => {
              const IconComp = categoryIcons[category] || FileText;
              const isActive = selectedCategory === category;
              const count = category === "Все"
                ? allBlogArticles.length
                : allBlogArticles.filter(p => p.category === category).length;
              
              return (
                <button
                  key={category}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => { setSelectedCategory(category); setVisibleCount(30); setTimeout(() => sortRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100); }}
                  className={`
                    folder-card flex items-center gap-2.5 px-4 py-3.5 text-left cursor-pointer
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                    ${isActive ? 'folder-card--active' : 'folder-card--inactive'}
                  `}
                >
                  <IconComp className="shrink-0 opacity-95" size={18} />
                  <span className="text-[15px] md:text-base font-semibold leading-snug line-clamp-1">
                    {category} <span className="opacity-70 font-medium">({count})</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sort Controls — segmented pills */}
      <section ref={sortRef} className="py-3 md:py-4 px-3 md:px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-0.5 bg-muted/40 dark:bg-[hsl(240,10%,16%)] dark:border dark:border-border/50 rounded-xl p-1">
            {sortOptions.map(opt => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                aria-label={`Сортировка: ${opt.label}`}
                className={`text-sm px-3.5 py-1.5 rounded-lg transition-all duration-150 font-medium
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
                  ${sortBy === opt.key
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground dark:hover:bg-white/5'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts — document cards */}
      <section className="pt-2 pb-8 md:py-16 px-3 md:px-4">
        <div className="container mx-auto max-w-6xl">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="mx-auto mb-4 text-muted-foreground/40" size={48} />
              <p className="text-lg text-muted-foreground">Нет статей в этой категории</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredPosts.slice(0, visibleCount).map((post, idx) => {
                const isPopular = popularSlugs.includes(post.slug);
                const isFeatured = idx === 0;
                const ThumbIcon = categoryIcons[post.category] || FileText;

                return (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group"
                  >
                    <div className="rounded-2xl bg-card dark:bg-[hsl(240,8%,17%)] p-4 md:p-5 ring-1 ring-border/60 dark:ring-white/[0.04] dark:shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition-all duration-200 hover:ring-border dark:hover:ring-white/[0.08] hover:-translate-y-0.5">
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className={`text-[11px] md:text-xs px-2.5 py-1 rounded-full font-semibold ${
                            isFeatured
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-foreground/[0.06] dark:bg-white/[0.06] text-foreground/85'
                          }`}>
                            {post.category}
                          </span>
                          <span className="text-[12px] text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {post.readTime}
                          </span>
                        </div>
                        {isPopular && (
                          <span className="text-[12px] text-muted-foreground/80 font-normal">
                            Популярное
                          </span>
                        )}
                      </div>
                      <div className={isFeatured ? "flex items-start gap-3" : ""}>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[15.5px] md:text-lg font-bold leading-[1.3] mb-1.5 group-hover:text-primary transition-colors line-clamp-3">
                            {post.title}
                          </h3>
                          <p className="text-[13px] md:text-sm leading-[1.5] text-muted-foreground/85 line-clamp-3">
                            {post.excerpt}
                          </p>
                        </div>
                        {isFeatured && (
                          <div className="shrink-0 mt-0.5 w-[68px] h-[68px] rounded-xl bg-gradient-to-br from-primary/25 to-primary/5 flex items-center justify-center ring-1 ring-primary/15">
                            <ThumbIcon className="w-7 h-7 text-primary/80" />
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
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

      <RelatedServices serviceSlug="dezinsekciya" title="Наши услуги" />
      <RelatedGeoLinks title="Работаем по всей Москве" />

      <Footer />
    </div>
  );
};

export default Blog;
