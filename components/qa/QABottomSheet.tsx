'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useQABot } from '@/components/qa/QABotProvider';
import { QAConversationLog } from '@/components/qa/QAConversationLog';
import { QACategorySelector } from '@/components/qa/QACategorySelector';
import { TextInputArea } from '@/components/qa/TextInputArea';

export function QABottomSheet() {
  const { isOpen, close, conversationHistory } = useQABot();

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && close()}>
      <Dialog.Portal>
        {/* オーバーレイ: 半透明の黒、クリックで閉じる */}
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />

        {/* BottomSheet コンテンツ */}
        <Dialog.Content
          className={[
            'fixed bottom-0 left-0 right-0',
            'max-h-[70vh]',
            'rounded-t-2xl',
            'flex flex-col',
            'p-0 pb-[env(safe-area-inset-bottom)]',
            'bg-white',
            'z-50',
            'outline-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'slide-in-from-bottom-full slide-out-to-bottom-full',
            'duration-300',
          ].join(' ')}
          aria-describedby={undefined}
        >
          {/* アクセシビリティ: スクリーンリーダー向けタイトル（視覚的に非表示） */}
          <Dialog.Title className="sr-only">ラグビーQ&Aボット</Dialog.Title>

          {/* ドラッグハンドル */}
          <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-2 shrink-0" aria-hidden="true" />

          {/* ヘッダー */}
          <div className="px-4 py-2 border-b shrink-0">
            <p className="text-sm font-semibold text-gray-800">
              🏉 ラグビーなんでも聞いてみて！
            </p>
          </div>

          {/* 会話ログ（スクロール可能） */}
          <QAConversationLog
            history={conversationHistory}
            className="flex-1 overflow-y-auto px-4 py-3"
          />

          {/* 選択エリア */}
          <div className="shrink-0 border-t">
            <QACategorySelector />
            <TextInputArea onSubmit={() => {}} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
