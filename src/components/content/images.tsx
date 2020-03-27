import * as React from 'react';
import { Link } from 'gatsby';

export interface Image {
  src: string;
  alt: string;
  link?: string;
  group?: string;
  title?: string;
}

import './images.css';
export const Images = ({ images }: { images: Image[] }) => {
  const size = Math.ceil(images.length / 3);
  const rows = [];

  for (let i = 0; i < size; i++) {
    rows.push(<Row key={i}>{images.slice(i * 3, i * 3 + 3).map(x => <ImageDisplay key={x.title} {...x} />)}</Row>);
  }

  return rows;
}

const Row = ({ children }) => (
  <div className="image-row">
    {children}
  </div>
);

const ImageDisplay = (image: Image) => (
  <div className="image-wrapper">
    {image.link &&
      <Link to={image.link}>
        <img className={image.group || image.title ? "with-caption" : ""} src={image.src} alt={image.alt} />
      </Link>
    }
    {!image.link && <img className={image.group || image.title ? "with-caption" : ""} src={image.src} alt={image.alt || image.title} />}
    {image.group && <div className="group">{image.group}</div>}
    {image.title && <div className="title">{image.title}</div>}
  </div>
);
