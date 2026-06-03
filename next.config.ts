import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // @ts-ignore - allowedDevOrigins is experimental but needed for mobile access
  experimental: {
    allowedDevOrigins: ["172.17.108.253", "172.20.10.2", "172.17.1.109"],
  },
};

export default nextConfig;
