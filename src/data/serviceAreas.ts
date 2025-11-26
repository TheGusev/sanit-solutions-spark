export interface ServiceArea {
  id: string;
  name: string;
  fullName: string;
  available: boolean;
  price: string;
  responseTime?: string;
  distance?: string;
}

export const moscowDistricts: ServiceArea[] = [
  { 
    id: "cao", 
    name: "ЦАО", 
    fullName: "Центральный АО", 
    available: true, 
    price: "от 2500₽",
    responseTime: "30-60 минут"
  },
  { 
    id: "sao", 
    name: "САО", 
    fullName: "Северный АО", 
    available: true, 
    price: "от 2500₽",
    responseTime: "30-60 минут"
  },
  { 
    id: "svao", 
    name: "СВАО", 
    fullName: "Северо-Восточный АО", 
    available: true, 
    price: "от 2700₽",
    responseTime: "40-90 минут"
  },
  { 
    id: "vao", 
    name: "ВАО", 
    fullName: "Восточный АО", 
    available: true, 
    price: "от 2700₽",
    responseTime: "40-90 минут"
  },
  { 
    id: "yuvao", 
    name: "ЮВАО", 
    fullName: "Юго-Восточный АО", 
    available: true, 
    price: "от 2700₽",
    responseTime: "40-90 минут"
  },
  { 
    id: "yao", 
    name: "ЮАО", 
    fullName: "Южный АО", 
    available: true, 
    price: "от 2700₽",
    responseTime: "40-90 минут"
  },
  { 
    id: "yzao", 
    name: "ЮЗАО", 
    fullName: "Юго-Западный АО", 
    available: true, 
    price: "от 2700₽",
    responseTime: "40-90 минут"
  },
  { 
    id: "zao", 
    name: "ЗАО", 
    fullName: "Западный АО", 
    available: true, 
    price: "от 2700₽",
    responseTime: "40-90 минут"
  },
  { 
    id: "szao", 
    name: "СЗАО", 
    fullName: "Северо-Западный АО", 
    available: true, 
    price: "от 2700₽",
    responseTime: "40-90 минут"
  },
  { 
    id: "zelenograd", 
    name: "ЗелАО", 
    fullName: "Зеленоградский АО", 
    available: true, 
    price: "от 3500₽",
    responseTime: "90-120 минут"
  },
  { 
    id: "novomoskovsk", 
    name: "НАО", 
    fullName: "Новомосковский АО", 
    available: true, 
    price: "от 3500₽",
    responseTime: "90-120 минут"
  },
  { 
    id: "troitsk", 
    name: "ТАО", 
    fullName: "Троицкий АО", 
    available: true, 
    price: "от 4000₽",
    responseTime: "90-150 минут"
  }
];

export const moscowRegion: ServiceArea[] = [
  { 
    id: "mo_near", 
    name: "Ближнее Подмосковье", 
    fullName: "Ближнее Подмосковье (до 30 км)", 
    available: true, 
    price: "от 3000₽",
    distance: "до 30 км от МКАД",
    responseTime: "1-2 часа"
  },
  { 
    id: "mo_far", 
    name: "Дальнее Подмосковье", 
    fullName: "Дальнее Подмосковье (30-50 км)", 
    available: true, 
    price: "от 4000₽",
    distance: "30-50 км от МКАД",
    responseTime: "2-3 часа"
  },
  { 
    id: "mo_remote", 
    name: "Отдалённые районы", 
    fullName: "Отдалённые районы МО (50+ км)", 
    available: true, 
    price: "по запросу",
    distance: "более 50 км от МКАД",
    responseTime: "по согласованию"
  }
];
