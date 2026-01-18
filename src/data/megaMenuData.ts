/**
 * === MEGA MENU DATA ===
 * Данные для расширенного меню навигации по услугам
 * 
 * @description 4 колонки с категориями услуг
 * @note Все URL ведут на существующие страницы услуг
 */

export interface MegaMenuLink {
  text: string;
  url: string;
  popular?: boolean;
}

export interface MegaMenuSection {
  title: string;
  icon: string;
  links: MegaMenuLink[];
}

export interface MegaMenuService {
  icon: string;
  name: string;
  description: string;
  url: string;
}

export interface MegaMenuColumn {
  id: string;
  title: string;
  icon: string;
  sections?: MegaMenuSection[];
  services?: MegaMenuService[];
}

export interface MegaMenuBanner {
  title: string;
  phone: string;
  buttonText: string;
}

export interface MegaMenuData {
  columns: MegaMenuColumn[];
  banner: MegaMenuBanner;
}

export const megaMenuData: MegaMenuData = {
  columns: [
    {
      id: 'dezinsekciya',
      title: 'Дезинсекция',
      icon: '🐜',
      sections: [
        {
          title: 'По вредителям',
          icon: '🦟',
          links: [
            { text: 'Уничтожение клопов', url: '/uslugi/dezinsekciya/unichtozhenie-klopov', popular: true },
            { text: 'Уничтожение тараканов', url: '/uslugi/dezinsekciya/unichtozhenie-tarakanov', popular: true },
            { text: 'Уничтожение муравьёв', url: '/uslugi/dezinsekciya/unichtozhenie-muravev' },
            { text: 'Уничтожение блох', url: '/uslugi/dezinsekciya/unichtozhenie-bloh' },
            { text: 'Уничтожение комаров', url: '/uslugi/dezinsekciya/unichtozhenie-komarov' },
            { text: 'Уничтожение мух', url: '/uslugi/dezinsekciya/unichtozhenie-muh' },
          ]
        }
      ]
    },
    {
      id: 'dezinfekciya',
      title: 'Дезинфекция',
      icon: '🧴',
      sections: [
        {
          title: 'По типам помещений',
          icon: '🏢',
          links: [
            { text: 'Квартиры', url: '/uslugi/dezinfekciya/kvartir' },
            { text: 'Дома', url: '/uslugi/dezinfekciya/domov' },
            { text: 'Офисы', url: '/uslugi/dezinfekciya/ofisov' },
            { text: 'Склады', url: '/uslugi/dezinfekciya/skladov' },
            { text: 'Магазины', url: '/uslugi/dezinfekciya/magazinov' },
          ]
        },
        {
          title: 'По методам',
          icon: '💨',
          links: [
            { text: 'Холодный туман', url: '/uslugi/dezinfekciya/holodnyj-tuman' },
            { text: 'Горячий туман', url: '/uslugi/dezinfekciya/goryachij-tuman' },
          ]
        }
      ]
    },
    {
      id: 'deratizaciya',
      title: 'Дератизация',
      icon: '🐀',
      sections: [
        {
          title: 'Уничтожение грызунов',
          icon: '🪤',
          links: [
            { text: 'Уничтожение крыс', url: '/uslugi/deratizaciya/unichtozhenie-krys' },
            { text: 'Уничтожение мышей', url: '/uslugi/deratizaciya/unichtozhenie-myshej' },
          ]
        }
      ]
    },
    {
      id: 'other',
      title: 'Другие услуги',
      icon: '⚡',
      services: [
        { 
          icon: '💨', 
          name: 'Озонирование', 
          description: 'Устранение запахов',
          url: '/uslugi/ozonirovanie' 
        },
        { 
          icon: '🌸', 
          name: 'Дезодорация', 
          description: 'Профессиональная',
          url: '/uslugi/dezodoraciya' 
        },
        { 
          icon: '📋', 
          name: 'Сертификация', 
          description: 'Санитарные документы',
          url: '/uslugi/sertifikaciya' 
        },
      ]
    }
  ],
  banner: {
    title: 'Акция -15% на комплексную обработку',
    phone: '+7 (906) 998-98-88',
    buttonText: 'Бесплатная консультация'
  }
};
