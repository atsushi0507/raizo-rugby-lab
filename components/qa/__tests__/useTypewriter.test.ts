// Feature: watching-qa-bot
// Validates: Requirements 4.4, 4.5, 9.4, 8.4

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { useTypewriter } from '../useTypewriter';

// ユニットテスト
describe('useTypewriter - ユニットテスト', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('enabled=false の場合、初期レンダリングから isComplete=true になる', () => {
    const text = 'テストテキスト';
    const { result } = renderHook(() =>
      useTypewriter({ text, enabled: false })
    );
    expect(result.current.displayedText).toBe(text);
    expect(result.current.isComplete).toBe(true);
  });

  test('enabled=true の場合、最初は displayedText が空で isComplete=false', () => {
    const { result } = renderHook(() =>
      useTypewriter({ text: 'hello', speed: 40 })
    );
    expect(result.current.displayedText).toBe('');
    expect(result.current.isComplete).toBe(false);
  });

  test('speed=40 で10文字のテキストを渡すと、約400ms後に isComplete=true になる', () => {
    const text = '1234567890';
    const { result } = renderHook(() =>
      useTypewriter({ text, speed: 40 })
    );

    expect(result.current.isComplete).toBe(false);

    // 400ms 進める（10文字 × 40ms）
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current.isComplete).toBe(true);
    expect(result.current.displayedText).toBe(text);
  });

  test('skip() 呼び出し後、即座に displayedText === text かつ isComplete === true になる', () => {
    const text = 'こんにちは世界';
    const { result } = renderHook(() =>
      useTypewriter({ text, speed: 40 })
    );

    expect(result.current.isComplete).toBe(false);

    act(() => {
      result.current.skip();
    });

    expect(result.current.displayedText).toBe(text);
    expect(result.current.isComplete).toBe(true);
  });

  test('text が変更されると表示がリセットされる', () => {
    let text = 'firsttext';
    const { result, rerender } = renderHook(
      ({ t }: { t: string }) => useTypewriter({ text: t, speed: 40 }),
      { initialProps: { t: text } }
    );

    // 一部進める
    act(() => {
      vi.advanceTimersByTime(120); // 3文字
    });
    expect(result.current.displayedText.length).toBe(3);

    // text を変更
    text = 'newtext';
    act(() => {
      rerender({ t: text });
    });

    // リセットされて空から再開
    expect(result.current.displayedText).toBe('');
    expect(result.current.isComplete).toBe(false);
  });

  test('onComplete コールバックが全文表示完了時に呼ばれる', () => {
    const text = 'abc';
    const onComplete = vi.fn();
    renderHook(() =>
      useTypewriter({ text, speed: 40, onComplete })
    );

    act(() => {
      vi.advanceTimersByTime(120); // 3文字 × 40ms
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  test('skip() 呼び出し後に onComplete が呼ばれる', () => {
    const text = 'テスト';
    const onComplete = vi.fn();
    const { result } = renderHook(() =>
      useTypewriter({ text, speed: 40, onComplete })
    );

    act(() => {
      result.current.skip();
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  test('空文字列を渡すと即座に isComplete=true になる', () => {
    const { result } = renderHook(() =>
      useTypewriter({ text: '', speed: 40 })
    );
    expect(result.current.isComplete).toBe(true);
    expect(result.current.displayedText).toBe('');
  });

  test('文字が1つずつ追加される', () => {
    const text = 'ab';
    const { result } = renderHook(() =>
      useTypewriter({ text, speed: 100 })
    );

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.displayedText).toBe('a');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.displayedText).toBe('ab');
    expect(result.current.isComplete).toBe(true);
  });
});

// Property 4: TypewriterEffect の速度範囲
// Feature: watching-qa-bot, Property 4: TypewriterEffect の速度範囲
describe('Property 4: TypewriterEffect の速度範囲', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('任意のテキストと速度(30-50ms)に対して displayedText が段階的に増加し最終的に全文になる', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }),
        fc.integer({ min: 30, max: 50 }),
        (text, speed) => {
          const { result } = renderHook(() =>
            useTypewriter({ text, speed })
          );

          // 完了するまでタイマーを進める
          act(() => {
            vi.advanceTimersByTime(speed * text.length + speed);
          });

          expect(result.current.displayedText).toBe(text);
          expect(result.current.isComplete).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('displayedText の長さが各ステップで 0 または 1 ずつ増加する', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 2, maxLength: 10 }),
        fc.integer({ min: 30, max: 50 }),
        (text, speed) => {
          const { result } = renderHook(() =>
            useTypewriter({ text, speed })
          );

          const lengths: number[] = [result.current.displayedText.length];

          // 各ステップを1文字ずつ進める
          for (let i = 0; i < text.length; i++) {
            act(() => {
              vi.advanceTimersByTime(speed);
            });
            lengths.push(result.current.displayedText.length);
          }

          // 各ステップで差分が 0 か 1
          for (let i = 1; i < lengths.length; i++) {
            const diff = lengths[i] - lengths[i - 1];
            if (diff < 0 || diff > 1) return false;
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Property 5: TypewriterEffect のスキップ
// Feature: watching-qa-bot, Property 5: TypewriterEffect のスキップ
describe('Property 5: TypewriterEffect のスキップ', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('任意のテキストに対して skip() 後に即座に全文表示される', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }),
        (text) => {
          const { result } = renderHook(() =>
            useTypewriter({ text, speed: 40 })
          );

          act(() => {
            result.current.skip();
          });

          expect(result.current.displayedText).toBe(text);
          expect(result.current.isComplete).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
