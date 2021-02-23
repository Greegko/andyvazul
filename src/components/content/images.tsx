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
  const [numberOfImages, setNumberOfImages] = React.useState(() => getNumberOfImages());

  React.useEffect(() => {
    const cb = () => setNumberOfImages(getNumberOfImages());
    window.addEventListener('resize', cb);
    return () => window.removeEventListener('resize', cb);
  }, []);

  if (numberOfImages === 1) {
    return (
      <div className="image-grid">
        {images.map((image, i) => <ImageDisplay key={i} image={image} />)}
      </div>
    );
  }

  const imageChunks = chunks(images, numberOfImages);

  return (
    <div className="image-grid">
      {imageChunks.map((images, i) => <ImagesWithRowDisplay key={i} images={images} />)}
    </div>
  );
}

const ImagesWithRowDisplay = ({ images }: { images: Image[] }) => {
  const [activeImage, setActiveImage] = React.useState<number>(null);

  return (
    <>
      {images.map((x, index) => <ImageDisplay key={x.src} image={x} onClick={() => setActiveImage(prev => prev === index ? null : index)} />)}
      {activeImage !== null && <ImageRowDisplay image={images[activeImage]} />}
    </>
  );
}

const ImageRowDisplay = ({ image }: { image: Image }) => (
  <div className="image-row">
    {image &&
      <div className="image">
        <img src={image.src} alt={image.alt} />
      </div>
    }
  </div>
)

const ImageDisplay = ({ image, onClick }: { image: Image, onClick?: () => void }) => (
  <div className={"image-wrapper" + (image.group || image.title ? " image-wrapper-with-caption" : "")} onClick={onClick} >
    <div className="image">
      {image.link &&
        <Link to={image.link}>
          <img src={image.src} alt={image.alt} />
        </Link>
      }
      {!image.link && <img className={image.group || image.title ? "with-caption" : ""} src={image.src} alt={image.alt || image.title} />}
    </div>
    <div className="caption">
      {image.group && <div className="group">{image.group}</div>}
      {image.title && <div className="title">{image.title}</div>}
    </div>
  </div >
);


function chunks(array, size) {
  return Array.apply(0, { length: Math.ceil(array.length / size) }).map((_, index) => array.slice(index * size, (index + 1) * size))
}

function getNumberOfImages() {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 992 ? 1 : (window.innerWidth < 1200 ? 2 : 3);
  } else {
    return 1;
  }
}