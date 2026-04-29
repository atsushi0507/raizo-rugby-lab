import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Ticket, Shirt, Clock, Tv, Heart, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: '初めてのラグビー観戦ガイド',
  description: 'ラグビー観戦が初めてでも安心。チケットの取り方から持ち物、試合の楽しみ方まで、ライゾウとリッチーくんが会話形式でやさしく解説します。',
  keywords: ['ラグビー観戦', '初心者', '観戦ガイド', 'スタジアム', 'チケット', '持ち物'],
  openGraph: {
    title: '初めてのラグビー観戦ガイド',
    description: 'ラグビー観戦が初めてでも安心。チケットの取り方から持ち物、試合の楽しみ方まで。',
    images: [{ url: '/raizo_with_ball.png', width: 1200, height: 630, alt: 'ラグビー観戦ガイド' }],
  },
};

function Chat({ speaker, children }: { speaker: 'raizo' | 'richie'; children: React.ReactNode }) {
  const isRaizo = speaker === 'raizo';
  return (
    <div className={`flex items-start gap-3 ${isRaizo ? '' : 'flex-row-reverse'}`}>
      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
        <Image
          src={isRaizo ? '/icons/raizo.png' : '/icons/richie.png'}
          alt={isRaizo ? 'ライゾウ' : 'リッチーくん'}
          width={40} height={40}
          className="w-full h-full object-cover"
        />
      </div>
      <div className={`${isRaizo ? 'bg-blue-50 rounded-lg rounded-tl-none' : 'bg-gray-100 rounded-lg rounded-tr-none text-right'} px-4 py-2.5 max-w-[85%]`}>
        <p className="text-sm text-gray-700">{children}</p>
      </div>
    </div>
  );
}

