import { default as NextImage, ImageProps } from 'next/image';
import { withBasePath } from '@/utils/path';

/**
 * A wrapper around Next.js Image component that automatically adds basePath to src
 */
export default function BasePathImage({
  src,
  ...props
}: Omit<ImageProps, 'src'> & { src: string }) {
  // Process image URL with basePath
  const processedSrc = withBasePath(src);
  
  return <NextImage src={processedSrc} {...props} />;
} 