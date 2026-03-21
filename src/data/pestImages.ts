/**
 * Маппинг вредителей к их изображениям
 * Используется для динамического отображения изображений на страницах
 */

export interface PestImage {
  slug: string;
  name: string;
  image: string;
  altText: string;
  description: string;
}

export const pestImages: PestImage[] = [
  {
    slug: 'tarakany',
    name: 'Тараканы',
    image: '/images/pests/cockroach.png',
    altText: 'Таракан на кухне - профессиональное уничтожение в Москве',
    description: 'Профессиональное уничтожение тараканов с гарантией результата'
  },
  {
    slug: 'klopy',
    name: 'Клопы',
    image: '/images/pests/bedbug.png',
    altText: 'Постельный клоп - профессиональная обработка от клопов',
    description: 'Эффективная обработка от постельных клопов современными методами'
  },
  {
    slug: 'kleshchi',
    name: 'Клещи',
    image: '/images/pests/tick.png',
    altText: 'Клещ на траве - акарицидная обработка участка',
    description: 'Защита от клещей на участке с использованием сертифицированных препаратов'
  },
  {
    slug: 'komary',
    name: 'Комары',
    image: '/images/pests/mosquito.png',
    altText: 'Комар - обработка от комаров и мошек',
    description: 'Комплексная защита от комаров и других летающих насекомых'
  },
  {
    slug: 'blohi',
    name: 'Блохи',
    image: '/images/pests/flea.png',
    altText: 'Блоха под микроскопом - уничтожение блох в квартире',
    description: 'Профессиональное уничтожение блох в квартире и доме'
  },
  {
    slug: 'muravyi',
    name: 'Муравьи',
    image: '/images/pests/ant.png',
    altText: 'Черный муравей - борьба с муравьями в доме',
    description: 'Эффективное уничтожение домашних и садовых муравьев'
  },
  {
    slug: 'mukhi',
    name: 'Мухи',
    image: '/images/pests/fly.png',
    altText: 'Муха крупным планом - дезинсекция от мух',
    description: 'Профессиональная обработка помещений от мух и других летающих насекомых'
  },
  {
    slug: 'krysy',
    name: 'Крысы',
    image: '/images/pests/rat.png',
    altText: 'Крыса на складе - профессиональная дератизация',
    description: 'Эффективная дератизация от крыс с долгосрочной гарантией'
  },
  {
    slug: 'myshi',
    name: 'Мыши',
    image: '/images/pests/rat.png',
    altText: 'Мышь - уничтожение мышей в доме и на участке',
    description: 'Профессиональное уничтожение мышей безопасными методами'
  },
  {
    slug: 'kroty',
    name: 'Кроты',
    image: '/images/pests/mole.png',
    altText: 'Крот на дачном участке — профессиональное уничтожение кротов на газоне и в саду',
    description: 'Профессиональная борьба с кротами на участке: защита газона, сада и корневой системы'
  },
  {
    slug: 'mol',
    name: 'Моль',
    image: '/images/pests/moth.png',
    altText: 'Пищевая моль - обработка от моли в квартире',
    description: 'Избавление от моли в квартире современными методами'
  }
];

// Функция для получения изображения вредителя по slug
export const getPestImage = (slug: string): PestImage | undefined => {
  return pestImages.find(pest => pest.slug === slug);
};

// Получить список основных вредителей для галереи
export const getMainPests = (): PestImage[] => {
  const mainSlugs = ['tarakany', 'klopy', 'muravyi', 'blohi', 'krysy', 'myshi'];
  return pestImages.filter(pest => mainSlugs.includes(pest.slug));
};
