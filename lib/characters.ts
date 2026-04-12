/**
 * キャラクター名からアイコン画像パスを解決する。
 * 新しいキャラクターを追加する場合はここにエントリを追加する。
 */
const CHARACTER_ICONS: Record<string, string> = {
  'リッチーくん': '/icons/richie.png',
  'ライゾウ': '/icons/raizo.png',
  'フウガ': '/icons/fuga.png',
  'ダイチ': '/icons/daichi.png',
};

/**
 * speaker 名に対応するアイコン画像パスを返す。
 * 未登録のキャラクターの場合は null を返す（フォールバック表示用）。
 */
export function getCharacterIcon(speaker: string): string | null {
  return CHARACTER_ICONS[speaker] ?? null;
}
