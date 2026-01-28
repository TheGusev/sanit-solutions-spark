function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

class SeededRandom {
  private seed: number;
  constructor(seed: number) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }
  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  choice<T>(array: T[]): T {
    if (array.length === 0) throw new Error('Array is empty');
    return array[this.nextInt(0, array.length - 1)];
  }
}

export interface PageVariation {
  warningColor: 'orange' | 'red' | 'purple' | 'blue';
  accentColor: 'blue' | 'green' | 'teal' | 'cyan';
  headingVariant: number;
  ctaTextVariant: number;
  benefitsHeadingVariant: number;
  guaranteesHeadingVariant: number;
  showFAQBeforeTestimonials: boolean;
  showPricingBeforeGallery: boolean;
  showCertificatesInHero: boolean;
  tableStyle: 'compact' | 'spacious' | 'bordered';
  buttonStyle: 'rounded' | 'square' | 'pill';
  cardStyle: 'shadow' | 'border' | 'outline';
  showPatrioticBadge: boolean;
  highlightCertificates: boolean;
  showUrgencyBanner: boolean;
}

export function getPageVariation(slug: string): PageVariation {
  const seed = simpleHash(slug);
  const rng = new SeededRandom(seed);
  return {
    warningColor: rng.choice(['orange', 'red', 'purple', 'blue']),
    accentColor: rng.choice(['blue', 'green', 'teal', 'cyan']),
    headingVariant: rng.nextInt(0, 4),
    ctaTextVariant: rng.nextInt(0, 2),
    benefitsHeadingVariant: rng.nextInt(0, 4),
    guaranteesHeadingVariant: rng.nextInt(0, 4),
    showFAQBeforeTestimonials: rng.next() > 0.5,
    showPricingBeforeGallery: rng.next() > 0.5,
    showCertificatesInHero: rng.next() > 0.7,
    tableStyle: rng.choice(['compact', 'spacious', 'bordered']),
    buttonStyle: rng.choice(['rounded', 'square', 'pill']),
    cardStyle: rng.choice(['shadow', 'border', 'outline']),
    showPatrioticBadge: rng.next() < 0.15,
    highlightCertificates: rng.next() < 0.25,
    showUrgencyBanner: rng.next() < 0.20
  };
}

export const textVariants = {
  whyChooseUs: ['Почему выбирают нас','Наши преимущества','Что мы гарантируем','Профессиональный подход','Работаем для вашей безопасности'],
  benefits: ['Преимущества нашей службы','Почему мы лучшие','Что отличает нас от конкурентов','Наши сильные стороны','Качество и надёжность'],
  guarantees: ['Наши гарантии','Гарантии качества','Что мы гарантируем','Ответственность и гарантии','Надёжность сервиса'],
  howToOrder: ['Как заказать обработку','Простой процесс заказа','Закажите в 3 шага','Оформление заявки','Легко и быстро'],
  pricing: ['Стоимость услуг','Цены на обработку','Прозрачное ценообразование','Сколько стоит обработка','Расчёт стоимости'],
  ctaButtons: ['Заказать обработку','Вызвать специалиста','Оставить заявку'],
  ctaSecondary: ['Узнать подробнее','Получить консультацию','Задать вопрос']
};

export const colorSchemes = {
  orange: { bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-900', accent: 'bg-orange-500 hover:bg-orange-600', light: 'bg-orange-100' },
  red: { bg: 'bg-red-50', border: 'border-red-400', text: 'text-red-900', accent: 'bg-red-500 hover:bg-red-600', light: 'bg-red-100' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-400', text: 'text-purple-900', accent: 'bg-purple-500 hover:bg-purple-600', light: 'bg-purple-100' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-900', accent: 'bg-blue-500 hover:bg-blue-600', light: 'bg-blue-100' }
};

export const buttonStyles = {
  rounded: 'rounded-lg px-6 py-3',
  square: 'rounded-none px-6 py-3',
  pill: 'rounded-full px-8 py-3'
};

export const tableStyles = {
  compact: { wrapper: 'overflow-x-auto', table: 'min-w-full text-sm', th: 'px-3 py-2 bg-gray-100 font-semibold text-left', td: 'px-3 py-2 border-b border-gray-200' },
  spacious: { wrapper: 'overflow-x-auto', table: 'min-w-full text-base', th: 'px-6 py-4 bg-gray-50 font-bold text-left', td: 'px-6 py-4 border-b border-gray-100' },
  bordered: { wrapper: 'overflow-x-auto border-2 border-gray-300 rounded-lg', table: 'min-w-full text-base', th: 'px-4 py-3 bg-gray-200 font-semibold text-left border-b-2 border-gray-400', td: 'px-4 py-3 border border-gray-300' }
};

export const cardStyles = {
  shadow: 'shadow-lg rounded-lg p-6 bg-white',
  border: 'border-2 border-gray-200 rounded-lg p-6 bg-white',
  outline: 'border border-gray-300 rounded-xl p-6 bg-gray-50'
};

export function getTextVariant(slug: string, category: keyof typeof textVariants, variantIndex?: number): string {
  const variants = textVariants[category];
  if (variantIndex !== undefined) return variants[variantIndex % variants.length];
  const variation = getPageVariation(slug);
  return variants[variation.headingVariant % variants.length];
}

export { simpleHash };

