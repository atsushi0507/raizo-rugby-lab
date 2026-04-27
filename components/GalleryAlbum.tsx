'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryFrontmatter } from '@/lib/mdx';

export function GalleryAlbum({ album }: { album: GalleryFrontmatter }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  // カバー画像を先頭に含めた全画像リスト（重複排除）
  const allImages = album.images.includes(album.coverImage)
    ? album.images
    : [album.coverImage, ...album.images];

  // 背景スクロールを無効化
  useEffect(() => {
    if (isOpen || viewerIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, viewerIndex]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (viewerIndex !== null) {
      if (e.key === 'Escape') setViewerIndex(null);
      if (e.key === 'ArrowLeft') setViewerIndex((viewerIndex - 1 + allImages.length) % allImages.length);
      if (e.key === 'ArrowRight') setViewerIndex((viewerIndex + 1) % allImages.length);
    } else if (isOpen && e.key === 'Escape') {
      setIsOpen(false);
    }
  }, [isOpen, viewerIndex, allImages.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {/* コレクションカード */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-left group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow w-full h-full flex flex-col"
      >
        <div className="aspect-[4/3] overflow-hidden bg-gray-200 relative rounded-t-lg">
          <Image
            src={album.coverImage}
            alt={album.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="flex items-center">
                <ImageIcon size={16} className="mr-2" />
                <span className="text-sm">{allImages.length}枚</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-lg mb-2 group-hover:text-green-600 transition-colors line-clamp-1">
            {album.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">{album.description}</p>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
            <span className="font-semibold">{album.home} vs {album.away}</span>
            <span>
              {new Date(album.date).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </button>

      {/* アルバムモーダル */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ヘッダー */}
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
              <div>
                <h3 className="font-bold text-lg">{album.title}</h3>
                <p className="text-sm text-gray-500">{album.home} vs {album.away} · {allImages.length}枚</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="閉じる"
              >
                <X size={20} />
              </button>
            </div>

            {/* 画像グリッド（スクロール可能） */}
            <div className="overflow-y-auto p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {allImages.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setViewerIndex(i)}
                    className="aspect-square relative rounded-lg overflow-hidden bg-gray-100 hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src={src}
                      alt={`${album.title} - ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* フルスクリーンビューア */}
      {viewerIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setViewerIndex(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setViewerIndex(null); }}
            className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/20 transition-colors z-10"
            aria-label="閉じる"
          >
            <X size={28} />
          </button>

          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setViewerIndex((viewerIndex - 1 + allImages.length) % allImages.length);
                }}
                className="absolute left-4 text-white p-2 rounded-full hover:bg-white/20 transition-colors z-10"
                aria-label="前の写真"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setViewerIndex((viewerIndex + 1) % allImages.length);
                }}
                className="absolute right-4 text-white p-2 rounded-full hover:bg-white/20 transition-colors z-10"
                aria-label="次の写真"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          <div className="relative w-full max-w-4xl aspect-video mx-8" onClick={(e) => e.stopPropagation()}>
            <Image
              src={allImages[viewerIndex]}
              alt={`${album.title} - ${viewerIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          <div className="absolute bottom-4 text-white text-sm">
            {viewerIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </>
  );
}
