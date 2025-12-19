// Определение интента пользователя на основе UTM, keyword и URL

interface TrafficParams {
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
  keyword?: string | null;
}

// Маппинг ID объявлений Яндекс.Директ → intent
// Эти ID берутся из utm_content при переходе с рекламы Яндекса
const YANDEX_AD_CONTENT_MAP: Record<string, string> = {
  // Объявления про клопов
  '1896192950900970725': 'flat_bedbugs',
  '1896192950900970726': 'flat_bedbugs',
  
  // Объявления про тараканов
  '1896192950900970724': 'flat_cockroaches',
  '1896192950900970723': 'flat_cockroaches',
  
  // Общие объявления про квартиры
  '1896192950900970722': 'flat_general',
  '1896192950900970721': 'flat_general',
  
  // Офисы и коммерция
  '1896112079889432763': 'office_disinfection',
  '1896112079889432764': 'office_general',
  
  // Склады
  '1896112079889432770': 'warehouse_deratization',
  '1896112079889432771': 'warehouse_general',
  
  // B2B и корпоративные клиенты
  '1896192925132502592': 'b2b_general',
  '1896192925132502593': 'b2b_general',
  
  // Рестораны и общепит
  '1896112079889432780': 'restaurant_disinfection',
  '1896112079889432781': 'restaurant_general',
  
  // Подготовка к проверке СЭС
  '1896112079889432790': 'ses_check_preparation',
};

// Словарь ключевых фраз для определения интента
const INTENT_KEYWORDS: Record<string, string[]> = {
  flat_bedbugs: [
    'квартира клопы', 'клопы квартира', 'уничтожение клопов', 'клопы дома',
    'постельные клопы', 'обработка от клопов квартира', 'вывести клопов',
    'apartment bedbugs', 'flat bedbugs'
  ],
  flat_cockroaches: [
    'тараканы квартира', 'дезинсекция квартиры', 'уничтожение тараканов',
    'тараканы дома', 'травля тараканов', 'вывести тараканов',
    'cockroaches flat', 'apartment cockroaches'
  ],
  flat_general: [
    'дезинфекция квартиры', 'дезинсекция квартира', 'обработка квартиры',
    'санитарная обработка квартира', 'квартира обработка'
  ],
  office_disinfection: [
    'дезинфекция офиса', 'офис дезинфекция', 'санитарная обработка офиса',
    'обработка офиса', 'офисное помещение дезинфекция',
    'office disinfection', 'офис санобработка'
  ],
  office_general: [
    'дезинсекция офиса', 'дератизация офиса', 'офис обработка',
    'коммерческое помещение обработка'
  ],
  warehouse_deratization: [
    'склад грызуны', 'дератизация склада', 'крысы на складе',
    'мыши склад', 'уничтожение грызунов склад', 'склад дератизация',
    'warehouse deratization', 'warehouse rodents'
  ],
  warehouse_general: [
    'дезинсекция склада', 'дезинфекция склада', 'обработка склада',
    'складское помещение обработка'
  ],
  restaurant_disinfection: [
    'ресторан дезинфекция', 'кафе дезинфекция', 'санобработка ресторана',
    'общепит дезинфекция', 'кухня ресторана обработка',
    'restaurant disinfection', 'cafe disinfection'
  ],
  restaurant_general: [
    'дезинсекция ресторана', 'дератизация ресторана', 'кафе обработка',
    'общепит санобработка'
  ],
  ses_check_preparation: [
    'проверка сэс', 'роспотребнадзор проверка', 'подготовка к проверке сэс',
    'сэс документы', 'санэпидемстанция проверка', 'сэс готовность',
    'ses check', 'rospotrebnadzor'
  ],
  b2b_general: [
    'для юридических лиц', 'для бизнеса', 'корпоративные клиенты',
    'юр лица', 'договор обслуживания', 'b2b',
    'для компаний', 'коммерческая недвижимость'
  ],
  production_facility: [
    'производство дезинфекция', 'завод обработка', 'цех дезинсекция',
    'промышленное предприятие', 'производственное помещение'
  ],
  shop_store: [
    'магазин дезинфекция', 'торговый зал обработка', 'розница дезинсекция',
    'shop disinfection', 'retail disinfection'
  ]
};

// Маппинг campaign/content → intent
const CAMPAIGN_INTENT_MAP: Record<string, string> = {
  'b2b': 'b2b_general',
  'corporate': 'b2b_general',
  'business': 'b2b_general',
  'office': 'office_general',
  'warehouse': 'warehouse_general',
  'restaurant': 'restaurant_general',
  'flat': 'flat_general',
  'apartment': 'flat_general',
  'ses': 'ses_check_preparation',
  'check': 'ses_check_preparation'
};

/**
 * Проверка, является ли источник трафика Яндексом
 */
