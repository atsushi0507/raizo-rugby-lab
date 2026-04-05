'use client';

import { useState, useEffect } from 'react';
import { toggleLike } from '@/lib/likes';

const STORAGE_KEY = 'liked_articles';

interface LikeButtonProps {
  articleId: string;
  initialCount: number;
  initialLiked: boolean; // always false from SSR; real value read from localStorage on mount
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

  // Restore liked state from localStorage on mount (client-only)
  useEffect(() => {
    const ids = getLikedArticles();
    setLiked(ids.includes(articleId));
  }, [articleId]);

  async function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (disabled) return;

    const wasLiked = liked;
    const prevCount = count;
    const delta = wasLiked ? -1 : 1;

    // Optimistic update
    setLiked(!wasLiked);
    setCount((c) => c + delta);

    // Update localStorage immediately
    const ids = getLikedArticles();
    if (wasLiked) {
      setLikedArticles(ids.filter((id) => id !== articleId));
    } else {
      setLikedArticles([...ids, articleId]);
    }

    try {
      await toggleLike(articleId, delta as 1 | -1);
    } catch {
      // Rollback on failure (write error or timeout = offline)
      setLiked(wasLiked);
      setCount(prevCount);
      // Rollback localStorage
      const currentIds = getLikedArticles();
      if (wasLiked) {
        setLikedArticles([...currentIds, articleId]);
      } else {
        setLikedArticles(currentIds.filter((id) => id !== articleId));
      }
      // Disable button — Firebase unreachable
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
        // Filled heart
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
        // Outline heart
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
