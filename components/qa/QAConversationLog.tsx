'use client';

import { useRef, useEffect, useState } from 'react';
import { ConversationEntry } from '@/components/qa/useQASession';
import { QAConversationMessage } from '@/components/qa/QAConversationMessage';

interface QAConversationLogProps {
  history: ConversationEntry[];
  className?: string;
}

/**
 * 最後のエントリのライゾウメッセージをシーケンシャルにタイプライター表示する。
 * completedUpTo = n の時、index 0..n は完了済み（全文表示）、n+1 がアニメーション中。
 */
function LastEntryMessages({
  entry,
  onNewMessage,
}: {
  entry: ConversationEntry;
  onNewMessage: () => void;
}) {
  // 何番目のメッセージまでタイプライター完了したか（-1 = まだ開始前）
  const [completedUpTo, setCompletedUpTo] = useState(-1);

  // entry が変わったらリセット
  useEffect(() => {
    setCompletedUpTo(-1);
  }, [entry]);

  // 新しいメッセージが active になるたびにスクロール
  useEffect(() => {
    onNewMessage();
  // completedUpTo が変わる = 次のメッセージが表示開始されるタイミング
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedUpTo]);

  return (
    <>
      {entry.raizoMessages.map((msg, msgIndex) => {
        // completedUpTo >= msgIndex → このメッセージは完了済み → 即時全文表示
        // completedUpTo === msgIndex - 1 → 直前が完了 → このメッセージをアニメーション中
        // completedUpTo < msgIndex - 1 → まだ順番が来ていない → 非表示
        const isDone = completedUpTo >= msgIndex;
        const isActive = completedUpTo === msgIndex - 1;
        const isPending = completedUpTo < msgIndex - 1;

        if (isPending) return null;

        return (
          <QAConversationMessage
            key={msgIndex}
            speaker="ライゾウ"
            message={msg}
            showIcon={msgIndex === 0}
            useTypewriterEffect={isActive}
            speed={40}
            onComplete={
              isActive
                ? () => setCompletedUpTo(msgIndex)
                : undefined
            }
          />
        );
      })}
    </>
  );
}

export function QAConversationLog({ history, className }: QAConversationLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // 履歴が更新されるたびに末尾へ自動スクロール
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={className}>
      {/* 空の場合の初期メッセージ */}
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[120px] text-center text-gray-500 px-4">
          <p className="text-2xl mb-2">🏉</p>
          <p className="text-sm font-medium text-gray-700 mb-1">
            気になることを選んでみよう！
          </p>
          <p className="text-sm text-gray-500">
            下のボタンからカテゴリを選ぶと、ライゾウが答えてくれるよ。
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((entry, entryIndex) => {
            const isLastEntry = entryIndex === history.length - 1;

            return (
              <div key={entry.id + '-' + entry.timestamp} className="space-y-3">
                {/* リッチーくんの発言 */}
                <QAConversationMessage
                  speaker="リッチーくん"
                  message={entry.richieMessage}
                  showIcon={true}
                  useTypewriterEffect={false}
                />

                {/* ライゾウの各発言 */}
                {isLastEntry ? (
                  // 最新エントリ: シーケンシャルにタイプライター表示
                  <LastEntryMessages entry={entry} onNewMessage={scrollToBottom} />
                ) : (
                  // 過去エントリ: 全文即時表示
                  entry.raizoMessages.map((msg, msgIndex) => (
                    <QAConversationMessage
                      key={msgIndex}
                      speaker="ライゾウ"
                      message={msg}
                      showIcon={msgIndex === 0}
                      useTypewriterEffect={false}
                    />
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 末尾スクロール用アンカー */}
      <div ref={bottomRef} />
    </div>
  );
}
