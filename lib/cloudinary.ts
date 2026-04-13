/**
 * Cloudinary URL に自動最適化パラメータを追加する。
 * 非 Cloudinary URL はそのまま返す。
 *
 * @param url - 画像 URL
 * @param width - リサイズ幅（デフォルト: 800）
 */
export function optimizeCloudinaryUrl(url: string, width = 800): string {
  if (!url.includes('res.cloudinary.com')) return url;
  // /upload/ の直後に変換パラメータを挿入
  return url.replace('/upload/', `/upload/w_${width},f_auto,q_auto/`);
}
