// src/utils/clipboard.ts
// クリップボードコピーを行う汎用関数（Promiseで成否を返す）

export type CopyResult = {
  ok: boolean; // 成功したか
  error?: unknown; // 失敗時の例外
};

export async function copyText(text: string): Promise<CopyResult> {
  // 空文字の場合は成功扱いにしない（UX的にfalseを返す）
  if (!text) return { ok: false };

  try {
    // 1) まず Clipboard API（https）を試す
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return { ok: true };
    }

    // 2) 非対応ブラウザ向けフォールバック
    //   一時的に hidden textarea を作って execCommand('copy')
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    area.style.pointerEvents = "none";
    area.style.left = "-9999px";
    document.body.appendChild(area);

    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);

    return { ok };
  } catch (error) {
    return { ok: false, error };
  }
}
