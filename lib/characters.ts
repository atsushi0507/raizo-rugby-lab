/**
 * キャラクター名からアイコン画像パスを解決する。
 * 新しいキャラクターを追加する場合はここにエントリを追加する。
 */
const CHARACTER_ICONS: Record<string, string> = {
  'リッチーくん': '/icons/richie.png',
  'ライゾウ': '/icons/raizo.png',
  'フウガ': '/icons/fuga.png',
  'ダイチ': '/icons/daichi.png',
  'ソウ': '/icons/sou.png',
  'ロウガ': '/icons/rouga.png',
  'ガイ': '/icons/guy.png',
  'ソラ': '/icons/sora.png',
  'ツヨシ': '/icons/tsuyoshi.png',
  'ゴウ': '/icons/gou.png',
  'ゲン': '/icons/gen.png',
  'ハル': '/icons/hal.png'
};

/**
 * ポジション ID からキャラクター名を解決する。
 * 新しいポジションキャラクターを追加する場合はここにエントリを追加する。
 */
const POSITION_CHARACTERS: Record<string, string> = {
  'pr1': 'ハル',
  'ho2': 'ダイチ',
  'pr3': 'ツヨシ',
  'lo4': "ソラ",
  'lo5': 'ゴウ',
  'fl7': 'ロウガ',
  'sh9': 'ソウ',
  'so10': 'ライゾウ',
  'ctb12': 'ガイ',
  'wtb14': 'フウガ',
  'fb15': 'ゲン',
};

/**
 * speaker 名に対応するアイコン画像パスを返す。
 * 未登録のキャラクターの場合は null を返す（フォールバック表示用）。
 */
export function getCharacterIcon(speaker: string): string | null {
  return CHARACTER_ICONS[speaker] ?? null;
}

/**
 * ポジション ID に対応するキャラクター名を返す。
 * 未登録のポジションの場合は null を返す。
 */
export function getCharacterName(positionId: string): string | null {
  return POSITION_CHARACTERS[positionId] ?? null;
}
