import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Eye, GitBranch } from 'lucide-react';

export const metadata: Metadata = {
  title: 'ポジション解説 - 選手の判断と思考を追体験する',
  description: '15のポジションそれぞれの観戦ポイント・判断の分岐・思考プロセスを解説。試合中の選手の頭の中を覗いてみよう。',
  keywords: ['ラグビーポジション', 'フォワード', 'バックス', 'ポジション解説', 'ラグビー役割', '15人制'],
  openGraph: {
    title: 'ポジション解説 - 選手の判断と思考を追体験する',
    description: '15のポジションそれぞれの観戦ポイント・判断の分岐・思考プロセスを解説。',
    images: [{ url: '/position_mapping.png', width: 1200, height: 630, alt: 'ラグビーポジション解説' }],
  },
};
import { getAllPositions } from '@/lib/mdx';
import type { PositionFrontmatter } from '@/lib/mdx';
import { FieldMap } from '@/components/FieldMap';

export default async function PositionsPage() {
  const positions = await getAllPositions();
  const forwards = positions.filter((p) => p.category === 'フォワード').sort((a, b) => a.number - b.number);
  const backs = positions.filter((p) => p.category === 'バックス').sort((a, b) => a.number - b.number);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://raizo-rugby-lab.com';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'ラグビーポジション解説',
    description: '15のポジションそれぞれの観戦ポイント・判断の分岐・思考プロセスを解説。',
    url: `${siteUrl}/positions`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: positions.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: `${p.name}（${p.number}番）`,
        url: `${siteUrl}/positions/${p.id}`,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">ポジション解説</h1>

        {/* キャラクター導入 */}
        <div className="max-w-2xl mx-auto bg-white border rounded-xl p-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-start gap-3 flex-row-reverse">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                <Image src="/icons/richie.png" alt="リッチーくん" width={40} height={40} className="w-full h-full object-cover" />
              </div>
              <div className="bg-gray-100 rounded-lg rounded-tr-none px-4 py-2.5 text-right">
                <p className="text-sm text-gray-700">ラグビーって15人もいるのに、みんな違うことしてるの？</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                <Image src="/icons/raizo.png" alt="ライゾウ" width={40} height={40} className="w-full h-full object-cover" />
              </div>
              <div className="bg-blue-50 rounded-lg rounded-tl-none px-4 py-2.5">
                <p className="text-sm text-gray-700">そう、15のポジションにはそれぞれ違う<span className="font-semibold text-blue-700">"頭の中"</span>がある。同じ試合を見ていても、見ているものが全然違うんだ。</p>
              </div>
            </div>
            <div className="flex items-start gap-3 flex-row-reverse">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                <Image src="/icons/richie.png" alt="リッチーくん" width={40} height={40} className="w-full h-full object-cover" />
              </div>
              <div className="bg-gray-100 rounded-lg rounded-tr-none px-4 py-2.5 text-right">
                <p className="text-sm text-gray-700">えー！じゃあ選手の頭の中を覗いてみたい！</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">気になるポジションをタップしてみよう 👇</p>
        </div>
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
    </>
  );
}

function PositionCard({ position }: { position: PositionFrontmatter }) {
  const isForward = position.category === 'フォワード';
  const borderColor = isForward ? 'border-red-200 hover:border-red-400' : 'border-blue-200 hover:border-blue-400';
  const gradientBg = isForward ? 'from-red-50 to-orange-50' : 'from-blue-50 to-cyan-50';
  const numberBg = isForward ? 'bg-red-200 text-red-800' : 'bg-blue-200 text-blue-800';

  return (
    <Link href={'/positions/' + position.id} className="group h-full">
      <div className={'bg-white border-2 rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col ' + borderColor}>
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
        <div className="p-5 flex flex-col flex-1">
          <div className="space-y-4 flex-1">
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
          </div>

          {/* CTA — 常にカード底部に固定 */}
          <div className="pt-4 mt-auto">
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
