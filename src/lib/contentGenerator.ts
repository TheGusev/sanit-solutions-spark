import { validateAndFormatMetadata } from './metadata';
import type { PageMetadata } from './metadata';

// ... остальной код остаётся без изменений ...

/**
 * Генерирует полные метаданные для НЧ-страницы с валидацией
 */
export function generateNchPageMetadata(ctx: ContentContext): PageMetadata {
  const location = ctx.neighborhoodName || ctx.cityName || 'Москва';
  const pestName = ctx.pest?.name || 'Вредители';
  const pestGenitive = ctx.pest?.genitive || 'вредителей';
  const priceFrom = ctx.priceFrom || ctx.pest?.priceFrom || 1200;
  
  const serviceName = {
    'dezinsekciya': 'Дезинсекция',
    'deratizaciya': 'Дератизация',
    'dezinfekciya': 'Дезинфекция',
  }[ctx.service] || 'Обработка';

  return validateAndFormatMetadata({
    title: `${serviceName} от ${pestGenitive} в ${location} — от ${priceFrom}₽`,
    description: `Уничтожение ${pestGenitive} в районе ${location} • Выезд за ${ctx.responseTime || '30-60 минут'} • Гарантия до 3 лет • Безопасные препараты • 8-495-018-18-17`,
    h1: `${serviceName} от ${pestGenitive} в ${location}`,
    canonical: `https://goruslugimsk.ru/uslugi/${ctx.service}/${ctx.pest?.slug}/${ctx.neighborhoodName || ctx.cityName}/`,
    keywords: [
      `${pestGenitive} ${location}`,
      `уничтожение ${pestGenitive} ${location}`,
      `${serviceName.toLowerCase()} ${location}`,
    ],
  }, { pageType: 'nch', autoFix: true }).metadata;
}

/**
 * Генерирует метаданные для страницы Услуга + Объект
 */
export function generateObjectPageMetadata(params: {
  service: string;
  serviceGenitive: string;
  object: string;
  objectGenitive: string;
  priceFrom: number;
}): PageMetadata {
  const { service, serviceGenitive, object, objectGenitive, priceFrom } = params;

  return validateAndFormatMetadata({
    title: `${service} ${objectGenitive} в Москве — от ${priceFrom}₽`,
    description: `Профессиональная ${serviceGenitive} ${objectGenitive} в Москве • Лицензия Роспотребнадзора • Выезд за 30 минут • Гарантия до 3 лет • 8-495-018-18-17`,
    h1: `${service} ${objectGenitive}`,
    canonical: `https://goruslugimsk.ru/uslugi/${service.toLowerCase()}/${object}/`,
    keywords: [`${serviceGenitive} ${objectGenitive} москва`, `${service.toLowerCase()} ${objectGenitive}`],
  }, { pageType: 'service', autoFix: true }).metadata;
}

/**
 * Генерирует метаданные для страницы Услуга + Район
 */
export function generateServiceDistrictMetadata(params: {
  service: string;
  serviceGenitive: string;
  location: string;
  priceFrom: number;
  responseTime?: string;
}): PageMetadata {
  const { service, serviceGenitive, location, priceFrom, responseTime } = params;

  return validateAndFormatMetadata({
    title: `${service} в ${location} — от ${priceFrom}₽`,
    description: `${service} в районе ${location} • Выезд за ${responseTime || '30 минут'} • Профессиональная обработка • Гарантия • 8-495-018-18-17`,
    h1: `${service} в районе ${location}`,
    canonical: `https://goruslugimsk.ru/uslugi/${service.toLowerCase()}/${location}/`,
    keywords: [`${serviceGenitive} ${location}`, `${service.toLowerCase()} ${location}`],
  }, { pageType: 'nch', autoFix: true }).metadata;
}

/**
 * Генерирует метаданные для страницы Услуга + Объект + Район
 */
export function generateObjectDistrictMetadata(params: {
  service: string;
  serviceGenitive: string;
  object: string;
  objectGenitive: string;
  location: string;
  priceFrom: number;
  responseTime?: string;
}): PageMetadata {
  const { service, serviceGenitive, object, objectGenitive, location, priceFrom, responseTime } = params;

  return validateAndFormatMetadata({
    title: `${service} ${objectGenitive} в ${location} — от ${priceFrom}₽`,
    description: `${service} ${objectGenitive} в районе ${location} • Выезд за ${responseTime || '30 минут'} • Профессиональная обработка • Гарантия • 8-495-018-18-17`,
    h1: `${service} ${objectGenitive} в ${location}`,
    canonical: `https://goruslugimsk.ru/uslugi/${service.toLowerCase()}/${object}/${location}/`,
    keywords: [`${serviceGenitive} ${objectGenitive} ${location}`],
  }, { pageType: 'nch', autoFix: true }).metadata;
}
/**
 * Генератор уникального контента для НЧ-страниц
 * 
 * Создаёт вариативный контент на основе комбинации:
 * услуга + вредитель + район/город
 */

