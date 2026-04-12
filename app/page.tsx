import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowRight, BookOpen, Scale, Users, Image as ImageIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'ラグビーの「なぜ」を読み解く解説メディア',
  description: 'プレーの裏にある戦術と判断を解き明かし、ラグビー観戦をもっと深く楽しくする。ライゾウとリッチーくんの会話で、難しい戦術もスッと理解できます。',
};
import { getAllArticles, getAllPrinciples } from '@/lib/mdx';
import { getLikeCounts } from '@/lib/likes';
import { getFeaturedNews } from '@/lib/news';
import ArticleCard from '@/components/ArticleCard';

const INSTAGRAM_URL = 'https://www.instagram.com/rugby.raizo/';

export default async function HomePage() {
  const allArticles = await getAllArticles();
  const principles = await getAllPrinciples();
  const newsItems = await getFeaturedNews();

  const latestArticles = [...allArticles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

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
                記事一覧を見る
                <ArrowRight size={20} className="ml-2" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                このサイトについて
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 新着情報 */}
      {newsItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
          <div className="bg-white border rounded-xl p-6">
            <h2 className="font-bold text-lg mb-1 flex items-center gap-2">
              🔔 最近の更新
            </h2>
            <p className="text-xs text-gray-500 mb-4">記事・ルール・ポジションなど、新しく追加・更新されたコンテンツ</p>
            <div className="divide-y">
              {newsItems.slice(0, 5).map((item) => {
                const displayDate = item.isUpdated ? item.updatedAt : item.createdAt;
                return (
                  <Link
                    key={item.category + '-' + item.id}
                    href={item.href}
                    className="flex items-center gap-3 py-3 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors group"
                  >
                    <span className="text-xs text-gray-400 whitespace-nowrap w-20 shrink-0">
                      {new Date(displayDate).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.isNew && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500 text-white">NEW</span>
                      )}
                      {item.isUpdated && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500 text-white">UPDATE</span>
                      )}
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        item.category === '記事' ? 'bg-blue-100 text-blue-700' :
                        item.category === 'ポジション' ? 'bg-green-100 text-green-700' :
                        item.category === 'ギャラリー' ? 'bg-orange-100 text-orange-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>{item.category}</span>
                      <span className="text-sm text-gray-800 group-hover:text-green-600 transition-colors">{item.title}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* キャラクター紹介セクション */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-center">
          2人と一緒に、ラグビーを読み解こう
        </h2>
        <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
          「なんであのプレーが成功したの？」そんな素朴な疑問から、戦術の深い世界へ。
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* ライゾウ */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-sm shrink-0">
                <Image
                  src="/icons/raizo.png"
                  alt="ライゾウ"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">ライゾウ</h3>
                <p className="text-sm text-blue-600 font-medium">解説役 / SO（スタンドオフ）</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              チームの司令塔として試合を組み立ててきた経験を活かし、選手がフィールドで何を考え、なぜその判断をしたのかを解き明かす。戦術の「なぜ」を、誰にでも分かる言葉で伝える。
            </p>
          </div>

          {/* リッチーくん */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-sm shrink-0">
                <Image
                  src="/icons/richie.png"
                  alt="リッチーくん"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">リッチーくん</h3>
                <p className="text-sm text-green-600 font-medium">質問役 / ラグビー大好きモモンガ</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              ラグビーが大好きだけど、戦術はまだまだ勉強中。「なんでスタンドオフを飛ばしたの？」「あのタックルはなぜ反則？」純粋な疑問が、ライゾウの深い解説を引き出す。
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm mb-4">2人の会話を通じて、難しい戦術もスッと理解できます</p>
          <Link
            href="/articles"
            className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold text-sm"
          >
            記事を読んでみる
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </section>

      {/* 最新記事 */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>
      </section>

      {/* ルールの大原則ピックアップ */}
      {principles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">ルールの「なぜ」を知る</h2>
              <p className="text-sm text-gray-500 mt-1">6つの大原則を押さえれば、反則の意味が見えてくる</p>
            </div>
            <Link
              href="/rules"
              className="text-green-600 hover:text-green-700 font-semibold flex items-center text-sm"
            >
              すべて見る
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {principles.slice(0, 3).map((p) => (
              <Link
                key={p.id}
                href="/rules"
                className="bg-white border rounded-xl p-5 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{p.emoji}</span>
                  <h3 className="font-bold text-sm group-hover:text-green-600 transition-colors">{p.title}</h3>
                </div>
                <p className="text-xs text-gray-500">{p.subtitle}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* コンテンツを探す */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            コンテンツを探す
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/articles"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group border"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <BookOpen size={24} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">プレーを読み解く</h3>
              <p className="text-sm text-gray-600">あの判断の裏側にある戦術を知る</p>
            </Link>

            <Link
              href="/rules"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group border"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <Scale size={24} className="text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">ルールを学ぶ</h3>
              <p className="text-sm text-gray-600">大原則から理解して観戦をもっと楽しく</p>
            </Link>

            <Link
              href="/positions"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group border"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <Users size={24} className="text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">ポジションを知る</h3>
              <p className="text-sm text-gray-600">選手の判断と思考を追体験する</p>
            </Link>

            <Link
              href="/gallery"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group border"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                <ImageIcon size={24} className="text-orange-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">試合を振り返る</h3>
              <p className="text-sm text-gray-600">あの瞬間を写真で追体験する</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Instagramでラグビー観戦をもっと深く
          </h2>
          <p className="text-lg mb-8 text-purple-100">
            試合の見方が変わる分析と観戦記録を発信中
          </p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors shadow-lg"
          >
            Instagramを見る
            <ArrowRight size={20} className="ml-2" />
          </a>
        </div>
      </section>
    </div>
  );
}
