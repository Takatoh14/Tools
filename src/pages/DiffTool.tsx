// src/pages/DiffTool.tsx
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
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [nowrap, setNowrap] = useState(false); // 入力欄のみ適用

  // レイアウト（左右→上下）の切り替え
  const [isStacked, setIsStacked] = useState(false);
  useEffect(() => {
    const onResize = () => setIsStacked(window.innerWidth <= BREAKPOINT_MD);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // 差分（del+ins→rep に畳み込み済み）
  const rawLines: DiffLine[] = useMemo(
    () => diffText(left, right),
    [left, right]
  );
  const lines: DiffLine[] = useMemo(
    () => coalesceReplace(rawLines),
    [rawLines]
  );

  // 完全一致？
  const isEqual = useMemo(() => left === right, [left, right]);

  const leftLabel = isStacked ? '上' : '左';
  const rightLabel = isStacked ? '下' : '右';
  const leftResultLabel = isStacked ? '上の結果' : '左の結果';
  const rightResultLabel = isStacked ? '下の結果' : '右の結果';

  return (
    <div className="diff">
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

function renderText(s: string) {
  if (s === '') return <span className="ghost">·</span>;
  return s.split('').map((c, i) => <span key={i}>{c}</span>);
}

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
