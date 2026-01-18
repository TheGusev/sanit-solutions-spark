import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, User, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface Review {
  id: string;
  display_name: string;
  text: string;
  rating: number;
  created_at: string;
  object_type?: string;
}

const fallbackReviews: Review[] = [
  {
    id: '1',
    display_name: 'Александр П.',
    text: 'Заказывали дезинфекцию офисных помещений площадью 300 м². Работу выполнили быстро и качественно. Специалисты приехали в назначенное время, всё объяснили.',
    rating: 5,
    created_at: '2025-01-15',
    object_type: 'ООО "СтройКомплекс"',
  },
  {
    id: '2',
    display_name: 'Мария С.',
    text: 'Обратились по поводу тараканов в квартире. Уже после первой обработки насекомые пропали. Прошло 3 месяца — проблема не вернулась. Рекомендую!',
    rating: 5,
    created_at: '2025-01-10',
  },
  {
    id: '3',
    display_name: 'Игорь В.',
    text: 'Профессиональная работа! Выезд в тот же день, вежливые специалисты, все документы оформили. Гарантию дали на год.',
    rating: 5,
    created_at: '2025-01-05',
  },
  {
    id: '4',
    display_name: 'Елена К.',
    text: 'Заказывала озонирование после ремонта. Запах краски полностью исчез. Цена адекватная, работа быстрая.',
    rating: 4,
    created_at: '2025-01-02',
  },
];

interface CardReviewsProps {
  onReviewClick?: () => void;
}

const CardReviews = ({ onReviewClick }: CardReviewsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews] = useState<Review[]>(fallbackReviews);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(4);

      if (data && data.length > 0 && !error) {
        setReviews(data as Review[]);
      }
    };

    fetchReviews();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const currentReview = reviews[currentIndex];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <section
      id="reviews"
      className="stacking-card"
      style={{ '--card-index': 6 } as React.CSSProperties}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-8 md:mb-12 text-center">
          Отзывы клиентов
        </h2>
        
        {/* Slider */}
        <div className="relative">
          {/* Navigation arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors z-10"
            aria-label="Предыдущий отзыв"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors z-10"
            aria-label="Следующий отзыв"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
          
          {/* Review card */}
          <div className="bg-muted/30 rounded-2xl p-6 md:p-8 mx-8 md:mx-0">
            <div className="flex items-start gap-4 mb-4">
              {/* Avatar placeholder */}
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-7 h-7 text-primary" />
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground">
                  {currentReview.display_name}
                </h3>
                {currentReview.object_type && (
                  <p className="text-sm text-muted-foreground">
                    {currentReview.object_type}
                  </p>
                )}
                
                {/* Stars */}
                <div className="flex gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= currentReview.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <blockquote className="text-foreground text-lg leading-relaxed mb-4">
              "{currentReview.text}"
            </blockquote>
            
            <p className="text-sm text-muted-foreground">
              {formatDate(currentReview.created_at)}
            </p>
          </div>
          
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
                aria-label={`Отзыв ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* CTA */}
        {onReviewClick && (
          <div className="text-center mt-8">
            <Button onClick={onReviewClick} variant="outline">
              Оставить отзыв
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CardReviews;
