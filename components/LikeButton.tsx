'use client';

import { useState, useEffect, useCallback } from 'react';
import { toggleLike } from '@/lib/likes';
import { fetchLikeCount } from '@/lib/likes-client';

const STORAGE_KEY = 'liked_articles';

// 同一ページ内の LikeButton 間で状態を同期するイベント
const LIKE_EVENT = 'like-state-change';

interface LikeEvent {
  articleId: string;
  count: number;
  liked: boolean;
}

function dispatchLikeEvent(detail: LikeEvent) {
  window.dispatchEvent(new CustomEvent(LIKE_EVENT, { detail }));
}

interface LikeButtonProps {
  articleId: string;
  initialCount: number;
  initialLiked: boolean;
}

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

export default function LikeButton({
  articleId,
  initialCount,
  initialLiked,
}: LikeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(initialLiked);
  const [disabled, setDisabled] = useState(false);

  // マウント時に Firestore から最新のいいね数を取得 + localStorage からいいね状態を復元
  useEffect(() => {
    const ids = getLikedArticles();
    setLiked(ids.includes(articleId));

    fetchLikeCount(articleId).then((freshCount) => {
      setCount(freshCount);
    });
  }, [articleId]);

  // 他の LikeButton インスタンスからの同期イベントを受信
  const handleSyncEvent = useCallback((e: Event) => {
    const detail = (e as CustomEvent<LikeEvent>).detail;
    if (detail.articleId === articleId) {
      setCount(detail.count);
      setLiked(detail.liked);
    }
  }, [articleId]);

  useEffect(() => {
    window.addEventListener(LIKE_EVENT, handleSyncEvent);
    return () => window.removeEventListener(LIKE_EVENT, handleSyncEvent);
  }, [handleSyncEvent]);

  async function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (disabled) return;

    const wasLiked = liked;
    const prevCount = count;
    const delta = wasLiked ? -1 : 1;
    const newCount = prevCount + delta;
    const newLiked = !wasLiked;

    // 楽観的更新
    setLiked(newLiked);
    setCount(newCount);

    // localStorage 更新
    const ids = getLikedArticles();
    if (wasLiked) {
      setLikedArticles(ids.filter((id) => id !== articleId));
    } else {
      setLikedArticles([...ids, articleId]);
    }

    // 同一ページ内の他の LikeButton に同期
    dispatchLikeEvent({ articleId, count: newCount, liked: newLiked });

    try {
      await toggleLike(articleId, delta as 1 | -1);
    } catch {
      // ロールバック
      setLiked(wasLiked);
      setCount(prevCount);
      const currentIds = getLikedArticles();
      if (wasLiked) {
        setLikedArticles([...currentIds, articleId]);
      } else {
        setLikedArticles(currentIds.filter((id) => id !== articleId));
      }
      dispatchLikeEvent({ articleId, count: prevCount, liked: wasLiked });
      setDisabled(true);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      aria-label={liked ? 'いいねを取り消す' : 'いいねする'}
      aria-pressed={liked}
      className={[
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
        liked
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
      ].join(' ')}
    >
      {liked ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      )}
      <span>{count}</span>
    </button>
  );
}
