import Link from 'next/link';
import type { Metadata } from 'next';
import { BookOpen, RotateCcw, Layers, Trophy, Gamepad2, AlertCircle, ArrowRight } from 'lucide-react';
import { getAllPrinciples, getAllRules, getRestartData, getAllPhases, getAllScoring, getAllGameplay } from '@/lib/mdx';
import type { RulePrinciple, RuleData } from '@/lib/mdx';

export const metadata: Metadata = {
  title: 'ルール解説 - 大原則から理解するラグビーのルール',
  description: 'ラグビーのルールを6つの大原則から理解する。再開方法、密集、得点、試合の進め方まで網羅。',
};

const PRINCIPLE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-200', text: 'text-blue-700' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
  green:  { bg: 'bg-green-50',  border: 'border-green-200', text: 'text-green-700' },
  red:    { bg: 'bg-red-50',    border: 'border-red-200', text: 'text-red-700' },
  teal:   { bg: 'bg-teal-50',   border: 'border-teal-200', text: 'text-teal-700' },
};

const LEVEL_COLORS: Record<string, string> = {
  '初級': 'bg-green-100 text-green-700',
  '中級': 'bg-yellow-100 text-yellow-700',
  '上級': 'bg-red-100 text-red-700',
};

const TAG_COLORS: Record<string, string> = {
  green: 'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  red: 'bg-red-100 text-red-700',
};

export default async function RulesPage() {
  const [principles, rules, restartData, phases, scoring, gameplay] = await Promise.all([
    getAllPrinciples(), getAllRules(), getRestartData(), getAllPhases(), getAllScoring(), getAllGameplay(),
  ]);

  const rulesByPrinciple = (pid: string) => rules.filter((r) => r.principleId === pid);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">ルール解説</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          ラグビーのルールを「大原則」から理解する。個別のルールも、根っこを知れば覚えやすい。
        </p>
      </div>

      {/* 1. 6つの大原則 */}
      <section className="mb-16">
        <div className="flex items-center mb-8">
          <BookOpen size={32} className="text-blue-600 mr-3" />
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">6つの大原則</h2>
            <p className="text-sm text-gray-500 mt-1">まずはこれを押さえれば、ルールの見え方が変わる</p>
          </div>
        </div>
        <div className="space-y-8">
          {principles.map((p) => <PrincipleSection key={p.id} principle={p} rules={rulesByPrinciple(p.id)} />)}
        </div>
      </section>

      {/* 2. プレーの再開方法 */}
      <section className="mb-16">
        <div className="flex items-center mb-8">
          <RotateCcw size={32} className="text-purple-600 mr-3" />
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">プレーの再開方法</h2>
            <p className="text-sm text-gray-500 mt-1">反則やボールアウトの後、どうやって試合が再開されるか</p>
          </div>
        </div>
        <div className="space-y-6">
          {restartData.categories.map((cat) => {
            const items = cat.items.map((id) => restartData.items.find((i) => i.id === id)).filter(Boolean);
            return (
              <div key={cat.id} className="bg-white border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{cat.icon}</span>
                  <h3 className="font-bold text-lg">{cat.title}</h3>
                </div>
                {cat.tag && <span className={'text-xs font-semibold px-2 py-0.5 rounded mb-3 inline-block ' + (TAG_COLORS[cat.tagColor ?? ''] ?? '')}>{cat.tag}</span>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {items.map((item) => item && (
                    <Link key={item.id} href={'/rules/restart-' + item.id} className="bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-shadow group">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{item.icon}</span>
                        <span className="font-semibold text-sm group-hover:text-green-600 transition-colors">{item.title}</span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {/* レベル定義 */}
        {restartData.levelDefinitions.length > 0 && (
          <div className="mt-6 bg-gray-50 rounded-xl p-6">
            <h3 className="font-bold text-sm mb-3 text-gray-600">反則レベルの定義</h3>
            <div className="space-y-2">
              {restartData.levelDefinitions.map((def) => (
                <div key={def.level} className="flex items-start gap-3">
                  <span className={'text-xs font-semibold px-2 py-0.5 rounded whitespace-nowrap ' + (TAG_COLORS[def.color] ?? '')}>{def.level}</span>
                  <span className="text-sm text-gray-600">{def.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. プレーの流れと密集 */}
      <section className="mb-16">
        <div className="flex items-center mb-8">
          <Layers size={32} className="text-orange-600 mr-3" />
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">プレーの流れと密集</h2>
            <p className="text-sm text-gray-500 mt-1">タックルからラック、モールまで。試合中に何が起きているか</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {phases.map((phase) => (
            <Link key={phase.id} href={'/rules/phase-' + phase.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{phase.icon}</span>
                <h3 className="font-bold text-lg group-hover:text-green-600 transition-colors">{phase.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{phase.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. 得点方法 */}
      <section className="mb-16">
        <div className="flex items-center mb-8">
          <Trophy size={32} className="text-green-600 mr-3" />
          <h2 className="text-2xl md:text-3xl font-bold">得点方法</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scoring.map((s) => (
            <Link key={s.id} href={'/rules/scoring-' + s.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow group">
              <div className="text-center mb-3">
                <span className="text-4xl font-bold text-green-600">{s.points}点</span>
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-xl">{s.icon}</span>
                <h3 className="font-bold text-lg group-hover:text-green-600 transition-colors">{s.title}</h3>
              </div>
              <p className="text-sm text-gray-600 text-center">{s.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. 試合の進め方 */}
      <section className="mb-16">
        <div className="flex items-center mb-8">
          <Gamepad2 size={32} className="text-indigo-600 mr-3" />
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">試合の進め方</h2>
            <p className="text-sm text-gray-500 mt-1">観戦中に「なぜ？」と思う場面を理解する</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gameplay.map((g) => (
            <Link key={g.id} href={'/rules/gameplay-' + g.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{g.icon}</span>
                <h3 className="font-bold text-lg group-hover:text-green-600 transition-colors">{g.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{g.description}</p>
            </Link>
          ))}
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
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.3) 0%, transparent 50%)' }} />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-300 animate-pulse" />随時追加中
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
    <div className={colors.bg + ' border ' + colors.border + ' rounded-xl p-6'}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{principle.emoji}</span>
        <div>
          <h3 className={'font-bold text-lg ' + colors.text}>{principle.title}</h3>
          <p className="text-sm text-gray-500">{principle.subtitle}</p>
        </div>
      </div>
      {rules.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {rules.map((rule) => (
            <Link key={rule.id} href={'/rules/' + rule.id} className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{rule.icon}</span>
                <span className={'text-xs font-semibold px-2 py-0.5 rounded ' + (LEVEL_COLORS[rule.level] ?? '')}>{rule.level}</span>
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
