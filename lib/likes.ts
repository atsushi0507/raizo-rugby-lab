import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { db } from './firebase';

// Firestore schema:
//   collection: "articles"
//   document ID: {articleId}
//   field: likeCount: number (default: 0)

const TIMEOUT_MS = 3000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), ms)
    ),
  ]);
}

/**
 * Fetch like counts for multiple articles.
 * Returns a map of articleId -> likeCount (missing docs default to 0).
 */
export async function getLikeCounts(
  ids: string[]
): Promise<Record<string, number>> {
  if (ids.length === 0) return {};

  const fetches = ids.map(async (id) => {
    const ref = doc(db, 'articles', id);
    const snap = await withTimeout(getDoc(ref), TIMEOUT_MS);
    const count = snap.exists() ? (snap.data().likeCount as number) ?? 0 : 0;
    return [id, count] as const;
  });

  const results = await Promise.all(fetches);
  return Object.fromEntries(results);
}

/**
 * Toggle like for an article.
 * Caller is responsible for optimistic UI update and rollback on failure.
 *
 * @param articleId - The article to like/unlike
 * @param delta     - +1 to like, -1 to unlike
 * @throws Error on write failure or timeout (caller should rollback)
 */
export async function toggleLike(
  articleId: string,
  delta: 1 | -1
): Promise<void> {
  const ref = doc(db, 'articles', articleId);

  const writePromise = (async () => {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      // Create document with initial likeCount
      await setDoc(ref, { likeCount: Math.max(0, delta) });
    } else {
      await updateDoc(ref, { likeCount: increment(delta) });
    }
  })();

  await withTimeout(writePromise, TIMEOUT_MS);
}
