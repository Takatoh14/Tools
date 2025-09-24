// pages/Replace.tsx
import { useEffect, useState, useCallback } from "react";
import { Title, SubTitle, TextBox, ReplaceOption } from "../components/Common";
import { Alert } from "../components/Alert";
import { CopyButton } from "../components/CopyButton"; // ★ 追加
import { BackButton } from "../components/BackButton";
import "../styles/replace.scss";

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const decodeEscapes = (s: string) =>
  s.replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\r/g, "\r");

const Replace = () => {
  const [inputText, setInputText] = useState("");
  const [searchPattern, setSearchPattern] = useState("");
  const [replaceValue, setReplaceValue] = useState("");
  const [regexMode, setRegexMode] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [outputText, setOutputText] = useState("");

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState<
    "error" | "success" | "info" | "warning"
  >("error");

  const raise = useCallback((msg: string, type: typeof alertType = "error") => {
    setAlertMsg(msg);
    setAlertType(type);
    setAlertOpen(true);
  }, []);

  useEffect(() => {
    if (!inputText || !searchPattern) {
      setOutputText("");
      return;
    }
    try {
      const source = regexMode ? searchPattern : escapeRegExp(searchPattern);
      const flags = `g${caseSensitive ? "" : "i"}`;
      const reg = new RegExp(source, flags);

      if (!reg.test(inputText)) {
        setOutputText("");
        return;
      }
      const replacement = regexMode
        ? decodeEscapes(replaceValue)
        : replaceValue;
      setOutputText(inputText.replace(reg, replacement));
    } catch {
      setOutputText("");
      if (searchPattern)
        raise("正規表現が不正です。パターンを確認してください。");
    }
  }, [inputText, searchPattern, replaceValue, regexMode, caseSensitive, raise]);

  return (
    <div className="replace">
      <Alert
        open={alertOpen}
        type={alertType}
        message={alertMsg}
        onClose={() => setAlertOpen(false)}
        duration={5000}
      />

      <Title titleName="データ置換ツール" title="title" />

      {/* 入力欄 */}
      <div className="textField">
        <SubTitle title="subTitle" titleName="入力欄" />
        <TextBox
          name="inputText"
          rows={7}
          placeholder="ここにテキストを貼り付け"
          textStyle="textBox"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </div>

      {/* 置換オプション */}
      <SubTitle title="subTitle" titleName="置換オプション" />
      <div className="replaceTextOptions">
        <ReplaceOption
          title="検索パターン"
          inputId="searchPattern"
          placeholder="例) hello / ^a.b$ ..."
          value={searchPattern}
          onChange={(e) => setSearchPattern(e.target.value)}
          checkId="regexMode"
          checkLabel={"正規表現モード（ONで \\n や \\t を解釈）"} // ★ 表示用にエスケープ
          checked={regexMode}
          onCheck={(e) => setRegexMode(e.target.checked)}
        />

        <ReplaceOption
          title="置換文字列"
          inputId="replaceValue"
          placeholder={"例) \\t や \\n（正規表現モード時のみ有効）"} // ★ 表示用にエスケープ
          value={replaceValue}
          onChange={(e) => setReplaceValue(e.target.value)}
          checkId="matchCase"
          checkLabel="大文字小文字を区別する"
          checked={caseSensitive}
          onCheck={(e) => setCaseSensitive(e.target.checked)}
        />
      </div>

      {/* 出力欄 */}
      <div className="textField">
        <div className="outputHeader">
          <SubTitle title="subTitle" titleName="出力欄" />
          <CopyButton
            className="copyBtn"
            getText={() => outputText}
            disabled={!outputText}
            onSuccess={() => raise("出力内容をコピーしました。", "success")}
            onError={() =>
              raise("コピーに失敗しました。ブラウザの設定をご確認ください。")
            }
          />
        </div>

        <TextBox
          name="outputText"
          rows={7}
          placeholder="置換後のテキストが出力されます。"
          textStyle="textBox"
          value={outputText}
          readOnly
        />
      </div>

      <BackButton className="backBtn" fallback="/tools" label="戻る" />
    </div>
  );
};

export default Replace;
