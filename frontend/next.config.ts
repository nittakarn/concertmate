import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.qrserver.com" },
      { protocol: "https", hostname: "www.thaiticketmajor.com" },
      { protocol: "https", hostname: "*.thaiticketmajor.com" },
    ],
  },
};

export default nextConfig;
