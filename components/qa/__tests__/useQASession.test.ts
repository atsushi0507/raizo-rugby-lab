// Feature: watching-qa-bot
// Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { useQASession, ConversationEntry } from '../useQASession';

// テスト用エントリファクトリ
function makeEntry(overrides?: Partial<ConversationEntry>): ConversationEntry {
  return {
    id: 'what-is-try',
    richieMessage: 'トライって何？',
    raizoMessages: ['トライはラグビーの最も重要な得点だ。'],
    source: 'static',
    timestamp: Date.now(),
    ...overrides,
  };
}

// ユニットテスト
describe('useQASession - ユニットテスト', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test('初期状態で history が空の配列になる', () => {
    const { result } = renderHook(() => useQASession());
    expect(result.current.history).toEqual([]);
  });

  test('addEntry で追加したエントリが history に反映される', () => {
    const { result } = renderHook(() => useQASession());
    const entry = makeEntry();

    act(() => {
      result.current.addEntry(entry);
    });

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0]).toEqual(entry);
  });

  test('複数エントリを追加すると全て history に反映される', () => {
    const { result } = renderHook(() => useQASession());
    const entry1 = makeEntry({ id: 'entry-1' });
    const entry2 = makeEntry({ id: 'entry-2' });

    act(() => {
      result.current.addEntry(entry1);
      result.current.addEntry(entry2);
    });

    expect(result.current.history).toHaveLength(2);
    expect(result.current.history[0].id).toBe('entry-1');
    expect(result.current.history[1].id).toBe('entry-2');
  });

  test('clearHistory で history が空になる', () => {
    const { result } = renderHook(() => useQASession());

    act(() => {
      result.current.addEntry(makeEntry());
    });
    expect(result.current.history).toHaveLength(1);

    act(() => {
      result.current.clearHistory();
    });
    expect(result.current.history).toEqual([]);
  });

  test('addEntry で sessionStorage にデータが書き込まれる', () => {
    const { result } = renderHook(() => useQASession());
    const entry = makeEntry();

    act(() => {
      result.current.addEntry(entry);
    });

    const stored = sessionStorage.getItem('qa-bot-history');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].id).toBe(entry.id);
  });

  test('clearHistory で sessionStorage からデータが削除される', () => {
    const { result } = renderHook(() => useQASession());

    act(() => {
      result.current.addEntry(makeEntry());
    });

    act(() => {
      result.current.clearHistory();
    });

    expect(sessionStorage.getItem('qa-bot-history')).toBeNull();
  });

  test('sessionStorage に既存データがある場合、初期 history として復元される', () => {
    const entry = makeEntry({ id: 'pre-existing' });
    sessionStorage.setItem('qa-bot-history', JSON.stringify([entry]));

    const { result } = renderHook(() => useQASession());

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].id).toBe('pre-existing');
  });

  test('sessionStorage.getItem が例外をスローした場合、空配列で初期化される', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => {
      throw new DOMException('SecurityError', 'SecurityError');
    });

    const { result } = renderHook(() => useQASession());

    expect(result.current.history).toEqual([]);
  });

  test('sessionStorage.setItem が例外をスローしても addEntry がエラーにならない', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new DOMException('QuotaExceededError', 'QuotaExceededError');
    });

    const { result } = renderHook(() => useQASession());
    const entry = makeEntry();

    expect(() => {
      act(() => {
        result.current.addEntry(entry);
      });
    }).not.toThrow();

    // インメモリ state には反映されている
    expect(result.current.history).toHaveLength(1);
  });
});

// Property 6: 会話履歴の保存・復元 (Round-trip)
// Feature: watching-qa-bot, Property 6: 会話履歴の保存・復元
describe('Property 6: 会話履歴の保存・復元 (Round-trip)', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  // fast-check 用アービトラリ
  const arbitraryConversationEntry = (): fc.Arbitrary<ConversationEntry> =>
    fc.record({
      id: fc.string({ minLength: 1, maxLength: 50 }),
      richieMessage: fc.string({ minLength: 1, maxLength: 100 }),
      raizoMessages: fc.array(fc.string({ minLength: 1, maxLength: 200 }), {
        minLength: 1,
        maxLength: 3,
      }),
      source: fc.constantFrom('static' as const, 'ai' as const),
      timestamp: fc.integer({ min: 0, max: 9999999999999 }),
    });

  test('任意の ConversationEntry 配列に対して JSON ラウンドトリップが保持される', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryConversationEntry(), { minLength: 1, maxLength: 20 }),
        (entries) => {
          const serialized = JSON.stringify(entries);
          const restored = JSON.parse(serialized) as ConversationEntry[];
          expect(restored).toEqual(entries);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('addEntry で追加したエントリが sessionStorage 経由で復元される', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryConversationEntry(), { minLength: 1, maxLength: 10 }),
        (entries) => {
          sessionStorage.clear();

          const { result } = renderHook(() => useQASession());

          act(() => {
            entries.forEach((entry) => result.current.addEntry(entry));
          });

          // sessionStorage から直接読み出して検証
          const stored = sessionStorage.getItem('qa-bot-history');
          expect(stored).not.toBeNull();
          const restored = JSON.parse(stored!) as ConversationEntry[];
          expect(restored).toEqual(entries);
        }
      ),
      { numRuns: 100 }
    );
  });
});
