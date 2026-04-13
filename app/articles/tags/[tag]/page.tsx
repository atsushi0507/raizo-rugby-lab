import type { Metadata } from 'next';
import { getAllArticles } from '@/lib/mdx';
import { getLikeCounts } from '@/lib/likes';
import ArticleCard from '@/components/ArticleCard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `#${decoded} の記事一覧`,
    description: `「${decoded}」タグがついた記事の一覧。`,
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);

  const allArticles = await getAllArticles();
  const filtered = allArticles.filter((a) => a.tags.includes(decoded));

  let likeCounts: Record<string, number> = {};
  try {
    if (filtered.length > 0) {
      likeCounts = await getLikeCounts(filtered.map((a) => a.id));
    }
  } catch {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/articles"
        className="inline-flex items-center text-sm text-gray-500 hover:text-green-600 mb-8 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" />
        記事一覧に戻る
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          <span className="text-green-600">#</span>{decoded}
        </h1>
        <p className="text-gray-600">{filtered.length}件の記事</p>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              likeCount={likeCounts[article.id] ?? 0}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-16">このタグの記事はまだありません</p>
      )}
    </div>
  );
}