function StepSection({ number, icon, title, children }: { number: number; icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
          {number}
        </div>
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function GuidePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* ヘッダー */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          🏉 初めてのラグビー観戦ガイド
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          ルールがわからなくても大丈夫。準備から試合後まで、ライゾウとリッチーくんが一緒に案内します。
        </p>
      </div>

      {/* プロローグ */}
      <section className="mb-16">
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <Chat speaker="richie">
            ラグビーの試合を観に行ってみたいけど、ルールも持ち物もよくわからなくて不安なんだ……一人で行っても大丈夫かな？
          </Chat>
          <Chat speaker="raizo">
            大丈夫、心配いらないよ。ラグビーは老若男女、一人で楽しんでいるファンもたくさんいるんだ。スタジアムにはその日だけの熱気と興奮が詰まっている。まずは一緒に準備のポイントを見ていこう。
          </Chat>
        </div>
      </section>

      {/* STEP 1 */}
      <StepSection number={1} icon={<Ticket size={24} className="text-green-600" />} title="いつ、どこでやるの？">
        <div className="bg-white border rounded-xl p-6 space-y-4 mb-6">
          <Chat speaker="richie">まずは何を調べればいいの？</Chat>
          <Chat speaker="raizo">
            まずはチームの公式サイトで試合日程と会場を確認しよう。リーグワンのシーズンは主に12月から5月頃まで開催されているよ。
          </Chat>
        </div>
        <div className="bg-green-50 rounded-xl p-6">
          <h3 className="font-bold mb-3">📋 チェックポイント</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">✓</span>公式サイトで試合日程・会場を確認</li>
            <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">✓</span>座席の種類を選ぶ（迫力の前方席、全体が見やすいメインスタンド、応援が盛り上がるバックスタンド）</li>
            <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">✓</span>前売り券がお得で確実。当日券は売り切れることも</li>
          </ul>
        </div>
      </StepSection>

      {/* STEP 2 */}
      <StepSection number={2} icon={<Shirt size={24} className="text-blue-600" />} title="何を持っていけばいい？">
        <div className="bg-white border rounded-xl p-6 space-y-4 mb-6">
          <Chat speaker="richie">スタジアムにはどんな格好で行けばいいのかな？</Chat>
          <Chat speaker="raizo">
            ラグビーは屋外競技だから、天候に合わせた準備が大切だね。特に冬はしっかりとした防寒を、春夏は日焼け対策を忘れずに。
          </Chat>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-5">
            <h3 className="font-bold mb-3">❄️ 冬の持ち物</h3>
            <ul className="space-y-1.5 text-sm text-gray-700">
              <li>• コート・ダウンジャケット</li>
              <li>• 手袋・マフラー</li>
              <li>• ブランケット（膝掛け）</li>
              <li>• カイロ</li>
            </ul>
          </div>
          <div className="bg-orange-50 rounded-xl p-5">
            <h3 className="font-bold mb-3">☀️ 春夏の持ち物</h3>
            <ul className="space-y-1.5 text-sm text-gray-700">
              <li>• 帽子・サングラス</li>
              <li>• 日焼け止め</li>
              <li>• 飲み物（水分補給）</li>
              <li>• タオル</li>
            </ul>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-5 mt-4">
          <h3 className="font-bold mb-2">💡 あると便利</h3>
          <p className="text-sm text-gray-700">レインポンチョ（急な雨に備えて）、双眼鏡（選手の表情まで見える）、モバイルバッテリー</p>
        </div>
      </StepSection>

      {/* STEP 3 */}
      <StepSection number={3} icon={<Clock size={24} className="text-purple-600" />} title="当日は何時に行けばいい？">
        <div className="bg-white border rounded-xl p-6 space-y-4 mb-6">
          <Chat speaker="richie">試合開始のギリギリに行けばいいの？</Chat>
          <Chat speaker="raizo">
            いや、キックオフの1〜2時間前に到着するのがおすすめだよ。スタジアムの外にはグルメやグッズ、イベントもたくさんあるから、試合前からワクワクできるんだ。
          </Chat>
        </div>
        <div className="bg-purple-50 rounded-xl p-6">
          <h3 className="font-bold mb-3">🎉 試合前の楽しみ</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2"><span className="text-purple-600 mt-0.5">•</span>スタジアムグルメを堪能（各会場に名物あり）</li>
            <li className="flex items-start gap-2"><span className="text-purple-600 mt-0.5">•</span>チームグッズの購入（タオルやフラッグがあると応援がもっと楽しい）</li>
            <li className="flex items-start gap-2"><span className="text-purple-600 mt-0.5">•</span>マスコットやチアリーダーによるイベント</li>
            <li className="flex items-start gap-2"><span className="text-purple-600 mt-0.5">•</span>選手のウォーミングアップを間近で見られることも</li>
          </ul>
        </div>
      </StepSection>

      {/* STEP 4 */}
      <StepSection number={4} icon={<Tv size={24} className="text-red-600" />} title="ルールがわからなくても大丈夫？">
        <div className="bg-white border rounded-xl p-6 space-y-4 mb-6">
          <Chat speaker="richie">やっぱりルールがわからないと楽しめない気がして……。</Chat>
          <Chat speaker="raizo">
            そんなことはないよ。スタジアムの大型スクリーンで解説が出たり、場内アナウンスで反則を教えてくれたりもする。まずはトライの瞬間の盛り上がりや、選手がぶつかり合う音を肌で感じるだけで十分なんだ。
          </Chat>
          <Chat speaker="richie">それなら安心かも！でも少しだけ予習しておきたいな。</Chat>
          <Chat speaker="raizo">
            それなら、うちのサイトのルール解説やポジション解説を見ておくといいよ。全部覚える必要はない。気になるところだけでOKだ。
          </Chat>
        </div>

        <div className="bg-red-50 rounded-xl p-6 mb-4">
          <h3 className="font-bold mb-3">🔥 これだけ知っていれば盛り上がれる！</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2"><span className="text-red-500 mt-0.5">•</span><strong>トライ（5点）</strong> — ゴールラインの向こうにボールを置く。最大の得点チャンス</li>
            <li className="flex items-start gap-2"><span className="text-red-500 mt-0.5">•</span><strong>コンバージョン（2点）</strong> — トライ後のゴールキック</li>
            <li className="flex items-start gap-2"><span className="text-red-500 mt-0.5">•</span><strong>ペナルティゴール（3点）</strong> — 反則後のゴールキック</li>
            <li className="flex items-start gap-2"><span className="text-red-500 mt-0.5">•</span><strong>スクラム</strong> — 8人ずつが組み合う迫力のセットプレー</li>
            <li className="flex items-start gap-2"><span className="text-red-500 mt-0.5">•</span><strong>タックル</strong> — ボールを持った相手を倒す。ラグビーの醍醐味</li>
          </ul>
        </div>

        <div className="bg-yellow-50 rounded-xl p-5 mb-4">
          <h3 className="font-bold mb-2">📢 観戦マナー</h3>
          <p className="text-sm text-gray-700">ゴールキックの時は静かに見守るのがマナー。キックが成功したら盛大に拍手しよう。それ以外は自由に声を出して応援して OK。</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/rules" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border rounded-lg hover:shadow-md transition-shadow text-sm font-semibold text-green-600">
            ルール解説を見る <ArrowRight size={16} />
          </Link>
          <Link href="/positions" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border rounded-lg hover:shadow-md transition-shadow text-sm font-semibold text-green-600">
            ポジション解説を見る <ArrowRight size={16} />
          </Link>
        </div>
      </StepSection>

      {/* エピローグ */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center shrink-0">
            <Heart size={20} />
          </div>
          <h2 className="text-xl md:text-2xl font-bold">最後はみんなで「ノーサイド」</h2>
        </div>
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <Chat speaker="richie">試合が終わった後はどうなるの？</Chat>
          <Chat speaker="raizo">
            ラグビーには「ノーサイド」の精神があって、試合が終われば敵も味方も関係なく、お互いの健闘をたたえ合うんだ。両チームのファンが一緒になって拍手を送る光景は、ラグビーならではの素晴らしさだよ。
          </Chat>
          <Chat speaker="richie">なんだか安心した！僕もスタジアムで思いっきり応援してみるよ！</Chat>
          <Chat speaker="raizo">
            その気持ちがあれば十分だ。スタジアムで待ってるよ。
          </Chat>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-8 text-white">
          <p className="text-xl font-bold mb-3">もっとラグビーを知りたくなったら</p>
          <p className="text-green-100 mb-6 text-sm">戦術やルールの「なぜ」を、キャラクターたちと一緒に学ぼう。</p>
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
