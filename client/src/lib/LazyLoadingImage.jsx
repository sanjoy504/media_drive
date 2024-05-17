import { useEffect, useRef, useState } from 'react';
import defaultPlaceholder from '../assets/images/media-cloud.png';

const LazyLoadingImage = ({ className, placeholderSrc = defaultPlaceholder, actualSrc = defaultPlaceholder, alt="upload images", ...props }) => {

  const [isIntersecting, setIsIntersecting] = useState(false);
  const imageRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (imageRef.current) {
            observer.unobserve(imageRef.current);
          }
        }
      });
    });

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, []);

  return (
    <img
      ref={imageRef}
      className={className}
      src={isIntersecting ? actualSrc : placeholderSrc}
      alt={alt}
      {...props}
    />
  );
};

export default LazyLoadingImage;
