import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isGitHubPages ? '/interactive-map-site' : '',
  assetPrefix: isGitHubPages ? '/interactive-map-site' : '',
};

export default nextConfig;
