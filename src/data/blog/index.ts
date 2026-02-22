/**
 * Главный экспорт блога.
 * Объединяет все категории статей.
 */

import { blogPostsWithAuthors } from '@/data/blogPosts';
import { allPestsArticles } from './pests-articles';
import { premisesArticles } from './premises-articles';
import { allLegalArticles } from './legal-articles';
import { moleGeoArticles } from './mole-geo-articles';
import type { BlogArticle } from './types';
export { blogCategories, blogAuthors } from './types';
export type { BlogArticle, Author } from './types';

// Авто-генерация tldr из excerpt для legacy статей
function generateTldrFromExcerpt(excerpt: string): string[] {
  const sentences = excerpt.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 10);
  return sentences.slice(0, 3);
}

// Конвертируем старые статьи в новый формат (теперь с авторами)
const legacyArticles: BlogArticle[] = blogPostsWithAuthors.map(post => ({
  ...post,
  wordCount: post.content.split(/\s+/).length,
  tldr: generateTldrFromExcerpt(post.excerpt),
}));

// Объединяем все статьи
export const allBlogArticles: BlogArticle[] = [
  ...legacyArticles,
  ...allPestsArticles,
  ...premisesArticles,
  ...allLegalArticles,
  ...moleGeoArticles,
];

// Получить статью по slug
export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return allBlogArticles.find(a => a.slug === slug);
}

// Получить статьи по категории
export function getArticlesByCategory(category: string): BlogArticle[] {
  if (category === 'Все') return allBlogArticles;
  return allBlogArticles.filter(a => a.category === category);
}

// Получить связанные статьи
export function getRelatedArticles(article: BlogArticle, limit = 3): BlogArticle[] {
  return allBlogArticles
    .filter(a => 
      a.slug !== article.slug && 
      (a.category === article.category || 
       a.tags.some(t => article.tags.includes(t)))
    )
    .slice(0, limit);
}

// Получить статьи по вредителю
export function getArticlesByPest(pestId: string): BlogArticle[] {
  return allBlogArticles.filter(a => a.pest === pestId);
}

// Получить статьи по типу объекта
export function getArticlesByObject(objectId: string): BlogArticle[] {
  return allBlogArticles.filter(a => a.objectType === objectId);
}

// Статистика
export const blogStats = {
  total: allBlogArticles.length,
  legacy: legacyArticles.length,
  pests: allPestsArticles.length,
  premises: premisesArticles.length,
  legal: allLegalArticles.length,
};

// Экспорт по категориям
export { allPestsArticles, premisesArticles, allLegalArticles };
