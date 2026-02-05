import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    localPatterns: [
      {
        pathname: '/assets/**',
      },
    ],
  },
};

export default nextConfig;
