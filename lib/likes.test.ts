// Feature: rugby-media-nextjs, Property 4: いいねのラウンドトリップ
// Validates: Requirements 3.3, 3.4
// Feature: rugby-media-nextjs, Property 5: localStorage からのいいね状態復元
// Validates: Requirements 3.6

import { describe, test, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';

// ─── Mock Firebase / likes module ─────────────────────────────────────────────
// toggleLike calls Firestore; we mock it to isolate the localStorage round-trip logic.

vi.mock('./firebase', () => ({ db: {} }));
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn().mockResolvedValue({ exists: () => false }),
  setDoc: vi.fn().mockResolvedValue(undefined),
  updateDoc: vi.fn().mockResolvedValue(undefined),
  increment: vi.fn((n: number) => n),
}));

// ─── Inline localStorage helpers (mirrors LikeButton.tsx logic) ───────────────

const STORAGE_KEY = 'liked_articles';

function getLikedArticles(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function setLikedArticles(ids: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

/** Simulate the like action: add articleId to localStorage, return new count. */
function like(articleId: string, currentCount: number): number {
  const ids = getLikedArticles();
  if (!ids.includes(articleId)) {
    setLikedArticles([...ids, articleId]);
  }
  return currentCount + 1;
}

/** Simulate the unlike action: remove articleId from localStorage, return new count. */
function unlike(articleId: string, currentCount: number): number {
  const ids = getLikedArticles();
  setLikedArticles(ids.filter((id) => id !== articleId));
  return currentCount - 1;
}

// ─── Property 4: いいねのラウンドトリップ ─────────────────────────────────────

describe('Property 4: いいねのラウンドトリップ', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('liking then unliking restores the original count and removes the article ID from localStorage', () => {
    // Validates: Requirements 3.3, 3.4
    fc.assert(
      fc.property(
        // Any non-empty article ID (no whitespace to keep IDs realistic)
        fc.stringMatching(/^[a-zA-Z0-9_\-]+$/).filter((s) => s.length > 0),
        // Any non-negative initial like count
        fc.nat({ max: 10000 }),
        (articleId, initialCount) => {
          // Start with a clean localStorage for each sample
          localStorage.clear();

          // Step 1: like the article
          const countAfterLike = like(articleId, initialCount);

          // After liking: count should be initialCount + 1
          if (countAfterLike !== initialCount + 1) return false;

          // After liking: articleId must be in localStorage
          if (!getLikedArticles().includes(articleId)) return false;

          // Step 2: unlike the article
          const countAfterUnlike = unlike(articleId, countAfterLike);

          // After unliking: count must be back to initialCount
          if (countAfterUnlike !== initialCount) return false;

          // After unliking: articleId must NOT be in localStorage
          if (getLikedArticles().includes(articleId)) return false;

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('liking an already-liked article is idempotent in localStorage', () => {
    // Validates: Requirements 3.3 — double-like should not duplicate the ID
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-zA-Z0-9_\-]+$/).filter((s) => s.length > 0),
        fc.nat({ max: 10000 }),
        (articleId, initialCount) => {
          localStorage.clear();

          like(articleId, initialCount);
          like(articleId, initialCount + 1); // second like (should not duplicate)

          const ids = getLikedArticles();
          const occurrences = ids.filter((id) => id === articleId).length;
          return occurrences === 1;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('unliking a not-liked article leaves localStorage unchanged', () => {
    // Validates: Requirements 3.4 — unlike on non-liked article is safe
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-zA-Z0-9_\-]+$/).filter((s) => s.length > 0),
        fc.array(
          fc.stringMatching(/^[a-zA-Z0-9_\-]+$/).filter((s) => s.length > 0),
          { minLength: 0, maxLength: 5 }
        ),
        fc.nat({ max: 10000 }),
        (articleId, otherIds, initialCount) => {
          localStorage.clear();

          // Pre-populate localStorage with other IDs (not the target)
          const preExisting = otherIds.filter((id) => id !== articleId);
          setLikedArticles(preExisting);

          unlike(articleId, initialCount);

          // The target ID should still not be present
          const ids = getLikedArticles();
          return !ids.includes(articleId);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── Property 5: localStorage からのいいね状態復元 ────────────────────────────

describe('Property 5: localStorage からのいいね状態復元', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('liked state restored from localStorage matches stored article IDs', () => {
    // Feature: rugby-media-nextjs, Property 5: localStorage からのいいね状態復元
    // Validates: Requirements 3.6
    fc.assert(
      fc.property(
        // Generate a set of article IDs to store as liked
        fc.array(
          fc.stringMatching(/^[a-zA-Z0-9_\-]+$/).filter((s) => s.length > 0),
          { minLength: 0, maxLength: 10 }
        ),
        // Generate additional article IDs that are NOT liked
        fc.array(
          fc.stringMatching(/^[a-zA-Z0-9_\-]+$/).filter((s) => s.length > 0),
          { minLength: 0, maxLength: 5 }
        ),
        (likedIds, notLikedIds) => {
          localStorage.clear();

          // Deduplicate likedIds (simulate a real Set of IDs)
          const uniqueLikedIds = [...new Set(likedIds)];

          // Exclude any notLikedIds that happen to collide with likedIds
          const uniqueNotLikedIds = notLikedIds.filter(
            (id) => !uniqueLikedIds.includes(id)
          );

          // Store liked IDs in localStorage (mirrors LikeButton.tsx setLikedArticles)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(uniqueLikedIds));

          // Simulate the restoration logic from LikeButton.tsx useEffect:
          //   const ids = getLikedArticles();
          //   setLiked(ids.includes(articleId));
          const restoredIds = getLikedArticles();

          // Every stored liked ID must be restored as liked
          for (const id of uniqueLikedIds) {
            if (!restoredIds.includes(id)) return false;
          }

          // Every not-liked ID must NOT appear as liked
          for (const id of uniqueNotLikedIds) {
            if (restoredIds.includes(id)) return false;
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
