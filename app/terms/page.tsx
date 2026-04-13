import type { Metadata } from 'next';
import { Shield, Copyright, Ban, AlertTriangle, Instagram } from 'lucide-react';

export const metadata: Metadata = {
  title: '利用規約',
  description: 'ライゾウのラグビーラボの利用規約。著作権、二次利用の禁止、許可される利用について。',
  keywords: ['利用規約', '著作権', 'ライゾウのラグビーラボ'],
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* ヘッダー */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">利用規約</h1>
        <p className="text-gray-600">最終更新日：2026年4月3日</p>
      </div>

      {/* 著作権 */}
      <section className="mb-12">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <Copyright size={24} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold">著作権について</h2>
        </div>

        <p className="text-gray-700 mb-4">
          ライゾウのラグビーラボに掲載されているすべてのコンテンツ（記事、画像、イラスト、動画、図解など）は、当サイトまたはコンテンツ提供者が著作権を保有しています。
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-6">
          <h3 className="font-bold mb-3">著作物の範囲</h3>
          <ul className="space-y-2">
            {[
              '記事の文章・構成',
              'ChatGPTやCanvaを用いて作成したイラスト・図解',
              '試合中に撮影した写真',
              '動画コンテンツ',
              'サイトデザイン・レイアウト',
            ].map((item) => (
              <li key={item} className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 二次利用の禁止 */}
      <section className="mb-12">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
            <Ban size={24} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-bold">二次利用の禁止</h2>
        </div>

        <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-lg mb-6">
          <h3 className="font-bold text-red-900 mb-3">禁止事項</h3>
          <p className="text-gray-700 mb-4">
            当サイトのコンテンツを、事前の許可なく以下の目的で使用することを禁じます：
          </p>
          <ul className="space-y-3">
            {[
              '他のウェブサイト、ブログ、SNSへの無断転載',
              '商業目的での利用（広告、販売、営利活動など）',
              '画像・イラストの切り取りや加工',
              '記事内容の改変や、著作者名の削除',
              'AIの学習データとしての使用',
            ].map((item) => (
              <li key={item} className="flex items-start">
                <Ban size={16} className="text-red-600 mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 許可される利用 */}
      <section className="mb-12">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
            <Shield size={24} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">許可される利用</h2>
        </div>

        <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg mb-6">
          <h3 className="font-bold text-green-900 mb-3">以下の利用は許可されています</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span className="text-gray-700">
                <strong>個人的な学習・観戦の参考</strong>として閲覧・保存
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span className="text-gray-700">
                <strong>SNSでのシェア</strong>（記事URLを共有する形式）
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span className="text-gray-700">
                <strong>引用</strong>（出典を明記し、引用部分が主従関係で従の位置にある場合）
              </span>
            </li>
          </ul>

          <div className="mt-4 p-4 bg-white rounded border border-green-200">
            <p className="text-sm text-gray-700">
              <strong>引用の例：</strong><br />
              「ライゾウのラグビーラボの記事によると、『[引用部分]』とのことです。」<br />
              出典：<a href="https://raizo-rugby-lab.com" className="text-green-600 hover:underline">ライゾウのラグビーラボ - 記事タイトル</a>
            </p>
          </div>
        </div>
      </section>

      {/* コンテンツの使用許可申請 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">コンテンツの使用許可について</h2>

        <div className="bg-gray-50 border rounded-lg p-6">
          <p className="text-gray-700 mb-4">
            教育目的、研究目的、メディア掲載など、正当な理由がある場合は、コンテンツの使用を許可する場合があります。
          </p>
          <p className="text-gray-700 mb-4">
            使用を希望される場合は、以下の情報を記載の上、お問い合わせください：
          </p>
          <ul className="space-y-2 mb-6">
            {[
              '使用したいコンテンツの詳細（記事URL、画像など）',
              '使用目的',
              '使用媒体（ウェブサイト、書籍、動画など）',
              'お名前・組織名',
            ].map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="text-gray-400 mr-2">{i + 1}.</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
          {/* <a
            href="mailto:info@rugbyinsight.com"
            className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          > */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/rugby.raizo/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white hover:opacity-80 transition-opacity"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <span className="text-gray-700">ご質問・ご相談はInstagramのDMからお気軽にご連絡ください。</span>
          </div>
        </div>
      </section>

      {/* 免責事項 */}
      <section className="mb-12">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
            <AlertTriangle size={24} className="text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold">免責事項</h2>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-r-lg">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">•</span>
              <span>当サイトに掲載されている情報は、正確性を期すよう努めていますが、内容の完全性・正確性・有用性について保証するものではありません。</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">•</span>
              <span>当サイトの情報を利用したことにより生じたいかなる損害についても、当サイトは一切の責任を負いません。</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">•</span>
              <span>当サイトは、予告なくコンテンツの変更・削除を行う場合があります。</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 規約の変更 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">規約の変更</h2>
        <p className="text-gray-700">
          当サイトは、必要に応じて本規約を変更することがあります。変更後の規約は、当サイトに掲載した時点で効力を生じるものとします。
        </p>
      </section>

      {/* お問い合わせ */}
      {/* <section className="bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">ご不明な点がございましたら</h2>
        <p className="text-gray-600 mb-6">利用規約に関するご質問は、お気軽にお問い合わせください。</p>
        <a
          href="mailto:info@rugbyinsight.com"
          className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          お問い合わせ
        </a>
      </section> */}
    </div>
  );
}
