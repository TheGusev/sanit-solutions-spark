/**
 * Данные городов МО для коммерческих лендингов «Борьба с кротами в [Город]».
 * Маршрут: /uslugi/borba-s-krotami/:citySlug/
 */

export interface MoleCity {
  slug: string;
  name: string;
  prepositional: string; // "в Истре", "в Красногорске"
  highway: string;
  soilType: string;
  distanceFromMkad: string;
  responseTime: string;
  landmarks: string[];
  faq: Array<{ question: string; answer: string }>;
  relatedCities: string[]; // slugs
  blogSlug?: string; // связь с блог-статьёй
}

export const moleCities: MoleCity[] = [
  // ===== НОВОРИЖСКОЕ ШОССЕ =====
  {
    slug: 'istra',
    name: 'Истра',
    prepositional: 'в Истре',
    highway: 'Новорижское шоссе',
    soilType: 'Плодородный суглинок на основе моренных отложений',
    distanceFromMkad: '45 км',
    responseTime: '1 час',
    landmarks: ['Истринское водохранилище', 'Новоиерусалимский монастырь'],
    faq: [
      { question: 'Почему в Истре так много кротов?', answer: 'Истринский район отличается плодородными почвами и близостью лесных массивов. Обилие дождевых червей привлекает кротов.' },
      { question: 'Обрабатываете ли вы СНТ в Истринском районе?', answer: 'Да, выезжаем во все СНТ. Групповые скидки от 3 участков.' },
      { question: 'Через сколько дней кроты исчезнут?', answer: 'Активность снижается за 3-5 дней. Полное решение — 1-2 недели.' },
    ],
    relatedCities: ['krasnogorsk', 'nakhabino', 'dedovsk'],
    blogSlug: 'kroty-istra',
  },
  {
    slug: 'krasnogorsk',
    name: 'Красногорск',
    prepositional: 'в Красногорске',
    highway: 'Новорижское шоссе',
    soilType: 'Лёгкий суглинок, хорошо аэрируемый',
    distanceFromMkad: '5 км',
    responseTime: '30 мин',
    landmarks: ['КП Рублёво-Архангельское', 'Красногорский городской парк'],
    faq: [
      { question: 'Какие районы Красногорска обслуживаете?', answer: 'Все: Павшинская пойма, Опалиха, Нахабино, Красногорск-Сити и все КП/СНТ.' },
      { question: 'Можно вызвать на осмотр бесплатно?', answer: 'Да, специалист выезжает бесплатно для оценки масштаба проблемы.' },
      { question: 'Работаете ли зимой?', answer: 'Оптимальный период — апрель-ноябрь. Зимой кроты уходят глубже.' },
    ],
    relatedCities: ['istra', 'nakhabino', 'odintsovo'],
    blogSlug: 'kroty-krasnogorsk',
  },
  {
    slug: 'nakhabino',
    name: 'Нахабино',
    prepositional: 'в Нахабино',
    highway: 'Новорижское шоссе',
    soilType: 'Пойменный суглинок с примесью песка',
    distanceFromMkad: '18 км',
    responseTime: '40 мин',
    landmarks: ['река Нахабинка', 'парк Нахабино'],
    faq: [
      { question: 'Сколько стоит обработка в Нахабино?', answer: 'От 3 000 ₽ за участок до 6 соток. Точная стоимость зависит от площади.' },
      { question: 'Есть ли скидки для соседей?', answer: 'Да, при заказе от 3 участков — скидка 15% каждому.' },
      { question: 'Какие методы используете?', answer: 'Газация тоннелей, кротоловки, обработка периметра репеллентами.' },
    ],
    relatedCities: ['krasnogorsk', 'dedovsk', 'istra'],
    blogSlug: 'kroty-nakhabino',
  },
  {
    slug: 'dedovsk',
    name: 'Дедовск',
    prepositional: 'в Дедовске',
    highway: 'Новорижское шоссе',
    soilType: 'Супесчаный грунт с плодородным слоем',
    distanceFromMkad: '18 км',
    responseTime: '40 мин',
    landmarks: ['Дедовский парк', 'река Истра'],
    faq: [
      { question: 'Как далеко от МКАД вы выезжаете?', answer: 'До 80 км от МКАД без доплаты за выезд.' },
      { question: 'Повредят ли препараты деревья?', answer: 'Нет, препараты воздействуют только на кротов. Безопасны для растений.' },
      { question: 'Нужна ли повторная обработка?', answer: 'В 85% случаев достаточно одной. Повторный выезд бесплатно по гарантии.' },
    ],
    relatedCities: ['nakhabino', 'istra', 'krasnogorsk'],
    blogSlug: 'kroty-dedovsk',
  },
  // ===== РУБЛЁВСКОЕ ШОССЕ =====
  {
    slug: 'odintsovo',
    name: 'Одинцово',
    prepositional: 'в Одинцово',
    highway: 'Рублёвское шоссе',
    soilType: 'Дерново-подзолистый суглинок',
    distanceFromMkad: '12 км',
    responseTime: '30 мин',
    landmarks: ['Одинцовский парк', 'Баковский лесопарк'],
    faq: [
      { question: 'Как быстро приедете в Одинцово?', answer: 'Выезжаем в день обращения, время в пути — 30-40 минут.' },
      { question: 'Можно обработать участок без хозяина?', answer: 'Да, если есть доступ на территорию.' },
      { question: 'Эффективна ли обработка в дождь?', answer: 'Газация тоннелей эффективна в любую погоду.' },
    ],
    relatedCities: ['barvikha', 'usovo', 'zhukovka'],
    blogSlug: 'kroty-odintsovo',
  },
  {
    slug: 'barvikha',
    name: 'Барвиха',
    prepositional: 'в Барвихе',
    highway: 'Рублёвское шоссе',
    soilType: 'Плодородный суглинок с высоким содержанием органики',
    distanceFromMkad: '8 км',
    responseTime: '25 мин',
    landmarks: ['Барвиха Luxury Village', 'Жуковский лес'],
    faq: [
      { question: 'Сохранится ли ландшафтный дизайн?', answer: 'Полностью. Засыпаем кротовины, восстанавливаем дёрн. Работаем аккуратно.' },
      { question: 'Есть ли опыт работы в элитных КП?', answer: 'Да, обслуживаем КП Барвихи, Жуковки и Усово более 5 лет.' },
      { question: 'Стоимость для большого участка (50+ соток)?', answer: 'От 25 000 ₽ за разовую обработку. Звоните для точного расчёта.' },
    ],
    relatedCities: ['odintsovo', 'usovo', 'zhukovka'],
    blogSlug: 'kroty-barvikha',
  },
  {
    slug: 'usovo',
    name: 'Усово',
    prepositional: 'в Усово',
    highway: 'Рублёвское шоссе',
    soilType: 'Пойменный суглинок московской террасы',
    distanceFromMkad: '15 км',
    responseTime: '35 мин',
    landmarks: ['Усовский парк', 'река Москва'],
    faq: [
      { question: 'Почему в Усово много кротов?', answer: 'Близость поймы Москвы-реки, плодородные почвы и обилие червей.' },
      { question: 'Обрабатываете участки у реки?', answer: 'Да, используем препараты, безопасные для водоёмов.' },
      { question: 'Как часто нужно обрабатывать?', answer: '1-2 раза за сезон. При абонементе контролируем ситуацию.' },
    ],
    relatedCities: ['barvikha', 'zhukovka', 'odintsovo'],
    blogSlug: 'kroty-usovo',
  },
  {
    slug: 'zhukovka',
    name: 'Жуковка',
    prepositional: 'в Жуковке',
    highway: 'Рублёвское шоссе',
    soilType: 'Аллювиальный суглинок с высоким плодородием',
    distanceFromMkad: '10 км',
    responseTime: '30 мин',
    landmarks: ['КП Жуковка-1', 'КП Жуковка-2'],
    faq: [
      { question: 'Как предотвратить появление после обработки?', answer: 'Барьерная защита: вибрационные отпугиватели + обработка почвы репеллентами.' },
      { question: 'Безопасно ли для домашних животных?', answer: 'Полностью. Препараты IV класса опасности безопасны для питомцев.' },
      { question: 'Работаете по выходным?', answer: 'Ежедневно с 8:00 до 21:00, включая выходные.' },
    ],
    relatedCities: ['barvikha', 'usovo', 'odintsovo'],
    blogSlug: 'kroty-zhukovka',
  },
  // ===== ДМИТРОВСКОЕ ШОССЕ =====
  {
    slug: 'lobnya',
    name: 'Лобня',
    prepositional: 'в Лобне',
    highway: 'Дмитровское шоссе',
    soilType: 'Суглинок с торфяными вкраплениями',
    distanceFromMkad: '14 км',
    responseTime: '30 мин',
    landmarks: ['озеро Киово', 'Лобненский парк'],
    faq: [
      { question: 'Почему в Лобне много кротов?', answer: 'Близость озера Киово и торфяные почвы создают идеальные условия.' },
      { question: 'Безопасна ли обработка у водоёма?', answer: 'Да, препараты сертифицированы для применения вблизи водоёмов.' },
      { question: 'Обрабатываете огороды?', answer: 'Да. Безопасно для овощей — сбор урожая через 3 дня.' },
    ],
    relatedCities: ['dolgoprudny', 'dmitrov', 'yakhroma'],
    blogSlug: 'kroty-lobnya',
  },
  {
    slug: 'dolgoprudny-mo',
    name: 'Долгопрудный',
    prepositional: 'в Долгопрудном',
    highway: 'Дмитровское шоссе',
    soilType: 'Дерново-подзолистый суглинок',
    distanceFromMkad: '6 км',
    responseTime: '20 мин',
    landmarks: ['канал им. Москвы', 'Долгопрудненский парк'],
    faq: [
      { question: 'Как быстро приедете в Долгопрудный?', answer: '6 км от МКАД. Время в пути 20-30 минут.' },
      { question: 'Обрабатываете территории у канала?', answer: 'Да, все типы участков, включая прибрежные.' },
      { question: 'Можно заказать срочно?', answer: 'Да, выезд за 2-3 часа. Доплата за срочность — 30%.' },
    ],
    relatedCities: ['lobnya', 'dmitrov', 'yakhroma'],
    blogSlug: 'kroty-dolgoprudny',
  },
  {
    slug: 'dmitrov-mo',
    name: 'Дмитров',
    prepositional: 'в Дмитрове',
    highway: 'Дмитровское шоссе',
    soilType: 'Тяжёлый суглинок Клинско-Дмитровской гряды',
    distanceFromMkad: '65 км',
    responseTime: '1.5 часа',
    landmarks: ['Дмитровский кремль', 'горнолыжный курорт Сорочаны'],
    faq: [
      { question: 'Выезжаете ли в Дмитров (65 км от МКАД)?', answer: 'Да, Дмитров входит в зону обслуживания. Выезд бесплатный.' },
      { question: 'Какие участки чаще страдают?', answer: 'На склонах гряды, у ручьёв и в низинах — везде, где почва рыхлая и влажная.' },
      { question: 'Работаете с юрлицами?', answer: 'Да, полный комплект закрывающих документов.' },
    ],
    relatedCities: ['yakhroma', 'lobnya', 'dolgoprudny-mo'],
    blogSlug: 'kroty-dmitrov',
  },
  {
    slug: 'yakhroma',
    name: 'Яхрома',
    prepositional: 'в Яхроме',
    highway: 'Дмитровское шоссе',
    soilType: 'Пойменный суглинок Яхромской долины',
    distanceFromMkad: '55 км',
    responseTime: '1 час',
    landmarks: ['канал им. Москвы', 'горнолыжные курорты Яхромы'],
    faq: [
      { question: 'Почему у канала много кротов?', answer: 'Пойменные почвы Яхромской долины — самые плодородные в Подмосковье.' },
      { question: 'Как защитить участок надолго?', answer: 'Обработка + подземная сетка + вибрационные отпугиватели — защита на 2-3 года.' },
      { question: 'Обрабатываете территории горнолыжных курортов?', answer: 'Да, обрабатываем в межсезонье.' },
    ],
    relatedCities: ['dmitrov-mo', 'lobnya', 'dolgoprudny-mo'],
    blogSlug: 'kroty-yakhroma',
  },
  // ===== ДОПОЛНИТЕЛЬНЫЕ ГОРОДА =====
  {
    slug: 'chekhov-mo',
    name: 'Чехов',
    prepositional: 'в Чехове',
    highway: 'Симферопольское шоссе',
    soilType: 'Дерново-подзолистый суглинок с высоким плодородием',
    distanceFromMkad: '52 км',
    responseTime: '1 час',
    landmarks: ['усадьба Мелихово', 'река Лопасня'],
    faq: [
      { question: 'Выезжаете ли в Чехов?', answer: 'Да, Чехов в зоне обслуживания. Выезд бесплатный при заказе обработки.' },
      { question: 'Какие методы эффективнее для суглинка?', answer: 'Газация тоннелей + кротоловки в активных ходах. 95% эффективность.' },
      { question: 'Обрабатываете ли дачные участки?', answer: 'Да, работаем с частными участками, СНТ и ДНП.' },
    ],
    relatedCities: ['serpukhov', 'naro-fominsk', 'domodedovo-mo'],
  },
  {
    slug: 'serpukhov',
    name: 'Серпухов',
    prepositional: 'в Серпухове',
    highway: 'Симферопольское шоссе',
    soilType: 'Аллювиальный суглинок Окской поймы',
    distanceFromMkad: '73 км',
    responseTime: '1.5 часа',
    landmarks: ['Серпуховский кремль', 'река Ока'],
    faq: [
      { question: 'Далеко ли ехать до Серпухова?', answer: 'Около 73 км от МКАД. Выезд бесплатный, приезжаем в день обращения.' },
      { question: 'Кроты активны круглый год?', answer: 'Наиболее активны с апреля по ноябрь. В это время обработка наиболее эффективна.' },
      { question: 'Даёте ли гарантию?', answer: 'Гарантия 6 месяцев. Повторный выезд бесплатно в гарантийный период.' },
    ],
    relatedCities: ['chekhov-mo', 'naro-fominsk'],
  },
  {
    slug: 'naro-fominsk',
    name: 'Наро-Фоминск',
    prepositional: 'в Наро-Фоминске',
    highway: 'Киевское шоссе',
    soilType: 'Тяжёлый суглинок с высоким содержанием глины',
    distanceFromMkad: '50 км',
    responseTime: '1 час',
    landmarks: ['река Нара', 'Наро-Фоминский парк'],
    faq: [
      { question: 'Обслуживаете ли Наро-Фоминский район?', answer: 'Да, весь район: город, дачные посёлки, СНТ.' },
      { question: 'Безопасны ли препараты?', answer: 'Полностью. IV класс опасности — безопасно для людей, животных и растений.' },
      { question: 'Сколько стоит обработка?', answer: 'От 3 000 ₽ за участок до 6 соток. Точная цена — после осмотра.' },
    ],
    relatedCities: ['chekhov-mo', 'mozhaysk', 'odintsovo'],
  },
  {
    slug: 'mozhaysk',
    name: 'Можайск',
    prepositional: 'в Можайске',
    highway: 'Минское шоссе',
    soilType: 'Моренный суглинок с валунами',
    distanceFromMkad: '90 км',
    responseTime: '1.5 часа',
    landmarks: ['Можайский кремль', 'Можайское водохранилище'],
    faq: [
      { question: 'Выезжаете ли за 80 км от МКАД?', answer: 'Да, Можайск в зоне обслуживания. Выезд без доплаты.' },
      { question: 'Как записаться?', answer: 'Позвоните по телефону — согласуем удобную дату и время выезда.' },
      { question: 'Какой результат ожидать?', answer: 'Снижение активности за 3-5 дней, полное решение — 1-2 недели.' },
    ],
    relatedCities: ['naro-fominsk', 'istra'],
  },
  {
    slug: 'klin-mo',
    name: 'Клин',
    prepositional: 'в Клину',
    highway: 'Ленинградское шоссе',
    soilType: 'Дерново-подзолистый суглинок',
    distanceFromMkad: '65 км',
    responseTime: '1 час',
    landmarks: ['Дом-музей Чайковского', 'Сенежское озеро'],
    faq: [
      { question: 'Обрабатываете ли участки у Сенежского озера?', answer: 'Да, обрабатываем все типы участков в Клинском районе, включая прибрежные.' },
      { question: 'Почему в Клину много кротов?', answer: 'Мягкие дерново-подзолистые почвы и обилие лесов создают идеальную среду.' },
      { question: 'Можно заключить абонемент на сезон?', answer: 'Да, сезонный абонемент — от 12 000 ₽. 3-4 выезда с полной защитой.' },
    ],
    relatedCities: ['solnechnogorsk', 'istra', 'dmitrov-mo'],
  },
  {
    slug: 'solnechnogorsk',
    name: 'Солнечногорск',
    prepositional: 'в Солнечногорске',
    highway: 'Ленинградское шоссе',
    soilType: 'Суглинок с примесью торфа',
    distanceFromMkad: '44 км',
    responseTime: '50 мин',
    landmarks: ['озеро Сенеж', 'парк Солнечногорска'],
    faq: [
      { question: 'Как быстро приедете?', answer: '44 км от МКАД, время в пути — около 50 минут.' },
      { question: 'Обрабатываете территории у озера Сенеж?', answer: 'Да, используем безопасные для водоёмов препараты.' },
      { question: 'Есть ли скидки для СНТ?', answer: 'Да, от 5 участков — скидка 20%.' },
    ],
    relatedCities: ['klin-mo', 'istra', 'krasnogorsk'],
  },
  {
    slug: 'domodedovo-mo',
    name: 'Домодедово',
    prepositional: 'в Домодедово',
    highway: 'Каширское шоссе',
    soilType: 'Чернозёмовидный суглинок',
    distanceFromMkad: '22 км',
    responseTime: '35 мин',
    landmarks: ['аэропорт Домодедово', 'река Пахра'],
    faq: [
      { question: 'Как быстро приедете в Домодедово?', answer: '22 км от МКАД, время в пути — 30-40 минут.' },
      { question: 'Обрабатываете участки у Пахры?', answer: 'Да, все типы участков, включая прибрежные зоны.' },
      { question: 'Работаете с коттеджными посёлками?', answer: 'Да, обслуживаем все КП Домодедовского района.' },
    ],
    relatedCities: ['chekhov-mo', 'serpukhov'],
  },
];

// Slug-массив для SSG
export const moleCitySlugs = moleCities.map(c => c.slug);

// Получить город по slug
export function getMoleCityBySlug(slug: string): MoleCity | undefined {
  return moleCities.find(c => c.slug === slug);
}
