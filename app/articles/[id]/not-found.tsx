import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ArticleNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        記事が見つかりません
      </h2>
      <p className="text-gray-600 mb-8 max-w-md">
        お探しの記事は存在しないか、削除された可能性があります。
      </p>
      <Link
        href="/articles"
        className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
      >
        <ArrowLeft size={18} className="mr-2" />
        記事一覧に戻る
      </Link>
    </div>
  );
}
