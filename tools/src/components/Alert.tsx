import "../styles/alert.scss";
import { useEffect } from "react";

export type AlertType = "error" | "success" | "info" | "warning";

type Props = {
  open: boolean;
  type?: AlertType;
  message: string;
  onClose?: () => void;
  autoClose?: boolean; // ← 追加: 自動クローズするか
  duration?: number; // ← 自動クローズ時の待機ms
};

export const Alert = ({
  open,
  type = "info",
  message,
  onClose,
  autoClose = true, // デフォルトは自動で閉じる
  duration = 3000,
}: Props) => {
  useEffect(() => {
    if (!open || !autoClose) return; // ← autoClose=false ならタイマーOFF
    const t = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(t);
  }, [open, autoClose, duration, onClose]);

  return (
    <div className={`alert alert--${type} ${open ? "alert--open" : ""}`}>
      <span>{message}</span>
      <button className="alert__close" onClick={onClose} aria-label="close">
        ×
      </button>
    </div>
  );
};
