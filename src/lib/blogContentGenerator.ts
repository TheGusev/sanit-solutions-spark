/**
 * Генератор уникального контента для статей блога.
 * Использует детерминированный хеш для вариативности.
 */

import { pests } from '@/data/pests';
import { objectTypes } from '@/data/objects';

// Простая хеш-функция для детерминированного выбора
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Выбор элемента из массива по хешу
function selectByHash<T>(arr: T[], seed: string): T {
  const hash = simpleHash(seed);
  return arr[hash % arr.length];
}

// Вступления для статей о вредителях
const pestIntroTemplates = [
  (name: string, genitive: string) => 
    `${name} — одна из самых распространённых проблем в жилых и коммерческих помещениях Москвы. Ежегодно тысячи жителей столицы сталкиваются с необходимостью борьбы с ${genitive}. В этой статье мы расскажем о профессиональных методах решения этой проблемы.`,
  
  (name: string, genitive: string) => 
    `Обнаружили ${genitive} в своём доме или офисе? Не паникуйте — это распространённая ситуация, с которой ежедневно сталкиваются жители Москвы. Важно понимать: чем раньше начать борьбу с ${genitive}, тем быстрее и проще будет добиться полного уничтожения.`,
  
  (name: string, genitive: string) => 
    `${name} могут появиться в любом помещении, независимо от уровня чистоты и благополучия района. Опытные специалисты готовы помочь вам избавиться от ${genitive} быстро, эффективно и с гарантией результата.`,
  
  (name: string, genitive: string) => 
    `Проблема ${genitive} знакома многим москвичам. Эти вредители не только причиняют дискомфорт, но и представляют реальную угрозу для здоровья. Профессиональная обработка — самый надёжный способ избавиться от ${genitive} раз и навсегда.`,
  
  (name: string, genitive: string) => 
    `Столкнулись с ${genitive}? Вы не одиноки — это одна из самых частых причин обращения в санитарные службы. Наши эксперты расскажут, почему самостоятельная борьба часто неэффективна и как профессионалы решают эту проблему.`,
  
  (name: string, genitive: string) => 
    `Каждый день в нашу компанию поступают десятки звонков от москвичей, столкнувшихся с ${genitive}. Это не повод для паники — проблема решаема. В этой статье мы поделимся опытом успешной борьбы с ${genitive} и расскажем, что действительно работает.`,
  
  (name: string, genitive: string) => 
    `«Откуда они взялись?» — первый вопрос, который задают наши клиенты при обнаружении ${genitive}. На самом деле пути проникновения вредителей могут быть самыми неожиданными. Разберём эту проблему детально.`,
  
  (name: string, genitive: string) => 
    `Борьба с ${genitive} — это не просто распыление инсектицида. Это целый комплекс мероприятий, требующий профессионального подхода. Рассказываем, как специалисты решают эту проблему и почему их методы эффективны.`,
];

// Вступления для статей о помещениях
const premisesIntroTemplates = [
  (objectName: string, genitive: string) => 
    `Дезинсекция ${genitive} — это комплексная профессиональная обработка, направленная на уничтожение всех видов насекомых-вредителей. Владельцы ${genitive} в Москве могут заказать услугу с гарантией результата.`,
  
  (objectName: string, genitive: string) => 
    `Профессиональная обработка ${genitive} от вредителей включает использование современных препаратов и оборудования. Специалисты имеют многолетний опыт работы с ${genitive} различных типов.`,
  
  (objectName: string, genitive: string) => 
    `Заказывая дезинсекцию ${genitive}, вы получаете полный комплекс услуг: осмотр, обработку, контроль результата и профилактические рекомендации. Работаем по всей Москве с выездом в день обращения.`,
  
  (objectName: string, genitive: string) => 
    `Владельцам ${genitive} важно понимать: вредители не исчезнут сами по себе. Чем дольше откладывать обработку, тем больше популяция и сложнее её уничтожить. Профессиональная дезинсекция решает проблему за 1-2 визита.`,
  
  (objectName: string, genitive: string) => 
    `Содержание ${genitive} в санитарном порядке — обязанность каждого владельца. При появлении вредителей важно действовать быстро, чтобы предотвратить их распространение и избежать штрафов от контролирующих органов.`,
  
  (objectName: string, genitive: string) => 
    `Обработка ${genitive} от вредителей требует профессионального подхода. Самостоятельные попытки часто приводят к временному результату и потере времени. Мы расскажем, как решить проблему раз и навсегда.`,
];

// Секции FAQ для вредителей
const pestFAQTemplates = [
  {
    question: (genitive: string) => `Как быстро действует обработка от ${genitive}?`,
    answer: (genitive: string) => `Первые результаты видны уже через несколько часов после обработки. Полное уничтожение ${genitive} происходит в течение 2-14 дней, в зависимости от степени заражения и типа используемых препаратов.`,
  },
  {
    question: (_: string) => `Безопасна ли обработка для людей и животных?`,
    answer: (_: string) => `Да, мы используем препараты IV класса опасности — самого низкого. После проветривания и соблюдения рекомендаций специалиста помещение полностью безопасно для людей и домашних животных.`,
  },
  {
    question: (genitive: string) => `Сколько стоит уничтожение ${genitive}?`,
    answer: (genitive: string) => `Стоимость обработки от ${genitive} зависит от площади помещения и степени заражения. Базовая цена для квартиры — от 1200₽. Точную стоимость можно узнать после консультации с менеджером.`,
  },
  {
    question: (genitive: string) => `Даёте ли вы гарантию на уничтожение ${genitive}?`,
    answer: (_: string) => `Да, мы предоставляем гарантию сроком до 1 года. Если вредители появятся снова в гарантийный период, проведём повторную обработку бесплатно.`,
  },
  {
    question: (_: string) => `Нужно ли покидать квартиру на время обработки?`,
    answer: (_: string) => `Да, на время обработки и 2-4 часа после неё необходимо покинуть помещение. Домашних животных также следует вывести. После проветривания можно возвращаться.`,
  },
];

