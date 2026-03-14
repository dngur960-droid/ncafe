import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // rewrites 없음 — 모든 /api 요청은 Catch-all API Route가 처리
  images: {
    unoptimized: true, // Docker 환경에서 최적화 비활성화 (이미지 프록시 전용)
    remotePatterns: [
      {
        protocol: "http",
        hostname: "backend", // Docker 컨테이너 이름
        port: "8029",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        // ✅ /images/** 요청을 BFF API(/api/images/**)로 리다이렉트
        // 이렇게 하면 런타임 환경변수(API_BASE_URL)를 통해 프록시 대상이 결정됨
        source: '/images/:path*',
        destination: '/api/images/:path*',
      },
    ];
  },
};

export default nextConfig;
