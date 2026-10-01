// Feature: watching-qa-bot
// Unit tests for QA Bot components
// Validates: Requirements 1.1–1.5, 2.1–2.5, 3.1–3.6, 5.1–5.5, 6.3, 9.1–9.5

import React from 'react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, render } from '@testing-library/react';
import { generateKnowledgeBaseLink } from '@/lib/qa-types';
import { useQASession } from '../useQASession';
import { useQABot, QABotProvider } from '../QABotProvider';
import type { QAData } from '@/lib/qa-types';
import { QAFloatButton } from '../QAFloatButton';
import { QACategorySelector } from '../QACategorySelector';

// ─── Test helpers ────────────────────────────────────────────────────────────

const mockQAData: QAData = {
  categories: [
    {
      id: 'scoring',
      label: '🏉 得点・トライ',
      subcategories: [
        { id: 'try', label: 'トライ', categoryId: 'scoring' },
        { id: 'conversion', label: 'コンバージョン', categoryId: 'scoring' },
      ],
    },
    {
      id: 'setpieces',
      label: '⚡ 密集・セットプレー',
      subcategories: [
        { id: 'scrum', label: 'スクラム', categoryId: 'setpieces' },
      ],
    },
    {
      id: 'fouls',
      label: '🟡 反則・カード',
      subcategories: [
        { id: 'basic-fouls', label: '基本的な反則', categoryId: 'fouls' },
      ],
    },
    {
      id: 'restarts',
      label: '🔄 試合の再開方法',
      subcategories: [
        { id: 'kickoff', label: 'キックオフ', categoryId: 'restarts' },
      ],
    },
    {
      id: 'positions',
      label: '👤 ポジション',
      subcategories: [
        { id: 'forwards', label: 'フォワード', categoryId: 'positions' },
      ],
    },
    {
      id: 'gameplay',
      label: '📺 試合の進め方',
      subcategories: [
        { id: 'match-flow', label: '試合の流れ', categoryId: 'gameplay' },
      ],
    },
  ],
  items: [
    {
      id: 'what-is-try',
      categoryId: 'scoring',
      subcategoryId: 'try',
      question: 'トライって何？',
      richieMessage: 'トライって何？',
      raizoMessages: ['トライはラグビーで一番大事な得点だ。'],
      knowledgeBaseRefs: ['rules/scoring'],
      aiEnabled: false,
    },
    {
      id: 'what-is-scrum',
      categoryId: 'setpieces',
      subcategoryId: 'scrum',
      question: 'スクラムってなぜ組むの？',
      richieMessage: 'スクラムってなぜ組むの？',
      raizoMessages: ['スクラムはノックオンなどの反則後に行うプレーだ。'],
      knowledgeBaseRefs: ['rules/setpieces'],
      aiEnabled: false,
    },
  ],
};

// Wrapper component that provides QABotContext
function QABotWrapper({ children }: { children: React.ReactNode }) {
  return <QABotProvider qaData={mockQAData}>{children}</QABotProvider>;
}

// ─── generateKnowledgeBaseLink ───────────────────────────────────────────────

describe('generateKnowledgeBaseLink', () => {
  test('rules/ プレフィックスを /rules/... に変換する', () => {
    expect(generateKnowledgeBaseLink('rules/knock-forward')).toBe('/rules/knock-forward');
    expect(generateKnowledgeBaseLink('rules/scoring')).toBe('/rules/scoring');
    expect(generateKnowledgeBaseLink('rules/setpieces')).toBe('/rules/setpieces');
  });

  test('positions/ プレフィックスを /positions/... に変換する', () => {
    expect(generateKnowledgeBaseLink('positions/sh9')).toBe('/positions/sh9');
    expect(generateKnowledgeBaseLink('positions/ho2')).toBe('/positions/ho2');
    expect(generateKnowledgeBaseLink('positions/fb15')).toBe('/positions/fb15');
  });

  test('不明なプレフィックスは null を返す', () => {
    expect(generateKnowledgeBaseLink('unknown/foo')).toBeNull();
    expect(generateKnowledgeBaseLink('articles/article1')).toBeNull();
    expect(generateKnowledgeBaseLink('gallery/gallery1')).toBeNull();
    expect(generateKnowledgeBaseLink('')).toBeNull();
    expect(generateKnowledgeBaseLink('glossary')).toBeNull();
  });

  test('スラッシュなしのプレフィックスは null を返す', () => {
    expect(generateKnowledgeBaseLink('rules')).toBeNull();
    expect(generateKnowledgeBaseLink('positions')).toBeNull();
  });
});

// ─── useQASession ────────────────────────────────────────────────────────────

describe('useQASession - エラーハンドリング', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test('sessionStorage.getItem が例外をスローした場合、空配列でフォールバックする', () => {
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

    expect(() => {
      act(() => {
        result.current.addEntry({
          id: 'test',
          richieMessage: 'テスト',
          raizoMessages: ['回答'],
          source: 'static',
          timestamp: Date.now(),
        });
      });
    }).not.toThrow();

    // インメモリ state には反映されている
    expect(result.current.history).toHaveLength(1);
  });

  test('sessionStorage が空の場合、空配列で初期化される', () => {
    const { result } = renderHook(() => useQASession());
    expect(result.current.history).toEqual([]);
  });
});

// ─── QAFloatButton ───────────────────────────────────────────────────────────

