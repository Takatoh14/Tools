// src/lib/jsonToCsv.ts
// JSON → CSV/TSV 変換

// 括り文字の指定
export type QuoteMode =
  | 'double' // "
  | 'single' // '
  | 'none' // 括らない（ただし壊れないよう必要時のみ " にフォールバック）
  | { kind: 'custom'; char: string }; // 任意 1 文字

export type JsonToCsvOptions = {
  delimiter: string; // 区切り文字（カスタム対応）
  header: boolean; // ヘッダ行を出力するか
  quote?: QuoteMode; // 括り文字の種類
};

// 1行分の型
export type JsonRecord = Record<string, unknown>;

/** 括り文字の実体を取り出す（none は null） */
function resolveQuote(mode: QuoteMode | undefined): string | null {
  if (!mode) return '"';
  if (mode === 'double') return '"';
  if (mode === 'single') return "'";
  if (mode === 'none') return null;
  const ch = mode.char ?? '';
  return ch.length > 0 ? ch[0] : '"';
}

/** 値をセル文字列に変換 */
function toCell(
  value: unknown,
  delimiter: string,
  quoteMode: QuoteMode | undefined
): string {
  let s =
    value === null || value === undefined
      ? ''
      : typeof value === 'string'
      ? value
      : typeof value === 'number' || typeof value === 'boolean'
      ? String(value)
      : JSON.stringify(value);

  const q = resolveQuote(quoteMode);

  if (q) {
    // ★ 選んだ括り文字がある場合は「常に括る」
    if (s.includes(q)) s = s.split(q).join(q + q); // 自身は二重化
    return q + s + q;
  }

  // ★ なし（none）のときは基本括らないが、壊れないようにだけ保護
  const needsQuote =
    s.includes(delimiter) || s.includes('\n') || s.includes('\r');
  if (needsQuote) {
    const esc = s.replace(/"/g, '""');
    return `"${esc}"`;
  }
  return s;
}

/** JSON 配列を CSV/TSV 文字列に変換 */
export function jsonToCsv<T extends JsonRecord>(
  rows: T[],
  opts: JsonToCsvOptions = { delimiter: ',', header: true, quote: 'double' }
): string {
  if (!Array.isArray(rows) || rows.length === 0) return '';

  const delimiter = String(opts.delimiter ?? ',');
  const quoteMode = opts.quote ?? 'double';

  // すべてのキーの和集合をヘッダに採用
  const keySet = new Set<string>();
  for (const r of rows) Object.keys(r).forEach(k => keySet.add(k));
  const keys = Array.from(keySet);

  const out: string[] = [];

  if (opts.header) {
    out.push(keys.map(k => toCell(k, delimiter, quoteMode)).join(delimiter));
  }

  for (const r of rows) {
    const line = keys
      .map(k => toCell(r[k], delimiter, quoteMode))
      .join(delimiter);
    out.push(line);
  }

  return out.join('\n');
}
