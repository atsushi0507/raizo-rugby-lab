import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ImageIcon } from 'lucide-react';
import { getRuleById, getAllRules, getAllPrinciples } from '@/lib/mdx';

const LEVEL_COLORS: Record<string, string> = {
  '初級': 'bg-green-100 text-green-700',
  '中級': 'bg-yellow-100 text-yellow-700',
  '上級': 'bg-red-100 text-red-700',
};

const PRINCIPLE_BADGE: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  orange: 'bg-orange-100 text-orange-700',
  green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-700',
  teal: 'bg-teal-100 text-teal-700',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RuleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const rule = await getRuleById(id);

  if (!rule) {
    notFound();
  }

  const [allRules, principles] = await Promise.all([
    getAllRules(),
    getAllPrinciples(),
  ]);

  const principle = principles.find((p) => p.id === rule.principleId);
  const relatedRules = rule.relatedRuleIds
    .map((rid) => allRules.find((r) => r.id === rid))
    .filter(Boolean);

  const principleColor = principle
    ? PRINCIPLE_BADGE[principle.color] ?? 'bg-gray-100 text-gray-700'
    : 'bg-gray-100 text-gray-700';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 戻るリンク */}
      <Link
        href="/rules"
        className="inline-flex items-center text-sm text-gray-500 hover:text-green-600 mb-8 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" />
        ルール解説に戻る
      </Link>

      {/* ラベル */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className={`text-xs font-semibold px-2 py-1 rounded ${LEVEL_COLORS[rule.level] ?? ''}`}>
          {rule.level}
        </span>
        {principle && (
          <span className={`text-xs font-semibold px-2 py-1 rounded ${principleColor}`}>
            {principle.emoji} {principle.title}
          </span>
        )}
      </div>

      {/* タイトル */}
      <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3">
        <span className="text-3xl">{rule.icon}</span>
        {rule.title}
      </h1>
      <p className="text-gray-600 mb-8">{rule.description}</p>

      {/* イラスト（準備中） */}
      <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center py-16 mb-8">
        <ImageIcon size={48} className="text-gray-300 mb-3" />
        <p className="text-sm text-gray-400 font-medium">イラスト準備中</p>
      </div>

      {/* 詳細解説 */}
      <div className="prose prose-gray max-w-none mb-12">
        <h2>詳しく解説</h2>
        <p>{rule.detail}</p>
      </div>

      {/* 関連ルール */}
      {relatedRules.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">関連するルール</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedRules.map((related) => related && (
              <Link
                key={related.id}
                href={`/rules/${related.id}`}
                className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{related.icon}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${LEVEL_COLORS[related.level] ?? ''}`}>
                    {related.level}
                  </span>
                </div>
                <h3 className="font-bold text-sm group-hover:text-green-600 transition-colors">
                  {related.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{related.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 大原則への導線 */}
      {principle && (
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-500 mb-2">このルールの大原則</p>
          <p className="text-lg font-bold">
            {principle.emoji} {principle.title}
          </p>
          <p className="text-sm text-gray-600 mt-1">{principle.subtitle}</p>
        </div>
      )}
    </div>
  );
}
