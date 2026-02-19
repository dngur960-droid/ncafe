import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8029";
    console.log(`Using backend URL: ${backendUrl}`);

    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/:path*",
          destination: `${backendUrl}/:path*`,
        },
        {
          source: "/images/:path*",
          destination: `${backendUrl}/:path*`,
        },
      ];
    }
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
      {
        source: "/images/:path*",
        destination: `${backendUrl}/:path*`,
      }
    ];
  },
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
