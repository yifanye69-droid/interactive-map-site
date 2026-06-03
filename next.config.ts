import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/interactive-map-site',
  assetPrefix: '/interactive-map-site',
  trailingSlash: true,
};

export default nextConfig;
