import { default as NextLink } from 'next/link';
import { withBasePath } from '@/utils/path';
import { ComponentProps, PropsWithChildren } from 'react';

type BasePathLinkProps = PropsWithChildren<{
  href: string;
}> & Omit<ComponentProps<typeof NextLink>, 'href'>;

/**
 * A wrapper around Next.js Link component that automatically adds basePath to href
 * for internal links (those that don't start with http)
 */
export default function BasePathLink({
  href,
  children,
  ...props
}: BasePathLinkProps) {
  // Only process internal links (not starting with http/https)
  const processedHref = typeof href === 'string' && !href.startsWith('http') 
    ? withBasePath(href) 
    : href;
  
  return <NextLink href={processedHref} {...props}>{children}</NextLink>;
}