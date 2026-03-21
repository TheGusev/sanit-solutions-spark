import { Building2, Landmark, UtensilsCrossed, Car, Hotel, Briefcase, Factory, TreePine, Users, Home, Warehouse, ShieldCheck } from 'lucide-react';
import { DistrictPage } from '@/data/districtPages';

type ServiceType = 'dezinfekciya' | 'dezinsekciya' | 'deratizaciya';

const SERVICE_SPECIFICS_LABELS: Record<ServiceType, string> = {
  dezinfekciya: 'дезинфекции',
  dezinsekciya: 'дезинсекции',
  deratizaciya: 'дератизации',
};

// Icon mapping for specifics
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'building': Building2,
  'landmark': Landmark,
  'restaurant': UtensilsCrossed,
  'car': Car,
  'hotel': Hotel,
  'business': Briefcase,
  'factory': Factory,
  'park': TreePine,
  'residential': Users,
  'home': Home,
  'warehouse': Warehouse,
  'shield': ShieldCheck,
};

// Service-specific description adapters
const SERVICE_DESCRIPTION_ADAPTERS: Record<ServiceType, (baseDesc: string, title: string) => string> = {
  dezinfekciya: (desc) => desc,
  dezinsekciya: (desc, title) => {
    const t = title.toLowerCase();
    if (t.includes('бизнес-центр') || t.includes('офис')) return desc.replace(/Работаем в нерабочее время\.?/, 'Уничтожаем тараканов и клопов в офисах без запаха.');
    if (t.includes('ресторан') || t.includes('кафе') || t.includes('общепит')) return desc.replace(/Выдаём документы для Роспотребнадзора\.?/, 'Уничтожаем тараканов, мух и муравьёв. Выдаём акт для СЭС.');
    if (t.includes('склад') || t.includes('логистик')) return desc.replace(/Близость к .+ обеспечивает много складских комплексов\.?/, 'Складские комплексы — рассадник тараканов и жуков. Обрабатываем площади от 500 м².');
    if (t.includes('парк') || t.includes('лес') || t.includes('бор')) return desc.replace(/(?:Безопасные средства для работы|Уникальная экологическая зона|Один из крупнейших парков).*/, 'Обработка от клещей, комаров и мошки. Безопасные препараты.');
    if (t.includes('первые этаж') || t.includes('подвал')) return desc.replace(/Особое внимание к квартирам над подвалами\.?/, 'Тараканы и блохи из подвалов — обрабатываем квартиры и подвалы комплексно.');
    if (t.includes('панельн') || t.includes('высотк') || t.includes('жк')) return desc.replace(/Опыт с панельками.*/, 'В панельках насекомые мигрируют по стоякам — обрабатываем по всему стояку.');
    if (t.includes('частный сектор') || t.includes('коттедж') || t.includes('таунхаус')) return desc.replace(/Обрабатываем (?:частные дома|коттеджи).*/, 'Дезинсекция участков и домов от муравьёв, ос, клещей.');
    if (t.includes('новостройк')) return desc.replace(/Много (?:новых|современных) ЖК.*/, 'Новостройки заселяются насекомыми из соседних квартир. Барьерная обработка.');
    return desc;
  },
  deratizaciya: (desc, title) => {
    const t = title.toLowerCase();
    if (t.includes('бизнес-центр') || t.includes('офис')) return desc.replace(/Работаем в нерабочее время\.?/, 'Устанавливаем приманочные станции и проводим мониторинг грызунов.');
    if (t.includes('ресторан') || t.includes('кафе') || t.includes('общепит')) return desc.replace(/Выдаём документы для Роспотребнадзора\.?/, 'Дератизация пищевых объектов. Приманки в защитных контейнерах, безопасных для посетителей.');
    if (t.includes('склад') || t.includes('логистик')) return desc.replace(/Близость к .+ обеспечивает много складских комплексов\.?/, 'Склады привлекают крыс и мышей. Устанавливаем приманочные станции по периметру.');
    if (t.includes('промзон') || t.includes('промышлен') || t.includes('производств')) return desc.replace(/(?:Много промышленных объектов|Перово, Соколиная гора).*/, 'Промзоны — основной источник грызунов. Комплексная дератизация территории.');
    if (t.includes('парк') || t.includes('лес') || t.includes('бор')) return desc.replace(/(?:Безопасные средства|Обработка от клещей|Уникальная экологическая зона).*/, 'Грызуны мигрируют из парковых зон. Барьерная дератизация по периметру участков.');
    if (t.includes('первые этаж') || t.includes('подвал')) return desc.replace(/Особое внимание к квартирам над подвалами\.?/, 'Мыши и крысы в подвалах — главная проблема первых этажей. Герметизация + приманки.');
    if (t.includes('частный сектор') || t.includes('коттедж') || t.includes('мкад')) return desc.replace(/Обрабатываем (?:частные дома|коттеджи).*|Особый опыт с домами вдоль МКАД.*/, 'Дератизация частных домов и участков. Устанавливаем приманочные станции по периметру.');
    if (t.includes('очистн')) return desc.replace(/Особый опыт работы рядом с очистными.*/, 'Очистные сооружения привлекают крыс. Регулярная дератизация по договору.');
    return desc;
  },
};

