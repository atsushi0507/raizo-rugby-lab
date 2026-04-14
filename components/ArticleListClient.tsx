'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, X } from 'lucide-react';
import type { ArticleFrontmatter } from '@/lib/mdx';
import { sortArticles, type SortOrder } from '@/lib/sort';
import ArticleCard from '@/components/ArticleCard';
import SortControl from '@/components/SortControl';

interface ArticleListClientProps {
  articles: ArticleFrontmatter[];
  likeCounts: Record<string, number>;
}

export default function ArticleListClient({
  articles,
  likeCounts,
}: ArticleListClientProps) {
  const searchParams = useSearchParams();
  const initialPosition = searchParams.get('position') ?? 'すべて';

  const [sortOrder, setSortOrder] = useState<SortOrder>('level');
  const [showFilters, setShowFilters] = useState(initialPosition !== 'すべて');
  const [selectedCategory, setSelectedCategory] = useState<string>('すべて');
  const [selectedPosition, setSelectedPosition] = useState<string>(initialPosition);
  const [selectedTeam, setSelectedTeam] = useState<string>('すべて');
  const [selectedTag, setSelectedTag] = useState<string>('すべて');

  // Unique filter options derived from articles
  const positions = useMemo(
    () => ['すべて', ...Array.from(new Set(articles.map((a) => a.position).filter(Boolean) as string[]))],
    [articles]
  );
  const teams = useMemo(
    () => ['すべて', ...Array.from(new Set(articles.map((a) => a.team).filter(Boolean) as string[]))],
    [articles]
  );
  const tags = useMemo(
    () => ['すべて', ...Array.from(new Set(articles.flatMap((a) => a.tags)))],
    [articles]
  );

  // Filter first, then sort — preserves active filters on sort change (Req 5.7)
  const displayedArticles = useMemo(() => {
    const filtered = articles.filter((a) => {
      if (selectedCategory !== 'すべて' && a.category !== selectedCategory) return false;
      if (selectedPosition !== 'すべて' && a.position !== selectedPosition) return false;
      if (selectedTeam !== 'すべて' && a.team !== selectedTeam) return false;
      if (selectedTag !== 'すべて' && !a.tags.includes(selectedTag)) return false;
      return true;
    });
    return sortArticles(filtered, sortOrder, likeCounts);
  }, [articles, sortOrder, likeCounts, selectedCategory, selectedPosition, selectedTeam, selectedTag]);

  const hasActiveFilters =
    selectedCategory !== 'すべて' ||
    selectedPosition !== 'すべて' ||
    selectedTeam !== 'すべて' ||
    selectedTag !== 'すべて';

  const clearFilters = () => {
    setSelectedCategory('すべて');
    setSelectedPosition('すべて');
    setSelectedTeam('すべて');
    setSelectedTag('すべて');
  };

  return (
    <div>
      {/* Sort + Filter bar */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SortControl value={sortOrder} onChange={setSortOrder} />
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

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white border rounded-lg p-6 space-y-5">
            {/* Category */}
            <div>
              <h3 className="font-semibold mb-3 text-sm">カテゴリ</h3>
              <div className="flex flex-wrap gap-2">
                {['すべて', '解説', '分析'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Position */}
            {positions.length > 1 && (
              <div>
                <h3 className="font-semibold mb-3 text-sm">ポジション</h3>
                <div className="flex flex-wrap gap-2">
                  {positions.map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setSelectedPosition(pos)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedPosition === pos
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Team */}
            {teams.length > 1 && (
              <div>
                <h3 className="font-semibold mb-3 text-sm">チーム</h3>
                <div className="flex flex-wrap gap-2">
                  {teams.map((team) => (
                    <button
                      key={team}
                      onClick={() => setSelectedTeam(team)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedTeam === team
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {team}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div>
              <h3 className="font-semibold mb-3 text-sm">タグ</h3>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedTag === tag
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Article count */}
      <p className="mb-6 text-sm text-gray-600">{displayedArticles.length}件の記事</p>

      {/* Grid */}
      {displayedArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              likeCount={likeCounts[article.id] ?? 0}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-600 mb-4">条件に一致する記事が見つかりませんでした</p>
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