import type { Pest } from '@/data/pests';

export interface ContentContext {
  service: 'dezinsekciya' | 'deratizaciya' | 'dezinfekciya';
  pest?: Pest;
  neighborhoodName?: string;
  districtId?: string;
  cityName?: string;
  responseTime?: string;
  priceFrom?: number;
}

/**
 * Хеш-функция для детерминированного выбора вариации
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Выбирает элемент из массива на основе хеша
 */
function selectByHash<T>(items: T[], hashStr: string): T {
  const index = hashCode(hashStr) % items.length;
  return items[index];
}

/**
 * Генерирует вступительный параграф (8 вариаций)
 */
export function generateIntro(ctx: ContentContext): string {
  const location = ctx.neighborhoodName || ctx.cityName || 'вашем районе';
  const pestName = ctx.pest?.namePlural?.toLowerCase() || 'вредители';
  const pestGenitive = ctx.pest?.genitive || 'вредителей';
  
  const variations = [
    `${ctx.pest?.namePlural || 'Вредители'} — серьёзная проблема для жителей района ${location}. Они не только доставляют дискомфорт, но и могут быть переносчиками опасных заболеваний. Наша компания специализируется на профессиональном уничтожении ${pestGenitive} и гарантирует результат.`,
    
    `Столкнулись с ${ctx.pest?.genitive || 'вредителями'} в ${location}? Вы не одиноки — это распространённая проблема в многоквартирных домах. Профессиональная обработка позволяет полностью избавиться от ${pestGenitive} за один визит.`,
    
    `В ${location} ${pestName} появляются особенно часто из-за особенностей местной застройки. Самостоятельная борьба редко даёт результат — ${pestName} быстро адаптируются к магазинным препаратам. Профессиональная дезинсекция решает проблему раз и навсегда.`,
    
    `Обнаружили ${ctx.pest?.genitive || 'вредителей'} в своей квартире в ${location}? Не откладывайте решение проблемы — чем раньше провести обработку, тем быстрее и дешевле избавиться от ${pestGenitive}. Выезжаем в течение ${ctx.responseTime || '1 часа'}.`,

    `Ночной вызов в ${location}? Работаем круглосуточно без выходных. ${ctx.pest?.namePlural || 'Вредители'} активнее всего ночью — именно поэтому мы выезжаем на обработку от ${pestGenitive} в любое время суток, включая праздники.`,

    `Рестораны, кафе и офисы в ${location} особенно уязвимы: ${pestName} мигрируют через вентиляцию и коммуникации. Мы проводим обработку от ${pestGenitive} для бизнеса с выдачей полного пакета документов для Роспотребнадзора.`,

    `${ctx.pest?.seasonality ? `Сезон активности ${pestGenitive} — ${ctx.pest.seasonality}.` : ''} В ${location} пик обращений приходится на тёплое время года, когда ${pestName} размножаются особенно быстро. Раннее обращение экономит и время, и бюджет.`,

    `Соседи провели обработку, а ${pestName} перебрались к вам? Это частая ситуация в многоквартирных домах ${location}. Мы обрабатываем квартиру так, чтобы создать барьер от повторного заселения ${pestGenitive} из смежных помещений.`,
  ];
  
  const hashStr = `${ctx.service}-${ctx.pest?.slug || ''}-${ctx.neighborhoodName || ctx.cityName || ''}`;
  return selectByHash(variations, hashStr);
}

/**
 * Генерирует список локальных преимуществ
 */
export function generateLocalFeatures(ctx: ContentContext): string[] {
  const location = ctx.neighborhoodName || ctx.cityName || '';
  const district = ctx.districtId?.toUpperCase() || '';
  
  const baseFeatures = [
    `Знаем особенности застройки ${location}`,
    `Работаем в ${district || 'вашем районе'} более 8 лет`,
    `Местные мастера, знающие район`,
    `Быстрый выезд — ${ctx.responseTime || '30-60 мин'}`,
  ];
  
  const additionalFeatures = [
    'Опыт работы со старым и новым жилым фондом',
    'Знаем типичные места заражения в этом районе',
    'Работаем с управляющими компаниями',
    'Сертифицированные препараты IV класса опасности',
    'Гарантия до 3 лет на все работы',
    'Бесплатная повторная обработка при необходимости',
  ];
  
  // Выбираем 2 дополнительных на основе хеша
  const hashStr = `features-${ctx.neighborhoodName || ctx.cityName}`;
  const selected = [
    selectByHash(additionalFeatures.slice(0, 3), hashStr + '1'),
    selectByHash(additionalFeatures.slice(3), hashStr + '2'),
  ];
  
  return [...baseFeatures.slice(0, 3), ...selected];
}

