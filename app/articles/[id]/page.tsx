import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, ArrowRight } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getArticleById, getAllArticles } from '@/lib/mdx';
import { getLikeCounts } from '@/lib/likes';
import LikeButton from '@/components/LikeButton';
import ArticleCard from '@/components/ArticleCard';
import { Conversation } from '@/components/mdx/Conversation';
import { Structure } from '@/components/mdx/Structure';
import { Video } from '@/components/mdx/Video';
import { CharacterCard } from '@/components/mdx/CharacterCard';

const INSTAGRAM_URL = 'https://www.instagram.com/rugby_insight/';

const mdxComponents = {
  Conversation,
  Structure,
  Video,
  CharacterCard,
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  const { frontmatter, content } = article;

  // いいね数を取得
  let likeCount = 0;
  try {
    const counts = await getLikeCounts([frontmatter.id]);
    likeCount = counts[frontmatter.id] ?? 0;
  } catch {
    // Firebase 接続失敗時はいいね数 0 で表示
  }

  // 関連記事を取得（同カテゴリまたは共通タグ優先、最大2件）
  let relatedArticles: Awaited<ReturnType<typeof getAllArticles>> = [];
  let relatedLikeCounts: Record<string, number> = {};
  try {
    const allArticles = await getAllArticles();
    const others = allArticles.filter((a) => a.id !== frontmatter.id);

    // スコアリング：同カテゴリ +2、共通タグ1つにつき +1
    const scored = others.map((a) => {
      let score = 0;
      if (a.category === frontmatter.category) score += 2;
      const commonTags = a.tags.filter((t) => frontmatter.tags.includes(t));
      score += commonTags.length;
      return { article: a, score };
    });

    scored.sort((a, b) => b.score - a.score);
    relatedArticles = scored.slice(0, 2).map((s) => s.article);

    if (relatedArticles.length > 0) {
      relatedLikeCounts = await getLikeCounts(relatedArticles.map((a) => a.id));
    }
  } catch {
    // 関連記事取得失敗時は空で表示
  }

  const levelColorClass =
    frontmatter.level === '初級'
      ? 'bg-green-100 text-green-700'
      : frontmatter.level === '中級'
        ? 'bg-yellow-100 text-yellow-700'
        : 'bg-red-100 text-red-700';

  const categoryColorClass =
    frontmatter.category === '解説'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-purple-100 text-purple-700';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 戻るリンク */}
      <Link
        href="/articles"
        className="inline-flex items-center text-sm text-gray-500 hover:text-green-600 mb-8 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" />
        記事一覧に戻る
      </Link>

      {/* メタ情報 */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className={`text-xs font-semibold px-2 py-1 rounded ${categoryColorClass}`}>
          {frontmatter.category}
        </span>
        <span className={`text-xs font-semibold px-2 py-1 rounded ${levelColorClass}`}>
          {frontmatter.level}
        </span>
        <div className="flex items-center text-xs text-gray-500 gap-1">
          <Clock size={12} />
          <span>{frontmatter.readTime}</span>
        </div>
        <div className="flex items-center text-xs text-gray-500 gap-1">
          <Calendar size={12} />
          <span>
            {new Date(frontmatter.date).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* タイトル */}
      <h1 className="text-2xl md:text-3xl font-bold mb-4">{frontmatter.title}</h1>

      {/* タグ */}
      {frontmatter.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-6">
          {frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* いいねボタン */}
      <div className="flex items-center gap-3 mb-8 pb-6 border-b">
        <LikeButton
          articleId={frontmatter.id}
          initialCount={likeCount}
          initialLiked={false}
        />
      </div>

      {/* MDX 本文 */}
      <div className="prose prose-gray max-w-none mb-12">
        <MDXRemote
          source={content}
          components={mdxComponents}
          options={{
            scope: { frontmatter },
          }}
        />
      </div>

      {/* 記事末尾のいいねボタン */}
      <div className="flex items-center justify-center gap-3 mb-12 py-6 border-t border-b">
        <span className="text-sm text-gray-600">この記事が役に立ったら</span>
        <LikeButton
          articleId={frontmatter.id}
          initialCount={likeCount}
          initialLiked={false}
        />
      </div>

      {/* Instagram CTA */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white text-center mb-12">
        <p className="font-bold text-lg mb-2">もっとラグビーを楽しもう</p>
        <p className="text-sm text-purple-100 mb-4">
          試合のハイライト解説やポイント図解を毎日投稿中
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

      {/* 関連記事 */}
      {relatedArticles.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-6">関連記事</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedArticles.map((related) => (
              <ArticleCard
                key={related.id}
                article={related}
                likeCount={relatedLikeCounts[related.id] ?? 0}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
