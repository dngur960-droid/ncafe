import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // rewrites 없음 — 모든 /api 요청은 Catch-all API Route가 처리
  images: {
    unoptimized: true, // 로컬 개발용
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8029",
      },
      {
        protocol: "http",
        hostname: "backend",
        port: "8029",
      },
    ],
  },
};

export default nextConfig;
