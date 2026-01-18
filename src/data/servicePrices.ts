export interface ServicePrice {
  id: string;
  service: string;
  object: string;
  price: string;
  category: 'dezinfekciya' | 'dezinsekciya' | 'deratizaciya' | 'ozonirovanie' | 'dezodoraciya' | 'sertifikaciya';
  isPopular?: boolean;
  icon?: string;
}

export const servicePrices: ServicePrice[] = [
  // Дезинфекция
  { 
    id: "dez-1k", 
    service: "Дезинфекция", 
    object: "1-комнатная квартира", 
    price: "от 1000 ₽",
    category: "dezinfekciya",
    isPopular: true,
    icon: "🧹"
  },
  { 
    id: "dez-2k", 
    service: "Дезинфекция", 
    object: "2-3 комнатная квартира", 
    price: "от 1500 ₽",
    category: "dezinfekciya"
  },
  { 
    id: "dez-office", 
    service: "Дезинфекция", 
    object: "Офис до 50 м²", 
    price: "от 1800 ₽",
    category: "dezinfekciya"
  },
  { 
    id: "dez-sklad", 
    service: "Дезинфекция", 
    object: "Склад от 100 м²", 
    price: "от 2500 ₽",
    category: "dezinfekciya"
  },
  
  // Дезинсекция
  { 
    id: "dins-1k", 
    service: "Дезинсекция (клопы, тараканы)", 
    object: "1-комнатная квартира", 
    price: "от 1200 ₽",
    category: "dezinsekciya",
    isPopular: true,
    icon: "🐜"
  },
  { 
    id: "dins-2k", 
    service: "Дезинсекция", 
    object: "2-3 комнатная квартира", 
    price: "от 1800 ₽",
    category: "dezinsekciya"
  },
  { 
    id: "dins-dom", 
    service: "Дезинсекция", 
    object: "Частный дом", 
    price: "от 2000 ₽",
    category: "dezinsekciya"
  },
  
  // Дератизация
  { 
    id: "derat-kvart", 
    service: "Дератизация (мыши, крысы)", 
    object: "Квартира", 
    price: "от 1400 ₽",
    category: "deratizaciya",
    isPopular: true,
    icon: "🐀"
  },
  { 
    id: "derat-dom", 
    service: "Дератизация", 
    object: "Частный дом", 
    price: "от 2000 ₽",
    category: "deratizaciya"
  },
  { 
    id: "derat-sklad", 
    service: "Дератизация", 
    object: "Склад / подвал", 
    price: "от 2500 ₽",
    category: "deratizaciya"
  },
  
  // Озонирование
  { 
    id: "ozon-kvart", 
    service: "Озонирование", 
    object: "Квартира до 50 м²", 
    price: "от 1500 ₽",
    category: "ozonirovanie",
    isPopular: true,
    icon: "🌬️"
  },
  { 
    id: "ozon-office", 
    service: "Озонирование", 
    object: "Офис 50–100 м²", 
    price: "от 2000 ₽",
    category: "ozonirovanie"
  },
  
  // Дезодорация
  { 
    id: "dezod-kvart", 
    service: "Дезодорация", 
    object: "Квартира", 
    price: "от 1200 ₽",
    category: "dezodoraciya",
    isPopular: true,
    icon: "💨"
  },
  { 
    id: "dezod-pozhar", 
    service: "Дезодорация", 
    object: "После пожара / затопления", 
    price: "от 2500 ₽",
    category: "dezodoraciya"
  },
  
  // Сертификация
  { 
    id: "sert-doc", 
    service: "Сертификация", 
    object: "Документы для СЭС", 
    price: "от 3000 ₽",
    category: "sertifikaciya",
    isPopular: true,
    icon: "📋"
  }
];

export const includedServices = [
  "Бесплатный выезд и диагностика (для ЦАО/САО)",
  "Обработка помещения (холодный/горячий туман)",
  "Безопасные препараты IV класса опасности",
  "Гарантия результата до 1 года",
  "Договор и акт выполненных работ",
  "Консультация специалиста 24/7"
];

export const discounts = [
  { icon: "🎁", text: "15% при заказе 2 и более услуг" },
  { icon: "🎁", text: "10% для постоянных клиентов" },
  { icon: "🎁", text: "5% при оплате онлайн" },
  { icon: "🎁", text: "Бесплатная повторная обработка по гарантии" }
];
