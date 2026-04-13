import type { Metadata } from 'next';
import { getAllGallery } from '@/lib/mdx';

export const metadata: Metadata = {
  title: 'ギャラリー - 試合の瞬間を写真で振り返る',
  description: '試合の瞬間、選手たちの表情、スタジアムの熱気。写真で振り返るラグビーの魅力。',
  keywords: ['ラグビー写真', 'ラグビーギャラリー', '試合写真', 'スタジアム', 'ラグビー観戦記録'],
  openGraph: {
    title: 'ギャラリー - 試合の瞬間を写真で振り返る',
    description: '試合の瞬間、選手たちの表情、スタジアムの熱気。写真で振り返るラグビーの魅力。',
    images: [{ url: '/raizo_with_ball.png', width: 1200, height: 630, alt: 'ラグビーギャラリー' }],
  },
};
import { Image as ImageIcon } from 'lucide-react';
import { GalleryGrid } from '@/components/GalleryGrid';

export default async function GalleryPage() {
  const albums = await getAllGallery();

  // date 降順でソート
  const sorted = [...albums].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // フィルター用の選択肢を抽出
  const seasons = Array.from(new Set(sorted.map((a) => a.season))).sort().reverse();
  const teams = Array.from(
    new Set(sorted.flatMap((a) => [a.home, a.away]))
  ).sort();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">ギャラリー</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          試合の瞬間、選手たちの表情、スタジアムの熱気。写真で振り返るラグビーの魅力。
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <ImageIcon size={48} className="mx-auto mb-4 opacity-40" />
          <p>ギャラリーはまだありません</p>
        </div>
      ) : (
        <GalleryGrid albums={sorted} seasons={seasons} teams={teams} />
      )}
    </div>
  );
}
