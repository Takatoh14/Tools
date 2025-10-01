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
  return (
    <div className="top">
      <Title titleText="トップページ" titleClass="title" />
      <div className="cards">
        {cards.map(c => (
          <Card key={c.to} title={c.title} to={c.to} />
        ))}
      </div>
    </div>
  );
};
export default Home;
