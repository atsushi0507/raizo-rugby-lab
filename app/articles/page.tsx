import type { Metadata } from 'next';
import { getAllArticles } from '@/lib/mdx';
import { getLikeCounts } from '@/lib/likes';
import ArticleListClient from '@/components/ArticleListClient';

export const metadata: Metadata = {
  title: '記事一覧 - プレーの「なぜ」を読み解く',
  description: 'ラグビーの解説・分析記事一覧。戦術と判断の裏側を、会話形式で分かりやすく解説します。',
};

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  let likeCounts: Record<string, number> = {};
  try {
    likeCounts = await getLikeCounts(articles.map((a) => a.id));
  } catch {
    // Firebase 接続失敗時はいいね数 0 で表示
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">記事一覧</h1>
      <ArticleListClient articles={articles} likeCounts={likeCounts} />
    </div>
  );
}
