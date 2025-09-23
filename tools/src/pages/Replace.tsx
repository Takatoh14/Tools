// pages/Replace.tsx
import { useEffect, useState, useCallback } from "react";
import { Title, SubTitle, TextBox, ReplaceOption } from "../components/Common";
import { Alert } from "../components/Alert"; // 上から出るポップアップ（既存or前回提示のもの）
import "../styles/replace.scss";

// 文字列検索用にメタ文字をエスケープ
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// 正規表現モード時の置換文字列の \n や \t を解釈
const decodeEscapes = (s: string) =>
  s.replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\r/g, "\r");

const Replace = () => {
  // 入出力・オプション
  const [inputText, setInputText] = useState("");
  const [searchPattern, setSearchPattern] = useState("");
  const [replaceValue, setReplaceValue] = useState("");
  const [regexMode, setRegexMode] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [outputText, setOutputText] = useState("");

  // ポップアップ
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

  // 入力が変わるたびに自動置換（ボタン無し）
  useEffect(() => {
    // 入力や検索パターンが空なら出力をリセット
    if (!inputText || !searchPattern) {
      setOutputText("");
      return;
    }

    try {
      const source = regexMode ? searchPattern : escapeRegExp(searchPattern);
      const flags = `g${caseSensitive ? "" : "i"}`;
      const reg = new RegExp(source, flags);

      if (!reg.test(inputText)) {
        // マッチが無ければ出力を空に（必要に応じメッセージは控えめに）
        setOutputText("");
        return;
      }

      const replacement = regexMode
        ? decodeEscapes(replaceValue)
        : replaceValue;
      const result = inputText.replace(reg, replacement);
      setOutputText(result);
    } catch {
      // 構文エラー時だけ通知（多発しないよう 700ms デバウンス等も可）
      setOutputText("");
      if (searchPattern)
        raise("正規表現が不正です。パターンを確認してください。");
    }
    // 依存配列：入力・オプションの全て
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

      {/* 入力欄（TextBox 使用） */}
      <div className="textField">
        <SubTitle title="subTitle" titleName="入力欄" />
        <TextBox
          name="inputText"
          rows={7}
          placeholder="ここにテキストを貼り付け"
          textStyle="textBox"
          value={inputText} // ← 制御
          onChange={(e) => setInputText(e.target.value)} // ← 制御
        />
      </div>

      {/* 置換オプション */}
      <SubTitle title="subTitle" titleName="置換オプション" />
      <div className="replaceTextOptions">
        <ReplaceOption
          title="検索パターン"
          inputId="searchPattern"
          placeholder="例) hello / ^a.b$ ..."
          value={searchPattern} // ← 制御
          onChange={(e) => setSearchPattern(e.target.value)} // ← 制御
          checkId="regexMode"
          checkLabel="正規表現モード（ONで \n や \t を解釈）"
          checked={regexMode} // ← 制御
          onCheck={(e) => setRegexMode(e.target.checked)} // ← 制御
        />

        <ReplaceOption
          title="置換文字列"
          inputId="replaceValue"
          placeholder="例) ￥t や ￥n（正規表現モード時のみ有効）"
          value={replaceValue} // ← 制御
          onChange={(e) => setReplaceValue(e.target.value)} // ← 制御
          checkId="matchCase"
          checkLabel="大文字小文字を区別する"
          checked={caseSensitive} // ← 制御
          onCheck={(e) => setCaseSensitive(e.target.checked)} // ← 制御
        />
      </div>

      {/* 出力欄（TextBox 使用・編集不可） */}
      <div className="textField">
        <SubTitle title="subTitle" titleName="出力欄" />
        <TextBox
          name="outputText"
          rows={7}
          placeholder="置換後のテキストが出力されます。"
          textStyle="textBox"
          value={outputText} // ← 制御
          readOnly // ← 編集不可
        />
      </div>
    </div>
  );
};

export default Replace;
