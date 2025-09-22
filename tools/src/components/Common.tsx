import '../styles/common.scss';

import type { CardProps, TitleProps } from '../types/type';

import { Link } from 'react-router-dom';

const Title = ({ title, titleName }: TitleProps) => {
  return <h2 className={title}>{titleName}</h2>;
};

export { Title };

const Cards = ({ title, url }: CardProps) => {
  return (
    <Link to={url ? `/${url}` : '/'} className="link-style">
      <div className="cards">
        <h3 className="__cards-title">{title}</h3>
      </div>
    </Link>
  );
};

export { Cards };
