import Link from 'next/link';
import { BookOpen, Users, Flag, AlertCircle } from 'lucide-react';
import { getAllPrinciples, getAllRules } from '@/lib/mdx';
import type { RulePrinciple, RuleData } from '@/lib/mdx';

const PRINCIPLE_COLORS: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-200', text: 'text-blue-700',   badge: 'bg-blue-100 text-blue-700' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-700' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700' },
  green:  { bg: 'bg-green-50',  border: 'border-green-200', text: 'text-green-700',  badge: 'bg-green-100 text-green-700' },
  red:    { bg: 'bg-red-50',    border: 'border-red-200', text: 'text-red-700',    badge: 'bg-red-100 text-red-700' },
  teal:   { bg: 'bg-teal-50',   border: 'border-teal-200', text: 'text-teal-700',   badge: 'bg-teal-100 text-teal-700' },
};

const LEVEL_COLORS: Record<string, string> = {
  '初級': 'bg-green-100 text-green-700',
  '中級': 'bg-yellow-100 text-yellow-700',
  '上級': 'bg-red-100 text-red-700',
};

export default async function RulesPage() {
  const principles = await getAllPrinciples();
  const rules = await getAllRules();

  const rulesByPrinciple = (principleId: string) =>
    rules.filter((r) => r.principleId === principleId);

  const setPieces = [
    { title: 'スクラム', description: '軽い反則の後、両チームのフォワード8人ずつが組んで、ボールを奪い合うセットプレー。', details: ['フッカーがボールを足で掻き出す', '押し込みでプレッシャーをかける', 'スクラムハーフがボールを供給'] },
    { title: 'ラインアウト', description: 'ボールがタッチラインの外に出た後、タッチラインから投げ入れて再開するセットプレー。', details: ['フッカーが投げ入れる', 'ジャンパーが空中でキャッチ', 'リフターが持ち上げる'] },
    { title: 'ラック', description: 'タックル後、地面にあるボールの上に両チームの選手が立って形成される密集状態。', details: ['ボールを確保するために入る', '立ったまま押し合う', '手でボールを触ってはいけない'] },
    { title: 'モール', description: 'ボールキャリアが立ったまま、両チームの選手に囲まれて形成される密集状態。', details: ['ボールキャリアは立っている', '前に押し込むことができる', '崩すと反則になる'] },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* ヘッダー */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">ルール解説</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          ラグビーのルールを「大原則」から理解する。個別のルールも、根っこを知れば覚えやすい。
        </p>
      </div>

      {/* 大原則セクション */}
      <section className="mb-16">
        <div className="flex items-center mb-8">
          <BookOpen size={32} className="text-blue-600 mr-3" />
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">6つの大原則</h2>
            <p className="text-sm text-gray-500 mt-1">まずはこれを押さえれば、ルールの見え方が変わる</p>
          </div>
        </div>

        <div className="space-y-8">
          {principles.map((principle) => (
            <PrincipleSection
              key={principle.id}
              principle={principle}
              rules={rulesByPrinciple(principle.id)}
            />
          ))}
        </div>
      </section>

      {/* セットプレー */}
      <section className="mb-16">
        <div className="flex items-center mb-8">
          <Users size={32} className="text-purple-600 mr-3" />
          <h2 className="text-2xl md:text-3xl font-bold">セットプレー</h2>
        </div>
        <div className="space-y-6">
          {setPieces.map((piece, index) => (
            <div key={index} className="bg-white border rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 border-b">
                <h3 className="font-bold text-xl mb-2">{piece.title}</h3>
                <p className="text-gray-700">{piece.description}</p>
              </div>
              <div className="p-6">
                <h4 className="font-semibold mb-3 text-gray-700">ポイント：</h4>
                <ul className="space-y-2">
                  {piece.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-purple-600 mr-2">▸</span>
                      <span className="text-gray-600">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 得点方法 */}
      <section className="mb-16">
        <div className="flex items-center mb-8">
          <Flag size={32} className="text-green-600 mr-3" />
          <h2 className="text-2xl md:text-3xl font-bold">得点方法</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border rounded-lg p-6">
            <div className="text-center mb-4"><span className="text-4xl font-bold text-green-600">5点</span></div>
            <h3 className="font-bold text-lg mb-2 text-center">トライ</h3>
            <p className="text-sm text-gray-600 text-center">相手のインゴールにボールを地面につける</p>
          </div>
          <div className="bg-white border rounded-lg p-6">
            <div className="text-center mb-4"><span className="text-4xl font-bold text-blue-600">2点</span></div>
            <h3 className="font-bold text-lg mb-2 text-center">コンバージョンキック</h3>
            <p className="text-sm text-gray-600 text-center">トライ後、ゴールを狙って蹴るキック</p>
          </div>
          <div className="bg-white border rounded-lg p-6">
            <div className="text-center mb-4"><span className="text-4xl font-bold text-purple-600">3点</span></div>
            <h3 className="font-bold text-lg mb-2 text-center">ペナルティキック</h3>
            <p className="text-sm text-gray-600 text-center">反則を受けた後、ゴールを狙うキック</p>
          </div>
        </div>
      </section>

      {/* 注意事項 */}
      <section>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle size={24} className="text-yellow-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg mb-2 text-yellow-900">安全第一</h3>
              <p className="text-gray-700">ラグビーは身体接触の激しいスポーツです。危険なプレーは厳しく罰せられます。選手の安全を守るため、ルールは常に進化しています。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="mt-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 md:p-12 text-white text-center">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.2) 0%, transparent 50%)' }} />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-300 animate-pulse" />
              随時追加中
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">もっと深いルール解説、準備中</h2>
            <p className="text-blue-100 max-w-lg mx-auto">反則の種類やレフリーのシグナル、最新のルール改正まで。観戦がもっと面白くなる知識を順次追加していきます。</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function PrincipleSection({ principle, rules }: { principle: RulePrinciple; rules: RuleData[] }) {
  const colors = PRINCIPLE_COLORS[principle.color] ?? PRINCIPLE_COLORS.blue;

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-xl p-6`}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{principle.emoji}</span>
        <div>
          <h3 className={`font-bold text-lg ${colors.text}`}>{principle.title}</h3>
          <p className="text-sm text-gray-500">{principle.subtitle}</p>
        </div>
      </div>

      {rules.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {rules.map((rule) => (
            <Link
              key={rule.id}
              href={`/rules/${rule.id}`}
              className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{rule.icon}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${LEVEL_COLORS[rule.level] ?? ''}`}>
                  {rule.level}
                </span>
              </div>
              <h4 className="font-bold text-sm group-hover:text-green-600 transition-colors">{rule.title}</h4>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{rule.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
