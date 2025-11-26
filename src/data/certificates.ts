import { FileText, ScrollText, Award, UserCheck, Beaker, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  description: string;
  icon: LucideIcon;
  number: string;
}

export const certificates: Certificate[] = [
  {
    id: 1,
    title: "Свидетельство о регистрации",
    issuer: "Роспотребнадзор",
    date: "2020",
    description: "Официальная регистрация в Роспотребнадзоре для осуществления дезинфекционной деятельности на территории Москвы и Московской области",
    icon: FileText,
    number: "№ 77.01.03.001.Т.000123.01.20"
  },
  {
    id: 2,
    title: "Лицензия на дезинфекцию",
    issuer: "СЭС Москвы",
    date: "2019",
    description: "Лицензия на осуществление дезинфекционной, дезинсекционной и дератизационной деятельности",
    icon: ScrollText,
    number: "№ ЛО-77-01-012345"
  },
  {
    id: 3,
    title: "Сертификат ISO 9001",
    issuer: "TÜV SÜD",
    date: "2023",
    description: "Международный сертификат системы менеджмента качества. Подтверждает соответствие стандартам качества услуг",
    icon: Award,
    number: "№ 12345678"
  },
  {
    id: 4,
    title: "Аттестация специалистов",
    issuer: "Минздрав РФ",
    date: "2024",
    description: "Аттестация дезинфекторов высшей категории. Все специалисты прошли обучение и сертификацию",
    icon: UserCheck,
    number: "№ АТТ-2024-0567"
  },
  {
    id: 5,
    title: "Сертификат на препараты",
    issuer: "Роспотребнадзор",
    date: "2024",
    description: "Государственная регистрация используемых дезинфекционных средств. Все препараты безопасны и сертифицированы",
    icon: Beaker,
    number: "№ РОСС RU.0001.11АБ12"
  },
  {
    id: 6,
    title: "Страхование ответственности",
    issuer: "СК Альфа",
    date: "2024",
    description: "Полис страхования профессиональной ответственности на сумму 10 млн рублей. Гарантия возмещения убытков",
    icon: Shield,
    number: "№ СТР-77-2024-890"
  }
];
