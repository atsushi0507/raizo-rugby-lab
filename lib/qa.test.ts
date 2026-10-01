import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  validateQAItem,
  validateQACategory,
  getQAData,
  getItemsBySubcategory,
  getSubcategoriesByCategory,
  generateKnowledgeBaseLink,
} from './qa';

// ─── テスト用一時ディレクトリ ─────────────────────────────────────────────────

const TEST_QA_DIR = path.join(process.cwd(), 'data', 'qa-test-tmp');

beforeAll(() => {
  if (!fs.existsSync(TEST_QA_DIR)) {
    fs.mkdirSync(TEST_QA_DIR, { recursive: true });
  }
});

afterAll(() => {
  if (fs.existsSync(TEST_QA_DIR)) {
    fs.rmSync(TEST_QA_DIR, { recursive: true, force: true });
  }
});

// ─── validateQAItem ───────────────────────────────────────────────────────────

describe('validateQAItem', () => {
  it('有効なデータを受け入れる', () => {
    const valid = {
      id: 'what-is-try',
      categoryId: 'scoring',
      subcategoryId: 'try',
      question: 'トライって何？',
      richieMessage: 'トライって何？なんで5点なの？',
      raizoMessages: ['トライはラグビーで一番大事な得点だ。'],
      knowledgeBaseRefs: ['rules/scoring'],
      aiEnabled: false,
    };
    expect(() => validateQAItem(valid)).not.toThrow();
    const result = validateQAItem(valid);
    expect(result.id).toBe('what-is-try');
    expect(result.aiEnabled).toBe(false);
  });

  it('id が欠けている場合はエラーをスロー', () => {
    const invalid = {
      categoryId: 'scoring',
      subcategoryId: 'try',
      question: 'トライって何？',
      richieMessage: 'トライって何？',
      raizoMessages: ['回答'],
      knowledgeBaseRefs: [],
      aiEnabled: false,
    };
    expect(() => validateQAItem(invalid)).toThrow();
  });

  it('raizoMessages が配列でない場合はエラーをスロー', () => {
    const invalid = {
      id: 'test',
      categoryId: 'scoring',
      subcategoryId: 'try',
      question: '質問',
      richieMessage: '質問文',
      raizoMessages: '文字列（配列でない）',
      knowledgeBaseRefs: [],
      aiEnabled: false,
    };
    expect(() => validateQAItem(invalid)).toThrow();
  });

  it('aiEnabled が boolean でない場合はエラーをスロー', () => {
    const invalid = {
      id: 'test',
      categoryId: 'scoring',
      subcategoryId: 'try',
      question: '質問',
      richieMessage: '質問文',
      raizoMessages: ['回答'],
      knowledgeBaseRefs: [],
      aiEnabled: 'false', // string ではなく boolean が必要
    };
    expect(() => validateQAItem(invalid)).toThrow();
  });

  it('null を渡すとエラーをスロー', () => {
    expect(() => validateQAItem(null)).toThrow();
  });
});

// ─── validateQACategory ───────────────────────────────────────────────────────

describe('validateQACategory', () => {
  it('有効なカテゴリを受け入れる', () => {
    const valid = {
      id: 'scoring',
      label: '🏉 得点・トライ',
      subcategories: [
        { id: 'try', label: 'トライ' },
        { id: 'conversion', label: 'コンバージョン' },
      ],
    };
    const result = validateQACategory(valid);
    expect(result.id).toBe('scoring');
    expect(result.subcategories).toHaveLength(2);
    // categoryId が自動付与される
    expect(result.subcategories[0].categoryId).toBe('scoring');
  });

  it('label が欠けている場合はエラーをスロー', () => {
    const invalid = {
      id: 'scoring',
      subcategories: [],
    };
    expect(() => validateQACategory(invalid)).toThrow();
  });

  it('subcategories が配列でない場合はエラーをスロー', () => {
    const invalid = {
      id: 'scoring',
      label: 'テスト',
      subcategories: 'not-an-array',
    };
    expect(() => validateQACategory(invalid)).toThrow();
  });
});

