// Feature: rugby-media-nextjs, Property 6: いいね数に応じた PopularityLabel
// Validates: Requirements 4.1, 4.2, 4.3

import { describe, test } from 'vitest';
import * as fc from 'fast-check';
import { getPopularityLabel } from './ArticleCard';

describe('Property 6: いいね数に応じた PopularityLabel', () => {
  test('getPopularityLabel returns correct label for any like count', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 10000 }), (n) => {
        const label = getPopularityLabel(n);
        if (n < 10) return label === null;
        if (n < 30) return label === '注目';
        return label === '人気';
      }),
      { numRuns: 100 }
    );
  });
});
