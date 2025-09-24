import { useState } from "react";
import { copyText } from "../utils/clipboard";

type Props = {
  getText: () => string; // 押下時にコピーするテキストを取得
  className?: string;
  disabled?: boolean;
  label?: string; // 通常表示
  doneLabel?: string; // コピー後の一時表示
  onSuccess?: () => void;
  onError?: (err?: unknown) => void;
};

export const CopyButton = ({
  getText,
  className,
  disabled,
  label = "コピー",
  doneLabel = "コピー済み",
  onSuccess,
  onError,
}: Props) => {
  const [done, setDone] = useState(false);

  const onClick = async () => {
    const res = await copyText(getText());
    if (res.ok) {
      setDone(true);
      onSuccess?.();
      setTimeout(() => setDone(false), 1200);
    } else {
      onError?.(res.error);
    }
  };

  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {done ? doneLabel : label}
    </button>
  );
};
