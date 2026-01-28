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

// Variation type based on neighborhood characteristics
export type PageVariationType = 'elite' | 'residential' | 'business' | 'industrial';

// Determine variation type from slug
export function getPageVariation(slug: string): PageVariationType {
  const seed = simpleHash(slug);
  const rng = new SeededRandom(seed);
  const types: PageVariationType[] = ['elite', 'residential', 'business', 'industrial'];
  return rng.choice(types);
}

// Headings for different variations
export const headings: Record<PageVariationType, { hero: string; services: string; cta: string }> = {
  elite: {
    hero: 'Премиальная дезинфекция для элитной недвижимости',
    services: 'Эксклюзивные услуги',
    cta: 'Получить индивидуальное предложение'
  },
  residential: {
    hero: 'Доступная дезинфекция для вашего дома',
    services: 'Услуги для квартир и домов',
    cta: 'Заказать обработку квартиры'
  },
  business: {
    hero: 'Профессиональная дезинфекция для бизнеса',
    services: 'Решения для офисов и коммерции',
    cta: 'Заказать обработку офиса'
  },
  industrial: {
    hero: 'Дезинфекция промышленных объектов',
    services: 'Комплексные решения для производства',
    cta: 'Получить коммерческое предложение'
  }
};

// Warning blocks for different variations
export const warningContent: Record<PageVariationType, { title: string; text: string; accent: 'warning' | 'info' }> = {
  elite: {
    title: 'Особый подход к элитной недвижимости',
    text: 'Используем только премиальные препараты без запаха. Работаем конфиденциально и деликатно.',
    accent: 'info'
  },
  residential: {
    title: 'Безопасно для детей и животных',
    text: 'Все препараты сертифицированы Роспотребнадзором. Можно находиться в помещении через 2 часа.',
    accent: 'info'
  },
  business: {
    title: 'Работаем без остановки бизнеса',
    text: 'Обработка в нерабочее время или выходные дни. Минимум неудобств для сотрудников.',
    accent: 'warning'
  },
  industrial: {
    title: 'Полное соблюдение требований СанПиН',
    text: 'Договор, акты, документация. Регулярное обслуживание крупных объектов.',
    accent: 'warning'
  }
};

// CTA buttons for different variations
export const ctaButtons: Record<PageVariationType, string> = {
  elite: 'Заказать консультацию',
  residential: 'Рассчитать стоимость',
  business: 'Получить КП для офиса',
  industrial: 'Запросить коммерческое предложение'
};

// Card styles for different variations
export const cardStyles: Record<PageVariationType, string> = {
  elite: 'hover:shadow-2xl transition-all hover:-translate-y-2 border-2 hover:border-primary/50',
  residential: 'hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-primary/50',
  business: 'hover:shadow-xl transition-all hover:-translate-y-1 border-2 hover:border-blue-500/50',
  industrial: 'hover:shadow-lg transition-all border-2 hover:border-gray-400'
};

// Legacy support (keep for backward compatibility)
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

export function getTextVariant(slug: string, category: keyof typeof textVariants, variantIndex?: number): string {
  const variants = textVariants[category];
  if (variantIndex !== undefined) return variants[variantIndex % variants.length];
  const seed = simpleHash(slug);
  const rng = new SeededRandom(seed);
  return rng.choice(variants);
}

export { simpleHash };
