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

/**
 * テキスト全体の差分（行→文字の二段階）
 * 空白統一などの正規化は行わず、常にオリジナルの文字列で比較します。
 */
export function diffText(leftRaw: string, rightRaw: string): DiffLine[] {
  const left = splitLinesKeep(leftRaw);
  const right = splitLinesKeep(rightRaw);

  const map = lcsMap(left, right);

  const result: DiffLine[] = [];
  let i = 0,
    j = 0;

  while (i < left.length || j < right.length) {
    if (i < left.length && j < right.length && map[i][j] === 'eq') {
      // 行が一致：行内の文字差分を出す
      const pieces = diffChars(left[i], right[j]);
      result.push({ left: pieces.left, right: pieces.right });
      i++;
      j++;
    } else if (
      j < right.length &&
      (i >= left.length || map[i]?.[j] === 'ins')
    ) {
      // 右に挿入された行
      result.push({
        left: [{ type: 'insert', text: '' }],
        right: [{ type: 'insert', text: right[j] }],
      });
      j++;
    } else if (
      i < left.length &&
      (j >= right.length || map[i]?.[j] === 'del')
    ) {
      // 左から削除された行
      result.push({
        left: [{ type: 'delete', text: left[i] }],
        right: [{ type: 'delete', text: '' }],
      });
      i++;
    } else {
      // 行位置は同じだが内容が異なる → 文字レベル差分
      const pieces = diffChars(left[i] ?? '', right[j] ?? '');
      result.push({ left: pieces.left, right: pieces.right });
      i++;
      j++;
    }
  }

  return result;
}

/* ---------------- helpers ---------------- */

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

// 文字レベル LCS
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
      push(left, 'equal', ar[i]);
      push(right, 'equal', br[j]);
      i++;
      j++;
    } else if (j < m && (i >= n || dp[i][j + 1] >= dp[i + 1][j])) {
      push(right, 'insert', br[j]);
      push(left, 'insert', ''); // 位置合わせの空
      j++;
    } else if (i < n) {
      push(left, 'delete', ar[i]);
      push(right, 'delete', '');
      i++;
    }
  }

  // 並んだ del/ins を rep に寄せる（視認性向上）
  mergeReplace(left, right);
  return { left, right };
}

function push(arr: LinePiece[], type: LinePiece['type'], ch: string) {
  const last = arr[arr.length - 1];
  if (last && last.type === type) last.text += ch;
  else arr.push({ type, text: ch });
}

function mergeReplace(left: LinePiece[], right: LinePiece[]) {
  for (let i = 0; i < left.length; i++) {
    if (left[i].type === 'delete' && right[i]?.type === 'insert') {
      left[i].type = 'replace';
      right[i].type = 'replace';
    }
  }
}
