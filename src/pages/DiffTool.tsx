// src/pages/DiffTool.tsx
// 差分比較ツールページ（SEO設定込み：React 19 の Document Metadata を使用）

import '../styles/diff.scss';

import {
  Bottom,
  TextArea,
  TextReplaceOptions,
  Title,
} from '../components/Common';
import { useEffect, useMemo, useState } from 'react';

import type { DiffLine } from '../lib/diff';
import { diffText } from '../lib/diff';
import { goBack } from '../utils/goBack';

const BREAKPOINT_MD = 800; // variables.scss の $bp-md に合わせる

const DiffTool = () => {
  // 入力テキスト
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  // 入力欄の折り返し制御（結果パネルには影響しない）
  const [nowrap, setNowrap] = useState(false);

  // レイアウト（左右→上下）の切り替え
  const [isStacked, setIsStacked] = useState(false);
  useEffect(() => {
    const onResize = () => setIsStacked(window.innerWidth <= BREAKPOINT_MD);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // 差分行（del+ins→rep に畳み込み前/後）
  const rawLines: DiffLine[] = useMemo(
    () => diffText(left, right),
    [left, right]
  );
  const lines: DiffLine[] = useMemo(
    () => coalesceReplace(rawLines),
    [rawLines]
  );

  // 完全一致判定
  const isEqual = useMemo(() => left === right, [left, right]);

  const leftLabel = isStacked ? '上' : '左';
  const rightLabel = isStacked ? '下' : '右';
  const leftResultLabel = isStacked ? '上の結果' : '左の結果';
  const rightResultLabel = isStacked ? '下の結果' : '右の結果';

  // --- 構造化データ（JSON-LD）: SoftwareApplication として宣言 ---
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '差分比較ツール',
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
      {/* ▼ SEO設定（React 19 ではここに書けば <head> に集約されます） ▼ */}
      <title>差分比較ツール｜テキストの違いを可視化（無料・）</title>
      <meta
        name="description"
        content="テキストの差分を比較して、追加・削除・置換を色分け表示します。ブラウザだけで動作する無料の差分比較ツール。コピペで即比較、インストール不要。"
      />
      <meta
        name="keywords"
        content="差分比較, diff, テキスト比較, 追加削除, 置換, 無料, , デベロッパーツール"
      />
      {/* 必要であれば canonical を設定（配信URLが確定してから有効化）*/}
      <link rel="canonical" href="https://takato-work.com/tools/diff-tool" />
      <meta
        property="og:title"
        content="差分比較ツール｜テキストの違いを可視化"
      />
      <meta
        property="og:description"
        content="テキストの差分を比較して色分け表示。無料・・インストール不要。"
      />
      <meta property="og:type" content="website" />
      {/* JSON-LD は文字列で埋め込む */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ▲ SEO設定ここまで ▲ */}

      <Title titleText="差分比較" titleClass="title" />

      <div className="diff-panels">
        <div className="panel">
          <div className="panel-title">{leftLabel}</div>
          <TextArea
            id="left"
            name="left"
            rows={14}
            placeholder="テキストを入力してください。"
            value={left}
            onChange={setLeft}
            className={nowrap ? 'nowrap' : undefined}
          />
        </div>

        <div className="panel">
          <div className="panel-title">{rightLabel}</div>
          <TextArea
            id="right"
            name="right"
            rows={14}
            placeholder="テキストを入力してください。"
            value={right}
            onChange={setRight}
            className={nowrap ? 'nowrap' : undefined}
          />
        </div>
      </div>

      <div className="diff-options">
        <TextReplaceOptions
          id="opt-nowrap"
          name="opt-nowrap"
          spanTitle="入力の折り返しなし（横スクロール）"
          textType="checkbox"
          checked={nowrap}
          onChange={setNowrap}
        />
      </div>

      <Title titleText="結果" titleClass="sub-title" />

      {isEqual ? (
        <div className="diff-equal">
          <div className="equal-badge">完全一致</div>
          <p className="equal-note">
            左右（{leftLabel} / {rightLabel}）のテキストは同一です。
          </p>
        </div>
      ) : (
        <div className="diff-results">
          {/* 結果パネルは常に横スクロール可能（入力の nowrap 設定は無関係） */}
          <div className="result">
            <div className="result-title">{leftResultLabel}</div>
            {lines.map((ln, idx) => (
              <div key={`L${idx}`} className="result-line">
                {ln.left.map((p, i) => (
                  <span key={i} className={`piece ${cls(p.type)}`}>
                    {renderText(p.text)}
                  </span>
                ))}
              </div>
            ))}
          </div>

          <div className="result">
            <div className="result-title">{rightResultLabel}</div>
            {lines.map((ln, idx) => (
              <div key={`R${idx}`} className="result-line">
                {ln.right.map((p, i) => (
                  <span key={i} className={`piece ${cls(p.type)}`}>
                    {renderText(p.text)}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <Bottom
        buttonText="戻る"
        buttonClass="button-back"
        onClick={() => goBack('/tools/#/')}
      />
    </div>
  );
};

export default DiffTool;

// 差分表示用のクラス名変換
function cls(t: 'equal' | 'insert' | 'delete' | 'replace') {
  switch (t) {
    case 'insert':
      return 'ins';
    case 'delete':
      return 'del';
    case 'replace':
      return 'rep';
    default:
      return 'eq';
  }
}

// 空文字の可視化（·）と1文字ずつの描画
function renderText(s: string) {
  if (s === '') return <span className="ghost">·</span>;
  return s.split('').map((c, i) => <span key={i}>{c}</span>);
}

// delete+insert を replace に畳み込む
function coalesceReplace(lines: DiffLine[]): DiffLine[] {
  return lines.map(ln => {
    const L = ln.left;
    const R = ln.right;

    const outL: typeof L = [];
    const outR: typeof R = [];

    let i = 0,
      j = 0;
    while (i < L.length || j < R.length) {
      const l = L[i];
      const r = R[j];

      if (l && r && l.type === 'delete' && r.type === 'insert') {
        outL.push({ type: 'replace', text: l.text });
        outR.push({ type: 'replace', text: r.text });
        i++;
        j++;
        continue;
      }
      if (l) {
        outL.push(l);
        i++;
      }
      if (r) {
        outR.push(r);
        j++;
      }
    }
    return { left: outL, right: outR };
  });
}
