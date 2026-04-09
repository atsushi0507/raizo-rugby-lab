import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Search, Users, BarChart3 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'このメディアについて - ライゾウのラグビーラボ',
  description: '「なんとなく観ている」から「理解して楽しむ」へ。プレーの裏にある戦術や判断を解き明かし、観戦体験を一段深くするメディアです。',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* ── 1. コンセプト（共感） ── */}
      <section className="mb-20 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">
          「なんとなく観ている」から
          <br />
          「理解して楽しむ」へ
        </h1>
        <div className="max-w-2xl mx-auto space-y-6 text-lg text-gray-700 leading-relaxed">
          <p>
            試合を見ていて、「なんで今のプレーがうまくいったんだろう？」と思ったことはありませんか？
          </p>
          <p>
            ラグビーは"なんとなく"でも楽しめるスポーツです。
            <br />
            でも、「なぜ」を理解すると、その面白さは一気に変わります。
          </p>
          <p>
            このメディアでは、プレーの裏にある戦術や判断を解き明かし、
            <br />
            観戦体験を一段深くすることを目指しています。
          </p>
        </div>
      </section>

      {/* ── 2. 大切にしていること（提供価値） ── */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-8 text-center">大切にしていること</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="font-bold text-lg mb-2">分かりやすさ</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              専門用語も、噛み砕いて伝える。
              <br />
              初めて聞く言葉でもすっと入ってくるように。
            </p>
          </div>
          <div className="bg-white border rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="font-bold text-lg mb-2">深さ</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              結果ではなく、"なぜそうなったか"まで掘り下げる。
              <br />
              プレーの裏にある判断と意図を読み解く。
            </p>
          </div>
          <div className="bg-white border rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="font-bold text-lg mb-2">楽しさ</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              観戦がもっと面白くなる視点を届ける。
              <br />
              次の試合が待ち遠しくなるような体験を。
            </p>
          </div>
        </div>

        {/* こんな方に */}
        <div className="mt-10 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8">
          <h3 className="font-bold text-lg mb-4 text-center">「なぜ」を理解したいあなたへ</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>ルールは分かるけど、戦術の意図をもっと知りたい</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>試合を見る時に「なぜ」を理解して楽しみたい</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Instagramの解説が面白くて、もっと詳しく知りたくなった</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>プレー経験があり、戦術的な視点で試合を分析したい</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. 特徴（差別化） ── */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-8 text-center">このメディアの特徴</h2>

        {/* キャラクター紹介 */}
        <div className="bg-white border rounded-xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="flex gap-4 shrink-0">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                <Image
                  src="/icons/raizo.png"
                  alt="ライゾウ"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                <Image
                  src="/icons/richie.png"
                  alt="リッチーくん"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">会話形式でわかりやすく</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                解説役の<span className="font-semibold">ライゾウ</span>と、
                素朴な疑問を投げかける<span className="font-semibold">リッチーくん</span>。
                2人の会話を通じて、難しい戦術もスッと理解できます。
              </p>
            </div>
          </div>
        </div>

        {/* 記事構造 */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white border rounded-xl p-6">
            <div className="text-2xl mb-3">🧩</div>
            <h3 className="font-bold mb-2">構造化された解説</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              すべての記事を「状況 → 判断 → 結果」のフレームワークで分解。
              プレーの流れを論理的に理解できます。
            </p>
          </div>
          <div className="bg-white border rounded-xl p-6">
            <div className="text-2xl mb-3">�</div>
            <h3 className="font-bold mb-2">俯瞰図アニメーション</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              選手の動きを上からの俯瞰図で可視化。
              テレビでは見えない全体の動きが一目で分かります。
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. ロードマップ（今後の展開） ── */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-3 text-center">このメディアのこれから</h2>
        <p className="text-gray-600 text-center mb-8 text-sm">
          観戦を"より深く理解する体験"をつくるために、段階的に進化していきます。
        </p>

        <div className="relative">
          {/* タイムライン */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 hidden sm:block" />

          <div className="space-y-6">
            {/* Phase 1 */}
            <div className="flex gap-4 sm:gap-6">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm z-10 relative">
                  1
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-green-700">いまここ</span>
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-semibold">現在</span>
                </div>
                <p className="text-gray-700 text-sm">解説・分析コンテンツを蓄積し、観戦の「なぜ」に答える</p>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="flex gap-4 sm:gap-6">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm z-10 relative">
                  2
                </div>
              </div>
              <div className="bg-white border rounded-xl p-5 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Search size={16} className="text-purple-600" />
                  <span className="font-bold text-gray-800">もっと探しやすく</span>
                </div>
                <p className="text-gray-600 text-sm">プレーやテーマごとに探せるように進化</p>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="flex gap-4 sm:gap-6">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm z-10 relative">
                  3
                </div>
              </div>
              <div className="bg-white border rounded-xl p-5 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Users size={16} className="text-orange-600" />
                  <span className="font-bold text-gray-800">みんなで考察</span>
                </div>
                <p className="text-gray-600 text-sm">ファン同士で考察を共有できるコミュニティへ</p>
              </div>
            </div>

            {/* Phase 4 */}
            <div className="flex gap-4 sm:gap-6">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm z-10 relative">
                  4
                </div>
              </div>
              <div className="bg-white border rounded-xl p-5 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 size={16} className="text-blue-600" />
                  <span className="font-bold text-gray-800">自分で分析</span>
                </div>
                <p className="text-gray-600 text-sm">自分の考えをもとに分析できる仕組みへ</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-8 text-white">
          <p className="text-xl font-bold mb-3">まずは記事を読んでみませんか？</p>
          <p className="text-green-100 mb-6 text-sm">次の試合の見方が、きっと変わります。</p>
          <Link
            href="/articles"
            className="inline-flex items-center px-8 py-3 bg-white text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors"
          >
            記事一覧を見る
            <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
