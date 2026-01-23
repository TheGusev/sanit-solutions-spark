/**
 * Статьи про вредителей: 63 статьи (9 тем × 7 вредителей)
 * Генерируются на основе данных из pests.ts
 */

import { Bug, Shield, AlertTriangle, Home, Sparkles, HelpCircle, Banknote, Clock, Search } from "lucide-react";
import { pests } from "@/data/pests";
import type { BlogArticle } from "./types";

// Шаблоны для генерации статей
const articleTemplates = [
  {
    slugPrefix: 'kak-izbavitsya-ot',
    titleTemplate: 'Как избавиться от {genitive}: полный гайд 2026',
    excerptTemplate: 'Всё о борьбе с {accusative}: признаки заражения, эффективные методы уничтожения, профилактика. Советы экспертов.',
    category: 'Дезинсекция' as const,
    icon: Bug,
    readTime: '8 мин',
    wordCount: 2200,
    contentGenerator: (pest: typeof pests[0]) => `
## Признаки появления ${pest.genitive}

${pest.description}

### Как понять, что у вас ${pest.namePlural.toLowerCase()}?

${pest.signs.map(s => `- ${s}`).join('\n')}

## Методы борьбы с ${pest.genitive}

${pest.methods.map(m => `### ${m}\n\nПрофессиональный метод обработки, эффективен против ${pest.genitive}. Результат через ${pest.timeToResult}.`).join('\n\n')}

## Народные средства от ${pest.genitive}

Народные методы могут дать временный эффект, но не гарантируют полного избавления от ${pest.genitive}. Для надёжного результата рекомендуется профессиональная обработка.

## Профилактика появления ${pest.genitive}

${pest.prevention.map(p => `- ${p}`).join('\n')}

## Стоимость уничтожения ${pest.genitive}

Профессиональная обработка от ${pest.priceFrom}₽. Гарантия результата. Выезд в день обращения.

Звоните: +7 (906) 998-98-88
    `,
    faqGenerator: (pest: typeof pests[0]) => [
      { question: `Сколько стоит уничтожение ${pest.genitive}?`, answer: `Стоимость обработки от ${pest.priceFrom}₽ в зависимости от площади помещения.` },
      { question: `Как быстро исчезнут ${pest.namePlural.toLowerCase()}?`, answer: `Результат заметен через ${pest.timeToResult}. Гарантия на все работы.` },
      { question: `Безопасна ли обработка от ${pest.genitive}?`, answer: `Да, мы используем сертифицированные препараты IV класса опасности, безопасные для людей и животных после проветривания.` },
      { question: `Нужно ли покидать квартиру на время обработки?`, answer: `Рекомендуется покинуть помещение на 2-4 часа. После проветривания можно возвращаться.` },
    ]
  },
  {
    slugPrefix: 'v-kvartire',
    titleTemplate: '{name} в квартире: признаки и методы борьбы',
    excerptTemplate: 'Обнаружили {accusative} в квартире? Узнайте признаки заражения, откуда они берутся и как избавиться навсегда.',
    category: 'Дезинсекция' as const,
    icon: Home,
    readTime: '6 мин',
    wordCount: 1800,
    contentGenerator: (pest: typeof pests[0]) => `
## ${pest.namePlural} в квартире: как распознать проблему

${pest.description}

### Признаки ${pest.genitive} в квартире

${pest.signs.map(s => `- ${s}`).join('\n')}

## Откуда берутся ${pest.namePlural.toLowerCase()} в квартире?

${pest.namePlural} могут появиться в квартире несколькими путями:
- Через вентиляционные системы от соседей
- С покупками и б/у мебелью
- Через щели в стенах и полу
- С одеждой после поездок

## Что делать при обнаружении ${pest.genitive}?

1. Не паникуйте — это решаемая проблема
2. Проведите осмотр всех комнат
3. Определите масштаб заражения
4. Обратитесь к специалистам для профессиональной обработки

## Профессиональная обработка квартиры от ${pest.genitive}

Стоимость: от ${pest.priceFrom}₽
Время работы: 1-2 часа
Результат: ${pest.timeToResult}

Звоните: +7 (906) 998-98-88
    `,
    faqGenerator: (pest: typeof pests[0]) => [
      { question: `Как ${pest.namePlural.toLowerCase()} попадают в квартиру?`, answer: `Чаще всего через вентиляцию от соседей, с покупками, б/у мебелью или через щели в конструкциях.` },
      { question: `Можно ли вывести ${pest.accusative} самостоятельно?`, answer: `Магазинные средства дают временный эффект. Для полного уничтожения рекомендуется профессиональная обработка.` },
    ]
  },
  {
    slugPrefix: 'otkuda-berutsya',
    titleTemplate: 'Откуда берутся {namePlural}: причины появления',
    excerptTemplate: 'Почему появляются {namePlural} в квартире или доме? Разбираем основные причины и пути проникновения вредителей.',
    category: 'Советы' as const,
    icon: Search,
    readTime: '5 мин',
    wordCount: 1500,
    contentGenerator: (pest: typeof pests[0]) => `
## Откуда берутся ${pest.namePlural.toLowerCase()}?

${pest.description}

### Основные пути проникновения ${pest.genitive}

1. **От соседей** — через вентиляцию, щели, мусоропроводы
2. **С вещами** — б/у мебель, одежда, техника
3. **Из подвалов** — через технические коммуникации
4. **С улицы** — через окна, двери, балкон

### Факторы, привлекающие ${pest.accusative}

- Доступ к пище и воде
- Тепло и укрытия
- Антисанитарные условия
- Захламлённость помещения

## Как предотвратить появление ${pest.genitive}?

${pest.prevention.map(p => `- ${p}`).join('\n')}

## Что делать, если ${pest.namePlural.toLowerCase()} уже появились?

Профессиональная обработка — самый надёжный способ избавиться от ${pest.genitive}. Стоимость от ${pest.priceFrom}₽.
    `,
    faqGenerator: (pest: typeof pests[0]) => [
      { question: `Почему ${pest.namePlural.toLowerCase()} появляются даже в чистой квартире?`, answer: `${pest.namePlural} могут прийти от соседей или с покупками. Чистота важна, но не гарантирует защиту.` },
    ]
  },
  {
    slugPrefix: 'narodnye-sredstva-ot',
    titleTemplate: 'Народные средства от {genitive}: что работает?',
    excerptTemplate: 'Разбираем популярные народные методы борьбы с {accusative}. Что эффективно, а что — миф?',
    category: 'Советы' as const,
    icon: HelpCircle,
    readTime: '5 мин',
    wordCount: 1600,
    contentGenerator: (pest: typeof pests[0]) => `
## Народные средства от ${pest.genitive}

Многие пытаются избавиться от ${pest.genitive} народными методами. Разберём, какие из них действительно работают.

### Популярные народные методы

#### Борная кислота
Классический метод. Смешивается с яичным желтком и раскладывается в местах обитания. Эффективность: средняя, действует медленно.

#### Эфирные масла
Мята, лаванда, эвкалипт — отпугивают ${pest.accusative}, но не уничтожают. Подходит как дополнение к основной обработке.

#### Уксус
Используется для протирания поверхностей. Отпугивает ${pest.accusative}, но эффект временный.

### Почему народные средства не решают проблему?

1. Действуют только на взрослых особей
2. Не уничтожают яйца и личинки
3. ${pest.namePlural} быстро адаптируются
4. Не проникают в места укрытия

## Когда обращаться к профессионалам?

Если вы заметили признаки ${pest.genitive}, не теряйте время на эксперименты. Профессиональная обработка от ${pest.priceFrom}₽ решит проблему за ${pest.timeToResult}.
    `,
    faqGenerator: (pest: typeof pests[0]) => [
      { question: `Помогает ли борная кислота от ${pest.genitive}?`, answer: `Борная кислота действует медленно и неэффективна против крупных популяций. Для надёжного результата нужна профессиональная обработка.` },
    ]
  },
  {
    slugPrefix: 'professionalnaya-obrabotka-ot',
    titleTemplate: 'Профессиональная обработка от {genitive}: методы и цены',
    excerptTemplate: 'Как проходит профессиональная дезинсекция от {genitive}? Методы, препараты, стоимость и гарантии.',
    category: 'Дезинсекция' as const,
    icon: Shield,
    readTime: '7 мин',
    wordCount: 2000,
    contentGenerator: (pest: typeof pests[0]) => `
## Профессиональная обработка от ${pest.genitive}

Профессиональная дезинсекция — самый надёжный способ избавиться от ${pest.genitive}. Рассказываем о методах, препаратах и ценах.

### Методы обработки

${pest.methods.map(m => `#### ${m}\n\nСовременный метод, эффективный против ${pest.genitive}. Проникает во все труднодоступные места.`).join('\n\n')}

### Как проходит обработка?

1. **Диагностика** — определяем степень заражения и места обитания
2. **Подготовка** — консультируем по подготовке помещения
3. **Обработка** — применяем выбранный метод (1-2 часа)
4. **Рекомендации** — даём советы по профилактике
5. **Гарантия** — контроль результата, бесплатная повторная обработка при необходимости

### Стоимость услуг

- 1-комнатная квартира: от ${pest.priceFrom}₽
- 2-комнатная квартира: от ${Math.round(pest.priceFrom * 1.3)}₽
- 3-комнатная квартира: от ${Math.round(pest.priceFrom * 1.6)}₽
- Частный дом: от ${Math.round(pest.priceFrom * 2)}₽

### Гарантии

- Гарантия результата до 1 года
- Бесплатный выезд на повторную обработку
- Безопасные сертифицированные препараты

Звоните: +7 (906) 998-98-88
    `,
    faqGenerator: (pest: typeof pests[0]) => [
      { question: `Какие методы используются против ${pest.genitive}?`, answer: `Основные методы: ${pest.methods.join(', ')}. Выбор зависит от степени заражения и типа помещения.` },
      { question: `Сколько стоит профессиональная обработка от ${pest.genitive}?`, answer: `Стоимость от ${pest.priceFrom}₽ для 1-комнатной квартиры. Точная цена зависит от площади.` },
    ]
  },
  {
    slugPrefix: 'profilaktika',
    titleTemplate: 'Профилактика появления {genitive}: советы экспертов',
    excerptTemplate: 'Как не допустить появления {genitive}? Практические советы по профилактике от специалистов.',
    category: 'Советы' as const,
    icon: Sparkles,
    readTime: '4 мин',
    wordCount: 1200,
    contentGenerator: (pest: typeof pests[0]) => `
## Профилактика появления ${pest.genitive}

Предотвратить появление ${pest.genitive} проще и дешевле, чем бороться с ними. Следуйте нашим рекомендациям.

### Основные правила профилактики

${pest.prevention.map(p => `- ${p}`).join('\n')}

### Дополнительные меры

- Регулярно проводите генеральную уборку
- Проверяйте покупки и б/у вещи
- Общайтесь с соседями о совместной обработке подъезда
- Установите сетки на вентиляционные отверстия

### Когда нужна профилактическая обработка?

- После дезинсекции у соседей
- При переезде в новую квартиру
- Ежегодно в частных домах
- При обнаружении единичных особей

Стоимость профилактической обработки: от ${Math.round(pest.priceFrom * 0.8)}₽
    `,
    faqGenerator: (pest: typeof pests[0]) => [
      { question: `Как часто нужна профилактическая обработка от ${pest.genitive}?`, answer: `Рекомендуется проводить профилактику 1-2 раза в год, особенно в частных домах и при наличии соседей с проблемой.` },
    ]
  },
  {
    slugPrefix: 'chem-opasny',
    titleTemplate: 'Чем опасны {namePlural}: угроза здоровью',
    excerptTemplate: 'Какие болезни переносят {namePlural}? Узнайте о реальных угрозах для здоровья человека.',
    category: 'Советы' as const,
    icon: AlertTriangle,
    readTime: '5 мин',
    wordCount: 1400,
    contentGenerator: (pest: typeof pests[0]) => `
## Чем опасны ${pest.namePlural.toLowerCase()}?

${pest.description}

### Уровень опасности: ${pest.dangerLevel === 'high' ? 'ВЫСОКИЙ' : pest.dangerLevel === 'medium' ? 'СРЕДНИЙ' : 'НИЗКИЙ'}

${pest.shortDescription}

### Угрозы для здоровья

1. **Инфекционные заболевания** — ${pest.namePlural.toLowerCase()} могут переносить опасные бактерии и вирусы
2. **Аллергические реакции** — продукты жизнедеятельности вызывают аллергию
3. **Психологический дискомфорт** — стресс, нарушение сна
4. **Порча имущества** — продукты, мебель, одежда

### Группы риска

- Дети и пожилые люди
- Аллергики и астматики
- Люди с ослабленным иммунитетом

## Не откладывайте решение проблемы!

При обнаружении ${pest.genitive} действуйте быстро. Профессиональная обработка от ${pest.priceFrom}₽.
    `,
    faqGenerator: (pest: typeof pests[0]) => [
      { question: `Какие болезни переносят ${pest.namePlural.toLowerCase()}?`, answer: `${pest.namePlural} могут переносить различные инфекционные заболевания и вызывать аллергические реакции.` },
    ]
  },
  {
    slugPrefix: 'posle-obrabotki',
    titleTemplate: '{name} после обработки: что делать',
    excerptTemplate: 'Что делать после профессиональной обработки от {genitive}? Инструкция по возвращению в квартиру.',
    category: 'Советы' as const,
    icon: Clock,
    readTime: '4 мин',
    wordCount: 1100,
    contentGenerator: (pest: typeof pests[0]) => `
## После обработки от ${pest.genitive}: что нужно знать

После профессиональной дезинсекции важно правильно вернуться в помещение и соблюдать рекомендации.

### Сразу после обработки

1. Покиньте помещение на 2-4 часа
2. Заберите домашних животных
3. Не открывайте окна первые 2 часа

### Возвращение в квартиру

1. Проветрите помещение 30-60 минут
2. Протрите контактные поверхности (столы, ручки)
3. Не мойте полы 3-5 дней
4. Не трогайте стены и плинтусы 2 недели

### Когда ждать результат?

Первые результаты заметны через ${pest.timeToResult}. Полное уничтожение популяции — 2-3 недели.

### Если после обработки остались ${pest.namePlural.toLowerCase()}

Это нормально в первые дни — препарат действует постепенно. Если через 2 недели проблема сохраняется, звоните — проведём бесплатную повторную обработку по гарантии.
    `,
    faqGenerator: (pest: typeof pests[0]) => [
      { question: `Когда исчезнут ${pest.namePlural.toLowerCase()} после обработки?`, answer: `Первые результаты видны через ${pest.timeToResult}. Полное уничтожение — 2-3 недели.` },
      { question: `Можно ли мыть полы после обработки?`, answer: `Не рекомендуется мыть полы 3-5 дней, чтобы не смыть препарат. Контактные поверхности можно протереть.` },
    ]
  },
  {
    slugPrefix: 'ceny-na-unichtozhenie',
    titleTemplate: 'Цены на уничтожение {genitive} в Москве 2026',
    excerptTemplate: 'Актуальные цены на дезинсекцию от {genitive} в Москве. От чего зависит стоимость обработки?',
    category: 'Дезинсекция' as const,
    icon: Banknote,
    readTime: '4 мин',
    wordCount: 1000,
    contentGenerator: (pest: typeof pests[0]) => `
## Цены на уничтожение ${pest.genitive} в Москве

Актуальный прайс-лист на профессиональную обработку от ${pest.genitive}.

### Стоимость для квартир

| Площадь | Цена |
|---------|------|
| до 50 м² | от ${pest.priceFrom}₽ |
| 50-80 м² | от ${Math.round(pest.priceFrom * 1.3)}₽ |
| 80-120 м² | от ${Math.round(pest.priceFrom * 1.6)}₽ |
| от 120 м² | от ${Math.round(pest.priceFrom * 2)}₽ |

### Стоимость для других объектов

- Частный дом: от ${Math.round(pest.priceFrom * 1.5)}₽
- Офис: от ${Math.round(pest.priceFrom * 1.2)}₽
- Ресторан/кафе: от ${Math.round(pest.priceFrom * 2)}₽
- Склад: индивидуально

### От чего зависит цена?

1. Площадь помещения
2. Степень заражения
3. Выбранный метод обработки
4. Срочность выезда
5. Количество комнат

### Что входит в стоимость?

- Диагностика и консультация
- Все необходимые препараты
- Обработка всех помещений
- Гарантия до 1 года
- Повторная обработка при необходимости

Звоните для расчёта точной стоимости: +7 (906) 998-98-88
    `,
    faqGenerator: (pest: typeof pests[0]) => [
      { question: `Сколько стоит вывести ${pest.accusative} из квартиры?`, answer: `Стоимость от ${pest.priceFrom}₽ для квартиры до 50 м². Точная цена зависит от площади и степени заражения.` },
      { question: `Есть ли скидки на обработку от ${pest.genitive}?`, answer: `Да, действуют скидки при заказе комплексной обработки и для постоянных клиентов.` },
    ]
  }
];

// Фильтруем только насекомых (dezinsekciya)
const insectPests = pests.filter(p => p.serviceType === 'dezinsekciya');

// Генерируем статьи
export const pestsArticles: BlogArticle[] = insectPests.flatMap((pest, pestIndex) =>
  articleTemplates.map((template, templateIndex) => ({
    id: 1000 + pestIndex * 100 + templateIndex,
    slug: `${template.slugPrefix}-${pest.slug}`,
    title: template.titleTemplate
      .replace('{genitive}', pest.genitive)
      .replace('{name}', pest.name)
      .replace('{namePlural}', pest.namePlural)
      .replace('{accusative}', pest.accusative),
    excerpt: template.excerptTemplate
      .replace('{genitive}', pest.genitive)
      .replace('{accusative}', pest.accusative)
      .replace('{namePlural}', pest.namePlural.toLowerCase()),
    content: template.contentGenerator(pest),
    category: pest.serviceType === 'deratizaciya' ? 'Дератизация' : template.category,
    date: '2026-01-15',
    updatedAt: '2026-01-20',
    readTime: template.readTime,
    wordCount: template.wordCount,
    image: template.icon,
    tags: [pest.name.toLowerCase(), pest.slug, 'дезинсекция', 'вредители'],
    pest: pest.id,
    faq: template.faqGenerator(pest),
    relatedServices: [pest.serviceType]
  }))
);

// Добавляем статьи для грызунов (deratizaciya)
const rodentPests = pests.filter(p => p.serviceType === 'deratizaciya');
const rodentArticleTemplates = articleTemplates.slice(0, 5); // Берём первые 5 шаблонов

export const rodentsArticles: BlogArticle[] = rodentPests.flatMap((pest, pestIndex) =>
  rodentArticleTemplates.map((template, templateIndex) => ({
    id: 2000 + pestIndex * 100 + templateIndex,
    slug: `${template.slugPrefix}-${pest.slug}`,
    title: template.titleTemplate
      .replace('{genitive}', pest.genitive)
      .replace('{name}', pest.name)
      .replace('{namePlural}', pest.namePlural)
      .replace('{accusative}', pest.accusative),
    excerpt: template.excerptTemplate
      .replace('{genitive}', pest.genitive)
      .replace('{accusative}', pest.accusative)
      .replace('{namePlural}', pest.namePlural.toLowerCase()),
    content: template.contentGenerator(pest),
    category: 'Дератизация' as const,
    date: '2026-01-15',
    updatedAt: '2026-01-20',
    readTime: template.readTime,
    wordCount: template.wordCount,
    image: template.icon,
    tags: [pest.name.toLowerCase(), pest.slug, 'дератизация', 'грызуны'],
    pest: pest.id,
    faq: template.faqGenerator(pest),
    relatedServices: ['deratizaciya']
  }))
);

// Все статьи про вредителей
export const allPestsArticles: BlogArticle[] = [...pestsArticles, ...rodentsArticles];
