import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/SuperBrainGameHub' : '',
  images: {
    unoptimized: true,
    path: process.env.NODE_ENV === 'production' ? '/SuperBrainGameHub/_next/image' : '/_next/image',
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/SuperBrainGameHub' : '',
};

export default withNextIntl(nextConfig);
