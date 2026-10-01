// ─── Type Definitions ────────────────────────────────────────────────────────
// このファイルは fs を使用しないため、クライアントコンポーネントから安全にimport可能。
// getQAData() (fs使用) は lib/qa.ts に分離されている。

export interface QASubcategory {
  id: string;
  label: string;
  categoryId: string; // 親カテゴリID（逆引き用）
}

export interface QACategory {
  id: string;
  label: string;
  subcategories: QASubcategory[];
}

export interface QAItem {
  id: string;
  categoryId: string;
  subcategoryId: string;
  question: string;
  richieMessage: string;
  raizoMessages: string[];
  knowledgeBaseRefs: string[];
  aiEnabled: boolean;
}

export interface QAData {
  categories: QACategory[];
  items: QAItem[];
}

// ─── Validation Helpers ───────────────────────────────────────────────────────

function assertField(data: Record<string, unknown>, field: string): unknown {
  if (!(field in data) || data[field] === undefined || data[field] === null) {
    throw new Error(`validateQAItem: missing required field "${field}"`);
  }
  return data[field];
}

function assertString(data: Record<string, unknown>, field: string): string {
  const value = assertField(data, field);
  if (typeof value !== 'string') {
    throw new Error(`validateQAItem: field "${field}" must be a string (got ${typeof value})`);
  }
  return value;
}

function assertBoolean(data: Record<string, unknown>, field: string): boolean {
  const value = assertField(data, field);
  if (typeof value !== 'boolean') {
    throw new Error(`validateQAItem: field "${field}" must be a boolean (got ${typeof value})`);
  }
  return value;
}

function assertStringArray(data: Record<string, unknown>, field: string): string[] {
  const value = assertField(data, field);
  if (!Array.isArray(value)) {
    throw new Error(`validateQAItem: field "${field}" must be an array (got ${typeof value})`);
  }
  for (let i = 0; i < value.length; i++) {
    if (typeof value[i] !== 'string') {
      throw new Error(`validateQAItem: field "${field}[${i}]" must be a string (got ${typeof value[i]})`);
    }
  }
  return value as string[];
}

// ─── Validation Functions ─────────────────────────────────────────────────────

/**
 * unknown なデータを QAItem として検証する。
 * 必須フィールドが揃っていない場合は Error をスロー。
 */
export function validateQAItem(data: unknown): QAItem {
  if (typeof data !== 'object' || data === null) {
    throw new Error('validateQAItem: data must be an object');
  }
  const d = data as Record<string, unknown>;

  return {
    id: assertString(d, 'id'),
    categoryId: assertString(d, 'categoryId'),
    subcategoryId: assertString(d, 'subcategoryId'),
    question: assertString(d, 'question'),
    richieMessage: assertString(d, 'richieMessage'),
    raizoMessages: assertStringArray(d, 'raizoMessages'),
    knowledgeBaseRefs: assertStringArray(d, 'knowledgeBaseRefs'),
    aiEnabled: assertBoolean(d, 'aiEnabled'),
  };
}

/**
 * unknown なデータを QACategory として検証する。
 * 必須フィールドが揃っていない場合は Error をスロー。
 */
export function validateQACategory(data: unknown): QACategory {
  if (typeof data !== 'object' || data === null) {
    throw new Error('validateQACategory: data must be an object');
  }
  const d = data as Record<string, unknown>;

  if (!('id' in d) || typeof d['id'] !== 'string') {
    throw new Error('validateQACategory: missing or invalid required field "id"');
  }
  if (!('label' in d) || typeof d['label'] !== 'string') {
    throw new Error('validateQACategory: missing or invalid required field "label"');
  }
  if (!('subcategories' in d) || !Array.isArray(d['subcategories'])) {
    throw new Error('validateQACategory: missing or invalid required field "subcategories"');
  }

  const id = d['id'] as string;
  const subcategories = (d['subcategories'] as unknown[]).map((sub) => {
    if (typeof sub !== 'object' || sub === null) {
      throw new Error(`validateQACategory: subcategory in category "${id}" must be an object`);
    }
    const s = sub as Record<string, unknown>;
    if (!('id' in s) || typeof s['id'] !== 'string') {
      throw new Error(`validateQACategory: subcategory in category "${id}" missing required field "id"`);
    }
    if (!('label' in s) || typeof s['label'] !== 'string') {
      throw new Error(`validateQACategory: subcategory in category "${id}" missing required field "label"`);
    }
    return {
      id: s['id'] as string,
      label: s['label'] as string,
      categoryId: id,
    };
  });

  return {
    id,
    label: d['label'] as string,
    subcategories,
  };
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

/**
 * 指定した subcategoryId に一致する QAItem を返す。
 */
export function getItemsBySubcategory(data: QAData, subcategoryId: string): QAItem[] {
  return data.items.filter((item) => item.subcategoryId === subcategoryId);
}

/**
 * 指定した categoryId に一致する QASubcategory を返す。
 */
export function getSubcategoriesByCategory(data: QAData, categoryId: string): QASubcategory[] {
  const category = data.categories.find((cat) => cat.id === categoryId);
  return category ? category.subcategories : [];
}

/**
 * knowledgeBaseRefs の文字列をアプリ内リンクに変換する。
 * - "rules/..."     → "/rules/..."
 * - "positions/..." → "/positions/..."
 * - 不明なプレフィックス → null
 */
export function generateKnowledgeBaseLink(ref: string): string | null {
  if (ref.startsWith('rules/')) {
    return `/${ref}`;
  }
  if (ref.startsWith('positions/')) {
    return `/${ref}`;
  }
  return null;
}
