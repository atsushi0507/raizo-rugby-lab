'use client';

import type { SortOrder } from '@/lib/sort';

interface SortControlProps {
  value: SortOrder;
  onChange: (order: SortOrder) => void;
}

const OPTIONS: { label: string; value: SortOrder }[] = [
  { label: 'レベル順', value: 'level' },
  { label: '人気順', value: 'popular' },
  { label: '新着順', value: 'newest' },
];

export default function SortControl({ value, onChange }: SortControlProps) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label="並び替え">
      <span className="text-sm text-gray-600 shrink-0">並び替え：</span>
      <div className="flex gap-1 flex-wrap">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              value === opt.value
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
