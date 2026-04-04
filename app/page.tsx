import Link from 'next/link';
import { ArrowRight, BookOpen, TrendingUp, Users, Image as ImageIcon } from 'lucide-react';
import { getAllArticles } from '@/lib/mdx';
import { getLikeCounts } from '@/lib/likes';
import ArticleCard from '@/components/ArticleCard';

const INSTAGRAM_URL = 'https://www.instagram.com/rugby_insight/';

export default async function HomePage() {
  const allArticles = await getAllArticles();

  // 公開日降順でソートし、上位3件を取得
  const latestArticles = [...allArticles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  // いいね数を取得（失敗時は空オブジェクトにフォールバック）
  let likeCounts: Record<string, number> = {};
  try {
    likeCounts = await getLikeCounts(latestArticles.map((a) => a.id));
  } catch {
    // Firebase 接続失敗時はいいね数 0 で表示
  }

  return (
    <div>
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-700 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              ラグビーの観戦体験を
              <br />
              もっと深く、もっと楽しく
            </h1>
            <p className="text-lg md:text-xl text-green-50 mb-8">
              なぜその判断をしたのか。なぜそのプレーが成功したのか。
              <br />
              戦術と技術を読み解き、観戦の質を高める解説メディア。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/articles"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors shadow-lg"
              >
                記事を読む
                <ArrowRight size={20} className="ml-2" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 最新記事 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">最新記事</h2>
          <Link
            href="/articles"
            className="text-green-600 hover:text-green-700 font-semibold flex items-center"
          >
            すべて見る
            <ArrowRight size={20} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              likeCount={likeCounts[article.id] ?? 0}
            />
          ))}
        </div>
      </section>

      {/* カテゴリナビゲーション */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            コンテンツを探す
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/articles?category=解説"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <BookOpen size={24} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">解説記事</h3>
              <p className="text-sm text-gray-600">プレーの意味を分かりやすく解説</p>
            </Link>

            <Link
              href="/articles?category=分析"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <TrendingUp size={24} className="text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">分析記事</h3>
              <p className="text-sm text-gray-600">戦術と判断を深く掘り下げる</p>
            </Link>

            <Link
              href="/positions"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <Users size={24} className="text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">ポジション解説</h3>
              <p className="text-sm text-gray-600">各ポジションの役割を理解</p>
            </Link>

            <Link
              href="/gallery"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                <ImageIcon size={24} className="text-orange-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">ギャラリー</h3>
              <p className="text-sm text-gray-600">試合の瞬間を写真で振り返る</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Instagramで最新情報をチェック
          </h2>
          <p className="text-lg mb-8 text-purple-100">
            試合のハイライト解説やポイント図解を毎日投稿中
          </p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors shadow-lg"
          >
            フォローする
            <ArrowRight size={20} className="ml-2" />
          </a>
        </div>
      </section>
    </div>
  );
}
