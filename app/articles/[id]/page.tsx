import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowLeft, Clock, Calendar, ArrowRight } from 'lucide-react';
import { getArticleById, getAllArticles, getAllPositions } from '@/lib/mdx';
import { optimizeCloudinaryUrl } from '@/lib/cloudinary';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) return { title: '記事が見つかりません' };
  return {
    title: article.title,
    description: article.excerpt,
    keywords: ['ラグビー', article.category, article.level, ...article.tags],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.thumbnail }],
    },
  };
}
import { getLikeCounts } from '@/lib/likes';
import LikeButton from '@/components/LikeButton';
import ArticleCard from '@/components/ArticleCard';
import { Conversation } from '@/components/mdx/Conversation';
import { Structure } from '@/components/mdx/Structure';
import { Video } from '@/components/mdx/Video';
import { WatchPoints } from '@/components/mdx/WatchPoints';
import { GlossaryText } from '@/components/GlossaryText';

const INSTAGRAM_URL = 'https://www.instagram.com/rugby_insight/';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  // いいね数を取得
  let likeCount = 0;
  try {
    const counts = await getLikeCounts([article.id]);
    likeCount = counts[article.id] ?? 0;
  } catch {
    // Firebase 接続失敗時はいいね数 0 で表示
  }

  // 関連記事を取得（relatedArticleIds 優先、足りない分は自動マッチングで補完、最大3件）
  let relatedArticles: Awaited<ReturnType<typeof getAllArticles>> = [];
  let relatedLikeCounts: Record<string, number> = {};
  try {
    const allArticles = await getAllArticles();
    const others = allArticles.filter((a) => a.id !== article.id);
    const MAX_RELATED = 3;

    // 明示的に指定された関連記事を優先
    const explicit = (article.relatedArticleIds ?? [])
      .map((rid) => others.find((a) => a.id === rid))
      .filter(Boolean) as typeof relatedArticles;

    // 足りない分を自動マッチングで補完
    if (explicit.length < MAX_RELATED) {
      const explicitIds = new Set(explicit.map((a) => a.id));
      const remaining = others.filter((a) => !explicitIds.has(a.id));
      const scored = remaining.map((a) => {
        let score = 0;
        if (a.category === article.category) score += 2;
        score += a.tags.filter((t) => article.tags.includes(t)).length;
        return { article: a, score };
      });
      scored.sort((a, b) => b.score - a.score);
      const autoFill = scored.slice(0, MAX_RELATED - explicit.length).map((s) => s.article);
      relatedArticles = [...explicit, ...autoFill];
    } else {
      relatedArticles = explicit.slice(0, MAX_RELATED);
    }

    if (relatedArticles.length > 0) {
      relatedLikeCounts = await getLikeCounts(relatedArticles.map((a) => a.id));
    }
  } catch {
    // 関連記事取得失敗時は空で表示
  }

  // 記事に関連するポジションを取得（position フィールドは "SO10" 形式、id は "so10" 形式）
  let relatedPosition: Awaited<ReturnType<typeof getAllPositions>>[number] | null = null;
  if (article.position) {
    try {
      const allPositions = await getAllPositions();
      const posKey = article.position.toLowerCase();
      relatedPosition = allPositions.find((p) => p.id === posKey) ?? null;
    } catch {
      // ポジション取得失敗時はスキップ
    }
  }

  const levelColorClass =
    article.level === '初級'
      ? 'bg-green-100 text-green-700'
      : article.level === '中級'
        ? 'bg-yellow-100 text-yellow-700'
        : 'bg-red-100 text-red-700';

  const categoryColorClass =
    article.category === '解説'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-purple-100 text-purple-700';

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://raizo-rugby-lab.com';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.thumbnail,
    datePublished: article.date,
    author: { '@type': 'Organization', name: 'ライゾウのラグビーラボ' },
    publisher: { '@type': 'Organization', name: 'ライゾウのラグビーラボ' },
    mainEntityOfPage: `${siteUrl}/articles/${article.id}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 戻るリンク */}
      <Link
        href="/articles"
        className="inline-flex items-center text-sm text-gray-500 hover:text-green-600 mb-8 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" />
        記事一覧に戻る
      </Link>

      {/* サムネイル */}
      <div className="relative aspect-video rounded-lg overflow-hidden mb-8 bg-gray-200">
        <Image
          src={optimizeCloudinaryUrl(article.thumbnail)}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* メタ情報 */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className={`text-xs font-semibold px-2 py-1 rounded ${categoryColorClass}`}>
          {article.category}
        </span>
        <span className={`text-xs font-semibold px-2 py-1 rounded ${levelColorClass}`}>
          {article.level}
        </span>
        <div className="flex items-center text-xs text-gray-500 gap-1">
          <Clock size={12} />
          <span>{article.readTime}</span>
        </div>
        <div className="flex items-center text-xs text-gray-500 gap-1">
          <Calendar size={12} />
          <span>
            {new Date(article.date).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* タイトル */}
      <h1 className="text-2xl md:text-3xl font-bold mb-4">{article.title}</h1>

      {/* タグ */}
      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-6">
          {article.tags.map((tag) => (
            <Link key={tag} href={`/articles/tags/${encodeURIComponent(tag)}`} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded hover:bg-green-100 hover:text-green-700 transition-colors">
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* いいねボタン */}
      <div className="flex items-center gap-3 mb-8 pb-6 border-b">
        <LikeButton articleId={article.id} initialCount={likeCount} initialLiked={false} />
      </div>

      {/* 記事本文 */}
      <div className="prose prose-gray max-w-none mb-12">
        {/* 導入 */}
        {article.introduction && (
          <section className="mb-8">
            <h2>🧠 導入</h2>
            <p><GlossaryText text={article.introduction} /></p>
          </section>
        )}

        {/* 会話で理解する */}
        {article.conversations.length > 0 && (
          <section className="mb-8">
            <h2>💬 会話で理解する</h2>
            <Conversation items={article.conversations} />
          </section>
        )}

        {/* プレー構造を分解 */}
        {article.structure && (
          <section className="mb-8">
            <h2>🧩 プレー構造を分解</h2>
            <Structure {...article.structure} />
          </section>
        )}

        {/* 観戦ポイント */}
        {article.watchPoints.length > 0 && (
          <section className="mb-8">
            <h2>👀 観戦ポイント</h2>
            <WatchPoints items={article.watchPoints} />
          </section>
        )}

        {/* 解説動画（俯瞰図アニメーション）- analysisVideoUrl が設定されている場合のみ */}
        {article.analysisVideoUrl && (
          <section className="mb-8">
            <h2>📐 プレー解説動画</h2>
            <div className="my-4 rounded-lg overflow-hidden shadow-md bg-gray-900 mx-auto" style={{ maxWidth: '400px', aspectRatio: '1280 / 1080' }}>
              <video
                controls
                playsInline
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center 50%', transform: 'scale(1.12)' }}
                preload="metadata"
              >
                <source src={article.analysisVideoUrl} type="video/mp4" />
                お使いのブラウザは動画タグをサポートしていません。
              </video>
            </div>
            <p className="text-sm text-gray-600 text-center">
              選手の動きを俯瞰図で確認しよう
            </p>
          </section>
        )}

        {/* 試合映像（YouTube）- videoUrl が設定されている場合のみ */}
        {article.videoUrl && (
          <section className="mb-8">
            <h2>🎥 試合映像</h2>
            <Video url={article.videoUrl} />
          </section>
        )}
      </div>

      {/* 記事末尾のいいねボタン */}
      <div className="flex items-center justify-center gap-3 mb-12 py-6 border-t border-b">
        <span className="text-sm text-gray-600">この記事が役に立ったら</span>
        <LikeButton articleId={article.id} initialCount={likeCount} initialLiked={false} />
      </div>

      {/* Instagram CTA */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white text-center mb-12">
        <p className="font-bold text-lg mb-2">もっとラグビーを楽しもう</p>
        <p className="text-sm text-purple-100 mb-4">
          試合のハイライト解説やポイント図解を投稿中
        </p>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-2 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors text-sm"
        >
          Instagramをフォローする
          <ArrowRight size={16} className="ml-2" />
        </a>
      </div>

      {/* もっと深く知る */}
      {(relatedArticles.length > 0 || relatedPosition) && (
        <section>
          <h2 className="text-xl font-bold mb-6">もっと深く知る</h2>

          {/* ポジションへの導線 */}
          {relatedPosition && (
            <Link
              href={'/positions/' + relatedPosition.id}
              className="flex items-center gap-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 mb-6 hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-sm shrink-0">
                <Image src={relatedPosition.icon} alt={relatedPosition.name} width={48} height={48} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-green-600 font-medium mb-0.5">{relatedPosition.name}の思考を覗いてみる</p>
                <p className="font-semibold text-sm group-hover:text-green-600 transition-colors">{relatedPosition.catch}</p>
              </div>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-green-600 transition-colors shrink-0" />
            </Link>
          )}

          {/* 関連記事 */}
          {relatedArticles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedArticles.map((related) => (
                <ArticleCard
                  key={related.id}
                  article={related}
                  likeCount={relatedLikeCounts[related.id] ?? 0}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
    </>
  );
}
