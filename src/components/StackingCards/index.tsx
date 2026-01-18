import { lazy, Suspense } from 'react';

// Lazy load all cards
const CardHero = lazy(() => import('./CardHero'));
const CardServices = lazy(() => import('./CardServices'));
const CardAdvantages = lazy(() => import('./CardAdvantages'));
const CardProcess = lazy(() => import('./CardProcess'));
const CardPricing = lazy(() => import('./CardPricing'));
const CardBlog = lazy(() => import('./CardBlog'));
const CardReviews = lazy(() => import('./CardReviews'));
const CardCTA = lazy(() => import('./CardCTA'));

const CardSkeleton = () => (
  <div className="stacking-card animate-pulse">
    <div className="max-w-5xl mx-auto">
      <div className="h-10 bg-muted rounded-lg w-1/3 mx-auto mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-40 bg-muted rounded-xl" />
        <div className="h-40 bg-muted rounded-xl" />
      </div>
    </div>
  </div>
);

interface StackingCardsProps {
  onCalculatorClick: () => void;
  onReviewClick?: () => void;
}

const StackingCards = ({ onCalculatorClick, onReviewClick }: StackingCardsProps) => {
  return (
    <div className="stacking-container">
      <Suspense fallback={<CardSkeleton />}>
        <CardHero onCalculatorClick={onCalculatorClick} />
      </Suspense>
      
      <Suspense fallback={<CardSkeleton />}>
        <CardServices />
      </Suspense>
      
      <Suspense fallback={<CardSkeleton />}>
        <CardAdvantages />
      </Suspense>
      
      <Suspense fallback={<CardSkeleton />}>
        <CardProcess />
      </Suspense>
      
      <Suspense fallback={<CardSkeleton />}>
        <CardPricing onCalculatorClick={onCalculatorClick} />
      </Suspense>
      
      <Suspense fallback={<CardSkeleton />}>
        <CardBlog />
      </Suspense>
      
      <Suspense fallback={<CardSkeleton />}>
        <CardReviews onReviewClick={onReviewClick} />
      </Suspense>
      
      <Suspense fallback={<CardSkeleton />}>
        <CardCTA />
      </Suspense>
    </div>
  );
};

export default StackingCards;
