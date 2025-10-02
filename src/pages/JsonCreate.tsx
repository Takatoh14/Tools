// src/pages/JsonCreate.tsx
import '../styles/json.scss';

import {
  Bottom,
  TextArea,
  TextReplaceOptions,
  Title,
} from '../components/Common';
import { useEffect, useMemo, useState } from 'react';
import { goBack } from '../utils/goBack';
import { jsonToCsv, type QuoteMode } from '../lib/jsonToCsv';

type DelimiterPreset = 'comma' | 'tab' | 'pipe' | 'custom';
type QuotePreset = 'double' | 'single' | 'none' | 'custom';

const JsonCreate = () => {
  const [input, setInput] = useState(''); // 入力 JSON
  const [preset, setPreset] = useState<DelimiterPreset>('comma');
  const [customDelim, setCustomDelim] = useState(','); // カスタム区切り

  const [quotePreset, setQuotePreset] = useState<QuotePreset>('double');
  const [customQuote, setCustomQuote] = useState('"'); // カスタム括り

  const [header, setHeader] = useState(true);
  const [alwaysQuote, setAlwaysQuote] = useState(false); // ★ 追加: 常に括る
  const [output, setOutput] = useState(''); // 出力

  // 実際に使う区切り文字
  const delimiter = useMemo(() => {
    switch (preset) {
      case 'comma':
        return ',';
      case 'tab':
        return '\t';
      case 'pipe':
        return '|';
      case 'custom':
        return customDelim || ',';
    }
  }, [preset, customDelim]);

  // 実際に使う括り文字（lib の QuoteMode 型に変換）
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

  // 入力 or 設定が変わったら即時変換
  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    try {
      const parsed = JSON.parse(input) as unknown;
      if (!Array.isArray(parsed)) {
        setOutput(
          '⚠ 入力はオブジェクト配列（例: [{...},{...}]）にしてください。'
        );
        return;
      }
      const result = jsonToCsv(parsed, {
        delimiter,
        header,
        quote: quoteMode,
        alwaysQuote, // ★ 追加
      });
      setOutput(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setOutput(`⚠ JSONの形式が不正です: ${msg}`);
    }
  }, [input, delimiter, header, quoteMode, alwaysQuote]);

  // クリップボードコピー
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
      <Title titleText="JSON作成" titleClass="title" />

      <div className="json-section">
        <div className="section-title">入力（JSON）</div>
        <TextArea
          id="json-input"
          name="json-input"
          rows={12}
          placeholder="JSONを入力してください"
          value={input}
          onChange={setInput}
          readonly={false}
        />
      </div>

      <Title titleText="変換設定" titleClass="sub-title" />

      <div className="json-options">
        {/* 区切り文字 */}
        <label className="opt">
          <span className="opt-label">区切り文字</span>
          <select
            value={preset}
            onChange={e => setPreset(e.target.value as DelimiterPreset)}
          >
            <option value="comma">カンマ</option>
            <option value="tab">タブ</option>
            <option value="pipe">パイプ（|）</option>
            <option value="custom">カスタム</option>
          </select>
          {preset === 'custom' && (
            <input
              className="inline-input"
              value={customDelim}
              maxLength={2}
              placeholder="例: ;"
              onChange={e => setCustomDelim(e.target.value)}
            />
          )}
        </label>

        {/* 括り文字 */}
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
            spanTitle="ヘッダ行を出力する"
            textType="checkbox"
            checked={header}
            onChange={setHeader}
          />
          <TextReplaceOptions
            id="opt-always-quote"
            name="opt-always-quote"
            spanTitle="常に括り文字で囲む"
            textType="checkbox"
            checked={alwaysQuote}
            onChange={setAlwaysQuote}
          />
        </div>
      </div>

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
          rows={10}
          placeholder="ここに出力結果が表示されます"
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

export default JsonCreate;
