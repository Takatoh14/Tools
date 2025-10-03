// src/pages/JsonConvert.tsx
import '../styles/json.scss';

import {
  Bottom,
  TextArea,
  TextReplaceOptions,
  Title,
} from '../components/Common';
import { useEffect, useMemo, useState } from 'react';
import { goBack } from '../utils/goBack';
import { csvToJson, type QuoteMode } from '../lib/csvToJson';

type DelimiterPreset = 'comma' | 'tab' | 'pipe' | 'custom';
type QuotePreset = 'double' | 'single' | 'none' | 'custom';
type IndentPreset = '2' | '4' | 'tab';

const JsonConvert = () => {
  // 入力（CSV/TSV）
  const [input, setInput] = useState('');

  // 区切り
  const [delimPreset, setDelimPreset] = useState<DelimiterPreset>('comma');
  const [customDelim, setCustomDelim] = useState(',');

  // 括り
  const [quotePreset, setQuotePreset] = useState<QuotePreset>('double');
  const [customQuote, setCustomQuote] = useState('"');

  // ヘッダ & 空行
  const [hasHeader, setHasHeader] = useState(true);
  const [skipEmptyLines, setSkipEmptyLines] = useState(true);

  // 整形（出力 JSON）
  const [indentPreset, setIndentPreset] = useState<IndentPreset>('2');
  const [minify, setMinify] = useState(false);
  const [sortKeys, setSortKeys] = useState(false);

  // 出力
  const [output, setOutput] = useState('');

  // 実際に使う区切り
  const delimiter = useMemo(() => {
    switch (delimPreset) {
      case 'comma':
        return ',';
      case 'tab':
        return '\t';
      case 'pipe':
        return '|';
      case 'custom':
        return customDelim || ',';
    }
  }, [delimPreset, customDelim]);

  // 実際に使う括り
  const quoteMode: QuoteMode = useMemo(() => {
    switch (quotePreset) {
      case 'double':
      case 'single':
      case 'none':
        return quotePreset;
      case 'custom':
        return { kind: 'custom', char: (customQuote || '"').slice(0, 1) };
    }
  }, [quotePreset, customQuote]);

  // 出力のインデント
  const space = useMemo(() => {
    if (minify) return 0;
    if (indentPreset === 'tab') return '\t';
    return indentPreset === '4' ? 4 : 2;
  }, [indentPreset, minify]);

  // 変換
  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    try {
      const rows = csvToJson(input, {
        delimiter,
        quote: quoteMode,
        hasHeader,
        skipEmptyLines,
      });

      // キーのソート（任意）
      const normalized = sortKeys
        ? rows.map(obj => {
            const ent = Object.entries(obj).sort(([a], [b]) =>
              a.localeCompare(b)
            );
            return Object.fromEntries(ent);
          })
        : rows;

      setOutput(JSON.stringify(normalized, null, space));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setOutput(`⚠ 変換に失敗しました: ${msg}`);
    }
  }, [input, delimiter, quoteMode, hasHeader, skipEmptyLines, space, sortKeys]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output);
      alert('出力をコピーしました');
    } catch {
      alert('コピーに失敗しました');
    }
  }

  return (
    <div className="json">
      <Title titleText="JSON変換" titleClass="title" />

      {/* 入力 */}
      <div className="json-section">
        <div className="section-title">入力</div>
        <TextArea
          id="csv-input"
          name="csv-input"
          rows={12}
          placeholder="データを貼り付けてください"
          value={input}
          onChange={setInput}
          readonly={false}
        />
      </div>

      <Title titleText="変換設定" titleClass="sub-title" />

      {/* オプション */}
      <div className="json-options">
        {/* 区切り */}
        <label className="opt">
          <span className="opt-label">区切り文字</span>
          <select
            value={delimPreset}
            onChange={e => setDelimPreset(e.target.value as DelimiterPreset)}
          >
            <option value="comma">カンマ</option>
            <option value="tab">タブ</option>
            <option value="pipe">パイプ（|）</option>
            <option value="custom">カスタム</option>
          </select>
          {delimPreset === 'custom' && (
            <input
              className="inline-input"
              value={customDelim}
              maxLength={2}
              placeholder="例: ;"
              onChange={e => setCustomDelim(e.target.value)}
            />
          )}
        </label>

        {/* 括り */}
        <label className="opt">
          <span className="opt-label">括り文字</span>
          <select
            value={quotePreset}
            onChange={e => setQuotePreset(e.target.value as QuotePreset)}
          >
            <option value="double">ダブルクォート（"）</option>
            <option value="single">シングルクォート（'）</option>
            <option value="none">なし</option>
            <option value="custom">カスタム</option>
          </select>
          {quotePreset === 'custom' && (
            <input
              className="inline-input"
              value={customQuote}
              maxLength={1}
              placeholder="例: `"
              onChange={e => setCustomQuote(e.target.value)}
            />
          )}
        </label>

        {/* トグル群 */}
        <div className="opt opt-toggle">
          <TextReplaceOptions
            id="opt-header"
            name="opt-header"
            spanTitle="先頭行をヘッダとして扱う"
            textType="checkbox"
            checked={hasHeader}
            onChange={setHasHeader}
          />
          <TextReplaceOptions
            id="opt-skip-empty"
            name="opt-skip-empty"
            spanTitle="空行をスキップする"
            textType="checkbox"
            checked={skipEmptyLines}
            onChange={setSkipEmptyLines}
          />
        </div>

        {/* 整形（インデント/最小化/キーソート） */}
        <label className="opt">
          <span className="opt-label">インデント</span>
          <select
            value={indentPreset}
            onChange={e => setIndentPreset(e.target.value as IndentPreset)}
            disabled={minify}
            title={minify ? '最小化が有効のため無効' : ''}
          >
            <option value="2">スペース 2</option>
            <option value="4">スペース 4</option>
            <option value="tab">タブ</option>
          </select>
        </label>

        <div className="opt opt-toggle">
          <TextReplaceOptions
            id="opt-minify"
            name="opt-minify"
            spanTitle="最小化（詰めて出力）"
            textType="checkbox"
            checked={minify}
            onChange={setMinify}
          />
          <TextReplaceOptions
            id="opt-sort"
            name="opt-sort"
            spanTitle="キーをアルファベット順にソート"
            textType="checkbox"
            checked={sortKeys}
            onChange={setSortKeys}
          />
        </div>
      </div>

      {/* 出力 */}
      <Title titleText="出力" titleClass="sub-title" />
      <div className="json-output">
        <div className="output-header">
          <Bottom
            buttonText="コピー"
            buttonClass="button-copy"
            onClick={handleCopy}
          />
        </div>
        <TextArea
          id="json-output"
          name="json-output"
          rows={12}
          placeholder="ここに JSON の出力が表示されます"
          value={output}
          readonly={true}
        />
      </div>

      <Bottom
        buttonText="戻る"
        buttonClass="button-back"
        onClick={() => goBack('/tools/#/')}
      />
    </div>
  );
};

export default JsonConvert;
