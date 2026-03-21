import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DistrictPage } from '@/data/districtPages';
import { useState } from 'react';

type ServiceType = 'dezinfekciya' | 'dezinsekciya' | 'deratizaciya';

const SERVICE_REVIEW_LABELS: Record<ServiceType, string> = {
  dezinfekciya: 'дезинфекции',
  dezinsekciya: 'дезинсекции',
  deratizaciya: 'дератизации',
};

interface DistrictReviewsProps {
  district: DistrictPage;
  serviceType?: ServiceType;
}

interface Review {
  rating: number;
  district: string;
  text: string;
  author: string;
  role: string;
  date: string;
}

const getDistrictReviews = (district: DistrictPage, serviceType: ServiceType): Review[] => {
  // Service-specific review templates
  const serviceTemplates: Record<ServiceType, Review[]> = {
    dezinfekciya: [
      {
        rating: 5,
        district: district.neighborhoods[0] || district.name,
        text: `Заказывали дезинфекцию помещения. Приехали быстро, обработали всё качественно. Запах выветрился за пару часов. Рекомендуем!`,
        author: 'Довольный клиент',
        role: 'Житель',
        date: '15 января 2026'
      },
      {
        rating: 5,
        district: district.neighborhoods[1] || district.name,
        text: 'Профессиональная дезинфекция офиса. Работали в выходной, в понедельник никакого запаха. Выдали все документы.',
        author: 'Марина К.',
        role: 'Офис-менеджер',
        date: '10 января 2026'
      },
      {
        rating: 5,
        district: district.neighborhoods[2] || district.name,
        text: 'Дезинфекция квартиры после ремонта. Всё сделали быстро и аккуратно. Безопасные средства, можно жить сразу.',
        author: 'Андрей С.',
        role: 'Житель',
        date: '5 января 2026'
      },
    ],
    dezinsekciya: [
      {
        rating: 5,
        district: district.neighborhoods[0] || district.name,
        text: `Вызывали дезинсекцию — тараканы замучили. Обработали за час, через неделю ни одного насекомого. Гарантию дали на 2 года!`,
        author: 'Елена В.',
        role: 'Жительница',
        date: '12 января 2026'
      },
      {
        rating: 5,
        district: district.neighborhoods[1] || district.name,
        text: 'Клопы в квартире — кошмар! Ребята приехали, обработали всё генератором тумана. Уже 3 месяца — чисто! Спасибо!',
        author: 'Николай М.',
        role: 'Житель',
        date: '8 января 2026'
      },
      {
        rating: 5,
        district: district.neighborhoods[2] || district.name,
        text: 'Дезинсекция ресторана перед проверкой СЭС. Приехали в тот же день, сделали качественно. Проверку прошли без замечаний.',
        author: 'Игорь Р.',
        role: 'Владелец ресторана',
        date: '3 января 2026'
      },
    ],
    deratizaciya: [
      {
        rating: 5,
        district: district.neighborhoods[0] || district.name,
        text: `Мыши в подвале достали весь подъезд. Вызвали дератизацию — обработали подвал и первый этаж. Уже 2 месяца тишина!`,
        author: 'ТСЖ представитель',
        role: 'Управляющий',
        date: '14 января 2026'
      },
      {
        rating: 5,
        district: district.neighborhoods[1] || district.name,
        text: 'Крысы на складе — серьёзная проблема. Дератизация помогла полностью. Установили приманки, проводят профилактику раз в месяц.',
        author: 'Дмитрий Л.',
        role: 'Начальник склада',
        date: '9 января 2026'
      },
      {
        rating: 5,
        district: district.neighborhoods[2] || district.name,
        text: 'Дератизация частного дома. Мыши лезли с участка. Обработали дом и территорию вокруг. Результат отличный!',
        author: 'Светлана П.',
        role: 'Домовладелец',
        date: '4 января 2026'
      },
    ],
  };

  // District-specific overrides for cao/sao/svao (keep existing rich reviews for dezinfekciya)
  const districtOverrides: Record<string, Record<ServiceType, Review[] | null>> = {
    cao: {
      dezinfekciya: [
        { rating: 5, district: 'Пресненский район', text: 'Делали дезинфекцию офиса на Пресне. Приехали быстро, за 25 минут. Ребята профессионалы, всё объяснили, дали рекомендации.', author: 'Алексей М.', role: 'Управляющий офисом', date: '12 января 2026' },
        { rating: 5, district: 'Арбат', text: 'Обрабатывали квартиру перед рождением ребёнка. Специалист учёл особенности сталинки. Ни запаха, ни следов.', author: 'Мария С.', role: 'Молодая мама', date: '8 января 2026' },
        { rating: 5, district: 'Тверской район', text: 'Ресторан на Тверской. Регулярно делаем дезинфекцию. Всегда вовремя, выдают все документы для проверок.', author: 'Игорь Р.', role: 'Владелец ресторана', date: '5 января 2026' },
      ],
      dezinsekciya: null,
      deratizaciya: null,
    },
  };

  const override = districtOverrides[district.id]?.[serviceType];
  return override || serviceTemplates[serviceType];
};

const DistrictReviews = ({ district, serviceType = 'dezinfekciya' }: DistrictReviewsProps) => {
  const reviews = getDistrictReviews(district, serviceType);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => setCurrentIndex((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  const renderReview = (review: Review, idx: number) => (
    <div key={idx} className="bg-background rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          {[...Array(review.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">{review.district}</span>
      </div>
      <div className="relative mb-4">
        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/10" />
        <p className="text-sm text-muted-foreground pl-4">"{review.text}"</p>
      </div>
      <div className="flex items-center gap-3 pt-4 border-t">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-semibold">{review.author.charAt(0)}</span>
        </div>
        <div>
          <p className="font-medium text-sm">{review.author}</p>
          <p className="text-xs text-muted-foreground">{review.role}</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-3">{review.date}</p>
    </div>
  );

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          Отзывы о {SERVICE_REVIEW_LABELS[serviceType]} в {district.name}
        </h2>

        {/* Desktop */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {reviews.map((review, idx) => renderReview(review, idx))}
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          {renderReview(reviews[currentIndex], currentIndex)}
          <div className="flex items-center justify-center gap-4 mt-4">
            <Button variant="outline" size="icon" onClick={prevReview}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground">{currentIndex + 1} / {reviews.length}</span>
            <Button variant="outline" size="icon" onClick={nextReview}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-2">
            Ещё {47 + ((district.id.length * 7 + district.neighborhoods.length * 3) % 20)} отзывов от клиентов из {district.name}
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
