import '../styles/style.scss';
import '../styles/common.scss';

import type {
  BottomProps,
  CardProps,
  TextAreaProps,
  TextReplaceOptionsProps,
  TextReplceProps,
  TitleProps,
} from '../types/common';

import { Link } from 'react-router-dom';

// タイトル
const Title = ({ titleText, titleClass }: TitleProps) => (
  <h1 className={titleClass}>{titleText}</h1>
);

// カード
const Card = ({ title, to }: CardProps) => (
  <Link to={to} className="card">
    <div className="card-title">{title}</div>
  </Link>
);

// テキストエリア
const TextArea = ({
  id,
  name,
  rows,
  placeholder,
  readonly,
  value,
  onChange,
}: TextAreaProps) => (
  <textarea
    id={id}
    name={name}
    rows={rows}
    placeholder={placeholder}
    readOnly={readonly}
    className="text-area"
    value={value}
    onChange={e => onChange?.(e.target.value)}
  />
);

// 置換前/後の入力
const TextReplace = ({
  spanTitle,
  textType,
  placeholder,
  value,
  onChange,
}: TextReplceProps) => (
  <label className="replace-label">
    <span className="replace-span">{spanTitle}</span>
    <input
      type={textType}
      className="replace-input"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange?.(e.target.value)}
    />
  </label>
);

// チェックボックス
const TextReplaceOptions = ({
  id,
  name,
  spanTitle,
  textType,
  checked,
  onChange,
}: TextReplaceOptionsProps) => (
  <label className="replace-checkbox-label" htmlFor={id}>
    <input
      id={id}
      name={name}
      type={textType}
      className="replace-checkbox-input"
      checked={!!checked}
      onChange={e => onChange?.(e.target.checked)}
    />
    {spanTitle}
  </label>
);

// ボタン
const Bottom = ({ buttonText, buttonClass, onClick }: BottomProps) => (
  <div className={buttonClass}>
    <button type="button" className="btn" onClick={onClick}>
      {buttonText}
    </button>
  </div>
);
export { Title, Card, TextArea, TextReplace, TextReplaceOptions, Bottom };
