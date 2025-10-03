// src/pages/JsonConvert.tsx
// JSON変換（CSV/TSV → JSON）ページ：機能本体 + SEO設定（React 19 の Document Metadata 使用）

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
  // ===== 入力（CSV/TSV） =====
  const [input, setInput] = useState('');

  // ===== 区切り =====
  const [delimPreset, setDelimPreset] = useState<DelimiterPreset>('comma');
  const [customDelim, setCustomDelim] = useState(',');

  // ===== 括り =====
  const [quotePreset, setQuotePreset] = useState<QuotePreset>('none');
  const [customQuote, setCustomQuote] = useState('"');

  // ===== ヘッダ & 空行 =====
  const [hasHeader, setHasHeader] = useState(true);
  const [skipEmptyLines, setSkipEmptyLines] = useState(true);

  // ===== 整形（出力 JSON） =====
  const [indentPreset, setIndentPreset] = useState<IndentPreset>('2');
  const [minify, setMinify] = useState(false);
  const [sortKeys, setSortKeys] = useState(false);

  // ===== 出力 =====
  const [output, setOutput] = useState('');

  // 実際に使う区切り文字を決定
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

  // 実際に使う括り（QuoteMode）を決定
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

  // 出力のインデント幅（最小化なら0）
  const space = useMemo(() => {
    if (minify) return 0;
    if (indentPreset === 'tab') return '\t';
    return indentPreset === '4' ? 4 : 2;
  }, [indentPreset, minify]);

  // 入力が変わるたびにCSV→JSON変換を実行
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

      // 任意：キーをアルファベット順にソート
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

  // クリップボードへコピー
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
    name: 'JSON変換ツール（CSV/TSV → JSON）',
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
      {/* ▼ SEO設定（React 19 ではレンダーツリー内に書くと <head> に自動集約） ▼ */}
      <title>JSON変換ツール｜データやテキストをJSONへ変換（無料・）</title>
      <meta
        name="description"
        content="CSV/TSVをJSONへ高速変換できる無料ツール。区切り文字・括り文字・ヘッダ行・空行スキップ・インデント・最小化・キーソートに対応。ブラウザで完結し、インストール不要。"
      />
      <meta
        name="keywords"
        content="JSON変換, CSV JSON 変換, TSV JSON 変換, 区切り文字, 括り文字, 無料, , データ変換"
      />
      <meta property="og:title" content="JSON変換ツール｜CSV/TSV→JSON" />
      <meta
        property="og:description"
        content="CSV/TSVをJSONに変換。区切り・括り・ヘッダ・空行・整形・最小化・キーソートに対応する無料ツール。"
      />
      <meta property="og:type" content="website" />
      {/* canonical は公開URL確定後に有効化（例） */}
      {
        <link
          rel="canonical"
          href="https://takato-work.com/tools/json-create"
        />
      }
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ▲ SEO設定ここまで ▲ */}

      <Title titleText="JSON作成" titleClass="title" />

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
