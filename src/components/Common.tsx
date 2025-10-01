import '../styles/style.scss';
import '../styles/common.scss';

import type { CardProps, TitleProps } from '../types/common';

import { Link } from 'react-router-dom';

//タイトルコンポーネント
const Title = ({ titleText, titleClass }: TitleProps) => {
  return <h1 className={titleClass}>{titleText}</h1>;
};

const Card = ({ title, to }: CardProps) => {
  return (
    <Link to={to} className="card">
      <div className="card-title">{title}</div>
    </Link>
  );
};

export { Title, Card };
