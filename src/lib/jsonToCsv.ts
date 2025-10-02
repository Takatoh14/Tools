// JSON → CSV/TSV 変換

// 括り文字の指定
export type QuoteMode =
  | 'double' // "
  | 'single' // '
  | 'none' // 括らない（必要時は安全のため " にフォールバック）
  | { kind: 'custom'; char: string }; // 任意 1 文字

export type JsonToCsvOptions = {
  delimiter: string; // 区切り文字（カスタム対応）
  header: boolean; // ヘッダ行を出力するか
  quote?: QuoteMode; // 括り文字の種類
  alwaysQuote?: boolean; // ★ 追加: 常に括り文字で囲む（デフォルト false）
};

// 1行分の型
export type JsonRecord = Record<string, unknown>;

/** 括り文字の実体を取り出す */
function resolveQuote(mode: QuoteMode | undefined): string | null {
  if (!mode) return '"';
  if (mode === 'double') return '"';
  if (mode === 'single') return "'";
  if (mode === 'none') return null;
  // custom
  const ch = mode.char ?? '';
  return ch.length > 0 ? ch[0] : '"';
}

/** 値をセル文字列に変換（CSV/TSV 安全化） */
function toCell(
  value: unknown,
  delimiter: string,
  quoteMode: QuoteMode | undefined,
  alwaysQuote = false
): string {
  // 値を文字列化
  let s =
    value === null || value === undefined
      ? ''
      : typeof value === 'string'
      ? value
      : typeof value === 'number' || typeof value === 'boolean'
      ? String(value)
      : JSON.stringify(value);

  const q = resolveQuote(quoteMode);

  // 区切り/改行/括り文字自身 を含むなら引用が必要
  const needsQuote =
    s.includes(delimiter) ||
    s.includes('\n') ||
    s.includes('\r') ||
    (q ? s.includes(q) : false);

  if (q) {
    // 括り文字自身は二重化してエスケープ
    if (s.includes(q)) s = s.split(q).join(q + q);
    // ★ 変更: 「常に」または「必要時のみ」で括る
    if (alwaysQuote || needsQuote) s = q + s + q;
    return s;
  }

  // quote = none のときでも、区切り/改行を含むなら破損防止で " で括る
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
  const always = !!opts.alwaysQuote;

  // すべてのキーの和集合をヘッダに採用
  const keySet = new Set<string>();
  for (const r of rows) Object.keys(r).forEach(k => keySet.add(k));
  const keys = Array.from(keySet);

  const out: string[] = [];

  if (opts.header) {
    out.push(
      keys.map(k => toCell(k, delimiter, quoteMode, always)).join(delimiter)
    );
  }

  for (const r of rows) {
    const line = keys
      .map(k => toCell(r[k], delimiter, quoteMode, always))
      .join(delimiter);
    out.push(line);
  }

  return out.join('\n');
}
