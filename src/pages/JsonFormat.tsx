// src/pages/JsonFormat.tsx
import {
  Bottom,
  TextArea,
  TextReplaceOptions,
  Title,
} from '../components/Common';
import { useCallback, useMemo, useState } from 'react';

import SelectBox from '../components/SelectBox';
import { goBack } from '../utils/goBack';
import { sortKeysDeep } from '../lib/sortKeys';

type IndentKind = 'space2' | 'space4' | 'tab';

const JsonFormat = () => {
  const [input, setInput] = useState<string>('');
  const [indent, setIndent] = useState<IndentKind>('space2');
  const [minify, setMinify] = useState<boolean>(false);
  const [sortKeys, setSortKeys] = useState<boolean>(false);

  const { output, error } = useMemo(() => {
    try {
      if (input.trim() === '') return { output: '', error: undefined };

      const data = JSON.parse(input);
      const normalized = sortKeys ? sortKeysDeep(data) : data;

      const indentValue = minify
        ? 0
        : indent === 'tab'
        ? '\t'
        : indent === 'space4'
        ? 4
        : 2;

      const out = JSON.stringify(normalized, null, indentValue);
      return { output: out, error: undefined };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return { output: '', error: `JSON をパースできません: ${msg}` };
    }
  }, [input, indent, minify, sortKeys]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(output);
      alert('出力をコピーしました');
    } catch {
      alert('コピーに失敗しました');
    }
  }, [output]);

  const handleBack = useCallback(() => {
    goBack('/tools/#/');
  }, []);

  return (
    <div className="diff">
      <Title titleText="JSON整形" titleClass="title" />

      <Title titleText="入力（JSON）" titleClass="sub-title" />
      <TextArea
        id="json-input"
        name="json-input"
        rows={14}
        placeholder='[{"key":"value"}]'
        value={input}
        onChange={setInput}
      />

      <div className="diff-options">
        <Title titleText="整形設定" titleClass="sub-title" />
        <SelectBox
          value={indent}
          onChange={v => setIndent(v as IndentKind)}
          label="インデント"
          options={[
            { value: 'space2', label: 'スペース 2' },
            { value: 'space4', label: 'スペース 4' },
            { value: 'tab', label: 'タブ' },
          ]}
        />

        <div className="replace-text">
          <TextReplaceOptions
            id="opt-sort-keys"
            name="opt-sort-keys"
            spanTitle="キーをアルファベット順にソート"
            textType="checkbox"
            checked={sortKeys}
            onChange={setSortKeys}
          />
          <TextReplaceOptions
            id="opt-minify"
            name="opt-minify"
            spanTitle="最小化（詰めて出力）"
            textType="checkbox"
            checked={minify}
            onChange={setMinify}
          />
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="output-header">
        <Title titleText="出力" titleClass="sub-title" />
        <Bottom
          buttonText="コピー"
          buttonClass="button-copy"
          onClick={handleCopy}
        />
      </div>

      <TextArea
        id="json-output"
        name="json-output"
        rows={14}
        placeholder=""
        value={output}
        readonly
      />

      <Bottom
        buttonText="戻る"
        buttonClass="button-back"
        onClick={handleBack}
      />
    </div>
  );
};

export default JsonFormat;