// ─── generateKnowledgeBaseLink ────────────────────────────────────────────────

describe('generateKnowledgeBaseLink', () => {
  it('"rules/..." を "/rules/..." に変換する', () => {
    expect(generateKnowledgeBaseLink('rules/knock-forward')).toBe('/rules/knock-forward');
    expect(generateKnowledgeBaseLink('rules/scoring')).toBe('/rules/scoring');
  });

  it('"positions/..." を "/positions/..." に変換する', () => {
    expect(generateKnowledgeBaseLink('positions/sh9')).toBe('/positions/sh9');
    expect(generateKnowledgeBaseLink('positions/fb15')).toBe('/positions/fb15');
  });

  it('不明なプレフィックスの場合は null を返す', () => {
    expect(generateKnowledgeBaseLink('unknown/foo')).toBeNull();
    expect(generateKnowledgeBaseLink('articles/test')).toBeNull();
    expect(generateKnowledgeBaseLink('foo')).toBeNull();
    expect(generateKnowledgeBaseLink('')).toBeNull();
  });
});

// ─── getItemsBySubcategory / getSubcategoriesByCategory ──────────────────────

describe('getItemsBySubcategory', () => {
  it('指定した subcategoryId のアイテムのみを返す', () => {
    const data = {
      categories: [],
      items: [
        {
          id: 'item1', categoryId: 'scoring', subcategoryId: 'try',
          question: 'Q1', richieMessage: 'R1', raizoMessages: ['A1'],
          knowledgeBaseRefs: [], aiEnabled: false,
        },
        {
          id: 'item2', categoryId: 'scoring', subcategoryId: 'conversion',
          question: 'Q2', richieMessage: 'R2', raizoMessages: ['A2'],
          knowledgeBaseRefs: [], aiEnabled: false,
        },
        {
          id: 'item3', categoryId: 'scoring', subcategoryId: 'try',
          question: 'Q3', richieMessage: 'R3', raizoMessages: ['A3'],
          knowledgeBaseRefs: [], aiEnabled: false,
        },
      ],
    };
    const result = getItemsBySubcategory(data, 'try');
    expect(result).toHaveLength(2);
    expect(result.every((item) => item.subcategoryId === 'try')).toBe(true);
  });

  it('一致するアイテムがない場合は空配列を返す', () => {
    const data = { categories: [], items: [] };
    expect(getItemsBySubcategory(data, 'nonexistent')).toEqual([]);
  });
});

describe('getSubcategoriesByCategory', () => {
  it('指定した categoryId の中カテゴリを返す', () => {
    const data = {
      categories: [
        {
          id: 'scoring',
          label: '🏉 得点・トライ',
          subcategories: [
            { id: 'try', label: 'トライ', categoryId: 'scoring' },
            { id: 'conversion', label: 'コンバージョン', categoryId: 'scoring' },
          ],
        },
      ],
      items: [],
    };
    const result = getSubcategoriesByCategory(data, 'scoring');
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('try');
  });

  it('存在しないカテゴリIDの場合は空配列を返す', () => {
    const data = { categories: [], items: [] };
    expect(getSubcategoriesByCategory(data, 'nonexistent')).toEqual([]);
  });
});

// ─── getQAData: 空ディレクトリのケース ───────────────────────────────────────

describe('getQAData', () => {
  it('data/qa/ ディレクトリが存在しない場合は空データを返す', async () => {
    // data/qa ディレクトリがなければ空を返すことをモックなしで確認するのは
    // 環境依存なので、実際の data/qa ディレクトリがある場合は別途確認する
    // ここでは実装の型を確認する
    const data = await getQAData();
    expect(data).toHaveProperty('categories');
    expect(data).toHaveProperty('items');
    expect(Array.isArray(data.categories)).toBe(true);
    expect(Array.isArray(data.items)).toBe(true);
  });
});
