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
    description: `Уничтожение ${pestGenitive} в районе ${location} • Выезд за ${ctx.responseTime || '30-60 минут'} • Гарантия до 1 года • Безопасные препараты • +7 (906) 998-98-88`,
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
    description: `Профессиональная ${serviceGenitive} ${objectGenitive} в Москве • Лицензия Роспотребнадзора • Выезд за 30 минут • Гарантия до 1 года • +7 (906) 998-98-88`,
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
    description: `${service} в районе ${location} • Выезд за ${responseTime || '30 минут'} • Профессиональная обработка • Гарантия • +7 (906) 998-98-88`,
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
    description: `${service} ${objectGenitive} в районе ${location} • Выезд за ${responseTime || '30 минут'} • Профессиональная обработка • Гарантия • +7 (906) 998-98-88`,
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
 * Генерирует вступительный параграф
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
    'Гарантия до 1 года на все работы',
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
    
    `Мы уверены в качестве своей работы и даём гарантию до 1 года. Если ${pestGenitive.replace('от ', '')} появятся снова в течение гарантийного срока — проведём повторную обработку за наш счёт.`,
    
    `Гарантия результата — наш главный принцип. После обработки в ${location} вы получите гарантийный талон на срок до 1 года. При повторном появлении ${pestGenitive} — бесплатный выезд и обработка.`,
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
  const priceFrom = ctx.priceFrom || ctx.pest?.priceFrom || 1200;
  
  return [
    {
      question: `Сколько стоит вызов в ${location}?`,
      answer: `Выезд в район ${location} бесплатный. Стоимость обработки от ${priceFrom}₽ в зависимости от площади помещения и степени заражения.`,
    },
    {
      question: `Как быстро приедете в ${location}?`,
      answer: `Мастер приезжает в район ${location} за ${ctx.responseTime || '30-60 минут'}. Работаем круглосуточно, без выходных и праздников.`,
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
