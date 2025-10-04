// src/utils/goBack.ts
/**
 * 履歴があれば 1つ戻る。無ければ fallbackPath へ移動。
 * HashRouter でも BrowserRouter でも使える素の実装。
 */
export function goBack(fallbackPath: string = '/tools/'): void {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    // サブディレクトリ配信なら "/tools/#/" などに調整してもOK
    window.location.href = fallbackPath;
  }
}
