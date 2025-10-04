// src/pages/JsonCreate.tsx
// JSON→CSV 変換ページ（機能本体 + SEO設定：React 19 の Document Metadata 使用）

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
  // ===== 入力 JSON =====
  const [input, setInput] = useState('');

  // ===== 区切り文字 =====
  const [preset, setPreset] = useState<DelimiterPreset>('comma');
  const [customDelim, setCustomDelim] = useState(','); // カスタム区切り

  // ===== 括り文字 =====
  const [quotePreset, setQuotePreset] = useState<QuotePreset>('none');
  const [customQuote, setCustomQuote] = useState('"'); // カスタム括り

  // ===== ヘッダ出力 =====
  const [header, setHeader] = useState(true);

  // ===== 出力（CSV/TSV） =====
  const [output, setOutput] = useState('');

  // --- 実際に使う区切りを決定 ---
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

  // --- UI値 -> ライブラリの QuoteMode へ変換 ---
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

  // --- 入力 or 設定が変わったら即時変換 ---
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
        quote: quoteMode, // none/ダブル/シングル/カスタムを反映
      });
      setOutput(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setOutput(`⚠ JSONの形式が不正です: ${msg}`);
    }
  }, [input, delimiter, header, quoteMode]);

  // --- クリップボードへコピー ---
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output);
      alert('出力をコピーしました');
    } catch {
      alert('コピーに失敗しました');
    }
  }

  // --- 構造化データ（JSON-LD）：このページを SoftwareApplication として宣言 ---
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'JSON→CSV 変換ツール',
    operatingSystem: 'Web',
    applicationCategory: 'DeveloperApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    },
  };

  return (
    <div className="json">
      {/* ▼ SEO設定（React 19：ここに書くと <head> に自動集約） ▼ */}
      <title>
        JSON→CSV変換ツール｜JSONからCSV/TSVを作成（無料・オンライン）
      </title>
      <meta
        name="description"
        content="JSON配列（[{...},{...}]）からCSV/TSVを作成する無料オンラインツール。区切り文字・括り文字・ヘッダ出力に対応し、ブラウザだけで簡単にエクスポートできます。"
      />
      <meta
        name="keywords"
        content="JSON CSV 変換, JSON から CSV, TSV, 区切り文字, 括り文字, 無料, オンライン, データ変換"
      />
      <meta property="og:title" content="JSON→CSV変換ツール" />
      <meta
        property="og:description"
        content="JSONからCSV/TSVを作成。区切り/括り/ヘッダ出力に対応する無料オンラインツール。"
      />
      <meta property="og:type" content="website" />
      {/* 公開URLが決まったら canonical を有効化 */}
      {
        <link
          rel="canonical"
          href="https://takato-work.com/tools/json-convert"
        />
      }
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ▲ SEO設定ここまで ▲ */}

      <Title titleText="JSON変換" titleClass="title" />

      {/* 入力（JSON） */}
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
            <option value="none">なし</option>
            <option value="double">ダブルクォート（"）</option>
            <option value="single">シングルクォート（'）</option>
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

        {/* ヘッダ出力 */}
        <div className="opt opt-toggle">
          <TextReplaceOptions
            id="opt-header"
            name="opt-header"
            spanTitle="ヘッダ行を出力する"
            textType="checkbox"
            checked={header}
            onChange={setHeader}
          />
        </div>
      </div>

      {/* 出力（CSV/TSV） */}
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