// Default specifics based on district characteristics
const getDefaultSpecifics = (district: DistrictPage, serviceType: ServiceType = 'dezinfekciya') => {
  const adapter = SERVICE_DESCRIPTION_ADAPTERS[serviceType];
  const specifics: { icon: string; title: string; description: string }[] = [];
  
  if (district.id === 'cao') {
    specifics.push(
      { icon: 'building', title: 'Много бизнес-центров', description: 'В ЦАО расположены крупнейшие офисные здания Москвы. Работаем в нерабочее время.' },
      { icon: 'landmark', title: 'Исторические здания', description: 'Старый жилой фонд требует особого подхода. Знаем специфику сталинских домов.' },
      { icon: 'restaurant', title: 'Рестораны и кафе', description: 'ЦАО — центр ресторанной жизни. Выдаём документы для Роспотребнадзора.' },
      { icon: 'car', title: 'Быстрая доступность', description: 'Наша база в пределах ТТК. Добираемся за 20-30 минут даже в час пик.' },
      { icon: 'hotel', title: 'Гостиницы и хостелы', description: 'Работаем с отелями любого класса. Дискретная обработка.' },
      { icon: 'business', title: 'Корпоративные клиенты', description: 'Обслуживаем крупный бизнес. Договор с отсрочкой платежа.' }
    );
  } else if (district.id === 'sao') {
    specifics.push(
      { icon: 'residential', title: 'Спальные районы', description: 'Много жилых массивов с панельными домами 70-80-х годов.' },
      { icon: 'warehouse', title: 'Склады и логистика', description: 'Близость к Ленинградке обеспечивает много складских комплексов.' },
      { icon: 'park', title: 'Парковые зоны', description: 'Тимирязевский парк, Петровский парк — особые условия обработки.' },
      { icon: 'home', title: 'Первые этажи', description: 'Особое внимание к квартирам над подвалами.' },
      { icon: 'shield', title: 'Работа с ТСЖ', description: 'Заключаем договоры на регулярное обслуживание.' },
      { icon: 'car', title: 'Быстрый выезд', description: 'Добираемся до Водного стадиона за 20 минут.' }
    );
  } else if (district.id === 'svao') {
    specifics.push(
      { icon: 'residential', title: 'Крупнейшие ЖК', description: 'СВАО — один из самых населённых округов. Много высоток.' },
      { icon: 'landmark', title: 'ВДНХ и Останкино', description: 'Обрабатываем объекты рядом с главными достопримечательностями.' },
      { icon: 'park', title: 'Лосиный остров', description: 'Безопасные средства для работы рядом с нацпарком.' },
      { icon: 'home', title: 'Панельные дома', description: 'Опыт с панельками 70-80-х, обработка по стоякам.' },
      { icon: 'business', title: 'Скидки пенсионерам', description: '10% скидка для пенсионеров по удостоверению.' },
      { icon: 'car', title: 'Выезд на ВДНХ', description: 'Добираемся до ВДНХ за 30 минут.' }
    );
  } else if (district.id === 'vao') {
    specifics.push(
      { icon: 'park', title: 'Измайловский парк', description: 'Один из крупнейших парков Европы. Специфика лесных вредителей.' },
      { icon: 'factory', title: 'Промышленные зоны', description: 'Перово, Соколиная гора — опыт работы с производствами.' },
      { icon: 'home', title: 'Частный сектор', description: 'Обрабатываем частные дома в Косино-Ухтомском.' },
      { icon: 'residential', title: 'Новостройки', description: 'Много новых ЖК в Новогиреево и Косино.' },
      { icon: 'shield', title: 'Безопасные средства', description: 'Экологичные препараты для работы у парков.' },
      { icon: 'car', title: 'Выезд в Новогиреево', description: 'Добираемся за 30 минут.' }
    );
  } else if (district.id === 'yuvao') {
    specifics.push(
      { icon: 'factory', title: 'Промзоны и склады', description: 'Много промышленных объектов требуют регулярной дератизации.' },
      { icon: 'warehouse', title: 'Курьяновские очистные', description: 'Особый опыт работы рядом с очистными сооружениями.' },
      { icon: 'residential', title: 'Спальные районы', description: 'Люблино, Марьино, Кузьминки — большие жилые массивы.' },
      { icon: 'business', title: 'Договоры с УК', description: 'Работаем с управляющими компаниями крупных ЖК.' },
      { icon: 'shield', title: 'Борьба с грызунами', description: 'Специализация на дератизации в промзонах.' },
      { icon: 'car', title: 'Выезд в Люблино', description: 'Добираемся за 35 минут.' }
    );
  } else if (district.id === 'yao') {
    specifics.push(
      { icon: 'park', title: 'Царицыно и Коломенское', description: 'Музеи-заповедники требуют деликатного подхода.' },
      { icon: 'residential', title: 'Крупнейший округ', description: 'ЮАО — самый большой по площади. Знаем все районы.' },
      { icon: 'home', title: 'Дома у МКАД', description: 'Особый опыт с домами вдоль МКАД — проблема грызунов.' },
      { icon: 'park', title: 'Битцевский лес', description: 'Обработка от клещей весной и летом.' },
      { icon: 'shield', title: 'Зелёные зоны', description: 'Безопасные средства для работы у парков.' },
      { icon: 'car', title: 'Выезд в Чертаново', description: 'Добираемся за 30 минут.' }
    );
  } else if (district.id === 'yzao') {
    specifics.push(
      { icon: 'residential', title: 'Престижные районы', description: 'МГУ, Воробьёвы горы — элитная недвижимость.' },
      { icon: 'landmark', title: 'МГУ и научные центры', description: 'Обрабатываем общежития и научные институты.' },
      { icon: 'park', title: 'Воробьёвы горы', description: 'Работа рядом с заповедной зоной.' },
      { icon: 'home', title: 'Новая Москва', description: 'Обслуживаем присоединённые территории.' },
      { icon: 'business', title: 'Академическая среда', description: 'Опыт работы с вузами и НИИ.' },
      { icon: 'car', title: 'Выезд на Юго-Западную', description: 'Добираемся за 30 минут.' }
    );
  } else if (district.id === 'zao') {
    specifics.push(
      { icon: 'residential', title: 'Семейные районы', description: 'Много качественного жилья для семей с детьми.' },
      { icon: 'business', title: 'Бизнес-парки', description: 'Сколково и IT-кластеры рядом.' },
      { icon: 'park', title: 'Парк Победы', description: 'Поклонная гора и мемориальные комплексы.' },
      { icon: 'home', title: 'Новостройки', description: 'Много современных ЖК комфорт и бизнес-класса.' },
      { icon: 'shield', title: 'Экологичность', description: 'Один из самых зелёных округов Москвы.' },
      { icon: 'car', title: 'Выезд на Кунцевскую', description: 'Добираемся за 35 минут.' }
    );
  } else if (district.id === 'szao') {
    specifics.push(
      { icon: 'park', title: 'Серебряный бор', description: 'Уникальная экологическая зона на северо-западе.' },
      { icon: 'residential', title: 'Строгино', description: 'Спальный район с хорошей экологией.' },
      { icon: 'home', title: 'Частный сектор', description: 'Обрабатываем коттеджи и таунхаусы.' },
      { icon: 'park', title: 'Москва-река', description: 'Много объектов у воды — специфические вредители.' },
      { icon: 'shield', title: 'Экологичные средства', description: 'Безопасные препараты для заповедных зон.' },
      { icon: 'car', title: 'Выезд в Строгино', description: 'Добираемся за 40 минут.' }
    );
  } else if (district.id === 'nao') {
    specifics.push(
      { icon: 'home', title: 'Новая Москва', description: 'Активная застройка — много новостроек и коттеджных посёлков.' },
      { icon: 'park', title: 'Природные зоны', description: 'Леса и поля — специфика загородных вредителей.' },
      { icon: 'residential', title: 'ЖК и таунхаусы', description: 'Современные жилые комплексы и малоэтажная застройка.' },
      { icon: 'car', title: 'Выезд в НАО', description: 'Добираемся за 45-60 минут.' }
    );
  } else if (district.id === 'tao') {
    specifics.push(
      { icon: 'home', title: 'Троицк и окрестности', description: 'Научный городок и частный сектор.' },
      { icon: 'park', title: 'Лесные массивы', description: 'Обработка от клещей и лесных вредителей.' },
      { icon: 'factory', title: 'Научные институты', description: 'Опыт работы с лабораториями и НИИ.' },
      { icon: 'car', title: 'Выезд в ТАО', description: 'Добираемся за 50-70 минут.' }
    );
  } else if (district.id === 'zelao') {
    specifics.push(
      { icon: 'home', title: 'Зеленоград', description: 'Город-спутник с развитой инфраструктурой.' },
      { icon: 'factory', title: 'Технополис', description: 'Электронная промышленность и IT-кластер.' },
      { icon: 'residential', title: 'Микрорайоны', description: 'Классическая советская застройка и новостройки.' },
      { icon: 'car', title: 'Выезд в Зеленоград', description: 'Добираемся за 50-60 минут по Ленинградке.' }
    );
  }
  
  // Apply service-specific adaptations
  return specifics.map(s => ({
    ...s,
    description: adapter(s.description, s.title),
  }));
};

interface DistrictSpecificsProps {
  district: DistrictPage;
  serviceType?: ServiceType;
}

const DistrictSpecifics = ({ district, serviceType = 'dezinfekciya' }: DistrictSpecificsProps) => {
  const specifics = getDefaultSpecifics(district, serviceType);

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          Особенности {SERVICE_SPECIFICS_LABELS[serviceType]} в {district.name}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specifics.map((spec, idx) => {
            const IconComponent = iconMap[spec.icon] || Building2;
            return (
              <div 
                key={idx}
                className="bg-background rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{spec.title}</h3>
                <p className="text-muted-foreground text-sm">{spec.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DistrictSpecifics;
