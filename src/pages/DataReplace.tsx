import '../styles/replace.scss';

import {
  Bottom,
  TextArea,
  TextReplace,
  TextReplaceOptions,
  Title,
} from '../components/Common';
import { useCallback, useMemo, useState } from 'react';

import { goBack } from '../utils/goBack';
import { replaceText } from '../lib/replaceText';

const DataReplace = () => {
  // 入力/置換設定
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [replacement, setReplacement] = useState('');
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(true);

  // 置換結果
  const { output, error } = useMemo(
    () =>
      replaceText(input, search, replacement, {
        useRegex,
        caseSensitive,
      }),
    [input, search, replacement, useRegex, caseSensitive]
  );

  // コピー
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(output);
      alert('出力をコピーしました');
    } catch {
      alert('コピーに失敗しました');
    }
  }, [output]);

  // 戻る
  const handleBack = useCallback(() => {
    goBack('/tools/#/');
  }, []);

  return (
    <div className="replace">
      <Title titleText="データ変換ツール" titleClass="title" />

      <Title titleText="入力" titleClass="sub-title" />
      <TextArea
        id="textarea-input"
        name="textarea-input"
        rows={7}
        placeholder="テキストを入力してください。"
        value={input}
        onChange={setInput}
      />

      <Title titleText="置換設定" titleClass="sub-title" />
      <div className="replace-text">
        <TextReplace
          spanTitle="置換前"
          textType="text"
          placeholder="置換前の文字列を入力してください。"
          value={search}
          onChange={setSearch}
        />
        <TextReplace
          spanTitle="置換後"
          textType="text"
          placeholder="置換後の文字列を入力してください。"
          value={replacement}
          onChange={setReplacement}
        />
      </div>

      <div className="replace-checkbox">
        <TextReplaceOptions
          id="regular-expression"
          name="regular-expression"
          spanTitle="正規表現モード（置換 \n, \t, \r 展開）"
          textType="checkbox"
          checked={useRegex}
          onChange={setUseRegex}
        />
        <TextReplaceOptions
          id="uppercase-lowercase"
          name="uppercase-lowercase"
          spanTitle="大文字小文字を区別する"
          textType="checkbox"
          checked={caseSensitive}
          onChange={setCaseSensitive}
        />
      </div>

      <Title titleText="出力" titleClass="sub-title" />
      <Bottom
        buttonText="コピー"
        buttonClass="button-copy"
        onClick={handleCopy}
      />
      <TextArea
        id="textarea-output"
        name="textarea-output"
        rows={7}
        readonly
        value={output}
        placeholder=""
      />

      {error && <p className="error">エラー: {error}</p>}

      <Bottom
        buttonText="戻る"
        buttonClass="button-back"
        onClick={handleBack}
      />
    </div>
  );
};

export default DataReplace;
