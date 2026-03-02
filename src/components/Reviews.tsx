import { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, MessageCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ReviewFormModal from "@/components/ReviewFormModal";
import { supabase } from "@/lib/supabaseClient";
import { staticReviews } from "@/data/reviews";
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Review {
  id: string;
  display_name: string;
  text: string;
  rating: number;
  object_type: string | null;
  created_at: string | null;
}

const Reviews = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(staticReviews as Review[]);

  useEffect(() => {
    if (import.meta.env.SSR) return;
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('public_reviews')
          .select('id, display_name, text, rating, object_type, created_at')
          .limit(15);

        if (!error && data && data.length > 0) {
          setReviews(data as Review[]);
        }
      } catch (e) {
        console.error('Error fetching reviews:', e);
      }
    };

    fetchReviews();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'd MMMM yyyy', { locale: ru });
    } catch {
      return '';
    }
  };

  return (
    <section id="reviews" className="py-8 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="w-full flex items-center justify-between bg-card rounded-xl p-4 md:p-6 border border-border hover:bg-muted/50 transition-all shadow-sm hover:shadow-md group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <div className="text-left">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">
                  Отзывы наших клиентов
                </h2>
                <p className="text-muted-foreground text-sm md:text-base hidden sm:block">
                  {reviews.length > 0 ? `${reviews.length} отзывов от реальных клиентов` : 'Более 1000 довольных клиентов'}
                </p>
              </div>
            </div>
            <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-4 md:mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-card p-4 md:p-6 lg:p-8 rounded-2xl shadow-sm border border-border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                      {review.display_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold">{review.display_name}</h4>
                      <p className="text-sm text-muted-foreground">{review.object_type}</p>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                    {[...Array(5 - review.rating)].map((_, i) => (
                      <Star key={`empty-${i}`} className="w-5 h-5 text-muted" />
                    ))}
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-3">{review.text}</p>
                  
                  {review.created_at && (
                    <p className="text-xs text-muted-foreground/70">
                      {formatDate(review.created_at)}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-6 md:mt-8">
              <Button 
                onClick={() => setIsModalOpen(true)}
                variant="outline"
                className="gap-2"
              >
                <MessageSquarePlus className="h-4 w-4" />
                Оставить отзыв
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <ReviewFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
};

export default Reviews;
