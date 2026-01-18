/**
 * === КОНТЕЙНЕР КАРТОЧЕК ДЕЗИНФЕКЦИИ ===
 * Объединяет все 6 Stacking Cards страницы услуги
 * 
 * @component DezinfekciyaCards
 * @param onOrderClick - Callback для открытия формы заказа
 */

import { lazy, Suspense } from 'react';

// Lazy load all cards for performance
const CardDescription = lazy(() => import('./CardDescription'));
const CardRooms = lazy(() => import('./CardRooms'));
const CardMethods = lazy(() => import('./CardMethods'));
const CardPricing = lazy(() => import('./CardPricing'));
const CardProcess = lazy(() => import('./CardProcess'));
const CardFAQ = lazy(() => import('./CardFAQ'));

/**
 * Skeleton для загрузки карточки
 */
const CardSkeleton = () => (
  <div className="service-card min-h-[60vh] animate-pulse flex items-center justify-center">
    <div className="max-w-4xl mx-auto px-4 w-full">
      <div className="h-10 bg-muted rounded-lg w-2/3 mx-auto mb-6" />
      <div className="h-6 bg-muted rounded-lg w-1/2 mx-auto mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-40 bg-muted rounded-xl" />
        <div className="h-40 bg-muted rounded-xl" />
      </div>
    </div>
  </div>
);

interface DezinfekciyaCardsProps {
  onOrderClick: () => void;
}

const DezinfekciyaCards = ({ onOrderClick }: DezinfekciyaCardsProps) => {
  return (
    <div className="stacking-container">
      {/* Card 1: Описание услуги */}
      <Suspense fallback={<CardSkeleton />}>
        <CardDescription onOrderClick={onOrderClick} />
      </Suspense>

      {/* Card 2: Типы помещений */}
      <Suspense fallback={<CardSkeleton />}>
        <CardRooms onOrderClick={onOrderClick} />
      </Suspense>

      {/* Card 3: Методы дезинфекции */}
      <Suspense fallback={<CardSkeleton />}>
        <CardMethods onOrderClick={onOrderClick} />
      </Suspense>

      {/* Card 4: Цены и калькулятор */}
      <Suspense fallback={<CardSkeleton />}>
        <CardPricing onOrderClick={onOrderClick} />
      </Suspense>

      {/* Card 5: Этапы работы */}
      <Suspense fallback={<CardSkeleton />}>
        <CardProcess />
      </Suspense>

      {/* Card 6: FAQ */}
      <Suspense fallback={<CardSkeleton />}>
        <CardFAQ onOrderClick={onOrderClick} />
      </Suspense>
    </div>
  );
};

export default DezinfekciyaCards;