describe('QAFloatButton', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test('fixed bottom-6 left-6 の位置クラスを持つ', () => {
    const { container } = render(
      <QABotWrapper>
        <QAFloatButton />
      </QABotWrapper>
    );

    const button = container.querySelector('button');
    expect(button).not.toBeNull();
    expect(button!.className).toContain('fixed');
    expect(button!.className).toContain('bottom-6');
    expect(button!.className).toContain('left-6');
  });

  test('isOpen=false の時に aria-label が "ラグビーQ&A Botを開く" になる', () => {
    const { container } = render(
      <QABotWrapper>
        <QAFloatButton />
      </QABotWrapper>
    );

    const button = container.querySelector('button');
    expect(button).not.toBeNull();
    expect(button!.getAttribute('aria-label')).toBe('ラグビーQ&A Botを開く');
  });

  test('aria-expanded 属性が isOpen と同期している（初期=false）', () => {
    const { container } = render(
      <QABotWrapper>
        <QAFloatButton />
      </QABotWrapper>
    );

    const button = container.querySelector('button');
    expect(button).not.toBeNull();
    expect(button!.getAttribute('aria-expanded')).toBe('false');
  });

  test('w-14 h-14 の最小サイズクラスを持つ（44px 超）', () => {
    const { container } = render(
      <QABotWrapper>
        <QAFloatButton />
      </QABotWrapper>
    );

    const button = container.querySelector('button');
    expect(button).not.toBeNull();
    expect(button!.className).toContain('w-14');
    expect(button!.className).toContain('h-14');
  });

  test('ボタンをクリックすると aria-expanded が切り替わる', () => {
    const { container } = render(
      <QABotWrapper>
        <QAFloatButton />
      </QABotWrapper>
    );

    const button = container.querySelector('button');
    expect(button!.getAttribute('aria-expanded')).toBe('false');

    act(() => {
      button!.click();
    });

    expect(button!.getAttribute('aria-expanded')).toBe('true');
    expect(button!.getAttribute('aria-label')).toBe('Q&A Botを閉じる');
  });
});

// ─── QABottomSheet ───────────────────────────────────────────────────────────

describe('QABottomSheet', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test('isOpen=true の時に max-h-[70vh] クラスが存在する', async () => {
    const { QABottomSheet } = await import('../QABottomSheet');

    // Toggle helper component to capture the toggle function
    let toggleFn: (() => void) | undefined;
    function ToggleCapture() {
      const { toggle } = useQABot();
      React.useEffect(() => {
        toggleFn = toggle;
      }, [toggle]);
      return null;
    }

    render(
      <QABotWrapper>
        <ToggleCapture />
        <QABottomSheet />
      </QABotWrapper>
    );

    act(() => {
      toggleFn?.();
    });

    // Radix Dialog renders into document.body portal
    const allElements = document.body.querySelectorAll('*');
    let foundMaxH = false;
    allElements.forEach((el) => {
      const cls = el.getAttribute('class') ?? '';
      if (cls.includes('max-h-[70vh]')) {
        foundMaxH = true;
      }
    });
    expect(foundMaxH).toBe(true);
  });

  test('isOpen=true の時に Safe Area padding クラスが存在する', async () => {
    const { QABottomSheet } = await import('../QABottomSheet');

    let toggleFn: (() => void) | undefined;
    function ToggleCapture() {
      const { toggle } = useQABot();
      React.useEffect(() => {
        toggleFn = toggle;
      }, [toggle]);
      return null;
    }

    render(
      <QABotWrapper>
        <ToggleCapture />
        <QABottomSheet />
      </QABotWrapper>
    );

    act(() => {
      toggleFn?.();
    });

    const allElements = document.body.querySelectorAll('*');
    let foundSafeArea = false;
    allElements.forEach((el) => {
      const cls = el.getAttribute('class') ?? '';
      if (cls.includes('pb-[env(safe-area-inset-bottom)]')) {
        foundSafeArea = true;
      }
    });
    expect(foundSafeArea).toBe(true);
  });
});

// ─── QACategorySelector ──────────────────────────────────────────────────────

describe('QACategorySelector', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test('初期状態で 6 件のカテゴリボタンが表示される', () => {
    const { container } = render(
      <QABotWrapper>
        <QACategorySelector />
      </QABotWrapper>
    );

    // カテゴリボタンは aria-label が "カテゴリ「...」を選ぶ" 形式
    const categoryButtons = container.querySelectorAll('button[aria-label^="カテゴリ「"]');
    expect(categoryButtons.length).toBe(6);
  });

  test('QAItem が 0 件の中カテゴリを選択した場合にフォールバックメッセージが表示される', () => {
    const emptyQAData: QAData = {
      categories: [
        {
          id: 'scoring',
          label: '🏉 得点・トライ',
          subcategories: [
            { id: 'empty-sub', label: 'テスト', categoryId: 'scoring' },
          ],
        },
      ],
      items: [], // アイテムなし
    };

    const { container } = render(
      <QABotProvider qaData={emptyQAData}>
        <QACategorySelector />
      </QABotProvider>
    );

    // カテゴリを選択
    const categoryButton = container.querySelector('button[aria-label^="カテゴリ「"]') as HTMLButtonElement | null;
    expect(categoryButton).not.toBeNull();
    act(() => {
      categoryButton!.click();
    });

    // 中カテゴリを選択
    const subButton = container.querySelector('button[aria-label^="中カテゴリ「"]') as HTMLButtonElement | null;
    expect(subButton).not.toBeNull();
    act(() => {
      subButton!.click();
    });

    // フォールバックメッセージが表示される
    expect(container.textContent).toContain('このカテゴリには現在質問がありません');
  });

  test('カテゴリボタンが min-h-[44px] クラスを持つ', () => {
    const { container } = render(
      <QABotWrapper>
        <QACategorySelector />
      </QABotWrapper>
    );

    const categoryButtons = container.querySelectorAll('button[aria-label^="カテゴリ「"]');
    categoryButtons.forEach((button) => {
      expect(button.className).toContain('min-h-[44px]');
    });
  });
});
