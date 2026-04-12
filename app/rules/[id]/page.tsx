import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ImageIcon, MessageCircle } from 'lucide-react';
import type { Metadata } from 'next';
import {
  getRuleById, getAllRules, getAllPrinciples,
  getRestartData, getRestartItemById,
  getPhaseById, getScoringById, getGameplayById,
} from '@/lib/mdx';
import { Conversation } from '@/components/mdx/Conversation';

const LEVEL_COLORS: Record<string, string> = {
  '初級': 'bg-green-100 text-green-700',
  '中級': 'bg-yellow-100 text-yellow-700',
  '上級': 'bg-red-100 text-red-700',
};
const PRINCIPLE_BADGE: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700', purple: 'bg-purple-100 text-purple-700',
  orange: 'bg-orange-100 text-orange-700', green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-700', teal: 'bg-teal-100 text-teal-700',
};

interface PageProps { params: Promise<{ id: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  if (id.startsWith('restart-')) {
    const item = await getRestartItemById(id.replace('restart-', ''));
    return item ? { title: `${item.title} - 再開方法`, description: item.description } : { title: 'ページが見つかりません' };
  }
  if (id.startsWith('phase-')) {
    const item = await getPhaseById(id.replace('phase-', ''));
    return item ? { title: `${item.title} - プレーの流れ`, description: item.description } : { title: 'ページが見つかりません' };
  }
  if (id.startsWith('scoring-')) {
    const item = await getScoringById(id.replace('scoring-', ''));
    return item ? { title: `${item.title}（${item.points}点）`, description: item.description } : { title: 'ページが見つかりません' };
  }
  if (id.startsWith('gameplay-')) {
    const item = await getGameplayById(id.replace('gameplay-', ''));
    return item ? { title: `${item.title} - 試合の進め方`, description: item.description } : { title: 'ページが見つかりません' };
  }
  // legacy setpiece- support
  if (id.startsWith('setpiece-')) {
    const item = await getRestartItemById(id.replace('setpiece-', ''));
    return item ? { title: `${item.title} - 再開方法`, description: item.description } : { title: 'ページが見つかりません' };
  }
  const rule = await getRuleById(id);
  return rule ? { title: `${rule.title} - ルール解説`, description: rule.description } : { title: 'ルールが見つかりません' };
}

export default async function RuleDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (id.startsWith('restart-') || id.startsWith('setpiece-')) {
    const itemId = id.replace('restart-', '').replace('setpiece-', '');
    return <GenericDetail type="restart" itemId={itemId} />;
  }
  if (id.startsWith('phase-')) return <GenericDetail type="phase" itemId={id.replace('phase-', '')} />;
  if (id.startsWith('scoring-')) return <ScoringDetail itemId={id.replace('scoring-', '')} />;
  if (id.startsWith('gameplay-')) return <GenericDetail type="gameplay" itemId={id.replace('gameplay-', '')} />;

  // 大原則のルール詳細
  const rule = await getRuleById(id);
  if (!rule) notFound();

