import "../styles/common.scss";

import type {
  CardProps,
  TitleProps,
  TextField,
  ReplaceTextOption,
} from "../types/type";

import { Link } from "react-router-dom";

//タイトルのコンポーネント
const Title = ({ title, titleName }: TitleProps) => {
  return <h2 className={title}>{titleName}</h2>;
};

//ページ遷移のコンポーネント
const Cards = ({ title, url }: CardProps) => {
  return (
    <Link to={url ? `/${url}` : "/"} className="link-style">
      <div className="cards">
        <h3>{title}</h3>
      </div>
    </Link>
  );
};

//サブタイトルのコンポーネント
const SubTitle = ({ title, titleName }: TitleProps) => {
  return <h2 className={title}>{titleName}</h2>;
};

//テキストボックスのコンポーネント
const TextBox = ({
  name,
  rows,
  placeholder,
  textStyle,
  value,
  onChange,
  readOnly,
}: TextField) => {
  return (
    <textarea
      name={name}
      id={name}
      rows={rows}
      placeholder={placeholder}
      className={textStyle}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
    ></textarea>
  );
};

//置換オプションのコンポーネント
const ReplaceOption = ({
  title,
  inputId,
  inputName,
  placeholder,
  value,
  onChange,
  checkId,
  checkName,
  checkLabel,
  checked,
  onCheck,
}: ReplaceTextOption) => {
  return (
    <div
      className="replaceTextOption"
      role="group"
      aria-labelledby={`${inputId}-title`}
    >
      <div className="replaceOption">
        <label htmlFor={inputId} className="label">
          {title}
        </label>

        <input
          id={inputId}
          name={inputName ?? inputId}
          type="text"
          className="inputText"
          placeholder={placeholder}
          value={value} // ← 親から受け取る
          onChange={onChange} // ← 親から受け取る
        />

        {checkLabel && (
          <label htmlFor={checkId} className="checkbox">
            <input
              id={checkId}
              name={checkName ?? checkId}
              type="checkbox"
              checked={checked} // ← 親から受け取る
              onChange={onCheck} // ← 親から受け取る
            />
            <span>{checkLabel}</span>
          </label>
        )}
      </div>
    </div>
  );
};

export { Title, SubTitle, Cards, TextBox, ReplaceOption };
