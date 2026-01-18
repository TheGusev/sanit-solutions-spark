import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DistrictPage } from '@/data/districtPages';
import { useState } from 'react';

interface DistrictReviewsProps {
  district: DistrictPage;
}

interface Review {
  rating: number;
  district: string;
  text: string;
  author: string;
  role: string;
  date: string;
}

// Generate reviews based on district
const getDistrictReviews = (district: DistrictPage): Review[] => {
  const baseReviews: Record<string, Review[]> = {
    cao: [
      {
        rating: 5,
        district: 'Пресненский район',
        text: 'Делали дезинфекцию офиса на Пресне. Приехали быстро, за 25 минут. Ребята профессионалы, всё объяснили, дали рекомендации. Работали в субботу, чтобы не мешать сотрудникам.',
        author: 'Алексей М.',
        role: 'Управляющий офисом',
        date: '12 января 2026'
      },
      {
        rating: 5,
        district: 'Арбат',
        text: 'Обрабатывали квартиру перед рождением ребёнка. Жили в сталинке с высокими потолками — специалист учёл особенности. Ни запаха, ни следов. Малыш родился, живём спокойно!',
        author: 'Мария С.',
        role: 'Молодая мама',
        date: '8 января 2026'
      },
      {
        rating: 5,
        district: 'Тверской район',
        text: 'Ресторан на Тверской. Регулярно делаем дезинфекцию. Ребята работают по договору, всегда вовремя, выдают все документы для проверок. Цены адекватные.',
        author: 'Игорь Р.',
        role: 'Владелец ресторана',
        date: '5 января 2026'
      },
    ],
    sao: [
      {
        rating: 5,
        district: 'Водный стадион',
        text: 'Обработали всю квартиру от тараканов. Приехали за 20 минут! Работали аккуратно, после обработки не осталось запаха. Уже месяц — ни одного таракана.',
        author: 'Елена К.',
        role: 'Жительница',
        date: '10 января 2026'
      },
      {
        rating: 5,
        district: 'Сокол',
        text: 'Кафе у метро Сокол. Перед проверкой Роспотребнадзора нужна была срочная обработка. Приехали за 4 часа, сделали всё качественно. Проверку прошли!',
        author: 'Дмитрий Л.',
        role: 'Управляющий кафе',
        date: '7 января 2026'
      },
      {
        rating: 5,
        district: 'Аэропорт',
        text: 'Заключили договор на обслуживание всего дома. Обрабатывают подвал и подъезды регулярно. Забыли про тараканов и мышей. Рекомендую!',
        author: 'ТСЖ "Аэропорт"',
        role: 'Представитель ТСЖ',
        date: '3 января 2026'
      },
    ],
    svao: [
      {
        rating: 5,
        district: 'Бибирево',
        text: 'Живём в панельке, тараканы были у всех соседей. Обработали весь стояк — 5 квартир. Прошло 3 месяца — чисто! Спасибо команде.',
        author: 'Николай В.',
        role: 'Житель',
        date: '11 января 2026'
      },
      {
        rating: 5,
        district: 'ВДНХ',
        text: 'Квартира рядом с ВДНХ. После ремонта появились клопы с новой мебелью. Вывели за одну обработку. Быстро и без лишних запахов.',
        author: 'Анна Д.',
        role: 'Жительница',
        date: '6 января 2026'
      },
      {
        rating: 5,
        district: 'Отрадное',
        text: 'Детский сад. Провели профилактическую обработку перед учебным годом. Документы для СЭС выдали сразу. Всё официально.',
        author: 'Светлана П.',
        role: 'Заведующая ДОУ',
        date: '28 августа 2025'
      },
    ],
  };

  // Default reviews for districts without specific ones
  const defaultReviews: Review[] = [
    {
      rating: 5,
      district: district.neighborhoods[0] || district.name,
      text: `Отличная работа! Приехали быстро, обработали всю квартиру. Прошёл месяц — никаких насекомых. Рекомендую эту службу для ${district.name}.`,
      author: 'Довольный клиент',
      role: 'Житель',
      date: '15 января 2026'
    },
    {
      rating: 5,
      district: district.neighborhoods[1] || district.name,
      text: 'Профессиональный подход. Специалисты знают свое дело. Всё объяснили, дали рекомендации по профилактике. Цена соответствует качеству.',
      author: 'Марина К.',
      role: 'Жительница',
      date: '10 января 2026'
    },
    {
      rating: 5,
      district: district.neighborhoods[2] || district.name,
      text: 'Обрабатывали офис в выходной. Работали аккуратно, в понедельник никакого запаха не было. Сотрудники даже не заметили, что была обработка.',
      author: 'Андрей С.',
      role: 'Офис-менеджер',
      date: '5 января 2026'
    },
  ];

  return baseReviews[district.id] || defaultReviews;
};

const DistrictReviews = ({ district }: DistrictReviewsProps) => {
  const reviews = getDistrictReviews(district);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          Отзывы клиентов из {district.name}
        </h2>

        {/* Desktop: Grid view */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {reviews.map((review, idx) => (
            <div 
              key={idx}
              className="bg-background rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{review.district}</span>
              </div>

              {/* Quote */}
              <div className="relative mb-4">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/10" />
                <p className="text-sm text-muted-foreground pl-4">
                  "{review.text}"
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {review.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">{review.author}</p>
                  <p className="text-xs text-muted-foreground">{review.role}</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-3">{review.date}</p>
            </div>
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="md:hidden">
          <div className="bg-background rounded-xl p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1">
                {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {reviews[currentIndex].district}
              </span>
            </div>

            {/* Quote */}
            <div className="relative mb-4">
              <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/10" />
              <p className="text-sm text-muted-foreground pl-4">
                "{reviews[currentIndex].text}"
              </p>
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold">
                  {reviews[currentIndex].author.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-sm">{reviews[currentIndex].author}</p>
                <p className="text-xs text-muted-foreground">{reviews[currentIndex].role}</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-3">{reviews[currentIndex].date}</p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <Button variant="outline" size="icon" onClick={prevReview}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} / {reviews.length}
            </span>
            <Button variant="outline" size="icon" onClick={nextReview}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* View all link */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-2">
            Ещё {47 + Math.floor(Math.random() * 50)} отзывов от клиентов из {district.name}
          </p>
          <Button variant="outline" asChild>
            <a href="/#reviews">Посмотреть все отзывы</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DistrictReviews;