  const [allRules, principles, restartData] = await Promise.all([getAllRules(), getAllPrinciples(), getRestartData()]);
  const principle = principles.find((p) => p.id === rule.principleId);
  const relatedRules = rule.relatedRuleIds.map((rid) => allRules.find((r) => r.id === rid)).filter(Boolean);
  const relatedSetPieces = (rule.relatedSetPieceIds ?? []).map((sid) => restartData.items.find((s) => s.id === sid)).filter(Boolean);
  const principleColor = principle ? (PRINCIPLE_BADGE[principle.color] ?? 'bg-gray-100 text-gray-700') : 'bg-gray-100 text-gray-700';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BackLink />
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className={'text-xs font-semibold px-2 py-1 rounded ' + (LEVEL_COLORS[rule.level] ?? '')}>{rule.level}</span>
        {principle && <span className={'text-xs font-semibold px-2 py-1 rounded ' + principleColor}>{principle.emoji} {principle.title}</span>}
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3"><span className="text-3xl">{rule.icon}</span>{rule.title}</h1>
      <p className="text-gray-600 mb-8">{rule.description}</p>
      <IllustrationPlaceholder src={rule.illustration} />
      <div className="prose prose-gray max-w-none mb-8"><h2>詳しく解説</h2><p>{rule.detail}</p></div>      <ConversationSection items={rule.conversation} />
      <RelatedRulesSection rules={relatedRules} />
      {relatedSetPieces.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">この反則後の試合再開</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedSetPieces.map((sp) => sp && (
              <Link key={sp.id} href={'/rules/restart-' + sp.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-2 mb-2"><span className="text-lg">{sp.icon}</span><span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-700">再開方法</span></div>
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

// ─── Generic Detail (restart, phase, gameplay) ────────────────────────────────

async function GenericDetail({ type, itemId }: { type: 'restart' | 'phase' | 'gameplay'; itemId: string }) {
  let item: { id: string; title: string; icon: string; description: string; detail: string; points?: string[]; relatedRuleIds: string[]; relatedItemIds: string[]; illustration?: string; conversation: { speaker: string; message: string }[] } | null = null;
  let typeLabel = '';
  let linkPrefix = '';

  if (type === 'restart') {
    item = await getRestartItemById(itemId);
    typeLabel = '再開方法';
    linkPrefix = 'restart-';
  } else if (type === 'phase') {
    item = await getPhaseById(itemId);
    typeLabel = 'プレーの流れ';
    linkPrefix = 'phase-';
  } else {
    item = await getGameplayById(itemId);
    typeLabel = '試合の進め方';
    linkPrefix = 'gameplay-';
  }

  if (!item) notFound();

  const allRules = await getAllRules();
  const relatedRules = item.relatedRuleIds.map((rid) => allRules.find((r) => r.id === rid)).filter(Boolean);

  // Resolve related items from the same type
  let relatedItems: { id: string; title: string; icon: string; description: string; prefix: string }[] = [];
  if (item.relatedItemIds.length > 0) {
    if (type === 'restart') {
      const data = await getRestartData();
      relatedItems = item.relatedItemIds.map((rid) => {
        const found = data.items.find((i) => i.id === rid);
        return found ? { ...found, prefix: 'restart-' } : null;
      }).filter(Boolean) as typeof relatedItems;
    } else if (type === 'phase') {
      const { default: getAllPhasesF } = await import('@/lib/mdx').then(m => ({ default: m.getAllPhases }));
      const phases = await getAllPhasesF();
      relatedItems = item.relatedItemIds.map((rid) => {
        const found = phases.find((p) => p.id === rid);
        return found ? { ...found, prefix: 'phase-' } : null;
      }).filter(Boolean) as typeof relatedItems;
    } else {
      const { default: getAllGameplayF } = await import('@/lib/mdx').then(m => ({ default: m.getAllGameplay }));
      const gps = await getAllGameplayF();
      relatedItems = item.relatedItemIds.map((rid) => {
        const found = gps.find((g) => g.id === rid);
        return found ? { ...found, prefix: 'gameplay-' } : null;
      }).filter(Boolean) as typeof relatedItems;
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BackLink />
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs font-semibold px-2 py-1 rounded bg-purple-100 text-purple-700">{typeLabel}</span>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3"><span className="text-3xl">{item.icon}</span>{item.title}</h1>
      <p className="text-gray-600 mb-8">{item.description}</p>
      <IllustrationPlaceholder src={item.illustration} />
      <div className="prose prose-gray max-w-none mb-8"><h2>詳しく解説</h2><p>{item.detail}</p></div>
      {item.points && item.points.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">ポイント</h2>
          <div className="space-y-2">
            {item.points.map((p, i) => (
              <div key={i} className="flex items-start gap-3 bg-white border rounded-lg p-4">
                <span className="text-purple-500 font-bold mt-0.5">{i + 1}</span><span className="text-gray-700">{p}</span>
              </div>
            ))}
          </div>
        </section>
      )}
      <ConversationSection items={item.conversation} />
      <RelatedRulesSection rules={relatedRules} />
      {relatedItems.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">関連する項目</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedItems.map((ri) => (
              <Link key={ri.id} href={'/rules/' + ri.prefix + ri.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-2 mb-1"><span className="text-lg">{ri.icon}</span></div>
                <h3 className="font-bold text-sm group-hover:text-green-600 transition-colors">{ri.title}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ri.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Scoring Detail ───────────────────────────────────────────────────────────

async function ScoringDetail({ itemId }: { itemId: string }) {
  const item = await getScoringById(itemId);
  if (!item) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BackLink />
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-700">得点方法</span>
      </div>
      <div className="text-center mb-6"><span className="text-5xl font-bold text-green-600">{item.points}点</span></div>
      <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center justify-center gap-3"><span className="text-3xl">{item.icon}</span>{item.title}</h1>
      <p className="text-gray-600 mb-8 text-center">{item.description}</p>
      <IllustrationPlaceholder src={item.illustration} />
      <div className="prose prose-gray max-w-none mb-8"><h2>詳しく解説</h2><p>{item.detail}</p></div>
      <ConversationSection items={item.conversation} />
    </div>
  );
}

// ─── Shared Components ────────────────────────────────────────────────────────

function BackLink() {
  return (
    <Link href="/rules" className="inline-flex items-center text-sm text-gray-500 hover:text-green-600 mb-8 transition-colors">
      <ArrowLeft size={16} className="mr-1" />ルール解説に戻る
    </Link>
  );
}

function IllustrationPlaceholder({ src }: { src?: string }) {
  if (src) {
    // Check at build time if the file exists in public/
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), 'public', src);
    if (fs.existsSync(filePath)) {
      const Image = require('next/image').default;
      return (
        <div className="rounded-xl overflow-hidden mb-8 bg-gray-50 mx-auto" style={{ maxWidth: '400px' }}>
          <Image src={src} alt="イラスト" width={400} height={400} className="w-full h-auto" />
        </div>
      );
    }
  }
  return (
    <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center py-16 mb-8">
      <ImageIcon size={48} className="text-gray-300 mb-3" /><p className="text-sm text-gray-400 font-medium">イラスト準備中</p>
    </div>
  );
}

function ConversationSection({ items }: { items: { speaker: string; message: string }[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><MessageCircle size={20} className="text-green-600" />会話で理解する</h2>
      <Conversation items={items} />
    </section>
  );
}

function RelatedRulesSection({ rules }: { rules: ({ id: string; title: string; icon: string; level: string; description: string } | undefined)[] }) {
  const valid = rules.filter((r): r is { id: string; title: string; icon: string; level: string; description: string } => r !== undefined);
  if (valid.length === 0) return null;
  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold mb-4">関連するルール</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {valid.map((r) => r && (
          <Link key={r.id} href={'/rules/' + r.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-2 mb-2"><span className="text-lg">{r.icon}</span><span className={'text-xs font-semibold px-2 py-0.5 rounded ' + (LEVEL_COLORS[r.level] ?? '')}>{r.level}</span></div>
            <h3 className="font-bold text-sm group-hover:text-green-600 transition-colors">{r.title}</h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{r.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
