/* eslint-disable jsx-a11y/alt-text */
"use client";

import Image from "next/image";
import { type FunctionComponent, useEffect, useState } from "react";

const ImageFallback: FunctionComponent<{
  className?: string;
  src: string;
  alt: string;
  fallback?: string;
  width: number;
  height: number;
}> = (props) => {
  const { src, fallback, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      {...rest}
      src={imgSrc}
      onError={fallback ? () => {
        setImgSrc(fallback);
      } : undefined}
    />
  );
};

export default ImageFallback;
