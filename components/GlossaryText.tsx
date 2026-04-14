import { getGlossary } from '@/lib/glossary';
import { GlossaryTerm } from './GlossaryTerm';
import type { ReactNode } from 'react';

/**
 * プレーンテキスト内の用語を GlossaryTerm コンポーネントに置換して返す。
 * 各用語は1つのテキスト内で最初の出現のみ置換する（読みやすさのため）。
 */
export function GlossaryText({ text }: { text: string }): ReactNode {
  const glossary = getGlossary();
  if (glossary.length === 0) return text;

  // 長い用語順にソート済み（glossary.ts で保証）
  // 各用語の最初の出現位置を見つける
  type Match = { index: number; term: string; description: string };
  const matches: Match[] = [];
  const used = new Set<number>(); // 既にマッチした範囲を追跡

  for (const entry of glossary) {
    const idx = text.indexOf(entry.term);
    if (idx === -1) continue;

    // 既存マッチと重複しないか確認
    let overlaps = false;
    for (const pos of used) {
      const existingMatch = matches.find((m) => m.index === pos);
      if (existingMatch && idx < pos + existingMatch.term.length && idx + entry.term.length > pos) {
        overlaps = true;
        break;
      }
    }
    if (overlaps) continue;

    matches.push({ index: idx, term: entry.term, description: entry.description });
    used.add(idx);
  }

  if (matches.length === 0) return text;

  // 位置順にソート
  matches.sort((a, b) => a.index - b.index);

  const parts: ReactNode[] = [];
  let cursor = 0;

  for (const match of matches) {
    if (match.index > cursor) {
      parts.push(text.slice(cursor, match.index));
    }
    parts.push(
      <GlossaryTerm key={match.index} term={match.term} description={match.description} />
    );
    cursor = match.index + match.term.length;
  }

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return <>{parts}</>;
}
