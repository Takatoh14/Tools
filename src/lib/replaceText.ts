/** 置換オプション */
export type ReplaceOptions = {
  /** 正規表現として解釈。ON時は置換文字の \n \t \r も展開（エスケープ適用） */
  useRegex: boolean;
  /** 大小区別（false なら i フラグを付与） */
  caseSensitive: boolean;
  /** 入力文字列の一部だけ置換したい場合の選択範囲（未指定なら全文） */
  selection?: { start: number; end: number };
};

/** 実行結果 */
export type ReplaceResult = {
  /** 置換後の全文 */
  output: string;
  /** 置換ヒット件数（目安） */
  replacedCount: number;
  /** エラーがあれば格納（正規表現の構文エラー等） */
  error?: string;
};

/** 正規表現を使わない場合にメタ文字をエスケープ */
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** 置換文字のエスケープを実体化（\n, \t, \r） */
const unescapeReplacement = (s: string) =>
  s.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '\r');

/**
 * 入力テキストに対して、全文または選択範囲のみ置換を行う純粋関数。
 *
 * - useRegex = true  : search を正規表現として扱う。置換文字の \n \t \r を展開。
 * - useRegex = false : search は文字列として扱う（自動エスケープ）。置換文字はそのまま。
 * - caseSensitive    : false の場合は i フラグを付ける。
 * - selection        : 指定時、その範囲のみ置換。未指定は全文。
 *
 * 例外は投げず、error に格納して元の input を返す設計。
 */
export function replaceText(
  input: string,
  search: string,
  replacement: string,
  opts: ReplaceOptions
): ReplaceResult {
  const { useRegex, caseSensitive, selection } = opts;

  if (!search) {
    // 検索語が空のときは何もしない
    return { output: input, replacedCount: 0 };
  }

  // 対象範囲の切り出し（未指定は全文）
  const start = Math.max(0, selection?.start ?? 0);
  const end = Math.min(input.length, selection?.end ?? input.length);
  const head = input.slice(0, start);
  const target = input.slice(start, end);
  const tail = input.slice(end);

  try {
    const flags = caseSensitive ? 'g' : 'gi';
    const pattern = useRegex ? search : escapeRegExp(search);
    const re = new RegExp(pattern, flags);

    // useRegex の時のみ \n \t \r を実体化（要件どおり）
    const rep = useRegex ? unescapeReplacement(replacement) : replacement;

    // 件数カウント（1回スキャン）
    let count = 0;
    target.replace(re, () => {
      count++;
      return '';
    });

    // 実置換
    const replaced = target.replace(re, rep);
    return { output: head + replaced + tail, replacedCount: count };
  } catch (e) {
    return {
      output: input,
      replacedCount: 0,
      error: String((e as Error).message),
    };
  }
}

export default replaceText;
