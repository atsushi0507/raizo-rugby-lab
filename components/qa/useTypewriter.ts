'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTypewriterOptions {
  text: string;
  speed?: number; // ms/文字, デフォルト 40
  onComplete?: () => void;
  enabled?: boolean; // false の場合は即座に全文表示（AI streaming 拡張用）
}

interface UseTypewriterReturn {
  displayedText: string;
  isComplete: boolean;
  skip: () => void;
}

export function useTypewriter({
  text,
  speed = 40,
  onComplete,
  enabled = true,
}: UseTypewriterOptions): UseTypewriterReturn {
  // enabled=false の場合は即時に全文表示
  const [displayedText, setDisplayedText] = useState<string>(enabled ? '' : text);
  const [isComplete, setIsComplete] = useState<boolean>(!enabled);

  // インターバル参照（skip() でクリアするため）
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // 現在表示文字数のカウンター（クロージャ問題を避けるため ref を使用）
  const indexRef = useRef<number>(0);
  // onComplete の最新版を ref に保持（依存配列に含めず常に最新を参照）
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // enabled or text が変更されたときに状態をリセット
  useEffect(() => {
    if (!enabled) {
      // 即時全文表示
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      indexRef.current = text.length;
      setDisplayedText(text);
      setIsComplete(true);
      onCompleteRef.current?.();
      return;
    }

    // enabled=true: 最初からタイプライター開始
    indexRef.current = 0;
    setDisplayedText('');
    setIsComplete(false);

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }

    // テキストが空の場合は即完了
    if (text.length === 0) {
      setIsComplete(true);
      onCompleteRef.current?.();
      return;
    }

    intervalRef.current = setInterval(() => {
      indexRef.current += 1;
      const nextIndex = indexRef.current;
      setDisplayedText(text.slice(0, nextIndex));

      if (nextIndex >= text.length) {
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsComplete(true);
        onCompleteRef.current?.();
      }
    }, speed);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [text, speed, enabled]);

  const skip = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    indexRef.current = text.length;
    setDisplayedText(text);
    setIsComplete(true);
    onCompleteRef.current?.();
  }, [text]);

  return { displayedText, isComplete, skip };
}
