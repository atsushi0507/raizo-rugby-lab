// Server Component 専用: fs を使用するため、クライアントコンポーネントからimport不可。
// 型定義・バリデーション・ヘルパー関数は lib/qa-types.ts に分離されている。
// クライアントコンポーネントは @/lib/qa-types を直接importすること。

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import type { QACategory, QAData, QAItem } from '@/lib/qa-types';
import { validateQAItem, validateQACategory } from '@/lib/qa-types';

// 後方互換のため qa-types.ts の全エクスポートを再エクスポートする
export type { QASubcategory, QACategory, QAItem, QAData } from '@/lib/qa-types';
export {
  validateQAItem,
  validateQACategory,
  getItemsBySubcategory,
  getSubcategoriesByCategory,
  generateKnowledgeBaseLink,
} from '@/lib/qa-types';

// ─── YAML Loader (Server Component 用) ──────────────────────────────────────

const QA_DATA_DIR = path.join(process.cwd(), 'data', 'qa');

/**
 * data/qa/categories.yaml からカテゴリを、
 * data/qa/*.yaml（categories.yaml を除く）から items を読み込んで統合する。
 * ファイルが存在しない場合は { categories: [], items: [] } を返す。
 */
export async function getQAData(): Promise<QAData> {
  if (!fs.existsSync(QA_DATA_DIR)) {
    return { categories: [], items: [] };
  }

  // カテゴリ読み込み
  const categoriesFilePath = path.join(QA_DATA_DIR, 'categories.yaml');
  let categories: QACategory[] = [];
  if (fs.existsSync(categoriesFilePath)) {
    const raw = fs.readFileSync(categoriesFilePath, 'utf-8');
    const parsed = yaml.load(raw) as Record<string, unknown>;
    if (parsed && Array.isArray(parsed['categories'])) {
      categories = (parsed['categories'] as unknown[]).map((cat) =>
        validateQACategory(cat)
      );
    }
  }

  // アイテム読み込み（categories.yaml を除く全 YAML ファイル）
  const allFiles = fs.readdirSync(QA_DATA_DIR).filter(
    (f) => (f.endsWith('.yaml') || f.endsWith('.yml')) && f !== 'categories.yaml'
  );

  const items: QAItem[] = [];
  for (const filename of allFiles) {
    const filePath = path.join(QA_DATA_DIR, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = yaml.load(raw);
    if (!Array.isArray(parsed)) continue;
    for (const entry of parsed as unknown[]) {
      try {
        items.push(validateQAItem(entry));
      } catch {
        // バリデーションエラーはスキップ（ビルドエラーを避けるため）
      }
    }
  }

  return { categories, items };
}
