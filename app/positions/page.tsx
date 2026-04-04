import { getAllPositions } from '@/lib/mdx';
import { Users, Zap } from 'lucide-react';

export default async function PositionsPage() {
  const positions = await getAllPositions();

  const forwards = positions.filter((p) => p.category === 'フォワード');
  const backs = positions.filter((p) => p.category === 'バックス');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* ヘッダー */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">ポジション解説</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          15のポジション、それぞれに独自の役割と魅力がある
        </p>
      </div>

      {/* フィールド図（簡易版） */}
      <div className="mb-12 bg-green-100 rounded-lg p-8 border-4 border-green-600">
        <div className="text-center mb-4">
          <span className="text-sm font-semibold text-green-800">フィールド配置（イメージ）</span>
        </div>
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="col-span-3 bg-blue-100 rounded p-4 text-center">
            <span className="text-xs font-semibold text-blue-700">バックス（9-15番）</span>
            <div className="mt-2 text-2xl">🏃⚡🎯</div>
          </div>
          <div className="col-span-3 bg-red-100 rounded p-4 text-center">
            <span className="text-xs font-semibold text-red-700">フォワード（1-8番）</span>
            <div className="mt-2 text-2xl">💪🦁🏋️</div>
          </div>
        </div>
      </div>

      {/* フォワード */}
      {forwards.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-red-700 flex items-center">
            <span className="text-2xl mr-2">💪</span>フォワード
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forwards.map((position) => (
              <PositionCard key={position.id} position={position} />
            ))}
          </div>
        </section>
      )}

      {/* バックス */}
      {backs.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center">
            <span className="text-2xl mr-2">⚡</span>バックス
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {backs.map((position) => (
              <PositionCard key={position.id} position={position} />
            ))}
          </div>
        </section>
      )}

      {/* 全ポジション（フィルタなし表示） */}
      {forwards.length === 0 && backs.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {positions.map((position) => (
            <PositionCard key={position.id} position={position} />
          ))}
        </div>
      )}

      {/* 補足説明 */}
      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">フォワード vs バックス</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-6 border-2 border-red-200">
            <h3 className="font-bold text-xl mb-3 text-red-700 flex items-center">
              <span className="text-2xl mr-2">💪</span>フォワード（1-8番）
            </h3>
            <p className="text-gray-700 mb-3">
              スクラムやラインアウトなどのセットプレーを担当。パワーと体力が求められる。
            </p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• ボールを確保する</li>
              <li>• 激しいタックルと身体接触</li>
              <li>• 高い持久力が必要</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 border-2 border-blue-200">
            <h3 className="font-bold text-xl mb-3 text-blue-700 flex items-center">
              <span className="text-2xl mr-2">⚡</span>バックス（9-15番）
            </h3>
            <p className="text-gray-700 mb-3">
              フォワードが確保したボールを展開し、トライを狙う。スピードと技術が求められる。
            </p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• 攻撃を組み立てる</li>
              <li>• スピードとステップ</li>
              <li>• 高い判断力が必要</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { PositionFrontmatter } from '@/lib/mdx';

function PositionCard({ position }: { position: PositionFrontmatter }) {
  return (
    <div
      className={`bg-white border-2 rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${
        position.category === 'フォワード'
          ? 'border-red-200 hover:border-red-400'
          : 'border-blue-200 hover:border-blue-400'
      }`}
    >
      {/* ヘッダー */}
      <div
        className={`p-6 ${
          position.category === 'フォワード'
            ? 'bg-gradient-to-br from-red-50 to-orange-50'
            : 'bg-gradient-to-br from-blue-50 to-cyan-50'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-sm font-semibold px-3 py-1 rounded ${
              position.category === 'フォワード'
                ? 'bg-red-200 text-red-800'
                : 'bg-blue-200 text-blue-800'
            }`}
          >
            {position.category}
          </span>
          <span className="text-3xl">{position.character}</span>
        </div>
        <div className="text-4xl font-bold mb-1 text-gray-700">{position.number}</div>
        <h3 className="text-2xl font-bold mb-1">{position.name}</h3>
        <p className="text-sm text-gray-600">{position.nameEn}</p>
      </div>

      {/* 説明 */}
      <div className="p-6">
        <p className="text-gray-700 mb-4">{position.description}</p>

        <div className="mb-4">
          <div className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <Users size={16} className="mr-1" />
            <span>主な役割</span>
          </div>
          <ul className="space-y-1">
            {position.role.map((role, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>{role}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <Zap size={16} className="mr-1" />
            <span>必要なスキル</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {position.requiredSkills.map((skill, index) => (
              <span
                key={index}
                className={`text-xs px-2 py-1 rounded ${
                  position.category === 'フォワード'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
