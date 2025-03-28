import type { NextConfig } from "next";

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

export default nextConfig;
