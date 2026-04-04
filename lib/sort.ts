import type { ArticleFrontmatter } from '@/lib/mdx';

// Feature: rugby-media-nextjs
export type SortOrder = 'level' | 'popular' | 'newest';

const LEVEL_ORDER: Record<ArticleFrontmatter['level'], number> = {
  初級: 0,
  中級: 1,
  上級: 2,
};

/**
 * Sort articles by the given order.
 * - level:   初級(0) → 中級(1) → 上級(2)
 * - popular: descending like count
 * - newest:  descending publication date
 */
export function sortArticles(
  articles: ArticleFrontmatter[],
  order: SortOrder,
  likeCounts: Record<string, number> = {}
): ArticleFrontmatter[] {
  const copy = [...articles];

  switch (order) {
    case 'level':
      return copy.sort(
        (a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]
      );
    case 'popular':
      return copy.sort(
        (a, b) => (likeCounts[b.id] ?? 0) - (likeCounts[a.id] ?? 0)
      );
    case 'newest':
      return copy.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    default:
      return copy;
  }
}
