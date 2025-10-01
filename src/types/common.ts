// src/types/common.ts

/* ===== Title ===== */
export type TitleProps = {
  titleText: string;
  titleClass: string; // e.g. "title" | "sub-title"
};

/* ===== Card (Link Card) ===== */
export type CardProps = {
  title: string;
  to: string; // react-router の Link 先
};

/* ===== TextArea ===== */
export type TextAreaProps = {
  id: string;
  name: string;
  rows: number;
  placeholder: string;
  readonly?: boolean;
  value?: string;
  onChange?: (v: string) => void;
  className?: string; // 例: "nowrap" を渡して横スクロールに
};

/* ===== Replace Inputs (label + input[type=text]) ===== */
export type TextReplceProps = {
  spanTitle: string; // ラベル表示
  textType: string; // "text" など
  placeholder: string;
  value?: string;
  onChange?: (v: string) => void;
};

/* ===== Checkbox Options ===== */
export type TextReplaceOptionsProps = {
  id: string;
  name: string;
  spanTitle: string; // ラベル表示
  textType: 'checkbox'; // 固定
  checked?: boolean;
  onChange?: (v: boolean) => void;
};

/* ===== Button (Bottom) ===== */
export type BottomProps = {
  buttonText: string;
  buttonClass: string; // 配置用クラス（例: "button-back"）
  onClick?: () => void;
};
