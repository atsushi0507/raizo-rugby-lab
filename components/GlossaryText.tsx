import { getGlossary } from '@/lib/glossary';
import { GlossaryTerm } from './GlossaryTerm';
import type { ReactNode } from 'react';

/**
 * プレーンテキスト内の用語を GlossaryTerm コンポーネントに置換して返す。
 * 各用語は1つのテキスト内で最初の出現のみ置換する（読みやすさのため）。
 * 部分一致による誤マッチを防ぐため、用語の前後が語の一部（文字・数字）の場合はスキップする。
 */
export function GlossaryText({ text }: { text: string }): ReactNode {
  const glossary = getGlossary();
  if (glossary.length === 0) return text;

  /**
   * 位置 idx における用語マッチが「単独の語」かどうかを判定する。
   * 前後の文字が「語を構成する文字」（漢字・カタカナ・英数字）の場合は部分一致とみなしてスキップ。
   * ひらがな（助詞など）は語の境界として扱う。
   */
  function isWordBoundary(str: string, idx: number, termLen: number): boolean {
    // 語の一部とみなす文字：漢字・カタカナ（全角・半角）・英数字
    const wordChar = /[\u4E00-\u9FFF\u30A0-\u30FF\uFF65-\uFF9F\u3400-\u4DBF\uF900-\uFAFFa-zA-Z0-9]/;
    const before = idx > 0 ? str[idx - 1] : null;
    const after = idx + termLen < str.length ? str[idx + termLen] : null;
    if (before && wordChar.test(before)) return false;
    if (after && wordChar.test(after)) return false;
    return true;
  }

  // 長い用語順にソート済み（glossary.ts で保証）
  type Match = { index: number; term: string; description: string };
  const matches: Match[] = [];
  const used = new Set<number>(); // 既にマッチした範囲を追跡

  for (const entry of glossary) {
    const idx = text.indexOf(entry.term);
    if (idx === -1) continue;

    // 前後の文字で部分一致（語の途中）でないか確認
    if (!isWordBoundary(text, idx, entry.term.length)) continue;

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
