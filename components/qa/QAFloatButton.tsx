'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useQABot } from '@/components/qa/QABotProvider';

export function QAFloatButton() {
  const { isOpen, toggle } = useQABot();
  const pathname = usePathname();
  const isHome = pathname === '/';

  // ホーム: 観戦ガイド(bottom-6 right-6, w-24 h-24)の上に重ならないよう bottom-40 right-28
  // 他ページ: 観戦ガイドがないので bottom-6 right-6 に同サイズで配置
  const positionClass = isHome
    ? 'bottom-40 right-12'
    : 'bottom-6 right-6';

  // ホーム以外は観戦ガイドと同じサイズ (w-20 h-20 md:w-24 md:h-24)
  // ホームは少し控えめ (w-16 h-16) にして観戦ガイドと差別化
  const sizeClass = isHome
    ? 'w-16 h-16'
    : 'w-20 h-20 md:w-24 md:h-24';

  const imageSize = isHome ? 60 : 80;

  return (
    <div className={`fixed ${positionClass} z-40 flex flex-col items-end gap-2`}>
      {/* 吹き出しラベル（閉じているときのみ表示） */}
      {!isOpen && (
        <div className="relative animate-bounce-once">
          <div className="bg-white border border-gray-200 rounded-2xl rounded-br-none shadow-md px-3 py-1.5">
            <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
              なんでも聞いてみよう！
            </span>
          </div>
        </div>
      )}

      <button
        onClick={toggle}
        className={`${sizeClass} rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white border-2 border-white flex items-center justify-center`}
        aria-label={isOpen ? 'Q&A Botを閉じる' : 'ラグビーQ&A Botを開く'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <X size={24} className="text-gray-600" />
          </div>
        ) : (
          <Image
            src="/icons/richie.png"
            width={imageSize}
            height={imageSize}
            alt="リッチーくん"
            className="w-full h-full object-contain"
          />
        )}
      </button>

      {/* ホーム以外ではアイコン下にラベルを表示（観戦ガイドと揃える） */}
      {!isHome && !isOpen && (
        <span className="absolute -top-2 -left-2 bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow whitespace-nowrap">
          Q&A
        </span>
      )}
    </div>
  );
}
