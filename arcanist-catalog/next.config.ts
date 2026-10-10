import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  // Writes /en/ as en/index.html, which static hosting serves without extra rewrites
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
