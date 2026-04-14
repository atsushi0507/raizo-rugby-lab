import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllArticles } from '@/lib/mdx';
import { getLikeCounts } from '@/lib/likes';
import ArticleListClient from '@/components/ArticleListClient';

export const metadata: Metadata = {
  title: '記事一覧 - プレーの「なぜ」を読み解く',
  description: 'ラグビーの解説・分析記事一覧。戦術と判断の裏側を、会話形式で分かりやすく解説します。',
  keywords: ['ラグビー記事', 'ラグビー解説', 'ラグビー戦術', 'プレー分析', '観戦解説'],
  openGraph: {
    title: '記事一覧 - プレーの「なぜ」を読み解く',
    description: 'ラグビーの解説・分析記事一覧。戦術と判断の裏側を、会話形式で分かりやすく解説します。',
    images: [{ url: '/raizo_with_ball.png', width: 1200, height: 630, alt: 'ライゾウのラグビーラボ 記事一覧' }],
  },
};

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  let likeCounts: Record<string, number> = {};
  try {
    likeCounts = await getLikeCounts(articles.map((a) => a.id));
  } catch {
    // Firebase 接続失敗時はいいね数 0 で表示
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://raizo-rugby-lab.com';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '記事一覧',
    description: 'ラグビーの解説・分析記事一覧。',
    url: `${siteUrl}/articles`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: articles.slice(0, 10).map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: a.title,
        url: `${siteUrl}/articles/${a.id}`,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">記事一覧</h1>
      <Suspense fallback={<div className="text-center py-16 text-gray-500">読み込み中...</div>}>
        <ArticleListClient articles={articles} likeCounts={likeCounts} />
      </Suspense>
    </div>
    </>
  );
}
