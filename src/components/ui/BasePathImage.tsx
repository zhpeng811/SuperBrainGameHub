import { default as NextImage, ImageProps } from 'next/image';
import { withBasePath } from '@/utils/path';

/**
 * A wrapper around Next.js Image component that automatically adds basePath to src
 * 
 * For images, we still need to use withBasePath since Next.js Image doesn't
 * automatically handle basePath for image src attributes
 */
export default function BasePathImage({
  src,
  ...props
}: Omit<ImageProps, 'src'> & { src: string }) {
  // Process image URL with basePath only for local images
  const processedSrc = typeof src === 'string' && !src.startsWith('http') 
    ? withBasePath(src) 
    : src;
  
  return <NextImage src={processedSrc} {...props} />;
} 