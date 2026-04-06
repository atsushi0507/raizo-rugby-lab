import Image from 'next/image';
import { getCharacterIcon } from '@/lib/characters';

interface ConversationItem {
  speaker: string;
  message: string;
}

interface ConversationProps {
  items: ConversationItem[];
}

/**
 * 教師役の speaker かどうかを判定する。
 * リッチーくん以外は教師役（ライゾウ、ゲスト解説員など）として左側に表示する。
 */
function isTeacher(speaker: string): boolean {
  return speaker !== 'リッチーくん';
}

export function Conversation({ items }: ConversationProps) {
  return (
    <div className="space-y-6 my-8">
      {items.map((item, index) => {
        const teacher = isTeacher(item.speaker);
        const iconPath = getCharacterIcon(item.speaker);

        return (
          <div
            key={index}
            className={`flex gap-4 ${teacher ? '' : 'flex-row-reverse'}`}
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {iconPath ? (
                  <Image
                    src={iconPath}
                    alt={item.speaker}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold text-gray-400">{item.speaker[0]}</span>
                )}
              </div>
            </div>
            <div className={`flex-1 ${teacher ? '' : 'text-right'}`}>
              <div className="font-semibold text-sm text-gray-600 mb-1">
                {item.speaker}
              </div>
              <div
                className={`inline-block px-4 py-3 rounded-lg ${
                  teacher
                    ? 'bg-blue-100 text-gray-800'
                    : 'bg-gray-100 text-gray-800'
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
