import { Target, Eye, Heart, TrendingUp, Users, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* ヘッダー */}
      <div className="mb-12 text-center">
        <div className="mb-4 text-5xl">🏉</div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">About</h1>
        <p className="text-xl text-gray-600">ライゾウのラグビーラボ</p>
      </div>

      {/* MVV */}
      <div className="space-y-8 mb-16">
        <div className="bg-white border-2 border-blue-200 rounded-lg p-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <Target size={24} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold">Mission（使命）</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed">
            ラグビーの観戦体験を深化させ、中級者が「なぜ」を理解できる解説・分析コンテンツを提供する。
          </p>
        </div>

        <div className="bg-white border-2 border-purple-200 rounded-lg p-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <Eye size={24} className="text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold">Vision（展望）</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed">
            すべてのラグビーファンが戦術と技術を理解し、より深く試合を楽しめる世界を目指す。
          </p>
        </div>

        <div className="bg-white border-2 border-green-200 rounded-lg p-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <Heart size={24} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">Value（価値）</h2>
          </div>
          <ul className="space-y-3 text-lg text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>分かりやすさ - 専門用語を噛み砕いて説明</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>深さ - 表面的ではなく、本質を掘り下げる</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>楽しさ - 観戦がもっと面白くなる視点を提供</span>
            </li>
          </ul>
        </div>
      </div>

      {/* コンセプト */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">コンセプト</h2>
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8">
          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            試合を見ていて「なぜあのプレーが成功したのか」「なぜあの判断をしたのか」と思ったことはありませんか？
          </p>
          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            ライゾウのラグビーラボは、そんな「なぜ」を解き明かし、観戦体験を深めるメディアです。
          </p>
          <p className="text-lg text-gray-800 leading-relaxed">
            戦術の意図、技術の背景、判断の理由を分かりやすく解説し、
            あなたがラグビーをもっと楽しめるようサポートします。
          </p>
        </div>
      </section>

      {/* ロードマップ */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">ロードマップ</h2>
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
            <div className="flex items-center mb-2">
              <span className="font-bold text-blue-700 mr-2">Phase 1</span>
              <span className="text-sm bg-blue-200 text-blue-800 px-2 py-1 rounded font-semibold">現在</span>
            </div>
            <h3 className="font-bold text-lg mb-2">メディア（MVP）</h3>
            <p className="text-gray-700">解説・分析コンテンツの蓄積と、観戦体験の深化</p>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-lg">
            <div className="flex items-center mb-2">
              <TrendingUp size={20} className="text-purple-600 mr-2" />
              <span className="font-bold text-purple-700">Phase 2</span>
            </div>
            <h3 className="font-bold text-lg mb-2">拡張メディア</h3>
            <p className="text-gray-700">データ蓄積、検索・タグ・フィルタ強化</p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
            <div className="flex items-center mb-2">
              <Sparkles size={20} className="text-green-600 mr-2" />
              <span className="font-bold text-green-700">Phase 3</span>
            </div>
            <h3 className="font-bold text-lg mb-2">分析プラットフォーム</h3>
            <p className="text-gray-700">対話型分析、ユーザー仮説入力 → 分析 → レポート生成</p>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-lg">
            <div className="flex items-center mb-2">
              <Users size={20} className="text-orange-600 mr-2" />
              <span className="font-bold text-orange-700">Phase 4</span>
            </div>
            <h3 className="font-bold text-lg mb-2">コミュニティ</h3>
            <p className="text-gray-700">ユーザー投稿、議論・コメント、ギャラリー共有</p>
          </div>
        </div>
      </section>

      {/* ターゲット */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">こんな方におすすめ</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border rounded-lg p-6">
            <div className="text-3xl mb-3">🤔</div>
            <h3 className="font-bold text-lg mb-2">もっと深く知りたい</h3>
            <p className="text-gray-600">ルールは分かるけど、戦術や判断の理由をもっと知りたい中級者</p>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <div className="text-3xl mb-3">📺</div>
            <h3 className="font-bold text-lg mb-2">観戦をもっと楽しみたい</h3>
            <p className="text-gray-600">試合を見る時に「なぜ」を理解して、より深く楽しみたい方</p>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-bold text-lg mb-2">SNSから来た</h3>
            <p className="text-gray-600">Instagramで見た解説が面白くて、もっと詳しく知りたくなった方</p>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <div className="text-3xl mb-3">🏉</div>
            <h3 className="font-bold text-lg mb-2">ラグビー愛好家</h3>
            <p className="text-gray-600">プレー経験があり、戦術的な視点で試合を分析したい方</p>
          </div>
        </div>
      </section>

      {/* お問い合わせ */}
      {/* <section className="text-center">
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">お問い合わせ</h2>
          <p className="text-gray-600 mb-6">ご質問やご要望がありましたら、お気軽にご連絡ください。</p>
          <a
            href="mailto:info@rugbyinsight.com"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            メールを送る
          </a>
        </div>
      </section> */}
    </div>
  );
}
