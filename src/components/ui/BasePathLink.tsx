import { default as NextLink } from 'next/link';
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
  // When using Next.js Link, we should NOT manually add the basePath
  // Next.js will handle adding the basePath automatically based on the config
  // This prevents double-prefixing issues with GitHub Pages
  return <NextLink href={href} {...props}>{children}</NextLink>;
}