function isYandexSource(utmSource: string | null | undefined): boolean {
  if (!utmSource) return false;
  const source = utmSource.toLowerCase();
  return source.includes('yandex') || source === 'ya' || source === 'yd';
}

/**
 * Определение интента на основе трафика и пути
 */
export function detectIntent(
  params: TrafficParams,
  path: string = ''
): string | null {
  // 1. Сначала проверяем по ключевым фразам в utm_term и keyword
  const searchPhrase = (params.keyword || params.utm_term || '').toLowerCase();
  
  if (searchPhrase && !searchPhrase.includes('autotargeting')) {
    for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
      if (keywords.some(keyword => searchPhrase.includes(keyword))) {
        return intent;
      }
    }
  }
  
  // 2. НОВОЕ: Проверяем ID объявления Яндекс.Директ (utm_content)
  if (params.utm_content) {
    const adIntent = YANDEX_AD_CONTENT_MAP[params.utm_content];
    if (adIntent) {
      return adIntent;
    }
  }
  
  // 3. Проверяем по utm_campaign и utm_content (слова, не числовые ID)
  const campaign = (params.utm_campaign || '').toLowerCase();
  const content = (params.utm_content || '').toLowerCase();
  
  // Пропускаем числовые utm_content (это ID объявлений)
  const isNumericContent = /^\d+$/.test(params.utm_content || '');
  
  for (const [key, intent] of Object.entries(CAMPAIGN_INTENT_MAP)) {
    if (campaign.includes(key) || (!isNumericContent && content.includes(key))) {
      return intent;
    }
  }
  
  // 4. Проверяем по пути URL
  if (path.includes('/kvartiry') || path.includes('/apartment')) {
    return 'flat_general';
  }
  if (path.includes('/ofis') || path.includes('/office')) {
    return 'office_general';
  }
  if (path.includes('/sklad') || path.includes('/warehouse')) {
    return 'warehouse_general';
  }
  if (path.includes('/restoran') || path.includes('/restaurant')) {
    return 'restaurant_general';
  }
  
  // 5. НОВОЕ: Fallback для Яндекс-трафика — показываем контент для квартир
  // (основная аудитория из Яндекса — частные лица)
  if (isYandexSource(params.utm_source)) {
    return 'flat_general';
  }
  
  // Если не удалось определить интент
  return null;
}

/**
 * Определить источник интента для аналитики
 */
export function getIntentSource(
  params: TrafficParams,
  path: string = ''
): 'keyword' | 'yandex_ad' | 'campaign' | 'url_path' | 'yandex_fallback' | 'unknown' {
  const searchPhrase = (params.keyword || params.utm_term || '').toLowerCase();
  
  if (searchPhrase && !searchPhrase.includes('autotargeting')) {
    for (const keywords of Object.values(INTENT_KEYWORDS)) {
      if (keywords.some(keyword => searchPhrase.includes(keyword))) {
        return 'keyword';
      }
    }
  }
  
  if (params.utm_content && YANDEX_AD_CONTENT_MAP[params.utm_content]) {
    return 'yandex_ad';
  }
  
  const campaign = (params.utm_campaign || '').toLowerCase();
  const content = (params.utm_content || '').toLowerCase();
  const isNumericContent = /^\d+$/.test(params.utm_content || '');
  
  for (const key of Object.keys(CAMPAIGN_INTENT_MAP)) {
    if (campaign.includes(key) || (!isNumericContent && content.includes(key))) {
      return 'campaign';
    }
  }
  
  if (path.includes('/kvartiry') || path.includes('/apartment') ||
      path.includes('/ofis') || path.includes('/office') ||
      path.includes('/sklad') || path.includes('/warehouse') ||
      path.includes('/restoran') || path.includes('/restaurant')) {
    return 'url_path';
  }
  
  if (isYandexSource(params.utm_source)) {
    return 'yandex_fallback';
  }
  
  return 'unknown';
}

/**
 * Получить человекочитаемое описание интента
 */
export function getIntentDescription(intent: string | null): string {
  const descriptions: Record<string, string> = {
    flat_bedbugs: 'Обработка квартиры от клопов',
    flat_cockroaches: 'Обработка квартиры от тараканов',
    flat_general: 'Дезинфекция квартиры',
    office_disinfection: 'Дезинфекция офиса',
    office_general: 'Обработка офиса',
    warehouse_deratization: 'Дератизация склада',
    warehouse_general: 'Обработка склада',
    restaurant_disinfection: 'Дезинфекция ресторана',
    restaurant_general: 'Обработка ресторана',
    ses_check_preparation: 'Подготовка к проверке СЭС',
    b2b_general: 'Корпоративное обслуживание',
    production_facility: 'Обработка производства',
    shop_store: 'Обработка магазина'
  };
  
  return intent ? descriptions[intent] || 'Общая обработка' : 'Общая обработка';
}
