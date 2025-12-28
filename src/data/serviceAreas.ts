export interface ServiceArea {
  id: string;
  name: string;
  fullName: string;
  available: boolean;
  price: string;
  responseTime?: string;
  distance?: string;
  center?: [number, number];
  color?: string;
}

export const moscowDistricts: ServiceArea[] = [
  { 
    id: "cao", 
    name: "ЦАО", 
    fullName: "Центральный АО", 
    available: true, 
    price: "от 1500₽",
    responseTime: "15-30 минут",
    center: [55.7558, 37.6173],
    color: "#4CAF50"
  },
  { 
    id: "sao", 
    name: "САО", 
    fullName: "Северный АО", 
    available: true, 
    price: "от 1500₽",
    responseTime: "15-30 минут",
    center: [55.8058, 37.5973],
    color: "#4CAF50"
  },
  { 
    id: "svao", 
    name: "СВАО", 
    fullName: "Северо-Восточный АО", 
    available: true, 
    price: "от 1800₽",
    responseTime: "20-40 минут",
    center: [55.8358, 37.6873],
    color: "#FFC107"
  },
  { 
    id: "vao", 
    name: "ВАО", 
    fullName: "Восточный АО", 
    available: true, 
    price: "от 1800₽",
    responseTime: "20-40 минут",
    center: [55.7658, 37.7473],
    color: "#FFC107"
  },
  { 
    id: "yuvao", 
    name: "ЮВАО", 
    fullName: "Юго-Восточный АО", 
    available: true, 
    price: "от 1800₽",
    responseTime: "20-40 минут",
    center: [55.6858, 37.7573],
    color: "#FFC107"
  },
  { 
    id: "yao", 
    name: "ЮАО", 
    fullName: "Южный АО", 
    available: true, 
    price: "от 1800₽",
    responseTime: "20-40 минут",
    center: [55.6158, 37.6473],
    color: "#FFC107"
  },
  { 
    id: "yzao", 
    name: "ЮЗАО", 
    fullName: "Юго-Западный АО", 
    available: true, 
    price: "от 1800₽",
    responseTime: "20-40 минут",
    center: [55.6558, 37.5473],
    color: "#FFC107"
  },
  { 
    id: "zao", 
    name: "ЗАО", 
    fullName: "Западный АО", 
    available: true, 
    price: "от 1800₽",
    responseTime: "20-40 минут",
    center: [55.7258, 37.4773],
    color: "#FFC107"
  },
  { 
    id: "szao", 
    name: "СЗАО", 
    fullName: "Северо-Западный АО", 
    available: true, 
    price: "от 1800₽",
    responseTime: "20-40 минут",
    center: [55.8058, 37.5173],
    color: "#FFC107"
  },
  { 
    id: "zelenograd", 
    name: "ЗелАО", 
    fullName: "Зеленоградский АО", 
    available: true, 
    price: "от 2500₽",
    responseTime: "40-60 минут",
    center: [55.9858, 37.2473],
    color: "#2196F3"
  },
  { 
    id: "novomoskovsk", 
    name: "НАО", 
    fullName: "Новомосковский АО", 
    available: true, 
    price: "от 2500₽",
    responseTime: "40-60 минут",
    center: [55.4358, 37.4973],
    color: "#2196F3"
  },
  { 
    id: "troitsk", 
    name: "ТАО", 
    fullName: "Троицкий АО", 
    available: true, 
    price: "от 3000₽",
    responseTime: "60-90 минут",
    center: [55.4858, 37.3273],
    color: "#2196F3"
  }
];

export const moscowRegion: ServiceArea[] = [
  { 
    id: "mo_near", 
    name: "Ближнее Подмосковье", 
    fullName: "Ближнее Подмосковье (до 30 км)", 
    available: true, 
    price: "от 2000₽",
    distance: "до 30 км от МКАД",
    responseTime: "30-60 минут"
  },
  { 
    id: "mo_far", 
    name: "Дальнее Подмосковье", 
    fullName: "Дальнее Подмосковье (30-50 км)", 
    available: true, 
    price: "от 2500₽",
    distance: "30-50 км от МКАД",
    responseTime: "60-90 минут"
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
