/**
 * Типы для расширенной системы блога.
 * Поддерживает 150+ статей с SEO-оптимизацией.
 */

import type { LucideIcon } from "lucide-react";

// Интерфейс автора статьи
export interface Author {
  id: string;
  name: string;
  role: string;
  experience: string;
  style: 'formal' | 'practical' | 'technical' | 'friendly' | 'expert' | 'concise';
  specialization: string[];
}

// Массив авторов с уникальными характеристиками
export const blogAuthors: Author[] = [
  {
    id: 'gusev-m',
    name: 'Максим Гусев',
    role: 'Ведущий дезинфектор',
    experience: '8 лет',
    style: 'practical',
    specialization: ['тараканы', 'клопы', 'квартиры', 'дезинсекция']
  },
  {
    id: 'afanasiev',
    name: 'Александр Афанасьев',
    role: 'Специалист по дератизации',
    experience: '5 лет',
    style: 'expert',
    specialization: ['грызуны', 'крысы', 'мыши', 'склады', 'дератизация']
  },
  {
    id: 'gusev-v',
    name: 'Владимир Гусев',
    role: 'Мастер-дезинфектор',
    experience: '7 лет',
    style: 'technical',
    specialization: ['препараты', 'технологии', 'озонирование', 'туман']
  },
  {
    id: 'ivanov',
    name: 'Андрей Иванов',
    role: 'Мастер-дезинсектор',
    experience: '10 лет',
    style: 'friendly',
    specialization: ['муравьи', 'блохи', 'моль', 'жилые дома', 'квартира']
  },
  {
    id: 'vasiliev',
    name: 'Эдуард Васильев',
    role: 'Эксперт по санитарии',
    experience: '12 лет',
    style: 'formal',
    specialization: ['законы', 'СанПиН', 'документация', 'общепит', 'Роспотребнадзор']
  },
  {
    id: 'uchaev',
    name: 'Владимир Учаев',
    role: 'Специалист по коммерческим объектам',
    experience: '7 лет',
    style: 'concise',
    specialization: ['офисы', 'рестораны', 'склады', 'производство', 'коммерческие']
  }
];

export interface BlogArticleSource {
  title: string;
  url: string;
  publisher?: string;
}

export type BlogArticleIntent =
  | 'guide' | 'howto' | 'price' | 'checklist'
  | 'symptoms' | 'prevention' | 'health-risk'
  | 'laws' | 'docs' | 'geo';

export interface BlogArticle {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Дезинфекция' | 'Дезинсекция' | 'Дератизация' | 'Советы' | 'Законы' | 'Препараты' | 'Кейсы';
  date: string;
  updatedAt?: string;
  readTime: string;
  wordCount?: number;
  image?: LucideIcon;
  tags: string[];
  pest?: string;
  objectType?: string;
  faq?: Array<{ question: string; answer: string }>;
  relatedArticles?: string[];
  relatedServices?: string[];
  author?: string;
  authorRole?: string;
  /** 3-6 буллетов для блока "Кратко" */
  tldr?: string[];
  /** Источники и нормативные документы */
  sources?: BlogArticleSource[];
  /** Тип интента статьи для AI-цитируемости */
  intent?: BlogArticleIntent;
  /** Уровень промо-контента: 0=нет, 1=компактный CTA, 2=полный */
  promoLevel?: 0 | 1 | 2;
}

export interface BlogCategory {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

// Все доступные категории
export const blogCategories = [
  'Все',
  'Дезинфекция',
  'Дезинсекция', 
  'Дератизация',
  'Советы',
  'Законы',
  'Препараты',
  'Кейсы'
] as const;

export type BlogCategoryType = typeof blogCategories[number];
