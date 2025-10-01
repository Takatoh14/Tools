// src/lib/diff.ts

export type LinePiece =
  | { type: 'equal'; text: string }
  | { type: 'insert'; text: string }
  | { type: 'delete'; text: string }
  | { type: 'replace'; text: string };

export type DiffLine = {
  left: LinePiece[];
  right: LinePiece[];
};

const splitLinesKeep = (s: string) => s.split(/\r\n|\r|\n/);

export function diffText(leftRaw: string, rightRaw: string): DiffLine[] {
  // 表示・比較ともオリジナル文字列を使う（空白統一なし）
  const leftLines = splitLinesKeep(leftRaw);
  const rightLines = splitLinesKeep(rightRaw);

  // 行の LCS マッピング
  const map = lcsMap(leftLines, rightLines);

  const result: DiffLine[] = [];
  let i = 0,
    j = 0;

  while (i < leftLines.length || j < rightLines.length) {
    if (i < leftLines.length && j < rightLines.length && map[i][j] === 'eq') {
      // 同じ行：中の文字差分だけ取る
      const pieces = diffChars(leftLines[i], rightLines[j]);
      result.push({ left: pieces.left, right: pieces.right });
      i++;
      j++;
    } else if (
      j < rightLines.length &&
      (i >= leftLines.length || map[i]?.[j] === 'ins')
    ) {
      // 右に挿入
      result.push({
        left: [{ type: 'insert', text: '' }],
        right: [{ type: 'insert', text: rightLines[j] }],
      });
      j++;
    } else if (
      i < leftLines.length &&
      (j >= rightLines.length || map[i]?.[j] === 'del')
    ) {
      // 左から削除
      result.push({
        left: [{ type: 'delete', text: leftLines[i] }],
        right: [{ type: 'delete', text: '' }],
      });
      i++;
    } else {
      // フォールバック（置換として扱う）
      result.push({
        left: [{ type: 'replace', text: leftLines[i] ?? '' }],
        right: [{ type: 'replace', text: rightLines[j] ?? '' }],
      });
      i++;
      j++;
    }
  }
  return result;
}

/* ----------------- helpers ------------------ */

// 行 LCS の“進行指示”テーブル：eq / del / ins
function lcsMap(a: string[], b: string[]) {
  const n = a.length,
    m = b.length;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] =
        a[i] === b[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const map: ('eq' | 'del' | 'ins')[][] = Array.from({ length: n }, () =>
    Array(m).fill('eq')
  );
  let i = 0,
    j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      map[i][j] = 'eq';
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      map[i][j] = 'del';
      i++;
    } else {
      map[i][j] = 'ins';
      j++;
    }
  }
  return map;
}

// 文字 LCS → ピース化（equal / insert / delete / replace）
function diffChars(
  a: string,
  b: string
): { left: LinePiece[]; right: LinePiece[] } {
  const ar = [...a],
    br = [...b];
  const n = ar.length,
    m = br.length;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] =
        ar[i] === br[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const left: LinePiece[] = [];
  const right: LinePiece[] = [];

  let i = 0,
    j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && ar[i] === br[j]) {
      pushPiece(left, 'equal', ar[i]);
      pushPiece(right, 'equal', br[j]);
      i++;
      j++;
    } else if (j < m && (i >= n || dp[i][j + 1] >= dp[i + 1][j])) {
      // 右に挿入
      pushPiece(right, 'insert', br[j]);
      pushPiece(left, 'insert', ''); // 位置合わせ用の空文字
      j++;
    } else if (i < n) {
      // 左から削除
      pushPiece(left, 'delete', ar[i]);
      pushPiece(right, 'delete', '');
      i++;
    }
  }

  // delete + insert を replace として見やすく整形
  mergeReplace(left, right);
  return { left, right };
}

function pushPiece(arr: LinePiece[], type: LinePiece['type'], ch: string) {
  const last = arr[arr.length - 1];
  if (last && last.type === type) last.text += ch;
  else arr.push({ type, text: ch });
}

// 片側 delete / 他側 insert の並びを replace に寄せる
function mergeReplace(left: LinePiece[], right: LinePiece[]) {
  for (let k = 0; k < left.length; k++) {
    if (left[k].type === 'delete' && right[k]?.type === 'insert') {
      left[k].type = 'replace';
      right[k].type = 'replace';
    }
  }
}
