// src/pages/DataReplace.tsx
// テキスト置換ツールページ + SEO設定 + 使い勝手/アクセシビリティ改善

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

const CANONICAL_URL = 'https://takato-work.com/tools/data-replace';

const DataReplace = () => {
  // 入力/置換設定
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [replacement, setReplacement] = useState('');
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(true);

  // 通知メッセージ（コピー成功/失敗などを画面内で表示）
  const [notice, setNotice] = useState<string>('');

  // 置換結果（replaceTextは { output, error } を返す想定）
  const { output, error } = useMemo(
    () =>
      replaceText(input, search, replacement, {
        useRegex,
        caseSensitive,
      }),
    [input, search, replacement, useRegex, caseSensitive]
  );

  // コピー：出力が空の時は無効化
  const handleCopy = useCallback(async () => {
    try {
      if (!output) {
        setNotice('出力が空のため、コピーできません。');
        return;
      }
      await navigator.clipboard.writeText(output);
      setNotice('出力をコピーしました。');
    } catch {
      setNotice('コピーに失敗しました。HTTPS環境でお試しください。');
    }
  }, [output]);

  // 戻る
  const handleBack = useCallback(() => {
    goBack('/tools/#/');
  }, []);

  // 構造化データ（JSON-LD）— URLを明示し、無料ツールであることを宣言
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'テキスト置換ツール',
    url: CANONICAL_URL, // ← 追加
    operatingSystem: 'Web',
    applicationCategory: 'Utility',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    },
  };

  return (
    <div className="replace">
      {/* ▼ SEO設定 ▼ */}
      <title>テキスト置換ツール｜無料で文字列を変換</title>
      <meta
        name="description"
        content="テキスト置換ツール。正規表現・大文字小文字の区別に対応し、テキストの検索と置換をブラウザ上で簡単に行えます。"
      />
      <meta
        name="keywords"
        content="テキスト置換,文字列置換,正規表現,無料,データ変換"
      />
      <link rel="canonical" href={CANONICAL_URL} />

      {/* OG/Twitter（SNSシェア最適化） */}
      <meta property="og:title" content="テキスト置換ツール｜で置換" />
      <meta
        property="og:description"
        content="正規表現・大文字小文字対応の無料置換ツール。ブラウザだけでサクッと文字列を検索・置換できます。"
      />
      <meta property="og:type" content="website" />
      {/* <meta property="og:image" content="https://takato-work.com/og/tools-data-replace.png" /> */}
      <meta name="twitter:card" content="summary_large_image" />
      {/* <meta name="twitter:image" content="https://takato-work.com/og/tools-data-replace.png" /> */}

      {/* 構造化データ（JSON-LD） */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ▲ SEO設定ここまで ▲ */}

      {/* NOTE: 画面内の見出しはデザイン都合で「データ変換ツール」だが
         実体はテキスト置換。必要ならここも「テキスト置換」に統一推奨 */}
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
          // \n,\t,\r をソース上で表記するときはエスケープが必要（UIでは \n などと見える）
          spanTitle="正規表現モード"
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

      {/* エラーはスクリーンリーダ向けに alert ロールで通知 */}
      {error && (
        <p className="error" role="alert" aria-live="assertive">
          エラー: {error}
        </p>
      )}

      {/* 画面内通知（コピー成功/失敗など） */}
      {notice && (
        <p className="notice" aria-live="polite">
          {notice}
        </p>
      )}

      <Bottom
        buttonText="戻る"
        buttonClass="button-back"
        onClick={handleBack}
      />
    </div>
  );
};

export default DataReplace;
