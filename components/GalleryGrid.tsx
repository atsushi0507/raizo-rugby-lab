'use client';

import { useState, useMemo } from 'react';
import { Filter, X } from 'lucide-react';
import type { GalleryFrontmatter } from '@/lib/mdx';
import { GalleryAlbum } from '@/components/GalleryAlbum';

interface GalleryGridProps {
  albums: GalleryFrontmatter[];
  seasons: string[];
  teams: string[];
}

export function GalleryGrid({ albums, seasons, teams }: GalleryGridProps) {
  const [selectedSeason, setSelectedSeason] = useState('すべて');
  const [selectedTeam, setSelectedTeam] = useState('すべて');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return albums.filter((a) => {
      if (selectedSeason !== 'すべて' && a.season !== selectedSeason) return false;
      if (selectedTeam !== 'すべて' && a.home !== selectedTeam && a.away !== selectedTeam) return false;
      return true;
    });
  }, [albums, selectedSeason, selectedTeam]);

  const hasActiveFilters = selectedSeason !== 'すべて' || selectedTeam !== 'すべて';

  const clearFilters = () => {
    setSelectedSeason('すべて');
    setSelectedTeam('すべて');
  };

  return (
    <div>
      {/* フィルターバー */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">{filtered.length}件のコレクション</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <Filter size={16} />
              <span className="font-medium">フィルター</span>
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <X size={14} />
                <span>クリア</span>
              </button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="bg-white border rounded-lg p-6 space-y-5">
            {/* シーズン */}
            <div>
              <h3 className="font-semibold mb-3 text-sm">シーズン</h3>
              <div className="flex flex-wrap gap-2">
                {['すべて', ...seasons].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSeason(s)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedSeason === s
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* チーム */}
            <div>
              <h3 className="font-semibold mb-3 text-sm">チーム</h3>
              <div className="flex flex-wrap gap-2">
                {['すべて', ...teams].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTeam(t)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedTeam === t
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* グリッド */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((album) => (
            <GalleryAlbum key={album.id} album={album} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-600 mb-4">条件に一致するコレクションが見つかりませんでした</p>
          <button
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            フィルターをクリア
          </button>
        </div>
      )}
    </div>
  );
}
