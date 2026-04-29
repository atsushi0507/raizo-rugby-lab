import Link from 'next/link';
import { Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* サイト説明 */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🏉</span>
              <span className="font-bold text-lg">ライゾウのラグビーラボ</span>
            </div>
            <p className="text-sm text-gray-600">
              ラグビーの観戦体験を深めるための解説・分析メディア。
              「なぜ」を理解して、もっと楽しく観戦しよう。
            </p>
          </div>

          {/* リンク */}
          <div>
            <h3 className="font-semibold mb-4">サイトマップ</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-green-600 transition-colors">ホーム</Link></li>
              <li><Link href="/articles" className="hover:text-green-600 transition-colors">記事一覧</Link></li>
              <li><Link href="/rules" className="hover:text-green-600 transition-colors">ルール解説</Link></li>
              <li><Link href="/positions" className="hover:text-green-600 transition-colors">ポジション解説</Link></li>
              <li><Link href="/gallery" className="hover:text-green-600 transition-colors">ギャラリー</Link></li>
              <li><Link href="/guide" className="hover:text-green-600 transition-colors">観戦ガイド</Link></li>
              <li><Link href="/about" className="hover:text-green-600 transition-colors">About</Link></li>
              <li><Link href="/terms" className="hover:text-green-600 transition-colors">利用規約</Link></li>
            </ul>
          </div>

          {/* SNS */}
          <div>
            <h3 className="font-semibold mb-4">フォローする</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/rugby.raizo/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white hover:opacity-80 transition-opacity"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              {/* <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white hover:opacity-80 transition-opacity"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a> */}
            </div>
          </div>
        </div>

        {/* コピーライト */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
          © 2026 ライゾウのラグビーラボ. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
