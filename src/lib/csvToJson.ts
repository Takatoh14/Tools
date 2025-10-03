// src/lib/csvToJson.ts

export type QuoteMode =
  | 'double' // "
  | 'single' // '
  | 'none'
  | { kind: 'custom'; char: string };

export type CsvToJsonOptions = {
  delimiter: string; // 区切り文字（カスタム対応）
  quote?: QuoteMode; // 括り文字
  hasHeader: boolean; // 先頭行をヘッダとして扱う
  skipEmptyLines?: boolean; // 空行をスキップ
};

// 1 行をフィールド配列にパース（引用と区切りに対応）
function parseLine(
  line: string,
  delimiter: string,
  quote: string | null
): string[] {
  const out: string[] = [];
  let buf = '';
  let i = 0;
  const n = line.length;
  let inQuote = false;

  while (i < n) {
    const ch = line[i];

    if (quote && inQuote) {
      if (ch === quote) {
        // quote 連続ならエスケープ（ "" -> " など）
        const next = line[i + 1];
        if (next === quote) {
          buf += quote;
          i += 2;
          continue;
        }
        // 閉じ
        inQuote = false;
        i++;
        continue;
      }
      buf += ch;
      i++;
      continue;
    }

    if (quote && ch === quote) {
      inQuote = true;
      i++;
      continue;
    }

    if (line.startsWith(delimiter, i)) {
      out.push(buf);
      buf = '';
      i += delimiter.length;
      continue;
    }

    buf += ch;
    i++;
  }

  out.push(buf);
  return out;
}

function resolveQuote(mode: QuoteMode | undefined): string | null {
  if (!mode) return '"';
  if (mode === 'double') return '"';
  if (mode === 'single') return "'";
  if (mode === 'none') return null;
  const ch = mode.char ?? '';
  return ch.length > 0 ? ch[0] : '"';
}

/** CSV/TSV 文字列 → JSON（オブジェクト配列） */
export function csvToJson(
  input: string,
  opts: CsvToJsonOptions
): Record<string, string>[] {
  const delimiter = String(opts.delimiter ?? ',');
  const q = resolveQuote(opts.quote);
  const skipEmpty = !!opts.skipEmptyLines;

  // 改行は CRLF/LF/CR を吸収
  const lines = input.split(/\r\n|\n|\r/);

  const rows: string[][] = [];
  for (const raw of lines) {
    if (skipEmpty && raw.trim() === '') continue;
    rows.push(parseLine(raw, delimiter, q));
  }
  if (rows.length === 0) return [];

  let headers: string[] = [];
  let dataStart = 0;

  if (opts.hasHeader) {
    headers = rows[0].map(h => h);
    dataStart = 1;
  } else {
    // col1, col2 ... を生成
    const maxLen = rows.reduce((m, r) => Math.max(m, r.length), 0);
    headers = Array.from({ length: maxLen }, (_, i) => `col${i + 1}`);
  }

  const out: Record<string, string>[] = [];
  for (let r = dataStart; r < rows.length; r++) {
    const row = rows[r];
    const obj: Record<string, string> = {};
    for (let c = 0; c < headers.length; c++) {
      const key = headers[c] ?? `col${c + 1}`;
      const val = row[c] ?? '';
      obj[key] = val;
    }
    out.push(obj);
  }

  return out;
}
