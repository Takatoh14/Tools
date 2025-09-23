// src/utils/textReplace.ts
// 置換処理に関するユーティリティ関数群

/**
 * 正規表現メタ文字を文字列として扱うためにエスケープ
 * 正規表現モード OFF のときに検索パターンへ適用する
 */
export const escapeRegExp = (str: string): string =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * 置換文字列内の \n や \t などのエスケープシーケンスを解釈
 * 正規表現モード ON のときのみ適用
 */
export const decodeEscapes = (str: string): string =>
  str
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\f/g, "\f")
    .replace(/\\v/g, "\v")
    .replace(/\\0/g, "\0");

/**
 * パターン文字列に「明らかな正規表現っぽい」文字が含まれているかを判定
 * 正規表現モード OFF でメタ文字が含まれる場合に警告を出すために使用
 */
export const looksLikeRegex = (pattern: string): boolean =>
  /[.*+?^${}()|[\]\\]/.test(pattern);

/**
 * 実際の置換実行関数
 * - regexMode: true なら pattern をそのまま RegExp に
 * - regexMode: false なら escapeRegExp して RegExp に
 * - caseSensitive: true なら大文字小文字を区別（= 'i' フラグを付けない）
 */
export const replaceAll = (
  input: string,
  pattern: string,
  replacement: string,
  options: { regexMode: boolean; caseSensitive: boolean }
): { output: string; matched: boolean } => {
  const { regexMode, caseSensitive } = options;

  // 検索パターンを RegExp へ
  const source = regexMode ? pattern : escapeRegExp(pattern);

  // フラグ: 常に全体置換 g、大小区別は caseSensitive が false の時だけ i
  const flags = `g${caseSensitive ? "" : "i"}`;

  // 正規表現の構築（ここで throw されることがある）
  const reg = new RegExp(source, flags);

  // 置換文字列のエスケープ解釈（regexMode の時だけ）
  const replaceWith = regexMode ? decodeEscapes(replacement) : replacement;

  // マッチ有無を事前に確認
  const matched = reg.test(input);
  if (!matched) {
    return { output: "", matched: false };
  }

  // 置換
  const output = input.replace(reg, replaceWith);
  return { output, matched: true };
};
