import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Eye, GitBranch } from 'lucide-react';
import { getAllPositions } from '@/lib/mdx';
import type { PositionFrontmatter } from '@/lib/mdx';
import { FieldMap } from '@/components/FieldMap';

export default async function PositionsPage() {
  const positions = await getAllPositions();
  const forwards = positions.filter((p) => p.category === 'フォワード');
  const backs = positions.filter((p) => p.category === 'バックス');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">ポジション解説</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          15のポジション、それぞれに独自の役割と魅力がある
        </p>
      </div>

      <FieldMap />

      {forwards.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-red-700 flex items-center gap-2">
            <span className="text-2xl">💪</span>フォワード
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forwards.map((p) => <PositionCard key={p.id} position={p} />)}
          </div>
        </section>
      )}

      {backs.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2">
            <span className="text-2xl">⚡</span>バックス
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {backs.map((p) => <PositionCard key={p.id} position={p} />)}
          </div>
        </section>
      )}

      {/* FW vs BK 補足 */}
      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">フォワード vs バックス</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-6 border-2 border-red-200">
            <h3 className="font-bold text-xl mb-3 text-red-700 flex items-center gap-2">💪 フォワード（1-8番）</h3>
            <p className="text-gray-700 mb-3">スクラムやラインアウトなどのセットプレーを担当。パワーと体力が求められる。</p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• ボールを確保する</li>
              <li>• 激しいタックルと身体接触</li>
              <li>• 高い持久力が必要</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-6 border-2 border-blue-200">
            <h3 className="font-bold text-xl mb-3 text-blue-700 flex items-center gap-2">⚡ バックス（9-15番）</h3>
            <p className="text-gray-700 mb-3">フォワードが確保したボールを展開し、トライを狙う。スピードと技術が求められる。</p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• 攻撃を組み立てる</li>
              <li>• スピードとステップ</li>
              <li>• 高い判断力が必要</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="mt-16 relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 p-8 md:p-12 text-white text-center">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)' }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
            随時追加中
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">全15ポジション、順次公開予定</h2>
          <p className="text-green-100 max-w-lg mx-auto">各ポジションの役割・魅力・観戦ポイントを、キャラクターと一緒に深掘りしていきます。お楽しみに。</p>
        </div>
      </div>
    </div>
  );
}

function PositionCard({ position }: { position: PositionFrontmatter }) {
  const isForward = position.category === 'フォワード';
  const borderColor = isForward ? 'border-red-200 hover:border-red-400' : 'border-blue-200 hover:border-blue-400';
  const gradientBg = isForward ? 'from-red-50 to-orange-50' : 'from-blue-50 to-cyan-50';
  const numberBg = isForward ? 'bg-red-200 text-red-800' : 'bg-blue-200 text-blue-800';

  return (
    <Link href={'/positions/' + position.id} className="group">
      <div className={'bg-white border-2 rounded-lg overflow-hidden hover:shadow-lg transition-shadow ' + borderColor}>
        {/* ヘッダー */}
        <div className={'p-5 bg-gradient-to-br ' + gradientBg}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-sm shrink-0">
              <Image src={position.icon} alt={position.name} width={48} height={48} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={'text-xs font-bold px-2 py-0.5 rounded ' + numberBg}>{position.number}</span>
                <h3 className="font-bold text-lg group-hover:text-green-600 transition-colors">{position.name}</h3>
              </div>
              <p className="text-xs text-gray-500">{position.nameEn}</p>
            </div>
          </div>
          <p className="font-semibold text-gray-800">{position.catch}</p>
        </div>

        {/* コンテンツ */}
        <div className="p-5 space-y-4">
          {/* 観戦ポイント（最大2つ） */}
          {position.watchPoints.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2">
                <Eye size={14} />
                <span>観戦ポイント</span>
              </div>
              <ul className="space-y-1">
                {position.watchPoints.slice(0, 2).map((wp, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span>{wp.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 判断の分岐（簡易） */}
          {position.decision.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2">
                <GitBranch size={14} />
                <span>判断の分岐</span>
              </div>
              <div className="space-y-1">
                {position.decision.slice(0, 2).map((d, i) => (
                  <div key={i} className="text-sm text-gray-700 flex items-center gap-1.5">
                    <span className="text-gray-400">{d.condition}</span>
                    <span className="text-gray-300">→</span>
                    <span className="font-medium">{d.action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="pt-2">
            <span className="text-sm text-green-600 font-semibold group-hover:text-green-700 flex items-center gap-1">
              {position.cta}
              <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
