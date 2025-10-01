// タイトル
export type TitleProps = {
  titleText: string;
  titleClass: string;
};

// カード
export type CardProps = {
  title: string;
  to: string;
};

// テキストエリア
export type TextAreaProps = {
  id: string;
  name: string;
  rows: number;
  placeholder: string;
  readonly?: boolean;
  value?: string; // ★ 入力値を受け取る
  onChange?: (v: string) => void; // ★ 値が変わったら呼ぶ
};

// 置換前/後の入力
export type TextReplceProps = {
  spanTitle: string;
  textType: string;
  placeholder: string;
  value?: string; // ★ 入力値
  onChange?: (v: string) => void; // ★ 入力時イベント
};

// チェックボックスオプション
export type TextReplaceOptionsProps = {
  id: string;
  name: string;
  spanTitle: string;
  textType: 'checkbox'; // checkbox 固定
  checked?: boolean; // ★ ON/OFF 状態
  onChange?: (v: boolean) => void; // ★ クリック時イベント
};

// ボタン
export type BottomProps = {
  buttonText: string;
  buttonClass: string;
  onClick?: () => void; // ★ クリックイベント
};
