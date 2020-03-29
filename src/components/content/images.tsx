import * as React from 'react';
import { Link } from 'gatsby';

export interface Image {
  src: string;
  alt: string;
  link?: string;
  group?: string;
  title?: string;
}

import './images.scss';
export const Images = ({ images }: { images: Image[] }) => {
  return <div className="image-grid">{images.map(x => <ImageDisplay key={x.src} {...x} />)}</div>;
}

const ImageDisplay = (image: Image) => (
  <div className={"image-wrapper" + (image.group || image.title ? " with-caption" : "")}>
    {image.link &&
      <Link to={image.link}>
        <img src={image.src} alt={image.alt} />
      </Link>
    }
    {!image.link && <img className={image.group || image.title ? "with-caption" : ""} src={image.src} alt={image.alt || image.title} />}
    {image.group && <div className="group">{image.group}</div>}
    {image.title && <div className="title">{image.title}</div>}
  </div >
);