// Секции FAQ для помещений
const premisesFAQTemplates = [
  {
    question: (genitive: string) => `Как подготовить ${genitive} к обработке?`,
    answer: (_: string) => `Перед обработкой необходимо: убрать продукты питания, освободить доступ к плинтусам и углам, вывести людей и животных. Подробную инструкцию предоставит наш менеджер при записи.`,
  },
  {
    question: (genitive: string) => `Сколько времени занимает обработка ${genitive}?`,
    answer: (_: string) => `Стандартная обработка занимает от 30 минут до 2 часов в зависимости от площади. После обработки требуется 2-4 часа для проветривания.`,
  },
  {
    question: (genitive: string) => `Какова стоимость обработки ${genitive}?`,
    answer: (_: string) => `Цена зависит от площади и типа вредителей. Минимальная стоимость — от 1000₽. Для точного расчёта свяжитесь с нами для бесплатной консультации.`,
  },
];

/**
 * Генерирует вступление для статьи о вредителе
 */
export function generatePestIntro(pestSlug: string, templateId: string): string {
  const pest = pests.find(p => p.slug === pestSlug);
  if (!pest) return '';
  
  const template = selectByHash(pestIntroTemplates, `${pestSlug}-${templateId}`);
  return template(pest.name, pest.genitive);
}

/**
 * Генерирует вступление для статьи о помещении
 */
export function generatePremisesIntro(objectSlug: string, templateId: string): string {
  const obj = objectTypes.find(o => o.slug === objectSlug);
  if (!obj) return '';
  
  const template = selectByHash(premisesIntroTemplates, `${objectSlug}-${templateId}`);
  return template(obj.name, obj.genitive);
}

/**
 * Генерирует FAQ для статьи о вредителе
 */
export function generatePestFAQ(pestSlug: string, count: number = 3): Array<{ question: string; answer: string }> {
  const pest = pests.find(p => p.slug === pestSlug);
  if (!pest) return [];
  
  const seed = simpleHash(pestSlug);
  const shuffled = [...pestFAQTemplates].sort((a, b) => {
    const hashA = simpleHash(a.question(pest.genitive) + seed);
    const hashB = simpleHash(b.question(pest.genitive) + seed);
    return hashA - hashB;
  });
  
  return shuffled.slice(0, count).map(template => ({
    question: template.question(pest.genitive),
    answer: template.answer(pest.genitive),
  }));
}

/**
 * Генерирует FAQ для статьи о помещении
 */
export function generatePremisesFAQ(objectSlug: string, count: number = 3): Array<{ question: string; answer: string }> {
  const obj = objectTypes.find(o => o.slug === objectSlug);
  if (!obj) return [];
  
  const seed = simpleHash(objectSlug);
  const shuffled = [...premisesFAQTemplates].sort((a, b) => {
    const hashA = simpleHash(a.question(obj.genitive) + seed);
    const hashB = simpleHash(b.question(obj.genitive) + seed);
    return hashA - hashB;
  });
  
  return shuffled.slice(0, count).map(template => ({
    question: template.question(obj.genitive),
    answer: template.answer(obj.genitive),
  }));
}

/**
 * Генерирует связанные статьи для перелинковки
 */
export function generateRelatedLinks(
  currentSlug: string, 
  category: string, 
  maxItems: number = 3
): string[] {
  // Логика определения связанных статей на основе категории и хеша
  const allRelatedSlugs: Record<string, string[]> = {
    'Дезинсекция': [
      'borba-s-tarakanami',
      'klopy-v-kvartire',
      'kak-izbavitsya-ot-muravyev',
      'blohi-v-kvartire-otkuda',
      'mol-v-kvartire',
    ],
    'Дератизация': [
      'gryzuny-v-dome',
      'priznaki-gryzunov-v-dome',
      'zapakh-posle-gryzunov',
    ],
    'Советы': [
      'kak-podgotovit-pomeshchenie',
      'kak-podgotovit-kvartiru-k-obrabotke',
      'dezinfekciya-posle-remonta',
    ],
    'Законы': [
      'trebovaniya-rospotrebnadzora-2026',
      'sanpin-dezinfekciya',
      'dokumenty-dlya-rospotrebnadzora',
    ],
  };
  
  const categoryLinks = allRelatedSlugs[category] || [];
  const filtered = categoryLinks.filter(slug => slug !== currentSlug);
  
  // Детерминированный выбор на основе хеша
  const seed = simpleHash(currentSlug);
  return filtered
    .sort((a, b) => simpleHash(a + seed) - simpleHash(b + seed))
    .slice(0, maxItems);
}

/**
 * Подсчёт слов в HTML-контенте
 */
export function countWords(htmlContent: string): number {
  const textContent = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return textContent.split(' ').filter(word => word.length > 0).length;
}
