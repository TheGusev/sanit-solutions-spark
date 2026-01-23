/**
 * Типы для расширенной системы блога.
 * Поддерживает 150+ статей с SEO-оптимизацией.
 */

import type { LucideIcon } from "lucide-react";

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
  pest?: string;           // ID вредителя (для связи с pests.ts)
  objectType?: string;     // ID объекта (для связи с objects.ts)
  faq?: Array<{ question: string; answer: string }>;
  relatedArticles?: string[]; // slugs связанных статей
  relatedServices?: string[]; // slugs связанных услуг
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
