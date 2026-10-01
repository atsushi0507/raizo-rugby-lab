'use client';

import { useState, FormEvent } from 'react';

interface TextInputAreaProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export function TextInputArea({ onSubmit, disabled = false }: TextInputAreaProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      onSubmit(trimmed);
      setValue('');
    }
  };

  return (
    <div className="hidden px-4 py-3 border-t">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="ラグビーについて質問してみよう..."
            className="flex-1 px-3 py-2 text-sm border rounded-lg"
            disabled={disabled}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg"
            disabled={disabled}
          >
            送信
          </button>
        </div>
      </form>
    </div>
  );
}
