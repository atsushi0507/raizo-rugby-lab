// Feature: rugby-media-nextjs, Property 7: ソート順の正確性
// Validates: Requirements 5.3, 5.4, 5.5

import { describe, test } from 'vitest';
import * as fc from 'fast-check';
import { sortArticles } from './sort';
import type { ArticleFrontmatter } from './mdx';

// ─── Arbitraries ──────────────────────────────────────────────────────────────

const safeId = fc.stringMatching(/^[a-zA-Z0-9_\-]+$/).filter((s) => s.length > 0);

const articleArbitrary: fc.Arbitrary<ArticleFrontmatter> = fc.record({
  id: safeId,
  title: fc.string({ minLength: 1, maxLength: 50 }),
  category: fc.constantFrom('解説' as const, '分析' as const),
  tags: fc.array(fc.string({ minLength: 1, maxLength: 10 }), { minLength: 1, maxLength: 3 }),
  thumbnail: fc.constant('https://example.com/img.jpg'),
  excerpt: fc.string({ minLength: 1, maxLength: 100 }),
  date: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') })
    .map((d) => d.toISOString().slice(0, 10)),
  readTime: fc.constant('5分'),
  level: fc.constantFrom('初級' as const, '中級' as const, '上級' as const),
});

// ─── Property 7: ソート順の正確性 ─────────────────────────────────────────────

describe('Property 7: ソート順の正確性', () => {
  const LEVEL_ORDER: Record<ArticleFrontmatter['level'], number> = {
    初級: 0,
    中級: 1,
    上級: 2,
  };

  test('level sort: 初級→中級→上級 の順序制約を満たす', () => {
    // Validates: Requirements 5.3
    fc.assert(
      fc.property(fc.array(articleArbitrary, { minLength: 0, maxLength: 20 }), (articles) => {
        const sorted = sortArticles(articles, 'level');
        for (let i = 0; i < sorted.length - 1; i++) {
          if (LEVEL_ORDER[sorted[i].level] > LEVEL_ORDER[sorted[i + 1].level]) {
            return false;
          }
        }
        return true;
      }),
      { numRuns: 100 }
    );
  });

  test('popular sort: いいね数の降順制約を満たす', () => {
    // Validates: Requirements 5.4
    fc.assert(
      fc.property(
        fc.array(articleArbitrary, { minLength: 0, maxLength: 20 }),
        fc.array(fc.nat({ max: 10000 }), { minLength: 0, maxLength: 20 }),
        (articles, counts) => {
          // Build likeCounts map keyed by article id
          const likeCounts: Record<string, number> = {};
          articles.forEach((a, i) => {
            likeCounts[a.id] = counts[i] ?? 0;
          });

          const sorted = sortArticles(articles, 'popular', likeCounts);
          for (let i = 0; i < sorted.length - 1; i++) {
            const countA = likeCounts[sorted[i].id] ?? 0;
            const countB = likeCounts[sorted[i + 1].id] ?? 0;
            if (countA < countB) return false;
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('newest sort: 日付の降順制約を満たす', () => {
    // Validates: Requirements 5.5
    fc.assert(
      fc.property(fc.array(articleArbitrary, { minLength: 0, maxLength: 20 }), (articles) => {
        const sorted = sortArticles(articles, 'newest');
        for (let i = 0; i < sorted.length - 1; i++) {
          const dateA = new Date(sorted[i].date).getTime();
          const dateB = new Date(sorted[i + 1].date).getTime();
          if (dateA < dateB) return false;
        }
        return true;
      }),
      { numRuns: 100 }
    );
  });
});

// ─── Property 8: ソート変更時のフィルター維持 ──────────────────────────────────
// Feature: rugby-media-nextjs, Property 8: ソート変更時のフィルター維持
// Validates: Requirements 5.7

describe('Property 8: ソート変更時のフィルター維持', () => {
  test('ソート順を変更してもアクティブなフィルター条件を満たす記事のみが結果に含まれる', () => {
    // Validates: Requirements 5.7
    const categoryFilter = fc.constantFrom('すべて' as const, '解説' as const, '分析' as const);
    const tagFilter = fc.option(fc.string({ minLength: 1, maxLength: 10 }), { nil: undefined });
    const positionFilter = fc.option(fc.string({ minLength: 1, maxLength: 10 }), { nil: undefined });
    const sortOrderArb = fc.constantFrom('level' as const, 'popular' as const, 'newest' as const);

    fc.assert(
      fc.property(
        fc.array(articleArbitrary, { minLength: 0, maxLength: 20 }),
        categoryFilter,
        tagFilter,
        positionFilter,
        sortOrderArb,
        fc.array(fc.nat({ max: 10000 }), { minLength: 0, maxLength: 20 }),
        (articles, category, tag, position, sortOrder, counts) => {
          // Build likeCounts map
          const likeCounts: Record<string, number> = {};
          articles.forEach((a, i) => {
            likeCounts[a.id] = counts[i] ?? 0;
          });

          // Apply filters (mirrors ArticleListClient logic)
          const filtered = articles.filter((a) => {
            if (category !== 'すべて' && a.category !== category) return false;
            if (tag !== undefined && !a.tags.includes(tag)) return false;
            if (position !== undefined && a.position !== position) return false;
            return true;
          });

          // Apply sort
          const sorted = sortArticles(filtered, sortOrder, likeCounts);

          // Every article in the sorted result must still satisfy the filter conditions
          for (const a of sorted) {
            if (category !== 'すべて' && a.category !== category) return false;
            if (tag !== undefined && !a.tags.includes(tag)) return false;
            if (position !== undefined && a.position !== position) return false;
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
