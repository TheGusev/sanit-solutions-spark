import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { PageMetadata } from "@/lib/metadata";

interface Review {
  id: string;
  display_name: string;
  text: string;
  rating: number;
  object_type: string | null;
  created_at: string | null;
}

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from("public_reviews")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setReviews(data as Review[]);
      setLoading(false);
    };
    fetchReviews();
  }, []);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : "5.0";

  const metadata: PageMetadata = {
    title: `Отзывы клиентов — Санитарные Решения (${reviews.length} отзывов)`,
    description: `Реальные отзывы клиентов о дезинфекции, дезинсекции и дератизации. Средняя оценка ${avgRating} из 5. Читайте ${reviews.length} отзывов.`,
    canonical: "https://goruslugimsk.ru/otzyvy",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "Санитарные Решения",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: avgRating,
          reviewCount: String(reviews.length || 1),
          bestRating: "5",
          worstRating: "1",
        },
      },
    ],
  };

  return (
    <>
      <SEOHead metadata={metadata} pagePath="/otzyvy" />
      <Header />
      <main className="min-h-screen">
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="/">Главная</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>Отзывы</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <SectionHeading
              title="Отзывы наших клиентов"
              subtitle={`Средняя оценка ${avgRating} из 5 на основе ${reviews.length} отзывов`}
            />

            {/* Stats */}
            <div className="flex flex-wrap gap-6 justify-center my-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{avgRating}</div>
                <div className="flex gap-0.5 justify-center my-1">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`h-5 w-5 ${s <= Math.round(Number(avgRating)) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">средняя оценка</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{reviews.length}</div>
                <div className="text-sm text-muted-foreground mt-2">всего отзывов</div>
              </div>
            </div>

            {/* Reviews list */}
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Загрузка отзывов...</div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">Пока нет отзывов</div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {reviews.slice(0, visibleCount).map(r => (
                    <Card key={r.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className={`h-4 w-4 ${s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
                            ))}
                          </div>
                          {r.object_type && (
                            <span className="text-xs bg-muted px-2 py-0.5 rounded">{r.object_type}</span>
                          )}
                        </div>
                        <p className="text-sm text-foreground mb-3">{r.text}</p>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span className="font-medium">{r.display_name}</span>
                          {r.created_at && (
                            <span>{new Date(r.created_at).toLocaleDateString('ru-RU')}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {visibleCount < reviews.length && (
                  <div className="text-center mt-8">
                    <Button variant="outline" size="lg" onClick={() => setVisibleCount(c => c + 12)}>
                      Показать ещё ({reviews.length - visibleCount} осталось)
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ReviewsPage;
