// src/pages/Home.tsx
// トップページ（SEO設定込み）

import '../styles/Home.scss';

import { Card, Title } from '../components/Common';

const Home = () => {
  const cards = [
    { title: 'データ置換', to: '/tools/data-replace' },
    { title: 'JSON整形', to: '/tools/json-format' },
    { title: 'JSON作成', to: '/tools/json-create' },
    { title: 'JSON変換', to: '/tools/json-convert' },
    { title: 'データ差分比較', to: '/tools/diff-tool' },
  ];

  // 構造化データ（トップページ用）
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'データ変換ツール集',
    url: 'https://takato-work.com/tools',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://takato-work.com/tools?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div className="top">
      {/* ▼ SEO設定 ▼ */}
      <title>データ変換ツール集｜JSON整形・変換・差分比較・置換</title>
      <meta
        name="description"
        content="無料で使えるのデータ変換ツール集。JSON整形・JSON作成・CSV⇄JSON変換・テキスト置換・差分比較など、ブラウザだけで簡単に利用できます。"
      />
      <meta
        name="keywords"
        content="データ変換,JSON整形,CSV変換,テキスト置換,差分比較,無料,ツール"
      />
      <meta property="og:title" content="データ変換ツール集" />
      <meta
        property="og:description"
        content="JSON整形・変換・差分比較・テキスト置換などをまとめた無料ツール集。"
      />
      <meta property="og:type" content="website" />
      {/* canonical は本番URLで有効化 */}
      <link rel="canonical" href="https://takato-work.com/tools" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ▲ SEO設定ここまで ▲ */}

      <Title titleText="ツール一覧" titleClass="title" />
      <div className="cards">
        {cards.map(c => (
          <Card key={c.to} title={c.title} to={c.to} />
        ))}
      </div>
    </div>
  );
};

export default Home;
