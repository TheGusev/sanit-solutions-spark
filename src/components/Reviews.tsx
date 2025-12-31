import { useState, useEffect } from 'react';
import { Star, MessageSquarePlus } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import ReviewFormModal from "@/components/ReviewFormModal";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  display_name: string;
  text: string;
  rating: number;
  object_type: string | null;
}

// Static reviews as fallback
const staticReviews = [
  {
    id: 'static-1',
    display_name: "Александр П.",
    object_type: "ООО 'СтройКомплекс'",
    text: "Заказывали дезинфекцию офисных помещений площадью 300 м². Работу выполнили быстро и качественно, все документы предоставили в срок. Рекомендуем!",
    rating: 5
  },
  {
    id: 'static-2',
    display_name: "Мария С.",
    object_type: "Квартира",
    text: "Обратилась с проблемой насекомых в квартире. Приехали в день обращения, всё объяснили и обработали. Через неделю повторно проверили результат. Очень довольна!",
    rating: 5
  },
  {
    id: 'static-3',
    display_name: "Дмитрий И.",
    object_type: "Склад",
    text: "Сотрудничаем на постоянной основе. Обрабатываем склад ежеквартально. Цены адекватные, качество на высоте. Всегда пунктуальны.",
    rating: 5
  },
  {
    id: 'static-4',
    display_name: "Елена К.",
    object_type: "Кафе 'Уют'",
    text: "Нужна была срочная обработка перед проверкой СЭС. Приехали в течение часа, все сделали профессионально. Спасибо за оперативность!",
    rating: 5
  }
];

const Reviews = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dbReviews, setDbReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('id, display_name, text, rating, object_type')
          .eq('is_approved', true)
          .order('created_at', { ascending: false })
          .limit(8);

        if (!error && data) {
          setDbReviews(data);
        }
      } catch (e) {
        console.error('Error fetching reviews:', e);
      }
    };

    fetchReviews();
  }, []);

  // Combine DB reviews with static ones, prioritizing DB reviews
  const allReviews = dbReviews.length > 0 
    ? [...dbReviews, ...staticReviews.slice(0, Math.max(0, 4 - dbReviews.length))]
    : staticReviews;

  return (
    <section id="reviews" className="py-10 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-up" className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Отзывы наших <span className="text-primary">клиентов</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Более 1000 довольных клиентов по всей Москве
          </p>
          <Button 
            onClick={() => setIsModalOpen(true)}
            variant="outline"
            className="gap-2"
          >
            <MessageSquarePlus className="h-4 w-4" />
            Оставить отзыв
          </Button>
        </AnimatedSection>

        <div ref={ref} className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto stagger-children ${isVisible ? 'visible' : ''}`}>
          {allReviews.slice(0, 4).map((review) => (
            <div
              key={review.id}
              className="bg-card p-4 md:p-6 lg:p-8 rounded-2xl shadow-sm hover-lift"
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
              </div>

              <p className="text-muted-foreground leading-relaxed">{review.text}</p>
            </div>
          ))}
        </div>
      </div>

      <ReviewFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
};

export default Reviews;
