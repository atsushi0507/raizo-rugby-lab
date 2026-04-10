import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ImageIcon, MessageCircle } from 'lucide-react';
import type { Metadata } from 'next';
import { getRuleById, getSetPieceById, getAllRules, getAllPrinciples, getAllSetPieces } from '@/lib/mdx';
import { Conversation } from '@/components/mdx/Conversation';

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  if (id.startsWith('setpiece-')) {
    const piece = await getSetPieceById(id.replace('setpiece-', ''));
    if (!piece) return { title: 'ルールが見つかりません' };
    return { title: `${piece.title} - セットプレー解説`, description: piece.description };
  }
  const rule = await getRuleById(id);
  if (!rule) return { title: 'ルールが見つかりません' };
  return { title: `${rule.title} - ルール解説`, description: rule.description };
}

export default async function RuleDetailPage({ params }: PageProps) {
  const { id } = await params;

  // セットプレーの場合は setpiece-{id} 形式
  if (id.startsWith('setpiece-')) {
    return <SetPieceDetail setPieceId={id.replace('setpiece-', '')} />;
  }

  const rule = await getRuleById(id);
  if (!rule) notFound();

  const [allRules, principles, allSetPieces] = await Promise.all([getAllRules(), getAllPrinciples(), getAllSetPieces()]);
  const principle = principles.find((p) => p.id === rule.principleId);
  const relatedRules = rule.relatedRuleIds.map((rid) => allRules.find((r) => r.id === rid)).filter(Boolean);
  const relatedSetPieces = (rule.relatedSetPieceIds ?? []).map((sid) => allSetPieces.find((s) => s.id === sid)).filter(Boolean);
  const principleColor = principle ? (PRINCIPLE_BADGE[principle.color] ?? 'bg-gray-100 text-gray-700') : 'bg-gray-100 text-gray-700';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/rules" className="inline-flex items-center text-sm text-gray-500 hover:text-green-600 mb-8 transition-colors">
        <ArrowLeft size={16} className="mr-1" />ルール解説に戻る
      </Link>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className={'text-xs font-semibold px-2 py-1 rounded ' + (LEVEL_COLORS[rule.level] ?? '')}>{rule.level}</span>
        {principle && <span className={'text-xs font-semibold px-2 py-1 rounded ' + principleColor}>{principle.emoji} {principle.title}</span>}
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3">
        <span className="text-3xl">{rule.icon}</span>{rule.title}
      </h1>
      <p className="text-gray-600 mb-8">{rule.description}</p>

      <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center py-16 mb-8">
        <ImageIcon size={48} className="text-gray-300 mb-3" />
        <p className="text-sm text-gray-400 font-medium">イラスト準備中</p>
      </div>

      <div className="prose prose-gray max-w-none mb-8">
        <h2>詳しく解説</h2>
        <p>{rule.detail}</p>
      </div>

      {/* 会話で理解する */}
      {rule.conversation.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageCircle size={20} className="text-green-600" />会話で理解する
          </h2>
          <Conversation items={rule.conversation} />
        </section>
      )}

      {relatedRules.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">関連するルール</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedRules.map((related) => related && (
              <Link key={related.id} href={'/rules/' + related.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{related.icon}</span>
                  <span className={'text-xs font-semibold px-2 py-0.5 rounded ' + (LEVEL_COLORS[related.level] ?? '')}>{related.level}</span>
                </div>
                <h3 className="font-bold text-sm group-hover:text-green-600 transition-colors">{related.title}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{related.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 試合再開方法 */}
      {relatedSetPieces.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">どうやって再開する？</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedSetPieces.map((sp) => sp && (
              <Link key={sp.id} href={'/rules/setpiece-' + sp.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{sp.icon}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-700">セットプレー</span>
                </div>
                <h3 className="font-bold text-sm group-hover:text-green-600 transition-colors">{sp.title}で再開</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{sp.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {principle && (
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-500 mb-2">このルールの大原則</p>
          <p className="text-lg font-bold">{principle.emoji} {principle.title}</p>
          <p className="text-sm text-gray-600 mt-1">{principle.subtitle}</p>
        </div>
      )}
    </div>
  );
}

async function SetPieceDetail({ setPieceId }: { setPieceId: string }) {
  const piece = await getSetPieceById(setPieceId);
  if (!piece) notFound();

  const allRules = await getAllRules();
  const relatedRules = piece.relatedRuleIds.map((rid) => allRules.find((r) => r.id === rid)).filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/rules" className="inline-flex items-center text-sm text-gray-500 hover:text-green-600 mb-8 transition-colors">
        <ArrowLeft size={16} className="mr-1" />ルール解説に戻る
      </Link>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold px-2 py-1 rounded bg-purple-100 text-purple-700">セットプレー</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3">
        <span className="text-3xl">{piece.icon}</span>{piece.title}
      </h1>
      <p className="text-gray-600 mb-8">{piece.description}</p>

      <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center py-16 mb-8">
        <ImageIcon size={48} className="text-gray-300 mb-3" />
        <p className="text-sm text-gray-400 font-medium">イラスト準備中</p>
      </div>

      <div className="prose prose-gray max-w-none mb-8">
        <h2>詳しく解説</h2>
        <p>{piece.detail}</p>
      </div>

      {/* ポイント */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">ポイント</h2>
        <div className="space-y-2">
          {piece.points.map((point, i) => (
            <div key={i} className="flex items-start gap-3 bg-white border rounded-lg p-4">
              <span className="text-purple-500 font-bold mt-0.5">{i + 1}</span>
              <span className="text-gray-700">{point}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 発生条件 */}
      {piece.triggerConditions.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">このセットプレーが行われる条件</h2>
          <div className="space-y-2">
            {piece.triggerConditions.map((cond, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-orange-500 mt-0.5">▸</span>
                <span>{cond}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 会話で理解する */}
      {piece.conversation.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageCircle size={20} className="text-green-600" />会話で理解する
          </h2>
          <Conversation items={piece.conversation} />
        </section>
      )}

      {/* 関連ルール */}
      {relatedRules.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">関連するルール</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedRules.map((related) => related && (
              <Link key={related.id} href={'/rules/' + related.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{related.icon}</span>
                  <span className={'text-xs font-semibold px-2 py-0.5 rounded ' + (LEVEL_COLORS[related.level] ?? '')}>{related.level}</span>
                </div>
                <h3 className="font-bold text-sm group-hover:text-green-600 transition-colors">{related.title}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{related.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
