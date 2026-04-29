import Image from 'next/image';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import type { ArticleFrontmatter } from '@/lib/mdx';
import { optimizeCloudinaryUrl } from '@/lib/cloudinary';
import LikeButton from '@/components/LikeButton';

interface ArticleCardProps {
  article: ArticleFrontmatter;
  likeCount?: number;
}

export function getPopularityLabel(likeCount: number): '注目' | '人気' | null {
  if (likeCount >= 30) return '人気';
  if (likeCount >= 10) return '注目';
  return null;
}

export default function ArticleCard({ article, likeCount = 0 }: ArticleCardProps) {
  const popularityLabel = getPopularityLabel(likeCount);

  return (
    <Link href={`/articles/${article.id}`} className="group">
      <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {/* サムネイル */}
        <div className="relative overflow-hidden bg-gray-200" style={{ aspectRatio: '4 / 5' }}>
          <Image
            src={optimizeCloudinaryUrl(article.thumbnail, 600)}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* コンテンツ */}
        <div className="p-4">
          {/* ラベル行 */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {/* カテゴリラベル（解説/分析） */}
            <span
              className={`text-xs font-semibold px-2 py-1 rounded ${
                article.category === '解説'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-purple-100 text-purple-700'
              }`}
            >
              {article.category}
            </span>

            {/* 難易度ラベル */}
            <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-600">
              {article.level}
            </span>

            {/* 人気ラベル（視覚的に区別：オレンジ/アンバー系） */}
            {popularityLabel && (
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${
                  popularityLabel === '人気'
                    ? 'bg-amber-400 text-white'
                    : 'bg-orange-100 text-orange-600'
                }`}
              >
                {popularityLabel}
              </span>
            )}

            {/* 読了時間 */}
            <div className="ml-auto flex items-center text-xs text-gray-500 gap-1">
              <Clock size={12} />
              <span>{article.readTime}</span>
            </div>
          </div>

          {/* タイトル */}
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
            {article.title}
          </h3>

          {/* 抜粋 */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {article.excerpt}
          </p>

          {/* タグ */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {article.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* フッター：日付 + いいねボタン */}
          <div className="flex items-center justify-between pt-3 border-t">
            <span className="text-xs text-gray-500">
              {new Date(article.date).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <LikeButton
              articleId={article.id}
              initialCount={likeCount}
              initialLiked={false}
            />
          </div>
        </div>
      </article>
    </Link>
  );
}