/**
 * Генерирует описание проблемы с вредителем
 */
export function generateProblemDescription(ctx: ContentContext): string {
  const location = ctx.neighborhoodName || ctx.cityName || 'этом районе';
  const pestName = ctx.pest?.namePlural?.toLowerCase() || 'вредители';
  
  const templates = [
    `${ctx.pest?.description || ''} В ${location} эта проблема особенно актуальна из-за особенностей местной застройки — старые коммуникации и близость к подвальным помещениям создают идеальные условия для размножения ${pestName}.`,
    
    `${location} — район с разнообразным жилым фондом, где ${pestName} часто появляются в многоквартирных домах. ${ctx.pest?.description || ''} Без профессиональной обработки избавиться от них практически невозможно.`,
    
    `Жители ${location} регулярно сталкиваются с проблемой ${ctx.pest?.genitive || 'вредителей'}. ${ctx.pest?.description || ''} Наши специалисты знают особенности работы в этом районе и гарантируют результат.`,
  ];
  
  const hashStr = `problem-${ctx.pest?.slug}-${location}`;
  return selectByHash(templates, hashStr);
}

/**
 * Генерирует объяснение, почему народные методы не работают
 */
export function generateWhyFolkMethodsDontWork(ctx: ContentContext): string {
  const pestName = ctx.pest?.namePlural || 'Вредители';
  const pestGenitive = ctx.pest?.genitive || 'вредителей';
  
  return `Магазинные аэрозоли, ловушки и народные средства (борная кислота, уксус, травы) дают только временный эффект. ${pestName} быстро адаптируются к препаратам и продолжают размножаться в труднодоступных местах. 

Профессиональная обработка использует препараты нового поколения, к которым у ${pestGenitive} нет устойчивости. Кроме того, мы обрабатываем все возможные места обитания, включая щели, вентиляцию и коммуникации — это гарантирует полное уничтожение популяции за один визит.`;
}

/**
 * Генерирует текст гарантии
 */
export function generateGuaranteeText(ctx: ContentContext): string {
  const location = ctx.neighborhoodName || ctx.cityName || 'вашем районе';
  const pestGenitive = ctx.pest?.genitive || 'вредителей';
  
  const templates = [
    `Если в течение 30 дней после обработки в ${location} вы заметили признаки присутствия ${pestGenitive}, мы приедем повторно бесплатно. Это гарантирует, что проблема решена окончательно.`,
    
    `Мы уверены в качестве своей работы и даём гарантию до 3 лет. Если ${pestGenitive.replace('от ', '')} появятся снова в течение гарантийного срока — проведём повторную обработку за наш счёт.`,
    
    `Гарантия результата — наш главный принцип. После обработки в ${location} вы получите гарантийный талон на срок до 3 лет. При повторном появлении ${pestGenitive} — бесплатный выезд и обработка.`,
  ];
  
  const hashStr = `guarantee-${location}`;
  return selectByHash(templates, hashStr);
}

/**
 * Генерирует FAQ для страницы
 */
