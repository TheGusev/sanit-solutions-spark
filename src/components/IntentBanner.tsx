// Динамический баннер под Hero с контентом, зависящим от интента

import { useTraffic } from '@/contexts/TrafficContext';
import { Check, Shield, FileText, Building2, Home, Warehouse } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

interface BannerContent {
  title: string;
  description: string;
  icon: typeof Home;
  features: string[];
  highlight: string;
}

const BANNER_CONTENT: Record<string, BannerContent> = {
  flat_bedbugs: {
    title: 'Обработка квартир от клопов',
    description: 'Специализируемся на полном уничтожении постельных клопов с гарантией результата',
    icon: Home,
    features: [
      'Подготовка помещения: консультация по всем этапам',
      'Профессиональные препараты без вреда для людей и животных',
      'До 30 дней гарантийного сопровождения при соблюдении условий',
      'Бесплатный повторный выезд при необходимости'
    ],
    highlight: 'Решаем проблему с первого раза'
  },
  flat_cockroaches: {
    title: 'Уничтожение тараканов в квартирах',
    description: 'Комплексная дезинсекция квартир с использованием современных методов',
    icon: Home,
    features: [
      'Эффективные препараты нового поколения',
      'Обработка всех путей проникновения насекомых',
      'Безопасно для детей и домашних животных',
      'Консультации по профилактике после обработки'
    ],
    highlight: 'Долговременная защита вашего дома'
  },
  office_disinfection: {
    title: 'Дезинфекция офисов для юридических лиц',
    description: 'Полный пакет документов для СЭС и Роспотребнадзора',
    icon: Building2,
    features: [
      'Договор на санитарные услуги с юридическим лицом',
      'Акты выполненных работ и сертификаты на препараты',
      'Работаем в удобное время, включая выходные и ночь',
      'Соответствие всем требованиям СанПиН'
    ],
    highlight: 'Готовы к проверкам контролирующих органов'
  },
  warehouse_deratization: {
    title: 'Дератизация складов и логистических центров',
    description: 'Защита продукции и оборудования от грызунов',
    icon: Warehouse,
    features: [
      'Комплексная система контроля грызунов',
      'Установка ловушек и барьерных станций',
      'Регулярные проверки и профилактика',
      'Договоры на абонентское обслуживание со скидками'
    ],
    highlight: 'Обеспечиваем непрерывную защиту объекта'
  },
  restaurant_disinfection: {
    title: 'Санитарная обработка для общепита',
    description: 'Соблюдение всех норм СЭС для предприятий общественного питания',
    icon: Building2,
    features: [
      'Обработка кухни, зала, складских помещений',
      'Документы для прохождения проверок СЭС',
      'График обслуживания с учётом режима работы',
      'Безопасные препараты без запаха'
    ],
    highlight: 'Ваш бизнес под защитой санитарных норм'
  },
  ses_check_preparation: {
    title: 'Подготовка к проверке СЭС и Роспотребнадзора',
    description: 'Срочная дезинфекция с полным комплектом документов',
    icon: FileText,
    features: [
      'Экспресс-выезд в день обращения',
      'Договор, акты, сертификаты на препараты',
      'Консультация по требованиям контролирующих органов',
      'Гарантия соответствия СанПиН'
    ],
    highlight: 'Успейте подготовиться до визита проверяющих'
  },
  b2b_general: {
    title: 'Корпоративное обслуживание для бизнеса',
    description: 'Договоры на регулярное санитарное обслуживание',
    icon: Building2,
    features: [
      'Индивидуальный план обработки под ваш объект',
      'Скидки на абонентское обслуживание до 30%',
      'Полный пакет документов для бухгалтерии',
      'Личный менеджер и приоритетная поддержка'
    ],
    highlight: 'Сэкономьте с долгосрочными контрактами'
  }
};

// Универсальный контент для неопределённого или общего интента
const DEFAULT_CONTENT: BannerContent = {
  title: 'Профессиональные санитарные услуги',
  description: 'Комплексные решения для любых объектов в Москве и МО',
  icon: Shield,
  features: [
    'Сертифицированные препараты и современное оборудование',
    'Опытные специалисты с медицинским образованием',
    'До 30 дней гарантийного сопровождения',
    'Договоры для юридических лиц и ИП'
  ],
  highlight: 'Более 500 успешно выполненных проектов'
};

export default function IntentBanner() {
  const { context, isLoading } = useTraffic();

  // Не показываем баннер, пока контекст не загружен
  if (isLoading || !context) {
    return null;
  }

  // Получаем контент в зависимости от интента
  const content = context.intent && BANNER_CONTENT[context.intent]
    ? BANNER_CONTENT[context.intent]
    : DEFAULT_CONTENT;

  const Icon = content.icon;

  return (
    <AnimatedSection animation="fade-up" className="py-8 md:py-12 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-card rounded-3xl p-6 md:p-10 shadow-xl border border-border/50">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
              {/* Иконка */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                </div>
              </div>

              {/* Контент */}
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">
                    {content.title}
                  </h3>
                  <p className="text-muted-foreground text-base md:text-lg">
                    {content.description}
                  </p>
                </div>

                {/* Особенности */}
                <ul className="grid gap-3 md:grid-cols-2">
                  {content.features.map((feature, index) => (
                    <li key={index} className="flex gap-2 items-start">
                      <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Хайлайт */}
                <div className="pt-4 border-t border-border/50">
                  <p className="text-primary font-semibold text-base md:text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    {content.highlight}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
