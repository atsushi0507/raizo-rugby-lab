import Image from 'next/image';
import { getCharacterIcon } from '@/lib/characters';

interface ConversationItem {
  speaker: string;
  message: string | string[];
}

interface ConversationProps {
  items: ConversationItem[];
}

/**
 * リッチーくん以外は教師役（左側表示）
 */
function isTeacher(speaker: string): boolean {
  return speaker !== 'リッチーくん';
}

/**
 * 1つの発言エントリを1つ以上の吹き出しに展開する。
 * message が配列の場合、同じ話者の吹き出しを連続させる。
 */
function expandMessages(items: ConversationItem[]): { speaker: string; message: string; showIcon: boolean }[] {
  const result: { speaker: string; message: string; showIcon: boolean }[] = [];

  for (const item of items) {
    const messages = Array.isArray(item.message) ? item.message : [item.message];
    messages.forEach((msg, i) => {
      // アイコン表示：最初のエントリ、または前のエントリと話者が異なる場合のみ
      const prevEntry = result[result.length - 1];
      const showIcon = i === 0 && (!prevEntry || prevEntry.speaker !== item.speaker);
      result.push({ speaker: item.speaker, message: msg, showIcon });
    });
  }

  return result;
}

export function Conversation({ items }: ConversationProps) {
  const expanded = expandMessages(items);

  return (
    <div className="space-y-3 my-8">
      {expanded.map((item, index) => {
        const teacher = isTeacher(item.speaker);
        const iconPath = getCharacterIcon(item.speaker);
        // 前のエントリと同じ話者かどうか
        const prevSame = index > 0 && expanded[index - 1].speaker === item.speaker;

        return (
          <div
            key={index}
            className={`flex gap-3 ${teacher ? '' : 'flex-row-reverse'} ${prevSame ? 'mt-1' : 'mt-4'}`}
          >
            {/* アイコン領域：同じ話者の連続発言では透明なスペーサーを置いて揃える */}
            <div className="flex-shrink-0 w-10">
              {item.showIcon ? (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {iconPath ? (
                    <Image
                      src={iconPath}
                      alt={item.speaker}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold text-gray-400">{item.speaker[0]}</span>
                  )}
                </div>
              ) : (
                <div className="w-10" />
              )}
            </div>

            <div className={`flex-1 ${teacher ? '' : 'text-right'}`}>
              {item.showIcon && (
                <div className="font-semibold text-xs text-gray-500 mb-1">
                  {item.speaker}
                </div>
              )}
              <div
                className={`inline-block px-4 py-2.5 rounded-xl text-sm leading-relaxed ${
                  teacher
                    ? 'bg-blue-50 text-gray-800 rounded-tl-none'
                    : 'bg-gray-100 text-gray-800 rounded-tr-none'
                }`}
              >
                {item.message}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