export function generateFAQ(ctx: ContentContext): Array<{ question: string; answer: string }> {
  const location = ctx.neighborhoodName || ctx.cityName || 'ваш район';
  const pestGenitive = ctx.pest?.genitive || 'вредителей';
  const pestName = ctx.pest?.namePlural || 'Вредители';
  const priceFrom = ctx.priceFrom || ctx.pest?.priceFrom || 1200;
  
  const baseFAQ = [
    {
      question: `Сколько стоит вызов в ${location}?`,
      answer: `Выезд в район ${location} бесплатный. Стоимость обработки от ${priceFrom}₽ в зависимости от площади помещения и степени заражения.`,
    },
    {
      question: `Время прибытия мастера в ${location}?`,
      answer: `Мастер прибывает в район ${location} за ${ctx.responseTime || '30-60 минут'}. Работаем круглосуточно, без выходных и праздников.`,
    },
    {
      question: 'Нужно ли покидать квартиру во время обработки?',
      answer: 'Да, на время обработки и 2-4 часа после неё людям и домашним животным нужно покинуть помещение. После проветривания квартира полностью безопасна для проживания.',
    },
    {
      question: 'Какой метод обработки лучше: холодный или горячий туман?',
      answer: 'Для квартир мы рекомендуем холодный туман — он безопаснее для мебели и быстрее выветривается. Горячий туман используется для больших площадей: складов, производств, подвалов.',
    },
    {
      question: 'Как долго держится эффект от обработки?',
      answer: `При соблюдении наших рекомендаций эффект держится от 6 месяцев до года. Мы даём гарантию и проводим повторную обработку бесплатно, если ${pestGenitive.replace('от ', '')} появятся снова.`,
    },
  ];

  // Pest-specific FAQ
  const dangerText = ctx.pest?.dangerLevel === 'high'
    ? `Да, ${pestName.toLowerCase()} представляют серьёзную угрозу: переносят инфекции, вызывают аллергические реакции. Особенно опасны для детей и людей с ослабленным иммунитетом.`
    : ctx.pest?.dangerLevel === 'medium'
    ? `${pestName} могут вызывать аллергию и дискомфорт. Для детей и домашних животных контакт нежелателен. Рекомендуем провести обработку при первых признаках.`
    : `Прямой угрозы здоровью ${pestName.toLowerCase()} обычно не представляют, но создают антисанитарные условия и психологический дискомфорт.`;

  baseFAQ.push({
    question: `Опасны ли ${pestName.toLowerCase()} для детей и животных?`,
    answer: dangerText,
  });

  // Neighborhood-specific FAQ
  baseFAQ.push({
    question: `Часто ли вызывают в ${location}?`,
    answer: `Да, район ${location} входит в число районов с регулярными обращениями. Среднее время прибытия — ${ctx.responseTime || '30-60 минут'}. Наши мастера хорошо знают местную застройку и типичные очаги заражения.`,
  });

  // Method FAQ
  if (ctx.pest?.methods?.length) {
    baseFAQ.push({
      question: `Какой метод лучше для борьбы с ${pestGenitive}?`,
      answer: `Для ${pestGenitive} мы рекомендуем: ${ctx.pest.methods.join(', ')}. Конкретный метод подбирается после осмотра помещения с учётом площади и степени заражения.`,
    });
  }

  return baseFAQ;
}

// ============================================================
// Tier 1 NCH uniqueness blocks
// ============================================================

import { staticReviews } from '@/data/reviews';

/** District type classification for content variation */
const districtTypes: Record<string, 'center' | 'residential' | 'industrial' | 'suburban'> = {
  'cao': 'center',
  'sao': 'residential', 'svao': 'residential', 'vao': 'residential',
  'yuvao': 'industrial', 'yao': 'residential', 'yzao': 'residential',
  'zao': 'residential', 'szao': 'residential',
  'nao': 'suburban', 'tao': 'suburban', 'zelao': 'suburban',
};

/** District price multiplier */
const districtPriceMultiplier: Record<string, number> = {
  'cao': 1.0, 'sao': 1.0, 'zao': 1.0, 'szao': 1.0,
  'svao': 1.05, 'vao': 1.05, 'yao': 1.05, 'yzao': 1.05,
  'yuvao': 1.1,
  'nao': 1.15, 'tao': 1.2, 'zelao': 1.15,
};

/**
 * Блок A: «Почему проблема типична для {район}»
 */
