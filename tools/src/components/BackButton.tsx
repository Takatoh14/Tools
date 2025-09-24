import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/backButton.scss";

type Props = {
  /** 既定は1つ戻る（-1）。特定パスに戻したい場合は "/tools" などを指定 */
  to?: number | string;
  /** 履歴がない場合のフォールバック先（to が number のときに使用） */
  fallback?: string;
  className?: string;
  label?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
};

export const BackButton = ({
  to = -1,
  fallback = "/",
  className,
  label = "戻る",
  onClick,
}: Props) => {
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (typeof to === "string") {
      // 指定パスへ移動
      navigate(to);
    } else {
      // 履歴がない（直接URL入力など）のときは fallback へ
      if (window.history.length > 1) {
        navigate(to);
      } else {
        navigate(fallback);
      }
    }
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      aria-label={label}
      title={label}
    >
      {label}
    </button>
  );
};
