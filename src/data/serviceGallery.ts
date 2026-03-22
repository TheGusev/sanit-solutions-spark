export interface GalleryItem {
  src: string;
  title: string;
  desc: string;
  badge: string;
  badgeColor: string;
}

export const SERVICE_GALLERY: Record<string, GalleryItem[]> = {
  'borba-s-krotami': [
    { src: '/images/services/mole-hero.png', title: 'Проблема: кротовины на газоне', desc: 'Свежие кротовины разрушают газон и грядки. Чем раньше начать борьбу — тем проще устранить.', badge: 'До обработки', badgeColor: 'bg-destructive text-destructive-foreground' },
    { src: '/images/services/mole-work.png', title: 'Процесс: работа специалиста', desc: 'Установка ловушек и газация тоннелей — безопасно для животных и растений.', badge: 'Процесс', badgeColor: 'bg-primary text-primary-foreground' },
    { src: '/images/services/mole-result.png', title: 'Результат: чистый участок', desc: 'Ровный газон, барьерная защита и гарантия от повторного появления кротов.', badge: 'После', badgeColor: 'bg-green-600 text-white' },
  ],
  'dezinsekciya': [
    { src: '/images/services/dezinsection-before.png', title: 'Проблема: насекомые в квартире', desc: 'Тараканы, клопы и другие вредители у плинтусов и в щелях — признак заражения.', badge: 'До обработки', badgeColor: 'bg-destructive text-destructive-foreground' },
    { src: '/images/services/dezinsection-process.png', title: 'Процесс: обработка помещения', desc: 'Специалист в защитном костюме распыляет сертифицированное средство по всей площади.', badge: 'Процесс', badgeColor: 'bg-primary text-primary-foreground' },
    { src: '/images/services/dezinsection-after.png', title: 'Результат: чистое помещение', desc: 'Кухня и комнаты полностью свободны от вредителей. Гарантия до 3 лет.', badge: 'После', badgeColor: 'bg-green-600 text-white' },
  ],
  'deratizaciya': [
    { src: '/images/services/deratization-before.png', title: 'Проблема: следы грызунов', desc: 'Погрызенные провода и помёт — первые признаки присутствия крыс или мышей.', badge: 'До обработки', badgeColor: 'bg-destructive text-destructive-foreground' },
    { src: '/images/services/deratization-process.png', title: 'Процесс: установка ловушек', desc: 'Размещение приманочных станций и механических ловушек в ключевых точках.', badge: 'Процесс', badgeColor: 'bg-primary text-primary-foreground' },
    { src: '/images/services/deratization-after.png', title: 'Результат: защищённое помещение', desc: 'Щели заделаны, станции установлены, помещение полностью очищено от грызунов.', badge: 'После', badgeColor: 'bg-green-600 text-white' },
  ],
  'dezinfekciya': [
    { src: '/images/services/dezinfection-before.png', title: 'Проблема: плесень и загрязнения', desc: 'Чёрная плесень на стенах и потолке — угроза здоровью и разрушение отделки.', badge: 'До обработки', badgeColor: 'bg-destructive text-destructive-foreground' },
    { src: '/images/services/dezinfection-process.png', title: 'Процесс: генератор холодного тумана', desc: 'Обработка помещения мелкодисперсным дезинфицирующим раствором.', badge: 'Процесс', badgeColor: 'bg-primary text-primary-foreground' },
    { src: '/images/services/dezinfection-after.png', title: 'Результат: стерильное помещение', desc: 'Чистые стены, уничтожены бактерии и споры плесени. Безопасно для проживания.', badge: 'После', badgeColor: 'bg-green-600 text-white' },
  ],
};

export const GALLERY_SUBTITLES: Record<string, string> = {
  'borba-s-krotami': 'Реальные фото с объектов — до и после обработки участка от кротов',
  'dezinsekciya': 'Фото с объектов — до и после дезинсекции помещений',
  'deratizaciya': 'Фото с объектов — до и после дератизации',
  'dezinfekciya': 'Фото с объектов — до и после дезинфекции помещений',
};
