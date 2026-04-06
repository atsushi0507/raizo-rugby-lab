'use client';

import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * クライアント側で Firestore からいいね数を取得する
 */
export async function fetchLikeCount(articleId: string): Promise<number> {
  try {
    const ref = doc(db, 'articles', articleId);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data().likeCount as number) ?? 0 : 0;
  } catch {
    return 0;
  }
}
