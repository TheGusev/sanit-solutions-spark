/**
 * Главный экспорт блога.
 * Объединяет все категории статей с приоритетами и дедупликацией.
 */

import { blogPostsWithAuthors } from '@/data/blogPosts';
import { newBlogPosts } from '@/data/newBlogPosts';
import { allPestsArticles } from './pests-articles';
import { premisesArticles } from './premises-articles';
import { allLegalArticles } from './legal-articles';
import { allB2BArticles } from './b2b-articles';
import { moleGeoArticles } from './mole-geo-articles';
import type { BlogArticle } from './types';
export { blogCategories, blogAuthors } from './types';
export type { BlogArticle, Author } from './types';

// Regex для удаления промо-хвостов из legacy-контента
const promoTailRegex = /\n+(?:.*(?:Звоните|Позвоните)[:\s]*\+7\s*\(906\)\s*998-98-88.*\n*)+/g;
const promoBlockRegex = /\n+## Мы поможем\n[\s\S]*?(?=\n## |\n*$)/g;

function cleanPromoFromContent(content: string): string {
  return content
    .replace(promoTailRegex, '\n')
    .replace(promoBlockRegex, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Улучшенная генерация tldr из excerpt + content
function generateTldr(excerpt: string, content?: string): string[] {
  // Сначала пробуем разбить excerpt по предложениям
  const sentences = excerpt.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 15);
  
  if (sentences.length >= 3) {
    return sentences.slice(0, 5);
  }
  
  // Если мало — берём из content первые абзацы (без заголовков)
  if (content) {
    const paragraphs = content
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 20 && !l.startsWith('#') && !l.startsWith('|') && !l.startsWith('-') && !l.startsWith(':::') && !l.startsWith('✅') && !l.startsWith('❌') && !l.startsWith('☐') && !l.startsWith('>'))
      .slice(0, 5);
    
    const combined = [...sentences, ...paragraphs];
    // Truncate long bullets
    const bullets = combined.map(s => s.length > 120 ? s.slice(0, 117) + '...' : s);
    const unique = [...new Set(bullets)];
    if (unique.length >= 3) return unique.slice(0, 5);
  }
  
  // Fallback: разбить excerpt по запятым/точкам с запятой
  const parts = excerpt.split(/[,;]/).map(s => s.trim()).filter(s => s.length > 15);
  if (parts.length >= 3) return parts.slice(0, 5);
  
  // Крайний случай — вернуть что есть (минимум 1)
  return sentences.length > 0 ? sentences : [excerpt.slice(0, 120)];
}

// Конвертируем legacy-статьи (blogPosts) в новый формат
const legacyArticles: BlogArticle[] = blogPostsWithAuthors.map(post => ({
  ...post,
  content: cleanPromoFromContent(post.content),
  wordCount: post.content.split(/\s+/).length,
  tldr: generateTldr(post.excerpt, post.content),
}));

// Конвертируем new-статьи (newBlogPosts) в новый формат
const newArticles: BlogArticle[] = newBlogPosts.map(post => ({
  ...post,
  content: cleanPromoFromContent(post.content),
  wordCount: post.content.split(/\s+/).length,
  tldr: generateTldr(post.excerpt, post.content),
}));

// Собираем все статьи с приоритетом (первое вхождение slug побеждает)
const allArticlesRaw: BlogArticle[] = [
  ...allLegalArticles,    // Приоритет 1: legal с sources/intent
  ...allB2BArticles,      // Приоритет 2: B2B с sources/intent/tldr
  ...allPestsArticles,    // Приоритет 3: generated с tldr/intent
  ...premisesArticles,    // Приоритет 4: generated с tldr/intent
  ...moleGeoArticles,     // Приоритет 5: geo
  ...newArticles,         // Приоритет 6: newBlogPosts (конвертированные)
  ...legacyArticles,      // Приоритет 7: legacy (самый низкий)
];

// Дедупликация по slug (первое вхождение побеждает)
const seen = new Set<string>();
export const allBlogArticles: BlogArticle[] = allArticlesRaw.filter(a => {
  if (seen.has(a.slug)) return false;
  seen.add(a.slug);
  return true;
});

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
  new: newArticles.length,
  pests: allPestsArticles.length,
  premises: premisesArticles.length,
  legal: allLegalArticles.length,
  b2b: allB2BArticles.length,
  moleGeo: moleGeoArticles.length,
};

// Экспорт по категориям
export { allPestsArticles, premisesArticles, allLegalArticles, allB2BArticles };
