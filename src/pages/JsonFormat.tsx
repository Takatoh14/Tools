// src/pages/JsonFormat.tsx
// JSON整形ページ（フォーマッタ + SEO設定：React 19 の Document Metadata 使用）

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

  // 入力 → 整形処理
  const { output, error } = useMemo(() => {
    try {
      if (input.trim() === '') return { output: '', error: undefined };

      // JSONをパースし、必要に応じてキーを再帰的にソート
      const data = JSON.parse(input);
      const normalized = sortKeys ? sortKeysDeep(data) : data;

      // インデント幅の決定（最小化が有効なら 0）
      const indentValue = minify
        ? 0
        : indent === 'tab'
        ? '\t'
        : indent === 'space4'
        ? 4
        : 2;

      // 整形出力
      const out = JSON.stringify(normalized, null, indentValue);
      return { output: out, error: undefined };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return { output: '', error: `JSON をパースできません: ${msg}` };
    }
  }, [input, indent, minify, sortKeys]);

  // 出力のコピー
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(output);
      alert('出力をコピーしました');
    } catch {
      alert('コピーに失敗しました');
    }
  }, [output]);

  // 戻るボタン
  const handleBack = useCallback(() => {
    goBack('/tools/#/');
  }, []);

  // 構造化データ（JSON-LD）：このページを SoftwareApplication として宣言
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'JSON整形ツール',
    operatingSystem: 'Web',
    applicationCategory: 'DeveloperApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    },
  };

  return (
    <div className="diff">
      {/* ▼ SEO設定（React 19：ここに書くと <head> に自動集約） ▼ */}
      <title>
        JSON整形ツール｜インデント/最小化/キーソート対応（無料・オンライン）
      </title>
      <meta
        name="description"
        content="JSONを整形して見やすく表示。スペース2/4/タブのインデント、最小化（minify）、キーのアルファベット順ソートに対応した無料オンラインJSONフォーマッタ。"
      />
      <meta
        name="keywords"
        content="JSON 整形, JSON フォーマット, JSON minify, JSON pretty, キーソート, 無料, オンライン"
      />
      <meta
        property="og:title"
        content="JSON整形ツール｜オンラインでフォーマット"
      />
      <meta
        property="og:description"
        content="インデント/最小化/キーソートに対応した無料オンラインJSONフォーマッタ。ブラウザだけで手軽に整形。"
      />
      <meta property="og:type" content="website" />
      {/* 公開URL確定後に有効化 */}
      {
        <link
          rel="canonical"
          href="https://takato-work.com/tools/json-format"
        />
      }
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ▲ SEO設定ここまで ▲ */}

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
