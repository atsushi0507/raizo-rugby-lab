'use client';

import { useState, useRef, useEffect } from 'react';

interface GlossaryTermProps {
  term: string;
  description: string;
}

const TOOLTIP_WIDTH = 256; // w-64 = 16rem = 256px
const SCREEN_PADDING = 12; // 画面端からの最小余白(px)

export function GlossaryTerm({ term, description }: GlossaryTermProps) {
  const [open, setOpen] = useState(false);
  const [above, setAbove] = useState(false);
  const [offsetX, setOffsetX] = useState(0); // 中央からのずれ(px)
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // 上下の判定
      setAbove(rect.top > 120);

      // ポップアップの理想的な左端・右端（中央揃えの場合）
      const termCenterX = rect.left + rect.width / 2;
      const idealLeft = termCenterX - TOOLTIP_WIDTH / 2;
      const idealRight = termCenterX + TOOLTIP_WIDTH / 2;

      let shift = 0;
      if (idealLeft < SCREEN_PADDING) {
        // 左にはみ出す場合：右にずらす
        shift = SCREEN_PADDING - idealLeft;
      } else if (idealRight > viewportWidth - SCREEN_PADDING) {
        // 右にはみ出す場合：左にずらす
        shift = (viewportWidth - SCREEN_PADDING) - idealRight;
      }
      setOffsetX(shift);
    }
  }, [open]);

  return (
    <span className="relative inline" ref={ref}>
      <span
        className="underline decoration-dotted decoration-green-400 underline-offset-2 cursor-help text-green-700 font-medium"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        role="button"
        tabIndex={0}
        aria-label={`用語: ${term}`}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen((v) => !v); }}
      >
        {term}
      </span>
      {open && (
        <span
          className={
            'absolute z-50 w-64 px-3 py-2 rounded-lg shadow-lg border text-xs leading-relaxed bg-white text-gray-700 border-gray-200 ' +
            (above ? 'bottom-full mb-2' : 'top-full mt-2')
          }
          style={{
            left: '50%',
            transform: `translateX(calc(-50% + ${offsetX}px))`,
          }}
        >
          <span className="font-semibold text-green-700 block mb-0.5">📖 {term}</span>
          {description}
          {/* 吹き出しの三角は中央固定のまま（用語の真上/真下を指す） */}
          <span
            className={
              'absolute w-2 h-2 bg-white border-gray-200 rotate-45 ' +
              (above ? 'top-full -mt-1 border-r border-b' : 'bottom-full -mb-1 border-l border-t')
            }
            style={{ left: `calc(50% - ${offsetX}px - 4px)` }}
          />
        </span>
      )}
    </span>
  );
}
