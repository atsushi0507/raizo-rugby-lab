import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/*': ['./data/**/*'],
  },
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        // 開発・執筆中記事のプレースホルダー画像用
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },
};

export default nextConfig;