export function generateWhyThisArea(ctx: ContentContext): { title: string; text: string } {
  const location = ctx.neighborhoodName || 'этом районе';
  const pestName = ctx.pest?.namePlural?.toLowerCase() || 'вредители';
  const pestGenitive = ctx.pest?.genitive || 'вредителей';
  const dType = districtTypes[ctx.districtId || ''] || 'residential';
  const district = ctx.districtId?.toUpperCase() || '';

  const buildingContext: Record<string, string> = {
    center: `старый жилой фонд с дореволюционными домами и кирпичными зданиями, где изношенные коммуникации и подвалы создают благоприятные условия для ${pestGenitive}`,
    residential: `типовая многоэтажная застройка с мусоропроводами, общими подвалами и тесным расположением квартир — идеальная среда для миграции ${pestGenitive} между помещениями`,
    industrial: `смешанная застройка: жилые кварталы соседствуют со складами и промзонами, откуда ${pestName} легко проникают в квартиры через коммуникации`,
    suburban: `малоэтажная застройка с частными домами и таунхаусами, где ${pestName} проникают с приусадебных участков и из подпольных пространств`,
  };

  const variations = [
    {
      title: `Когда нужна обработка от ${pestGenitive} именно в ${location}`,
      text: `${location} (${district}) — район с ${buildingContext[dType]}. Близость к паркам, скверам и водоёмам дополнительно увеличивает популяцию ${pestGenitive}. Жители регулярно обращаются за профессиональной обработкой, особенно в период ${ctx.pest?.seasonality || 'весна-осень'}.`,
    },
    {
      title: `Почему ${pestName.toLowerCase()} появляются в ${location}`,
      text: `Район ${location} отличается ${buildingContext[dType]}. Из-за высокой плотности застройки ${pestName.toLowerCase()} быстро распространяются от квартиры к квартире. Самостоятельная обработка одного помещения неэффективна — необходимо профессиональное уничтожение ${pestGenitive} с барьерной защитой.`,
    },
    {
      title: `${ctx.pest?.name || 'Вредители'} в ${location}: местная специфика`,
      text: `В ${location} мы проводим обработки более 8 лет и хорошо знаем особенности местной застройки. ${district} — это ${buildingContext[dType]}. Наши мастера учитывают эти факторы при выборе метода и препарата для уничтожения ${pestGenitive}.`,
    },
    {
      title: `Особенности борьбы с ${pestGenitive} в ${location}`,
      text: `Климат Москвы и ${buildingContext[dType]} делают ${location} районом с повышенным риском появления ${pestGenitive}. Ближайшие станции метро и торговые центры создают постоянный поток людей, что способствует распространению ${pestGenitive}. Мы применяем комплексный подход: обработка + барьер + профилактика.`,
    },
    {
      title: `Обработка от ${pestGenitive} в ${location}: что важно знать`,
      text: `${location} входит в ${district}, где ${buildingContext[dType]}. В многоквартирных домах ${pestName.toLowerCase()} часто мигрируют через вентиляцию и канализацию. Мы рекомендуем обработку не только своей квартиры, но и создание барьерной защиты от повторного заселения ${pestGenitive} из соседних помещений.`,
    },
    {
      title: `${location}: типичные причины появления ${pestGenitive}`,
      text: `Район ${location} характеризуется ${buildingContext[dType]}. Основные причины появления ${pestGenitive}: миграция от соседей после точечных обработок, проникновение из подвалов и чердаков, завоз с покупками и мебелью. ${ctx.pest?.seasonality ? `Пик обращений — ${ctx.pest.seasonality}.` : ''} Наши специалисты проведут диагностику и подберут оптимальный метод.`,
    },
  ];

  const hashStr = `whyarea-${ctx.pest?.slug}-${ctx.neighborhoodName}-${ctx.districtId}`;
  return selectByHash(variations, hashStr);
}

/**
 * Блок B: «Стоимость по типу объекта»
 */
export interface PriceTableRow {
  objectType: string;
  price: number;
  note: string;
}

export function generatePriceTable(ctx: ContentContext): PriceTableRow[] {
  const basePrice = ctx.pest?.priceFrom || 1200;
  const dMult = districtPriceMultiplier[ctx.districtId || ''] || 1.0;

  const roundTo50 = (n: number) => Math.round(n / 50) * 50;

  return [
    { objectType: 'Квартира 1-комнатная', price: roundTo50(basePrice * 1.0 * dMult), note: 'Холодный туман, барьер' },
    { objectType: 'Квартира 2-комнатная', price: roundTo50(basePrice * 1.3 * dMult), note: 'Холодный туман, барьер' },
    { objectType: 'Квартира 3-комнатная', price: roundTo50(basePrice * 1.5 * dMult), note: 'Комплексная обработка' },
    { objectType: 'Частный дом', price: roundTo50(basePrice * 2.0 * dMult), note: 'Дом + прилегающая территория' },
    { objectType: 'Офис / магазин', price: roundTo50(basePrice * 1.8 * dMult), note: 'С документами для проверок' },
    { objectType: 'Ресторан / кафе', price: roundTo50(basePrice * 2.2 * dMult), note: 'Пищевое производство, акт' },
  ];
}

/**
 * Блок C: «Отзыв из района» — детерминистичный выбор
 */
export interface LocalReviewData {
  displayName: string;
  text: string;
  rating: number;
  neighborhoodName: string;
}

export function generateLocalReview(ctx: ContentContext): LocalReviewData {
  const location = ctx.neighborhoodName || 'Москва';
  const idx = hashCode(ctx.neighborhoodName || 'default') % staticReviews.length;
  const review = staticReviews[idx];

  return {
    displayName: review.display_name,
    text: review.text,
    rating: review.rating,
    neighborhoodName: location,
  };
}

/**
 * Генерирует Schema.org FAQPage
 */
export function generateFAQSchema(faq: Array<{ question: string; answer: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
