'use client';

import Image from 'next/image';
import { getCharacterIcon } from '@/lib/characters';
import { useTypewriter } from './useTypewriter';

interface QAConversationMessageProps {
  speaker: 'ライゾウ' | 'リッチーくん';
  message: string;
  showIcon?: boolean;         // デフォルト: true
  useTypewriterEffect?: boolean;  // デフォルト: false
  speed?: number;             // デフォルト: 40
  onComplete?: () => void;
}

/**
 * ライゾウ以外（リッチーくん）は右側に表示する。
 * ライゾウは左側（教師役）に表示する。
 */
function isLeftSide(speaker: 'ライゾウ' | 'リッチーくん'): boolean {
  return speaker === 'ライゾウ';
}

export function QAConversationMessage({
  speaker,
  message,
  showIcon = true,
  useTypewriterEffect = false,
  speed = 40,
  onComplete,
}: QAConversationMessageProps) {
  const { displayedText, skip } = useTypewriter({
    text: message,
    speed,
    onComplete,
    enabled: useTypewriterEffect,
  });

  const displayText = useTypewriterEffect ? displayedText : message;
  const leftSide = isLeftSide(speaker);
  const iconPath = getCharacterIcon(speaker);

  return (
    <div className={`flex gap-3 ${leftSide ? '' : 'flex-row-reverse'}`}>
      {/* アイコン領域 */}
      <div className="flex-shrink-0 w-10">
        {showIcon ? (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {iconPath ? (
              <Image
                src={iconPath}
                alt={speaker}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-gray-400">{speaker[0]}</span>
            )}
          </div>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {/* 吹き出し領域 */}
      <div className={`flex-1 ${leftSide ? '' : 'text-right'}`}>
        {showIcon && (
          <div className="font-semibold text-xs text-gray-500 mb-1">
            {speaker}
          </div>
        )}
        <div
          className={`inline-block px-4 py-2.5 rounded-xl text-sm leading-relaxed ${
            leftSide
              ? 'bg-blue-50 text-gray-800 rounded-tl-none'
              : 'bg-gray-100 text-gray-800 rounded-tr-none'
          }`}
          onClick={useTypewriterEffect ? skip : undefined}
          style={useTypewriterEffect ? { cursor: 'pointer' } : undefined}
        >
          {displayText}
        </div>
      </div>
    </div>
  );
}
