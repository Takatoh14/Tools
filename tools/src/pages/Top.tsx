import '../styles/top.scss';

import { Cards, Title } from '../components/Common';

import { tools } from '../data/objects';


const Top = () => {
  return (
    <div className="top">
      <div className="title">
        <Title titleName="ツール一覧" title="__title" />
      </div>
      <div className="card">
        {tools.map(tool => (
          <Cards key={tool.url} title={tool.title} url={tool.url} />
        ))}
      </div>
    </div>
  );
};

export default Top;
