'use client';

import { useState, useRef, useEffect } from 'react';

interface GlossaryTermProps {
  term: string;
  description: string;
}

export function GlossaryTerm({ term, description }: GlossaryTermProps) {
  const [open, setOpen] = useState(false);
  const [above, setAbove] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      // ツールチップが画面上部に収まらない場合は下に表示
      setAbove(rect.top > 120);
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
            'absolute z-50 left-1/2 -translate-x-1/2 w-64 px-3 py-2 rounded-lg shadow-lg border text-xs leading-relaxed bg-white text-gray-700 border-gray-200 ' +
            (above ? 'bottom-full mb-2' : 'top-full mt-2')
          }
        >
          <span className="font-semibold text-green-700 block mb-0.5">📖 {term}</span>
          {description}
          <span
            className={
              'absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-gray-200 rotate-45 ' +
              (above ? 'top-full -mt-1 border-r border-b' : 'bottom-full -mb-1 border-l border-t')
            }
          />
        </span>
      )}
    </span>
  );
}
